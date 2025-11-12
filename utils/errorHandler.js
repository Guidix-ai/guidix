/**
 * Standardized API Error Handler
 * Returns structured error information
 * Handles both Axios and Fetch API errors
 */
export function handleApiError(error) {
  console.error('API Error:', error);

  // Structure to return
  const errorInfo = {
    message: '',
    type: 'error',
    shouldRedirect: false,
    redirectUrl: null,
    fieldErrors: null,
    statusCode: null
  };

  // Axios error with response
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    errorInfo.statusCode = status;

    switch (status) {
      case 400:
        errorInfo.message = data.detail || data.message || 'Invalid request';
        errorInfo.type = 'validation';
        break;

      case 401:
        errorInfo.message = 'Session expired. Please log in again';
        errorInfo.type = 'auth';
        errorInfo.shouldRedirect = true;
        errorInfo.redirectUrl = '/login?message=session_expired';
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
        break;

      case 403:
        errorInfo.message = data.detail || data.message || 'You do not have permission';
        errorInfo.type = 'permission';
        break;

      case 404:
        errorInfo.message = data.detail || data.message || 'Resource not found';
        errorInfo.type = 'not_found';
        break;

      case 413:
        errorInfo.message = 'File is too large. Please upload a smaller file';
        errorInfo.type = 'validation';
        break;

      case 422:
        // Validation error with field details
        errorInfo.type = 'validation';

        if (data.detail && Array.isArray(data.detail)) {
          // FastAPI validation error format
          errorInfo.fieldErrors = data.detail.map(err => ({
            field: err.loc?.[err.loc.length - 1] || 'unknown',
            message: err.msg
          }));
          errorInfo.message = 'Please check your input';
        } else if (data.errors && Array.isArray(data.errors)) {
          // Custom validation error format
          errorInfo.fieldErrors = data.errors;
          errorInfo.message = data.errors.map(e => e.message).join(', ');
        } else {
          errorInfo.message = data.detail || data.message || 'Validation failed';
        }
        break;

      case 429:
        errorInfo.message = 'Too many requests. Please try again in a moment';
        errorInfo.type = 'rate_limit';
        break;

      case 500:
      case 502:
      case 503:
        errorInfo.message = 'Server error. Please try again later';
        errorInfo.type = 'server';
        break;

      default:
        errorInfo.message = data.detail || data.message || `Error: ${status}`;
        errorInfo.type = 'unknown';
    }
  }
  // Network error (Axios)
  else if (error.request) {
    errorInfo.message = 'Network error. Please check your connection';
    errorInfo.type = 'network';
  }
  // Handle plain Error objects (from fetch or thrown errors)
  else if (error instanceof Error) {
    const message = error.message || 'An unexpected error occurred';

    // Check if error message contains auth-related keywords
    if (message.includes('Session expired') || message.includes('401') || message.includes('Unauthorized')) {
      errorInfo.message = 'Session expired. Please log in again';
      errorInfo.type = 'auth';
      errorInfo.shouldRedirect = true;
      errorInfo.redirectUrl = '/login?message=session_expired';
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    }
    // Check if error is a network issue
    else if (message.includes('Network error') || message.includes('Failed to fetch') || message.includes('NetworkError')) {
      errorInfo.message = 'Network error. Please check your connection';
      errorInfo.type = 'network';
    }
    // Check if error indicates server issues
    else if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('Server error')) {
      errorInfo.message = 'Server error. Please try again later';
      errorInfo.type = 'server';
    }
    // Check if error is not found
    else if (message.includes('404') || message.includes('not found')) {
      errorInfo.message = message;
      errorInfo.type = 'not_found';
    }
    // Generic error handling
    else {
      errorInfo.message = message;
      errorInfo.type = 'unknown';
    }
  }
  // Fallback for non-Error objects
  else {
    errorInfo.message = 'An unexpected error occurred';
    errorInfo.type = 'unknown';
  }

  return errorInfo;
}

/**
 * Show error to user (use in components)
 * @param {Object} errorInfo - Error info from handleApiError
 * @param {Function} setError - State setter for error message
 */
export function showError(errorInfo, setError) {
  setError(errorInfo.message);

  // Handle redirect if needed
  if (errorInfo.shouldRedirect && errorInfo.redirectUrl) {
    setTimeout(() => {
      window.location.href = errorInfo.redirectUrl;
    }, 1000);
  }
}

/**
 * Log error for debugging
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
export function logError(context, error) {
  console.error(`[${context}]`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    stack: error.stack
  });
}
