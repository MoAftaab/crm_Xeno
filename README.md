# Enhanced Mini CRM Platform

A modern customer relationship management platform with AI-powered insights.

## Project Structure

The project is divided into two main parts:

### Frontend (Next.js)

The frontend is built with Next.js, React, and Tailwind CSS. It provides a modern and responsive user interface for the CRM platform.

Key features:
- Customer segmentation
- Campaign creation and management
- AI-powered customer insights
- Analytics dashboard

### Backend (Node.js/Express)

The backend is built with Node.js, Express, and MongoDB. It provides the API endpoints and business logic for the CRM platform.

Key components:
- RESTful API endpoints
- MongoDB database integration
- Google OAuth authentication
- Redis Streams for message broker
- Perplexity AI integration for insights

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Create a `.env` file in the backend directory with the following environment variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
PERPLEXITY_API_KEY=your_perplexity_api_key
```

4. Start the development servers:

```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd ../backend
npm run dev
```

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Message Broker**: Redis Streams
- **Authentication**: Google OAuth 2.0
- **AI Integration**: Perplexity AI 