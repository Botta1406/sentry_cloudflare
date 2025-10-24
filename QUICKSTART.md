# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Your Sentry DSN is already configured:
```
NEXT_PUBLIC_SENTRY_DSN=https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Workers Backend (in another terminal)
```bash
npm run workers:dev
```

The API will be at [http://localhost:8787](http://localhost:8787)

## Testing the Application

1. **Add a Todo**: Type in the input field and click "Add"
2. **Toggle Todo**: Click the checkbox to mark as complete
3. **Delete Todo**: Click the "Delete" button
4. **Check Sentry**: Errors are automatically reported to Sentry

## Project Structure

```
├── app/                  # Next.js frontend
│   ├── page.tsx         # Main page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── TodoList.tsx     # Main component
│   ├── TodoInput.tsx    # Input form
│   └── TodoItem.tsx     # Todo item
├── lib/                 # Utilities
│   ├── api-client.ts    # API calls with Sentry
│   └── types.ts         # TypeScript types
└── workers/             # Cloudflare Workers API
    └── src/
        ├── api/todos.ts
        ├── middleware/
        └── index.ts
```

## Development Workflow

### Frontend Development
```bash
npm run dev
```

### Worker Development
```bash
npm run workers:dev
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## Deployment

### Deploy to Cloudflare Pages (Frontend)
1. Push to GitHub
2. Go to https://dash.cloudflare.com/pages
3. Connect your repository
4. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`
5. Add environment variables
6. Deploy!

### Deploy Workers (Backend)
```bash
npm run workers:deploy
```

See `deployment-guide.md` for detailed instructions.

## API Endpoints

All endpoints are under `/api/todos`:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Sentry Monitoring

Errors are automatically reported to:
https://sentry.io/organizations/your-org/issues/

### Features
- Error tracking
- Performance monitoring
- Session replay
- Source map deobfuscation

## Troubleshooting

### "Cannot connect to API"
- Make sure workers dev server is running: `npm run workers:dev`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### "Todos not persisting"
- For development, data is stored in memory
- Set up Cloudflare KV namespace for persistence (see README.md)

### "Sentry events not showing"
- Verify DSN is set in `.env.local`
- Check browser console for Sentry errors
- Trigger an error and watch for it in Sentry dashboard

## Next Steps

1. **Customize UI**: Edit components in `components/`
2. **Add Features**: Extend API in `workers/src/api/todos.ts`
3. **Deploy**: Follow `deployment-guide.md`
4. **Monitor**: Set up Sentry alerts and dashboards

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Sentry Docs](https://docs.sentry.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues:
1. Check the README.md for common problems
2. Review deployment-guide.md for deployment issues
3. Check respective documentation for tool-specific issues