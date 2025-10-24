# Getting Started with Your Todo App

Welcome! This guide will help you get up and running in minutes.

## 📚 Documentation Map

Read these in order based on what you want to do:

### For Quick Development
1. **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup
2. **[README.md](./README.md)** - Full project documentation

### For Deployment
1. **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)** - Step-by-step instructions
2. **[deployment-guide.md](./deployment-guide.md)** - Detailed deployment guide

### For Understanding Architecture
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Architecture and structure

## 🚀 Quick Start (2 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start frontend (port 3000)
npm run dev

# In another terminal:
# 3. Start backend (port 8787)
npm run workers:dev

# 4. Open http://localhost:3000 in your browser
```

## 📁 Project Structure at a Glance

```
Frontend (Next.js)
├── app/                 # Pages and layouts
├── components/          # React components
├── lib/                 # Utilities and API client

Backend (Cloudflare Workers)
└── workers/src/         # API implementation

Config & Docs
├── Configuration files  # next.config.js, wrangler.toml, etc.
└── Documentation       # README.md, guides, etc.
```

## ✨ Features

- ✅ Create, edit, delete todos
- ✅ Mark todos as complete
- ✅ Automatic error tracking with Sentry
- ✅ Serverless backend with Cloudflare Workers
- ✅ Persistent storage with Cloudflare KV
- ✅ Modern UI with Tailwind CSS
- ✅ Fully typed with TypeScript

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start Next.js frontend
npm run workers:dev      # Start Workers backend

# Production
npm run build           # Build for production
npm run start           # Start production server
npm run workers:deploy  # Deploy workers to production

# Other
npm run lint            # Run linter
```

## 🌐 After Starting

Once you run `npm run dev`, you'll have:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8787/api/todos

Try these:
1. Add a new todo
2. Mark it complete
3. Delete it
4. Refresh the page (data persists locally)

## 📊 Sentry Monitoring

Your app is connected to Sentry with:

**DSN**: `https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800`

To see errors:
1. Open http://localhost:3000
2. Open browser console (F12)
3. Type: `throw new Error("test")`
4. Check Sentry dashboard at https://sentry.io

## 🚢 Deploying Your App

When ready to deploy:

1. **Read**: [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)
2. **Deploy Backend**: Cloudflare Workers
3. **Deploy Frontend**: Cloudflare Pages
4. **Monitor**: Sentry dashboard

Takes about 30 minutes to fully deploy!

## 🆘 Common Issues

### "Cannot connect to API"
- Make sure `npm run workers:dev` is running
- Check network tab in browser DevTools
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### "Build fails"
- Run `npm install` again
- Delete `.next` folder: `rm -rf .next`
- Try building: `npm run build`

### "Data not saving"
- For development, uses memory (clears on restart)
- For production, uses Cloudflare KV (persists)

### "Sentry not working"
- Check browser console for errors
- Verify DSN in `.env.local`
- Sentry project must exist

See README.md for more troubleshooting.

## 📖 Recommended Reading Order

1. This file (you are here!)
2. [QUICKSTART.md](./QUICKSTART.md) - Get it running
3. [README.md](./README.md) - Understand the project
4. [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Deep dive
5. [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) - When ready to ship

## 💡 Tips

- Use VS Code for best experience
- TypeScript gives you great autocomplete
- Check browser DevTools for network requests
- Sentry automatically catches errors
- Workers KV is free for small projects

## 🎯 Next Steps

1. **Now**: `npm run dev` and play with the app
2. **Next**: Read [QUICKSTART.md](./QUICKSTART.md)
3. **Later**: Deploy following [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)

## 📞 Need Help?

1. Check the relevant documentation file
2. Look for "Troubleshooting" sections
3. Check official docs:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
   - [Sentry Docs](https://docs.sentry.io/)

## 🎉 You're All Set!

Your project is ready to go. Start developing:

```bash
npm run dev
```

Enjoy building! 🚀

---

**Questions?** Check the relevant documentation file in this directory.