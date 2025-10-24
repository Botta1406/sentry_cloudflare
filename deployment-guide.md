# Deployment Guide

This guide explains how to deploy the Sentry + Cloudflare Todo Application to production.

## Prerequisites

1. Cloudflare account (free tier works)
2. Sentry account
3. GitHub account (for GitHub integration)
4. Domain or use Cloudflare's subdomain

## Step 1: Prepare Your Repository

1. Initialize Git:
```bash
git init
git add .
git commit -m "Initial commit: Todo app with Sentry and Cloudflare Workers"
git remote add origin <your-github-url>
git branch -M main
git push -u origin main
```

2. Update `.env.local` with your Sentry DSN:
```
NEXT_PUBLIC_SENTRY_DSN=https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
NEXT_PUBLIC_API_URL=http://localhost:8787  # Update after workers deployment
SENTRY_AUTH_TOKEN=your_sentry_auth_token  # Optional for build-time source maps
```

## Step 2: Deploy Cloudflare Workers API

### Option A: Using Wrangler CLI (Recommended)

1. Ensure you have Wrangler installed:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

3. Create a KV namespace for production:
```bash
wrangler kv:namespace create "TODOS" --preview
```

This returns both a production ID and preview ID. Update `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "TODOS"
id = "your-production-id"
preview_id = "your-preview-id"
```

4. Deploy the worker:
```bash
wrangler deploy
```

After deployment, you'll get a URL like: `https://sentry-cloudflare-workers.your-username.workers.dev`

### Option B: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select "Workers" → "Create Application"
3. Use `Create from template` → `Hello World`
4. Copy the code from `workers/src/index.ts` and paste it
5. Save and deploy

Note the worker URL for the next step.

## Step 3: Deploy Next.js to Cloudflare Pages

### Setup via Dashboard

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create application"
3. Select "Connect to Git"
4. Authorize and select your GitHub repository
5. Click "Begin setup"

### Configure Build Settings

1. **Framework preset**: `Next.js`
2. **Build command**: `npm run build`
3. **Build output directory**: `.next`
4. **Node.js version**: `18` or higher

### Environment Variables

Add these environment variables in the Pages project settings:

```
NEXT_PUBLIC_SENTRY_DSN=https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
NEXT_PUBLIC_API_URL=https://your-worker-url.workers.dev
```

Replace `your-worker-url` with the actual URL from Step 2.

5. Click "Save and Deploy"

Your app will be deployed to `https://your-project.pages.dev`

## Step 4: Connect Frontend to Backend

After deploying the Workers:

1. Get your worker URL from the Wrangler deployment output
2. Update the `NEXT_PUBLIC_API_URL` environment variable in Cloudflare Pages settings
3. Trigger a redeploy in Pages

## Step 5: Configure Custom Domain (Optional)

### For Pages (Frontend)

1. In Cloudflare Pages settings, go to "Custom domains"
2. Add your custom domain or subdomain
3. Update DNS records if necessary

### For Workers (API)

1. In Workers settings, go to "Triggers"
2. Add a custom route like `api.yourdomain.com/*`
3. Configure DNS to point to Cloudflare

## Step 6: Monitor with Sentry

1. Go to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. Go to "Releases" and "Performance" to monitor your application
4. Set up alerts for critical errors

### Configure Alerts

In your Sentry project:
1. Settings → "Alerts"
2. Create a new "Alert Rule"
3. Set conditions (e.g., error rate > 5%)
4. Choose notification channel (Email, Slack, etc.)

## Step 7: Update Database

If using production KV namespace, data is automatically stored in Cloudflare KV.

To migrate existing data:
1. Export data from preview environment
2. Use Wrangler KV commands to import to production

```bash
# Get a key from preview
wrangler kv:key list --preview

# Put it in production
wrangler kv:key put --binding TODOS "key-name" "value"
```

## Continuous Deployment

The setup with GitHub integration automatically:
- Deploys to Pages on every push to `main`
- Creates preview deployments for pull requests
- Runs your build command to generate optimized output

No additional CI/CD configuration needed!

## Troubleshooting

### Pages deployment fails

1. Check build logs: Click on the failed deployment
2. Ensure Node.js version is set to 18+
3. Verify all dependencies are in `package.json`
4. Check that `.next` is listed as build output directory

### Workers API not accessible

1. Verify worker is deployed: `wrangler list`
2. Check worker logs: `wrangler tail`
3. Ensure CORS headers are correct
4. Test with `curl` or Postman

### Sentry not capturing events

1. Verify DSN is correct and public (`NEXT_PUBLIC_` prefix)
2. Check browser console for Sentry initialization errors
3. Ensure events aren't being filtered in Sentry project settings
4. Check that project is configured to accept events from your domain

### API URL issues

1. Ensure `NEXT_PUBLIC_API_URL` matches your deployed worker URL
2. Remove trailing slashes from URL
3. Check browser network tab for CORS errors
4. Verify worker is responding to requests

## Performance Tips

1. **Enable Cloudflare Caching**:
   - In Cloudflare dashboard → Caching → Cache Rules
   - Cache Pages HTML, CSS, JS files

2. **Enable Compression**:
   - Settings → Speed → Brotli compression → On

3. **Monitor Worker Performance**:
   - Analytics → Workers Analytics Engine
   - Set up dashboards for request rates

## Security Checklist

- [ ] Enable HTTPS (automatic with Cloudflare)
- [ ] Set up firewall rules for API
- [ ] Enable rate limiting for API endpoints
- [ ] Use environment variables for sensitive data
- [ ] Review and update Sentry data retention
- [ ] Enable 2FA on Cloudflare account
- [ ] Set up branch protection on GitHub

## Rollback

To rollback to a previous version:

### Pages
1. Deployments → Select previous deployment
2. Click three dots → "Rollback to this deployment"

### Workers
```bash
wrangler deploy --compatibility-date <previous-date>
```

Or redeploy previous commit:
```bash
git revert <commit-hash>
git push origin main
```

## Support

For issues:
- Cloudflare: https://support.cloudflare.com
- Sentry: https://sentry.io/support/
- Next.js: https://nextjs.org/docs