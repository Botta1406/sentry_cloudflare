# Step-by-Step Deployment Instructions

## Part 1: Prepare Your Project

### Step 1: Initialize Git Repository

```bash
cd /home/infinix/WebstormProjects/sentry_cloudflare

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Todo app with Sentry and Cloudflare Workers"
```

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sentry-cloudflare.git
git branch -M main
git push -u origin main
```

## Part 2: Deploy Cloudflare Workers (Backend)

### Step 1: Install and Login with Wrangler

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Step 2: Create KV Namespace

```bash
# Create production KV namespace
wrangler kv:namespace create "TODOS"

# Create preview KV namespace (for testing)
wrangler kv:namespace create "TODOS" --preview
```

Output will show IDs like:
```
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "TODOS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
preview_id = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
```

### Step 3: Update wrangler.toml

Edit `wrangler.toml` and add the KV namespace bindings:

```toml
name = "sentry-cloudflare-workers"
main = "workers/src/index.ts"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "TODOS"
id = "your-production-id"
preview_id = "your-preview-id"
```

### Step 4: Deploy Worker

```bash
# Deploy to production
wrangler deploy

# You should see output like:
# ✓ Uploaded sentry-cloudflare-workers (1.23 kB)
# ✓ Published @ https://sentry-cloudflare-workers.YOUR-USERNAME.workers.dev
```

**Save your worker URL**: `https://sentry-cloudflare-workers.YOUR-USERNAME.workers.dev`

### Step 5: Test Worker Locally

```bash
# Start local dev server
npm run workers:dev

# Test with curl
curl http://localhost:8787/api/todos

# Should return: {"success":true,"data":[]}
```

## Part 3: Deploy to Cloudflare Pages (Frontend)

### Step 1: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Pages** from the sidebar
3. Click **Create a project** → **Connect to Git**
4. Authorize GitHub and select your repository
5. Click **Begin setup**

### Step 2: Configure Build Settings

Set the following:

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node.js version**: `18` (or higher)

### Step 3: Add Environment Variables

Click **Environment variables** and add:

```
NEXT_PUBLIC_SENTRY_DSN=https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
NEXT_PUBLIC_API_URL=https://sentry-cloudflare-workers.YOUR-USERNAME.workers.dev
```

Replace `YOUR-USERNAME` with your actual Cloudflare username.

### Step 4: Deploy

Click **Save and Deploy**

Cloudflare will:
1. Build your Next.js project
2. Deploy to the global Cloudflare network
3. Give you a URL like: `https://sentry-cloudflare.pages.dev`

## Part 4: Verify Deployment

### Test Frontend
1. Visit your Pages URL: `https://sentry-cloudflare.pages.dev`
2. Add a new todo
3. Refresh the page - todo should persist
4. Delete a todo

### Test Sentry Integration
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `throw new Error("Test error")`
4. Press Enter
5. Visit [Sentry Dashboard](https://sentry.io) - error should appear

### Test API Connection
1. In the app, try to add a todo
2. Check browser network tab
3. Request should go to your worker URL
4. Response should be 201 with the created todo

## Part 5: Connect Custom Domain (Optional)

### For Pages (Frontend)

1. In Cloudflare Pages settings
2. Go to **Custom domains**
3. Add your domain: `todo.yourdomain.com`
4. Follow DNS setup instructions

### For Workers (Backend)

1. In Workers settings
2. Go to **Triggers**
3. Add custom route: `api.yourdomain.com/api/*`
4. Point DNS to Cloudflare

## Part 6: Monitor with Sentry

### View Errors

1. Go to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. Go to **Issues** tab
4. You should see errors from your app

### Set Up Alerts

1. Settings → **Alerts**
2. Create a new alert rule
3. Set condition: Error rate > 5%
4. Choose notification channel (Email/Slack)
5. Click **Create alert**

### Configure Releases

1. Settings → **Releases**
2. Each deployment gets a unique release
3. Track which version errors occur in

## Part 7: Automatic Deployments

Your setup now has **automatic deployment**:

1. Push code to GitHub main branch
2. Cloudflare Pages automatically rebuilds
3. New version deployed in ~1 minute
4. Rollback available from deployment history

### To rollback:

1. Cloudflare Pages → Deployments
2. Select previous deployment
3. Click "Rollback to this deployment"

## Troubleshooting

### Pages build fails

**Check build logs:**
- Deployments → Failed deployment → View build log
- Look for missing dependencies or build errors
- Run `npm run build` locally to reproduce

**Common fixes:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Worker not accessible

**Verify deployment:**
```bash
wrangler list
```

**Check logs:**
```bash
wrangler tail
```

**Test endpoint:**
```bash
curl https://sentry-cloudflare-workers.YOUR-USERNAME.workers.dev/api/todos
```

### API returns 404

1. Verify worker is deployed
2. Check NEXT_PUBLIC_API_URL matches your worker URL
3. No trailing slashes in URL
4. Clear browser cache

### Data not persisting

KV data is associated with the namespace. Make sure:
1. Correct namespace ID in wrangler.toml
2. Same namespace used in all deployments
3. KV is accessible (check Cloudflare dashboard)

### Sentry not receiving events

1. Check DSN is correct
2. Verify NEXT_PUBLIC_SENTRY_DSN is set on Pages
3. Check browser console for Sentry errors
4. Project must accept events from your domain
5. Check Sentry project settings → Inbound Filters

## Production Checklist

- [ ] Worker deployed and tested
- [ ] Pages deployed with correct environment variables
- [ ] API URL updated on Pages
- [ ] Sentry receiving events
- [ ] Custom domain configured (optional)
- [ ] Alerts set up in Sentry
- [ ] Automatic deployments working
- [ ] Backups/rollback plan in place

## Useful Wrangler Commands

```bash
# List all deployments
wrangler deployments list

# View worker logs
wrangler tail

# Local development
npm run workers:dev

# Deploy specific environment
wrangler deploy --env production

# View KV data
wrangler kv:key list --binding TODOS

# Delete a key
wrangler kv:key delete "key-name" --binding TODOS
```

## URLs After Deployment

- **Frontend**: `https://sentry-cloudflare.pages.dev`
- **API**: `https://sentry-cloudflare-workers.YOUR-USERNAME.workers.dev`
- **Sentry**: `https://sentry.io/organizations/YOUR-ORG/issues/`
- **Cloudflare Dashboard**: `https://dash.cloudflare.com`

## Next Steps

1. Share your deployed app
2. Monitor performance in Sentry
3. Iterate on features
4. Scale to millions of todos with Cloudflare KV!

## Support

- Stuck? Check README.md for common issues
- Cloudflare Help: https://support.cloudflare.com
- Sentry Help: https://sentry.io/support/
- GitHub Issues: Create an issue in your repo