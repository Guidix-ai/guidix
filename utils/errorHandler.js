/**
 * Handle API errors and return exact backend error messages
 * @param {Error} error - The error object
 * @returns {string} Exact error message from backend or fallback
 */
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    const errorData = error.response.data;

    // Try to extract error message from various possible fields (backend may use different formats)
    // Check detail field (FastAPI/Python backends)
    if (errorData?.detail) {
      // Handle both string and object detail
      if (typeof errorData.detail === 'string') {
        return errorData.detail;
      }
      if (typeof errorData.detail === 'object' && errorData.detail.message) {
        return errorData.detail.message;
      }
    }

    // Check message field (Node/Express backends)
    if (errorData?.message) {
      return errorData.message;
    }

    // Check error field
    if (errorData?.error) {
      if (typeof errorData.error === 'string') {
        return errorData.error;
      }
      if (typeof errorData.error === 'object' && errorData.error.message) {
        return errorData.error.message;
      }
    }

    // Check errors array (validation errors)
    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      // Handle array of error objects
      if (typeof errorData.errors[0] === 'object') {
        const errorMessages = errorData.errors
          .map(err => err.message || err.msg || err.detail || JSON.stringify(err))
          .filter(Boolean);
        return errorMessages.join(', ');
      }
      // Handle array of strings
      return errorData.errors.join(', ');
    }

    // If we have the full error data as a string, use it
    if (typeof errorData === 'string') {
      return errorData;
    }

    // Log the full error response for debugging
    console.error('🔴 Backend Error Response:', errorData);
    console.error('🔴 Status Code:', error.response.status);

    // Default HTTP error messages (only as last resort)
    const statusMessages = {
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Forbidden. You do not have permission to perform this action.',
      404: 'Resource not found.',
      500: 'Internal server error. Please try again later.',
      503: 'Service unavailable. Please try again later.',
    };

    return statusMessages[error.response.status] || `Error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Log error for debugging with full details
 * @param {string} context - Where the error occurred
 * @param {Error} error - The error object
 */
export const logError = (context, error) => {
  console.group(`🔴 Error in ${context}`);
  console.error('Message:', error.message);
  console.error('Status:', error.response?.status);
  console.error('Status Text:', error.response?.statusText);

  // Log the full error response data
  if (error.response?.data) {
    console.error('Backend Response:', error.response.data);

    // Specifically highlight common error fields
    const data = error.response.data;
    if (data.detail) console.error('  ↳ detail:', data.detail);
    if (data.message) console.error('  ↳ message:', data.message);
    if (data.error) console.error('  ↳ error:', data.error);
    if (data.errors) console.error('  ↳ errors:', data.errors);
  }

  console.error('Full Error Object:', error);
  console.groupEnd();
};
