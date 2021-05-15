import faker from "faker";
import mongoose from "mongoose";
import { Driver } from "../../src/models/driver.model";
import { UserCode } from "../../src/models/user-code.model";
import { User } from '../../src/models/user.model';

const { MONGODB_URI, MONGODB_DBNAME } = process.env;

describe("Test about Driver model", () => {
  
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

  afterEach(async () => {
    await Driver.deleteMany({});
    await User.deleteMany({});
    await UserCode.deleteMany({});
  });

  it("creates and saves Driver successfully", async () => {
    const data = new Driver({
      rcIdentificationNumber: faker.random.alphaNumeric(9),
      residenceAddress: faker.address.streetName(),
      realResidenceAddress: faker.address.streetAddress(),
      car: {
        registrationNumber: faker.random.alphaNumeric(7),
        class: 'Berline'
      },
      user: new mongoose.Types.ObjectId()
    });

    const saved = await data.save();
    
    expect(saved._id).toBeDefined();
    expect(saved.residenceAddress).toBe(data.residenceAddress);
    expect(saved.user).toBe(data.user);
  });

  it('rejects a Driver if any of the required fields is missing', async () => {
    const invalid = new Driver({
      residenceAddress: '',
      car: '',
      user: ''
    });

    let error = invalid.validateSync();

    expect(error).toBeDefined();
    expect(error?.errors['user']).toBeDefined();
    expect(error?.errors['rcIdentificationNumber']).toBeDefined();
    expect(error?.errors['residenceAddress']).toBeDefined();
    expect(error?.errors['realResidenceAddress']).toBeDefined();
    expect(error?.errors['car.registrationNumber']).toBeDefined();
    expect(error?.errors['car.class']).toBeDefined();

  });
});
