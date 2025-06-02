/**
 * This script prints the current Google Client ID configuration
 * and helps set the correct value if needed
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to the .env file
const envPath = path.join(__dirname, '.env');

// The client ID provided in the frontend
const expectedClientId = '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

// Load environment variables from .env file
let envConfig = {};
try {
  if (fs.existsSync(envPath)) {
    envConfig = dotenv.parse(fs.readFileSync(envPath));
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

// Get the current Google Client ID
const currentClientId = process.env.GOOGLE_CLIENT_ID || envConfig.GOOGLE_CLIENT_ID || '';

console.log('Current Google Client ID configuration:');
console.log(currentClientId ? currentClientId : 'Not set');

// Compare with the expected client ID
if (currentClientId === expectedClientId) {
  console.log('\n✅ Google Client ID is correctly configured.');
} else {
  console.log('\n❌ Google Client ID mismatch or not set.');
  console.log('\nTo fix this issue, ensure your .env file contains:');
  console.log(`GOOGLE_CLIENT_ID=${expectedClientId}`);
  
  // Ask if the user wants to update the .env file
  console.log('\nWould you like to update or create the .env file with the correct client ID?');
  console.log('To do this, run: node update-google-config.js');
  
  // Create update script
  const updateScriptPath = path.join(__dirname, 'update-google-config.js');
  const updateScript = `
/**
 * This script updates the Google Client ID in the .env file
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Path to the .env file
const envPath = path.join(__dirname, '.env');

// The client ID to set
const clientId = '${expectedClientId}';

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
    .map(([key, value]) => \`\${key}=\${value}\`)
    .join('\\n');
  
  fs.writeFileSync(envPath, envContents);
  console.log('✅ Successfully updated GOOGLE_CLIENT_ID in .env file');
} catch (error) {
  console.error('Error writing to .env file:', error.message);
}
`;

  fs.writeFileSync(updateScriptPath, updateScript);
  console.log('\nUpdate script created at:', updateScriptPath);
}
