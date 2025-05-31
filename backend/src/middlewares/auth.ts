import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

interface IUserPayload {
  id: string;
  email: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
}; 