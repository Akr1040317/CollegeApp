import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68ae63baf386f11349f96701", 
  requiresAuth: true // Ensure authentication is required for all operations
});
