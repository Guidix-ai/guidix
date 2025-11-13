import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function GET(request) {
  try {
    console.log('📋 Get Job Statuses Proxy - Received request');

    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const status = searchParams.get('status');

    console.log('📋 Query params:', { limit, offset, status });

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Build backend URL with query parameters
    const backendUrl = new URL(`${API_BASE_URL}/api/v1/integrated-jobs/job-statuses`);
    backendUrl.searchParams.append('limit', limit);
    backendUrl.searchParams.append('offset', offset);
    if (status) backendUrl.searchParams.append('status', status);

    console.log('🔄 Forwarding to:', backendUrl.toString());

    // Forward request to backend with cookies
    const response = await fetch(backendUrl.toString(), {
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
      has_statuses: !!data.statuses,
      statuses_count: data.statuses?.length || 0,
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

    console.log('✅ Job statuses fetched successfully');
    return nextResponse;

  } catch (error) {
    console.error("❌ Get job statuses proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch job statuses",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
