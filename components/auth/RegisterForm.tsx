/**
 * Register Form Component
 * Handles user registration
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { RegisterSchema, type RegisterInput } from '@/lib/auth/validation';
import { getErrorMessage } from '@/lib/utils';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setApiError('');

      const response = await fetch('/api/bff/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push('/en/login?registered=true');
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Start creating amazing with VenkatAI</CardDescription>
        </CardHeader>

        <CardContent>
          {apiError && (
            <div className="mb-4 p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={<User size={18} />}
              error={errors.name?.message}
              {...register('name')}
            />

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
              helper="Min 8 chars, uppercase, lowercase, number, special char"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="w-4 h-4 rounded mt-1 flex-shrink-0"
              />
              <span className="text-xs text-secondary-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-error-600">{errors.acceptTerms.message}</p>
            )}

            {/* Submit */}
            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          {/* Links */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/en/login" className="text-primary-600 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { RegisterForm };
