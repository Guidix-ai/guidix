import { NextResponse } from "next/server";

/**
 * Logout API Route
 * Clears authentication cookies and optionally calls backend logout
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    // Get cookies from request header to forward to backend
    const cookieHeader = request.headers.get("cookie");

    // Call backend logout API with cookies (not Authorization header!)
    if (cookieHeader) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,  // Forward cookies, not Bearer token
          },
        });
      } catch (backendError) {
        // Log but don't fail - clearing cookies is more important
        console.warn("Backend logout failed, but clearing cookies anyway:", backendError.message);
      }
    }

    // Create response
    const res = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear all auth cookies
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    res.cookies.delete("token_expiry");

    return res;
  } catch (error) {
    console.error("Logout error:", error);

    // Still clear cookies even if there's an error
    const res = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    res.cookies.delete("token_expiry");

    return res;
  }
}
