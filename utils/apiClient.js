import { API_BASE_URL } from '@/lib/api-config';

/**
 * Universal API Client using Cookie-Based Authentication
 * Cookies are sent automatically by browser - no manual token management
 */
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL || API_BASE_URL;
  }

  /**
   * Make an authenticated API request
   * @param {string} endpoint - API endpoint (e.g., '/api/v1/resumes')
   * @param {RequestInit} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: 'include',  // CRITICAL: Send cookies!
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error('401 Unauthorized - Session expired');

      // Clear any localStorage (cleanup)
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login?message=session_expired';
      }

      throw new Error('Session expired');
    }

    // Handle other errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new Error(errorData.message || errorData.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Upload files with FormData
   */
  async upload(endpoint, formData, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',  // CRITICAL!
      body: formData,
      // Don't set Content-Type for FormData - browser sets it with boundary
      ...options,
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login?message=session_expired';
      }
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return response.json();
  }
}

// Create API clients for each service
export const authAPI = new APIClient(API_BASE_URL);
export const resumeAPI = new APIClient(API_BASE_URL);
export const autoApplyAPI = new APIClient(API_BASE_URL);
export const walletAPI = new APIClient(API_BASE_URL);
export const linkedinAPI = new APIClient(API_BASE_URL);
export const interviewAPI = new APIClient(API_BASE_URL);

// Export the class for custom instances
export default APIClient;
