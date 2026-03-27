/**
 * Face Swap Studio Tool BFF Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const FaceSwapSchema = z.object({
  sourceImageUrl: z.string().url(),
  targetVideoUrl: z.string().url(),
  speed: z.enum(['fast', 'balanced', 'high-quality']).default('balanced'),
  quality: z.enum(['standard', 'high', 'ultra']).default('high'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = FaceSwapSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request',
          },
        },
        { status: 400 }
      );
    }

    // Get bearer token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Missing token' },
        },
        { status: 401 }
      );
    }

    // Forward to backend
    const backendResponse = await fetch(
      `${process.env.BACKEND_API_URL}/studio/face-swap`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      }
    );

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Face swap error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred',
        },
      },
      { status: 500 }
    );
  }
}
