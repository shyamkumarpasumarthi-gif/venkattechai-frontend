/**
 * Deployment Documentation
 */

# VenkatAI Studio - Deployment Guide

Complete guide to deploying VenkatAI Studio to production.

## Prerequisites

- Vercel or Azure App Service account
- GitHub repository with code
- Environment variables configured
- Stripe account (for payment processing)
- Backend API deployed and working

## Vercel Deployment (Recommended)

### Step 1: Prepare Repository

1. Push your code to GitHub
2. Connect GitHub account to Vercel
3. Import the repository

### Step 2: Configure Build Settings

In Vercel dashboard:

**Framework Preset**: Next.js
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

### Step 3: Set Environment Variables

Go to **Settings** → **Environment Variables**:

```
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api/bff
BACKEND_API_URL=https://venkattech-api.azurewebsites.net
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=generate_a_random_string
JWT_SECRET=generate_a_random_string
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
SECURE_COOKIES=true
NODE_ENV=production
```

### Step 4: Deploy

Click **Deploy** button. Vercel will:
1. Install dependencies
2. Run build process
3. Deploy to CDN
4. Assign domain

### Step 5: Custom Domain

In **Domains** settings:
- Add your custom domain
- Configure DNS records
- Enable auto-renewal

## Azure App Service Deployment

### Step 1: Create App Service

```bash
az appservice plan create \
  --name venkatai-plan \
  --resource-group your-rg \
  --sku B2 \
  --is-linux

az webapp create \
  --resource-group your-rg \
  --plan venkatai-plan \
  --name venkatai-frontend \
  --runtime "node|18"
```

### Step 2: Configure Settings

```bash
az webapp config appsettings set \
  --resource-group your-rg \
  --name venkatai-frontend \
  --settings \
    NEXT_PUBLIC_API_BASE_URL=https://yourdomain.azurewebsites.net/api/bff \
    BACKEND_API_URL=https://venkattech-api.azurewebsites.net \
    NEXTAUTH_SECRET=your_secret \
    JWT_SECRET=your_secret \
    STRIPE_SECRET_KEY=sk_live_xxx
```

### Step 3: Deploy

```bash
npm run build
zip -r deploy.zip .next node_modules package.json

az webapp deployment source config-zip \
  --resource-group your-rg \
  --name venkatai-frontend \
  --src deploy.zip
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Push

```bash
docker build -t venkatai-frontend:latest .
docker tag venkatai-frontend:latest your-registry/venkatai-frontend:latest
docker push your-registry/venkatai-frontend:latest
```

## Environment Variable Management

### Development
Use `.env.local` locally

### Staging
- Set in Vercel/Azure settings for staging domain
- Enable branch deployments

### Production
- Use separate secure variables
- Rotate secrets regularly
- Enable audit logging

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] SSL certificate valid
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Disaster recovery plan

## Performance Optimization

### Build Optimization
```bash
npm run build
```

### Image Optimization
- Enable Next.js Image component
- Configure CDN caching
- Compress assets

### Monitoring
- Set up error tracking (Sentry)
- Configure analytics (Google/Vercel Analytics)
- Monitor API response times

## Rollback Procedure

### Vercel
1. Go to **Deployments**
2. Select previous deployment
3. Click **Promote to Production**

### Azure
```bash
az webapp deployment slot swap \
  --resource-group your-rg \
  --name venkatai-frontend \
  --slot staging
```

## Database Migrations

Connection strings for services:
- Azure SQL: `Server=tcp:yourdomain.database.windows.net,1433; ...`
- PostgreSQL: `postgresql://user:pass@host/db`

## Monitoring and Logging

### Vercel
- Built-in analytics
- Real-time logs available in dashboard
- Performance monitoring

### Azure
- Application Insights integration
- Log Analytics
- Custom metrics

## Scaling

### Horizontal Scaling
- Vercel: Automatic
- Azure: Configure auto-scale

### Caching
- CDN cache headers
- Browser cache invalidation
- Redis for session storage

## Maintenance

### Weekly
- Monitor error rates
- Check performance metrics
- Review security logs

### Monthly
- Update dependencies
- Security patches
- Database maintenance

### Quarterly
- Full backup restore test
- Disaster recovery drill
- Security audit

## Troubleshooting

### Build Fails
```bash
npm ci          # Clean install
npm run build   # Verbose build
npm run lint    # Check for errors
```

### High Memory Usage
- Reduce bundle size
- Enable compression
- Optimize images

### Slow Deployment
- Check build output
- Optimize install
- Enable caching

## Rollback from Faulty Deploy

### Vercel
1. Check Deployments page
2. Click previous deployment
3. Select "Promote to Production"

### Manual
1. Revert git commit
2. Push to GitHub
3. Redeploy

## Cost Optimization

- Use appropriate tier
- Monitor data transfer
- Optimize storage
- Review compute usage
- Schedule maintenance tasks during off-peak

## Disaster Recovery

### Backup Strategy
- Automated daily backups
- Test restores monthly
- Keep 30-day retention

### Recovery Procedure
1. Contact provider support
2. Request database restore to point-in-time
3. Redeploy application
4. Verify functionality
5. Document incident
