import { NextResponse } from 'next/server';

// Use runtime environment variable from Docker/Cloud Run
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    // Call backend logout API
    if (accessToken) {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }

    // Create response
    const res = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear all auth cookies
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    res.cookies.delete('token_expiry');

    return res;
  } catch (error) {
    console.error('Logout error:', error);

    // Still clear cookies even if backend call fails
    const res = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    res.cookies.delete('token_expiry');

    return res;
  }
}
