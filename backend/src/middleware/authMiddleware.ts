import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthenticatedUser, IUserPayload } from '../interfaces/interfaces';

const verifyToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as IUserPayload;
    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default verifyToken;
