import { Response } from '../types/express';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { Types } from 'mongoose';
import Segment, { ISegment } from '../models/Segment';

export const getSegments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const segments = await Segment.find({ userId: new Types.ObjectId(userId) });
    res.json(segments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching segments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getSegmentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid segment ID' });
      return;
    }

    const segment = await Segment.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    });

    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }

    res.json(segment);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching segment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createSegment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const segmentData = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const segment = await Segment.create({
      ...segmentData,
      userId: new Types.ObjectId(userId)
    });

    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating segment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateSegment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid segment ID' });
      return;
    }

    const segment = await Segment.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId)
      },
      updates,
      { new: true }
    );

    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }

    res.json(segment);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating segment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteSegment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid segment ID' });
      return;
    }

    const segment = await Segment.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    });

    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }

    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting segment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
