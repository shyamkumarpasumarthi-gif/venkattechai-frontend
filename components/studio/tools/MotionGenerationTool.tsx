/**
 * Motion Generation Tool Component
 * Add realistic motion to static images
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/studio/FileUploader';
import { Badge } from '@/components/ui/Badge';
import { Upload, Play, Download, AlertCircle, Zap } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import type { StudioTool } from '@/types';

interface MotionGenerationToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const MotionGenerationTool: React.FC<MotionGenerationToolProps> = ({ tool, onBack }) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [motionType, setMotionType] = useState('subtle');
  const [duration, setDuration] = useState('3');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { balance } = useWalletStore();
  const { addJob, updateJob } = useStudioStore();

  const canProcess = sourceImage && balance && balance.credits >= tool.creditsPerUse;

  const handleProcess = async () => {
    if (!canProcess) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Create job
      const jobId = `motion-gen-${Date.now()}`;
      const job = {
        id: jobId,
        userId: 'current-user', // Will be set from auth
        toolType: 'motion_generation' as const,
        status: 'processing' as const,
        input: {
          sourceImage: sourceImage!.name,
          motionType,
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
          const newProgress = prev + Math.random() * 20;
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
      }, 800);

    } catch (err) {
      setError('Failed to generate motion. Please try again.');
      setIsProcessing(false);
    }
  };

  const motionTypes = [
    {
      id: 'subtle',
      name: 'Subtle Movement',
      description: 'Gentle breathing, slight shifts',
      icon: '🌬️',
    },
    {
      id: 'dynamic',
      name: 'Dynamic Motion',
      description: 'More pronounced movement and energy',
      icon: '💫',
    },
    {
      id: 'interactive',
      name: 'Interactive',
      description: 'Responds to viewer interaction',
      icon: '👆',
    },
  ];

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
          <CardDescription>Upload a static image to bring to life</CardDescription>
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
          <CardTitle>Motion Style</CardTitle>
          <CardDescription>Choose how you want your image to move</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Motion Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {motionTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setMotionType(type.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  motionType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-medium text-secondary-900">{type.name}</h3>
                  <p className="text-xs text-secondary-600 mt-1">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Animation Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="2">2 seconds</option>
              <option value="3">3 seconds (loop)</option>
              <option value="5">5 seconds (loop)</option>
              <option value="10">10 seconds (loop)</option>
            </select>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-secondary-900">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="smooth-loop" defaultChecked className="w-4 h-4 rounded" />
                <label htmlFor="smooth-loop" className="text-sm text-secondary-700">
                  Smooth loop transition
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="preserve-colors" defaultChecked className="w-4 h-4 rounded" />
                <label htmlFor="preserve-colors" className="text-sm text-secondary-700">
                  Preserve original colors
                </label>
              </div>
            </div>
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
              icon={isProcessing ? <Zap size={18} className="animate-pulse" /> : <Play size={18} />}
              className="min-w-32"
            >
              {isProcessing ? 'Animating...' : 'Add Motion'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bringing your image to life...</span>
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
            <CardTitle className="text-lg text-green-700">Motion Added!</CardTitle>
            <CardDescription>Your animated image is ready</CardDescription>
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
                Animate Another
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