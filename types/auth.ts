/**
 * Authentication Types
 * Defines all authentication-related interfaces and types
 */

export type UserRole = 'user' | 'admin' | 'moderator';

export type UserStatus = 'active' | 'suspended' | 'deleted' | 'pending';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  email?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface TwoFactorAuthSetupResponse {
  secret: string;
  qrCode: string;
}

export interface TwoFactorAuthVerifyRequest {
  code: string;
}

export interface AuthAuditLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'password_change' | 'email_change' | 'failed_login';
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  timestamp: Date;
  metadata?: Record<string, any>;
}
