const mongoose = require('mongoose');
const path = require('path');
const envPath = path.resolve(__dirname, '.env');
console.log('Loading environment variables from:', envPath);
require('dotenv').config({ path: envPath });

console.log('Available environment variables:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
  ALL_ENV: Object.keys(process.env)
});

// For testing purposes only
const mongoURI = 'mongodb+srv://adminUser:StrongP@ss123@crmxeno.jj716zf.mongodb.net/crmxeno?retryWrites=true&w=majority';
console.log('Attempting to connect to MongoDB...');

if (!mongoURI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
