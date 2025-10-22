// Entity management utilities
import { api } from './ApiClient';
import { auth } from './AuthUtils';

export const createEntitySDK = (entityName) => ({
  create: async (data) => {
    return await api.createEntity(entityName, data);
  },

  list: async (orderBy = '-created_date', limit = 50) => {
    return await api.getEntities(entityName, { orderBy, limit });
  },

  filter: async (filters = {}, orderBy = '-created_date', limit = 50) => {
    return await api.getEntities(entityName, { ...filters, orderBy, limit });
  },

  update: async (id, data) => {
    return await api.updateEntity(entityName, id, data);
  },

  delete: async (id) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/entities/${entityName}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
});

// Export entity SDKs
export const User = {
  ...createEntitySDK('User'),
  me: async () => {
    return await auth.getCurrentUser();
  },
  login: async () => {
    return await auth.login();
  },
  logout: async () => {
    return await auth.logout();
  },
  updateMyUserData: async (data) => {
    return await auth.updateUserData(data);
  }
};

export const AnalysisRequest = createEntitySDK('AnalysisRequest');
export const SupportTicket = createEntitySDK('SupportTicket');