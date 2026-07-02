import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Vehicle from '../models/Vehicle.js';
import blockchain from '../blockchain.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Cybersecurity asset check: validate file type (only allow standard web images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Security alert: Only image files are permitted."));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Appwrite format helper
const formatVehicle = (v) => {
  return {
    $id: v._id.toString(),
    vehicleName: v.vehicleName,
    vehicleType: v.vehicleType,
    fuelType: v.fuelType,
    range: v.range,
    mileage: v.mileage,
    seats: v.seats,
    luggageCapacity: v.luggageCapacity,
    rentPrice: v.rentPrice,
    airConditioning: v.airConditioning,
    gpsNavigation: v.gpsNavigation,
    bluetooth: v.bluetooth,
    sunroof: v.sunroof,
    transmissionType: v.transmissionType,
    numberOfDoors: v.numberOfDoors,
    cc: v.cc,
    abs: v.abs,
    topBox: v.topBox,
    conditions: v.conditions,
    rating: v.rating,
    imageId: v.imageId,
    userId: v.userId,
    status: v.status,
    isBike: v.isBike,
    $createdAt: v.createdAt
  };
};

// IMAGE UPLOAD ROUTE
router.post('/upload-image', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }
    // Return filename as the unique identifier (mimicking Appwrite imageId)
    res.status(201).json({ $id: req.file.filename, fileId: req.file.filename });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

// CREATE CAR OR BIKE ROUTE
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      vehicleName,
      vehicleType,
      fuelType,
      range,
      mileage,
      seats,
      luggageCapacity,
      rentPrice,
      airConditioning,
      gpsNavigation,
      bluetooth,
      sunroof,
      transmissionType,
      numberOfDoors,
      cc,
      abs,
      topBox,
      conditions,
      rating,
      imageId,
      isBike,
      status
    } = req.body;

    if (!vehicleName || !rentPrice || !imageId) {
      return res.status(400).json({ error: "Vehicle name, rent price, and image ID are required." });
    }

    const vehicle = new Vehicle({
      vehicleName,
      vehicleType,
      fuelType,
      range,
      mileage,
      seats: seats ? Number(seats) : null,
      luggageCapacity,
      rentPrice: Number(rentPrice),
      airConditioning: airConditioning === true || airConditioning === 'true',
      gpsNavigation: gpsNavigation === true || gpsNavigation === 'true',
      bluetooth: bluetooth === true || bluetooth === 'true',
      sunroof: sunroof === true || sunroof === 'true',
      transmissionType,
      numberOfDoors: numberOfDoors ? Number(numberOfDoors) : null,
      cc: cc ? Number(cc) : null,
      abs: abs === true || abs === 'true',
      topBox: topBox === true || topBox === 'true',
      conditions: conditions || 'Excellent',
      rating: rating ? Number(rating) : 5,
      imageId,
      userId: req.user.id, // Linked to registered uploader
      status: status || 'active',
      isBike: isBike === true || isBike === 'true'
    });

    await vehicle.save();

    // 🔒 Cybersecurity requirement: Immutable Audit logging on the Blockchain
    const blockchainLog = {
      action: "VEHICLE_UPLOAD",
      vehicleId: vehicle._id.toString(),
      vehicleName: vehicle.vehicleName,
      ownerId: req.user.id,
      ownerEmail: req.user.email,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.status(201).json(formatVehicle(vehicle));
  } catch (error) {
    console.error("Create vehicle error:", error);
    res.status(500).json({ error: "Failed to upload vehicle." });
  }
});

// FETCH ALL CARS
router.get('/cars', async (req, res) => {
  try {
    const cars = await Vehicle.find({ isBike: false, status: 'active' });
    res.json(cars.map(formatVehicle));
  } catch (error) {
    console.error("Fetch cars error:", error);
    res.status(500).json({ error: "Failed to fetch cars database." });
  }
});

// FETCH ALL BIKES
router.get('/bikes', async (req, res) => {
  try {
    const bikes = await Vehicle.find({ isBike: true, status: 'active' });
    res.json(bikes.map(formatVehicle));
  } catch (error) {
    console.error("Fetch bikes error:", error);
    res.status(500).json({ error: "Failed to fetch bikes database." });
  }
});

// SEARCH CARS
router.get('/search/cars', async (req, res) => {
  try {
    const query = req.query.q || '';
    const cars = await Vehicle.find({
      isBike: false,
      status: 'active',
      $or: [
        { vehicleName: { $regex: query, $options: 'i' } },
        { vehicleType: { $regex: query, $options: 'i' } },
        { fuelType: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(cars.map(formatVehicle));
  } catch (error) {
    console.error("Search cars error:", error);
    res.status(500).json({ error: "Car search failed." });
  }
});

// SEARCH BIKES
router.get('/search/bikes', async (req, res) => {
  try {
    const query = req.query.q || '';
    const bikes = await Vehicle.find({
      isBike: true,
      status: 'active',
      $or: [
        { vehicleName: { $regex: query, $options: 'i' } },
        { vehicleType: { $regex: query, $options: 'i' } },
        { fuelType: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(bikes.map(formatVehicle));
  } catch (error) {
    console.error("Search bikes error:", error);
    res.status(500).json({ error: "Bike search failed." });
  }
});

// GET VEHICLE BY ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }
    res.json(formatVehicle(vehicle));
  } catch (error) {
    console.error("Fetch vehicle by ID error:", error);
    res.status(500).json({ error: "Failed to fetch vehicle information." });
  }
});

// GET VEHICLES BY USER (fetch user's uploaded vehicle list)
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.params.userId });
    res.json(vehicles.map(formatVehicle));
  } catch (error) {
    console.error("Fetch vehicles by owner error:", error);
    res.status(500).json({ error: "Failed to fetch your listed vehicles." });
  }
});

