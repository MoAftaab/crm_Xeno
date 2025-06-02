import express from 'express';
import { Types } from 'mongoose';
import { IOrder } from '../models/Order';
import { MulterFileInfo } from './types';

export interface IUserPayload {
  id: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthenticatedRequest extends express.Request {
  user?: AuthenticatedUser;
  file?: MulterFileInfo;
  body: any;
  params: {
    id?: string;
    [key: string]: string | undefined;
  };
  query: {
    [key: string]: string | string[] | undefined;
  };
}

export interface ICustomer {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  externalId?: string;
  created_at?: Date;
  last_active?: Date;
  total_spend?: number;
  visit_count?: number;
}

// Re-export IOrder from models for consistency
export { IOrder };
