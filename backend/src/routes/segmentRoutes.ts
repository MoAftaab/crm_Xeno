import express from 'express';
import { getSegments, getSegmentById, createSegment, updateSegment, deleteSegment } from '../controllers/segmentController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// All segment routes are protected
router.get('/', authenticate, getSegments);
router.get('/:id', authenticate, getSegmentById);
router.post('/', authenticate, createSegment);
router.put('/:id', authenticate, updateSegment);
router.delete('/:id', authenticate, deleteSegment);

export default router; 