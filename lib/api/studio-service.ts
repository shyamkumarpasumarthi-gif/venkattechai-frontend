/**
 * Studio Service
 * Handles studio-related API calls through BFF.
 */

import { bffClient } from './bff-client';
import { getLogger } from './logger';

const logger = getLogger('studio-service');

export interface FaceSwapRequest {
  sourceImageUrl: string;
  targetVideoUrl: string;
  speed?: 'fast' | 'balanced' | 'high-quality';
  quality?: 'standard' | 'high' | 'ultra';
}

export interface FaceSwapResponse {
  success: boolean;
  outputUrl: string;
  jobId?: string;
  message?: string;
}

export class StudioService {
  static async faceSwap(payload: FaceSwapRequest): Promise<FaceSwapResponse> {
    try {
      const response = await bffClient.post('/bff/studio/face-swap', payload);
      return (response.data as { data: FaceSwapResponse }).data;
    } catch (error) {
      logger.error('faceSwap failed:', error);
      throw error;
    }
  }
}

export default StudioService;
