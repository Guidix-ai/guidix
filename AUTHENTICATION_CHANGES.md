# Authentication Implementation - Change Log

## Overview

Implemented secure HTTP-only cookie-based authentication system with proper API endpoint organization.

---

## 1. API Endpoint Structure (FINAL)

### Authentication APIs: `/api/v1/auth/*`

- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token

### Resume APIs: `/api/v1/resumes/*`

- `POST /api/v1/resumes/upload_and_process` - Upload and process resume
- `POST /api/v1/resumes/{id}/enhance` - Enhance resume
- `POST /api/v1/resumes/resume-creation` - Create resume from prompt
- `POST /api/v1/resumes/suggested_prompts` - Get suggested prompts
- `PUT /api/v1/resumes/{id}/save_assets` - Save resume assets
- `GET /api/v1/resumes/{id}` - Get specific resume
- `GET /api/v1/resumes/resume-list` - Get all user resumes

### Job APIs: `/api/v1/integrated-jobs/*`

- `POST /api/v1/integrated-jobs/with-resume-upload` - Get jobs with resume upload
- `GET /api/v1/integrated-jobs/{id}` - Get job details
- `POST /api/v1/integrated-jobs/{id}/wishlist` - Add to wishlist
- `POST /api/v1/integrated-jobs/{id}/not-interested` - Mark not interested
- `PATCH /api/v1/integrated-jobs/user/{userId}/job/{jobId}/status` - Set job status
- `GET /api/v1/integrated-jobs/user/{userId}/job-statuses` - Get user job statuses
- `GET /api/v1/integrated-jobs/wishlist` - Get wishlist
- `GET /api/v1/integrated-jobs/{id}/similar` - Get similar jobs
- `POST /api/v1/integrated-jobs/search` - Search jobs
- `GET /api/v1/integrated-jobs/` - Get jobs with AI scoring
- `GET /api/v1/integrated-jobs/recommendations` - Get recommendations
- `GET /api/v1/integrated-jobs/trending` - Get trending jobs

---

## 2. Backend URL Configuration

### Environment Variables

**Development (.env.local):**

```
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
```

**Production (.env.production):**

```
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai
```

### URL Structure

- **Backend API (for fetch calls):** `api.guidix.ai` (dev) / `api.guidix.ai` (prod)
- **Frontend (for navigation):** `localhost:3000` (dev) / `app.guidix.ai` (prod)

---

## 3. HTTP-Only Secure Cookie Implementation

### Created Next.js API Routes (Server-Side Cookie Management)

#### `/app/api/v1/auth/signin/route.js`

- Calls backend `/api/v1/auth/signin`
- Sets HTTP-only secure cookies on successful login:
  - `access_token` (httpOnly, 1 hour)
  - `refresh_token` (httpOnly, 7 days)
  - `token_expiry` (non-httpOnly for client access)
- Returns user data to client

#### `/app/api/v1/auth/logout/route.js`

- Calls backend `/api/v1/auth/logout`
- Clears all HTTP-only cookies
- Always returns success (clears cookies even if backend fails)

#### `/app/api/v1/auth/refresh/route.js`

- Reads `refresh_token` from HTTP-only cookie
- Calls backend `/api/v1/auth/refresh`
- Updates HTTP-only cookies with new tokens

### Cookie Security Configuration

```javascript
{
  httpOnly: true,        // Cannot be accessed by JavaScript (XSS protection)
  secure: isProduction,  // HTTPS only in production
  sameSite: 'lax',      // CSRF protection
  path: '/',            // Available across the app
  maxAge: 3600          // 1 hour for access, 7 days for refresh
}
```

---

## 4. Authentication Flow

### Signup Flow

1. User fills signup form
2. Calls backend `/api/v1/auth/signup`
3. Shows verification message
4. Redirects to login page after countdown

### Login Flow

1. User enters credentials
2. Calls Next.js API route `/api/v1/auth/signin`
3. Next.js route:
   - Calls backend `/api/v1/auth/signin`
   - Sets HTTP-only cookies with tokens
   - Returns user data
4. Frontend:
   - Stores user data in localStorage
   - Sets `isAuthenticated: 'true'` flag
   - Redirects to home page (`/`)

### Email Verification Error Handling

- Detects verification-related errors in login response
- Shows message: "Please verify your email before logging in. Check your inbox for the verification link."
- Error detection keywords: 'verify', 'not verified', 'verification'

### Logout Flow

1. User clicks logout
2. Calls Next.js API route `/api/v1/auth/logout`
3. Next.js route:
   - Calls backend `/api/v1/auth/logout`
   - Clears all HTTP-only cookies
4. Frontend:
   - Clears localStorage (user, isAuthenticated, userEmail)
   - Redirects to login with `?message=logged_out`

### Token Refresh Flow

1. Token about to expire
2. Calls Next.js API route `/api/v1/auth/refresh`
3. Next.js route:
   - Reads refresh_token from HTTP-only cookie
   - Calls backend `/api/v1/auth/refresh`
   - Updates HTTP-only cookies with new tokens
4. Returns success/failure

---

## 5. Files Modified

### Created Files

1. **`lib/api-config.js`** - Centralized API URL configuration

   - `API_BASE_URL` - Backend URL
   - `getApiUrl(endpoint)` - Build backend API URLs

2. **`lib/cookies.js`** - Cookie utility functions (NOT USED - using server-side cookies instead)

3. **`app/api/v1/auth/signin/route.js`** - Login API route with HTTP-only cookies

