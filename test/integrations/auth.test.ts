import mongoose from 'mongoose';
import request from 'supertest';
import faker from 'faker';
import app from "../../src/app";
import { User, UserAttributes } from '../../src/models/user.model';
import { UserCode, UserCodeAttributes, UserCodeDocument } from '../../src/models/user-code.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;
const http = request(app);

describe("INTEGRATION TESTING AUTHENTICATION", () => {
  
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

  it('works correctly', async () => {
    const validUser:UserAttributes = {
      name: faker.name.firstName(),
      phoneNumber: faker.phone.phoneNumber('+########')
    }

    let response = await http.post('/api/auth/signup/client').send(validUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('code');
    expect(response.body.code).toHaveLength(4);
    expect(response.body).toHaveProperty('phoneNumber');

    const user = await User.findOne({ phoneNumber: validUser.phoneNumber });
    expect(user).toBeDefined();
    expect(user?.name).toBe(validUser.name);

    const validCode = {
      code: response.body.code,
      phoneNumber: validUser.phoneNumber
    }

    response = await http.post('/api/auth/signcode').send(validCode);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');

    const userCode = await UserCode.findOne({ phoneNumber: validUser.phoneNumber });
    expect(userCode).toBeNull();
  })
});