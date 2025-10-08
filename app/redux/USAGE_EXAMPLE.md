# Redux Usage Examples

This guide shows how to use the Redux store with auth, resume, and job slices.

## Setup

The Redux store is already wrapped in your app via `ReduxProvider` in `app/layout.js`.

## Usage in Components

### 1. Auth Actions Example

```javascript
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, logoutUser } from '@/app/redux/actions/authAction';
import { clearError } from '@/app/redux/reducers/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    const credentials = {
      email: 'user@example.com',
      password: 'password123',
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Login successful - redirect or show success
    } catch (err) {
      // Error is already in Redux state
      console.error('Login failed:', err);
    }
  };

  const handleRegister = async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      // Registration successful
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
}
```

### 2. Resume Actions Example

```javascript
'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResumes,
  createResume,
  updateResume,
  deleteResume,
  generateAIResume,
} from '@/app/redux/actions/resumeAction';

export default function ResumePage() {
  const dispatch = useDispatch();
  const { resumes, currentResume, loading, generatingAI, error } = useSelector(
    (state) => state.resume
  );

  // Fetch all resumes
  const loadResumes = () => {
    dispatch(fetchResumes());
  };

  // Create new resume
  const handleCreateResume = async () => {
    const resumeData = {
      title: 'Software Engineer Resume',
      content: { /* resume data */ },
    };

    try {
      await dispatch(createResume(resumeData)).unwrap();
      // Resume created successfully
    } catch (err) {
      console.error('Failed to create resume:', err);
    }
  };

  // Update resume
  const handleUpdateResume = async (resumeId) => {
    const resumeData = {
      title: 'Updated Title',
      content: { /* updated data */ },
    };

    try {
      await dispatch(updateResume({ resumeId, resumeData })).unwrap();
      // Resume updated successfully
    } catch (err) {
      console.error('Failed to update resume:', err);
    }
  };

  // Delete resume
  const handleDeleteResume = async (resumeId) => {
    try {
      await dispatch(deleteResume(resumeId)).unwrap();
      // Resume deleted successfully
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  // Generate AI resume
  const handleGenerateAI = async () => {
    const promptData = {
      jobTitle: 'Software Engineer',
      experience: '3 years',
      skills: ['JavaScript', 'React', 'Node.js'],
    };

    try {
      await dispatch(generateAIResume(promptData)).unwrap();
      // AI resume generated successfully
    } catch (err) {
      console.error('Failed to generate AI resume:', err);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}

      <button onClick={loadResumes}>Load Resumes</button>
      <button onClick={handleCreateResume}>Create Resume</button>
      <button onClick={handleGenerateAI} disabled={generatingAI}>
        {generatingAI ? 'Generating...' : 'Generate AI Resume'}
      </button>

      <div>
        {resumes.map((resume) => (
          <div key={resume.id}>
            <h3>{resume.title}</h3>
            <button onClick={() => handleUpdateResume(resume.id)}>Edit</button>
            <button onClick={() => handleDeleteResume(resume.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Job Actions Example

```javascript
'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobs,
  searchJobs,
  applyForJob,
  addToWishlist,
  removeFromWishlist,
  fetchMyApplications,
} from '@/app/redux/actions/jobAction';
import { setFilters, clearFilters } from '@/app/redux/reducers/jobSlice';

export default function JobSearchPage() {
  const dispatch = useDispatch();
  const {
    jobs,
    currentJob,
    wishlist,
    myApplications,
    loading,
    searching,
    error,
    filters,
  } = useSelector((state) => state.job);

  // Fetch all jobs
  const loadJobs = () => {
    dispatch(fetchJobs(filters));
  };

  // Search jobs
  const handleSearch = async () => {
    const searchParams = {
      keyword: 'software engineer',
      location: 'San Francisco',
      type: 'full-time',
    };

    try {
      await dispatch(searchJobs(searchParams)).unwrap();
      // Search completed
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Apply for job
  const handleApply = async (jobId) => {
    const applicationData = {
      resumeId: '123',
      coverLetter: 'I am interested...',
    };

    try {
      await dispatch(applyForJob({ jobId, applicationData })).unwrap();
      // Application submitted successfully
    } catch (err) {
      console.error('Application failed:', err);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = (jobId) => {
    dispatch(addToWishlist(jobId));
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (jobId) => {
    dispatch(removeFromWishlist(jobId));
  };

  // Update filters
  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  // Load my applications
  const loadMyApplications = () => {
    dispatch(fetchMyApplications());
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="filters">
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
        <button onClick={loadJobs}>Apply Filters</button>
        <button onClick={() => dispatch(clearFilters())}>Clear Filters</button>
      </div>

      {searching && <div>Searching...</div>}

      <button onClick={handleSearch}>Search Jobs</button>
      <button onClick={loadMyApplications}>My Applications</button>

      <div>
        {jobs.map((job) => (
          <div key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={() => handleApply(job.id)}>Apply</button>
            <button onClick={() => handleAddToWishlist(job.id)}>
              {wishlist.includes(job.id) ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2>My Applications ({myApplications.length})</h2>
        {myApplications.map((app) => (
          <div key={app.id}>
            <p>{app.jobTitle} - {app.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Accessing State Directly

You can also access state using `useSelector`:

```javascript
const dispatch = useDispatch();

// Auth state
const { user, isAuthenticated } = useSelector((state) => state.auth);

// Resume state
const { resumes, currentResume } = useSelector((state) => state.resume);

// Job state
const { jobs, wishlist } = useSelector((state) => state.job);
```

## Clearing Errors

All slices have a `clearError` action:

```javascript
import { clearError as clearAuthError } from '@/app/redux/reducers/authSlice';
import { clearError as clearResumeError } from '@/app/redux/reducers/resumeSlice';
import { clearError as clearJobError } from '@/app/redux/reducers/jobSlice';

// Clear specific slice error
dispatch(clearAuthError());
dispatch(clearResumeError());
dispatch(clearJobError());
```
