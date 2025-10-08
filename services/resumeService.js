import { resumeApiClient } from '@/lib/api/resumeClient';

/**
 * Upload and process a resume file
 * @param {File} file - Resume file (PDF, DOCX, or TXT)
 * @param {string} resumeName - Optional custom name for the resume
 * @returns {Promise} Upload response with resume data
 */
export const uploadAndProcessResume = async (file, resumeName) => {
  const formData = new FormData();
  formData.append('file', file);
  if (resumeName) {
    formData.append('resume_name', resumeName);
  }

  const response = await resumeApiClient.post('/api/v1/resumes/upload_and_process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Enhance an existing resume using AI
 * @param {string} resumeId - The resume ID to enhance
 * @param {string} templateId - Template ID to use for enhancement
 * @returns {Promise} Enhanced resume data
 */
export const enhanceResume = async (resumeId, templateId = "aa97e710-4457-46fb-ac6f-1765ad3a6d43") => {
  const response = await resumeApiClient.post(`/api/v1/resumes/${resumeId}/enhance`, {
    template_id: templateId
  });
  return response.data;
};

/**
 * Create a resume from an AI prompt
 * @param {string} prompt - User prompt for resume generation
 * @param {string} resumeName - Name for the resume
 * @param {string} templateId - Optional template ID
 * @returns {Promise} Created resume data
 */
export const createResumeFromPrompt = async (prompt, resumeName, templateId = "41aab622-839d-454e-bf99-9d5a2ce027ec") => {
  const response = await resumeApiClient.post('/api/v1/resumes/resume-creation', {
    user_prompt: prompt,
    resume_name: resumeName,
    template_id: templateId,
  });
  return response.data;
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
  const response = await resumeApiClient.post('/api/v1/resumes/suggested_prompts', {
    academic_year: academicYear,
    degree,
    branch,
    internship_or_job: type,
  });
  return response.data;
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
  const formData = new FormData();
  formData.append('pdf_file', pdfFile);
  formData.append('screenshot', screenshot);
  if (displayName) {
    formData.append('display_name', displayName);
  }

  const response = await resumeApiClient.put(
    `/api/v1/resumes/${resumeId}/save_assets`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Get a specific resume by ID
 * @param {string} resumeId - The resume ID
 * @returns {Promise} Resume data
 */
export const getResume = async (resumeId) => {
  const response = await resumeApiClient.get(`/api/v1/resumes/${resumeId}`);
  return response.data;
};

/**
 * Get all resumes for the authenticated user
 * @returns {Promise} List of resumes
 */
export const getAllResumes = async () => {
  const response = await resumeApiClient.get('/api/v1/resumes/resume-list');
  return response.data;
};

/**
 * Check service health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  const response = await resumeApiClient.get('/health');
  return response.data;
};

/**
 * Upload file with progress tracking
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {string} resumeName - Optional resume name
 * @returns {Promise} Upload response
 */
export const uploadWithProgress = async (file, onProgress, resumeName) => {
  const formData = new FormData();
  formData.append('file', file);
  if (resumeName) {
    formData.append('resume_name', resumeName);
  }

  const response = await resumeApiClient.post('/api/v1/resumes/upload_and_process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      onProgress(percentCompleted);
    },
  });

  return response.data;
};
