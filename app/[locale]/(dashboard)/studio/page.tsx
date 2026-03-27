/**
 * Studio Page
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { PageShell } from '@/components/common/PageShell';
import { StudioToolCard } from '@/components/studio/ToolCard';
import { FaceSwapTool } from '@/components/studio/tools/FaceSwapTool';
import { ImageToVideoTool } from '@/components/studio/tools/ImageToVideoTool';
import { TextToVideoTool } from '@/components/studio/tools/TextToVideoTool';
import { MotionGenerationTool } from '@/components/studio/tools/MotionGenerationTool';
import { BackgroundRemovalTool } from '@/components/studio/tools/BackgroundRemovalTool';
import { ImageUpscalingTool } from '@/components/studio/tools/ImageUpscalingTool';
import type { StudioTool } from '@/types';

const defaultTools: StudioTool[] = [
  {
    id: 'face_swap',
    name: 'Face Swap',
    description: 'Swap faces in videos with high precision',
    icon: '😊',
    creditsPerUse: 5,
    enabled: true,
    beta: false,
    category: 'video',
  },
  {
    id: 'image_to_video',
    name: 'Image to Video',
    description: 'Create videos from static images',
    icon: '🎬',
    creditsPerUse: 10,
    enabled: true,
    beta: false,
    category: 'video',
  },
  {
    id: 'text_to_video',
    name: 'Text to Video',
    description: 'Generate videos from text descriptions',
    icon: '📝',
    creditsPerUse: 15,
    enabled: true,
    beta: true,
    category: 'video',
  },
  {
    id: 'motion_generation',
    name: 'Motion Generation',
    description: 'Add realistic motion to static images',
    icon: '🏃',
    creditsPerUse: 3,
    enabled: true,
    beta: false,
    category: 'animation',
  },
  {
    id: 'background_removal',
    name: 'Background Removal',
    description: 'Remove or change image backgrounds',
    icon: '✂️',
    creditsPerUse: 2,
    enabled: true,
    beta: false,
    category: 'image',
  },
  {
    id: 'image_upscaling',
    name: 'Image Upscaling',
    description: 'Enhance image resolution and quality',
    icon: '🔍',
    creditsPerUse: 4,
    enabled: true,
    beta: false,
    category: 'image',
  },
];

export default function StudioPage() {
  const [selectedTool, setSelectedTool] = useState<StudioTool | null>(null);

  const renderToolComponent = (tool: StudioTool) => {
    switch (tool.id) {
      case 'face_swap':
        return <FaceSwapTool tool={tool} onBack={() => setSelectedTool(null)} />;
      case 'image_to_video':
        return <ImageToVideoTool tool={tool} onBack={() => setSelectedTool(null)} />;
      case 'text_to_video':
        return <TextToVideoTool tool={tool} onBack={() => setSelectedTool(null)} />;
      case 'motion_generation':
        return <MotionGenerationTool tool={tool} onBack={() => setSelectedTool(null)} />;
      case 'background_removal':
        return <BackgroundRemovalTool tool={tool} onBack={() => setSelectedTool(null)} />;
      case 'image_upscaling':
        return <ImageUpscalingTool tool={tool} onBack={() => setSelectedTool(null)} />;
      default:
        return (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-secondary-600">Tool not implemented yet</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <PageShell title="AI Studio" subtitle="Choose a tool and create amazing media" className="space-y-6">
      {/* Tools Grid or Tool Component */}
      {!selectedTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultTools.map((tool) => (
            <StudioToolCard
              key={tool.id}
              tool={tool}
              onSelect={() => setSelectedTool(tool)}
            />
          ))}
        </div>
      ) : (
        renderToolComponent(selectedTool)
      )}
    </PageShell>
  );
}
