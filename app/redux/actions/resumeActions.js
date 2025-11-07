import { createAsyncThunk } from '@reduxjs/toolkit';
import { resumeApiClient } from '@/lib/api/resumeClient';

/**
 * Resume-related Redux async thunk actions
 * Uses cookie-based authentication via resumeApiClient
 */

/**
 * Fetch all resumes
 */
export const fetchResumes = createAsyncThunk(
  'resume/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeApiClient.get('/api/v1/resumes/resume-list');
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to fetch resumes';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch resume by ID
 */
export const fetchResumeById = createAsyncThunk(
  'resume/fetchResumeById',
  async (resumeId, { rejectWithValue }) => {
    try {
      const response = await resumeApiClient.get(`/api/v1/resumes/${resumeId}`);
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to fetch resume';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create a new resume
 */
export const createResume = createAsyncThunk(
  'resume/createResume',
  async (resumeData, { rejectWithValue }) => {
    try {
      const response = await resumeApiClient.post('/api/v1/resumes/resume-creation', resumeData);
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to create resume';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update existing resume
 */
export const updateResume = createAsyncThunk(
  'resume/updateResume',
  async ({ resumeId, resumeData }, { rejectWithValue }) => {
    try {
      const response = await resumeApiClient.put(`/api/v1/resumes/${resumeId}`, resumeData);
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to update resume';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete resume
 */
export const deleteResume = createAsyncThunk(
  'resume/deleteResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      await resumeApiClient.delete(`/api/v1/resumes/${resumeId}`);
      return resumeId; // Return ID for state update
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to delete resume';
      return rejectWithValue(message);
    }
  }
);

/**
 * Generate AI resume
 */
export const generateAIResume = createAsyncThunk(
  'resume/generateAIResume',
  async ({ prompt, resumeName, templateId }, { rejectWithValue }) => {
    try {
      const response = await resumeApiClient.post('/api/v1/resumes/resume-creation', {
        user_prompt: prompt,
        resume_name: resumeName,
        template_id: templateId || "aa97e710-4457-46fb-ac6f-1765ad3a6d43"
      });
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to generate AI resume';
      return rejectWithValue(message);
    }
  }
);
