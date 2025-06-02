/**
 * Configuration for dynamic routes that should not be statically generated
 * This file works with the Next.js App Router
 */

export const dynamicRoutes = [
  '/campaigns/create',
  '/segments/[id]',
  '/customers/[id]',
  '/orders/[id]',
];

// Export this constant to mark pages as dynamic
export const dynamic = 'force-dynamic';
