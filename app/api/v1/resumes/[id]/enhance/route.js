import { NextResponse } from "next/server";

/**
 * Next.js API Route Proxy for Resume Enhancement
 * Handles cookie forwarding for authentication
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    console.log('✨ Resume Enhancement Proxy - Resume ID:', id);

    const body = await request.json();
    console.log('✨ Request body:', body);

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");

    // Forward request to backend
    const backendUrl = `${API_BASE_URL}/api/v1/resumes/${id}/enhance`;
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

    if (!response.ok) {
      console.error('❌ Enhancement error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    // Forward Set-Cookie headers from backend if any
    const nextResponse = NextResponse.json(data, { status: 200 });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    console.log('✅ Resume enhancement successful');
    return nextResponse;

  } catch (error) {
    console.error("❌ Resume enhancement proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to enhance resume",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
