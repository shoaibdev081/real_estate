const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

let rawApiBase = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? 'http://localhost:5000/api' : 'https://api.mondabrothers.com/api')
).trim().replace(/\/+$/, '');

if (isLocalhost && rawApiBase.includes('mondabrothers.com')) {
  rawApiBase = 'http://localhost:5000/api';
}

const API_BASE_URL = rawApiBase;

async function handleResponse(response) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  const ok = response.ok && (data?.success !== false);

  if (!ok) {
    const message =
      data?.message ||
      (response.status === 401
        ? 'You are not authorized. Please log in again.'
        : `Request failed with status ${response.status}`);

    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export async function apiRequest(path, { method = 'GET', body, token, headers = {} } = {}) {
  const url = `${API_BASE_URL}${path}`;

  const finalHeaders = new Headers();

  // Only set JSON header and serialize when body is a plain object/array (not already a string or FormData)
  const isPlainObject = body && !(body instanceof FormData) && typeof body !== 'string';
  if (isPlainObject) {
    finalHeaders.set('Content-Type', 'application/json');
  } else if (typeof body === 'string') {
    finalHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  Object.entries(headers).forEach(([key, value]) => {
    finalHeaders.set(key, value);
  });

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isPlainObject ? JSON.stringify(body) : body,
  });

  return handleResponse(response);
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
    const serverOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${serverOrigin}${clean}`;
  }
  return clean;
}

export { API_BASE_URL };

