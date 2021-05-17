import mongoose, { Schema, Types } from 'mongoose';

interface Car {
  registrationNumber: string,
  model: string,
  photos?: string[]
};

interface DriverAttributes {
  rcIdentificationNumber: string,
  residenceAddress: string,
  realResidenceAddress: string,
  car: Car,
  user?: Types.ObjectId
}

interface DriverModel extends mongoose.Model<DriverDocument> {
  build(attrs: DriverAttributes): DriverDocument;
}

interface DriverDocument extends mongoose.Document {
  rcIdentificationNumber: string,
  residenceAddress: string,
  realResidenceAddress: string,
  car: Car,
  user: Types.ObjectId
}

const DriverSchema = new Schema({
  rcIdentificationNumber: {
    type: String,
    required: true,
  },
  residenceAddress: {
    type: String,
    required: true
  },
  realResidenceAddress: {
    type: String,
    required: true
  },
  car: {
    registrationNumber: {
      type: String,
      required: true
    },
    model : {
      type: String,
      enum: ['Berline', 'Crossover', 'Minivan', 'Jeep', 'Limousine'],
      required: true
    },
    photos: [{ 
      type: String
    }],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

DriverSchema.statics.build = (attrs: DriverAttributes) => {
  return new Driver(attrs);
}

const Driver = mongoose.model<DriverDocument, DriverModel>('Driver', DriverSchema);

export { Car, Driver, DriverDocument, DriverAttributes };
