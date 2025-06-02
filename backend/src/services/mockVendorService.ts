import axios from 'axios';

/**
 * Mock Vendor API Service
 * Simulates a third-party messaging service with success/failure rates
 */

/**
 * Send a message via the mock vendor
 * @param messageId Unique identifier for the message
 * @param message The message content
 * @param recipient Recipient contact (phone/email)
 * @param callbackUrl URL to notify when delivery status changes
 * @param batchId Batch ID for grouping messages
 */
export const sendMessage = async (
  messageId: string,
  message: string,
  recipient: string,
  callbackUrl: string,
  batchId: string
): Promise<{ success: boolean; messageId: string }> => {
  try {
    console.log(`[MOCK VENDOR] Sending message to ${recipient}: ${message.substring(0, 30)}...`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate 90% success, 10% failure rate
    const isSuccessful = Math.random() < 0.9;
    
    // Send a delivery receipt callback
    setTimeout(async () => {
      try {
        await axios.post(callbackUrl, {
          messageId,
          status: isSuccessful ? 'delivered' : 'failed',
          timestamp: new Date().toISOString(),
          batchId
        });
        console.log(`[MOCK VENDOR] Delivery receipt sent for message ${messageId}: ${isSuccessful ? 'delivered' : 'failed'}`);
      } catch (error) {
        console.error('[MOCK VENDOR] Failed to send delivery receipt:', error);
      }
    }, 1000 + Math.random() * 3000); // Random delay between 1-4 seconds
    
    return {
      success: true, // API call success (not message delivery success)
      messageId
    };
  } catch (error) {
    console.error('[MOCK VENDOR] Error sending message:', error);
    throw error;
  }
};

/**
 * Simulates vendor API endpoints
 */
export const initMockVendorEndpoints = (app: any): void => {
  app.post('/api/vendor/send-message', async (req: any, res: any) => {
    try {
      const { messageId, message, recipient, callbackUrl, batchId } = req.body;
      
      if (!messageId || !message || !recipient || !callbackUrl) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters'
        });
      }
      
      // Process the message asynchronously
      sendMessage(messageId, message, recipient, callbackUrl, batchId)
        .catch(error => console.error('[MOCK VENDOR] Async error:', error));
      
      // Immediately return success to simulate async processing
      res.status(200).json({
        success: true,
        messageId,
        message: 'Message accepted for delivery'
      });
    } catch (error) {
      console.error('[MOCK VENDOR] API error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal vendor service error'
      });
    }
  });
};

export default {
  sendMessage,
  initMockVendorEndpoints
};
