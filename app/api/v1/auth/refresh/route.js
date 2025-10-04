import { NextResponse } from 'next/server';

// Use runtime environment variable from Docker/Cloud Run
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Call backend refresh API
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (response.ok && data.data?.tokens) {
      // Create response with data
      const res = NextResponse.json(data, { status: response.status });

      const isProduction = process.env.NODE_ENV === 'production';

      // Update access token
      res.cookies.set('access_token', data.data.tokens.access_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      // Update refresh token
      res.cookies.set('refresh_token', data.data.tokens.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      // Update token expiry
      if (data.data.tokens.expires_at) {
        res.cookies.set('token_expiry', data.data.tokens.expires_at.toString(), {
          httpOnly: false,
          secure: isProduction,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
      }

      return res;
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, message: 'Token refresh failed' },
      { status: 500 }
    );
  }
}
