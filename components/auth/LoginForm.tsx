/**
 * Login Form Component
 * Handles user authentication
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/api/auth-store';
import { type LoginInput } from '@/lib/auth/validation';
import { LoginSchema } from '@/lib/auth/validation';
import { getErrorMessage } from '@/lib/utils';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');
  const { setUser, setToken, setLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setApiError('');
      setLoading(true);

      const response = await fetch('/api/bff/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      setUser(result.user);
      setToken(result.accessToken);

      router.push('/en/dashboard');
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your VenkatAI account</CardDescription>
        </CardHeader>

        <CardContent>
          {apiError && (
            <div className="mb-4 p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 rounded" />
              <span className="text-sm text-secondary-600">Remember me</span>
            </label>

            {/* Submit */}
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          {/* Links */}
          <div className="mt-4 text-center text-sm text-secondary-600">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/en/register" className="text-primary-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
            <p className="mt-2">
              <Link href="/en/forgot-password" className="text-primary-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { LoginForm };
