import { NextResponse } from "next/server";

/**
 * Next.js API Route Proxy for Resume Assets Save
 * Handles file upload (PDF + screenshot) with cookie authentication
 */

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

export async function PUT(request, { params }) {
  try {
    const { id: resumeId } = params;
    console.log('💾 Resume Save Assets Proxy - Received request for resume:', resumeId);

    // Get the FormData from the request
    const formData = await request.formData();

    // Log file info
    const pdfFile = formData.get('pdf_file');
    const screenshot = formData.get('screenshot');
    if (pdfFile) {
      console.log('📄 PDF file:', { name: pdfFile.name, size: pdfFile.size, type: pdfFile.type });
    }
    if (screenshot) {
      console.log('📸 Screenshot:', { name: screenshot.name, size: screenshot.size, type: screenshot.type });
    }

    // Get cookies from request
    const cookieHeader = request.headers.get("cookie");
    console.log('🍪 Cookies present:', !!cookieHeader);

    // Forward request to backend
    const backendUrl = `${API_BASE_URL}/api/v1/resumes/${resumeId}/save_assets`;
    console.log('🔄 Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        // Don't set Content-Type - browser sets it with boundary for multipart/form-data
        ...(cookieHeader ? { "Cookie": cookieHeader } : {}),
      },
      body: formData, // Forward the FormData as-is
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

    console.log('✅ Resume assets saved successfully');
    return nextResponse;

  } catch (error) {
    console.error("❌ Save assets proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save resume assets",
        detail: error.message,
        error: "PROXY_ERROR"
      },
      { status: 500 }
    );
  }
}
