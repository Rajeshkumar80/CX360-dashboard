import mongoose from 'mongoose';
import config from './env.js';

let dbConnected = false;

const connectDB = async () => {
  try {
    if (!config.mongoUri || config.mongoUri.includes('<user>') || config.mongoUri.includes('<pass>')) {
      console.warn('⚠ MONGODB_URI not configured — running in Mock Mode');
      dbConnected = false;
      return false;
    }
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected');
    dbConnected = true;
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    dbConnected = false;
    return false;
  }
};

export const isDbConnected = () => dbConnected;
export default connectDB;
