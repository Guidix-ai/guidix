# JWT Authentication with Redux Toolkit

Complete JWT authentication system with access and refresh tokens using Redux Toolkit, Axios, and js-cookie.

## 🚀 Features

- ✅ **Automatic token injection** - Access tokens automatically attached to all authenticated requests
- ✅ **Automatic token refresh** - On 401 error, automatically refreshes and retries
- ✅ **Request queuing** - Queues requests during token refresh to avoid race conditions
- ✅ **Public endpoints** - Login, register, forgot password excluded from token logic
- ✅ **Redux state management** - Loading, error, and success states for all auth actions
- ✅ **localStorage persistence** - User data persists across page refreshes
- ✅ **Cookie-based tokens** - Secure token storage in cookies

## 📁 File Structure

```
app/redux/
├── actions/
│   ├── authActions.js           # All auth actions + axios instance
│   └── exampleProtectedAPI.js   # Example protected API calls
├── reducers/
│   └── authSlice.js             # Auth state management
└── store.js                      # Redux store configuration
```

## 🔧 Configuration

### 1. Set API Base URL

Update in `authActions.js`:

```javascript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://api.guidix.ai";
```

### 2. Public Endpoints

Modify in `authActions.js` to match your API:

```javascript
const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/refresh",
];
```

## 💻 Usage Examples

### Login

```javascript
"use client";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/app/redux/actions/authActions";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      email: "user@example.com",
      password: "password123",
    };

    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Redirect to dashboard or home
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error.login && <div className="error">{error.login}</div>}
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit" disabled={loading.login}>
        {loading.login ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Register

```javascript
import { registerUser } from "@/app/redux/actions/authActions";

const handleRegister = async (userData) => {
  try {
    await dispatch(registerUser(userData)).unwrap();
    // Show success message
    alert("Registration successful!");
  } catch (err) {
    console.error("Registration failed:", err);
  }
};
```

### Logout

```javascript
import { logoutUser } from "@/app/redux/actions/authActions";

const handleLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap();
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
```

### Protected API Calls

```javascript
import { getUserProfile } from "@/app/redux/actions/authActions";

// Fetch user profile (automatically handles token)
const loadProfile = async () => {
  try {
    await dispatch(getUserProfile()).unwrap();
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
};
```

### Custom Protected API Call

```javascript
import { axiosInstance } from "@/app/redux/actions/authActions";

// Create your own protected API call
const fetchMyData = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/my-data");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

## 🔒 Authentication Flow

### 1. **Login Process**

```
User enters credentials
    ↓
dispatch(loginUser(credentials))
    ↓
POST /api/v1/auth/login
    ↓
Backend returns { user, tokens: { accessToken, refreshToken } }
    ↓
Store tokens in cookies (access_token, refresh_token)
Store user in localStorage
Update Redux state (isAuthenticated = true, user = userData)
    ↓
Redirect to dashboard
```

### 2. **Protected Request Process**

```
User makes API request
    ↓
Request Interceptor:
- Check if URL requires auth (not in PUBLIC_ENDPOINTS)
- If yes, attach: Authorization: Bearer <access_token>
    ↓
Send request to backend
    ↓
Response Interceptor:
- If 200 OK → Return response
- If 401 Unauthorized → Go to Token Refresh Flow
- If other error → Return error
```

### 3. **Token Refresh Flow**

```
Receive 401 Unauthorized
    ↓
Check if already refreshing
- If yes → Queue this request
- If no → Start refresh process
    ↓
POST /api/v1/auth/refresh
Body: { refreshToken }
    ↓
Backend returns new tokens
    ↓
Store new tokens in cookies
Update Authorization header
    ↓
Process queued requests with new token
Retry original request
    ↓
If refresh fails:
- Clear all tokens
- Redirect to /login
```

## 📊 Redux State Structure

```javascript
{
  auth: {
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      // ... other user fields
    },
    isAuthenticated: true,
    hasTokens: true,
    loading: {
      login: false,
      register: false,
      logout: false,
      profile: false,
      // ... other loading states
    },
    error: {
      login: null,
      register: null,
      logout: null,
      profile: null,
      // ... other error states
    },
    success: {
      register: 'Registration successful!',
      forgotPassword: null,
      resetPassword: null,
      verifyEmail: null,
    }
  }
}
```

## 🛡️ Security Features

1. **Tokens in Cookies** - More secure than localStorage

   - `access_token` expires in 1 hour
   - `refresh_token` expires in 7 days

2. **Automatic Refresh** - Tokens refresh before expiry

3. **Request Queuing** - Prevents race conditions during refresh

4. **CSRF Protection** - Use `withCredentials: true` for cookie handling

## 🔄 Accessing Auth State

```javascript
import { useSelector } from "react-redux";

// In your component
const MyComponent = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  if (loading.profile) {
    return <div>Loading profile...</div>;
  }

  if (error.profile) {
    return <div>Error: {error.profile}</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.name}!</div>;
};
```

## 🧹 Clearing State

```javascript
import {
  clearErrors,
  clearSuccessMessages,
} from "@/app/redux/reducers/authSlice";

// Clear all errors
dispatch(clearErrors());

// Clear specific error
dispatch(clearError("login"));

// Clear success messages
dispatch(clearSuccessMessages());

// Clear specific success message
dispatch(clearSuccessMessage("register"));
```

## 🎯 Best Practices

1. **Always use `.unwrap()`** when calling async thunks to catch errors:

   ```javascript
   try {
     await dispatch(loginUser(creds)).unwrap();
   } catch (err) {
     // Handle error
   }
   ```

2. **Clear errors on unmount** or when user navigates away:

   ```javascript
   useEffect(() => {
     return () => {
       dispatch(clearError("login"));
     };
   }, []);
   ```

3. **Check authentication before rendering**:

   ```javascript
   if (!isAuthenticated) {
     router.push("/login");
     return null;
   }
   ```

4. **Use the provided axios instance** for all API calls to get automatic token handling

5. **Store sensitive data in cookies** (tokens) and non-sensitive in localStorage (user info)

## 🐛 Troubleshooting

### "Module not found" Error

Make sure axios and js-cookie are installed:

```bash
npm install axios js-cookie
```

### Tokens not persisting

Check cookie settings - ensure `withCredentials: true` is set

### Refresh loop

Verify `/api/v1/auth/refresh` is in PUBLIC_ENDPOINTS array

### 401 after refresh

Check backend refresh token endpoint returns proper token structure:

```javascript
{
  data: {
    tokens: {
      accessToken: '...',
      refreshToken: '...'
    }
  }
}
```

## 📝 API Response Format

Your backend should return responses in this format:

```javascript
// Success
{
  data: {
    user: { /* user object */ },
    tokens: {
      accessToken: 'xxx',
      refreshToken: 'yyy'
    }
  }
}

// Error
{
  message: 'Error message here'
}
```

## 🎨 Example Component

See `exampleProtectedAPI.js` for complete examples of:

- Simple GET/POST requests
- File uploads
- Pagination
- Batch operations
- File downloads
- Redux thunk integration

---

**Need help?** Check `exampleProtectedAPI.js` for more examples or refer to the inline comments in the code.
