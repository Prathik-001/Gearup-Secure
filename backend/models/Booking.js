import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  rentPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  vehicleId: {
    type: String,
    required: true
  },
  cradID: { // Kept identical spelling to original Appwrite "cradID" to avoid breaking frontend
    type: String,
    required: false
  },
  month: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: false
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
