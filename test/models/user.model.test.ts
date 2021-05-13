import mongoose from "mongoose";
import { User } from '../../src/models/user.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;

describe("Test about User model", () => {
  
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

  it ('creates and saves User successfully', async () => {
    const valid = new User({
      name: "John Doe",
      phoneNumber: "+334589231"
    });
    const saved = await valid.save();

    expect(saved._id).toBeDefined();
    expect(saved.name).toBe(valid.name);
    expect(saved.phoneNumber).toBe(valid.phoneNumber);
  });

  it ('rejects an User if any of its fields is empty', async () => {
    let invalid = new User({
      name: '',
      phoneNumber: ''
    });
    let error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['name']).toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();

    invalid = new User({
      name: '',
      phoneNumber: '+334240932'
    });
    error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['name']).toBeDefined();
    expect(error?.errors['phoneNumber']).not.toBeDefined();

    invalid = new User({
      name: 'John Doe',
      phoneNumber: ''
    });
    error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['name']).not.toBeDefined();
    expect(error?.errors['phoneNumber']).toBeDefined();
  });

})