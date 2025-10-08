import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import resumeReducer from './reducers/resumeSlice';
import jobReducer from './reducers/jobSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    job: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export const getState = () => store.getState();
export const dispatch = store.dispatch;
