/**
 * Cookie utility functions for token management
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration (optional)
 */
export function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
export function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

/**
 * Set auth tokens in cookies
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {number} expiresAt - Token expiry timestamp (optional)
 */
export function setAuthTokens(accessToken, refreshToken, expiresAt) {
  // Access token expires in 1 hour
  setCookie('access_token', accessToken, 1/24);
  // Refresh token expires in 7 days
  setCookie('refresh_token', refreshToken, 7);
  if (expiresAt) {
    setCookie('token_expiry', expiresAt.toString(), 7);
  }
}

/**
 * Get auth tokens from cookies
 * @returns {Object} Tokens object
 */
export function getAuthTokens() {
  return {
    access_token: getCookie('access_token'),
    refresh_token: getCookie('refresh_token'),
    token_expiry: getCookie('token_expiry')
  };
}

/**
 * Clear all auth tokens from cookies
 */
export function clearAuthTokens() {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
  deleteCookie('token_expiry');
}
