# 🚨 URGENT FIX: Update API Gateway URL

## ❌ Current Problem

The `.env.local` file has a placeholder API Gateway URL:
```
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway-xxxxxxxxxx-uc.a.run.app
```

This causes the login to fail with error: **"Cannot read properties of undefined (reading 'access_token')"**

## ✅ Solution

Replace the placeholder with your **ACTUAL** API Gateway URL from Google Cloud Run.

### Step 1: Get Your API Gateway URL

Run this command in your terminal:

```bash
gcloud run services describe api-gateway-service \
  --region=asia-southeast1 \
  --format='value(status.url)'
```

This will output something like:
```
https://api-gateway-abc123def456-uc.a.run.app
```

### Step 2: Update `.env.local`

Open `.env.local` and replace line 8:

**BEFORE:**
```
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway-xxxxxxxxxx-uc.a.run.app
```

**AFTER:**
```
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway-abc123def456-uc.a.run.app
```
(Use YOUR actual URL from Step 1)

### Step 3: Update Fallback URLs in Code Files

Also update the placeholder in these 4 files:

1. **`app/redux/actions/authActions.js`** (line 18):
   ```javascript
   "https://api-gateway-YOUR_ACTUAL_HASH-uc.a.run.app"
   ```

2. **`lib/api/resumeClient.js`** (line 8):
   ```javascript
   "https://api-gateway-YOUR_ACTUAL_HASH-uc.a.run.app"
   ```

3. **`lib/api/jobClient.js`** (line 8):
   ```javascript
   "https://api-gateway-YOUR_ACTUAL_HASH-uc.a.run.app"
   ```

4. **`lib/api-config.js`** (line 18-19):
   ```javascript
   "https://api-gateway-YOUR_ACTUAL_HASH-uc.a.run.app"
   ```

### Step 4: Restart Development Server

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Clear Browser Data

1. Open DevTools (F12)
2. Go to Application > Storage
3. Click "Clear site data"
4. Refresh the page

### Step 6: Test Login Again

Try logging in again. The error should be gone!

---

## 🔍 Why This Happened

When the API Gateway URL is a placeholder:
1. Axios falls back to calling the Next.js app itself
2. This hits the Next.js API route at `/app/api/v1/auth/signin/route.js`
3. That route is a **proxy** that expects the backend to return tokens in the response body
4. But your backend NOW correctly uses cookies and doesn't return tokens in the body
5. So the proxy route tries to access `data.data.tokens.access_token` and fails

## 🎯 What Should Happen After Fix

After updating the URL:
1. Login will call the API Gateway directly
2. API Gateway routes to authentication service
3. Backend sets HTTP-only cookies AND returns user data
4. Frontend stores user data (NOT tokens)
5. All subsequent requests automatically include cookies
6. ✅ Login succeeds!

---

## ⚠️ Important Notes

- **DO NOT** commit the real API Gateway URL to git if it's sensitive
- Add `.env.local` to `.gitignore` (it should already be there)
- For production deployment, set the environment variable in your hosting platform (Vercel, Netlify, etc.)
