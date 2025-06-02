// Simple script to test Gemini API key
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCdM03A0oRwamR1vs6y3SBllvXpGnCBbTI';
// Using gemini-2.0-flash model as specified in the curl command
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function testGeminiAPI() {
  console.log('Testing Gemini API connection...');
  console.log(`API Key available: ${GEMINI_API_KEY ? 'Yes (using key)' : 'No (key missing)'}`);
  
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Generate a short marketing message for a coffee shop"
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      }
    );
    
    // Check if we got a valid response
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      console.log('✅ SUCCESS: Gemini API is working!');
      console.log('Generated text sample:');
      console.log('-----------------------------------');
      console.log(response.data.candidates[0].content.parts[0].text.substring(0, 150) + '...');
      console.log('-----------------------------------');
    } else {
      console.log('❌ ERROR: Received unexpected response format');
      console.log(response.data);
    }
  } catch (error) {
    console.log('❌ ERROR: Gemini API request failed');
    if (error.response) {
      console.log(`Status code: ${error.response.status}`);
      console.log(`Error details:`, error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

// Run the test
testGeminiAPI();
