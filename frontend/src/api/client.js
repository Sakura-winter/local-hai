export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('localhai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      localStorage.removeItem('localhai_token');
      localStorage.removeItem('localhai_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || `HTTP error ${response.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${config.method} ${url}]:`, err);
    throw err;
  }
}

