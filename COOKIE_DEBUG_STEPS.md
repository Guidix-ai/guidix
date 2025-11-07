# 🍪 Cookie Debugging Guide - Local vs Live Environment

**Issue:** Cookies work on live version but not on local version.

---

## 🔍 Differences Between Local and Live

### Environment Variables:
The issue is likely that the local environment is not using the correct API URL or there's a domain/CORS issue.

---

## ✅ Steps to Fix Local Cookie Issues

### Step 1: Restart Development Server

After updating `.env.local`, you MUST restart the dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Next.js caches environment variables, so changes to `.env.local` require a full restart.

---

### Step 2: Verify Environment Variables

Check that the variables are loaded:

```bash
# In your browser console after page load:
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

# Or add this temporarily to your login page:
console.log('Environment check:', {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
});
```

---

### Step 3: Check Backend CORS Configuration

The backend must allow credentials from your local domain:

**Required Backend CORS Settings:**
```python
# In your FastAPI backend:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local frontend
        "https://app.guidix.ai",  # Production frontend
    ],
    allow_credentials=True,  # CRITICAL for cookies!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Without `allow_credentials=True`, cookies will NOT work!**

---

### Step 4: Test Login and Check Cookies

1. Open DevTools → Network tab
2. Log in with credentials
3. Look for the `/api/v1/auth/signin` request
4. Check the response:

**Response Headers should include:**
```
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Lax
```

5. Go to DevTools → Application → Cookies
6. Check if cookies are stored for `localhost:3000`

---

### Step 5: Check Console Logs

**Terminal (Next.js server) should show:**
```
🔑 Signin Proxy - Received request
📧 Login attempt for: user@example.com
📥 Backend response status: 200
🔵 Next.js Proxy - Response from backend: {
  ok: true,
  success: true,
  hasTokens: false,
  hasCookies: true
}
✅ Forwarding 2 Set-Cookie headers from backend: [
  'access_token=...',
  'refresh_token=...'
]
```

**Browser Console should show:**
```
✅ Login successful
```

---

## 🐛 Common Issues and Solutions

### Issue 1: "No Set-Cookie headers received from backend"

**Cause:** Backend is not returning cookies in the response.

**Solution:**
- Check backend CORS has `allow_credentials=True`
- Verify backend is setting cookies (not returning tokens in JSON)
- Check backend logs for errors

### Issue 2: Cookies set but immediately cleared

**Cause:** Domain mismatch or cookie settings incompatible with local development.

**Solution:**
```javascript
// In signin route, temporarily change cookie settings for development:
const isProduction = process.env.NODE_ENV === "production";

res.cookies.set("access_token", token, {
  httpOnly: true,
  secure: false,  // Set to false for local HTTP
  sameSite: "lax",
  maxAge: 60 * 60,
  path: "/",
});
```

### Issue 3: CORS errors in browser console

**Error:** `Access to fetch at 'https://api.guidix.ai/...' from origin 'http://localhost:3000' has been blocked by CORS`

**Solution:**
- This should NOT happen because you're calling Next.js proxy routes, not backend directly
- If you see this, check that your code is calling `/api/v1/...` (proxy) not `https://api.guidix.ai/...` (direct)

### Issue 4: "credentials: 'include'" not working

**Cause:** Mixed content (HTTPS backend from HTTP frontend)

**Solution for local development:**
1. Either use HTTP backend locally:
   ```bash
   # In .env.local
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   API_BASE_URL=http://localhost:8000
   ```

2. Or use HTTPS for local frontend:
   ```bash
   # Create local SSL certificate
   npm install -g mkcert
   mkcert -install
   mkcert localhost

   # Then run Next.js with HTTPS
   # (requires custom server)
   ```

---

## 🔧 Temporary Workaround for Testing

If cookies still don't work locally, you can temporarily modify the signin route to manually set cookies:

```javascript
// In app/api/v1/auth/signin/route.js

// After getting response from backend:
if (response.ok && data.success) {
  const res = NextResponse.json(data, { status: response.status });

  // TEMPORARY: Manually extract and set cookies from backend response
  const backendCookies = response.headers.get('set-cookie');
  console.log('🍪 Backend cookies:', backendCookies);

  // If backend sent tokens in body (fallback for testing):
  const tokens = data.data?.tokens || data.tokens;
  if (tokens?.access_token) {
    res.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: false,  // false for local HTTP
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    if (tokens.refresh_token) {
      res.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    console.log('✅ Manually set cookies from token data');
  }

  return res;
}
```

---

## ✅ Verification Checklist

Test each item:

- [ ] `.env.local` has `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` set
- [ ] Dev server was restarted after changing `.env.local`
- [ ] Backend has `allow_credentials=True` in CORS
- [ ] Login request goes to `/api/v1/auth/signin` (not direct backend)
- [ ] Response includes `Set-Cookie` headers
- [ ] Cookies appear in DevTools → Application → Cookies
- [ ] Cookies are sent with subsequent requests
- [ ] Protected routes work after login

---

## 📊 Compare Live vs Local

| Aspect | Live (Working) | Local (Not Working) | Action |
|--------|---------------|---------------------|--------|
| Frontend URL | https://app.guidix.ai | http://localhost:3000 | ✅ OK |
| Backend URL | https://api.guidix.ai | https://api.guidix.ai | ✅ OK |
| Secure cookies | Yes (HTTPS) | No (HTTP) | ⚠️ Set `secure: false` locally |
| CORS origin | app.guidix.ai | localhost:3000 | ⚠️ Check backend allows localhost |
| SameSite | Lax | Lax | ✅ OK |

---

## 🧪 Test Script

Run this in browser console after login attempt:

```javascript
// Check if cookies were set
const cookies = document.cookie;
console.log('All cookies:', cookies);

// Check if we can access httpOnly cookies (should be empty if working correctly)
console.log('Document cookies:', document.cookie);

// Try to make an authenticated request
fetch('/api/v1/resumes/resume-list', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(data => console.log('Auth test result:', data))
  .catch(err => console.error('Auth test failed:', err));
```

---

## 🎯 Most Likely Cause

Based on the symptoms (working live but not local), the most likely causes are:

1. **Dev server not restarted** after `.env.local` changes
2. **Backend CORS doesn't allow localhost:3000** with credentials
3. **Secure cookie flag** prevents cookies on HTTP (local)

**Quick Fix:**
```bash
# 1. Stop server
Ctrl+C

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart
npm run dev
```

Then test login again and check terminal/console logs.

---

**Need Help?**
- Check terminal logs for proxy messages
- Check browser console for errors
- Check Network tab for Set-Cookie headers
- Compare request/response between local and live (use DevTools)
