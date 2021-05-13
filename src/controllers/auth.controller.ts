import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { BadRequestError } from "../errors/bad-request-error";
import { DatabaseError } from "../errors/database-error";
import { UserCode } from "../models/user-code.model";
import { User } from "../models/user.model";

const { JWT_PRIVATE_KEY } = process.env;

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

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
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

  const code = makeCode(4);
  const d = new Date();
  d.setSeconds(d.getSeconds() + 30);
  const userCode = new UserCode({ code, phoneNumber, expiredAt: d });
  try {
    await userCode.save();
  } catch (err) {
    throw new DatabaseError(`error when saving user code ${userCode}`);
  }

  return res.status(201).json({ ...userCode });
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

  if (existingUserCode.expiredAt.getTime() < Date.now()) {
    throw new BadRequestError(`Code has expired`)
  }

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    phoneNumber
  };

  const token = jwt.sign(user, JWT_PRIVATE_KEY!);

  try {
    await existingUserCode.remove();
  } catch (err) {
    throw new DatabaseError(`error when deleting the user code`);
  }

  return res.status(200).json({
    user,
    token
  });
} 
