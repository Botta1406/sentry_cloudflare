# Sentry + Cloudflare Todo Application

A simple todo application built with Next.js, connected to a Cloudflare Workers API backend, with integrated Sentry error tracking.

## Features

- ✅ Create, read, update, and delete todos
- 📊 Automatic error tracking with Sentry
- 🚀 Serverless backend with Cloudflare Workers
- 💾 Persistent storage with Cloudflare KV
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔄 Real-time updates

## Project Structure

```
sentry_cloudflare/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TodoList.tsx       # Main todo list component
│   ├── TodoInput.tsx      # Todo input form
│   └── TodoItem.tsx       # Individual todo item
├── lib/                   # Utilities and types
│   ├── api-client.ts      # API client with Sentry integration
│   └── types.ts           # TypeScript types
├── workers/               # Cloudflare Workers backend
│   └── src/
│       ├── api/
│       │   └── todos.ts   # Todo API implementation
│       ├── middleware/
│       │   ├── cors.ts    # CORS handler
│       │   └── error.ts   # Error handling
│       ├── types/
│       │   └── index.ts   # Worker types
│       └── index.ts       # Worker entry point
├── sentry.client.config.ts # Client-side Sentry config
├── sentry.server.config.ts # Server-side Sentry config
├── next.config.js         # Next.js configuration
├── wrangler.toml          # Cloudflare Workers config
└── package.json           # Dependencies
```

## Prerequisites

- Node.js 18+ and npm
- Cloudflare account
- Sentry account (free tier available)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Sentry

1. Create a Sentry project at https://sentry.io
2. Update `.env.local` with your Sentry DSN:

```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

The DSN provided: `https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800`

### 3. Configure Cloudflare Workers

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

3. Create a KV namespace for todos:
```bash
wrangler kv:namespace create "TODOS"
```

4. Update `wrangler.toml` with your KV namespace ID:
```toml
[[kv_namespaces]]
binding = "TODOS"
id = "your-kv-namespace-id"
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The Next.js app will be available at `http://localhost:3000`

In another terminal, start the Cloudflare Workers development server:

```bash
npm run workers:dev
```

The API will be available at `http://localhost:8787`

## Deployment

### Deploy to Cloudflare Pages (Next.js)

1. Connect your GitHub repository to Cloudflare Pages:
   - Go to https://dash.cloudflare.com/pages
   - Connect to your Git provider
   - Select your repository

2. Configure build settings:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

3. Add environment variables in Cloudflare Pages:
   - `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN
   - `NEXT_PUBLIC_API_URL`: Your Workers API URL

### Deploy Cloudflare Workers API

1. Deploy the worker:
```bash
npm run workers:deploy
```

2. Update `.env.local` (and Pages environment) with the Worker URL:
```
NEXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
```

### Environment Variables

Create a `wrangler.toml` configuration for production:

```toml
[env.production]
name = "sentry-cloudflare-workers-prod"
route = "api.yourdomain.com/api/*"

[[env.production.kv_namespaces]]
binding = "TODOS"
id = "production-kv-namespace-id"
```

Deploy to production:
```bash
wrangler deploy --env production
```

## API Endpoints

The Cloudflare Workers API provides the following endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
  ```json
  { "title": "My Todo" }
  ```
- `PUT /api/todos/:id` - Update a todo
  ```json
  { "title": "Updated Title", "completed": true }
  ```
- `DELETE /api/todos/:id` - Delete a todo

## Sentry Integration

The application is configured to automatically track:

- Client-side errors
- API request failures
- Component rendering errors
- Custom error messages with context

Errors are automatically reported to your Sentry project with:
- Stack traces
- User context
- Request information
- Breadcrumbs for debugging

## Local Development with Docker

You can also use Docker for consistent development:

```bash
docker build -t sentry-cloudflare .
docker run -p 3000:3000 -p 8787:8787 sentry-cloudflare
```

## Troubleshooting

### Workers API not responding

1. Make sure the development server is running: `npm run workers:dev`
2. Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`
3. Verify CORS is enabled in the worker middleware

### Sentry events not appearing

1. Check that your DSN is correct in `.env.local`
2. Ensure `NEXT_PUBLIC_SENTRY_DSN` is set (must be public)
3. Check browser console for any Sentry initialization errors

### KV Namespace errors

1. Verify the namespace ID in `wrangler.toml` matches your created namespace
2. For local development, use `preview_id` instead of `id`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT