/**
 * @swagger
 * components:
 *   schemas:
 *     AIMessageRequest:
 *       type: object
 *       required:
 *         - segmentId
 *         - campaignType
 *       properties:
 *         segmentId:
 *           type: string
 *           description: ID of the target customer segment
 *         campaignType:
 *           type: string
 *           description: Type of the campaign
 *           enum: [promotional, informational, transactional, reminder]
 *         tone:
 *           type: string
 *           description: Desired tone of the message
 *           enum: [formal, friendly, urgent, professional]
 *         includeDiscountInfo:
 *           type: boolean
 *           description: Whether to include discount information
 *         discountPercentage:
 *           type: number
 *           description: Discount percentage to include if applicable
 *       example:
 *         segmentId: "6077c80b9c8a4a001f9b6b8c"
 *         campaignType: "promotional"
 *         tone: "friendly"
 *         includeDiscountInfo: true
 *         discountPercentage: 20
 *
 *     AIMessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: object
 *           properties:
 *             messageTemplate:
 *               type: string
 *               description: AI-generated message template with placeholders
 *       example:
 *         success: true
 *         data:
 *           messageTemplate: "Hi {{customer.firstName}}, summer is here and we've got something special for you! Enjoy {{campaign.discount}}% off on all summer essentials this week only. Shop now at example.com/summer and make this season unforgettable!"
 *
 * @swagger
 * tags:
 *   name: AI
 *   description: Gemini AI integration for campaign message generation
 */

/**
 * @swagger
 * /api/ai/generate-message:
 *   post:
 *     summary: Generate an AI campaign message
 *     tags: [AI]
 *     description: Uses Gemini AI to generate a personalized campaign message based on segment data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIMessageRequest'
 *     responses:
 *       200:
 *         description: AI message generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIMessageResponse'
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
 *                   example: "Invalid request data"
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
 *                   example: "Failed to generate AI message"
 */
