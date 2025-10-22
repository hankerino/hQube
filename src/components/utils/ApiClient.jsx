// API configuration for new backend
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001';

export const api = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // User management
  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateUser: async (userData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/user/update`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Entity operations
  createEntity: async (entityName, data) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/entities/${entityName}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getEntities: async (entityName, filters = {}) => {
    const token = localStorage.getItem('auth_token');
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/entities/${entityName}?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },

  updateEntity: async (entityName, id, data) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/entities/${entityName}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // File upload
  uploadFile: async (file) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  // AI integrations
  invokeLLM: async (prompt, options = {}) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/ai/llm`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ prompt, ...options })
    });
    return response.json();
  },

  // Email service
  sendEmail: async (emailData) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/email/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(emailData)
    });
    return response.json();
  }
};

export default api;