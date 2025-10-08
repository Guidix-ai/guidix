import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all jobs
export const fetchJobs = createAsyncThunk(
  'job/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/jobs?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch jobs');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch job by ID
export const fetchJobById = createAsyncThunk(
  'job/fetchById',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch job');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Search jobs
export const searchJobs = createAsyncThunk(
  'job/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to search jobs');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Apply for job
export const applyForJob = createAsyncThunk(
  'job/apply',
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to apply for job');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Add job to wishlist
export const addToWishlist = createAsyncThunk(
  'job/addToWishlist',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${jobId}/wishlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to add to wishlist');
      }

      return jobId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Remove job from wishlist
export const removeFromWishlist = createAsyncThunk(
  'job/removeFromWishlist',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/jobs/${jobId}/wishlist`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to remove from wishlist');
      }

      return jobId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch user's job applications
export const fetchMyApplications = createAsyncThunk(
  'job/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/jobs/my-applications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch applications');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
