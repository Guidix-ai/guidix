import { resumeApiClient } from '@/lib/api/resumeClient';

/**
 * Upload and process a resume file
 * @param {File} file - Resume file (PDF, DOCX, or TXT)
 * @param {string} resumeName - Optional custom name for the resume
 * @returns {Promise} Upload response with resume data
 */
export const uploadAndProcessResume = async (file, resumeName) => {
  try {
    console.log('📤 uploadAndProcessResume - Starting upload');

    const formData = new FormData();
    formData.append('file', file);
    if (resumeName) {
      formData.append('resume_name', resumeName);
    }

    // Use Next.js API proxy route for file upload
    const response = await fetch('/api/v1/resumes/upload_and_process', {
      method: 'POST',
      credentials: 'include',  // Send cookies
      body: formData,
      // Don't set Content-Type - browser sets it automatically with boundary
    });

    console.log('📤 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Upload failed:', errorData);

      // Handle specific error cases
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
          throw new Error(errorData.message || errorData.detail || 'Upload failed. Please try again');
      }
    }

    const data = await response.json();
    console.log('✅ Resume uploaded successfully');

    // Return the full response
    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error(error.message || 'Network error. Please check your connection');
  }
};

/**
 * Enhance an existing resume using AI
 * @param {string} resumeId - The resume ID to enhance
 * @param {string} templateId - Template ID to use for enhancement
 * @returns {Promise} Enhanced resume data
 */
export const enhanceResume = async (resumeId, templateId = "aa97e710-4457-46fb-ac6f-1765ad3a6d43") => {
  try {
    console.log('🔵 enhanceResume - Starting with template_id:', templateId);

    // Use Next.js API proxy route
    const response = await fetch(`/api/v1/resumes/${resumeId}/enhance`, {
      method: 'POST',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: templateId
      })
    });

    console.log('🔵 Response status:', response.status);

    if (!response.ok) {
      // Safe error parsing
      let errorData = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const errorText = await response.text();
          console.error('❌ Non-JSON error response:', errorText);
          errorData = { message: errorText };
        }
      } catch (parseError) {
        console.error('❌ Failed to parse error response:', parseError);
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }

      console.error('❌ Enhancement failed:', errorData);

      // Handle specific error cases
      if (response.status === 404) {
        throw new Error('Resume not found');
      } else if (response.status === 400) {
        throw new Error(errorData.detail || 'Invalid template or resume');
      } else if (response.status === 500) {
        throw new Error('AI enhancement failed. Please try again');
      }

      throw new Error(errorData.message || errorData.detail || 'Enhancement failed');
    }

    const data = await response.json();
    console.log('✅ Resume enhanced successfully');

    // Return the full response with success flag
    return data;
  } catch (error) {
    console.error('❌ Enhancement error:', error);
    throw new Error(error.message || 'Enhancement failed');
  }
};

/**
 * Create a resume from an AI prompt
 * @param {string} prompt - User prompt for resume generation
 * @param {string} resumeName - Name for the resume
 * @param {string} templateId - Optional template ID
 * @returns {Promise} Created resume data
 */
export const createResumeFromPrompt = async (prompt, resumeName, templateId = "aa97e710-4457-46fb-ac6f-1765ad3a6d43") => {
  try {
    console.log('🟢 createResumeFromPrompt - Starting with template_id:', templateId);
    console.log('🟢 Request payload:', {
      prompt_length: prompt?.length,
      resume_name: resumeName,
      template_id: templateId
    });

    // Use Next.js API proxy route instead of direct backend call
    // This handles cookie forwarding properly
    const response = await fetch('/api/v1/resumes/resume-creation', {
      method: 'POST',
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_prompt: prompt,
        resume_name: resumeName,
        template_id: templateId,
      })
    });

    console.log('🟢 Response status:', response.status);
    console.log('🟢 Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    // Clone response to read body multiple times if needed
    const responseClone = response.clone();

    if (!response.ok) {
      // Try to parse error response, handle cases where body is empty or invalid JSON
      let errorData = {};
      let errorText = '';

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorText = await response.text();
          console.error('❌ Non-JSON error response:', errorText);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse error response:', parseError);
        errorText = await responseClone.text();
        console.error('❌ Raw error response:', errorText);
      }

      console.error('❌ Resume creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        errorText
      });

      // Construct meaningful error message
      const errorMessage =
        errorData.message ||
        errorData.detail ||
        errorText ||
        `HTTP ${response.status}: ${response.statusText}` ||
        'Failed to create resume';

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Resume created successfully:', {
      has_data: !!data.data,
      resume_id: data.data?.resume_id,
      success: data.success
    });

    // Return the full response with success flag
    return data;
  } catch (error) {
    console.error('❌ Resume creation error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw new Error(error.message || 'Failed to create resume');
  }
};

/**
 * Get suggested prompts based on user profile
 * @param {number} academicYear - Academic year (1-8)
 * @param {string} degree - Degree name
 * @param {string} branch - Branch/major
 * @param {string} type - 'internship' or 'job'
 * @returns {Promise} Suggested prompts
 */