// DELETE VEHICLE
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    // Cybersecurity restriction: Allow deletion if caller is Admin or uploader owner
    if (vehicle.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Security alert: You do not have permission to delete this listing." });
    }

    // Delete image file from upload dir if it exists
    if (vehicle.imageId) {
      const imagePath = path.join(uploadDir, vehicle.imageId);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    // Immutable delete log to ledger
    const blockchainLog = {
      action: "VEHICLE_DELETE",
      vehicleId: vehicle._id.toString(),
      vehicleName: vehicle.vehicleName,
      executorId: req.user.id,
      executorEmail: req.user.email,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.json({ message: "Vehicle listing removed successfully." });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ error: "Failed to delete vehicle listing." });
  }
});

// UPDATE VEHICLE DETAILS (including photo and specs)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const {
      vehicleName,
      vehicleType,
      fuelType,
      range,
      mileage,
      seats,
      luggageCapacity,
      rentPrice,
      airConditioning,
      gpsNavigation,
      bluetooth,
      sunroof,
      transmissionType,
      numberOfDoors,
      cc,
      abs,
      topBox,
      conditions,
      rating,
      imageId,
      status
    } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    // Cybersecurity check: Verify ownership or Admin status
    if (vehicle.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Security alert: You do not have permission to modify this listing." });
    }

    // Update fields
    if (vehicleName !== undefined) vehicle.vehicleName = vehicleName;
    if (vehicleType !== undefined) vehicle.vehicleType = vehicleType;
    if (fuelType !== undefined) vehicle.fuelType = fuelType;
    if (range !== undefined) vehicle.range = range;
    if (mileage !== undefined) vehicle.mileage = mileage;
    if (seats !== undefined) vehicle.seats = seats ? Number(seats) : null;
    if (luggageCapacity !== undefined) vehicle.luggageCapacity = luggageCapacity;
    if (rentPrice !== undefined) vehicle.rentPrice = Number(rentPrice);
    if (airConditioning !== undefined) vehicle.airConditioning = airConditioning === true || airConditioning === 'true';
    if (gpsNavigation !== undefined) vehicle.gpsNavigation = gpsNavigation === true || gpsNavigation === 'true';
    if (bluetooth !== undefined) vehicle.bluetooth = bluetooth === true || bluetooth === 'true';
    if (sunroof !== undefined) vehicle.sunroof = sunroof === true || sunroof === 'true';
    if (transmissionType !== undefined) vehicle.transmissionType = transmissionType;
    if (numberOfDoors !== undefined) vehicle.numberOfDoors = numberOfDoors ? Number(numberOfDoors) : null;
    if (cc !== undefined) vehicle.cc = cc ? Number(cc) : null;
    if (abs !== undefined) vehicle.abs = abs === true || abs === 'true';
    if (topBox !== undefined) vehicle.topBox = topBox === true || topBox === 'true';
    if (conditions !== undefined) vehicle.conditions = conditions;
    if (rating !== undefined) vehicle.rating = Number(rating);
    if (imageId !== undefined) vehicle.imageId = imageId;
    if (status !== undefined) vehicle.status = status;

    await vehicle.save();

    // Immutable update log to blockchain
    const blockchainLog = {
      action: "VEHICLE_UPDATE",
      vehicleId: vehicle._id.toString(),
      vehicleName: vehicle.vehicleName,
      executorId: req.user.id,
      executorEmail: req.user.email,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.json(formatVehicle(vehicle));
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({ error: "Failed to update vehicle details." });
  }
});

// TOGGLE VEHICLE STATUS (ON/OFF)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found." });
    }

    // Cybersecurity check: Verify ownership
    if (vehicle.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Security alert: You do not have permission to modify this listing." });
    }

    vehicle.status = status;
    await vehicle.save();

    // Immutable status toggle log to blockchain
    const blockchainLog = {
      action: "VEHICLE_STATUS_CHANGE",
      vehicleId: vehicle._id.toString(),
      vehicleName: vehicle.vehicleName,
      status: status,
      executorId: req.user.id,
      executorEmail: req.user.email,
      timestamp: Date.now()
    };
    await blockchain.addBlock(blockchainLog);

    res.json(formatVehicle(vehicle));
  } catch (error) {
    console.error("Update vehicle status error:", error);
    res.status(500).json({ error: "Failed to update vehicle status." });
  }
});

export default router;
