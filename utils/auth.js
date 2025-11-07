/**
 * Authentication Utilities
 * Cookie-based authentication - no localStorage token management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

/**
 * Check if user is authenticated
 * We can't check cookies from JavaScript (HttpOnly)
 * So we make a test API call to verify authentication
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get current user data
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;  // Handle both response formats
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Logout user
 * Calls Next.js API route which clears cookies
 */
export async function logout() {
  try {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear localStorage (cleanup any old data)
    localStorage.clear();

    // Redirect to login
    window.location.href = '/login?message=logged_out';
  }
}

/**
 * Handle authentication failure
 * Called when 401 errors occur
 */
export async function handleAuthFailure(reason = 'session_expired') {
  console.log('Authentication failure:', reason);

  // Clear localStorage
  localStorage.clear();

  // Redirect to login with message
  window.location.href = `/login?message=${reason}`;
}
