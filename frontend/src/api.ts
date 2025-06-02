import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function register(email: string, password: string) {
  return axios.post(`${API_URL}/api/auth/register`, { email, password });
}

export async function login(email: string, password: string) {
  return axios.post(`${API_URL}/api/auth/login`, { email, password });
}

export async function uploadCSV(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/api/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchData(token: string) {
  return axios.get(`${API_URL}/api/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
