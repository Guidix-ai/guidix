import { NextResponse } from "next/server";

/**
 * DEPRECATED: This Next.js API route proxy is no longer needed
 *
 * With cookie-based authentication, the frontend should call the backend directly:
 * - Frontend → API Gateway → Authentication Service
 *
 * The backend sets HTTP-only cookies directly in its response.
 * This proxy route is kept for backward compatibility but should not be used.
 *
 * To use direct backend calls, ensure:
 * 1. NEXT_PUBLIC_API_GATEWAY_URL is set in .env.local
 * 2. All axios calls use { withCredentials: true }
 * 3. Backend CORS allows credentials from frontend domain
 */

// Use runtime environment variable from Docker/Cloud Run
const API_BASE_URL = process.env.API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    console.log('🔑 Signin Proxy - Received request');

    const body = await request.json();
    console.log('📧 Login attempt for:', body.email);

    // Call backend auth API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);

    const data = await response.json();

    console.log("🔵 Next.js Proxy - Response from backend:", {
      ok: response.ok,
      success: data.success,
      hasTokens: !!(data.data?.tokens || data.tokens),
      authType: data.data?.authentication_type,
      dataKeys: Object.keys(data.data || {}),
      hasCookies: !!response.headers.get('set-cookie')
    });

    // Handle successful response (cookie-based OR token-based)
    if (response.ok && data.success) {
      const res = NextResponse.json(data, { status: response.status });

      // Check if backend response includes tokens in body (OLD way)
      const tokens = data.data?.tokens || data.tokens;

      if (tokens && tokens.access_token) {
        // OLD: Token-based authentication (DEPRECATED)
        console.warn('⚠️ Backend returned tokens in response body. Converting to cookies for backward compatibility.');

        const isProduction = process.env.NODE_ENV === "production";

        // Set cookies from token data
        res.cookies.set("access_token", tokens.access_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 60 * 60, // 1 hour
          path: "/",
        });

        if (tokens.refresh_token) {
          res.cookies.set("refresh_token", tokens.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
          });
        }

        if (tokens.expires_at) {
          res.cookies.set(
            "token_expiry",
            tokens.expires_at.toString(),
            {
              httpOnly: false,
              secure: isProduction,
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
            }
          );
        }
      } else {
        // NEW: Cookie-based authentication
        console.log('✅ Cookie-based auth - no tokens in response body (correct!)');

        // Forward all Set-Cookie headers from backend to client
        // Using getSetCookie() which is the standard way to get multiple Set-Cookie headers
        let setCookieHeaders = [];

        // Try multiple methods to get Set-Cookie headers
        if (typeof response.headers.getSetCookie === 'function') {
          // Modern fetch API
          setCookieHeaders = response.headers.getSetCookie();
        } else if (response.headers.raw && typeof response.headers.raw === 'function') {
          // Node.js fetch
          setCookieHeaders = response.headers.raw()['set-cookie'] || [];
        } else {
          // Fallback: iterate through all headers
          const allCookies = [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'set-cookie') {
              allCookies.push(value);
            }
          });
          setCookieHeaders = allCookies;
        }

        if (setCookieHeaders.length > 0) {
          console.log(`✅ Forwarding ${setCookieHeaders.length} Set-Cookie headers from backend:`,
            setCookieHeaders.map(h => h.split(';')[0])); // Log cookie names only

          // Forward each cookie separately
          setCookieHeaders.forEach((cookie) => {
            res.headers.append('Set-Cookie', cookie);
          });
        } else {
          console.warn('⚠️ No Set-Cookie headers received from backend');
        }
      }

      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
