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
 *
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management APIs
 *
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
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
 *
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
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
 *
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
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
 *
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
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
 *
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
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
