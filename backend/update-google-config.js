
/**
 * This script updates the Google Client ID in the .env file
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to the .env file
const envPath = path.join(__dirname, '.env');

// The client ID to set
const clientId = '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

// Load existing environment variables from .env file
let envConfig = {};
try {
  if (fs.existsSync(envPath)) {
    envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log('Loaded existing .env file');
  } else {
    console.log('.env file not found, will create a new one');
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

// Update the Google Client ID
envConfig.GOOGLE_CLIENT_ID = clientId;

// Write the updated config back to the .env file
try {
  const envContents = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContents);
  console.log('✅ Successfully updated GOOGLE_CLIENT_ID in .env file');
} catch (error) {
  console.error('Error writing to .env file:', error.message);
}
