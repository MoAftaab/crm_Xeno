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

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
  - [Customer Management](#customer-management)
  - [Order Management](#order-management)
  - [Customer Segmentation](#customer-segmentation)
  - [AI-Powered Campaign Management](#ai-powered-campaign-management)
  - [Campaign Delivery System](#campaign-delivery-system)
  - [Data Ingestion APIs](#data-ingestion-apis)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Installation & Setup](#installation--setup)
- [Screenshots](#screenshots)

## 💡 Overview

Xeno CRM is an advanced customer relationship management system that combines traditional CRM functionality with AI-powered campaign management. The platform enables businesses to manage customers, track orders, create targeted customer segments, and deliver personalized marketing campaigns using Gemini AI.

```
Frontend (Next.js) <--> Backend (Express/Node.js) <--> MongoDB
                             ^
                             |
                     Gemini AI & Delivery APIs
```

## 🏗️ System Architecture

Xeno CRM follows a modern microservices-inspired architecture with clear separation of concerns:

```
┌───────────────────┐      ┌───────────────────┐      ┌────────────────┐
│   Presentation    │      │    Application    │      │     Data       │
│      Layer        │<────>│      Layer        │<────>│     Layer      │
│   (Next.js UI)    │      │  (Express APIs)   │      │   (MongoDB)    │
└───────────────────┘      └───────────────────┘      └────────────────┘
                                     ^
                                     |
                           ┌─────────┴─────────┐
                           │  External Services │
                           │  - Gemini AI      │
                           │  - Delivery Vendors│
                           └───────────────────┘
```

## 🚀 Key Features

### Customer Management

- **360° Customer View**: Comprehensive dashboard for viewing customer information, order history, and engagement metrics
- **Customer Import/Export**: Bulk import and export functionality via CSV
- **Automated Tracking**: Track customer lifetime value, visit count, and last activity

```
User uploads CSV → Validation → Data Processing → Database Storage → Success/Error Response
```

### Order Management

- **Order Tracking**: Monitor order status, total amount, and items
- **Customer Association**: Automatically link orders with customer profiles
- **Bulk Import**: Easily import order data via CSV files

### Customer Segmentation

- **Dynamic Segment Rules**: Create segments based on multiple criteria
- **Rule Engine**: Complex rule combinations with AND/OR logic
- **Real-time Updates**: Segments automatically updated as customer data changes

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Customer Data│────>│ Segmentation    │────>│ Customer Segments │
└──────────────┘     │ Rules Engine    │     │ - VIP Customers   │
                     └─────────────────┘     │ - New Customers   │
                                             │ - At-Risk Customers│
                                             └──────────────────┘
```

### AI-Powered Campaign Management

- **Gemini AI Integration**: Generate personalized campaign messages based on customer segments
- **Content Analysis**: AI analyzes customer segments to create targeted content
- **Smart Scheduling**: AI-recommended delivery times based on customer engagement patterns

```
Marketer → Select Segment → AI Content Generation → Review → Schedule Campaign → Track Results
```

### Campaign Delivery System

- **Multi-channel Delivery**: Send campaigns via SMS, email, or other channels
- **Batch Processing**: Efficient delivery through batched processing
- **Delivery Tracking**: Monitor delivery status, open rates, and engagement metrics
- **Webhook Integration**: Receive and process delivery receipts from vendors

```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐
│ Campaign    │────>│ Message Delivery│────>│ Delivery Vendors│
│ Creation    │     │ Service         │     │ (SMS/Email)     │
└─────────────┘     └────────────────┘     └─────────────────┘
                           │                        │
                           v                        v
                    ┌────────────────┐     ┌─────────────────┐
                    │ Batch Processing│<────│ Delivery Receipt│
                    │ & Analytics    │     │ Webhooks        │
                    └────────────────┘     └─────────────────┘
```

### Data Ingestion APIs

- **Secure REST APIs**: Well-documented endpoints for data ingestion
- **CSV Processing**: Efficient bulk data import via CSV files
- **Validation & Error Handling**: Comprehensive data validation and detailed error reporting
- **Authentication**: JWT-secured endpoints for data protection

```
┌─────────────────────────────────────────────────────────────┐
│ Data Ingestion Flow                                         │
│                                                             │
│ ┌────────┐    ┌──────────┐    ┌─────────────┐    ┌────────┐ │
│ │ Upload │───>│ Validate │───>│ Process Rows│───>│ Store  │ │
│ │ CSV    │    │ Headers  │    │ & Validate  │    │ Data   │ │
│ └────────┘    └──────────┘    └─────────────┘    └────────┘ │
│       │                              │                      │
│       │         ┌──────────┐         │                      │
│       └────────>│ Generate │<────────┘                      │
│                 │ Response │                                │
│                 └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

## 📚 API Documentation

Xeno CRM provides comprehensive API documentation using Swagger UI, accessible at `/api-docs` when the server is running.

- **Authentication**: JWT-based authentication for secure API access
- **Customers API**: Manage customer data, profiles, and attributes
- **Orders API**: Create, retrieve, and manage order information
- **Segments API**: Define and manage customer segments
- **Campaigns API**: Create, launch, and monitor marketing campaigns
- **AI API**: Generate content and insights using Gemini AI
- **Delivery API**: Track campaign delivery statistics and webhooks
- **Data Ingestion API**: Import customer and order data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permission levels for various user roles
- **Input Validation**: Comprehensive validation of all user inputs
- **Error Handling**: Secure error responses that don't leak sensitive information
- **Environment Security**: Sensitive configuration stored in environment variables

## 💻 Installation & Setup

### Prerequisites

- Node.js v18 or higher
- MongoDB v6.0 or higher
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Overview)

### Customer Management
![Customer Management](https://via.placeholder.com/800x400?text=Customer+Management)

### Campaign Creation with AI
![AI Campaign](https://via.placeholder.com/800x400?text=AI+Campaign+Creation)

### Segmentation Rules
![Segmentation Rules](https://via.placeholder.com/800x400?text=Segmentation+Rules)

### API Documentation
![Swagger API Docs](https://via.placeholder.com/800x400?text=Swagger+API+Documentation)

---

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

## 💫 Recently Implemented Features

### Secure Data Ingestion APIs

We've implemented robust APIs for importing customer and order data via CSV uploads:

- **Endpoints**:
  - `POST /api/data/import/customers` — Upload CSV to import customers
  - `POST /api/data/import/orders` — Upload CSV to import orders
  - `GET /api/data/samples/customer` — Download sample CSV template for customers
  - `GET /api/data/samples/order` — Download sample CSV template for orders

- **Security Features**:
  - JWT Authentication required for all endpoints
  - 5MB file size limit
  - CSV MIME type validation
  - Robust input validation for each data field

- **Validation & Error Handling**:
  - Required field validation
  - Format validation (email, phone, dates, amounts)
  - Detailed row-level error reporting
  - Partial success handling (HTTP 207)

- **Performance Optimizations**:
  - Streaming CSV parsing
  - In-memory file processing
  - Customer caching for order association

### Enhanced Swagger Documentation

Added comprehensive API documentation using Swagger UI for all endpoints:

- **Features**:
  - Detailed request/response schemas
  - Authentication requirements
  - Sample request bodies
  - Response codes and meanings
  - Test directly from the browser

---

<div align="center">
  <p>Developed with ❤️ by Mohd Aftaab</p>
</div>
