/**
 * API Configuration - Production Setup
 *
 * ALL API CALLS SHOULD GO THROUGH API GATEWAY
 *
 * API Gateway Routes:
 * - /api/v1/auth/*          → authentication-service
 * - /api/v1/users/*         → authentication-service
 * - /api/v1/resumes/*       → resume-service
 * - /api/v1/integrated-jobs/* → auto-apply-service
 */

// Primary: API Gateway URL (RECOMMENDED)
export const API_GATEWAY_URL =
  typeof window !== "undefined"
    ? window.ENV?.NEXT_PUBLIC_API_GATEWAY_URL ||
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ||
      "https://api.guidix.ai" // Fallback to main API
    : process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.guidix.ai";

// All services use API Gateway
export const API_BASE_URL = API_GATEWAY_URL;
export const RESUME_SERVICE_URL = API_GATEWAY_URL;
export const JOB_SERVICE_URL = API_GATEWAY_URL;

// Alternative: Direct service URLs (NOT RECOMMENDED - bypasses API Gateway)
// Only use if you're not using API Gateway:
// export const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
// export const RESUME_SERVICE_URL = process.env.NEXT_PUBLIC_RESUME_SERVICE_URL;
// export const JOB_SERVICE_URL = process.env.NEXT_PUBLIC_AUTO_APPLY_SERVICE_URL;

// Frontend URLs (for redirects/navigation)
export const FRONTEND_BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

/**
 * Get full API URL through gateway
 * @param {string} endpoint - API endpoint (e.g., '/api/v1/auth/signin')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_GATEWAY_URL}${cleanEndpoint}`;
}

/**
 * Get full frontend URL
 * @param {string} path - Frontend path (e.g., '/dashboard')
 * @returns {string} Full frontend URL
 */
export function getFrontendUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${FRONTEND_BASE_URL}${cleanPath}`;
}
