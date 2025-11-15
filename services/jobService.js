const JOB_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

/**
 * Get jobs with AI match scores using resume upload
 * This is called when the job search page loads
 * @param {File} file - Resume file (PDF, DOCX, or TXT, max 10MB)
 * @param {number} limit - Number of jobs to fetch (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force fresh fetch from TheirStack API (default: false)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithResumeUpload = async (
  file,
  limit = 20,
  offset = 0,
  forceRefresh = false
) => {
  try {
    console.log('📤 getJobsWithResumeUpload - Starting upload');

    const formData = new FormData();
    formData.append("resume_file", file);

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/with-resume-upload`);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);
    url.searchParams.append('force_refresh', forceRefresh);

    const response = await fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',  // Send cookies
      body: formData,
      // Don't set Content-Type - browser sets it automatically with boundary
    });

    console.log('📤 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get jobs with resume upload failed:', errorData);

      switch (response.status) {
        case 400:
          throw new Error(errorData.detail || 'Invalid file. Please upload PDF, DOCX, or TXT');
        case 413:
          throw new Error('File is too large. Maximum size is 10MB');
        case 422:
          throw new Error(errorData.detail || 'File validation failed');
        case 401:
          throw new Error('Session expired. Please log in again');
        default:
          throw new Error(errorData.message || errorData.detail || 'Failed to fetch jobs');
      }
    }

    const data = await response.json();
    console.log('✅ Jobs fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get jobs error:', error);
    throw new Error(error.message || 'Network error. Please check your connection');
  }
};

/**
 * Get job details by job ID
 * @param {string} jobId - The job UUID
 * @returns {Promise} Job details
 */
export const getJobDetails = async (jobId) => {
  try {
    console.log('📄 getJobDetails - Fetching job:', jobId);

    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/${jobId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Job not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to load job details');
    }

    const data = await response.json();
    console.log('✅ Job details fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get job details error:', error);
    throw new Error(error.message || 'Failed to load job details');
  }
};

/**
 * Add job to wishlist
 * @param {string} jobId - The job UUID
 * @returns {Promise} Wishlist response
 */
export const addToWishlist = async (jobId) => {
  try {
    console.log('⭐ addToWishlist - Adding job to wishlist:', jobId);

    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/${jobId}/wishlist`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Add to wishlist failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to add to wishlist');
    }

    const data = await response.json();
    console.log('✅ Job added to wishlist successfully');
    return data;
  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    throw new Error(error.message || 'Failed to add to wishlist');
  }
};

/**
 * Remove job from wishlist
 * @param {string} jobId - The job UUID
 * @returns {Promise} Response
 */
export const removeFromWishlist = async (jobId) => {
  try {
    console.log('⭐ removeFromWishlist - Removing job from wishlist:', jobId);

    // Backend extracts user_id from access_token cookie
    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/job/${jobId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: "viewed" }), // Change status from wishlist to viewed
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Remove from wishlist failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to remove from wishlist');
    }

    const data = await response.json();
    console.log('✅ Job removed from wishlist successfully');
    return data;
  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    throw new Error(error.message || 'Failed to remove from wishlist');
  }
};

/**
 * Mark job as not interested (dismiss/block)
 * @param {string} jobId - The job UUID
 * @returns {Promise} Response
 */
export const markNotInterested = async (jobId) => {
  try {
    console.log('🚫 markNotInterested - Marking job as not interested:', jobId);

    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/${jobId}/not-interested`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Mark not interested failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to mark as not interested');
    }

    const data = await response.json();
    console.log('✅ Job marked as not interested successfully');
    return data;
  } catch (error) {
    console.error('❌ Mark not interested error:', error);
    throw new Error(error.message || 'Failed to mark as not interested');
  }
};

/**
 * Set job status (applied, wishlist, etc.)
 * @param {string} jobId - The job UUID
 * @param {string} status - Status enum (viewed, wishlist, applied, etc.)
 * @param {Object} statusData - Optional metadata
 * @returns {Promise} Status response
 */
