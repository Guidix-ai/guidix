/**
 * API Configuration
 * Centralizes API URL configuration for backend and frontend
 */

// Backend API URLs (for fetch/API calls)
export const API_BASE_URL = typeof window !== 'undefined'
  ? (window.ENV?.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');

// Frontend URLs (for redirects/navigation) - not needed for API calls
export const FRONTEND_BASE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');

/**
 * Get full backend API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/signin')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Get full frontend URL
 * @param {string} path - Frontend path (e.g., '/dashboard')
 * @returns {string} Full frontend URL
 */
export function getFrontendUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${FRONTEND_BASE_URL}${cleanPath}`;
}
