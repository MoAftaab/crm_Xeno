import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export const verifyGoogleToken = async (token: string): Promise<GoogleUser | null> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );
    
    if (response.data.error_description) {
      throw new Error(response.data.error_description);
    }
    
    return {
      id: response.data.sub,
      email: response.data.email,
      name: response.data.name,
      picture: response.data.picture
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return null;
  }
};

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}; 