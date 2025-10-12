// Integration utilities for new backend
import { api } from './ApiClient';

export const InvokeLLM = async ({ prompt, add_context_from_internet = false, response_json_schema = null, file_urls = null }) => {
  return await api.invokeLLM(prompt, {
    add_context_from_internet,
    response_json_schema,
    file_urls
  });
};

export const SendEmail = async ({ to, subject, body, from_name = null }) => {
  return await api.sendEmail({ to, subject, body, from_name });
};

export const UploadFile = async ({ file }) => {
  return await api.uploadFile(file);
};

export const GenerateImage = async ({ prompt }) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${process.env.REACT_APP_API_URL}/ai/image`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ prompt })
  });
  return response.json();
};

export const ExtractDataFromUploadedFile = async ({ file_url, json_schema }) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${process.env.REACT_APP_API_URL}/ai/extract`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ file_url, json_schema })
  });
  return response.json();
};