import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    console.log('💡 Suggested Prompts Proxy - Received request');

    const body = await request.json();
    console.log('💡 Request body:', {
      has_academic_year: !!body.academic_year,
      has_degree: !!body.degree,
      has_branch: !!body.branch,
      internship_or_job: body.internship_or_job
    });

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Forward request to backend
    const backendUrl = `${API_BASE_URL}/api/v1/resumes/suggested_prompts`;
    console.log('🔄 Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Backend response status:', response.status);

    const data = await response.json();
    console.log('📥 Backend response:', {
      success: data.success,
      has_data: !!data.data,
      prompts_count: data.data?.suggested_prompts?.length || 0,
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

    console.log('✅ Suggested prompts fetched successfully');
    return nextResponse;

  } catch (error) {
    console.error("❌ Suggested prompts proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get suggested prompts",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