export const setJobStatus = async (jobId, status, statusData = {}) => {
  try {
    console.log('🔄 setJobStatus - Setting job status:', { jobId, status });

    // Backend extracts user_id from access_token cookie
    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/job/${jobId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, status_data: statusData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Set job status failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to set job status');
    }

    const data = await response.json();
    console.log('✅ Job status set successfully');
    return data;
  } catch (error) {
    console.error('❌ Set job status error:', error);
    throw new Error(error.message || 'Failed to set job status');
  }
};

/**
 * Get user's job statuses (wishlist, applied, etc.)
 * @param {string} status - Filter by status (optional)
 * @param {number} limit - Number of results (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} User job statuses
 */
export const getUserJobStatuses = async (
  status = null,
  limit = 50,
  offset = 0
) => {
  try {
    console.log('📋 getUserJobStatuses - Fetching user job statuses');

    // Backend extracts user_id from cookie
    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/job-statuses`);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);
    if (status) url.searchParams.append('status', status);

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get user job statuses failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch job statuses');
    }

    const data = await response.json();
    console.log('✅ User job statuses fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get user job statuses error:', error);
    throw new Error(error.message || 'Failed to fetch job statuses');
  }
};

/**
 * Get wishlist jobs with full details
 * @param {number} limit - Number of results (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise} Wishlist jobs
 */
export const getWishlist = async (limit = 50, offset = 0) => {
  try {
    console.log('⭐ getWishlist - Fetching wishlist jobs');

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/wishlist`);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get wishlist failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch wishlist');
    }

    const data = await response.json();
    console.log('✅ Wishlist fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    throw new Error(error.message || 'Failed to fetch wishlist');
  }
};

/**
 * Get similar jobs
 * @param {string} jobId - The job UUID
 * @param {number} limit - Number of results (default: 10)
 * @returns {Promise} Similar jobs
 */
export const getSimilarJobs = async (jobId, limit = 10) => {
  try {
    console.log('🔍 getSimilarJobs - Fetching similar jobs for:', jobId);

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/${jobId}/similar`);
    url.searchParams.append('limit', limit);

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get similar jobs failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch similar jobs');
    }

    const data = await response.json();
    console.log('✅ Similar jobs fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get similar jobs error:', error);
    throw new Error(error.message || 'Failed to fetch similar jobs');
  }
};

/**
 * Search jobs with filters and full-text search
 * @param {string} query - Search keywords
 * @param {Object} filters - Search filters (location, employment_type, skills, etc.)
 * @param {string} pageToken - Pagination token (optional)
 * @returns {Promise} Search results with jobs
 */
export const searchJobs = async (query, filters = {}, pageToken = null) => {
  try {
    console.log('🔍 searchJobs - Searching jobs with query:', query);

    const requestBody = {
      // No user_id - backend extracts from cookie
      query,
      page_size: 20,
      ...filters,
    };

    if (pageToken) {
      requestBody.page_token = pageToken;
    }

    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/search`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Search jobs failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to search jobs');
    }

    const data = await response.json();
    console.log('✅ Jobs search completed successfully');
    return data;
  } catch (error) {
    console.error('❌ Search jobs error:', error);
    throw new Error(error.message || 'Failed to search jobs');
  }
};

/**
 * Get jobs with AI scoring using saved resume ID (DEPRECATED - use getJobsWithResumeId instead)
 * @param {number} resumeId - Resume ID from resume service
 * @param {number} limit - Number of jobs (default: 20)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force API call to TheirStack (default: false)
 * @returns {Promise} Jobs with AI match scores
 * @deprecated Use getJobsWithResumeId instead
 */
export const getJobsWithAIScoring = async (
  resumeId,
  limit = 20,
  offset = 0,
  forceRefresh = false
) => {
  console.warn(
    "⚠️ getJobsWithAIScoring is deprecated. Use getJobsWithResumeId instead."
  );
  return getJobsWithResumeId(resumeId, limit, offset, forceRefresh);
};

