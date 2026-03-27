/**
 * Image Upscaling Tool Component
 * Enhance and upscale images with AI super-resolution
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/studio/FileUploader';
import { Badge } from '@/components/ui/Badge';
import { Upload, Download, AlertCircle, ZoomIn, Settings } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import type { StudioTool } from '@/types';

interface ImageUpscalingToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const ImageUpscalingTool: React.FC<ImageUpscalingToolProps> = ({ tool, onBack }) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [upscaleFactor, setUpscaleFactor] = useState('2');
  const [enhancementMode, setEnhancementMode] = useState('balanced');
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [sharpening, setSharpening] = useState(true);
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
      const jobId = `upscale-${Date.now()}`;
      const job = {
        id: jobId,
        userId: 'current-user', // Will be set from auth
        toolType: 'image_upscaling' as const,
        status: 'processing' as const,
        input: {
          sourceImage: sourceImage!.name,
          upscaleFactor: parseInt(upscaleFactor),
          enhancementMode,
          noiseReduction,
          sharpening,
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
              output: { imageUrl: `/api/results/${jobId}.png` },
            };
            updateJob(completedJob);
            setResult(`/api/results/${jobId}.png`);
            setIsProcessing(false);
            return 100;
          }
          // Update job progress
          updateJob({ ...job, progress: newProgress });
          return newProgress;
        });
      }, 700);

    } catch (err) {
      setError('Failed to upscale image. Please try again.');
      setIsProcessing(false);
    }
  };

  const upscaleFactors = [
    { value: '2', label: '2x (HD)', description: '1920x1080 from 960x540' },
    { value: '4', label: '4x (4K)', description: '3840x2160 from 960x540' },
    { value: '8', label: '8x (8K)', description: '7680x4320 from 960x540' },
  ];

  const enhancementModes = [
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Best quality-to-speed ratio',
      icon: '⚖️',
    },
    {
      id: 'quality',
      name: 'Maximum Quality',
      description: 'Highest quality, slower processing',
      icon: '⭐',
    },
    {
      id: 'fast',
      name: 'Fast',
      description: 'Quick results, good quality',
      icon: '⚡',
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
          <CardDescription>Upload an image to enhance and upscale</CardDescription>
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

      {/* Upscaling Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Enhancement Settings</CardTitle>
          <CardDescription>Configure how your image will be upscaled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upscale Factor */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Upscale Factor
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {upscaleFactors.map((factor) => (
                <div
                  key={factor.value}
                  onClick={() => setUpscaleFactor(factor.value)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    upscaleFactor === factor.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary-900">{factor.label}</div>
                    <div className="text-xs text-secondary-600 mt-1">{factor.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhancement Mode */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Enhancement Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {enhancementModes.map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setEnhancementMode(mode.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    enhancementMode === mode.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{mode.icon}</div>
                    <div className="font-medium text-secondary-900">{mode.name}</div>
                    <div className="text-xs text-secondary-600 mt-1">{mode.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900 flex items-center gap-2">
              <Settings size={16} />
              Advanced Options
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="noise-reduction"
                  checked={noiseReduction}
                  onChange={(e) => setNoiseReduction(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="noise-reduction" className="text-sm text-secondary-700">
                  AI noise reduction
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sharpening"
                  checked={sharpening}
                  onChange={(e) => setSharpening(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="sharpening" className="text-sm text-secondary-700">
                  Intelligent sharpening
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
              icon={isProcessing ? <ZoomIn size={18} className="animate-pulse" /> : <ZoomIn size={18} />}
              className="min-w-32"
            >
              {isProcessing ? 'Upscaling...' : 'Upscale Image'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Enhancing and upscaling your image...</span>
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
            <CardTitle className="text-lg text-green-700">Image Enhanced!</CardTitle>
            <CardDescription>Your upscaled image is ready</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quality Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-secondary-50">
                  <div className="text-center text-secondary-600">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="font-medium">Original</p>
                    <p className="text-xs mt-1">Low resolution</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <div className="text-center text-green-700">
                    <div className="text-4xl mb-2">✨</div>
                    <p className="font-medium">Enhanced</p>
                    <p className="text-xs mt-1">{upscaleFactor}x upscaled</p>
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="flex items-center gap-4">
                <Button
                  icon={<Download size={18} />}
                  onClick={() => window.open(result, '_blank')}
                >
                  Download Enhanced Image
                </Button>
                <Button variant="outline" onClick={() => setResult(null)}>
                  Enhance Another
                </Button>
              </div>
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