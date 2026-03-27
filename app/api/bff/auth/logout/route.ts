/**
 * Logout BFF API Route
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookies
    response.cookies.set('auth-token', '', { maxAge: 0, httpOnly: true });
    response.cookies.set('refresh-token', '', { maxAge: 0, httpOnly: true });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during logout',
        },
      },
      { status: 500 }
    );
  }
}
