# Secrets Management Guide

This guide explains how to securely manage sensitive information in your project using Cloudflare's Secrets Store.

## 🔒 Security Overview

Your project uses **Cloudflare's Secrets Store** to keep sensitive tokens secure. This prevents accidentally committing secrets to Git.

### What's Secure ✅
- **SENTRY_DSN** - Stored in Cloudflare Secrets Store
- **Production tokens** - Never in Git repositories
- **API keys** - Encrypted in Cloudflare

### What's Safe to Commit 🟢
- `.env.example` - Example file without real secrets
- `.env.local` - Configuration comments only
- API URLs and public settings
- Code that references secrets

## 📁 File Structure

```
.env.local          - Public config ONLY (safe to commit)
.env.example        - Template showing what's needed
.dev.vars          - Local dev secrets (NOT committed)
.gitignore         - Includes .env, .dev.vars, etc.
```

## 🔐 Cloudflare Secrets Store

Your secrets are securely stored at:
https://dash.cloudflare.com/e24ce8671a293a9c09aef94ed18fc17b/secrets-store/de975b1c461847ba9d6abc6ddfabfa5a

### Current Secrets
```
✓ SENTRY_DSN    - Sentry project DSN
```

## 🚀 Using Secrets in Development

### Local Development (Wrangler)

Create `.dev.vars` file with your secrets:
```
SENTRY_DSN=https://your-sentry-dsn@...
```

Start local worker:
```bash
npm run workers:dev
```

Wrangler automatically loads `.dev.vars` (which is in `.gitignore`).

## 🔧 Managing Secrets with Wrangler CLI

### Add a New Secret
```bash
wrangler secret put SECRET_NAME
# Then paste the value when prompted
```

### List All Secrets
```bash
wrangler secret list
```

Output:
```
[
  {
    "name": "SENTRY_DSN",
    "type": "secret_text"
  }
]
```

### Delete a Secret
```bash
wrangler secret delete SECRET_NAME
```

### Rotate a Secret
```bash
# Delete old secret
wrangler secret delete SENTRY_DSN

# Add new secret
wrangler secret put SENTRY_DSN
```

## 📋 Accessing Secrets in Workers Code

In your Worker code (`workers/src/`), secrets are passed via the `Env` binding:

```typescript
// Example: Using secrets in Worker
export default {
  fetch(request: Request, env: Env) {
    const sentryDsn = env.SENTRY_DSN;
    // Use sentryDsn in your code
  }
}
```

## ✅ Setup Checklist

- [x] `SENTRY_DSN` added to Cloudflare Secrets Store
- [ ] `.dev.vars` created for local development
- [ ] `.env.local` updated to NOT contain secrets
- [ ] `.gitignore` configured to exclude secret files
- [ ] Team members notified of secret management process

## 🎯 Next Steps

### For Production (Cloudflare Pages)

1. Go to Pages project settings
2. Add environment variables in the dashboard
3. For secrets, use Cloudflare's integrated secrets management

### For Team Development

1. Share the `.env.example` file
2. Each developer creates their own `.dev.vars`
3. Never commit `.dev.vars` to Git
4. Production secrets managed centrally in Cloudflare dashboard

## ⚠️ Common Mistakes to Avoid

❌ **DON'T:**
```bash
# Adding secrets to .env.local
SENTRY_DSN=https://... # NO!

# Committing secrets to Git
git add .env.local # WRONG!

# Hardcoding secrets in code
const dsn = "https://..."; // BAD!
```

✅ **DO:**
```bash
# Use .dev.vars for local development
# Store secrets in Cloudflare Secrets Store
# Reference via environment variables
const dsn = env.SENTRY_DSN; // GOOD!
```

## 🔍 Verify No Secrets in Git

Check that no secrets were accidentally committed:

```bash
# Search for secret patterns
git log -p --all -S 'SENTRY_DSN' -- .env.local

# Or use gitignore checker
git check-ignore .env.local .dev.vars
```

## 📚 Additional Resources

- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

## 🆘 Troubleshooting

### Secret not available in local dev
- Ensure `.dev.vars` file exists
- Restart `wrangler dev`
- Check file is not in `.gitignore`

### Secret not available in production
- Verify secret was added: `wrangler secret list`
- Check Pages environment variables are set
- Redeploy worker after adding secret

### Accidentally committed a secret?
1. Rotate the secret immediately (create new one)
2. Delete the old secret
3. Force push (if private repo) or create new token
4. See: [GitHub Secret Rotation Guide](https://docs.github.com/en/code-security/secret-scanning-for-repositories-and-organizations)

## Questions?

Refer to the relevant documentation:
- Development: See `.env.example`
- Deployment: Check `DEPLOYMENT_STEPS.md`
- Security: Review this file

---

**Remember:** Secrets in Cloudflare = Safe, Secure, and Easy to Manage! 🔐