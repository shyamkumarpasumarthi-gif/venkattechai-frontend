/**
 * Background Removal Tool Component
 * Remove backgrounds from images with AI precision
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/studio/FileUploader';
import { Badge } from '@/components/ui/Badge';
import { Upload, Download, AlertCircle, Scissors, Eye, EyeOff } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import type { StudioTool } from '@/types';

interface BackgroundRemovalToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const BackgroundRemovalTool: React.FC<BackgroundRemovalToolProps> = ({ tool, onBack }) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [removalMode, setRemovalMode] = useState('auto');
  const [edgeRefinement, setEdgeRefinement] = useState(true);
  const [shadowPreservation, setShadowPreservation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'original' | 'processed'>('original');
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
      const jobId = `bg-removal-${Date.now()}`;
      const job = {
        id: jobId,
        userId: 'current-user', // Will be set from auth
        toolType: 'background_removal' as const,
        status: 'processing' as const,
        input: {
          sourceImage: sourceImage!.name,
          removalMode,
          edgeRefinement,
          shadowPreservation,
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
          const newProgress = prev + Math.random() * 15;
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
      }, 600);

    } catch (err) {
      setError('Failed to remove background. Please try again.');
      setIsProcessing(false);
    }
  };

  const removalModes = [
    {
      id: 'auto',
      name: 'Auto Detection',
      description: 'AI automatically detects and removes background',
      icon: '🤖',
    },
    {
      id: 'precise',
      name: 'Precise Cutout',
      description: 'High-precision edge detection for complex subjects',
      icon: '✂️',
    },
    {
      id: 'transparent',
      name: 'Transparent',
      description: 'Create PNG with transparent background',
      icon: '👻',
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
          <CardDescription>Upload an image to remove its background</CardDescription>
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

      {/* Removal Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Background Removal Options</CardTitle>
          <CardDescription>Customize how the background is removed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Removal Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {removalModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setRemovalMode(mode.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  removalMode === mode.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{mode.icon}</div>
                  <h3 className="font-medium text-secondary-900">{mode.name}</h3>
                  <p className="text-xs text-secondary-600 mt-1">{mode.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-secondary-900">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edge-refinement"
                  checked={edgeRefinement}
                  onChange={(e) => setEdgeRefinement(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="edge-refinement" className="text-sm text-secondary-700">
                  Edge refinement for smoother edges
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="shadow-preservation"
                  checked={shadowPreservation}
                  onChange={(e) => setShadowPreservation(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="shadow-preservation" className="text-sm text-secondary-700">
                  Preserve natural shadows
                </label>
              </div>
            </div>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Output Format
            </label>
            <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="png">PNG (Transparent)</option>
              <option value="jpg">JPG (White Background)</option>
              <option value="webp">WebP (Transparent)</option>
            </select>
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
              icon={isProcessing ? <Scissors size={18} className="animate-pulse" /> : <Scissors size={18} />}
              className="min-w-32"
            >
              {isProcessing ? 'Removing...' : 'Remove Background'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Analyzing and removing background...</span>
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
            <CardTitle className="text-lg text-green-700">Background Removed!</CardTitle>
            <CardDescription>Your image is ready with transparent background</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Preview Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'original' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('original')}
                  icon={<Eye size={16} />}
                >
                  Original
                </Button>
                <Button
                  variant={previewMode === 'processed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('processed')}
                  icon={<EyeOff size={16} />}
                >
                  Processed
                </Button>
              </div>

              {/* Preview Image */}
              <div className="border rounded-lg p-4 bg-secondary-50">
                <div className="text-center text-secondary-600">
                  <div className="text-6xl mb-2">🖼️</div>
                  <p>Preview would show here</p>
                  <p className="text-xs mt-1">({previewMode} view)</p>
                </div>
              </div>

              {/* Download */}
              <div className="flex items-center gap-4">
                <Button
                  icon={<Download size={18} />}
                  onClick={() => window.open(result, '_blank')}
                >
                  Download Image
                </Button>
                <Button variant="outline" onClick={() => setResult(null)}>
                  Remove Another
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