/**
 * Security Documentation
 */

# VenkatAI Studio - Security Guide

Enterprise-grade security implementation guide.

## Overview

VenkatAI Studio implements multiple layers of security to protect user data and prevent attacks:

- Authentication & Authorization
- Data Encryption
- API Security
- Input Validation
- Rate Limiting
- Audit Logging

## Authentication

### JWT Implementation

Access tokens valid for 15 minutes:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Refresh tokens valid for 7 days (secure, httpOnly cookies).

### Secure Cookie Settings

```typescript
response.cookies.set('auth-token', token, {
  httpOnly: true,        // Not accessible to JS
  secure: true,          // Only over HTTPS
  sameSite: 'lax',       // CSRF protection
  maxAge: 15 * 60,       // 15 minutes
  path: '/',
  domain: process.env.COOKIE_DOMAIN
});
```

### Password Requirements

Passwords must have:
- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character (!@#$%^&*)

## CSRF Protection

### Token Generation

```typescript
// Server generates token
const token = crypto.randomBytes(32).toString('hex');

// Sent to client in meta tag
<meta name="csrf-token" content="token_value" />
```

### Validation

```typescript
// Client includes in header
headers['X-CSRF-Token'] = csrfToken;

// Server validates all POST/PUT/DELETE
if (request.headers['x-csrf-token'] !== sessionToken) {
  throw new Error('CSRF validation failed');
}
```

## Input Sanitization

### XSS Prevention

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize all user input
const clean = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
  ALLOWED_ATTR: ['href']
});
```

### SQL Injection Prevention

Always use parameterized queries (backend handles):
```python
# Good - parameterized
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))

# Bad - concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"
```

## Rate Limiting

### Client-Side (Burst Protection)

```typescript
rateLimiter.isAllowed('user_action', {
  maxRequests: 60,
  windowMs: 60000  // 1 minute
});
```

### Server-Side (Global Protection)

```typescript
// 60 requests per minute per API key
// Implemented at BFF layer via middleware
```

### Login Brute-Force Protection

```typescript
// Max 5 failed attempts per 15 minutes
const attempts = getFailedAttempts(email);
if (attempts >= 5) {
  throw new Error('Too many login attempts. Try again in 15 minutes.');
}
```

## API Security

### Bearer Token Validation

```typescript
const token = request.headers.get('authorization');
// Verify token hasn't expired
const payload = await jwtManager.verifyToken(token);
if (!payload) {
  throw new UnauthorizedError();
}
```

### Secure Headers

```typescript
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

### CORS Configuration

```typescript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization']
});
```

## Encryption

### In Transit

- HTTPS/TLS 1.3 (enforced in production)
- All API communications encrypted
- Secure WebSocket (WSS) for real-time

### At Rest

- Database encryption enabled
- Sensitive fields hashed (passwords via bcrypt)
- API keys stored encrypted
- Files encrypted in cloud storage

## Audit Logging

### Events Logged

```typescript
auditLogger.logSecurityEvent('login_attempt', 'success', {
  userId: user.id,
  ipAddress: request.ip,
  userAgent: request.userAgent,
  timestamp: new Date()
});
```

**Logged Events**:
- Successful/failed login
- Permission changes
- API key generation
- Subscription changes
- Admin actions
- Security alerts

### Log Retention

- Production: 90 days minimum
- Accessible via admin dashboard
- Exportable for compliance

## Data Privacy

### GDPR Compliance

- Consent management
- Right to be forgotten (delete account)
- Data export functionality
- Privacy policy visibility

### Data Minimization

- Only collect necessary data
- Delete unused credentials
- Automatic cleanup after 90 days

## Third-Party Security

### Stripe Integration

- PCI DSS compliant
- Never store full credit card details
- Tokens handled securely
- Webhooks validated

### Azure Services

- Managed identities for auth
- Network security groups
- Private endpoints
- Encryption keys in Key Vault

## Security Incident Response

### Procedure

1. **Detect**: Monitor logs and alerts
2. **Respond**: Isolate affected systems
3. **Investigate**: Analyze logs and impact
4. **Remediate**: Fix vulnerabilities
5. **Notify**: Inform users if needed
6. **Review**: Update security measures

### Vulnerability Reporting

Email: `security@venkattech.com`
PGP Key available at: `https://venkattech.com/security.gpg`

## Security Updates

### Regular Patching

- Review Dependencies: `npm audit`
- Update packages: `npm update`
- Test before deployment
- Deploy to staging first

### Security Advisories

Subscribe to:
- npm Security Advisories
- GitHub Security Alerts
- Next.js Security Updates

## Testing Security

### Automated Tests

```bash
npm run test:security
npm run lint
npm run type-check
```

### Manual Testing

- SQL injection attempts
- XSS payloads
- CSRF token validation
- Rate limiting verification
- Auth boundary testing

### External Audits

- Quarterly penetration testing
- Annual security audit
- Compliance certifications
- Bug bounty program

## Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] CSRF tokens implemented
- [ ] Input validation active
- [ ] Rate limiting enforced
- [ ] XSS prevention enabled
- [ ] SQL injection protected
- [ ] Audit logging working
- [ ] API keys secured
- [ ] Passwords hashed
- [ ] Session management proper
- [ ] Error messages don't expose internals
- [ ] Security headers set
- [ ] CORS properly configured
- [ ] Dependencies updated
- [ ] No hardcoded secrets

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/going-to-production/security-headers
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html
