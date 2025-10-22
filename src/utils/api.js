const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hqube-backend.onrender.com';

export const api = {
  async sendEmail(data) {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Email failed: ${response.statusText}`);
    }
    return response.json();
  },

  async invokeLLM(data) {
    const response = await fetch(`${API_BASE_URL}/api/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`LLM failed: ${response.statusText}`);
    }
    return response.json();
  }
};
