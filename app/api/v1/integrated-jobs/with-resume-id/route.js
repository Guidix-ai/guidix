import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    console.log('🎯 Get Jobs with Resume ID Proxy - Received request');

    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resume_id');
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const forceRefresh = searchParams.get('force_refresh') || 'false';

    console.log('🎯 Query params:', { resumeId, limit, offset, forceRefresh });

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Build backend URL with query parameters
    const backendUrl = new URL(`${API_BASE_URL}/api/v1/integrated-jobs/with-resume-id`);
    backendUrl.searchParams.append('resume_id', resumeId);
    backendUrl.searchParams.append('limit', limit);
    backendUrl.searchParams.append('offset', offset);
    backendUrl.searchParams.append('force_refresh', forceRefresh);

    console.log('🔄 Forwarding to:', backendUrl.toString());

    // Forward request to backend with cookies
    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
      },
    });

    console.log('📥 Backend response status:', response.status);

    const data = await response.json();
    console.log('📥 Backend response:', {
      success: data.success,
      has_jobs: !!data.jobs,
      jobs_count: data.jobs?.length || 0,
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

    console.log('✅ Jobs with resume ID fetched successfully');
    return nextResponse;

  } catch (error) {
    console.error("❌ Get jobs with resume ID proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch jobs with resume ID",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
