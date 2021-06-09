import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { BadRequestError } from "../errors/bad-request-error";
import { DatabaseError } from "../errors/database-error";
import { UserCode } from "../models/user-code.model";
import { User, UserAttributes } from "../models/user.model";
import { Car, Driver, DriverAttributes } from "../models/driver.model";
import { UserPayload } from '../models/user-payload';

const { JWT_KEY } = process.env;

function makeCode(length: number) {
  var result           = [];
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(
      characters.charAt(
        Math.floor(Math.random() * charactersLength)
      )
    );
  }
  return result.join('');
}

async function sendSMS(phoneNumber: string, code: string) {
  const response = await axios.get(
    `https://api.mobizon.kz/service/messsage/sendsmsmessage?recipient=${phoneNumber}+&from=text=${code}`,
    { 
      params: {
        api_key: 'kzc70d8798773efeb211f880f8e6df7c78aadd934eab120',
        data: Date.now()
      }
    }
  )

  return response.data;
}

export const signUpClient = async (req: Request, res: Response) => {
  const { name, phoneNumber } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ phoneNumber });
  } catch (err) {
    throw new DatabaseError(`error when fetching the user ${phoneNumber}`);
  }

  if (existingUser) {
    throw new BadRequestError(`Phone number in use`);
  }

  const user = User.build({ name, phoneNumber });
  try {
    await user.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user ${user}: ${err}`);
  }

  const code = makeCode(4);
  const d = new Date();
  d.setSeconds(10)
  const userCode = new UserCode({ code, phoneNumber, expiredAt: d });
  try {
    await userCode.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user code ${userCode}: ${err}`);
  }

  /**
   * ADD THE CODE HERE FOR SENDING CODE BY SMS
   * sendCodeBySMS(userCode.phoneNumber, userCode.code)
   */
  await sendSMS(userCode.phoneNumber, userCode.code);

  return res.status(201).json({ ...userCode.toJSON() });
}

export const signUpDriver = async (req: Request, res: Response) => {
  // const { name, phoneNumber, address, car }
  //   : { name: string; phoneNumber: string; address: string, car: Car } = req.body;
  const { name, phoneNumber,
    rcIdentificationNumber, residenceAddress, realResidenceAddress,
    car
  } : UserAttributes & DriverAttributes = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({ phoneNumber });
  } catch (err) {
    throw new DatabaseError(`error when fetching the user ${phoneNumber}`);
  }

  if (existingUser) {
    throw new BadRequestError(`Phone number in use`);
  }

  let existingDriver;
  try {
    existingDriver = await Driver.findOne({ '$or': [
      { "car.registrationNumber": car.registrationNumber },
      { rcIdentificationNumber },
    ]});
  } catch (err) {
    throw new DatabaseError(`error when fetching the driver ${car.registrationNumber}`);
  }

  if (existingDriver) {
    throw new BadRequestError(`Car or RC Identification Number already in use`);
  }

  const user = User.build({ name, phoneNumber });
  try {
    await user.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user ${user}: ${err}`);
  }

  const driver = Driver.build({ 
    rcIdentificationNumber, 
    residenceAddress, realResidenceAddress,
    car, 
    user: user.id 
  });
  try {
    await driver.save();
  } catch (err) {
    throw new DatabaseError(`error when saving driver ${driver}: ${err}`);
  }

  const code = makeCode(4);
  const d = new Date();
  d.setSeconds(10)
  const userCode = new UserCode({ code, phoneNumber, expiredAt: d });
  try {
    await userCode.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user code ${userCode}: ${err}`);
  }

  /**
   * ADD THE CODE HERE FOR SENDING CODE BY SMS
   * sendCodeBySMS(userCode.phoneNumber, userCode.code)
   */
  await sendSMS(userCode.phoneNumber, userCode.code);

  return res.status(201).json({ ...userCode.toJSON() });
}

export const signIn = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ phoneNumber });
  } catch (err) {
    throw new DatabaseError(`error when fetching the user ${phoneNumber}`);
  }

  if (!existingUser) {
    throw new BadRequestError(`No user with this phone number`);
  }

  try {
    await UserCode.deleteMany({ phoneNumber })
  } catch (err) {
    throw new DatabaseError(`error when deleting the user code`);
  }

  const code = makeCode(4);
  const d = new Date();
  d.setSeconds(d.getSeconds() + 60);
  const userCode = new UserCode({ code, phoneNumber, expiredAt: d });
  try {
    await userCode.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user code ${userCode}`);
  }

  /**
   * ADD THE CODE HERE FOR SENDING CODE BY SMS
   * sendCodeBySMS(userCode.phoneNumber, userCode.code)
   */
  await sendSMS(userCode.phoneNumber, userCode.code);

  return res.status(201).json({ ...userCode.toJSON() });
}

export const signCode = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;
  
  let existingUser;
  try {
    existingUser = await User.findOne({ phoneNumber });
  } catch (err) {
    throw new DatabaseError(`error when fetching the user ${phoneNumber}`);
  }

  if (!existingUser) {
    throw new BadRequestError(`No user with this phone number`);
  }
  
  let existingUserCode;
  try {
    existingUserCode = await UserCode.findOne({ phoneNumber });
  } catch (err) {
    throw new DatabaseError(`error when fetching the user code ${phoneNumber}`);
  }
  
  if (!existingUserCode) {
    throw new BadRequestError(`No user code found`);
  }

  if (existingUserCode.code !== code) {
    throw new BadRequestError(`Code doesn't match`);
  }

  // if (existingUserCode.expiredAt.getTime() < Date.now()) {
  //   console.log('Code has expired ', existingUserCode.expiredAt, new Date());
  //   throw new BadRequestError(`Code has expired`)
  // }

  let user: UserPayload = {
    id: existingUser.id,
    name: existingUser.name,
    phoneNumber
  };

  let driver = null;

  try {
    driver = await Driver.findOne({ user: existingUser.id });
  } catch (err) {
    throw new DatabaseError(`error when fetching driving `);
  }

  const token = jwt.sign(user, JWT_KEY!);

  try {
    await UserCode.findOneAndDelete({ phoneNumber })
  } catch (err) {
    throw new DatabaseError(`error when deleting the user code`);
  }

  const data = {
    user,
    driver: {
      ...driver?.toJSON(),
    },
    token
  };
  console.log('Data ', data);

  return res.status(200).json(data);
} 
