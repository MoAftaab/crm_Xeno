/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - amount
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         customerId:
 *           type: string
 *           description: ID of the customer who placed the order
 *         orderNumber:
 *           type: string
 *           description: Unique order number
 *         amount:
 *           type: number
 *           description: Order amount
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *           description: Current order status
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *           description: Products included in the order
 *         notes:
 *           type: string
 *           description: Additional notes about the order
 *         externalId:
 *           type: string
 *           description: External identifier for the order
 *         userId:
 *           type: string
 *           description: ID of the user who owns this order
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
 *   name: Orders
 *   description: Order management APIs
 *
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Creates a new order in the database
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     description: Retrieves a list of all orders for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     description: Retrieves a single order by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     description: Updates an order's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     description: Deletes an order from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
