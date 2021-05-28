import mongoose, { Schema } from 'mongoose';

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

const TravelSchema = new Schema({

  from: {
    type: LocationSchema,
    required: true
  },

  to: {
    type: LocationSchema,
    required: true
  },

  createdBy: {
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
    enum: ['Pending', 'Canceled', 'In Progress', 'Done']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },



})
