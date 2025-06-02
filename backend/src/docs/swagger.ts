import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import path from 'path';

type Express = express.Application;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Xeno CRM API',
      version: '1.0.0',
      description: 'API documentation for ingesting customers and orders and managing users',
      contact: {
        name: 'Xeno CRM Team',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, './*.doc.ts'),
    path.resolve(__dirname, '../routes/*.ts')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Swagger docs endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Endpoint to get swagger.json
  app.get('/swagger.json', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation available at /api-docs');
};
