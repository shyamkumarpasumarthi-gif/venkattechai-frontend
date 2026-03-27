/**
 * API Reference Documentation
 */

# VenkatAI Studio - API Reference

Complete API reference for VenkatAI Studio Backend-for-Frontend layer.

## Authentication API

### Login

```http
POST /api/bff/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "credits": 50,
    "createdAt": "2024-03-16T10:30:00Z"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_token_xxx",
  "expiresIn": 900
}
```

**Error (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password incorrect",
    "statusCode": 400
  }
}
```

### Register

```http
POST /api/bff/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "name": "Jane Doe",
  "acceptTerms": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "Jane Doe"
  }
}
```

### Logout

```http
POST /api/bff/auth/logout
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token

```http
POST /api/bff/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_xxx"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "accessToken": "new_access_token_xxx",
  "expiresIn": 900
}
```

## Studio API

### Face Swap

```http
POST /api/bff/studio/face-swap
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sourceImageUrl": "https://example.com/source.jpg",
  "targetVideoUrl": "https://example.com/target.mp4",
  "speed": "balanced",
  "quality": "high"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "toolType": "face_swap",
    "status": "processing",
    "progress": 0,
    "creditsCost": 5,
    "createdAt": "2024-03-16T10:35:00Z"
  }
}
```

### Image to Video

```http
POST /api/bff/studio/image-to-video
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "duration": 10,
  "speed": "balanced",
  "motionIntensity": 0.5
}
```

### Text to Video

```http
POST /api/bff/studio/text-to-video
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "text": "A beautiful sunset over the ocean",
  "voiceId": "female_en_1",
  "style": "cinematic",
  "duration": 30,
  "speed": "high-quality"
}
```

### Get Job Status

```http
GET /api/bff/studio/jobs/{jobId}
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "job": {
    "id": "job_123",
    "status": "completed",
    "progress": 100,
    "output": {
      "url": "https://storage.example.com/output.mp4",
      "thumbnailUrl": "https://storage.example.com/thumb.jpg",
      "duration": 10,
      "size": 2048576,
      "format": "mp4"
    }
  }
}
```

## Wallet API

### Get Wallet Balance

```http
GET /api/bff/wallet/balance
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "wallet": {
    "credits": 250,
    "tier": "growth",
    "monthlyCreditsLimit": 500,
    "monthlyCreditsUsed": 250,
    "resetDate": "2024-04-16T00:00:00Z"
  }
}
```

### Get Transactions

```http
GET /api/bff/wallet/transactions?page=1&pageSize=20
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "transactions": [
    {
      "id": "tx_123",
      "type": "purchase",
      "amount": -100,
      "balanceBefore": 350,
      "balanceAfter": 250,
      "description": "Growth Plan Purchase",
      "createdAt": "2024-03-16T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

## Stripe Integration

### Create Checkout Session

```http
POST /api/bff/stripe/checkout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "plan": "growth"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "sessionId": "cs_test_xxx",
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_xxx"
}
```

### Create Portal Session

```http
POST /api/bff/stripe/portal
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "url": "https://billing.stripe.com/session/cs_test_xxx"
}
```

## API Keys

### Generate API Key

```http
POST /api/bff/api-keys
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Production API Key",
  "permissions": ["create_jobs", "read_jobs"]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "apiKey": {
    "id": "key_123",
    "key": "pk_live_abc123xyz",
    "secret": "sk_live_secret_xxx",
    "name": "Production API Key"
  }
}
```

### List API Keys

```http
GET /api/bff/api-keys
Authorization: Bearer {accessToken}
```

### Revoke API Key

```http
DELETE /api/bff/api-keys/{keyId}
Authorization: Bearer {accessToken}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "statusCode": 400
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_INPUT | 400 | Validation error |
| UNAUTHORIZED | 401 | Missing or invalid auth |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

Rate limits: 60 requests per minute per API key

Headers included in response:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

When rate limited (429):
```
Retry-After: 60
```

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer {accessToken}
```

Access tokens last 15 minutes. Use refresh token to get new access token.

## Webhooks

Register webhooks via API to receive events:

```http
POST /api/bff/webhooks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "url": "https://yourapp.com/webhooks",
  "events": ["job.completed", "job.failed"]
}
```

**Webhook Events**:
- `job.created` - New job created
- `job.started` - Job processing started
- `job.completed` - Job completed successfully
- `job.failed` - Job failed
- `credits.purchased` - Credits purchased
- `subscription.changed` - Subscription changed
