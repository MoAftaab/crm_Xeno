/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryReceipt:
 *       type: object
 *       required:
 *         - messageId
 *         - status
 *       properties:
 *         messageId:
 *           type: string
 *           description: Unique identifier for the message
 *         status:
 *           type: string
 *           description: Delivery status of the message
 *           enum: [delivered, failed, pending]
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: Time when the message was delivered
 *         metadata:
 *           type: object
 *           description: Additional metadata related to the delivery
 *       example:
 *         messageId: "msg_12345abcde"
 *         status: "delivered"
 *         deliveredAt: "2025-06-01T04:25:00.000Z"
 *         metadata:
 *           vendorRef: "vendor_67890"
 *
 *     DeliveryStats:
 *       type: object
 *       properties:
 *         campaignId:
 *           type: string
 *           description: ID of the campaign
 *         totalMessages:
 *           type: number
 *           description: Total number of messages sent in the campaign
 *         delivered:
 *           type: number
 *           description: Number of messages successfully delivered
 *         failed:
 *           type: number
 *           description: Number of messages that failed delivery
 *         deliveryRate:
 *           type: number
 *           description: Percentage of successful deliveries
 *         status:
 *           type: string
 *           description: Overall status of the campaign delivery
 *           enum: [completed, in-progress, failed]
 *       example:
 *         campaignId: "6077c80b9c8a4a001f9b6b8d"
 *         totalMessages: 100
 *         delivered: 90
 *         failed: 10
 *         deliveryRate: 90.0
 *         status: "completed"
 *
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Campaign message delivery operations
 */

/**
 * @swagger
 * /api/delivery/receipt:
 *   post:
 *     summary: Process a delivery receipt from vendor
 *     tags: [Delivery]
 *     description: Endpoint for receiving delivery receipts from the messaging vendor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryReceipt'
 *     responses:
 *       200:
 *         description: Delivery receipt processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Delivery receipt processed"
 *       400:
 *         description: Invalid request
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
 *                   example: "Invalid receipt data"
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
 *                   example: "Failed to process delivery receipt"
 */

/**
 * @swagger
 * /api/delivery/stats/{campaignId}:
 *   get:
 *     summary: Get campaign delivery statistics
 *     tags: [Delivery]
 *     description: Retrieves delivery statistics for a specific campaign
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the campaign to get statistics for
 *     responses:
 *       200:
 *         description: Delivery statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DeliveryStats'
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
 *                   example: "Access denied. No token provided or invalid format."
 *       404:
 *         description: Campaign not found
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
 *                   example: "Campaign not found"
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
 *                   example: "Failed to retrieve delivery statistics"
 */
