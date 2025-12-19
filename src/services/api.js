import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const companyService = {
  getAll: async (searchTerm = null) => {
    const params = searchTerm ? { search: searchTerm } : {};
    const response = await api.get('/company', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/company/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/company/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/company/${id}`);
  },
};

export default api;
