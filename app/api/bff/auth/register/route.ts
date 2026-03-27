/**
 * Register BFF API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRegister } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validation = validateRegister(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid registration data',
            details: validation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // Forward to backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: validation.data.email,
          password: validation.data.password,
          name: validation.data.name,
        }),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during registration',
        },
      },
      { status: 500 }
    );
  }
}
