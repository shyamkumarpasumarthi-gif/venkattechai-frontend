/**
 * Face Swap Tool Component
 * AI-powered face replacement in videos
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/studio/FileUploader';
import { Badge } from '@/components/ui/Badge';
import { Upload, Play, Download, AlertCircle } from 'lucide-react';
import { StudioService } from '@/lib/api/studio-service';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import { getErrorMessage } from '@/lib/utils';
import type { StudioTool } from '@/types';

interface FaceSwapToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const FaceSwapTool: React.FC<FaceSwapToolProps> = ({ tool, onBack }) => {
  const [sourceVideo, setSourceVideo] = useState<File | null>(null);
  const [targetFace, setTargetFace] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { balance } = useWalletStore();
  const { addJob } = useStudioStore();

  const canProcess = sourceVideo && targetFace && balance && balance.credits >= tool.creditsPerUse;

  const handleProcess = async () => {
    if (!canProcess) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    // Build temporary local URLs for demo (replace with real upload service if available)
    const sourceVideoUrl = sourceVideo ? URL.createObjectURL(sourceVideo) : '';
    const targetFaceImageUrl = targetFace ? URL.createObjectURL(targetFace) : '';

    try {
      const response = await StudioService.faceSwap({
        sourceImageUrl: targetFaceImageUrl,
        targetVideoUrl: sourceVideoUrl,
        speed: 'balanced',
        quality: 'high',
      });

      if (!response.success) {
        throw new Error(response.message || 'Face swap returned error');
      }

      // Simulate progress updates until backend result resolves
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(100, prev + Math.random() * 20);
          if (next >= 100) {
            clearInterval(interval);
            setResult(response.outputUrl);
            setIsProcessing(false);
          }
          return next;
        });
      }, 600);

      addJob({
        id: response.jobId ?? `face-swap-${Date.now()}`,
        userId: 'current-user',
        toolType: 'face_swap',
        status: 'processing',
        input: {
          sourceVideo: sourceVideo!.name,
          targetFace: targetFace!.name,
        },
        progress: 0,
        creditsCost: tool.creditsPerUse,
        createdAt: new Date(),
        startedAt: new Date(),
        metadata: {},
      });
    } catch (err) {
      setError(getErrorMessage(err));
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

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Video */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Source Video</CardTitle>
            <CardDescription>Upload the video where you want to swap the face</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFilesSelected={(files) => setSourceVideo(files[0] || null)}
              accept={{ 'video/*': ['.mp4', '.mov', '.avi'] }}
              multiple={false}
              maxSize={500 * 1024 * 1024} // 500MB
            />
            {sourceVideo && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Upload size={16} />
                  <span className="text-sm font-medium">{sourceVideo.name}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Target Face */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Face</CardTitle>
            <CardDescription>Upload a clear photo of the face to swap in</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFilesSelected={(files) => setTargetFace(files[0] || null)}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
            />
            {targetFace && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <Upload size={16} />
                  <span className="text-sm font-medium">{targetFace.name}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Processing Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Settings</CardTitle>
          <CardDescription>Configure how the face swap should be processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Face Detection Sensitivity
              </label>
              <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Conservative</option>
                <option selected>Balanced</option>
                <option>Aggressive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="keep-audio" defaultChecked className="w-4 h-4 rounded" />
            <label htmlFor="keep-audio" className="text-sm text-secondary-700">
              Keep original audio
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
              {isProcessing ? 'Processing...' : 'Start Face Swap'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Processing...</span>
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
            <CardTitle className="text-lg text-green-700">Processing Complete!</CardTitle>
            <CardDescription>Your face-swapped video is ready</CardDescription>
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
                Process Another
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