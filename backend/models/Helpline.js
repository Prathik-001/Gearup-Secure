import mongoose from 'mongoose';

const helplineSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    trim: true
  },
  Email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

import { getModel } from './dbSelector.js';
const Helpline = getModel('Helpline', helplineSchema);
export default Helpline;
