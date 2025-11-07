import { createAsyncThunk } from '@reduxjs/toolkit';
import { jobApiClient } from '@/lib/api/jobClient';

/**
 * Job-related Redux async thunk actions
 * Uses cookie-based authentication via jobApiClient
 */

/**
 * Fetch all jobs
 */
export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobApiClient.get('/api/v1/jobs/', { params });
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to fetch jobs';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch job by ID
 */
export const fetchJobById = createAsyncThunk(
  'job/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobApiClient.get(`/api/v1/jobs/${jobId}`);
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to fetch job';
      return rejectWithValue(message);
    }
  }
);

/**
 * Search jobs
 */
export const searchJobs = createAsyncThunk(
  'job/searchJobs',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await jobApiClient.post('/api/v1/jobs/search', searchParams);
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Search failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Apply for a job
 */
export const applyForJob = createAsyncThunk(
  'job/applyForJob',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await jobApiClient.post(`/api/v1/applications/`, {
        job_id: jobId,
        ...applicationData
      });
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Application failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Add job to wishlist
 */
export const addToWishlist = createAsyncThunk(
  'job/addToWishlist',
  async (jobId, { rejectWithValue }) => {
    try {
      // Update job status to 'wishlist'
      const response = await jobApiClient.patch(
        `/api/v1/jobs/user/0/job/${jobId}/status`,
        { status: 'wishlist' }
      );
      return jobId; // Return jobId for state update
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to add to wishlist';
      return rejectWithValue(message);
    }
  }
);

/**
 * Remove job from wishlist
 */
export const removeFromWishlist = createAsyncThunk(
  'job/removeFromWishlist',
  async (jobId, { rejectWithValue }) => {
    try {
      // Update job status to null or 'removed'
      const response = await jobApiClient.patch(
        `/api/v1/jobs/user/0/job/${jobId}/status`,
        { status: null }
      );
      return jobId; // Return jobId for state update
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to remove from wishlist';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch user's job applications
 */
export const fetchMyApplications = createAsyncThunk(
  'job/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobApiClient.get('/api/v1/applications/');
      return response.data?.data || response.data;
    } catch (error) {
      const errorData = error.response?.data;
      const message = errorData?.detail || errorData?.message || error.message || 'Failed to fetch applications';
      return rejectWithValue(message);
    }
  }
);
