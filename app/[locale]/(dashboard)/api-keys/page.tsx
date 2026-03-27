/**
 * API Keys Page
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageShell } from '@/components/common/PageShell';
import { Copy, Eye, EyeOff, Trash2, Plus, AlertCircle } from 'lucide-react';
import { DashboardService } from '@/lib/api/dashboard-service';
import type { ApiKey } from '@/types';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const keys = await DashboardService.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);
      const newKey = await DashboardService.createApiKey({
        name: newKeyName.trim(),
        permissions: ['read', 'write'],
      });
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName('');
    } catch (error) {
      console.error('Failed to create API key:', error);
      setError('Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      await DashboardService.deleteApiKey(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Failed to delete API key:', error);
      setError('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <PageShell title="API Keys" subtitle="Manage your API credentials" action={<span className="text-sm text-secondary-500">Secure. Rotate. Revoke.</span>}>
      <div className="space-y-6">

      {/* Error Message */}
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

      {/* Create New Key */}
      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>Generate a new API key for your applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter key name (e.g., Production API Key)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCreateKey}
              disabled={!newKeyName.trim() || isCreating}
              icon={isCreating ? undefined : <Plus size={18} />}
            >
              {isCreating ? 'Creating...' : 'Create Key'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-secondary-600">
            Use your API keys to access VenkatAI from your application. Keep them secret!
          </p>
          <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <p className="text-xs font-medium text-warning-900">
              ⚠️ Never commit API keys to version control or expose them in client-side code.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>{apiKeys.length} key(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg border border-secondary-200">
                  <div className="animate-pulse">
                    <div className="h-4 bg-secondary-200 rounded w-1/4 mb-2"></div>
                    <div className="h-8 bg-secondary-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              <p>No API keys found. Create your first key above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-4 rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key Info */}
                    <div>
                      <p className="font-medium text-secondary-900">{apiKey.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center px-3 py-1.5 bg-secondary-100 rounded font-mono text-xs text-secondary-700 w-full">
                          {showSecret[apiKey.id]
                            ? apiKey.key
                            : apiKey.key.substring(0, 10) + '•••••••••••'}
                        </div>
                        <button
                          onClick={() =>
                            setShowSecret({
                              ...showSecret,
                              [apiKey.id]: !showSecret[apiKey.id],
                            })
                          }
                          className="p-2 hover:bg-secondary-100 rounded transition-colors"
                        >
                          {showSecret[apiKey.id] ? (
                            <EyeOff size={16} className="text-secondary-600" />
                          ) : (
                            <Eye size={16} className="text-secondary-600" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-2 hover:bg-secondary-100 rounded transition-colors"
                        >
                          <Copy size={16} className="text-secondary-600" />
                        </button>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.status === 'active' ? 'success' : 'secondary'}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-secondary-600 space-y-1">
                        <p>Last used: {apiKey.lastUsedAt ? new Date(apiKey.lastUsedAt).toLocaleString() : 'Never'}</p>
                        <p>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" fullWidth>
                          Regenerate
                        </Button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </PageShell>
  );
}
