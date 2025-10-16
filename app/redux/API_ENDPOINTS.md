# API Endpoints Reference

This document lists all the actual API endpoints used in your backend based on your existing implementation.

## 🔐 Authentication Endpoints

### Login (Signin)

```
POST /api/v1/auth/signin
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": false // optional
}
```

**Response (200):**

```json
{
  "success": true,
  "status_code": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "tokens": {
      "access_token": "...",
      "refresh_token": "...",
      "token_type": "bearer",
      "expires_at": 1735747800
    }
  }
}
```

### Register (Signup)

```
POST /api/v1/auth/signup
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone_number": "+1234567890", // optional
  "university_domain": "university.edu" // optional
}
```

**Response (201):**

```json
{
  "success": true,
  "status_code": 201,
  "message": "Please check your email for verification link",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "full_name": "John Doe"
    },
    "verification": {
      "sent_to": "user@example.com"
    }
  }
}
```

### Logout

```
POST /api/v1/auth/logout
```

**Headers:**

```
Authorization: Bearer <access_token>
```

### Refresh Token

```
POST /api/v1/auth/refresh
```

**Body:**

```json
{
  "refreshToken": "..."
}
```

### Verify Email

```
POST /api/v1/auth/verify-email
```

**Body:**

```json
{
  "token": "verification_token_from_email"
}
```

### Forgot Password

```
POST /api/v1/auth/forgot-password
```

**Body:**

```json
{
  "email": "user@example.com"
}
```

### Reset Password

```
POST /api/v1/auth/reset-password
```

**Body:**

```json
{
  "token": "reset_token_from_email",
  "new_password": "newpassword123"
}
```

### Get User Profile

```
GET /api/v1/auth/profile
```

**Headers:**

```
Authorization: Bearer <access_token>
```

### Update User Profile

```
PUT /api/v1/auth/profile
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "full_name": "Updated Name",
  "phone_number": "+1234567890"
}
```

---

## 📄 Resume Endpoints

### Upload and Process Resume

```
POST /api/v1/resumes/upload_and_process
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Create Resume

```
POST /api/v1/resumes/resume-creation
```

### Get Suggested Prompts

```
POST /api/v1/resumes/suggested_prompts
```

### Enhance Resume

```
POST /api/v1/resumes/{resumeId}/enhance
```

### Save Resume Assets

```
POST /api/v1/resumes/{resumeId}/save_assets
```

### Get Resume by ID

```
GET /api/v1/resumes/{resumeId}
```

### Get Resume List

```
GET /api/v1/resumes/resume-list
```

---

## 💼 Job Endpoints

### Search Jobs with Resume Upload

```
POST /api/v1/integrated-jobs/with-resume-upload
```

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Get Job by ID

```
GET /api/v1/integrated-jobs/{jobId}
```

### Add to Wishlist

```
POST /api/v1/integrated-jobs/{jobId}/wishlist
```

### Remove from Wishlist

```
DELETE /api/v1/integrated-jobs/{jobId}/wishlist
```

### Mark as Not Interested

```
POST /api/v1/integrated-jobs/{jobId}/not-interested
```

### Set Job Status

```
PUT /api/v1/integrated-jobs/user/{userId}/job/{jobId}/status
```

**Body:**

```json
{
  "status": "APPLIED" | "INTERVIEWING" | "REJECTED" | "OFFERED"
}
```

### Get Job Statuses

```
GET /api/v1/integrated-jobs/user/{userId}/job-statuses
```

### Get Wishlist

```
GET /api/v1/integrated-jobs/wishlist
```

### Get Similar Jobs

```
GET /api/v1/integrated-jobs/{jobId}/similar
```

### Search Jobs

```
POST /api/v1/integrated-jobs/search
```

**Body:**

```json
{
  "query": "software engineer",
  "location": "San Francisco",
  "filters": {}
}
```

### Get All Jobs

```
GET /api/v1/integrated-jobs/
```

### Get Recommendations

```
GET /api/v1/integrated-jobs/recommendations
```

### Get Trending Jobs

```
GET /api/v1/integrated-jobs/trending
```

---

## 🔄 Important Notes

### 1. **Authentication Flow**

- Login uses `/api/v1/auth/signin` (NOT `/api/v1/auth/login`)
- Register uses `/api/v1/auth/signup` (NOT `/api/v1/auth/register`)

### 2. **Token Management**

- Access tokens are stored in httpOnly cookies by Next.js API routes
- Refresh tokens are also in httpOnly cookies
- Automatic token refresh happens on 401 errors

### 3. **API Routes**

Your Next.js API routes act as proxies:

- `/api/v1/auth/signin/route.js` → Backend: `https://api.guidix.ai/api/v1/auth/signin`
- `/api/v1/auth/logout/route.js` → Backend: `https://api.guidix.ai/api/v1/auth/logout`
- `/api/v1/auth/refresh/route.js` → Backend: `https://api.guidix.ai/api/v1/auth/refresh`

### 4. **Response Format**

All responses follow this format:

```json
{
  "success": true,
  "status_code": 200,
  "message": "Success message",
  "data": {
    // Response data here
  }
}
```

### 5. **Error Format**

Errors follow this format:

```json
{
  "success": false,
  "status_code": 400,
  "message": "Error message",
  "errors": {
    // Validation errors if any
  }
}
```

---

## 🔧 Environment Variables

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://api.guidix.ai

# Or in production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

---

## 📝 Usage with Redux

```javascript
import { axiosInstance } from "@/app/redux/actions/authActions";

// All these endpoints are automatically authenticated
const response = await axiosInstance.get("/api/v1/resumes/resume-list");
const response = await axiosInstance.post(
  "/api/v1/integrated-jobs/search",
  data
);
```

The axios instance automatically:

- ✅ Adds `Authorization: Bearer <token>` header
- ✅ Refreshes token on 401 errors
- ✅ Retries failed requests
- ✅ Queues requests during refresh
