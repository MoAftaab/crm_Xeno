import express from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Customer name
 *         email:
 *           type: string
 *           description: Customer email address
 *         phone:
 *           type: string
 *           description: Customer phone number
 *         address:
 *           type: string
 *           description: Customer address
 *         notes:
 *           type: string
 *           description: Additional notes about the customer
 *         externalId:
 *           type: string
 *           description: External identifier for the customer
 *         userId:
 *           type: string
 *           description: ID of the user who owns this customer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new customer in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post('/', createCustomer);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     description: Retrieves a list of all customers for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     description: Retrieves a single customer by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     description: Updates a customer's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Deletes a customer from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, deleteCustomer);

export default router;