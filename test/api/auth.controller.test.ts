import mongoose from 'mongoose';
import request from 'supertest';
import faker from 'faker';
import app from "../../src/app";
import { User, UserAttributes } from '../../src/models/user.model';
import { UserCode } from '../../src/models/user-code.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;
const http = request(app);

describe("Test about AUTH", () => {
  
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

  describe('SIGN UP', () => {
    
    it ('creates an user', async () => {
      const valid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: faker.phone.phoneNumber('+#########')
      };
      const response = await http.post('/api/auth/signup').send(valid);

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
      const response = await http.post('/api/auth/signup').send(invalid);

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
      const response = await http.post('/api/auth/signup').send(invalid);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
    });

    it ('returns 400 if the phoneNumber user is empty', async () => {
      const invalid: UserAttributes = {
        name: faker.name.findName(),
        phoneNumber: ''
      };
      const response = await http.post('/api/auth/signup').send(invalid);

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
      const response = await http.post('/api/auth/signup').send(invalid);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toHaveLength(1);
    });

  })

});

