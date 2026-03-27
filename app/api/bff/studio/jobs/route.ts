/**
 * Jobs API Route
 * GET /api/bff/studio/jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/api/logger';
import jwtManager from '@/lib/auth/jwt';
import type { ApiResponse, Job } from '@/types';

const logger = getLogger('jobs-api');

export async function GET(request: NextRequest) {
  try {
    // JWT Authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.', statusCode: 401 } },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = await jwtManager.verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.', statusCode: 401 } },
        { status: 401 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Generate mock jobs data
    const mockJobs: Job[] = [
      {
        id: 'job_1',
        userId: payload.userId,
        toolType: 'face_swap',
        status: 'completed',
        input: { primaryFile: 'https://example.com/src.jpg', parameters: {} },
        output: { url: 'https://example.com/result.mp4', thumbnailUrl: 'https://example.com/thumb.jpg', duration: 12, size: 1024, format: 'mp4', metadata: {} },
        progress: 100,
        creditsCost: 50,
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
        startedAt: new Date(Date.now() - 1000 * 60 * 19),
        completedAt: new Date(Date.now() - 1000 * 60 * 15),
        metadata: { quality: 'high' },
      },
      {
        id: 'job_2',
        userId: payload.userId,
        toolType: 'text_to_video',
        status: 'processing',
        input: { primaryFile: '', parameters: { prompt: 'A serene forest' } },
        progress: 45,
        creditsCost: 120,
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        metadata: { speed: 'balanced' },
      },
    ];

    const jobs = mockJobs.slice(offset, offset + limit);
    const hasMore = offset + limit < mockJobs.length;

    logger.info('Jobs fetched successfully', {
      userId: payload.userId,
      count: jobs.length,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          jobs,
          total: mockJobs.length,
          hasMore,
        },
        meta: {
          timestamp: new Date(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        },
      } as ApiResponse<{ jobs: Job[]; total: number; hasMore: boolean }>
    );

  } catch (error) {
    logger.error('Failed to fetch jobs:', error);

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch jobs.', statusCode: 500 } },
      { status: 500 }
    );
  }
}