import rateLimit from 'express-rate-limit';

// General API rate limiter (protects against DDoS)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict login/register rate limiter (prevents brute force attacks)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 auth attempts per windowMs
  message: {
    error: "Too many authentication attempts. Please try again after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// XSS Sanitization Middleware
// Recursively sanitizes request body/query/params to strip HTML tags and prevent JavaScript injection
const cleanHTML = (input) => {
  if (typeof input !== 'string') return input;
  
  // Basic XSS cleanup: strip tags and script blocks
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Strip script tags
    .replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
    .trim();
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          // Recursive sanitization for nested objects
          req.body[key] = JSON.parse(JSON.stringify(req.body[key]), (k, v) => {
            return typeof v === 'string' ? cleanHTML(v) : v;
          });
        } else {
          req.body[key] = cleanHTML(req.body[key]);
        }
      }
    }
  }

  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = cleanHTML(req.query[key]);
      }
    }
  }

  next();
};

// Input validation helper schemas
export const validateRegistration = (req, res, next) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name || !phone) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  next();
};
