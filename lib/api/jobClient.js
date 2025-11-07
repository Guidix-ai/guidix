import axios from "axios";

const JOB_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

/**
 * Job API Client
 * Uses cookie-based authentication (withCredentials: true)
 * Cookies are sent automatically - no manual token management
 */
export const jobApiClient = axios.create({
  baseURL: JOB_SERVICE_URL,
  timeout: 30000,
  withCredentials: true,  // CRITICAL: Enables cookie sending
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * NO Authorization header needed - cookies handle authentication
 */
jobApiClient.interceptors.request.use(
  (config) => {
    // Just return config - cookies are sent automatically
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle authentication errors by redirecting to login
 */
jobApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired - redirect to login
      if (typeof window !== "undefined") {
        // Clear any localStorage (cleanup)
        localStorage.clear();
        window.location.href = "/login?message=session_expired";
      }
    }
    return Promise.reject(error);
  }
);
