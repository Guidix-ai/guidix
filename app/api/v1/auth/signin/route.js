import { NextResponse } from "next/server";

// Use runtime environment variable from Docker/Cloud Run
const API_BASE_URL = process.env.API_BASE_URL || "http://api.guidix.ai";

export async function POST(request) {
  try {
    const body = await request.json();

    // Call backend auth API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok && data.success && data.data?.tokens) {
      // Create response with data
      const res = NextResponse.json(data, { status: response.status });

      // Set HTTP-only secure cookies
      const isProduction = process.env.NODE_ENV === "production";

      // Access token (1 hour)
      res.cookies.set("access_token", data.data.tokens.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      // Refresh token (7 days)
      res.cookies.set("refresh_token", data.data.tokens.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Token expiry (not sensitive, can be non-httpOnly for client access)
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
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
