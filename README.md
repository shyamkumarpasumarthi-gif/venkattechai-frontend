/**
 * Project README
 */

# VenkatAI Studio - Enterprise AI Media Generation SaaS

Welcome to VenkatAI Studio, an enterprise-grade artificial intelligence media generation platform built with cutting-edge technology.

## 🚀 Features

VenkatAI Studio offers powerful AI tools for media creators:

- **Face Swap**: High-precision face swapping in videos
- **Image to Video**: Convert static images into dynamic videos
- **Text to Video**: Generate videos from text descriptions
- **Motion Generation**: Add realistic motion to still images
- **Background Removal**: Remove or replace video backgrounds
- **Image Upscaling**: Enhance image quality up to 8x resolution

## 📋 System Requirements

- **Node.js**: >= 18.0.0
- **NPM**: >= 9.0.0
- **Browser**: Modern browser with ES2020 support
- **Backend**: FastAPI service at https://venkattech-api.azurewebsites.net

## 🛠️ Installation

### Quick Start

1. **Clone and install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Update `.env.local` with your settings**:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/bff
   BACKEND_API_URL=https://venkattech-api.azurewebsites.net
   NEXTAUTH_SECRET=your_secret_key
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📚 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Authenticated pages
│   ├── api/bff/            # BFF API routes (Backend-for-Frontend)
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── studio/           # Studio tool components
│   ├── common/           # Shared components  
│   └── ui/              # UI primitives
├── lib/                    # Utilities and helpers
│   ├── api/              # API client and stores
│   ├── auth/             # Authentication utilities
│   ├── security/         # Security utilities
│   ├── stripe/           # Stripe integration
│   ├── constants.ts      # Application constants
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── messages/            # i18n translations
├── docs/               # Documentation
└── config files         # tsconfig, tailwind, etc.
```

## 🔐 Security

VenkatAI Studio implements enterprise-grade security:

- **JWT Authentication**: 15-minute access tokens, 7-day refresh tokens
- **CSRF Protection**: Token validation on all state-changing requests
- **Rate Limiting**: 60 requests per minute per API key
- **Input Sanitization**: XSS prevention through DOMPurify
- **HTTPS Only**: Secure cookies in production
- **Audit Logging**: All critical actions logged
- **HTTP Security Headers**: XSS, clickjacking, and MIME-type protections

## 💰 Credit System

Users start with 50 free credits:

- **Starter Plan**: 100 credits - $9
- **Growth Plan**: 500 credits - $39
- **Pro Plan**: 1,500 credits - $99

### Tool Credit Costs:
- Face Swap: 5 credits
- Image to Video: 10 credits
- Text to Video: 15 credits
- Motion Generation: 3 credits
- Background Removal: 2 credits
- Image Upscaling: 4 credits

## 🔄 BFF (Backend-for-Frontend) API Layer

All requests go through a secure BFF layer:

```typescript
// Example: Login flow
POST /api/bff/auth/login
- Validates credentials
- Attaches JWT to httpOnly cookie
- Forwards to backend service

GET /api/bff/studio/jobs
- Validates request
- Injects auth token
- Sanitizes response
```

## 🌐 Internationalization

Supported languages:
- English (en)
- Deutsch (de)  
- ქართული (ka - Georgian)

Switch languages via URL: `/en/dashboard`, `/de/dashboard`, `/ka/dashboard`

## 📦 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **API Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: lucide-react
- **Payments**: Stripe
- **i18n**: next-intl

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t venkatai-frontend .
docker run -p 3000:3000 venkatai-frontend
```

## 📖 API Documentation

### Authentication
```typescript
// Login
POST /api/bff/auth/login
{
  email: string
  password: string
  rememberMe?: boolean
}

// Register
POST /api/bff/auth/register
{
  email: string
  password: string
  name: string
}

// Logout
POST /api/bff/auth/logout

// Refresh Token
POST /api/bff/auth/refresh
```

### Studio Tools
```typescript
// Face Swap
POST /api/bff/studio/face-swap
{
  sourceImageUrl: string
  targetVideoUrl: string
  speed: 'fast' | 'balanced' | 'high-quality'
  quality: 'standard' | 'high' | 'ultra'
}
```

## 🧪 Development

### Run Type Check
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Run Tests
```bash
npm run test
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_BASE_URL | BFF API base URL | http://localhost:3000/api/bff |
| BACKEND_API_URL | Backend service URL | https://venkattech-api.azurewebsites.net |
| JWT_EXPIRE | JWT expiration in seconds | 900 (15 min) |
| REFRESH_TOKEN_EXPIRE | Refresh token expiration | 604800 (7 days) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe public key | |
| STRIPE_SECRET_KEY | Stripe secret key | |
| SECURE_COOKIES | Use secure cookies | false (dev), true (prod) |

## 🐛 Troubleshooting

### CORS Issues
Ensure BACKEND_API_URL is correctly set and backend allows requests from your frontend domain.

### Auth Token Expired
Tokens automatically refresh using refresh tokens. If issues persist, clear cookies and log in again.

### Rate Limit Exceeded
Wait 1 minute before retrying. Check rate limits in constants.ts.

## 📞 Support

- **Documentation**: See `/docs` folder
- **API Reference**: `/docs/API_REFERENCE.md`
- **Deployment Guide**: `/docs/DEPLOYMENT.md`
- **Security Guide**: `/docs/SECURITY.md`

## 📄 License

Proprietary - All rights reserved to VenkatTech
