/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - name
 *         - messageTemplate
 *         - segmentId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the campaign
 *         description:
 *           type: string
 *           description: Description of the campaign
 *         messageTemplate:
 *           type: string
 *           description: Message template with placeholders for personalization
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *           description: Scheduled date for campaign delivery
 *         segmentId:
 *           type: string
 *           description: ID of the customer segment targeted by the campaign
 *         status:
 *           type: string
 *           description: Current status of the campaign
 *           enum: [draft, scheduled, active, completed, cancelled]
 *         metadata:
 *           type: object
 *           description: Additional metadata for the campaign
 *       example:
 *         name: "Summer Sale 2025"
 *         description: "Promotional campaign for summer products"
 *         messageTemplate: "Hi {{customer.firstName}}, check out our summer deals with {{campaign.discount}}% off!"
 *         scheduledDate: "2025-06-15T10:00:00.000Z"
 *         segmentId: "6077c80b9c8a4a001f9b6b8c"
 *         status: "draft"
 *         metadata:
 *           discount: "20"
 *
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management operations
 */

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     description: Creates a new marketing campaign
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     description: Retrieves a list of all campaigns
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campaign'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by ID
 *     tags: [Campaigns]
 *     description: Retrieves a specific campaign by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the campaign to retrieve
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 *
 * /api/campaigns/{id}/launch:
 *   post:
 *     summary: Launch a campaign
 *     tags: [Campaigns]
 *     description: Changes campaign status to active and initiates message delivery
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the campaign to launch
 *     responses:
 *       200:
 *         description: Campaign launched successfully
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
 *                   example: "Campaign launched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6077c80b9c8a4a001f9b6b8d"
 *                     status:
 *                       type: string
 *                       example: "active"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
