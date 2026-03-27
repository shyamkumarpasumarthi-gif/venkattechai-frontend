/**
 * Studio & AI Tools Types
 * Defines interfaces for all AI generation features
 */

export type StudioToolType =
  | 'face_swap'
  | 'image_to_video'
  | 'text_to_video'
  | 'motion_generation'
  | 'background_removal'
  | 'image_upscaling';

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ProcessingSpeed = 'fast' | 'balanced' | 'high-quality';

export interface StudioTool {
  id: StudioToolType;
  name: string;
  description: string;
  icon: string;
  creditsPerUse: number;
  enabled: boolean;
  beta: boolean;
  category: 'video' | 'image' | 'animation';
}

export interface Job {
  id: string;
  userId: string;
  toolType: StudioToolType;
  status: JobStatus;
  input: JobInput;
  output?: JobOutput;
  progress: number;
  creditsCost: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  metadata: Record<string, any>;
}

export interface JobInput {
  primaryFile?: string;
  secondaryFile?: string;
  parameters?: Record<string, any>;
  webhookUrl?: string;
  [key: string]: any;
}

export interface JobOutput {
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  size?: number;
  format?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface FaceSwapRequest {
  sourceImageUrl: string;
  targetVideoUrl: string;
  speed: ProcessingSpeed;
  quality: 'standard' | 'high' | 'ultra';
}

export interface ImageToVideoRequest {
  imageUrl: string;
  duration: number;
  speed: ProcessingSpeed;
  motionIntensity: number;
}

export interface TextToVideoRequest {
  text: string;
  voiceId?: string;
  style?: string;
  duration?: number;
  speed: ProcessingSpeed;
}

export interface MotionGenerationRequest {
  imageUrl: string;
  motionType: 'pan' | 'zoom' | 'rotate' | 'custom';
  intensity: number;
  duration: number;
  speed: ProcessingSpeed;
}

export interface BackgroundRemovalRequest {
  imageUrl: string;
  quality: 'standard' | 'high' | 'ultra';
  replaceWithColor?: string;
  replaceWithImage?: string;
}

export interface ImageUpscalingRequest {
  imageUrl: string;
  scaleFactor: 2 | 4 | 8;
  speed: ProcessingSpeed;
  quality: 'balanced' | 'quality' | 'maximum';
}

export interface UploadedFile {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
  expiresAt: Date;
}

export interface ProcessingStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  creditsCostThisMonth: number;
}
