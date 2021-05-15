import mongoose, { Schema, Types } from 'mongoose';

interface Car {
  identificationNumber: string,
  class: string,
  photos: string[]
};

interface DriverAttributes {
  address: string,
  car: Car,
  user: Types.ObjectId
}

interface DriverModel extends mongoose.Model<DriverDocument> {
  build(attrs: DriverAttributes): DriverDocument;
}

interface DriverDocument extends mongoose.Document {
  address: string,
  car: {
    identificationNumber: string,
    class: string,
    photos?: string[]
  },
  user: mongoose.Schema.Types.ObjectId
}

const DriverSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  car: {
    identificationNumber: {
      type: String,
      required: true
    },
    class : {
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
