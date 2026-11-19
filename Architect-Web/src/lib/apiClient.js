import axios from 'axios';

// Detect if running locally in browser
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Set your backend API base URL via .env (VITE_API_URL)
// Normalize URL: ensure it always ends with /api and has no trailing slash
let rawBaseUrl = (import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : 'https://api.mondabrothers.com/api')).trim().replace(/\/+$/, '');

// If running in a local browser (e.g. localhost:5173), always route /api and local /uploads to localhost:5000
if (isLocalhost && rawBaseUrl.includes('mondabrothers.com')) {
  rawBaseUrl = 'http://localhost:5000/api';
}

if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const baseUrl = rawBaseUrl;

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // set true if using cookies/auth
});

// Premium API request wrapper
export async function apiRequest(url, options = {}) {
  const config = {
    url,
    method: options.method || 'GET',
    headers: { ...options.headers },
    ...options,
  };
  if (options.body) config.data = options.body;
  const res = await api(config);
  return res.data;
}

export function getImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (clean.startsWith('/uploads/')) {
    const serverOrigin = baseUrl.replace(/\/api\/?$/, '');
    return `${serverOrigin}${clean}`;
  }
  return clean;
}
