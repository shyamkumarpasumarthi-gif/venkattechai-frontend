/**
 * Image to Video Tool Component
 * Convert static images to dynamic videos
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/studio/FileUploader';
import { Badge } from '@/components/ui/Badge';
import { Upload, Play, Download, AlertCircle } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import type { StudioTool } from '@/types';

interface ImageToVideoToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const ImageToVideoTool: React.FC<ImageToVideoToolProps> = ({ tool, onBack }) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [motionPrompt, setMotionPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { balance } = useWalletStore();
  const { addJob, updateJob } = useStudioStore();

  const canProcess = sourceImage && motionPrompt.trim() && balance && balance.credits >= tool.creditsPerUse;

  const handleProcess = async () => {
    if (!canProcess) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Create job
      const jobId = `image-to-video-${Date.now()}`;
      const job = {
        id: jobId,
        userId: 'current-user', // Will be set from auth
        toolType: 'image_to_video' as const,
        status: 'processing' as const,
        input: {
          sourceImage: sourceImage!.name,
          motionPrompt,
          duration: parseInt(duration),
        },
        progress: 0,
        creditsCost: tool.creditsPerUse,
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: {},
      };

      addJob(job);

      // Simulate processing
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 12;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Complete job
            const completedJob = {
              ...job,
              status: 'completed' as const,
              progress: 100,
              completedAt: new Date(),
              output: { videoUrl: `/api/results/${jobId}.mp4` },
            };
            updateJob(completedJob);
            setResult(`/api/results/${jobId}.mp4`);
            setIsProcessing(false);
            return 100;
          }
          // Update job progress
          updateJob({ ...job, progress: newProgress });
          return newProgress;
        });
      }, 1000);

    } catch (err) {
      setError('Failed to generate video. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{tool.icon}</div>
              <div>
                <CardTitle className="text-2xl">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="info" className="px-3 py-1">
                {tool.creditsPerUse} credits
              </Badge>
              <Button variant="outline" onClick={onBack}>
                ← Back
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Source Image</CardTitle>
          <CardDescription>Upload a high-quality image to convert to video</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader
            onFilesSelected={(files) => setSourceImage(files[0] || null)}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
            multiple={false}
            maxSize={20 * 1024 * 1024} // 20MB
          />
          {sourceImage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Upload size={16} />
                <span className="text-sm font-medium">{sourceImage.name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motion Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Motion Description</CardTitle>
          <CardDescription>Describe how you want the image to move and animate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Motion Prompt
            </label>
            <textarea
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="e.g., The camera slowly zooms in while the subject gently waves, with soft lighting changes..."
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-24 resize-none"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Video Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="15">15 seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Quality Preset
              </label>
              <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Standard</option>
                <option selected>High</option>
                <option>Ultra (Best Quality)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="add-music" defaultChecked className="w-4 h-4 rounded" />
            <label htmlFor="add-music" className="text-sm text-secondary-700">
              Add background music
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Process Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              {!canProcess && balance && balance.credits < tool.creditsPerUse && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  Insufficient credits. You need {tool.creditsPerUse} credits.
                </span>
              )}
            </div>

            <Button
              onClick={handleProcess}
              disabled={!canProcess || isProcessing}
              icon={isProcessing ? undefined : <Play size={18} />}
              className="min-w-32"
            >
              {isProcessing ? 'Generating...' : 'Generate Video'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generating video...</span>
                <span className="text-sm text-secondary-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Video Generated!</CardTitle>
            <CardDescription>Your image-to-video conversion is complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                icon={<Download size={18} />}
                onClick={() => window.open(result, '_blank')}
              >
                Download Video
              </Button>
              <Button variant="outline" onClick={() => setResult(null)}>
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};