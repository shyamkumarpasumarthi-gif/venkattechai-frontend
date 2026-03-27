/**
 * Login BFF API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateLogin } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validation = validateLogin(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid credentials',
            details: validation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const data = await backendResponse.json();

    const response = NextResponse.json(data);

    // Set secure httpOnly cookie
    response.cookies.set('auth-token', data.accessToken, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    if (data.refreshToken) {
      response.cookies.set('refresh-token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during login',
        },
      },
      { status: 500 }
    );
  }
}
