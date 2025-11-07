import axios from "axios";

const RESUME_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

/**
 * Resume API Client
 * Uses cookie-based authentication (withCredentials: true)
 * Cookies are sent automatically - no manual token management
 */
export const resumeApiClient = axios.create({
  baseURL: RESUME_SERVICE_URL,
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
resumeApiClient.interceptors.request.use(
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
resumeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information for debugging
    console.error('Resume API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
    });

    if (error.response?.status === 401) {
      // Session expired - redirect to login
      if (typeof window !== "undefined") {
        // Clear any localStorage (cleanup)
        localStorage.clear();
        window.location.href = "/login?message=session_expired";
      }
    }

    // For network errors, provide helpful message
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network Error: Cannot reach API server at', RESUME_SERVICE_URL);
      console.error('Make sure:');
      console.error('1. Backend API is running');
      console.error('2. CORS is configured to allow credentials from', window?.location?.origin);
      console.error('3. NEXT_PUBLIC_API_BASE_URL is set correctly');
    }

    return Promise.reject(error);
  }
);
