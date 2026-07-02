import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import blockchain from '../blockchain.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Appwrite format helper
const formatBooking = (b) => {
  return {
    $id: b._id.toString(),
    vehicleName: b.vehicleName,
    vehicleType: b.vehicleType,
    fuelType: b.fuelType,
    rentPrice: b.rentPrice,
    totalPrice: b.totalPrice,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    location: b.location,
    vehicleId: b.vehicleId,
    cradID: b.cradID,
    month: b.month,
    year: b.year,
    bookingStatus: b.bookingStatus,
    userId: b.userId,
    $createdAt: b.createdAt
  };
};

// CREATE BOOKING ROUTE
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      vehicleName,
      vehicleType,
      fuelType,
      rentPrice,
      totalPrice,
      startDate,
      endDate,
      location,
      vehicleId,
      cradID,
      month,
      year,
      bookingStatus
    } = req.body;

    if (!vehicleName || !totalPrice || !startDate || !endDate || !vehicleId) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    // Build the booking document
    const booking = new Booking({
      vehicleName,
      vehicleType,
      fuelType,
      rentPrice: Number(rentPrice),
      totalPrice: Number(totalPrice),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      vehicleId,
      cradID,
      month,
      year,
      bookingStatus: bookingStatus || 'upcoming',
      userId: req.user.id
    });

    await booking.save();

    // Optionally mark vehicle status as rented
    if (mongoose.Types.ObjectId.isValid(vehicleId)) {
      try {
        await Vehicle.findByIdAndUpdate(vehicleId, { status: 'rented' });
      } catch (vehicleErr) {
        console.error("Failed to mark vehicle as rented:", vehicleErr);
      }
    }

    // 🔒 Log rental agreement on the Blockchain
    const blockchainLog = {
      action: "VEHICLE_BOOKING",
      bookingId: booking._id.toString(),
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName,
      renterId: req.user.id,
      renterEmail: req.user.email,
      totalPrice: booking.totalPrice,
      startDate: booking.startDate,
      endDate: booking.endDate,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.status(201).json(formatBooking(booking));
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: `Failed to create booking reservation: ${error.message}` });
  }
});

// FETCH ALL BOOKINGS (Filtered by owner/admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    let bookings;
    // Admins can see all bookings, regular users can only see their own
    if (req.user.isAdmin) {
      bookings = await Booking.find();
    } else {
      bookings = await Booking.find({ userId: req.user.id });
    }
    res.json(bookings.map(formatBooking));
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

// GET BOOKING BY ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Verify ownership
    if (booking.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Security alert: Access denied." });
    }

    res.json(formatBooking(booking));
  } catch (error) {
    console.error("Fetch booking by ID error:", error);
    res.status(500).json({ error: "Failed to fetch booking details." });
  }
});

// DELETE/CANCEL BOOKING
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    // Verify ownership or admin privileges
    if (booking.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Security alert: Unauthorized cancellation attempt." });
    }

    // Revert vehicle status back to active
    await Vehicle.findByIdAndUpdate(booking.vehicleId, { status: 'active' });

    await Booking.findByIdAndDelete(req.params.id);

    // 🔒 Log cancellation on the Blockchain
    const blockchainLog = {
      action: "BOOKING_CANCELLATION",
      bookingId: booking._id.toString(),
      vehicleId: booking.vehicleId,
      cancellerId: req.user.id,
      cancellerEmail: req.user.email,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.json({ message: "Booking cancelled successfully." });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking." });
  }
});

export default router;
