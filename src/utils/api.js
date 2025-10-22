const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hqube-backend.onrender.com';

export const api = {
  async sendEmail(data) {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async invokeLLM(data) {
    const response = await fetch(`${API_BASE_URL}/api/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
