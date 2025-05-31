import { Request, Response } from 'express';
import { verifyGoogleToken, generateToken } from '../services/authService';
import User, { UserDocument } from '../models/User';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

// Google OAuth login
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }
    
    const googleUser = await verifyGoogleToken(token);
    
    if (!googleUser) {
      res.status(401).json({ message: 'Invalid Google token' });
      return;
    }
    
    // Check if user exists in our database
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create new user with Google data
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        // No password for Google users
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10),
        role: 'user',
        googleId: googleUser.id,
        picture: googleUser.picture
      });
      
      user = await user.save();
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId, link the accounts
      user.googleId = googleUser.id;
      user.picture = user.picture || googleUser.picture;
      await user.save();
    }
    
    // Generate JWT token
    const userId = user._id instanceof Types.ObjectId 
      ? user._id.toString() 
      : String(user._id);
    
    const jwtToken = generateToken(userId, user.email);
    
    res.status(200).json({
      token: jwtToken,
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Google authentication failed:', error);
    res.status(500).json({ message: 'Authentication failed', error });
  }
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, companyName } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists with this email' });
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      companyName: companyName || '',
      role: 'user'
    });
    
    const savedUser = await newUser.save();
    
    // Get the ID as string
    const userId = savedUser._id instanceof Types.ObjectId 
      ? savedUser._id.toString() 
      : String(savedUser._id);
    
    // Generate token
    const token = generateToken(userId, savedUser.email);
    
    // Return user data without password
    res.status(201).json({
      token,
      user: {
        id: userId,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// Login existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    // Get the ID as string
    const userId = user._id instanceof Types.ObjectId 
      ? user._id.toString() 
      : String(user._id);
    
    // Generate token
    const token = generateToken(userId, user.email);
    
    // Return user data without password
    res.status(200).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
}; 