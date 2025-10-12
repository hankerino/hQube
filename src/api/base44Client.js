import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "685cf9598ce2d3a098d933e4", 
  requiresAuth: true // Ensure authentication is required for all operations
});
