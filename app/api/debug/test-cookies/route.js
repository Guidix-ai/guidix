import { NextResponse } from "next/server";

/**
 * Debug endpoint to test cookie setting
 * Access at: http://localhost:3000/api/debug/test-cookies
 */

export async function GET(request) {
  console.log('🧪 Cookie Test - Testing cookie functionality');

  // Read any existing cookies from the request
  const cookieHeader = request.headers.get('cookie');
  console.log('📥 Incoming cookies:', cookieHeader || 'None');

  // Create response with test data
  const response = NextResponse.json({
    success: true,
    message: 'Cookie test endpoint',
    timestamp: new Date().toISOString(),
    receivedCookies: cookieHeader || 'None',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL || 'Not set',
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'
    }
  });

  // Set test cookies
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set('test_cookie_1', 'test_value_1', {
    httpOnly: false,  // Non-httpOnly so we can see it in document.cookie
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60,  // 1 minute
    path: '/',
  });

  response.cookies.set('test_cookie_2_httponly', 'secret_value', {
    httpOnly: true,  // HttpOnly like real auth cookies
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60,
    path: '/',
  });

  console.log('✅ Set 2 test cookies (1 visible, 1 httpOnly)');

  return response;
}

export async function POST(request) {
  console.log('🧪 Cookie Test POST - Testing backend cookie forwarding');

  const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.guidix.ai";

  try {
    // Try to call backend health endpoint
    console.log('🔄 Calling backend:', `${API_BASE_URL}/health`);

    const backendResponse = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Backend response status:', backendResponse.status);

    // Check if backend sends any Set-Cookie headers
    let setCookieHeaders = [];
    if (typeof backendResponse.headers.getSetCookie === 'function') {
      setCookieHeaders = backendResponse.headers.getSetCookie();
    } else {
      const allCookies = [];
      backendResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          allCookies.push(value);
        }
      });
      setCookieHeaders = allCookies;
    }

    console.log('🍪 Backend Set-Cookie headers:', setCookieHeaders.length);

    const data = await backendResponse.json().catch(() => ({ status: 'unknown' }));

    return NextResponse.json({
      success: true,
      backend: {
        url: `${API_BASE_URL}/health`,
        status: backendResponse.status,
        ok: backendResponse.ok,
        data: data,
        setCookieCount: setCookieHeaders.length,
        setCookieHeaders: setCookieHeaders
      }
    });

  } catch (error) {
    console.error('❌ Backend test failed:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      backend: {
        url: `${API_BASE_URL}/health`,
        reachable: false
      }
    }, { status: 500 });
  }
}
