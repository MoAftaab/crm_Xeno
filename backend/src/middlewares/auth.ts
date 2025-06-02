import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface IUserPayload {
  id: string;
  email: string;
}

// We don't declare user property here since we're extending the global Express namespace
export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as IUserPayload;
    
    // Explicitly type the user property to avoid conflicts
    (req as express.Request & { user: IUserPayload }).user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};
