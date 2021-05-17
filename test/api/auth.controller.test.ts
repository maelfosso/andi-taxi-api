import mongoose from 'mongoose';
import request from 'supertest';
import faker from 'faker';
import app from "../../src/app";
import { User, UserAttributes } from '../../src/models/user.model';
import { UserCode, UserCodeDocument } from '../../src/models/user-code.model';
import { DriverAttributes, Driver } from '../../src/models/driver.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;
const http = request(app);

describe("AUTHENTICATION Testings", () => {
  
  beforeAll(async () => {
    try {
      await mongoose.connect(`${MONGODB_URI}/${MONGODB_DBNAME}_test`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
    } catch (err) {
      console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await UserCode.deleteMany({});
    await mongoose.connection.close();
  });

  describe('SIGN UP CLIENT /api/auth/signup/client', () => {
    
    it ('creates an user', async () => {
      const valid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#########')
      };
      const response = await http.post('/api/auth/signup/client').send(valid);

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('name');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body).toHaveProperty('code');
      expect(response.body["code"]).toHaveLength(4);
    });

    it ('returns 400 if the name user is empty or invalid', async () => {
      const invalid: UserAttributes = {
        name: '',
        phoneNumber: faker.phone.phoneNumber('+#########')
      };
      const response = await http.post('/api/auth/signup/client').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('name');
    });

    it ('returns 400 if the phoneNumber user is invalid', async () => {
      const invalid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber()
      };
      const response = await http.post('/api/auth/signup/client').send(invalid);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
    });

    it ('returns 400 if the phoneNumber user is empty', async () => {
      const invalid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: ''
      };
      const response = await http.post('/api/auth/signup/client').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('phoneNumber');

    });

    it ('returns 400 if phoneNumber already exists', async () => {
      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#########')
      });
      await user.save();

      const invalid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: user.phoneNumber
      };
      const response = await http.post('/api/auth/signup/client').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
    });

  });

  describe('SIGN UP DRIVER /api/auth/signup/driver', () => {
    
    it ('creates a driver', async () => {
      const valid: UserAttributes & DriverAttributes = {
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#########'),
        rcIdentificationNumber: faker.random.alphaNumeric(9),
        residenceAddress: faker.address.streetName(),
        realResidenceAddress: faker.address.streetAddress(),
        car: {
          registrationNumber: faker.random.alphaNumeric(7),
          model: 'Berline'
        }
      };
      const response = await http.post('/api/auth/signup/driver').send(valid);

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('name');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body).toHaveProperty('code');
      expect(response.body["code"]).toHaveLength(4);
    });

    it ('returns 400 if the name user is empty or invalid', async () => {
      const invalid: UserAttributes & DriverAttributes = {
        name: '',
        phoneNumber: '',
        rcIdentificationNumber: faker.random.alphaNumeric(9),
        residenceAddress: '',
        realResidenceAddress: '',
        car: {
          registrationNumber: '',
          model: 'Berline'
        }
      };
      const response = await http.post('/api/auth/signup/driver').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(5);
      expect(response.body.errors[0].field).toBe('name');
    });

    it ('returns 400 if phoneNumber already exists', async () => {
      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#########'),
      });
      await user.save();
      
      const driver = Driver.build({
        rcIdentificationNumber: faker.random.alphaNumeric(9),
        residenceAddress: faker.address.streetName(),
        realResidenceAddress: faker.address.streetAddress(),
        car: {
          registrationNumber: faker.random.alphaNumeric(7),
          model: 'Berline'
        },
        user: user.id
      });

      await driver.save();

      let invalid: UserAttributes & DriverAttributes = {
        name: faker.name.findName(),
        phoneNumber: user.phoneNumber,
        rcIdentificationNumber: faker.random.alphaNumeric(9),
        residenceAddress: faker.address.streetName(),
        realResidenceAddress: faker.address.streetAddress(),
        car: {
          registrationNumber: faker.random.alphaNumeric(7),
          model: 'Berline'
        },
      };
      const response = await http.post('/api/auth/signup/driver').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
    });

  });

  describe('SIGN IN /api/auth/signin', () => {
    afterEach(async () => {
      await User.deleteMany({});
      await UserCode.deleteMany({});
    });

    it ('signs in the user correctly', async () => {
      const valid = {
        phoneNumber: '+8320932',
      }
      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: valid.phoneNumber
      });
      await user.save();
      const response = await http.post('/api/auth/signin').send(valid);

      expect(response.status).toBe(201);
      expect(response.body).not.toHaveProperty('name');
      expect(response.body).toHaveProperty('phoneNumber');
      expect(response.body.phoneNumber).toBe(valid.phoneNumber);
      expect(response.body).toHaveProperty('code');
      expect(response.body.code).toHaveLength(4);
    });

    it ('returns 400 if the user phoneNumber is not correct', async () => {
      const invalid = {
        phoneNumber: faker.phone.phoneNumber()
      }
      const response = await http.post('/api/auth/signin').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it ('returns 400 if the user phoneNumber does not exists', async () => {
      const valid = {
        phoneNumber: '+8320456932',
      }
      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#######')
      });
      await user.save();
      const response = await http.post('/api/auth/signin').send(valid);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toHaveProperty('message');
    });
  });

  describe('SIGN CODE /api/auth/signcode', () => {
    afterEach(async () => {
      await User.deleteMany({});
      await UserCode.deleteMany({});
    });

    it ('returns 400 if the user with that phone number does not exists', async () => {
      const valid = {
        phoneNumber: '+8320932',
        code: '2832'
      }
      const d = new Date();
      d.setSeconds(d.getSeconds() + 30);
      let userCode: UserCodeDocument = UserCode.build({
        code: valid.code,
        phoneNumber: valid.phoneNumber,
        expiredAt: d
      });
      await userCode.save();

      const response = await http.post('/api/auth/signcode').send(valid);

      expect(response.status).toBe(400);
    });

    it ('sign in correctly the user', async () => {
      const valid = {
        phoneNumber: '+8320932',
        code: '2832'
      }

      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: valid.phoneNumber
      });
      await user.save();

      const d = new Date();
      d.setSeconds(d.getSeconds() + 30);
      let userCode: UserCodeDocument = UserCode.build({
        code: valid.code,
        phoneNumber: valid.phoneNumber,
        expiredAt: d
      });
      await userCode.save();

      const response = await http.post('/api/auth/signcode').send(valid);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('phoneNumber');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body).not.toHaveProperty('code');

      userCode = await UserCode.findOne({ phoneNumber: valid.phoneNumber }) as UserCodeDocument ;
      expect(userCode).toBeNull();
    });

    it ('returns 400 if the code does not match', async () => {
      const valid = {
        phoneNumber: '+8320932',
        code: '2832'
      }

      const user = User.build({
        name: faker.name.findName(),
        phoneNumber: valid.phoneNumber
      });
      await user.save();

      const d = new Date();
      d.setSeconds(d.getSeconds() + 30);
      let userCode: UserCodeDocument = UserCode.build({
        code: '4856',
        phoneNumber: valid.phoneNumber,
        expiredAt: d
      });
      await userCode.save();

      const response = await http.post('/api/auth/signcode').send(valid);
      expect(response.status).toBe(400);
    });
  });

});