4. **`app/api/v1/auth/logout/route.js`** - Logout API route with cookie clearing

5. **`app/api/v1/auth/refresh/route.js`** - Token refresh API route

6. **`components/AuthGuard.js`** - Client-side authentication guard

7. **`middleware.js`** - Server-side route protection

### Modified Files

#### `app/login/page.js`

- Added Suspense boundary for `useSearchParams()`
- Changed to call `/api/v1/auth/signin` (Next.js API route)
- Removed token storage (now in HTTP-only cookies)
- Only stores user data in localStorage
- Redirects to home page (`/`) on success
- Added email verification error detection
- Added context-aware error messages

#### `app/signup/page.js`

- Changed to call `/api/v1/auth/signup`
- Already had redirect to login after verification message

#### `utils/auth.js`

- **`refreshAccessToken()`** - Now calls `/api/v1/auth/refresh` (Next.js route)
- **`logout()`** - Now calls `/api/v1/auth/logout` (Next.js route)
- **`isAuthenticated()`** - Checks localStorage flag instead of token
- Removed direct token access (tokens in HTTP-only cookies)

#### `utils/apiClient.js`

- Updated to use `API_BASE_URL` from `lib/api-config.js`
- All API clients use centralized backend URL

#### `services/resumeService.js`

- Updated all endpoints to `/api/v1/resumes/*` pattern:
  - `/api/v1/resumes/upload_and_process`
  - `/api/v1/resumes/{id}/enhance`
  - `/api/v1/resumes/resume-creation`
  - `/api/v1/resumes/suggested_prompts`
  - `/api/v1/resumes/{id}/save_assets`
  - `/api/v1/resumes/{id}`
  - `/api/v1/resumes/resume-list`

#### `services/jobService.js`

- Updated all endpoints to `/api/v1/integrated-jobs/*` pattern
- All job-related operations use new endpoint structure

#### `components/AuthGuard.js`

- Updated to check `isAuthenticated` flag in localStorage
- No longer checks for access_token (it's in HTTP-only cookie)

#### `middleware.js`

- Reads `access_token` from HTTP-only cookie
- Protects all routes except: `/`, `/login`, `/signup`, `/api/*`
- Redirects with appropriate message and redirect parameter

---

## 6. Tailwind CSS Changes (Build Fixes)

### Fixed Issues

1. **Removed `group` utility class** - Not supported in Tailwind v4

   - Replaced with direct CSS in module files
   - Hover effects still work using CSS selectors

2. **Added `@import "tailwindcss" reference;`** to CSS modules

   - Required for Tailwind v4 in CSS modules

3. **Fixed `bg-opacity-50`** - Changed to `bg-black/50` (modern syntax)

4. **Fixed ESLint errors** - Escaped apostrophes (`&apos;`)

### Files Changed

- `app/styles/pages/dashboard.module.css` - Removed `group`, kept hover effects
- `app/styles/pages/enhanced-resume.module.css` - Removed `group` from sections
- `app/styles/pages/ai-prompt.module.css` - Removed `group` from sample prompts
- `app/styles/components/FeatureCard.module.css` - Removed `group`, added cursor pointer
- `components/layout/dashboard-layout.js` - Removed `group` class from user profile
- `app/globals.css` - Added `.group { position: relative; }` (kept for reference)

---

## 7. Token Storage Strategy

### HTTP-Only Cookies (Server-Side Only)

✅ **access_token** - Cannot be accessed by JavaScript
✅ **refresh_token** - Cannot be accessed by JavaScript
✅ **token_expiry** - Non-httpOnly for client to check expiry

### localStorage (Client-Side)

✅ **user** - User object for UI display
✅ **userEmail** - Quick email access
✅ **isAuthenticated** - Flag to check auth status (true/false)

### Security Benefits

- ✅ Tokens protected from XSS attacks (httpOnly)
- ✅ Tokens protected from CSRF (sameSite: lax)
- ✅ HTTPS-only in production (secure flag)
- ✅ Server-side token validation
- ✅ Automatic token refresh

---

## 8. Public vs Protected Routes

### Public Routes (No Auth Required)

- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/api/*` - All API routes

### Protected Routes (Auth Required)

- `/dashboard`
- `/resume-builder/*`
- `/job-search`
- `/job-tracker`
- `/enhanced-resume`
- `/linkedin-optimizer`
- `/mock-interview`
- All other routes

---

## 9. Redirect Messages

### Login Page Messages

- `auth_required` - "Authentication Required - Please sign in to access this page"
- `session_expired` - "Session Expired - Your session has expired. Please sign in again"
- `logged_out` - "Logged Out Successfully - You have been logged out of your account"
- `unauthorized` - "Unauthorized Access - You do not have permission to access that page"

---

## 10. Build Status

### Current State

- ✅ Authentication with HTTP-only cookies implemented
- ✅ API endpoints organized by service
- ✅ Tailwind CSS issues fixed (removed group utility)
- ⚠️ Build may have errors - needs verification

### Known Issues

- Build error: "Cannot find module for page: /dashboard/page"
- Build error: "Cannot find module for page: /resume-builder/ai-generator/page"
- These pages exist but may have import/export issues

---

## 11. Next Steps (If Issues Found)

1. ✅ Verify all page files have proper default exports
2. ✅ Check for syntax errors in page components
3. ✅ Ensure all imports are correct
4. ✅ Test authentication flow end-to-end
5. ✅ Verify cookie setting/clearing works
6. ✅ Test token refresh mechanism
