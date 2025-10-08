# Redux Store Structure

This is the Redux setup for the application using Redux Toolkit with a modular structure.

## 📁 Folder Structure

```
app/redux/
├── actions/
│   ├── authAction.js       # Auth async actions (login, register, logout, verify)
│   ├── resumeAction.js     # Resume async actions (CRUD, AI generation)
│   └── jobAction.js        # Job async actions (search, apply, wishlist)
├── reducers/
│   ├── authSlice.js        # Auth state and reducers
│   ├── resumeSlice.js      # Resume state and reducers
│   └── jobSlice.js         # Job state and reducers
├── store.js                # Redux store configuration
├── provider.js             # Redux Provider wrapper component
├── USAGE_EXAMPLE.md        # Detailed usage examples
└── README.md               # This file
```

## 🎯 Features

### Auth Slice
- **State**: user, token, isAuthenticated, loading, error
- **Actions**: loginUser, registerUser, logoutUser, verifyToken
- **Sync Actions**: clearError, setUser, clearAuth

### Resume Slice
- **State**: resumes, currentResume, loading, error, generatingAI
- **Actions**: fetchResumes, fetchResumeById, createResume, updateResume, deleteResume, generateAIResume
- **Sync Actions**: clearError, setCurrentResume, clearCurrentResume

### Job Slice
- **State**: jobs, currentJob, wishlist, myApplications, loading, searching, error, filters
- **Actions**: fetchJobs, fetchJobById, searchJobs, applyForJob, addToWishlist, removeFromWishlist, fetchMyApplications
- **Sync Actions**: clearError, setFilters, clearFilters, setCurrentJob, clearCurrentJob

## 🚀 Quick Start

### 1. Provider is already wrapped in `app/layout.js`

```javascript
import { ReduxProvider } from './redux/provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### 2. Use in any component

```javascript
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/app/redux/actions/authAction';

export default function MyComponent() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    await dispatch(loginUser({ email, password })).unwrap();
  };

  return (
    <div>
      {loading ? 'Loading...' : `Welcome ${user?.name}`}
    </div>
  );
}
```

## 📚 Documentation

- See `USAGE_EXAMPLE.md` for detailed usage examples
- Each action file contains API endpoints that need to be updated to match your backend
- All async actions use `createAsyncThunk` for automatic loading/error handling

## 🔧 Configuration

The store is configured with:
- Redux DevTools (enabled in development)
- Serializable check middleware (with customizations)
- Three reducers: auth, resume, job

## 🎨 State Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  resume: {
    resumes: [],
    currentResume: null,
    loading: false,
    error: null,
    generatingAI: false,
  },
  job: {
    jobs: [],
    currentJob: null,
    wishlist: [],
    myApplications: [],
    loading: false,
    searching: false,
    error: null,
    filters: { location: '', type: '', experience: '' },
  }
}
```

## ⚠️ Important Notes

1. **API Endpoints**: Update the API endpoints in action files to match your backend
2. **Token Storage**: Currently using localStorage - consider httpOnly cookies for production
3. **Error Handling**: All async actions automatically handle errors via Redux state
4. **TypeScript**: This is JavaScript - convert to TypeScript if needed

## 🔄 Migration from Old Setup

If you had a previous counter slice:
- Old file: `app/redux/slice.js` (removed)
- New structure: Organized into `actions/` and `reducers/` folders
- Store configuration updated to include all three slices
