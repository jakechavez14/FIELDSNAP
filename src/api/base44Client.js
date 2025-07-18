import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687a70689d2cce8cf26a10b9", 
  requiresAuth: true // Ensure authentication is required for all operations
});
