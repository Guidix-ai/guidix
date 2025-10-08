import { createAsyncThunk } from '@reduxjs/toolkit';

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Login failed');
      }

      const data = await response.json();
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Registration failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('authToken');

      // Optional: Call logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Verify token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue('Token verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);
