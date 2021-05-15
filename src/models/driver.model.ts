import mongoose, { Schema, Types } from 'mongoose';

interface DriverAttributes {
  address: string,
  auto: {
    identificationNumber: string,
    class: string,
    photos: string[]
  },
  user: Types.ObjectId
}

interface DriverModel extends mongoose.Model<DriverDocument> {
  build(attrs: DriverAttributes): DriverDocument;
}

interface DriverDocument extends mongoose.Document {
  address: string,
  auto: {
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
  auto: {
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

export { Driver, DriverDocument, DriverAttributes };
