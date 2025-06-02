/**
 * Test configuration for Google OAuth
 * This is a temporary file to test different configurations
 */

// The client ID used in your application
export const googleClientId = '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

// Modify the providers.tsx file to import this configuration
// Replace:
// const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';
// With:
// import { googleClientId } from '@/config/oauth-test';

/**
 * TROUBLESHOOTING CHECKLIST
 * 
 * 1. Verify in Google Cloud Console:
 *    - Authorized JavaScript origins must include http://localhost:3000
 *    - Check that the OAuth consent screen is properly configured
 *    - Ensure the Google Identity Services API is enabled
 * 
 * 2. Check if your application is actually running on the origin you've authorized
 *    - You verified it's running on port 3000
 * 
 * 3. Try alternative ways to authenticate:
 *    - Using Google One Tap instead of the standard button
 *    - Using a service like NextAuth.js which handles much of the OAuth complexity
 *
 * 4. Restart your development server after making changes
 */
