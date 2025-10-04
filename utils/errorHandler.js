/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    const errorData = error.response.data;

    if (errorData?.message) {
      return errorData.message;
    }

    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors.join(', ');
    }

    // Default HTTP error messages
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
 * Log error for debugging
 * @param {string} context - Where the error occurred
 * @param {Error} error - The error object
 */
export const logError = (context, error) => {
  console.error(`[${context}]`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  });
};
