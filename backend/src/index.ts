import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import customerRoutes from './routes/customerRoutes';
import segmentRoutes from './routes/segmentRoutes';
import { setupSwagger } from './docs/swagger';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000; // Changed to port 5000 to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://moaftaab786:ootodQep0smfGaq6@crmxeno.jj716zf.mongodb.net/?retryWrites=true&w=majority&appName=crmXeno';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/segments', segmentRoutes);

// Basic health check route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    swagger: 'API documentation available at /api-docs'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
