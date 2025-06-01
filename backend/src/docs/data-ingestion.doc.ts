/**
 * @swagger
 * components:
 *   schemas:
 *     ImportResult:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the import operation was successful
 *         message:
 *           type: string
 *           description: Result message
 *         count:
 *           type: number
 *           description: Number of successfully processed records
 *         processedCount:
 *           type: number
 *           description: Number of successfully processed records
 *         failedCount:
 *           type: number
 *           description: Number of failed records
 *         failures:
 *           type: array
 *           description: Details about failed records
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: number
 *                 description: Row number in CSV file
 *               message:
 *                 type: string
 *                 description: Error message
 *       example:
 *         success: true
 *         message: "File processed with some errors. 45 processed, 5 failed."
 *         processedCount: 45
 *         failedCount: 5
 *         failures: [
 *           { row: 3, message: "Customer with email example@test.com already exists" },
 *           { row: 7, message: "Missing required field: email" }
 *         ]
 *
 * @swagger
 * tags:
 *   name: Data Ingestion
 *   description: APIs for importing customer and order data
 */

/**
 * @swagger
 * /api/data/import/customers:
 *   post:
 *     summary: Import customers from CSV file
 *     tags: [Data Ingestion]
 *     description: Upload a CSV file containing customer data for bulk import
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with customer data
 *     responses:
 *       200:
 *         description: Customers imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       207:
 *         description: Partial success - some records processed with errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       400:
 *         description: Bad request or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only CSV files are allowed"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error processing CSV file"
 *
 * /api/data/import/orders:
 *   post:
 *     summary: Import orders from CSV file
 *     tags: [Data Ingestion]
 *     description: Upload a CSV file containing order data for bulk import
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with order data
 *     responses:
 *       200:
 *         description: Orders imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       207:
 *         description: Partial success - some records processed with errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       400:
 *         description: Bad request or invalid file format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only CSV files are allowed"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not authenticated"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error processing CSV file"
 *
 * /api/data/samples/customer:
 *   get:
 *     summary: Get sample customer CSV template
 *     tags: [Data Ingestion]
 *     description: Download a sample CSV file with the correct format for customer data import
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sample CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /api/data/samples/order:
 *   get:
 *     summary: Get sample order CSV template
 *     tags: [Data Ingestion]
 *     description: Download a sample CSV file with the correct format for order data import
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sample CSV file
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
