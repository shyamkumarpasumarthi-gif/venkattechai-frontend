/**
 * Studio Tool Card Component
 * Displays AI tool with action buttons
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import type { StudioTool } from '@/types';

interface ToolCardProps {
  tool: StudioTool;
  onSelect: () => void;
  disabled?: boolean;
}

const StudioToolCard: React.FC<ToolCardProps> = ({ tool, onSelect, disabled }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow" hover>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            {tool.beta && <Badge variant="warning" className="mt-2">Beta</Badge>}
          </div>
          <div className="text-3xl">{tool.icon}</div>
        </div>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
          <span className="text-sm font-medium text-secondary-700">Credits Required:</span>
          <span className="text-lg font-bold text-primary-600">{tool.creditsPerUse}</span>
        </div>

        <Button
          onClick={onSelect}
          disabled={disabled || !tool.enabled}
          fullWidth
          icon={<ArrowRight size={18} />}
        >
          Use Tool
        </Button>
      </CardContent>
    </Card>
  );
};

export { StudioToolCard };
