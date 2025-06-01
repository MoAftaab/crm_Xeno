import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import segmentRoutes from './routes/segmentRoutes';
import campaignRoutes from './routes/campaignRoutes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import dataRoutes from './routes/dataRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import connectDB from './config/database';
import { connectRedis } from './config/redis';
import { initMockVendorEndpoints } from './services/mockVendorService';
import { initCampaignScheduler } from './services/campaignSchedulerService';
import { setupSwagger } from './docs/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// Configure CORS to explicitly allow frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());

// Routes
app.get('/', (req, res) => {
  res.send('CRM API is running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/delivery', deliveryRoutes);

// Setup the mock vendor API for development/testing
initMockVendorEndpoints(app);

// Connect to Database and Redis
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Try to connect to Redis, but don't fail if it doesn't connect
    try {
      await connectRedis();
    } catch (redisError) {
      console.error('Redis connection failed, but continuing:', redisError);
    }
    
    // Setup Swagger API documentation
    setupSwagger(app);
    console.log(`Swagger API docs available at http://localhost:${PORT}/api-docs`);
    
    // Start server after connections
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Initialize the campaign scheduler to process scheduled campaigns
      const schedulerInterval = initCampaignScheduler();
      
      // Graceful shutdown to clear intervals
      process.on('SIGINT', () => {
        console.log('Shutting down campaign scheduler...');
        clearInterval(schedulerInterval);
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 