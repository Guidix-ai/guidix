import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../actions/authActions';

/**
 * =============================================================================
 * INITIAL STATE
 * =============================================================================
 */
const initialState = {
  // User data
  user: null,

  // Authentication status
  isAuthenticated: false,

  // Tokens (stored in cookies, but we track their existence)
  hasTokens: false,

  // Loading states for different actions
  loading: {
    login: false,
    register: false,
    logout: false,
    profile: false,
    update: false,
    forgotPassword: false,
    resetPassword: false,
    verifyEmail: false,
  },

  // Error messages for different actions
  error: {
    login: null,
    register: null,
    logout: null,
    profile: null,
    update: null,
    forgotPassword: null,
    resetPassword: null,
    verifyEmail: null,
  },

  // Success messages
  success: {
    register: null,
    forgotPassword: null,
    resetPassword: null,
    verifyEmail: null,
  },
};

/**
 * Load user from localStorage on initial load
 * This helps maintain auth state across page refreshes
 */
const loadUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';

      if (userStr && isAuth) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }
  return null;
};

// Set initial user if exists in localStorage
initialState.user = loadUserFromLocalStorage();
initialState.isAuthenticated = !!initialState.user;

/**
 * =============================================================================
 * AUTH SLICE
 * =============================================================================
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    /**
     * CLEAR ALL ERRORS
     */
    clearErrors: (state) => {
      state.error = {
        login: null,
        register: null,
        logout: null,
        profile: null,
        update: null,
        forgotPassword: null,
        resetPassword: null,
        verifyEmail: null,
      };
    },

    /**
     * CLEAR SPECIFIC ERROR
     */
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.error[errorType] !== undefined) {
        state.error[errorType] = null;
      }
    },

    /**
     * CLEAR ALL SUCCESS MESSAGES
     */
    clearSuccessMessages: (state) => {
      state.success = {
        register: null,
        forgotPassword: null,
        resetPassword: null,
        verifyEmail: null,
      };
    },

    /**
     * CLEAR SPECIFIC SUCCESS MESSAGE
     */
    clearSuccessMessage: (state, action) => {
      const messageType = action.payload;
      if (state.success[messageType] !== undefined) {
        state.success[messageType] = null;
      }
    },

    /**
     * SET USER MANUALLY
     * Useful for updating user data from other parts of the app
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      // Update localStorage
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
          localStorage.setItem('isAuthenticated', 'true');
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
        }
      }
    },

    /**
     * CLEAR AUTH STATE
     * Reset everything to initial state
     */
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.hasTokens = false;
      state.loading = { ...initialState.loading };
      state.error = { ...initialState.error };
      state.success = { ...initialState.success };

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    },
  },

  /**
   * =============================================================================
   * EXTRA REDUCERS - Handle async thunk actions
   * =============================================================================
   */
  extraReducers: (builder) => {
    /**
     * -------------------------------------------------------------------------
     * LOGIN USER
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.isAuthenticated = true;
        state.hasTokens = true;
        state.user = action.payload.user;
        state.error.login = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.isAuthenticated = false;
        state.hasTokens = false;
        state.user = null;
        state.error.login = action.payload;
      });

    /**
     * -------------------------------------------------------------------------
     * REGISTER USER
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
        state.success.register = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.isAuthenticated = true;
        state.hasTokens = true;
        state.user = action.payload.user;
        state.error.register = null;
        state.success.register = 'Registration successful! Welcome aboard.';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.isAuthenticated = false;
        state.hasTokens = false;
        state.user = null;
        state.error.register = action.payload;
        state.success.register = null;
      });

    /**
     * -------------------------------------------------------------------------
     * LOGOUT USER
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.isAuthenticated = false;
        state.hasTokens = false;
        state.user = null;
        state.error.logout = null;
        // Clear all errors and success messages on logout
        state.error = { ...initialState.error };
        state.success = { ...initialState.success };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        // Even if logout API fails, clear user data locally
        state.isAuthenticated = false;
        state.hasTokens = false;
        state.user = null;
        state.error.logout = action.payload;
      });

    /**
     * -------------------------------------------------------------------------
     * GET USER PROFILE
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error.profile = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload;
      });

    /**
     * -------------------------------------------------------------------------
     * UPDATE USER PROFILE
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.update = false;
        state.user = action.payload;
        state.error.update = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      });

    /**
     * -------------------------------------------------------------------------
     * FORGOT PASSWORD
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading.forgotPassword = true;
        state.error.forgotPassword = null;
        state.success.forgotPassword = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading.forgotPassword = false;
        state.error.forgotPassword = null;
        state.success.forgotPassword = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading.forgotPassword = false;
        state.error.forgotPassword = action.payload;
        state.success.forgotPassword = null;
      });

    /**
     * -------------------------------------------------------------------------
     * RESET PASSWORD
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading.resetPassword = true;
        state.error.resetPassword = null;
        state.success.resetPassword = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading.resetPassword = false;
        state.error.resetPassword = null;
        state.success.resetPassword = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading.resetPassword = false;
        state.error.resetPassword = action.payload;
        state.success.resetPassword = null;
      });

    /**
     * -------------------------------------------------------------------------
     * VERIFY EMAIL
     * -------------------------------------------------------------------------
     */
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading.verifyEmail = true;
        state.error.verifyEmail = null;
        state.success.verifyEmail = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading.verifyEmail = false;
        state.error.verifyEmail = null;
        state.success.verifyEmail = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading.verifyEmail = false;
        state.error.verifyEmail = action.payload;
        state.success.verifyEmail = null;
      });
  },
});

/**
 * =============================================================================
 * EXPORT ACTIONS AND REDUCER
 * =============================================================================
 */
export const {
  clearErrors,
  clearError,
  clearSuccessMessages,
  clearSuccessMessage,
  setUser,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
