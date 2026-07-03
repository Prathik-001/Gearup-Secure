import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  range: {
    type: String,
    default: ''
  },
  mileage: {
    type: String,
    default: ''
  },
  // Car specifics
  seats: {
    type: Number,
    default: null
  },
  luggageCapacity: {
    type: String,
    default: ''
  },
  airConditioning: {
    type: Boolean,
    default: false
  },
  bluetooth: {
    type: Boolean,
    default: false
  },
  sunroof: {
    type: Boolean,
    default: false
  },
  transmissionType: {
    type: String,
    default: ''
  },
  numberOfDoors: {
    type: Number,
    default: null
  },
  // Bike specifics
  cc: {
    type: Number,
    default: null
  },
  abs: {
    type: Boolean,
    default: false
  },
  topBox: {
    type: Boolean,
    default: false
  },
  // Common details
  rentPrice: {
    type: Number,
    required: true
  },
  gpsNavigation: {
    type: Boolean,
    default: false
  },
  conditions: {
    type: String,
    default: 'Excellent'
  },
  rating: {
    type: Number,
    default: 5
  },
  imageId: {
    type: String,
    required: true
  },
  userId: {
    type: String, // String corresponding to owner ID (User ObjectId or standard string)
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'rented'],
    default: 'active'
  },
  isBike: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

import { getModel } from './dbSelector.js';
const Vehicle = getModel('Vehicle', vehicleSchema);
export default Vehicle;
