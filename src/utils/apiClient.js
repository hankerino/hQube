const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('authToken');

const request = async (endpoint, options) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
};

export const apiClient = {
  // Auth
  signUp: (email, password, fullName) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  // User
  getMe: () =>
    request('/users/me'),

  updateMe: (updates) =>
    request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Analysis
  createAnalysis: (analysisData) =>
    request('/analysis', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    }),

  getAnalyses: () =>
    request('/analysis'),

  // Support
  createTicket: (ticketData) =>
    request('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),

  getTickets: () =>
    request('/support/tickets'),

  // Integrations
  invokeLLM: (prompt, response_json_schema) =>
    request('/integrations/llm', {
      method: 'POST',
      body: JSON.stringify({ prompt, response_json_schema }),
    }),

  sendEmail: (to, subject, body, from_name) =>
    request('/integrations/email', {
      method: 'POST',
      body: JSON.stringify({ to, subject, body, from_name }),
    }),
};
