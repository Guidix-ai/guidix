import { NextResponse } from "next/server";

/**
 * Next.js API Route Proxy for Resume List
 * Handles cookie forwarding for authentication
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function GET(request) {
  try {
    console.log('📋 Resume List Proxy - Received request');

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Forward request to backend
    const backendUrl = `${API_BASE_URL}/api/v1/resumes/resume-list`;
    console.log('🔄 Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
      },
    });

    console.log('📥 Backend response status:', response.status);

    const data = await response.json();
    console.log('📥 Backend response:', {
      success: data.success,
      has_data: !!data.data,
      count: Array.isArray(data.data) ? data.data.length : 'N/A',
      error: data.message || data.detail
    });

    if (!response.ok) {
      console.error('❌ Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    // Forward Set-Cookie headers from backend if any
    const nextResponse = NextResponse.json(data, { status: 200 });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    console.log('✅ Resume list fetched successfully');
    return nextResponse;

  } catch (error) {
    console.error("❌ Resume list proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch resumes",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
