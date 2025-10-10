import { jobApiClient } from '@/lib/api/jobClient';

/**
 * Get jobs with AI match scores using resume upload
 * This is called when the job search page loads
 * @param {File} file - Resume file (PDF, DOCX, or TXT)
 * @param {number} limit - Number of jobs to fetch (default: 20)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithResumeUpload = async (file, limit = 20, offset = 0) => {
  const formData = new FormData();
  formData.append('resume_file', file);

  const response = await jobApiClient.post('/api/v1/integrated-jobs/with-resume-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: { limit, offset }
  });
  return response.data;
};

/**
 * Get job details by job ID
 * @param {number} jobId - The job ID
 * @returns {Promise} Job details
 */
export const getJobDetails = async (jobId) => {
  const response = await jobApiClient.get(`/api/v1/integrated-jobs/${jobId}`);
  return response.data;
};

/**
 * Add job to wishlist
 * @param {number} jobId - The job ID
 * @returns {Promise} Wishlist response
 */
export const addToWishlist = async (jobId) => {
  const response = await jobApiClient.post(`/api/v1/integrated-jobs/${jobId}/wishlist`);
  return response.data;
};

/**
 * Remove job from wishlist
 * @param {number} jobId - The job ID
 * @returns {Promise} Response
 */
export const removeFromWishlist = async (jobId) => {
  // The API uses the same endpoint for toggle, but we'll use the status endpoint
  const response = await jobApiClient.patch(
    `/api/v1/integrated-jobs/user/0/job/${jobId}/status`,
    { status: 'viewed' } // Change status from wishlist to viewed
  );
  return response.data;
};

/**
 * Mark job as not interested (dismiss/block)
 * @param {number} jobId - The job ID
 * @returns {Promise} Response
 */
export const markNotInterested = async (jobId) => {
  const response = await jobApiClient.post(`/api/v1/integrated-jobs/${jobId}/not-interested`);
  return response.data;
};

/**
 * Set job status (applied, wishlist, etc.)
 * @param {number} jobId - The job ID
 * @param {string} status - Status enum (viewed, wishlist, applied, etc.)
 * @param {Object} statusData - Optional metadata
 * @returns {Promise} Status response
 */
export const setJobStatus = async (jobId, status, statusData = {}) => {
  const userId = 0; // Will be extracted from token by backend
  const response = await jobApiClient.patch(
    `/api/v1/integrated-jobs/user/${userId}/job/${jobId}/status`,
    { status, status_data: statusData }
  );
  return response.data;
};

/**
 * Get user's job statuses (wishlist, applied, etc.)
 * @param {string} status - Filter by status (optional)
 * @param {number} limit - Number of results (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} User job statuses
 */
export const getUserJobStatuses = async (status = null, limit = 50, offset = 0) => {
  const userId = 0; // Will be extracted from token by backend
  const params = { limit, offset };
  if (status) params.status = status;

  const response = await jobApiClient.get(`/api/v1/integrated-jobs/user/${userId}/job-statuses`, {
    params
  });
  return response.data;
};

/**
 * Get wishlist jobs with full details
 * @param {number} limit - Number of results (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} Wishlist jobs
 */
export const getWishlist = async (limit = 50, offset = 0) => {
  const response = await jobApiClient.get('/api/v1/integrated-jobs/wishlist', {
    params: { limit, offset }
  });
  return response.data;
};

/**
 * Get similar jobs
 * @param {number} jobId - The job ID
 * @param {number} limit - Number of results (default: 10)
 * @returns {Promise} Similar jobs
 */
export const getSimilarJobs = async (jobId, limit = 10) => {
  const response = await jobApiClient.get(`/api/v1/integrated-jobs/${jobId}/similar`, {
    params: { limit }
  });
  return response.data;
};

/**
 * Search jobs with filters and full-text search
 * @param {string} query - Search keywords
 * @param {Object} filters - Search filters (location, employment_type, skills, etc.)
 * @param {string} pageToken - Pagination token (optional)
 * @returns {Promise} Search results with jobs
 */
export const searchJobs = async (query, filters = {}, pageToken = null) => {
  const requestBody = {
    user_id: 0, // Will be extracted from token by backend
    query,
    page_size: 20,
    ...filters
  };

  if (pageToken) {
    requestBody.page_token = pageToken;
  }

  const response = await jobApiClient.post('/api/v1/integrated-jobs/search', requestBody);
  return response.data;
};

/**
 * Get jobs with AI scoring using saved resume ID (Old endpoint - GET)
 * @param {number} resumeId - Resume ID from resume service
 * @param {number} limit - Number of jobs (default: 20)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force API call to TheirStack (default: false)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithAIScoring = async (resumeId, limit = 20, offset = 0, forceRefresh = false) => {
  const response = await jobApiClient.get('/api/v1/integrated-jobs/', {
    params: { resume_id: resumeId, limit, offset, force_refresh: forceRefresh }
  });
  return response.data;
};

/**
 * Get jobs with AI-powered match scores using resume_id (POST endpoint)
 * @param {string} resumeId - Resume UUID from resume service (e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
 * @param {number} limit - Number of jobs to fetch (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force refresh from external API (default: false)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithResumeId = async (resumeId, limit = 20, offset = 0, forceRefresh = false) => {
  const response = await jobApiClient.post(
    '/api/v1/integrated-jobs/with-resume-id',
    null, // No request body
    {
      params: {
        resume_id: resumeId,
        limit: limit,
        offset: offset,
        force_refresh: forceRefresh
      }
    }
  );
  return response.data;
};

/**
 * Get personalized job recommendations based on user history
 * @param {number} limit - Number of recommendations (default: 10)
 * @returns {Promise} Recommended jobs
 */
export const getRecommendations = async (limit = 10) => {
  const response = await jobApiClient.get('/api/v1/integrated-jobs/recommendations', {
    params: { limit }
  });
  return response.data;
};

/**
 * Get trending jobs based on view counts
 * @param {string} timePeriod - "day" | "week" | "month" (default: "week")
 * @param {string} location - Filter by location (optional)
 * @param {string} industry - Filter by industry (optional)
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise} Trending jobs with view counts
 */
export const getTrendingJobs = async (timePeriod = 'week', location = null, industry = null, limit = 20) => {
  const params = { time_period: timePeriod, limit };
  if (location) params.location = location;
  if (industry) params.industry = industry;

  const response = await jobApiClient.get('/api/v1/integrated-jobs/trending', { params });
  return response.data;
};

/**
 * Job status enum
 */
export const JobStatusEnum = {
  VIEWED: 'viewed',
  WISHLIST: 'wishlist',
  APPLIED: 'applied',
  INTERVIEWED: 'interviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  UNINTERESTED: 'uninterested'
};
