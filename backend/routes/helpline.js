import express from 'express';
import Helpline from '../models/Helpline.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Appwrite format helper
const formatHelpline = (h) => {
  return {
    $id: h._id.toString(),
    FullName: h.FullName,
    Email: h.Email,
    phone: h.phone,
    subject: h.subject,
    message: h.message,
    userId: h.userId,
    $createdAt: h.createdAt
  };
};

// SUBMIT QUERY ROUTE
router.post('/', verifyToken, async (req, res) => {
  try {
    const { FullName, Email, phone, subject, message } = req.body;

    if (!FullName || !Email || !phone || !subject || !message) {
      return res.status(400).json({ error: "Missing required contact details." });
    }

    const helpline = new Helpline({
      FullName,
      Email,
      phone,
      subject,
      message,
      userId: req.user.id
    });

    await helpline.save();
    res.status(201).json(formatHelpline(helpline));
  } catch (error) {
    console.error("Create helpline entry error:", error);
    res.status(500).json({ error: "Failed to submit helpline inquiry." });
  }
});

// FETCH ALL HELPLINE QUERIES (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Helpline.find().sort({ createdAt: -1 });
    res.json(inquiries.map(formatHelpline));
  } catch (error) {
    console.error("Fetch helpline queries error:", error);
    res.status(500).json({ error: "Failed to retrieve helpline logs." });
  }
});

// DELETE HELPLINE QUERY (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const inquiry = await Helpline.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: "Helpline ticket not found." });
    }
    res.json({ message: "Helpline ticket deleted successfully." });
  } catch (error) {
    console.error("Delete helpline ticket error:", error);
    res.status(500).json({ error: "Failed to delete helpline ticket." });
  }
});

export default router;
