import connectDB from '../config/database';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const testMongoDBConnection = async () => {
  try {
    await connectDB();
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

testMongoDBConnection();
