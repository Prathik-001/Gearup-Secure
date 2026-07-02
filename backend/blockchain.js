import crypto from 'crypto';
import BlockModel from './models/Block.js';

export class Blockchain {
  constructor(difficulty = 2) {
    this.difficulty = difficulty;
  }

  // Calculate SHA-256 hash of a block
  calculateHash(index, previousHash, timestamp, data, nonce) {
    const dataString = JSON.stringify(data);
    return crypto
      .createHash('sha256')
      .update(index + previousHash + timestamp + dataString + nonce)
      .digest('hex');
  }

  // Generate the genesis block (first block on the chain)
  async createGenesisBlock() {
    const genesisData = {
      message: "GearUp Immutable Ledger Activated. Let the secure sharing begin!",
      systemInit: true
    };
    const timestamp = Date.now();
    const index = 0;
    const previousHash = "0".repeat(64);
    
    let nonce = 0;
    let hash = this.calculateHash(index, previousHash, timestamp, genesisData, nonce);
    
    // Mine the genesis block
    const target = "0".repeat(this.difficulty);
    while (!hash.startsWith(target)) {
      nonce++;
      hash = this.calculateHash(index, previousHash, timestamp, genesisData, nonce);
    }

    const genesisBlock = new BlockModel({
      index,
      timestamp,
      data: genesisData,
      previousHash,
      hash,
      nonce
    });

    await genesisBlock.save();
    return genesisBlock;
  }

  // Get latest block from the database
  async getLatestBlock() {
    let latest = await BlockModel.findOne().sort({ index: -1 });
    if (!latest) {
      // If no blocks exist, initialize genesis block
      latest = await this.createGenesisBlock();
    }
    return latest;
  }

  // Cryptographically mine and append a new block to the ledger
  async addBlock(data) {
    const latestBlock = await this.getLatestBlock();
    const index = latestBlock.index + 1;
    const previousHash = latestBlock.hash;
    const timestamp = Date.now();
    
    let nonce = 0;
    let hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
    
    const target = "0".repeat(this.difficulty);
    // Proof of Work: Mine block by iterating nonce until we get the required leading zeros
    while (!hash.startsWith(target)) {
      nonce++;
      hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
    }

    const newBlock = new BlockModel({
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce
    });

    await newBlock.save();
    return newBlock;
  }

  // Audit the ledger to verify that no historical block hash or content has been tampered with
  async validateChain() {
    const chain = await BlockModel.find().sort({ index: 1 });
    
    if (chain.length === 0) {
      return { isValid: true, reason: "Blockchain empty" };
    }

    for (let i = 0; i < chain.length; i++) {
      const currentBlock = chain[i];
      
      // 1. Verify recalculation of current block's hash
      const recalculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.data,
        currentBlock.nonce
      );

      if (currentBlock.hash !== recalculatedHash) {
        return {
          isValid: false,
          errorIndex: currentBlock.index,
          reason: `Hash mismatch at block #${currentBlock.index}. Stored: ${currentBlock.hash}. Recalculated: ${recalculatedHash}`
        };
      }

      // 2. Verify link with previous block
      if (i > 0) {
        const previousBlock = chain[i - 1];
        if (currentBlock.previousHash !== previousBlock.hash) {
          return {
            isValid: false,
            errorIndex: currentBlock.index,
            reason: `Previous hash linkage broken at block #${currentBlock.index}. Stored previousHash: ${currentBlock.previousHash}. Actual previous hash: ${previousBlock.hash}`
          };
        }
      } else {
        // Index 0 previous hash check
        const genesisTargetHash = "0".repeat(64);
        if (currentBlock.previousHash !== genesisTargetHash) {
          return {
            isValid: false,
            errorIndex: 0,
            reason: `Genesis previousHash invalid: ${currentBlock.previousHash}`
          };
        }
      }
    }

    return { isValid: true };
  }
}

const blockchain = new Blockchain(2); // Difficulty level of 2
export default blockchain;
