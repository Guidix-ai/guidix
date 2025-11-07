import { NextResponse } from "next/server";

/**
 * DEPRECATED: This Next.js API route proxy is no longer needed
 *
 * With cookie-based authentication, the frontend should call the backend directly.
 * The backend handles cookie refresh directly.
 */

// Use runtime environment variable from Docker/Cloud Run
const API_BASE_URL = process.env.API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    // Get ALL cookies from request header to forward to backend
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader || !cookieHeader.includes("refresh_token")) {
      return NextResponse.json(
        { success: false, message: "No refresh token found" },
        { status: 401 }
      );
    }

    // Call backend refresh API with ALL cookies
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,  // Forward ALL cookies
      },
    });

    const data = await response.json();

    // NEW: Handle cookie-based authentication
    // Backend sets new cookies directly
    if (response.ok && data.success) {
      const res = NextResponse.json(data, { status: response.status });

      // Forward cookies from backend to client
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        res.headers.set('set-cookie', setCookieHeader);
      }

      return res;
    }

    // OLD: Token-based authentication (DEPRECATED)
    if (response.ok && data.data?.tokens) {
      console.warn('⚠️ Backend returned tokens in response body. This is deprecated. Use cookie-based auth instead.');

      const res = NextResponse.json(data, { status: response.status });

      const isProduction = process.env.NODE_ENV === "production";

      // Update access token
      res.cookies.set("access_token", data.data.tokens.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      // Update refresh token if provided
      if (data.data.tokens.refresh_token) {
        res.cookies.set("refresh_token", data.data.tokens.refresh_token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
      }

      // Update token expiry
      if (data.data.tokens.expires_at) {
        res.cookies.set(
          "token_expiry",
          data.data.tokens.expires_at.toString(),
          {
            httpOnly: false,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          }
        );
      }

      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Token refresh failed" },
      { status: 500 }
    );
  }
}
