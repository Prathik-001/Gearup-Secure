import express from 'express';
import BlockModel from '../models/Block.js';
import blockchain from '../blockchain.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET ALL BLOCKS IN THE LEDGER
router.get('/blocks', verifyToken, async (req, res) => {
  try {
    const blocks = await BlockModel.find().sort({ index: 1 });
    res.json(blocks);
  } catch (error) {
    console.error("Fetch blocks error:", error);
    res.status(500).json({ error: "Failed to load blockchain ledger." });
  }
});

// TRIGGER REAL-TIME CHAIN INTEGRITY AUDIT
router.get('/validate', verifyToken, async (req, res) => {
  try {
    const validationResult = await blockchain.validateChain();
    res.json(validationResult);
  } catch (error) {
    console.error("Validate blockchain error:", error);
    res.status(500).json({ error: "Failed to audit blockchain ledger integrity." });
  }
});

export default router;