/**
 * Get jobs with AI-powered match scores using resume_id (GET endpoint - Recommended)
 * @param {string} resumeId - Resume UUID from resume service (e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
 * @param {number} limit - Number of jobs to fetch (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force refresh from external API (default: false)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithResumeId = async (
  resumeId,
  limit = 20,
  offset = 0,
  forceRefresh = false
) => {
  try {
    console.log('🎯 getJobsWithResumeId - Fetching jobs with resume ID:', resumeId);

    const response = await fetch(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/with-resume-id`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: {
          resume_id: resumeId,
          limit: limit,
          offset: offset,
          force_refresh: forceRefresh,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get jobs with resume ID failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch jobs');
    }

    const data = await response.json();
    console.log('✅ Jobs with resume ID fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get jobs with resume ID error:', error);
    throw new Error(error.message || 'Failed to fetch jobs');
  }
};

/**
 * Get jobs with AI-powered match scores using resume_id (POST endpoint - Alternative)
 * @param {string} resumeId - Resume UUID from resume service
 * @param {number} limit - Number of jobs to fetch (default: 20, max: 100)
 * @param {number} offset - Offset for pagination (default: 0)
 * @param {boolean} forceRefresh - Force refresh from external API (default: false)
 * @returns {Promise} Jobs with AI match scores
 */
export const getJobsWithResumeIdPost = async (
  resumeId,
  limit = 20,
  offset = 0,
  forceRefresh = false
) => {
  try {
    console.log('🎯 getJobsWithResumeIdPost - Fetching jobs with resume ID:', resumeId);

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/with-resume-id`);
    url.searchParams.append('resume_id', resumeId);
    url.searchParams.append('limit', limit);
    url.searchParams.append('offset', offset);
    url.searchParams.append('force_refresh', forceRefresh);

    const response = await fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get jobs with resume ID (POST) failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch jobs');
    }

    const data = await response.json();
    console.log('✅ Jobs with resume ID (POST) fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get jobs with resume ID (POST) error:', error);
    throw new Error(error.message || 'Failed to fetch jobs');
  }
};

/**
 * Get personalized job recommendations based on user history
 * @param {number} limit - Number of recommendations (default: 10)
 * @returns {Promise} Recommended jobs
 */
export const getRecommendations = async (limit = 10) => {
  try {
    console.log('💡 getRecommendations - Fetching job recommendations');

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/recommendations`);
    url.searchParams.append('limit', limit); 

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get recommendations failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch recommendations');
    }

    const data = await response.json();
    console.log('✅ Job recommendations fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Get recommendations error:', error);
    throw new Error(error.message || 'Failed to fetch recommendations');
  }
};

/**
 * Get trending jobs based on view counts
 * @param {string} timePeriod - "day" | "week" | "month" (default: "week")
 * @param {string} location - Filter by location (optional)
 * @param {string} industry - Filter by industry (optional)
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise} Trending jobs with view counts
 */
export const getTrendingJobs = async (
  timePeriod = "week",
  location = null,
  industry = null,
  limit = 20
) => {
  try {
    console.log('📈 getTrendingJobs - Fetching trending jobs');

    const url = new URL(`${JOB_SERVICE_URL}/api/v1/integrated-jobs/trending`);
    url.searchParams.append('time_period', timePeriod);
    url.searchParams.append('limit', limit);
    if (location) url.searchParams.append('location', location);
    if (industry) url.searchParams.append('industry', industry);

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Get trending jobs failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch trending jobs');
    }

    const data = await response.json();
    console.log('✅ Trending jobs fetched successfully'); 
    return data;
  } catch (error) {
    console.error('❌ Get trending jobs error:', error);
    throw new Error(error.message || 'Failed to fetch trending jobs');
  }
};

/**
 * BACKWARD COMPATIBILITY - Export alias for getJobsWithResumeId
 * Old name: getIntegratedJobsWithResumeId
 * New name: getJobsWithResumeId (correct endpoint path)
 */
export const getIntegratedJobsWithResumeId = getJobsWithResumeId;

/**
 * REMOVED - getIntegratedJobsWithUpload
 * This function used the wrong endpoint path: /integrated-jobs/upload
 * Use getJobsWithResumeUpload instead, which uses the correct path: /api/v1/integrated-jobs/with-resume-upload
 */

/**
 * Job status enum
 */
export const JobStatusEnum = {
  VIEWED: "viewed",
  WISHLIST: "wishlist",
  APPLIED: "applied",
  INTERVIEWED: "interviewed",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  UNINTERESTED: "uninterested",
};
