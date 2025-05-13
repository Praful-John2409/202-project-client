// src/api.js

const BASE_URL = process.env.REACT_APP_API_URL;

// ✅ 1. For search — just returns the full URL for fetch
export function getSearchUrl(queryParams) {
  return `${BASE_URL}/api/restaurants/search?${queryParams}`;
}

// ✅ 2. For all other requests — handles full fetch logic
export async function apiRequest(path, method = "GET", body = null, customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API ${path} failed: ${response.status} — ${errorText}`);
  }

  return response.json();
}
