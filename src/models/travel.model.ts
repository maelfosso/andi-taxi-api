import mongoose, { Schema, Types } from 'mongoose';

interface Location {
  longitude: number;
  latitude: number;
};

const LocationSchema = new Schema({
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }
});

interface TravelAttributes {
  from: Location;
  to: Location;
  cost: number;
  distance: number;
  carType: string;
  status: string;
  orderedBy: Types.ObjectId;
  drivedBy?: Types.ObjectId;
}

interface TravelModel extends mongoose.Model<TravelDocument> {
  build(attrs: TravelAttributes): TravelDocument;
}

interface TravelDocument extends mongoose.Document {
  from: Location;
  to: Location;
  cost: number;
  distance: number;
  carType: string;
  status: string;
  orderedBy: Types.ObjectId;
  drivedBy?: Types.ObjectId;
}

const TravelSchema = new Schema({

  from: {
    type: LocationSchema,
    required: true
  },

  to: {
    type: LocationSchema,
    required: true
  },

  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  drivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },

  cost: {
    type: Number,
    required: true,
  },

  distance: {
    type: Number,
    required: true
  },

  carType: {
    type: String,
    enum: ["Standard", "Vip", "Scooter", "Access", "Baby", "Electric", "Exec", "Van"],
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Canceled', 'Took', 'In Progress', 'Done'],
    default: 'Pending'
  },

  tookAt: {
    type: Date
  },

  startedAt: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

}, { strict: false });

const Travel = mongoose.model<TravelDocument, TravelModel>('Travel', TravelSchema);

TravelSchema.statics.build = (attrs: TravelAttributes) => {
  return new Travel(attrs);
}

export { Location, Travel, TravelDocument, TravelAttributes };
