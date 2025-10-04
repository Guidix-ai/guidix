// Authentication utility functions

/**
 * Refresh access token using refresh token from HTTP-only cookie
 * @returns {Promise<boolean>} True if refresh successful, false otherwise
 */
export async function refreshAccessToken() {
  try {
    // Call Next.js API route which reads refresh token from HTTP-only cookie
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok && data.data?.tokens) {
      // Tokens are automatically updated in HTTP-only cookies by the API route
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

/**
 * Setup automatic token refresh before expiry
 */
export function setupTokenRefresh() {
  const checkAndRefresh = async () => {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return;

    const expiryTime = parseInt(expiry) * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    // Refresh 5 minutes before expiry
    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      const success = await refreshAccessToken();
      if (!success) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
  };

  // Check every minute
  const interval = setInterval(checkAndRefresh, 60 * 1000);

  // Check immediately
  checkAndRefresh();

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Make authenticated API request with automatic token refresh
 * @param {string} url - API endpoint URL
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function authenticatedFetch(url, options = {}) {
  const accessToken = localStorage.getItem('access_token');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // If unauthorized, try refreshing token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry request with new token
      const newToken = localStorage.getItem('access_token');
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return response;
}

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * Note: Actual token is in HTTP-only cookie, we check localStorage flag
 * @returns {boolean}
 */
export function isAuthenticated() {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const user = getCurrentUser();
  return !!(isAuth && user);
}

/**
 * Logout user and clear all auth data
 */
export async function logout() {
  try {
    // Call Next.js API route which will clear HTTP-only cookies and call backend
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');

    // Redirect to login with logout message
    window.location.href = '/login?message=logged_out';
  }
}
