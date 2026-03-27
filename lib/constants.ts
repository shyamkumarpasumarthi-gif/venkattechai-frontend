/**
 * Constants
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://venkattech-api.azurewebsites.net',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Auth Configuration
export const AUTH_CONFIG = {
  JWT_EXPIRE: parseInt(process.env.JWT_EXPIRE || '900'), // 15 minutes
  REFRESH_TOKEN_EXPIRE: parseInt(process.env.REFRESH_TOKEN_EXPIRE || '604800'), // 7 days
  TOKEN_STORAGE_KEY: 'auth_token',
  REFRESH_TOKEN_STORAGE_KEY: 'refresh_token',
  SECURE_COOKIES: process.env.SECURE_COOKIES === 'true',
};

// Rate Limiting
export const RATE_LIMIT = {
  MAX_REQUESTS: 60,
  WINDOW_MS: 60000, // 1 minute
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
};

// Credit System
export const CREDIT_SYSTEM = {
  INITIAL_CREDITS: 50,
  PLANS: {
    STARTER: {
      name: 'Starter',
      credits: 100,
      price: 9,
      currency: 'USD',
    },
    GROWTH: {
      name: 'Growth',
      credits: 500,
      price: 39,
      currency: 'USD',
    },
    PRO: {
      name: 'Pro',
      credits: 1500,
      price: 99,
      currency: 'USD',
    },
  },
};

// Studio Tool Credits
export const TOOL_CREDITS = {
  FACE_SWAP: 5,
  IMAGE_TO_VIDEO: 10,
  TEXT_TO_VIDEO: 15,
  MOTION_GENERATION: 3,
  BACKGROUND_REMOVAL: 2,
  IMAGE_UPSCALING: 4,
};

// UI
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  THROTTLE_DELAY: 1000,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
];

// Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  API_KEY_LENGTH: 32,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_INPUT: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  CSRF_FAILED: 'Security validation failed. Please refresh and try again.',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  STUDIO: '/studio',
  JOBS: '/jobs',
  WALLET: '/wallet',
  API_KEYS: '/api-keys',
  SETTINGS: '/settings',
  ADMIN: '/admin',
};

// Stripe
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  TEST_MODE: process.env.NODE_ENV !== 'production',
};

// Features
export const FEATURES = {
  TWO_FACTOR_AUTH: true,
  EMAIL_VERIFICATION: true,
  API_KEYS: true,
  WEBHOOKS: true,
  BATCH_JOBS: true,
  SCHEDULED_JOBS: false, // Coming soon
  TEAM_COLLABORATION: false, // Coming soon
};
