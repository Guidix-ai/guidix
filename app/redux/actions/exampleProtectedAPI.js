/**
 * =============================================================================
 * EXAMPLE PROTECTED API CALLS
 * =============================================================================
 * This file demonstrates how to make protected API calls using the
 * axios instance with automatic token handling and refresh logic.
 *
 * All these API calls will:
 * 1. Automatically attach the access token from cookies
 * 2. Automatically refresh the token if it expires (401)
 * 3. Retry the original request with the new token
 */

import { axiosInstance } from './authActions';
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * =============================================================================
 * SIMPLE PROTECTED API CALLS (using axios directly)
 * =============================================================================
 */

/**
 * FETCH USER DASHBOARD DATA
 * Simple GET request example
 */
export const fetchDashboardData = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * FETCH USER SETTINGS
 * Another GET request example
 */
export const fetchUserSettings = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/users/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * UPDATE USER SETTINGS
 * POST request example with data
 */
export const updateUserSettings = async (settings) => {
  try {
    const response = await axiosInstance.post('/api/v1/users/settings', settings);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * UPLOAD USER AVATAR
 * Example with FormData (file upload)
 */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.post('/api/v1/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * =============================================================================
 * REDUX THUNK PROTECTED API CALLS
 * =============================================================================
 * Use createAsyncThunk when you want Redux to manage loading/error states
 */

/**
 * FETCH NOTIFICATIONS
 * Example of protected API call as Redux async thunk
 */
export const fetchNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/notifications');
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      return rejectWithValue(message);
    }
  }
);

/**
 * MARK NOTIFICATION AS READ
 * Example with URL parameter
 */
export const markNotificationRead = createAsyncThunk(
  'user/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/v1/notifications/${notificationId}/read`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to mark notification as read';
      return rejectWithValue(message);
    }
  }
);

/**
 * DELETE ACCOUNT
 * Example of DELETE request
 */
export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/api/v1/users/account', {
        data: { password }, // DELETE with body
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete account';
      return rejectWithValue(message);
    }
  }
);

/**
 * =============================================================================
 * EXAMPLE: FETCHING LIST WITH PAGINATION AND FILTERS
 * =============================================================================
 */
export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async ({ page = 1, limit = 10, search = '', filters = {} }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit,
        search,
        ...filters,
      });

      const response = await axiosInstance.get(`/api/v1/items?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch items';
      return rejectWithValue(message);
    }
  }
);

/**
 * =============================================================================
 * EXAMPLE: BATCH OPERATIONS
 * =============================================================================
 */
export const batchUpdateItems = createAsyncThunk(
  'items/batchUpdate',
  async (items, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/items/batch-update', { items });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update items';
      return rejectWithValue(message);
    }
  }
);

/**
 * =============================================================================
 * EXAMPLE: DOWNLOAD FILE
 * =============================================================================
 */
export const downloadReport = async (reportId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/reports/${reportId}/download`, {
      responseType: 'blob', // Important for file downloads
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * =============================================================================
 * USAGE IN COMPONENTS
 * =============================================================================
 *
 * Example 1: Using simple async functions
 * ----------------------------------------
 * import { fetchDashboardData } from '@/app/redux/actions/exampleProtectedAPI';
 *
 * const MyComponent = () => {
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(false);
 *
 *   useEffect(() => {
 *     const loadData = async () => {
 *       setLoading(true);
 *       try {
 *         const result = await fetchDashboardData();
 *         setData(result);
 *       } catch (error) {
 *         console.error('Error:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *     loadData();
 *   }, []);
 *
 *   return <div>{loading ? 'Loading...' : JSON.stringify(data)}</div>;
 * };
 *
 *
 * Example 2: Using Redux thunks
 * ----------------------------------------
 * import { useDispatch, useSelector } from 'react-redux';
 * import { fetchNotifications } from '@/app/redux/actions/exampleProtectedAPI';
 *
 * const NotificationsComponent = () => {
 *   const dispatch = useDispatch();
 *   const { notifications, loading } = useSelector(state => state.notifications);
 *
 *   useEffect(() => {
 *     dispatch(fetchNotifications());
 *   }, [dispatch]);
 *
 *   return (
 *     <div>
 *       {loading ? 'Loading...' : notifications.map(n => <div key={n.id}>{n.message}</div>)}
 *     </div>
 *   );
 * };
 *
 *
 * Example 3: Using with user actions (buttons)
 * ----------------------------------------
 * import { markNotificationRead } from '@/app/redux/actions/exampleProtectedAPI';
 *
 * const NotificationItem = ({ notification }) => {
 *   const dispatch = useDispatch();
 *
 *   const handleMarkRead = async () => {
 *     try {
 *       await dispatch(markNotificationRead(notification.id)).unwrap();
 *       // Success - notification marked as read
 *     } catch (error) {
 *       console.error('Failed to mark as read:', error);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <p>{notification.message}</p>
 *       <button onClick={handleMarkRead}>Mark as Read</button>
 *     </div>
 *   );
 * };
 */

export default axiosInstance;
