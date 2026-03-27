/**
 * Refresh Token BFF API Route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'No refresh token found',
          },
        },
        { status: 401 }
      );
    }

    // Forward to backend
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token refresh failed',
          },
        },
        { status: 401 }
      );
    }

    const data = await backendResponse.json();

    const response = NextResponse.json(data);

    // Set new auth token
    response.cookies.set('auth-token', data.accessToken, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during token refresh',
        },
      },
      { status: 500 }
    );
  }
}
