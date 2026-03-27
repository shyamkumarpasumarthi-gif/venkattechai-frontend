/**
 * Azure Setup Guide
 */

# VenkatAI Studio - Azure Setup Guide

Complete guide to deploying VenkatAI Studio on Microsoft Azure.

## Prerequisites

- Azure subscription (free trial available)
- Azure CLI installed
- GitHub account for repository
- Custom domain (optional)

## Create Resource Group

```bash
az group create \
  --name venkatai-rg \
  --location eastus
```

## Create App Service Plan

```bash
az appservice plan create \
  --name venkatai-plan \
  --resource-group venkatai-rg \
  --sku B2 \
  --is-linux
```

## Create App Service

```bash
az webapp create \
  --resource-group venkatai-rg \
  --plan venkatai-plan \
  --name venkatai-frontend \
  --runtime "NODE|18"
```

## Configure Application Settings

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --settings \
    NEXT_PUBLIC_API_BASE_URL=https://venkatai-frontend.azurewebsites.net/api/bff \
    BACKEND_API_URL=https://venkattech-api.azurewebsites.net \
    NEXTAUTH_URL=https://venkatai-frontend.azurewebsites.net \
    NEXTAUTH_SECRET=$(openssl rand -hex 16) \
    JWT_SECRET=$(openssl rand -hex 16) \
    STRIPE_SECRET_KEY=sk_live_xxx \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx \
    SECURE_COOKIES=true \
    NODE_ENV=production \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## Deploy from GitHub

### Setup GitHub Actions

1. Go to your Azure App Service
2. **Deployment** → **Deployment Center**
3. Select **GitHub** as source
4. Authorize and select repository
5. Configure build provider (GitHub Actions)
6. Azure creates workflow file

### Manual Workflow File

Create `.github/workflows/deploy-azure.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: venkatai-frontend
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./frontend
```

### Get Publish Profile

1. Go to App Service → Download publish profile
2. Add to GitHub Secrets as `AZURE_WEBAPP_PUBLISH_PROFILE`

## Configure Custom Domain

```bash
# Add custom domain
az webapp config hostname add \
  --resource-group venkatai-rg \
  --webapp-name venkatai-frontend \
  --hostname yourdomain.com

# Create/verify TXT record for verification
# Update DNS CNAME to point to Azure App Service
```

## Enable SSL/HTTPS

```bash
# Create managed certificate
az webapp config ssl create \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --certificate-name venkatai-cert
```

## Create Database Connection

### Azure SQL Database

```bash
# Create SQL Server
az sql server create \
  --resource-group venkatai-rg \
  --name venkatai-server \
  --admin-user dbadmin \
  --admin-password "SecurePass123!"

# Create database
az sql db create \
  --resource-group venkatai-rg \
  --server venkatai-server \
  --name venkatai_db \
  --service-objective S0
```

### Connection String

```
Server=tcp:venkatai-server.database.windows.net,1433;Initial Catalog=venkatai_db;Persist Security Info=False;User ID=dbadmin;Password=SecurePass123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Add Web App Managed Identity

```bash
# Enable managed identity
az webapp identity assign \
  --resource-group venkatai-rg \
  --name venkatai-frontend

# Grant permissions to SQL database
az sql server ad-admin create \
  --resource-group venkatai-rg \
  --server-name venkatai-server \
  --display-name "webapp" \
  --object-id <managed-identity-object-id>
```

## Setup Monitoring

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app venkatai-appinsights \
  --location eastus \
  --resource-group venkatai-rg \
  --application-type web

# Add to App Service
az webapp config appsettings set \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=<key>
```

### Configure Alerts

1. Go to App Service
2. **Monitoring** → **Alerts**
3. Create alert rule for:
   - HTTP 5xx errors
   - Response time > 2s
   - CPU > 80%
   - Memory > 80%

## Auto-scaling Configuration

```bash
# Create auto-scale rule
az monitor autoscale create \
  --resource-group venkatai-rg \
  --resource venkatai-frontend \
  --resource-type "Microsoft.Web/sites" \
  --name venkatai-autoscale \
  --min-count 2 \
  --max-count 10 \
  --count 2
```

## Backup Configuration

```bash
# Create backup schedule
az webapp config backup create \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --container-url "https://yourstorageaccount.blob.core.windows.net/backups" \
  --db-connection-string "..." \
  --db-type SqlAzure \
  --db-name venkatai_db \
  --schedule-frequency Hour
```

## Staging Slots

```bash
# Create staging slot
az webapp deployment slot create \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --slot staging

# Deploy to staging first
# Test thoroughly
# Swap to production
az webapp deployment slot swap \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --slot staging
```

## Logging

### Enable Diagnostics

```bash
# Enable logging
az webapp log config \
  --resource-group venkatai-rg \
  --name venkatai-frontend \
  --web-server-logging filesystem \
  --detailed-error-messages true \
  --failed-request-tracing true

# Stream logs
az webapp log tail \
  --resource-group venkatai-rg \
  --name venkatai-frontend
```

## Cost Optimization

### Resize App Service Plan

```bash
az appservice plan update \
  --name venkatai-plan \
  --resource-group venkatai-rg \
  --sku "FREE|SHARED|B1|B2|B3|S1|S2|S3|P1V2|P2V2|P3V2"
```

### Reserved Instances

- Save up to 35% with 1-year commitment
- Configure through Azure Portal
- Best for predictable workloads

## Troubleshooting

### App Won't Start

```bash
# Check logs
az webapp log tail \
  --resource-group venkatai-rg \
  --name venkatai-frontend

# Restart app
az webapp restart \
  --resource-group venkatai-rg \
  --name venkatai-frontend
```

### High Memory Usage

- Increase App Service plan tier
- Optimize Node.js settings
- Check for memory leaks

### Slow Performance

- Enable CDN for static assets
- Configure caching headers
- Use Application Insights to identify bottlenecks

## Security Best Practices

1. **Network Security**
   - Use Azure Virtual Network
   - Configure Network Security Groups
   - Enable Web Application Firewall

2. **Data Protection**
   - Enable Azure Disk Encryption
   - Use Key Vault for secrets
   - Configure backup encryption

3. **Access Control**
   - Use Azure AD for authentication
   - Implement RBAC
   - Enable MFA

4. **Monitoring**
   - Enable audit logging
   - Configure security alerts
   - Regular security reviews

## Support

- Azure Docs: https://docs.microsoft.com/azure/
- Azure Support: https://azure.microsoft.com/support/
- Community: https://stackoverflow.com/questions/tagged/azure
