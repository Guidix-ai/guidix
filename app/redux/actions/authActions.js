import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * =============================================================================
 * AXIOS INSTANCE WITH COOKIE AUTHENTICATION
 * =============================================================================
 * This axios instance uses cookies for authentication (withCredentials: true)
 * NO localStorage token management
 * NO Authorization headers
 */

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // CRITICAL: Send cookies automatically
});

/**
 * REQUEST INTERCEPTOR
 * No Authorization header needed - cookies handle everything
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Just return config - cookies sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle 401 errors by redirecting to login
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, return it
    return response;
  },
  async (error) => {
    // If 401, session expired - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear localStorage (cleanup)
        localStorage.clear();

        // Redirect to login
        window.location.href = "/login?message=session_expired";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * =============================================================================
 * ASYNC THUNK ACTIONS
 * =============================================================================
 */

/**
 * LOGIN USER (SIGNIN)
 * Uses Next.js API route which handles cookie setting
 * @param {Object} credentials - { email, password }
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Call Next.js API route (NOT backend directly!)
      const response = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        credentials: 'include',  // CRITICAL!
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || error.detail || 'Login failed');
      }

      const data = await response.json();

      // Cookies are set automatically by Next.js API route
      // Store only user data in Redux (NOT tokens!)
      return data.data;
    } catch (error) {
      console.error("🔴 Login Error:", error);
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

/**
 * REGISTER USER (SIGNUP)
 * @param {Object} userData - { email, password, full_name, phone_number?, university_domain? }
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Call backend signup endpoint directly (no auth needed)
      const response = await axiosInstance.post("/api/v1/auth/signup", userData);

      if (response.data && response.data.data) {
        const { user } = response.data.data;
        return { user, message: response.data.message };
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
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
 * Uses Next.js API route which clears cookies
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call Next.js API route (NOT backend directly!)
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',  // CRITICAL!
      });

      // Clear localStorage (cleanup)
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      return true;
    } catch (error) {
      // Even if API call fails, clear local data
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      console.error("🔴 Logout Error:", error);
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

/**
 * GET USER PROFILE
 * Verifies authentication by fetching current user
 */
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Call /users/me endpoint - cookie sent automatically
      const response = await axiosInstance.get("/api/v1/users/me");

      if (response.data && response.data.data) {
        return response.data.data;
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
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
        "/api/v1/user-management/me/profile",
        profileData
      );

      if (response.data && response.data.data) {
        return response.data.data;
      }

      return rejectWithValue("Invalid response format");
    } catch (error) {
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        error.message ||
        "Failed to update profile";

      console.error("🔴 Update Profile Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * VERIFY EMAIL
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
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        error.message ||
        "Email verification failed";

      console.error("🔴 Verify Email Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * FORGOT PASSWORD
 * @param {string} email - User's email address
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/auth/forgot-password", {
        email,
      });
      return response.data.message || "Password reset email sent successfully";
    } catch (error) {
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        error.message ||
        "Failed to send reset email";

      console.error("🔴 Forgot Password Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * RESET PASSWORD
 * @param {Object} resetData - { token, new_password }
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/auth/reset-password", resetData);
      return response.data.message || "Password reset successfully";
    } catch (error) {
      const errorData = error.response?.data;
      const message =
        errorData?.detail ||
        errorData?.message ||
        error.message ||
        "Password reset failed";

      console.error("🔴 Reset Password Error:", errorData || error.message);
      return rejectWithValue(message);
    }
  }
);

/**
 * =============================================================================
 * EXPORT AXIOS INSTANCE FOR OTHER API CALLS
 * =============================================================================
 * Use this instance in your other API services to get automatic:
 * - Cookie authentication
 * - 401 handling with redirect
 */
export default axiosInstance;
