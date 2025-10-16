import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * =============================================================================
 * AXIOS INSTANCE WITH INTERCEPTORS
 * =============================================================================
 * This axios instance automatically:
 * 1. Attaches access token to all requests (except auth endpoints)
 * 2. Handles 401 errors by refreshing the token
 * 3. Retries the original request with new token
 */

// Base API URL - uses your actual backend URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

/**
 * List of endpoints that don't require authentication
 * These are the actual endpoints from your backend based on the documentation
 */
const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/signin", // Login endpoint
  "/api/v1/auth/signup", // Register endpoint (signup, not register!)
  "/api/v1/auth/forgot-password", // Forgot password
  "/api/v1/auth/reset-password", // Reset password
  "/api/v1/auth/refresh", // Token refresh
  "/api/v1/auth/verify-email", // Email verification
];

/**
 * Check if endpoint requires authentication
 */
const requiresAuth = (url) => {
  return !PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

/**
 * REQUEST INTERCEPTOR
 * Attaches access token to all authenticated requests
 * NOTE: Passwords in request payload are normal and expected for authentication.
 * The browser DevTools will show them in Network tab, but they are encrypted in transit via HTTPS.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Only add token for authenticated endpoints
    if (requiresAuth(config.url)) {
      const accessToken =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // Prevent accidental logging of sensitive data
    // Override console methods during request to filter out passwords
    if (process.env.NODE_ENV === "development") {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      // Temporarily override console methods to filter passwords
      const sanitize = (args) => {
        return args.map((arg) => {
          if (typeof arg === "object" && arg !== null) {
            const sanitized = { ...arg };
            if (sanitized.password) sanitized.password = "***REDACTED***";
            if (sanitized.new_password)
              sanitized.new_password = "***REDACTED***";
            if (sanitized.confirmPassword)
              sanitized.confirmPassword = "***REDACTED***";
            return sanitized;
          }
          return arg;
        });
      };

      console.log = (...args) => originalLog(...sanitize(args));
      console.error = (...args) => originalError(...sanitize(args));
      console.warn = (...args) => originalWarn(...sanitize(args));

      // Restore after a short delay
      setTimeout(() => {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
      }, 100);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handles 401 errors by refreshing token and retrying request
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or is from a public endpoint, reject immediately
    if (
      error.response?.status !== 401 ||
      !requiresAuth(originalRequest.url) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // Mark that we're refreshing
    originalRequest._retry = true;
    isRefreshing = true;

    // Try to refresh the token using localStorage
    try {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refresh_token")
          : null;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call backend refresh endpoint directly
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      if (response.data && response.data.data?.tokens) {
        const { access_token, refresh_token, token_expiry } =
          response.data.data.tokens;

        // Store new tokens in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", access_token);
          if (refresh_token) {
            localStorage.setItem("refresh_token", refresh_token);
          }
          if (token_expiry) {
            localStorage.setItem("token_expiry", token_expiry.toString());
          }
        }

        // Update authorization header
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queued requests
        processQueue(null, access_token);

        // Retry original request
        return axiosInstance(originalRequest);
      }
    } catch (refreshError) {
      // Refresh failed - clear tokens and redirect to login
      processQueue(refreshError, null);

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login?session=expired";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * =============================================================================
 * ASYNC THUNK ACTIONS
 * =============================================================================
 */

/**
 * LOGIN USER (SIGNIN)
 * Endpoint: POST /api/v1/auth/signin
 * @param {Object} credentials - { email, password, remember_me }
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Call backend signin endpoint directly
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/signin`,
        credentials
      );

      if (response.data && response.data.data) {
        const { user, tokens } = response.data.data;

        // Store tokens and all user data in localStorage
        if (typeof window !== "undefined") {
          // Store tokens
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);
          if (tokens.expires_at) {
            localStorage.setItem("token_expiry", tokens.expires_at.toString());
          }

          // Store user data
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAuthenticated", "true");

          // Store individual user fields for easy access
          if (user.email) localStorage.setItem("userEmail", user.email);
          if (user.full_name) localStorage.setItem("userName", user.full_name);
          if (user.phone_number)
            localStorage.setItem("userPhone", user.phone_number);
          if (user.university_domain)
            localStorage.setItem("userUniversity", user.university_domain);
          if (user.id) localStorage.setItem("userId", user.id);
        }

        return { user, tokens };
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail || // FastAPI/Python style
        errorData?.message || // Node/Express style
        errorData?.error || // Generic error field
        error.message || // JavaScript error message
        "Login failed"; // Fallback

      console.error("🔴 Login Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * REGISTER USER (SIGNUP)
 * Endpoint: POST /api/v1/auth/signup
 * @param {Object} userData - { email, password, full_name, phone_number?, university_domain? }
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Call backend directly for signup (no token needed)
      const response = await axiosInstance.post(
        "/api/v1/auth/signup",
        userData
      );

      if (response.data && response.data.data) {
        const { user } = response.data.data;

        // Note: Signup doesn't return tokens - user needs to verify email first
        // Store user info temporarily
        if (typeof window !== "undefined") {
          localStorage.setItem("pendingUser", JSON.stringify(user));
        }

        return { user, message: response.data.message };
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Registration failed";

      console.error("🔴 Registration Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * LOGOUT USER
 * Endpoint: POST /api/v1/auth/logout
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call backend logout endpoint
      await axios.post(
        `${API_BASE_URL}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : ""
            }`,
          },
        }
      );

      // Clear all localStorage items
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhone");
        localStorage.removeItem("userUniversity");
        localStorage.removeItem("userId");
        localStorage.removeItem("pendingUser");
      }

      return true;
    } catch (error) {
      // Even if API call fails, clear all local data
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userPhone");
        localStorage.removeItem("userUniversity");
        localStorage.removeItem("userId");
        localStorage.removeItem("pendingUser");
      }

      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Logout failed";

      console.error("🔴 Logout Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * GET USER PROFILE
 * Example of a protected API call that uses automatic token handling
 * Endpoint: GET /api/v1/auth/profile (or whatever your backend uses)
 */
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      // This request will automatically include the access token
      // If token is expired, it will automatically refresh and retry
      const response = await axiosInstance.get("/api/v1/auth/profile");

      if (response.data && response.data.data) {
        const user = response.data.data.user;

        // Update user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        return user;
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Failed to fetch profile";

      console.error("🔴 Get Profile Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * UPDATE USER PROFILE
 * @param {Object} profileData - Updated profile data
 */
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/v1/auth/profile",
        profileData
      );

      if (response.data && response.data.data) {
        const user = response.data.data.user;

        // Update user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        return user;
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Failed to update profile";

      console.error("🔴 Update Profile Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * FORGOT PASSWORD
 * Endpoint: POST /api/v1/auth/forgot-password
 * @param {string} email - User email
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/forgot-password",
        { email }
      );
      return response.data.message || "Password reset email sent";
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Failed to send reset email";

      console.error("🔴 Forgot Password Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * RESET PASSWORD
 * Endpoint: POST /api/v1/auth/reset-password
 * @param {Object} data - { token, new_password }
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/reset-password",
        data
      );
      return response.data.message || "Password reset successful";
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Failed to reset password";

      console.error("🔴 Reset Password Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * VERIFY EMAIL
 * Endpoint: POST /api/v1/auth/verify-email
 * @param {string} token - Verification token
 */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/auth/verify-email", {
        token,
      });
      return response.data.message || "Email verified successfully";
    } catch (error) {
      // Extract exact error message from backend
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        error.message ||
        "Email verification failed";

      console.error("🔴 Verify Email Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * =============================================================================
 * EXPORT AXIOS INSTANCE FOR OTHER API CALLS
 * =============================================================================
 * Use this instance in your other API services to get automatic:
 * - Token injection
 * - Token refresh on 401
 * - Request retry
 *
 * Example:
 * import { axiosInstance } from '@/app/redux/actions/authActions';
 *
 * export const fetchResumes = () => {
 *   return axiosInstance.get('/api/v1/resumes/resume-list');
 * };
 */
export default axiosInstance;
