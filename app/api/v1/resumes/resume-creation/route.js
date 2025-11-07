import { NextResponse } from "next/server";

/**
 * Next.js API Route Proxy for Resume Creation
 * Handles cookie forwarding for authentication
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function POST(request) {
  try {
    console.log('📝 Resume Creation Proxy - Received request');

    const body = await request.json();
    console.log('📝 Request body:', {
      has_prompt: !!body.user_prompt,
      has_name: !!body.resume_name,
      has_template: !!body.template_id
    });

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Forward request to backend
    const backendUrl = `${API_BASE_URL}/api/v1/resumes/resume-creation`;
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

    console.log('✅ Resume creation successful');
    return nextResponse;

  } catch (error) {
    console.error("❌ Resume creation proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create resume",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
