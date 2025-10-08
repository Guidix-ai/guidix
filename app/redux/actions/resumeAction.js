import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all resumes
export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/resumes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch resumes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Fetch single resume by ID
export const fetchResumeById = createAsyncThunk(
  'resume/fetchById',
  async (resumeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch resume');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Create new resume
export const createResume = createAsyncThunk(
  'resume/create',
  async (resumeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create resume');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Update existing resume
export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ resumeId, resumeData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update resume');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Delete resume
export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (resumeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete resume');
      }

      return resumeId;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Generate AI resume
export const generateAIResume = createAsyncThunk(
  'resume/generateAI',
  async (promptData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/resumes/ai-generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to generate AI resume');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
