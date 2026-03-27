/**
 * Text to Video Tool Component
 * Generate videos from text descriptions
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Play, Download, AlertCircle, Sparkles } from 'lucide-react';
import { useStudioStore } from '@/lib/api/studio-store';
import { useWalletStore } from '@/lib/api/wallet-store';
import type { StudioTool } from '@/types';

interface TextToVideoToolProps {
  tool: StudioTool;
  onBack: () => void;
}

export const TextToVideoTool: React.FC<TextToVideoToolProps> = ({ tool, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [duration, setDuration] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { balance } = useWalletStore();
  const { addJob, updateJob } = useStudioStore();

  const canProcess = prompt.trim().length >= 10 && balance && balance.credits >= tool.creditsPerUse;

  const handleProcess = async () => {
    if (!canProcess) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Create job
      const jobId = `text-to-video-${Date.now()}`;
      const job = {
        id: jobId,
        userId: 'current-user', // Will be set from auth
        toolType: 'text_to_video' as const,
        status: 'processing' as const,
        input: {
          prompt,
          style,
          duration: parseInt(duration),
          aspectRatio,
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
          const newProgress = prev + Math.random() * 10;
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
      }, 1200);

    } catch (err) {
      setError('Failed to generate video. Please try again.');
      setIsProcessing(false);
    }
  };

  const examplePrompts = [
    "A serene mountain lake at sunset with gentle waves and colorful sky",
    "A futuristic cityscape with flying cars and neon lights at night",
    "A peaceful forest with sunlight filtering through autumn leaves",
    "A majestic eagle soaring over vast ocean waves",
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
              <Badge variant="warning" className="px-3 py-1">
                Beta
              </Badge>
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

      {/* Text Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Describe Your Video</CardTitle>
          <CardDescription>Write a detailed description of the video you want to create</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene, action, mood, and style you want in your video..."
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-32 resize-none"
              rows={6}
            />
            <div className="mt-2 text-xs text-secondary-500">
              {prompt.length}/500 characters (minimum 10)
            </div>
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-2">Example prompts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-2 text-xs bg-secondary-50 hover:bg-secondary-100 rounded border text-secondary-600 hover:text-secondary-800 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Video Settings</CardTitle>
          <CardDescription>Customize your video generation parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="realistic">Realistic</option>
                <option value="cinematic">Cinematic</option>
                <option value="animated">Animated</option>
                <option value="artistic">Artistic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Quality
              </label>
              <select className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Standard</option>
                <option selected>High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="add-audio" defaultChecked className="w-4 h-4 rounded" />
              <label htmlFor="add-audio" className="text-sm text-secondary-700">
                Generate background audio
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="enhance-details" className="w-4 h-4 rounded" />
              <label htmlFor="enhance-details" className="text-sm text-secondary-700">
                Enhance details
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              {!canProcess && prompt.trim().length < 10 && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle size={16} />
                  Please write a more detailed description (at least 10 characters).
                </span>
              )}
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
              icon={isProcessing ? <Sparkles size={18} className="animate-pulse" /> : <Play size={18} />}
              className="min-w-40"
            >
              {isProcessing ? 'Generating...' : 'Generate Video'}
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">AI is creating your video...</span>
                <span className="text-sm text-secondary-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-secondary-500 mt-2">
                This may take a few minutes. Please don&apos;t close this page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-700">Video Created!</CardTitle>
            <CardDescription>Your AI-generated video is ready</CardDescription>
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