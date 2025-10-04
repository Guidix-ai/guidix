import { refreshAccessToken } from './auth';
import { API_BASE_URL } from '@/lib/api-config';

/**
 * Universal API Client for making authenticated requests
 * Handles token refresh automatically
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
    const accessToken = localStorage.getItem('access_token');

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Retry with new token
        const newToken = localStorage.getItem('access_token');
        const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status}`);
        }

        return retryResponse.json();
      } else {
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
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
}

// Create API clients for each service
// All services use the same base URL (consolidated backend)
export const authAPI = new APIClient(API_BASE_URL);

export const resumeAPI = new APIClient(API_BASE_URL);

export const autoApplyAPI = new APIClient(API_BASE_URL);

// Export the class for custom instances
export default APIClient;
