/**
 * API Response Utilities
 * Handles response unwrapping and validation
 */

/**
 * Unwrap API response and validate
 * @param {Promise} apiCallPromise - The API call promise
 * @returns {Promise<any>} - The data from response.data
 */
export async function unwrapResponse(apiCallPromise) {
  try {
    // Await the API call
    const axiosResponse = await apiCallPromise;

    // Extract response data (Axios wraps in .data)
    const response = axiosResponse.data;

    // Check if response has expected structure
    if (typeof response !== 'object' || response === null) {
      throw new Error('Invalid response format');
    }

    // Check success flag
    if (response.success === false) {
      throw new Error(response.message || response.detail || 'Operation failed');
    }

    // Return just the data part
    return response.data;
  } catch (error) {
    // If already an Error object, throw it
    if (error instanceof Error) {
      throw error;
    }

    // If Axios error, extract message
    if (error.response?.data) {
      const data = error.response.data;
      throw new Error(data.message || data.detail || 'API request failed');
    }

    // Generic error
    throw new Error(error.message || 'Unknown error occurred');
  }
}

/**
 * Validate response has required fields
 * @param {Object} data - Response data
 * @param {Array<string>} requiredFields - Required field names
 * @throws {Error} If validation fails
 */
export function validateResponse(data, requiredFields = []) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response data');
  }

  const missingFields = requiredFields.filter(field => !(field in data));

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
}
