# Guidix Codebase Analysis Report

**Date:** 2025-11-20
**Project:** Resume Builder v10 (Guidix)
**Analysis Focus:** API Call Patterns, State Management, Code Duplication, and Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [API Call Patterns](#api-call-patterns)
4. [State Management Approaches](#state-management-approaches)
5. [Duplicated API Calls](#duplicated-api-calls)
6. [Redundant Services &amp; Unused Code](#redundant-services--unused-code)
7. [Dead Code Files](#dead-code-files)
8. [State Management Issues](#state-management-issues)
9. [Authentication Flow Analysis](#authentication-flow-analysis)
10. [Redux Backend vs Next.js API Routes](#redux-backend-vs-nextjs-api-routes)
11. [Feature-by-Feature Breakdown](#feature-by-feature-breakdown)
12. [Recommendations](#recommendations)
13. [Action Items](#action-items)

---

## Executive Summary

The Guidix codebase currently implements **6 different API call patterns** and **3 state management approaches**, leading to significant code duplication and architectural inconsistency.

### Key Findings

| Issue Type                        | Count        | Severity |
| --------------------------------- | ------------ | -------- |
| API Call Patterns                 | 6            | High     |
| Duplicate API Endpoints           | 8+           | High     |
| Unused API Client Instances       | 6            | High     |
| Dead Code Files                   | 9+           | Medium   |
| Redundant State Patterns          | 3+           | Medium   |
| Scattered localStorage Operations | 6+ locations | Medium   |
| State Management Approaches       | 3            | Medium   |

### Critical Issues

1. **Same endpoints called 3 different ways** (Redux thunks, service functions, axios clients)
2. **Auth state stored in 3 places** (Redux, localStorage, cookies)
3. **Mixed routing** (20 Redux calls hit backend directly, 2 go through Next.js routes)
4. **6 unused APIClient instances** taking up space
5. **9+ dead code files** that are never imported

---

## Technology Stack

### Frontend Framework

- **Next.js 15.5.3** (App Router)
- **React 19.1.0**

### State Management

- **Redux Toolkit 2.9.0**
- **React Redux 9.2.0**
- **localStorage** (for persistence)

### HTTP Clients

- **Axios 1.12.2**
- **Fetch API** (native)
- **Next.js API Routes** (as middleware)

### Authentication

- **Cookie-based authentication** (HttpOnly cookies)
- **`withCredentials: true`** pattern throughout

---

## API Call Patterns

The codebase uses **6 different patterns** to make API calls:

### Pattern 1: Redux Async Thunks (22 total)

**Location:** `app/redux/actions/`

**Files:**

- `authActions.js` - 8 thunks
- `resumeActions.js` - 6 thunks
- `jobActions.js` - 7 thunks

**Example:**

```javascript
// authActions.js:75-104
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      // ...
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

**Usage in Components:**

```javascript
// login/page.js
await dispatch(loginUser({ email, password })).unwrap();
```

**Thunks by Feature:**

- **Auth (8):** login, register, logout, getUserProfile, updateProfile, verifyEmail, forgotPassword, resetPassword
- **Resume (6):** fetchResumes, fetchResumeById, createResume, updateResume, deleteResume, generateAIResume
- **Job (7):** fetchJobs, fetchJobById, searchJobs, applyForJob, addToWishlist, removeFromWishlist, fetchMyApplications

---

### Pattern 2: Service Layer Functions (22+ functions)

**Location:** `services/`

**Files:**

- `resumeService.js` - 9 functions (496 lines)
- `jobService.js` - 13 functions (617 lines)

**Resume Service Functions:**

1. `uploadAndProcessResume()` - POST /api/v1/resumes/upload_and_process
2. `enhanceResume()` - POST /api/v1/resumes/{id}/enhance
3. `createResumeFromPrompt()` - POST /api/v1/resumes/resume-creation
4. `getSuggestedPrompts()` - POST /api/v1/resumes/suggested_prompts
5. `saveResumeAssets()` - PUT /api/v1/resumes/{id}/save_assets
6. `getResume()` - GET /api/v1/resumes/{id}
7. `getAllResumes()` - GET /api/v1/resumes/resume-list
8. `deleteResume()` - DELETE /api/v1/resumes/{id}
9. `uploadWithProgress()` - POST with axios progress tracking

**Job Service Functions:**

1. `getJobsWithResumeUpload()` - POST with-resume-upload
2. `getJobDetails()` - GET /api/v1/integrated-jobs/{id}
3. `addToWishlist()` - POST /api/v1/integrated-jobs/{id}/wishlist
4. `removeFromWishlist()` - PATCH /api/v1/integrated-jobs/job/{id}/status
5. `markNotInterested()` - POST /api/v1/integrated-jobs/{id}/not-interested
6. `setJobStatus()` - PATCH /api/v1/integrated-jobs/job/{id}/status
7. `getUserJobStatuses()` - GET /api/v1/integrated-jobs/job-statuses
8. `getWishlist()` - GET /api/v1/integrated-jobs/wishlist
9. `getSimilarJobs()` - GET /api/v1/integrated-jobs/{id}/similar
10. `searchJobs()` - POST /api/v1/integrated-jobs/search
11. `getJobsWithResumeId()` - POST /api/v1/integrated-jobs/with-resume-id
12. `getRecommendations()` - GET /api/v1/integrated-jobs/recommendations
13. `getTrendingJobs()` - GET /api/v1/integrated-jobs/trending

**Example:**

```javascript
// resumeService.js:318-352
export const getResume = async (resumeId) => {
  const response = await fetch(`${API_URL}/api/v1/resumes/${resumeId}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch resume: ${response.statusText}`);
  }

  return await response.json();
};
```

**Usage in Components:**

```javascript
// resume-builder/page.js
import { getAllResumes } from "@/services/resumeService";
const resumes = await getAllResumes();
```

---

### Pattern 3: Axios Clients with Interceptors (2 clients)

**Location:** `lib/api/`

**Files:**

- `resumeClient.js` (69 lines)
- `jobClient.js` (49 lines)

**Configuration:**

```javascript
// resumeClient.js:10-17
export const resumeApiClient = axios.create({
  baseURL: RESUME_SERVICE_URL, // "https://api.guidix.ai"
  timeout: 30000,
  withCredentials: true,  // CRITICAL: Enables cookie sending
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (no-op)
resumeApiClient.interceptors.request.use(
  (config) => config,  // Just return config - cookies sent automatically
  (error) => Promise.reject(error)
);

// Response interceptor (handles 401)
resumeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login?message=session_expired";
    }
    return Promise.reject(error);
  }
);
```

**Used By:**

- Redux actions (resumeActions.js uses resumeApiClient)
- Service layer (uploadWithProgress in resumeService.js)

---

### Pattern 4: Next.js API Route Middleware (11 routes)

**Location:** `app/api/v1/`

**Routes:**

- `app/api/v1/auth/signin/route.js`
- `app/api/v1/auth/logout/route.js`
- `app/api/v1/auth/refresh/route.js`
- `app/api/v1/resumes/resume-creation/route.js`
- `app/api/v1/resumes/upload_and_process/route.js`
- `app/api/v1/resumes/[id]/enhance/route.js`
- `app/api/v1/resumes/[id]/save_assets/route.js`
- `app/api/v1/integrated-jobs/with-resume-id/route.js`
- `app/api/v1/integrated-jobs/search/route.js`
- `app/api/v1/integrated-jobs/wishlist/route.js`
- `app/api/v1/integrated-jobs/job-statuses/route.js`

**Purpose:** Act as proxy/middleware between frontend and backend API

**Example:**

```javascript
// app/api/v1/resumes/resume-creation/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie");

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie headers
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Usage:** Mostly unused by Redux (only login/logout use Next.js routes)

---

### Pattern 5: Custom API Client Class (6 instances - UNUSED)

**Location:** `utils/apiClient.js` (147 lines)

**Class Definition:**

```javascript
// utils/apiClient.js:7-53
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL || API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: 'include',  // Send cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.clear();
      window.location.href = '/login?message=session_expired';
      throw new Error('Session expired');
    }

    if (!response.ok) {
      let errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async get(endpoint, options = {}) { /* ... */ }
  async post(endpoint, data, options = {}) { /* ... */ }
  async put(endpoint, data, options = {}) { /* ... */ }
  async patch(endpoint, data, options = {}) { /* ... */ }
  async delete(endpoint, options = {}) { /* ... */ }
  async upload(endpoint, formData, options = {}) { /* ... */ }
}
```

**Pre-instantiated Clients (UNUSED!):**

```javascript
// utils/apiClient.js:138-143
export const authAPI = new APIClient(API_BASE_URL);
export const resumeAPI = new APIClient(API_BASE_URL);
export const autoApplyAPI = new APIClient(API_BASE_URL);
export const walletAPI = new APIClient(API_BASE_URL);
export const linkedinAPI = new APIClient(API_BASE_URL);
export const interviewAPI = new APIClient(API_BASE_URL);
```

**Status:** These 6 instances are **NEVER USED** anywhere in the codebase. They can be safely deleted.

---

### Pattern 6: Custom Hooks for API Calls (2 hooks)

**Location:** `hooks/`

**Files:**

- `useAuth.js` (34 lines)
- `useGlobalAuth.js` (51 lines)

**useAuth Hook:**

```javascript
// hooks/useAuth.js
export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      if (!authStatus) {
        router.push(redirectTo);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, redirectTo]);

  return { isAuthenticated, isLoading };
}
```

**useGlobalAuth Hook:**

```javascript
// hooks/useGlobalAuth.js
export function useGlobalAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const validateSession = async () => {
      const authFlag = typeof window !== 'undefined'
        ? localStorage.getItem('isAuthenticated') === 'true'
        : false;

      if (authFlag) {
        try {
          await dispatch(getUserProfile()).unwrap();
          console.log('✅ Session validated successfully');
        } catch (error) {
          console.log('❌ Session validation failed:', error);
        }
      }
    };

    validateSession();
  }, [dispatch]);

  return { isAuthenticated };
}
```

**Usage:** Page protection and session validation on app load

---

## State Management Approaches

### Approach 1: Redux Toolkit with Slices

**Location:** `app/redux/reducers/`

**Files:**

- `authSlice.js` (413 lines)
- `resumeSlice.js` (148 lines)
- `jobSlice.js` (177 lines)

**Auth Slice State:**

```javascript
// authSlice.js:18-59
const initialState = {
  user: null,
  isAuthenticated: false,
  hasTokens: false,
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
  success: {
    register: null,
    forgotPassword: null,
    resetPassword: null,
    verifyEmail: null,
  },
};
```

**Resume Slice State:**

```javascript
// resumeSlice.js:11-17
const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
  generatingAI: false,
};
```

**Job Slice State:**

```javascript
// jobSlice.js:12-25
const initialState = {
  jobs: [],
  currentJob: null,
  wishlist: [],
  myApplications: [],
  loading: false,
  searching: false,
  error: null,
  filters: {
    location: '',
    type: '',
    experience: '',
  },
};
```

**Redux Store:**

```javascript
// store.js
export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    job: jobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['auth.token'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
```

---

### Approach 2: localStorage Persistence

**Used For:**

- User authentication state
- User profile data

**Keys Stored:**

- `user` - JSON object with user details
- `isAuthenticated` - boolean string ('true'/'false')

**Synchronization with Redux:**

```javascript
// authSlice.js:147-160
setUser: (state, action) => {
  state.user = action.payload;
  state.isAuthenticated = !!action.payload;
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
```

**Load on Initial State:**

```javascript
// authSlice.js:65-83
const loadUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      if (userStr && isAuth) return JSON.parse(userStr);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }
  return null;
};

initialState.user = loadUserFromLocalStorage();
initialState.isAuthenticated = !!initialState.user;
```

**Locations Where localStorage is Cleared:**

1. `lib/api/resumeClient.js:52`
2. `lib/api/jobClient.js:42`
3. `utils/auth.js:72, 87`
4. `utils/errorHandler.js:38, 110`
5. `app/redux/actions/authActions.js:154, 161`
6. `hooks/useAuth.js:31`

**Issue:** 6+ different places clear localStorage - fragile and hard to maintain

---

### Approach 3: Component Local State

**Used For:**

- Form data
- UI state (modals, dropdowns, tabs, filters)
- Temporary loading states
- Local search and filtering

**Example from JobTracker.jsx:**

```javascript
// JobTracker.jsx:68-80
const [columns, setColumns] = useState(initialColumns);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [isAddJobOpen, setIsAddJobOpen] = useState(false);
const [selectedColumn, setSelectedColumn] = useState("shortlist");
const [searchQuery, setSearchQuery] = useState("");
const [activeFilters, setActiveFilters] = useState([]);
const [showFilters, setShowFilters] = useState(false);
const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
const [jobToMove, setJobToMove] = useState(null);
```

**Example from login/page.js:**

```javascript
// login/page.js:166-172
const [formData, setFormData] = useState({
  email: "",
  password: "",
});
const [localError, setLocalError] = useState("");
const [authMessage, setAuthMessage] = useState(null);
const [showPassword, setShowPassword] = useState(false);
```

---

## Duplicated API Calls

### 1. Job Status Updates - Three Functions for Same Task

**Functions:**

- `removeFromWishlist()` - services/jobService.js:136-163
- `setJobStatus()` - services/jobService.js:204-231

**Both call:** `/api/v1/integrated-jobs/job/{jobId}/status` with PATCH

**Code:**

```javascript
// jobService.js:136-163
export const removeFromWishlist = async (jobId) => {
  const response = await fetch(
    `${JOB_SERVICE_URL}/api/v1/integrated-jobs/job/${jobId}/status`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: "viewed" }),
    }
  );
  // ...
};

// jobService.js:204-231
export const setJobStatus = async (jobId, status) => {
  const response = await fetch(
    `${JOB_SERVICE_URL}/api/v1/integrated-jobs/job/${jobId}/status`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }
  );
  // ...
};
```

**Fix:** Remove `removeFromWishlist()` and replace all calls with `setJobStatus(jobId, "viewed")`

---

### 2. Resume Creation - Multiple Wrappers for Same Endpoint

**Locations:**

- `createResumeFromPrompt()` - services/resumeService.js:132-219
- `createResume()` - app/redux/actions/resumeActions.js:46-58
- `generateAIResume()` - app/redux/actions/resumeActions.js:97-113

**All call:** POST `/api/v1/resumes/resume-creation`

**Code:**

```javascript
// Service Layer
export const createResumeFromPrompt = async (prompt, resumeName, templateId) => {
  const response = await fetch('/api/v1/resumes/resume-creation', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_prompt: prompt,
      resume_name: resumeName,
      template_id: templateId,
    })
  });
  // ...
};

// Redux Actions
export const createResume = createAsyncThunk(
  'resume/createResume',
  async (resumeData, { rejectWithValue }) => {
    const response = await resumeApiClient.post('/api/v1/resumes/resume-creation', resumeData);
    // ...
  }
);

export const generateAIResume = createAsyncThunk(
  'resume/generateAIResume',
  async ({ prompt, resumeName, templateId }, { rejectWithValue }) => {
    const response = await resumeApiClient.post('/api/v1/resumes/resume-creation', {
      user_prompt: prompt,
      resume_name: resumeName,
      template_id: templateId || "aa97e710-4457-46fb-ac6f-1765ad3a6d43"
    });
    // ...
  }
);
```

**Issue:** Unnecessary duplication between service layer and Redux

---

### 3. User Profile Fetching - Duplicate Calls

**Locations:**

- `isAuthenticated()` - utils/auth.js:14-27
- `getCurrentUser()` - utils/auth.js:33-53
- `getUserProfile()` - app/redux/actions/authActions.js:174-198

**All call:** GET `/api/v1/users/me`

**Code:**

```javascript
// utils/auth.js
export async function isAuthenticated() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      credentials: 'include',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

// Redux
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    const response = await axiosInstance.get("/api/v1/users/me");
    // ...
  }
);
```

**Issue:** Three different functions calling same endpoint with different return formats

---

### 4. Resume List Fetching

**Locations:**

- `getAllResumes()` - services/resumeService.js
- `fetchResumes()` - app/redux/actions/resumeActions.js:12-24

**Both call:** GET `/api/v1/resumes/resume-list`

---

### 5. Resume by ID Fetching

**Locations:**

- `getResume()` - services/resumeService.js:318-352
- `fetchResumeById()` - app/redux/actions/resumeActions.js:29-41

**Both call:** GET `/api/v1/resumes/{id}`

---

### 6. Resume Deletion

**Locations:**

- `deleteResume()` - services/resumeService.js
- `deleteResume()` - app/redux/actions/resumeActions.js:80-92

**Both call:** DELETE `/api/v1/resumes/{id}`

---

### 7. Wishlist Management

**Locations:**

- Service Layer: `addToWishlist()`, `removeFromWishlist()` - services/jobService.js
- Redux Actions: `addToWishlist()`, `removeFromWishlist()` - app/redux/actions/jobActions.js:83-120

**Different Endpoints:**

- Service: POST `/api/v1/integrated-jobs/{id}/wishlist`
- Redux: PATCH `/api/v1/jobs/user/0/job/{id}/status`

---

## Redundant Services & Unused Code

### 1. Six Unused APIClient Instances

**Location:** `utils/apiClient.js:138-143`

```javascript
export const authAPI = new APIClient(API_BASE_URL);
export const resumeAPI = new APIClient(API_BASE_URL);
export const autoApplyAPI = new APIClient(API_BASE_URL);
export const walletAPI = new APIClient(API_BASE_URL);
export const linkedinAPI = new APIClient(API_BASE_URL);
export const interviewAPI = new APIClient(API_BASE_URL);
```

**Status:** NEVER USED anywhere in the codebase

**Actual Usage:** Code uses `axiosInstance`, `resumeApiClient`, and `jobApiClient` instead

**Recommendation:** Delete these 6 exports

---

### 2. Deprecated Functions Still Exported

**Location:** `services/jobService.js:397-415`

```javascript
export const getJobsWithAIScoring = async (...) => {
  console.warn("⚠️ getJobsWithAIScoring is deprecated. Use getJobsWithResumeId instead.");
  return getJobsWithResumeId(resumeId, limit, offset, forceRefresh);
};

// Line 597
export const getIntegratedJobsWithResumeId = getJobsWithResumeId;  // Alias
```

**Status:** Deprecated but still exported

**Recommendation:** Remove deprecated functions entirely

---

### 3. Redundant Job Fetching Functions

**Location:** `services/jobService.js`

- `getJobsWithResumeUpload()` - Lines 12-63
- `getJobsWithResumeId()` - Lines 425-463
- `getJobsWithResumeIdPost()` - Lines 473-509

**Issue:** Multiple functions with similar purpose using different approaches

**Recommendation:** Consolidate to single function

---

## Dead Code Files

### Complete List of Unused Files

**Backup/Old Component Files:**

1. `app/(pages)/enhanced-resume/page-backup.js`
2. `app/(pages)/enhanced-resume/page-modified.js`
3. `app/(pages)/template-selection/page-backup.js`
4. `components/layout/dashboard-layout.js.backup`
5. `components/pdf-templates/internship/InternshipTemplate1WithoutPhoto.js.backup`

**Old Component Versions:**
6. `components/JobCardOld.jsx`
7. `components/JobTrackerOld.jsx`
8. `components/JobTrackerOld2.jsx`

**Documentation/Example Files:**
9. `app/redux/EXAMPLE_COMPONENT.js` (500+ lines of example code)

**Status:** All these files are **NEVER IMPORTED** anywhere in the application

**Impact:** Clutters codebase, confuses developers, takes up space

**Recommendation:** Delete all 9 files immediately

---

## State Management Issues

### Issue 1: Auth State in 3 Places

**Location 1: Redux authSlice**

```javascript
state = {
  user: null,
  isAuthenticated: false,
  hasTokens: false,
}
```

**Location 2: localStorage**

```javascript
localStorage.getItem('user')
localStorage.getItem('isAuthenticated')
```

**Location 3: Cookies (HttpOnly)**

```javascript
// Set by backend, inaccessible from JavaScript
// Sent automatically with withCredentials: true
```

**Problem:** Triple redundancy - same auth state maintained in 3 places

**Recommendation:** Choose ONE source of truth:

- **Option A:** Redux only (remove localStorage sync)
- **Option B:** Cookies only (minimal Redux state for UI)

---

### Issue 2: Multiple Authentication Validation Approaches

**4 Different Ways to Check Auth:**

1. **useAuth Hook** - Checks localStorage

   ```javascript
   const authStatus = localStorage.getItem('isAuthenticated') === 'true';
   ```
2. **useGlobalAuth Hook** - Dispatches Redux action

   ```javascript
   await dispatch(getUserProfile()).unwrap();
   ```
3. **auth.js Utility** - Makes API call

   ```javascript
   const response = await fetch('/api/v1/users/me', { credentials: 'include' });
   ```
4. **authSlice** - Reads from localStorage on init

   ```javascript
   const loadUserFromLocalStorage = () => { /* ... */ };
   ```

**Problem:** Inconsistent, overlapping logic spread across 4 locations

**Recommendation:** Centralize to single authentication validation method

---

### Issue 3: Error Handling in 5 Places

**Locations:**

1. Axios interceptors (resumeClient.js:35-67, jobClient.js:35-48)
2. Redux thunks (authActions.js)
3. Service functions (resumeService.js, jobService.js)
4. Centralized utility (errorHandler.js)
5. Component catch blocks

**All doing similar things:**

```javascript
if (error.response?.status === 401) {
  localStorage.clear();
  window.location.href = '/login?message=session_expired';
}
```

**Problem:** Scattered, duplicated error handling logic

**Recommendation:** Use `utils/errorHandler.js` consistently everywhere

---

### Issue 4: localStorage.clear() Scattered Everywhere

**6+ Locations:**

1. `lib/api/resumeClient.js:52`
2. `lib/api/jobClient.js:42`
3. `utils/auth.js:72, 87`
4. `utils/errorHandler.js:38, 110`
5. `app/redux/actions/authActions.js:154, 161`
6. `hooks/useAuth.js:31`

**Problem:** Fragile, hard to maintain, easy to miss spots

**Recommendation:** Create centralized `clearAuthState()` utility function

---

## Authentication Flow Analysis

### Current Cookie-Based Authentication

**Login Flow:**

```
1. User submits credentials
   ↓
2. Component dispatches Redux loginUser()
   ↓
3. fetch('/api/v1/auth/signin', { credentials: 'include' })
   ↓
4. Next.js API Route forwards request to backend
   ↓
5. Backend validates credentials
   ↓
6. Backend creates HttpOnly cookie (access_token)
   ↓
7. Backend returns Set-Cookie header
   ↓
8. Next.js route forwards Set-Cookie to browser
   ↓
9. Browser stores cookie (HttpOnly, Secure, SameSite)
   ↓
10. authSlice updates Redux state
    ↓
11. authSlice saves user to localStorage
    ↓
12. Component redirects to dashboard
```

**Subsequent Authenticated Requests:**

```
1. Component calls API (via Redux or service)
   ↓
2. axios/fetch with withCredentials: true
   ↓
3. Browser automatically adds Cookie header
   ↓
4. Backend validates cookie
   ↓
5. Backend returns protected data
   ↓
6. Redux state or component state updated
```

### How `withCredentials: true` Works

**Browser Behavior:**

- Automatically includes cookies in request
- Automatically stores Set-Cookie from response
- Cookies are HttpOnly (JavaScript cannot access)
- No manual token management needed

**Configuration in Codebase:**

```javascript
// All axios clients
export const resumeApiClient = axios.create({
  baseURL: RESUME_SERVICE_URL,
  withCredentials: true,  // ← Enables automatic cookie handling
});

// All fetch calls
fetch('/api/v1/endpoint', {
  credentials: 'include',  // ← Same as withCredentials: true
});
```

**Request Interceptor Analysis:**

```javascript
// resumeClient.js:23-29
resumeApiClient.interceptors.request.use(
  (config) => {
    // Just return config - cookies sent automatically
    return config;
  },
  (error) => Promise.reject(error)
);
```

**What this does:** **NOTHING** - it's a no-op interceptor

**Why it exists:** Placeholder for future extensibility

**How cookies are included:** Not by this interceptor! The browser includes cookies automatically at the HTTP level due to `withCredentials: true`.

**The `config` object does NOT contain cookies** - they're added by the browser's networking stack when making the actual HTTP request.

---

## Redux Backend vs Next.js API Routes

### Current Mixed Approach

**Redux calls that use Next.js API routes (2 only):**
✅ `loginUser` → `/api/v1/auth/signin` → Next.js route → Backend
✅ `logoutUser` → `/api/v1/auth/logout` → Next.js route → Backend

**Redux calls that hit backend directly (20 calls):**

**Auth Actions (6 of 8):**

- `registerUser` → axios → `https://api.guidix.ai/api/v1/auth/signup`
- `getUserProfile` → axios → `https://api.guidix.ai/api/v1/users/me`
- `updateUserProfile` → axios → `https://api.guidix.ai/api/v1/user-management/me/profile`
- `verifyEmail` → axios → `https://api.guidix.ai/api/v1/auth/verify-email`
- `forgotPassword` → axios → `https://api.guidix.ai/api/v1/auth/forgot-password`
- `resetPassword` → axios → `https://api.guidix.ai/api/v1/auth/reset-password`

**Resume Actions (all 6):**

- `fetchResumes` → resumeApiClient → Backend
- `fetchResumeById` → resumeApiClient → Backend
- `createResume` → resumeApiClient → Backend
- `updateResume` → resumeApiClient → Backend
- `deleteResume` → resumeApiClient → Backend
- `generateAIResume` → resumeApiClient → Backend

**Job Actions (all 7):**

- `fetchJobs` → jobApiClient → Backend
- `fetchJobById` → jobApiClient → Backend
- `searchJobs` → jobApiClient → Backend
- `applyForJob` → jobApiClient → Backend
- `addToWishlist` → jobApiClient → Backend
- `removeFromWishlist` → jobApiClient → Backend
- `fetchMyApplications` → jobApiClient → Backend

### Why This Inconsistency?

**Login/Logout use Next.js routes:**

- Comment says: "Call Next.js API route (NOT backend directly!)"
- Purpose: Cookie forwarding and Set-Cookie header handling
- **BUT:** This is unnecessary! Axios with `withCredentials: true` already handles this

**Everything else hits backend:**

- Uses axios clients with `withCredentials: true`
- Cookies sent/received automatically
- Works perfectly without Next.js middleware

### Configuration

**All axios clients point to backend:**

```javascript
// authActions.js:14
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

// resumeClient.js:3
const RESUME_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

// jobClient.js:3
const JOB_SERVICE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";
```

**Next.js routes are proxies:**

```javascript
// app/api/v1/auth/signin/route.js
const backendUrl = `${API_BASE_URL}/api/v1/auth/signin`;
// Forwards request to backend, forwards response back to client
```

---

## Feature-by-Feature Breakdown

### Authentication Feature

**API Methods Used:**

1. Redux Async Thunks (primary)
2. Direct fetch calls (in authActions via Redux)
3. Utility functions (auth.js)

**State Management:**

- Redux auth slice (complete auth state)
- localStorage (user, isAuthenticated)
- Component local state (form data, UI state)

**Endpoints:**

- POST `/api/v1/auth/signin` - Login (via Next.js route)
- POST `/api/v1/auth/signup` - Register (direct to backend)
- POST `/api/v1/auth/logout` - Logout (via Next.js route)
- GET `/api/v1/users/me` - Get profile (direct to backend)
- PUT `/api/v1/user-management/me/profile` - Update profile
- POST `/api/v1/auth/verify-email` - Verify email
- POST `/api/v1/auth/forgot-password` - Forgot password
- POST `/api/v1/auth/reset-password` - Reset password

**Usage Pattern:**

```javascript
// Component: login/page.js
const dispatch = useDispatch();
const { loading, error, isAuthenticated } = useSelector(state => state.auth);

const handleLogin = async (e) => {
  try {
    await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
    })).unwrap();
    router.push("/");
  } catch (err) {
    console.error("Login failed:", err);
  }
};
```

---

### Resume Feature

**API Methods Used:**

1. Service Layer Functions (primary)
2. Redux Async Thunks (secondary)
3. Axios Instance (for progress tracking)

**State Management:**

- Redux resume slice (resumes[], currentResume, loading, error)
- Component local state (form data, UI state)

**Endpoints:**

- POST `/api/v1/resumes/upload_and_process` - Upload resume
- POST `/api/v1/resumes/{id}/enhance` - Enhance resume
- POST `/api/v1/resumes/resume-creation` - Create from prompt
- POST `/api/v1/resumes/suggested_prompts` - Get suggestions
- PUT `/api/v1/resumes/{id}/save_assets` - Save assets
- GET `/api/v1/resumes/{id}` - Get resume by ID
- GET `/api/v1/resumes/resume-list` - Get all resumes
- DELETE `/api/v1/resumes/{id}` - Delete resume

**Usage Pattern:**

```javascript
// Component: resume-builder/page.js
import { getAllResumes } from "@/services/resumeService";

const handleLoadResumes = async () => {
  try {
    const resumes = await getAllResumes();
    setResumes(resumes);
  } catch (error) {
    setError(handleApiError(error));
  }
};

// Component: enhanced-resume/page.js
const { getResume, saveResumeAssets } = await import("@/services/resumeService");
const resume = await getResume(resumeId);
```

---

### Job Feature

**API Methods Used:**

1. Service Layer Functions (primary)
2. Redux Async Thunks (secondary)

**State Management:**

- Redux job slice (jobs[], currentJob, wishlist[], myApplications[], filters)
- Component local state (columns, search, filters, UI state)

**Endpoints:**

- POST `/api/v1/integrated-jobs/with-resume-upload` - Upload resume to get jobs
- POST `/api/v1/integrated-jobs/with-resume-id` - Get jobs with resume ID
- GET `/api/v1/integrated-jobs/{id}` - Get job details
- POST `/api/v1/integrated-jobs/{id}/wishlist` - Add to wishlist
- PATCH `/api/v1/integrated-jobs/job/{id}/status` - Update job status
- POST `/api/v1/integrated-jobs/{id}/not-interested` - Mark not interested
- GET `/api/v1/integrated-jobs/job-statuses` - Get user job statuses
- GET `/api/v1/integrated-jobs/wishlist` - Get wishlist
- GET `/api/v1/integrated-jobs/{id}/similar` - Get similar jobs
- POST `/api/v1/integrated-jobs/search` - Search jobs
- GET `/api/v1/integrated-jobs/recommendations` - Get recommendations
- GET `/api/v1/integrated-jobs/trending` - Get trending jobs

**Usage Pattern:**

```javascript
// Component: job-search/page.js
import {
  getJobsWithResumeUpload,
  addToWishlist,
  removeFromWishlist,
  markNotInterested,
  setJobStatus,
} from "@/services/jobService";

const handleAddToWishlist = async (jobId) => {
  try {
    await addToWishlist(jobId);
    // Update UI
  } catch (error) {
    setError(handleApiError(error));
  }
};

// Component: JobTracker.jsx
import { getUserJobStatuses, setJobStatus } from "@/services/jobService";

const fetchJobs = async () => {
  const response = await getUserJobStatuses(null, 100, 0);
  // Map to columns...
};
```

---

## Recommendations

### Priority 1: Critical Cleanups (High Impact, Low Risk)

#### 1.1 Delete Dead Code Files (Immediate)

```bash
# Delete these 9 files immediately
rm app/(pages)/enhanced-resume/page-backup.js
rm app/(pages)/enhanced-resume/page-modified.js
rm app/(pages)/template-selection/page-backup.js
rm components/layout/dashboard-layout.js.backup
rm components/pdf-templates/internship/InternshipTemplate1WithoutPhoto.js.backup
rm components/JobCardOld.jsx
rm components/JobTrackerOld.jsx
rm components/JobTrackerOld2.jsx
rm app/redux/EXAMPLE_COMPONENT.js
```

**Impact:** Immediate code cleanup, reduces confusion

**Risk:** None - files are never imported

---

#### 1.2 Remove Unused APIClient Instances

**File:** `utils/apiClient.js:138-143`

**Delete:**

```javascript
export const authAPI = new APIClient(API_BASE_URL);
export const resumeAPI = new APIClient(API_BASE_URL);
export const autoApplyAPI = new APIClient(API_BASE_URL);
export const walletAPI = new APIClient(API_BASE_URL);
export const linkedinAPI = new APIClient(API_BASE_URL);
export const interviewAPI = new APIClient(API_BASE_URL);
```

**Keep:** The APIClient class itself (may be used in future)

**Impact:** Reduces confusion about which client to use

**Risk:** Low - these are never used

---

#### 1.3 Remove Deprecated Functions

**File:** `services/jobService.js`

**Delete:**

```javascript
// Line 397-415
export const getJobsWithAIScoring = async (...) => { /* deprecated */ };

// Line 597
export const getIntegratedJobsWithResumeId = getJobsWithResumeId;
```

**Impact:** Cleaner API surface

**Risk:** Low - deprecated with warnings already

---

### Priority 2: Consolidate Duplicate Functions (Medium Impact, Medium Risk)

#### 2.1 Consolidate Job Status Functions

**Problem:** `removeFromWishlist()` and `setJobStatus()` do the same thing

**Solution:**

1. Remove `removeFromWishlist()` from `services/jobService.js`
2. Find all usages and replace:
   ```javascript
   // Before
   await removeFromWishlist(jobId);

   // After
   await setJobStatus(jobId, "viewed");
   ```

**Impact:** Reduces confusion, single source of truth

**Risk:** Medium - need to update all call sites

---

#### 2.2 Consolidate User Profile Fetching

**Problem:** Three functions call `/api/v1/users/me`

**Options:**

**Option A:** Use Redux only

```javascript
// Remove: isAuthenticated() and getCurrentUser() from utils/auth.js
// Use: dispatch(getUserProfile()) everywhere
```

**Option B:** Use utility functions only

```javascript
// Keep: getCurrentUser() in utils/auth.js
// Remove: getUserProfile() Redux thunk (or keep for state management)
```

**Recommendation:** Option A - Redux is already set up for this

**Impact:** Single method to fetch user profile

**Risk:** Medium - need to update all call sites

---

### Priority 3: Standardize Architecture (High Impact, High Effort)

#### 3.1 Choose Redux-First OR Service-First

**Current State:** Mixed - both Redux and Services call APIs

**Option A: Redux-First**

- Move all API calls to Redux thunks
- Components only dispatch actions
- Services layer becomes thin wrapper over Redux

**Pros:**

- Centralized state management
- Consistent pattern across features
- Easier to track loading/error states

**Cons:**

- More boilerplate
- Redux overhead for simple calls

**Option B: Service-First** ⭐ **RECOMMENDED**

- Keep service layer for API calls
- Redux only for global state (user, theme, etc.)
- Components call services directly

**Pros:**

- Less boilerplate
- Simpler architecture
- Easier to understand and maintain
- Services can be reused without React/Redux

**Cons:**

- More prop drilling for shared state
- Need to manage loading states in components

**Recommendation:** Option B - Service-First

---

#### 3.2 Simplify Authentication State

**Problem:** Auth state in 3 places (Redux, localStorage, cookies)

**Solution:**

**Phase 1: Remove localStorage Sync**

```javascript
// authSlice.js - Remove all localStorage.setItem calls
// Keep only cookies (backend) and Redux (UI state)
```

**Phase 2: Load User on App Init Only**

```javascript
// app/layout.js or _app.js
useEffect(() => {
  dispatch(getUserProfile()); // Load user once on mount
}, []);
```

**Phase 3: Remove localStorage Checks**

```javascript
// Remove: localStorage.getItem('isAuthenticated')
// Use: Redux state only
const { isAuthenticated } = useSelector(state => state.auth);
```

**Impact:** Single source of truth for auth state

**Risk:** Medium - needs careful testing of auth flow

---

#### 3.3 Standardize Error Handling

**Problem:** Error handling in 5 different places

**Solution:**

**Create Centralized Error Handler:**

```javascript
// utils/errorHandler.js (already exists - use it!)

// In axios interceptors
import { handleApiError } from '@/utils/errorHandler';

resumeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorInfo = handleApiError(error);
    if (errorInfo.shouldRedirect) {
      window.location.href = errorInfo.redirectUrl;
    }
    return Promise.reject(error);
  }
);

// In components
try {
  await someApiCall();
} catch (error) {
  const errorInfo = handleApiError(error);
  setError(errorInfo.message);
}
```

**Impact:** Consistent error handling across app

**Risk:** Low - errorHandler.js already exists

---

#### 3.4 Remove Next.js API Routes for Auth

**Problem:** Only login/logout use Next.js routes, everything else is direct

**Solution:**

**Option A: Remove Next.js Routes** ⭐ **RECOMMENDED**

```javascript
// authActions.js - Change loginUser to use axios
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Change from fetch('/api/v1/auth/signin')
      // To: axiosInstance.post('/api/v1/auth/signin', credentials)
      const response = await axiosInstance.post('/api/v1/auth/signin', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
```

**Delete:**

- `app/api/v1/auth/signin/route.js`
- `app/api/v1/auth/logout/route.js`
- `app/api/v1/auth/refresh/route.js`

**Why:** Axios with `withCredentials: true` already handles cookies perfectly. No need for Next.js middleware.

**Option B: Use Next.js Routes for Everything**

- Add Next.js routes for all endpoints
- Use fetch() everywhere instead of axios

**Recommendation:** Option A - Less code, simpler architecture

**Impact:** Consistent API call pattern

**Risk:** Low - axios cookie handling is proven to work

---

### Priority 4: Documentation & Standards (Medium Impact, Low Risk)

#### 4.1 Create Architecture Decision Record (ADR)

**Document Decisions:**

- Why cookie-based authentication?
- Why service-first architecture?
- When to use Redux vs local state?
- Error handling standards
- API client usage guidelines

**Location:** `docs/architecture/`

---

#### 4.2 Add API Client Usage Guide

**Document:**

- How to make authenticated API calls
- How `withCredentials: true` works
- Why request interceptors are no-ops
- Cookie handling flow diagram

**Location:** `docs/api-client-guide.md`

---

#### 4.3 Create Coding Standards

**Define:**

- When to create service functions vs Redux thunks
- How to handle errors consistently
- State management guidelines
- Component patterns

**Location:** `docs/coding-standards.md`

---

## Action Items

### Immediate Actions (Do First)

- [ ] **Delete 9 dead code files**

  - `app/(pages)/enhanced-resume/page-backup.js`
  - `app/(pages)/enhanced-resume/page-modified.js`
  - `app/(pages)/template-selection/page-backup.js`
  - `components/layout/dashboard-layout.js.backup`
  - `components/pdf-templates/internship/InternshipTemplate1WithoutPhoto.js.backup`
  - `components/JobCardOld.jsx`
  - `components/JobTrackerOld.jsx`
  - `components/JobTrackerOld2.jsx`
  - `app/redux/EXAMPLE_COMPONENT.js`
- [ ] **Remove 6 unused APIClient exports from `utils/apiClient.js`**

  - `authAPI`
  - `resumeAPI`
  - `autoApplyAPI`
  - `walletAPI`
  - `linkedinAPI`
  - `interviewAPI`
- [ ] **Remove deprecated functions from `services/jobService.js`**

  - `getJobsWithAIScoring()`
  - `getIntegratedJobsWithResumeId` alias

---

### Short-Term Actions (This Week)

- [ ] **Consolidate job status functions**

  - Remove `removeFromWishlist()` from services
  - Replace all calls with `setJobStatus(jobId, "viewed")`
  - Test wishlist functionality
- [ ] **Standardize user profile fetching**

  - Choose Redux OR utility function approach
  - Update all call sites
  - Remove duplicate implementations
- [ ] **Centralize error handling**

  - Update all axios interceptors to use `handleApiError()`
  - Update component catch blocks
  - Test error scenarios (401, 500, network errors)

---

### Medium-Term Actions (This Month)

- [ ] **Choose and implement Service-First architecture**

  - Document decision in ADR
  - Keep Redux for auth state only
  - Move to service functions for all API calls
  - Update components to call services directly
- [ ] **Simplify auth state management**

  - Remove localStorage sync from authSlice
  - Use Redux as single source of truth
  - Update useAuth and useGlobalAuth hooks
  - Test auth flow thoroughly
- [ ] **Remove Next.js API routes for auth**

  - Update login/logout to use axios directly
  - Delete unused Next.js route files
  - Test cookie handling

---

### Long-Term Actions (Future)

- [ ] **Consolidate Redux resume/job actions**

  - Decide if Redux is needed for these features
  - If not, remove Redux thunks
  - Update components to use services only
- [ ] **Create comprehensive documentation**

  - Architecture Decision Records
  - API Client Usage Guide
  - Coding Standards
  - Contributing Guide
- [ ] **Add API integration tests**

  - Test cookie authentication flow
  - Test error handling
  - Test state management

---

## Metrics & Success Criteria

### Before Cleanup

| Metric                   | Current      |
| ------------------------ | ------------ |
| Total Lines of Code      | ~50,000+     |
| API Call Patterns        | 6            |
| Duplicate API Calls      | 8+           |
| Dead Code Files          | 9            |
| Unused Exports           | 6            |
| localStorage Operations  | 6+ locations |
| Error Handling Locations | 5            |

### After Cleanup (Target)

| Metric                   | Target                             |
| ------------------------ | ---------------------------------- |
| Total Lines of Code      | ~45,000 (10% reduction)            |
| API Call Patterns        | 2 (Services + Redux for auth only) |
| Duplicate API Calls      | 0                                  |
| Dead Code Files          | 0                                  |
| Unused Exports           | 0                                  |
| localStorage Operations  | 0 (use Redux only)                 |
| Error Handling Locations | 1 (centralized)                    |

---

## Appendix

### A. File Structure Summary

```
guidix/
├── app/
│   ├── (pages)/
│   │   ├── enhanced-resume/
│   │   │   ├── page.js ✅
│   │   │   ├── page-backup.js ❌ DELETE
│   │   │   └── page-modified.js ❌ DELETE
│   │   ├── job-search/
│   │   │   └── page.js ✅
│   │   ├── login/
│   │   │   └── page.js ✅
│   │   └── template-selection/
│   │       ├── page.js ✅
│   │       └── page-backup.js ❌ DELETE
│   ├── api/
│   │   └── v1/
│   │       ├── auth/
│   │       │   ├── signin/route.js ⚠️ CONSIDER REMOVING
│   │       │   ├── logout/route.js ⚠️ CONSIDER REMOVING
│   │       │   └── refresh/route.js ⚠️ CONSIDER REMOVING
│   │       ├── resumes/
│   │       │   └── [routes] ✅
│   │       └── integrated-jobs/
│   │           └── [routes] ✅
│   └── redux/
│       ├── actions/
│       │   ├── authActions.js ✅ (317 lines)
│       │   ├── resumeActions.js ✅ (114 lines)
│       │   └── jobActions.js ✅ (138 lines)
│       ├── reducers/
│       │   ├── authSlice.js ✅ (413 lines)
│       │   ├── resumeSlice.js ✅ (148 lines)
│       │   └── jobSlice.js ✅ (177 lines)
│       ├── store.js ✅
│       └── EXAMPLE_COMPONENT.js ❌ DELETE
├── components/
│   ├── JobCard.jsx ✅
│   ├── JobCardOld.jsx ❌ DELETE
│   ├── JobTracker.jsx ✅
│   ├── JobTrackerOld.jsx ❌ DELETE
│   ├── JobTrackerOld2.jsx ❌ DELETE
│   └── layout/
│       ├── dashboard-layout.js ✅
│       └── dashboard-layout.js.backup ❌ DELETE
├── hooks/
│   ├── useAuth.js ✅ (34 lines)
│   └── useGlobalAuth.js ✅ (51 lines)
├── lib/
│   └── api/
│       ├── resumeClient.js ✅ (69 lines)
│       └── jobClient.js ✅ (49 lines)
├── services/
│   ├── resumeService.js ✅ (496 lines)
│   └── jobService.js ⚠️ (617 lines - has deprecated functions)
└── utils/
    ├── apiClient.js ⚠️ (147 lines - has unused exports)
    ├── auth.js ✅ (92 lines)
    └── errorHandler.js ✅ (172 lines)
```

**Legend:**

- ✅ Keep as-is or minor updates
- ⚠️ Needs cleanup/refactoring
- ❌ Delete immediately

---

### B. API Endpoints Reference

**Auth Endpoints:**

- POST `/api/v1/auth/signin` - Login
- POST `/api/v1/auth/signup` - Register
- POST `/api/v1/auth/logout` - Logout
- GET `/api/v1/users/me` - Get current user
- PUT `/api/v1/user-management/me/profile` - Update profile
- POST `/api/v1/auth/verify-email` - Verify email
- POST `/api/v1/auth/forgot-password` - Forgot password
- POST `/api/v1/auth/reset-password` - Reset password

**Resume Endpoints:**

- POST `/api/v1/resumes/upload_and_process` - Upload resume
- POST `/api/v1/resumes/resume-creation` - Create resume
- POST `/api/v1/resumes/{id}/enhance` - Enhance resume
- POST `/api/v1/resumes/suggested_prompts` - Get prompts
- PUT `/api/v1/resumes/{id}/save_assets` - Save assets
- GET `/api/v1/resumes/{id}` - Get resume
- GET `/api/v1/resumes/resume-list` - List resumes
- DELETE `/api/v1/resumes/{id}` - Delete resume

**Job Endpoints:**

- POST `/api/v1/integrated-jobs/with-resume-upload` - Upload resume for jobs
- POST `/api/v1/integrated-jobs/with-resume-id` - Get jobs by resume
- POST `/api/v1/integrated-jobs/search` - Search jobs
- GET `/api/v1/integrated-jobs/{id}` - Get job details
- GET `/api/v1/integrated-jobs/wishlist` - Get wishlist
- POST `/api/v1/integrated-jobs/{id}/wishlist` - Add to wishlist
- PATCH `/api/v1/integrated-jobs/job/{id}/status` - Update status
- GET `/api/v1/integrated-jobs/job-statuses` - Get user statuses
- GET `/api/v1/integrated-jobs/{id}/similar` - Similar jobs
- GET `/api/v1/integrated-jobs/recommendations` - Recommendations
- GET `/api/v1/integrated-jobs/trending` - Trending jobs

---

### C. Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
```

**Used in:**

- `app/redux/actions/authActions.js:14`
- `lib/api/resumeClient.js:3`
- `lib/api/jobClient.js:3`
- `services/resumeService.js`
- `services/jobService.js`
- `utils/apiClient.js`

---

## Conclusion

The Guidix codebase has significant architectural inconsistencies with 6 different API call patterns and redundant state management. However, the issues are well-documented and fixable with systematic refactoring.

**Key Recommendations:**

1. ✅ Delete dead code immediately (9 files)
2. ✅ Remove unused exports (6 APIClient instances)
3. ✅ Standardize on Service-First architecture
4. ✅ Simplify auth state (remove localStorage sync)
5. ✅ Centralize error handling
6. ✅ Remove unnecessary Next.js API routes

**Estimated Impact:**

- **Code Reduction:** ~10% (5,000+ lines)
- **Maintenance:** Significantly easier
- **Consistency:** Single pattern for API calls
- **Performance:** Minimal impact (slight improvement)

**Next Steps:**

1. Review and approve this analysis
2. Start with Priority 1 cleanups (low risk)
3. Plan Priority 2-3 refactoring (coordinate with team)
4. Document decisions and create standards

---

**Document Version:** 1.0
**Last Updated:** 2025-11-20
**Author:** Claude Code Analysis
**Status:** Draft - Pending Review
