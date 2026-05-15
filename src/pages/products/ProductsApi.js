// src/pages/products/productsApi.js
import axios from 'axios';

export const API_BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com/api';
export const STATIC_BASE_URL = 'https://smartlabtechbackend-p5h6.onrender.com';

// Axios instance — token read fresh on every request via interceptor
export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Build a public image URL from a Windows/Unix path stored in DB
export const imgUrl = (path) =>
  path ? `${STATIC_BASE_URL}/${path.replace(/\\/g, '/')}` : null;

export const fmtPrice = (v) =>
  v != null
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
    : '—';