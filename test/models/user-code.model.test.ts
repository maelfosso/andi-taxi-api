import mongoose from "mongoose";
import { UserCode } from '../../src/models/user-code.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;

describe("Test about UserCode model", () => {
  
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
    await mongoose.connection.close();
  });

  it ('creates and saves UserCode successfully', async () => {
    const valid = new UserCode({
      code: "1452",
      phoneNumber: "+334589231",
      expiredAt: new Date()
    });
    const saved = await valid.save();

    expect(saved._id).toBeDefined();
    expect(saved.code).toBe(valid.code);
    expect(saved.phoneNumber).toBe(valid.phoneNumber);
    expect(saved.expiredAt).toBe(valid.expiredAt);
  });

  it ('rejects an UserCode if any of its fields is empty', async () => {
    let invalid = new UserCode({
      code: '',
      phoneNumber: ''
    });
    let error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['code']).toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();

    invalid = new UserCode({
      code: '',
      phoneNumber: '+334240932'
    });
    error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['code']).toBeDefined();
    expect(error?.errors['phoneNumber']).not.toBeDefined();

    invalid = new UserCode({
      code: '4426',
      phoneNumber: ''
    });
    error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['code']).not.toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();
  });

  it ('rejects an UserCode if any of its fields does not match its pattern', async () => {
    let invalid = new UserCode({
      code: 'ed1a',
      phoneNumber: 'awef451ds'
    });
    let error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['code']).toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();

    invalid = new UserCode({
      code: '4125',
      phoneNumber: 'x4ew11fwe'
    });
    error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();
  });

});

