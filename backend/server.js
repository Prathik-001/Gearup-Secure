import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import Middlewares
import { apiLimiter, sanitizeInput } from './middleware/security.js';

// Import Routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import bookingRoutes from './routes/bookings.js';
import helplineRoutes from './routes/helpline.js';
import blockchainRoutes from './routes/blockchain.js';

// Setup environment configs
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Render reverse proxy rate-limiting accuracy
app.set('trust proxy', 1);

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 Cybersecurity Layer: Set Secure HTTP Headers using Helmet
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading uploaded images from frontend origin
}));

// Setup CORS with specific whitelist (supports localhost React dev server & deployed Vercel frontends)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://gearup-secure.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy block: Origin not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root health check endpoints (placed above rate limiter to avoid 429 health check failures on Render/Vercel)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});
app.get('/healthz', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// 🔒 Cybersecurity Layer: Rate Limiters & Body Parsers with strict size limitations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(apiLimiter);

// 🔒 Cybersecurity Layer: Clean inputs of script injections (XSS Sanitizer)
app.use(sanitizeInput);

// Static uploads serving (serves vehicle image files securely)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database.'))
  .catch((err) => console.error('MongoDB database connection failed:', err));

// Mount REST Controllers
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/helpline', helplineRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Serve uploaded assets through a custom security proxy route (optional, but convenient)
app.get('/api/files/preview/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(__dirname, 'uploads', fileId);
  res.sendFile(filePath);
});
app.get('/api/files/view/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(__dirname, 'uploads', fileId);
  res.sendFile(filePath);
});

// Global Error Handler - Prevents system stack-trace leakage to clients
app.use((err, req, res, next) => {
  console.error("Unhandled Security/Server Error:", err.stack);
  res.status(500).json({ 
    error: "A secure server error occurred. Please contact the security administrator." 
  });
});

app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
