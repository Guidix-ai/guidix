import axios from "axios";

const RESUME_SERVICE_URL =
  process.env.NEXT_PUBLIC_RESUME_SERVICE_URL || "https://api.guidix.ai";

export const resumeApiClient = axios.create({
  baseURL: RESUME_SERVICE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
resumeApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
resumeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
