const BASE_URL = 'https://theyorkpulse.uk';

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // 重要：携带 session cookie
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  const data = await response.json();
  
  return { ok: response.ok, status: response.status, data };
}

export const api = {
  login: (payload) => apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  logout: () => apiRequest('/logout', { method: 'POST' }),
  
  me: () => apiRequest('/api/me'),
};
