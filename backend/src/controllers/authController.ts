import { Response } from '../types/express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import User from '../models/User';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// Hardcoding the Google Client ID to ensure it's correctly set
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

console.log('Using Google Client ID:', GOOGLE_CLIENT_ID);

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Handle Google OAuth login/signup
 */
export const googleLogin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('Google login attempt:', req.body);
    const { token } = req.body;
    
    if (!token) {
      console.error('Missing token in request');
      res.status(400).json({ message: 'Google token is required' });
      return;
    }

    console.log('Attempting to verify Google token...');
    
    // Verify the token with Google
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
      });
      console.log('Google token verified successfully');
    } catch (verifyError) {
      console.error('Google token verification error:', verifyError);
      res.status(401).json({ message: 'Failed to verify Google token', error: verifyError instanceof Error ? verifyError.message : 'Unknown verification error' });
      return;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      console.error('Invalid Google token payload:', payload);
      res.status(400).json({ message: 'Invalid Google token' });
      return;
    }
    
    console.log('Google payload received:', { 
      email: payload.email, 
      name: payload.name, 
      sub: payload.sub,
      picture: payload.picture ? 'Picture exists' : 'No picture'
    });

    // Check if user exists
    let user;
    try {
      user = await User.findOne({ email: payload.email });
      console.log('User lookup result:', user ? 'User found' : 'User not found');
    } catch (dbError) {
      console.error('Database error during user lookup:', dbError);
      res.status(500).json({ message: 'Database error during user lookup', error: dbError instanceof Error ? dbError.message : 'Unknown database error' });
      return;
    }

    // Create new user if doesn't exist
    if (!user) {
      try {
        console.log('Creating new user with email:', payload.email);
        user = await User.create({
          email: payload.email,
          name: payload.name || 'Google User',
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
          googleId: payload.sub,
          avatar: payload.picture
        });
        console.log('New user created successfully');
      } catch (createError) {
        console.error('Failed to create new user:', createError);
        res.status(500).json({ message: 'Failed to create new user', error: createError instanceof Error ? createError.message : 'Unknown error during user creation' });
        return;
      }
    }

    // Generate JWT
    let jwtToken;
    try {
      console.log('Generating JWT token for user:', user._id);
      jwtToken = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('JWT token generated successfully');
    } catch (jwtError) {
      console.error('JWT generation error:', jwtError);
      res.status(500).json({ message: 'Failed to generate authentication token', error: jwtError instanceof Error ? jwtError.message : 'Unknown JWT error' });
      return;
    }

    // Send successful response
    try {
      const response = {
        token: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      };
      console.log('Sending successful authentication response');
      res.json(response);
    } catch (responseError) {
      console.error('Error sending response:', responseError);
      res.status(500).json({ message: 'Error sending response', error: responseError instanceof Error ? responseError.message : 'Unknown response error' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error during Google authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error during registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
