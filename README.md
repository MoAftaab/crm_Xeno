# Xeno CRM - Advanced Customer Relationship Management System

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-v18.0.0-green" />
  <img src="https://img.shields.io/badge/Express-v4.18.2-blue" />
  <img src="https://img.shields.io/badge/React-v18.0.0-blue" />
  <img src="https://img.shields.io/badge/MongoDB-v6.0-green" />
  <img src="https://img.shields.io/badge/Mongoose-v7.0.0-brown" />
  <img src="https://img.shields.io/badge/Next.js-v13.0.0-black" />
  <img src="https://img.shields.io/badge/TypeScript-v5.0.0-blue" />
  <img src="https://img.shields.io/badge/JWT-Authentication-yellow" />
  <img src="https://img.shields.io/badge/Gemini%20AI-Integration-purple" />
  <img src="https://img.shields.io/badge/Swagger-Documentation-green" />
</div>

 
## Table of Contents
- [System Architecture](#system-architecture)
- [Dashboard Preview](#dashboard-preview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)

## System Architecture

![System Architecture](MiniCRMPnG.png)

The Xeno CRM architecture follows a modern full-stack approach with clear separation of concerns:

- *Frontend*: Next.js-based UI with React components and hooks for state management
- *Backend*: Express.js API server with dedicated controllers and services
- *Data Layer*: MongoDB for persistent storage with Mongoose ODM
- *Caching*: Redis for performance optimization
- *External Services*: Integration with AI APIs and message delivery providers

## Dashboard Preview

![Dashboard Preview](https://github.com/MoAftaab/crm_Xeno/blob/main/WhatsApp%20Image%202025-06-01%20at%2002.20.18_ecbe7590.jpg)

The intuitive dashboard provides a comprehensive overview of your customer data, orders, campaigns, and analytics in a clean, modern UI.

## Landing Page

A detailed landing page is available in the repository as a PDF document ([localhost_3000_ (1).pdf](localhost_3000_%20(1).pdf)). This showcases the user interface, entry point to the application, and the overall user experience design.

## Core Features

### Customer Management
- Customer CRUD operations via RESTful APIs
- Customer data model with flexible attributes
- Email uniqueness checks scoped by userId
- Customer filtering and search capabilities

### Order Management
- Order tracking and association with customers
- Order history viewing
- Order status updates

### Data Ingestion APIs
- Secure CSV import for customers via POST /api/data/import/customers
- Secure CSV import for orders via POST /api/data/import/orders
- Sample CSV templates via GET /api/data/samples/customer and GET /api/data/samples/order
- Comprehensive validation with detailed error reporting
- Support for partial success (HTTP 207) when some rows fail but others succeed

### Authentication & Security
- JWT-based authentication
- Middleware for protecting sensitive endpoints
- Role-based access control
- API path protection

### API Documentation
- Comprehensive Swagger/OpenAPI documentation
- Interactive API testing through Swagger UI
- Detailed request/response schemas
- API accessible at /api-docs endpoint

### Campaign Management
- Campaign creation and tracking
- Campaign scheduling
- AI integration for message generation

### Message Delivery System
- AI Smart Scheduling Suggestions
- Multi-channel delivery (SMS, email)
- Batch processing for efficient delivery
- Delivery tracking and receipts via webhooks

### Customer Segmentation
- Rules-based segmentation engine
- Segment creation based on customer attributes
- AND/OR logic for complex segment rules

### Caching System
- Redis-based caching for improved performance
- Fallback to memory cache when Redis is unavailable

### Error Handling
- Comprehensive error handling across the application
- Detailed error responses with appropriate HTTP status codes
- Validation error reporting

## Tech Stack

### Frontend
- *Next.js*: For server-side rendering and routing
- *TypeScript*: For type safety
- *Tailwind CSS*: For responsive UI design
- *React Query*: For data fetching and caching
- *Context API*: For state management

### Backend
- *Node.js*: Runtime environment
- *Express.js*: Web framework
- *TypeScript*: For type safety
- *MongoDB*: Database
- *Mongoose*: ODM for MongoDB
- *Redis*: For caching and message queues
- *JWT*: For authentication
- *Swagger/OpenAPI*: For API documentation
- *Multer*: For file uploads
- *CSV Parser*: For CSV data processing

### AI & Delivery
- *Gemini AI API*: For intelligent content generation
- *Redis Streams*: For message queuing
- *Batch Processing*: For efficient message delivery
- *Webhook Handlers*: For delivery receipts

### Enhanced Swagger Documentation

Added comprehensive API documentation using Swagger UI for all endpoints:

- *Features*:
  - Detailed request/response schemas
  - Authentication requirements
  - Sample request bodies
  - Response codes and meanings
  - Test directly from the browser
    
## 📊 System Capabilities

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Customer Management | Full CRUD operations for customer data | MongoDB + Express |
| Order Tracking | Track orders and link to customers | Mongoose ODM |
| Segmentation | Dynamic customer segmentation | Rule Engine + MongoDB Aggregation |
| AI Integration | Smart campaign content generation | Gemini API Integration |
| Delivery System | Multi-channel campaign delivery | Webhook + Batch Processing |
| Data Ingestion | Secure APIs for data import | Express + CSV Processing |
| Authentication | Secure user authentication | JWT + bcrypt |
| Documentation | API documentation | Swagger UI + JSDoc |

## API Documentation

The API is fully documented using Swagger/OpenAPI and can be accessed at /api-docs when the server is running.

### Key API Endpoints

#### Authentication
- POST /api/auth/login: User login
- POST /api/auth/register: User registration

#### Customers
- GET /api/customers: List customers
- POST /api/customers: Create customer
- GET /api/customers/:id: Get customer details
- PUT /api/customers/:id: Update customer
- DELETE /api/customers/:id: Delete customer

#### Orders
- GET /api/orders: List orders
- POST /api/orders: Create order
- GET /api/orders/:id: Get order details
- PUT /api/orders/:id: Update order
- DELETE /api/orders/:id: Delete order

#### Data Import
- POST /api/data/import/customers: Import customers via CSV
- POST /api/data/import/orders: Import orders via CSV
- GET /api/data/samples/customer: Download customer CSV template
- GET /api/data/samples/order: Download order CSV template

#### Segments
- GET /api/segments: List segments
- POST /api/segments: Create segment
- GET /api/segments/:id: Get segment details
- PUT /api/segments/:id: Update segment
- DELETE /api/segments/:id: Delete segment
- GET /api/segments/:id/customers: Get customers in segment

#### Campaigns
- GET /api/campaigns: List campaigns
- POST /api/campaigns: Create campaign
- GET /api/campaigns/:id: Get campaign details
- PUT /api/campaigns/:id: Update campaign
- DELETE /api/campaigns/:id: Delete campaign
- POST /api/campaigns/:id/schedule: Schedule campaign
- GET /api/campaigns/:id/stats: Get campaign statistics

#### AI
- POST /api/ai/generate-message: Generate campaign message
- POST /api/ai/suggest-schedule: Get AI scheduling suggestions

#### Delivery
- GET /api/delivery/stats: Get delivery statistics
- POST /api/delivery/webhook: Webhook for delivery receipts

## Project Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js 13+ app directory
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── customers/    # Customer management pages
│   │   │   ├── orders/       # Order management pages
│   │   │   ├── campaigns/    # Campaign management pages
│   │   │   ├── segment-rules/# Segmentation rules pages
│   │   │   ├── segments/     # Segments management pages
│   │   │   ├── import/       # Data import pages
│   │   │   ├── analytics/    # Analytics dashboard pages
│   │   │   └── settings/     # Settings pages
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layers
│   │   ├── styles/           # Global styles and themes
│   │   └── lib/              # Utilities and helpers
│   ├── config/               # Frontend configuration
│   ├── pages/                # Next.js pages (legacy)
│   └── data-service.ts       # Data import services
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── config/               # Configuration files
│   │   ├── db.ts             # Database configuration
│   │   ├── redis.ts          # Redis configuration
│   │   └── swagger.ts        # Swagger configuration
│   ├── controllers/          # Route controllers
│   │   ├── authController.ts # Authentication controller
│   │   ├── customerController.ts # Customer controller
│   │   ├── orderController.ts    # Order controller
│   │   ├── campaignController.ts # Campaign controller
│   │   ├── segmentController.ts  # Segment controller
│   │   ├── aiController.ts       # AI controller
│   │   ├── deliveryController.ts # Delivery controller
│   │   └── uploadController.ts   # File upload controller
│   ├── docs/                 # API documentation
│   │   ├── swagger.ts        # Swagger setup
│   │   ├── ai.doc.ts         # AI API docs
│   │   ├── campaign.doc.ts   # Campaign API docs
│   │   ├── customer.doc.ts   # Customer API docs
│   │   ├── data-ingestion.doc.ts # Data ingestion API docs
│   │   ├── delivery.doc.ts   # Delivery API docs
│   │   └── order.doc.ts      # Order API docs
│   ├── interfaces/           # TypeScript interfaces
│   ├── middleware/           # Express middlewares
│   │   ├── auth.ts           # Auth middleware
│   │   ├── authMiddleware.ts # Alternative auth middleware
│   │   └── cache.ts          # Caching middleware
│   ├── models/               # Database models
│   │   ├── User.ts           # User model
│   │   ├── Customer.ts       # Customer model
│   │   ├── Order.ts          # Order model
│   │   ├── Segment.ts        # Segment model
│   │   └── Campaign.ts       # Campaign model
│   ├── routes/               # API routes
│   │   ├── authRoutes.ts     # Auth routes
│   │   ├── customerRoutes.ts # Customer routes
│   │   ├── orderRoutes.ts    # Order routes
│   │   ├── segmentRoutes.ts  # Segment routes
│   │   ├── campaignRoutes.ts # Campaign routes
│   │   ├── aiRoutes.ts       # AI routes
│   │   ├── deliveryRoutes.ts # Delivery routes
│   │   └── dataRoutes.ts     # Data import routes
│   ├── services/             # Business logic
│   │   ├── authService.ts    # Auth service
│   │   ├── customerService.ts# Customer service
│   │   ├── orderService.ts   # Order service
│   │   ├── segmentService.ts # Segment service
│   │   ├── campaignService.ts# Campaign service
│   │   ├── aiService.ts      # AI service
│   │   ├── uploadService.ts  # Upload service
│   │   ├── deliveryBatchService.ts # Delivery batch service
│   │   ├── messageDeliveryService.ts # Message delivery service
│   │   └── campaignSchedulerService.ts # Campaign scheduler
│   └── utils/                # Utility functions
│       ├── validation.ts     # Validation utilities
│       ├── errors.ts         # Error handling utilities
│       └── helpers.ts        # Helper functions
├── index.ts                  # Application entry point
└── package.json
```
## 🚀 Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** v18.0.0 or higher ([Download here](https://nodejs.org/))
- **MongoDB** v6.0 or higher ([Installation Guide](https://docs.mongodb.com/manual/installation/))
- **Redis** (optional - falls back to in-memory cache) ([Installation Guide](https://redis.io/docs/getting-started/installation/))
- **Git** for version control

### 🔧 Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/xeno-crm.git
cd xeno-crm
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env.local

# Edit the .env.local file with your configuration
nano .env.local  # or use your preferred editor

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

### ⚙️ Environment Configuration

#### Backend Environment Variables (`.env`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/xeno_crm

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Frontend Environment Variables (`.env.local`)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Application Configuration
NEXT_PUBLIC_APP_NAME=Xeno CRM
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```


### 📊 Database Setup

#### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

2. **MongoDB Atlas (Cloud):**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `MONGODB_URI` in `.env`


```
### 🔑 API Keys Setup

#### Gemini AI API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### 🧪 Testing the Setup

#### Backend Health Check

```bash
curl http://localhost:5000/api/health
```

#### Frontend Access

Open your browser and navigate to:
- **Frontend:** `http://localhost:3000`
- **API Documentation:** `http://localhost:5000/api-docs`

### 📝 Available Scripts

#### Backend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
```

#### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### 🔍 Troubleshooting

#### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process using port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB Connection Issues:**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify firewall settings

3. **Redis Connection Issues:**
   - The app will fall back to in-memory cache if Redis is unavailable
   - Check Redis status: `redis-cli ping`

4. **API Key Issues:**
   - Verify Gemini API key is valid
   - Check API quotas and limits

### 📖 Next Steps

Once setup is complete:

1. **Access the Dashboard:** Navigate to `http://localhost:3000/dashboard`
2. **Explore API Docs:** Visit `http://localhost:5000/api-docs`
3. **Import Sample Data:** Use the data import features in the dashboard
4. **Create Your First Campaign:** Follow the campaign creation workflow

### 🆘 Need Help?

- Check the [API Documentation](http://localhost:5000/api-docs) for endpoint details
- Review the [Project Structure](#project-structure) for codebase understanding
- Create an issue in the repository for bugs or feature requests

---

<div align="center">
  <h3>🎯 Ready to revolutionize your customer relationships!</h3>
  <p><strong>Developed by Mohd Aftaab</strong></p>
  <p><em>Xeno SDE Internship Assignment 2025</em></p>
</div>