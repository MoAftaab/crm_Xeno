import { Request, Response } from 'express';
import Segment, { ISegment } from '../models/Segment';
import Customer from '../models/Customer';

// Get all segments
export const getSegments = async (req: Request, res: Response): Promise<void> => {
  try {
    const segments = await Segment.find().sort({ created_at: -1 });
    res.status(200).json(segments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching segments', error });
  }
};

// Get segment by ID
export const getSegmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }
    
    res.status(200).json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching segment', error });
  }
};

// Create new segment
export const createSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, rules } = req.body;
    
    if (!name || !rules) {
      res.status(400).json({ message: 'Name and rules are required' });
      return;
    }
    
    // Calculate audience size based on rules
    // This is a simplified example - in a real app, you'd implement more complex rule parsing
    let query: any = {};
    
    if (rules.totalSpend) {
      query.total_spend = { $gte: rules.totalSpend };
    }
    
    if (rules.visitCount) {
      query.visit_count = { $gte: rules.visitCount };
    }
    
    const audienceSize = await Customer.countDocuments(query);
    
    const segment = new Segment({
      name,
      rules,
      audience_size: audienceSize,
      created_at: new Date(),
      created_by: req.user?.id || 'system'
    });
    
    await segment.save();
    res.status(201).json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating segment', error });
  }
};

// Update segment
export const updateSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }
    
    const { name, rules } = req.body;
    
    if (name) segment.name = name;
    
    if (rules) {
      segment.rules = rules;
      
      // Recalculate audience size based on updated rules
      let query: any = {};
      
      if (rules.totalSpend) {
        query.total_spend = { $gte: rules.totalSpend };
      }
      
      if (rules.visitCount) {
        query.visit_count = { $gte: rules.visitCount };
      }
      
      segment.audience_size = await Customer.countDocuments(query);
    }
    
    await segment.save();
    res.status(200).json(segment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating segment', error });
  }
};

// Delete segment
export const deleteSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await Segment.findById(req.params.id);
    
    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }
    
    await Segment.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Segment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting segment', error });
  }
}; 