/**
 * Error Boundary Component
 * Catches and displays errors gracefully
 */

'use client';

import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="max-w-md w-full p-8 bg-white rounded-lg border border-error-200 shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-100 mb-4 mx-auto">
                <AlertCircle size={24} className="text-error-600" />
              </div>

              <h1 className="text-2xl font-bold text-center text-secondary-900 mb-2">
                Oops! Something went wrong
              </h1>

              <p className="text-secondary-600 text-center mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>

              <div className="flex gap-2">
                <Button onClick={this.resetError} className="flex-1">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/en'}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-secondary-100 rounded-lg overflow-auto max-h-32">
                  <code className="text-xs text-secondary-700">
                    {this.state.error?.stack}
                  </code>
                </div>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