export const getSuggestedPrompts = async (academicYear, degree, branch, type) => {
  try {
    console.log('💡 getSuggestedPrompts - Fetching prompts');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai'}/api/v1/resumes/suggested_prompts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        academic_year: academicYear,
        degree,
        branch,
        internship_or_job: type,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to get suggested prompts');
    }

    const data = await response.json();
    console.log('✅ Suggested prompts fetched successfully');
    return data.data || data;
  } catch (error) {
    console.error('❌ Get prompts error:', error);
    throw new Error(error.message || 'Failed to get suggested prompts');
  }
};

/**
 * Save resume assets (PDF and screenshot) to cloud storage
 * @param {string} resumeId - The resume ID
 * @param {File} pdfFile - PDF file of the resume
 * @param {File} screenshot - Screenshot image of the resume
 * @param {string} displayName - Optional display name
 * @returns {Promise} Save response with GCS paths
 */
export const saveResumeAssets = async (resumeId, pdfFile, screenshot, displayName) => {
  try {
    console.log('💾 saveResumeAssets - Saving resume assets');

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('screenshot', screenshot);
    if (displayName) {
      formData.append('display_name', displayName);
    }

    // Use Next.js API proxy route for file upload
    const response = await fetch(`/api/v1/resumes/${resumeId}/save_assets`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type - browser sets it automatically with boundary
    });

    console.log('💾 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Save assets failed:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Failed to save resume assets');
    }

    const data = await response.json();
    console.log('✅ Resume assets saved successfully');
    return data.data || data;
  } catch (error) {
    console.error('❌ Save assets error:', error);
    throw new Error(error.message || 'Failed to save resume assets');
  }
};

/**
 * Get a specific resume by ID
 * @param {string} resumeId - The resume ID
 * @returns {Promise} Resume data
 */
export const getResume = async (resumeId) => {
  try {
    console.log('📄 getResume - Fetching resume:', resumeId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai'}/api/v1/resumes/${resumeId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resume not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to load resume');
    }

    const data = await response.json();
    const resumeData = data.data || data;

    // Validate resume has required fields
    if (!resumeData || !resumeData.resume_id) {
      throw new Error('Invalid resume data');
    }

    console.log('✅ Resume fetched successfully');
    return resumeData;
  } catch (error) {
    console.error('❌ Get resume error:', error);
    throw new Error(error.message || 'Failed to load resume');
  }
};

/**
 * Get all resumes for the authenticated user
 * @returns {Promise} List of resumes
 */
export const getAllResumes = async () => {
  try {
    console.log('📋 getAllResumes - Fetching all resumes');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai'}/api/v1/resumes/resume-list`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to load resumes');
    }

    const data = await response.json();
    const resumes = data.data || data;

    // Ensure response is an array
    if (!Array.isArray(resumes)) {
      console.warn('Response is not an array, returning empty array');
      return [];
    }

    console.log('✅ Fetched', resumes.length, 'resumes');
    return resumes;
  } catch (error) {
    console.error('❌ Get resumes error:', error);
    throw new Error(error.message || 'Failed to load resumes');
  }
};

/**
 * Delete a resume (soft delete)
 * @param {string} resumeId - The resume ID
 * @returns {Promise} Deletion response
 */
export const deleteResume = async (resumeId) => {
  try {
    console.log('🗑️ deleteResume - Deleting resume:', resumeId);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai'}/api/v1/resumes/${resumeId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resume not found');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to delete resume');
    }

    const data = await response.json().catch(() => ({ success: true }));
    console.log('✅ Resume deleted successfully');
    return data.data || data;
  } catch (error) {
    console.error('❌ Delete resume error:', error);
    throw new Error(error.message || 'Failed to delete resume');
  }
};

/**
 * Check service health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  try {
    console.log('🏥 checkHealth - Checking service health');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.guidix.ai'}/health`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { status: 'unhealthy', error: 'Service unavailable' };
    }

    const data = await response.json();
    console.log('✅ Health check successful');
    return data;
  } catch (error) {
    console.error('❌ Health check error:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

/**
 * Upload file with progress tracking
 * NOTE: This function uses axios instead of fetch because fetch API doesn't support
 * native upload progress callbacks. The resumeApiClient is configured with withCredentials: true
 * so cookies are sent automatically. Consider using uploadAndProcessResume() instead if you
 * don't need progress tracking.
 *
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {string} resumeName - Optional resume name
 * @returns {Promise} Upload response
 */
export const uploadWithProgress = async (file, onProgress, resumeName) => {
  try {
    console.log('📊 uploadWithProgress - Starting upload with progress tracking');

    const formData = new FormData();
    formData.append('file', file);
    if (resumeName) {
      formData.append('resume_name', resumeName);
    }

    // Using axios here because fetch doesn't support onUploadProgress
    // resumeApiClient is already configured with withCredentials: true
    const response = await resumeApiClient.post('/api/v1/resumes/upload_and_process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onProgress(percentCompleted);
      },
    });

    console.log('✅ Upload with progress completed');
    return response.data;
  } catch (error) {
    console.error('❌ Upload with progress error:', error);
    throw new Error(error.message || 'Upload failed');
  }
};
