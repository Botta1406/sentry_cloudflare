# Sentry Error Tracking Testing Guide

Now that Sentry is properly configured, follow this guide to test and verify error tracking is working.

## 🚀 Quick Start

### 1. Start the Application

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start API
npm run workers:dev
```

Open http://localhost:3000 in your browser.

### 2. Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. You should see:
   ```
   [Sentry] Initialized with DSN: https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
   [Sentry] Client-side initialization ready
   ```

## 🧪 Test Cases

### Test 1: Initialization Message
**Expected**: Sentry sends an initialization message to Sentry dashboard

1. App loads at http://localhost:3000
2. Go to your Sentry dashboard
3. Check **Issues** tab
4. You should see: "Todo app initialized" (info level)

### Test 2: API Error (Network Failure)

**Simulate**: Stop the Workers API and try to add a todo

```bash
# Stop wrangler dev in terminal 2 (Ctrl+C)
npm run workers:dev # Stop this
```

Then in the app:
1. Try to add a new todo
2. You'll get an error: "Failed to create todo"
3. Check Sentry dashboard → **Issues**
4. Look for error from `/api/todos`

### Test 3: Manual Error Trigger

**Simulate**: Throw an error manually

1. Open browser console (F12)
2. Paste and run:
   ```javascript
   Sentry.captureException(new Error("Test error from console"))
   ```
3. Check Sentry dashboard → **Issues**
4. You should see "Test error from console" appear

### Test 4: API Operations

**Simulate**: Normal operations that get tracked

1. **Add a todo**:
   - Type: "Test Todo"
   - Click "Add"
   - Should sync with API

2. **Toggle todo**:
   - Click checkbox to mark complete
   - Should update successfully

3. **Delete todo**:
   - Click "Delete"
   - Should remove from list

All operations are tracked in Sentry (if errors occur).

## 📊 Viewing Errors in Sentry

### Go to Sentry Dashboard

1. Visit: https://sentry.io
2. Select your project: "sentry-cloudflare"
3. Click **Issues** tab
4. You should see:
   - Initialization messages
   - Any API errors
   - Any exceptions thrown

### Error Details

Click on any error to see:
- **Stack Trace**: Where the error occurred
- **Breadcrumbs**: Events leading to the error
- **User Context**: Who experienced the error
- **Device/Browser**: What environment it happened in
- **Release**: Which version of code

## 🔍 Common Issues & Solutions

### Sentry Console Warnings

If you see console warnings about Sentry not being initialized:

1. **Problem**: DSN not set
   - **Solution**: Check `.env.local` has valid `NEXT_PUBLIC_SENTRY_DSN`
   - **Solution**: Restart `npm run dev`

2. **Problem**: Network errors from browser
   - **Solution**: This is normal in development
   - **Solution**: Check network tab for Sentry API requests

### Errors Not Appearing

**Checklist**:
- [ ] Sentry console message shows initialization
- [ ] DSN is correct in `.env.local`
- [ ] App reloaded after env changes
- [ ] Check Sentry project settings allow your domain
- [ ] No adblockers blocking Sentry requests

### Test with Console

Check Sentry is working:

```javascript
// In browser console
console.log(window.__SENTRY__)  // Should show Sentry object
Sentry.captureMessage("Test", "info")  // Should appear in Sentry
```

## 🔧 Configuration Files

### Files Updated for Sentry:

- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `instrumentation.ts` - Next.js instrumentation hook
- `app/sentry-init.tsx` - Client initialization component
- `app/layout.tsx` - Includes SentryInit component
- `components/TodoList.tsx` - Sets user context & captures errors
- `lib/api-client.ts` - Captures API errors
- `next.config.js` - Enables instrumentationHook

## 📈 What Gets Tracked

### Automatically Captured:
- ✅ Unhandled errors and exceptions
- ✅ API request failures
- ✅ Component render errors
- ✅ Console errors
- ✅ Network errors
- ✅ Performance metrics
- ✅ User sessions

### Manually Captured (in code):
- ✅ `Sentry.captureException()` - Exceptions
- ✅ `Sentry.captureMessage()` - Messages
- ✅ `Sentry.setUser()` - User context
- ✅ `Sentry.addBreadcrumb()` - User actions

## 🎯 Next Steps

### For Development:
1. Continue building features
2. Errors automatically tracked
3. Monitor in Sentry dashboard
4. Fix issues as they appear

### For Production:
1. Set up alerts in Sentry (email, Slack)
2. Configure error notifications
3. Set up release tracking
4. Monitor performance metrics

### For Team:
1. Share Sentry project with team
2. Set notification rules
3. Create alerts for critical errors
4. Regular review of error trends

## 📚 Sentry Commands

Test Sentry integration manually:

```javascript
// Capture an exception
Sentry.captureException(new Error("Test error"));

// Capture a message
Sentry.captureMessage("Test message", "info");

// Set user context
Sentry.setUser({
  id: "user123",
  email: "user@example.com",
  username: "johndoe"
});

// Clear user context
Sentry.setUser(null);

// Add breadcrumb (user action)
Sentry.addBreadcrumb({
  message: "User clicked add button",
  level: "info"
});

// Get client
const client = Sentry.getClient();
console.log(client);
```

## 🆘 Troubleshooting

### Sentry not sending errors

1. **Check network tab**:
   - Open DevTools → Network
   - Filter: "sentry"
   - Should see POST requests to Sentry API

2. **Check DSN**:
   ```bash
   cat .env.local | grep SENTRY_DSN
   ```

3. **Restart dev server**:
   ```bash
   # Stop npm run dev
   # Stop npm run workers:dev
   npm run dev
   npm run workers:dev
   ```

4. **Check Sentry project**:
   - Go to https://sentry.io
   - Select project
   - Settings → Error Tracking
   - Verify it's enabled

### Wrong project receiving errors

1. Check DSN in `.env.local`
2. Verify DSN matches your Sentry project
3. Use correct Sentry project URL

### Duplicate errors

1. This is normal in development (hot reload sends multiple)
2. Check error grouping in Sentry
3. In production, errors should be grouped better

## ✅ Verification Checklist

After setup, verify:

- [ ] Sentry console message appears
- [ ] Errors captured when API fails
- [ ] Initialization message in Sentry
- [ ] Manual test error appears in Sentry
- [ ] Error details show stack trace
- [ ] Breadcrumbs show user actions
- [ ] User context is set
- [ ] No console errors about Sentry

Once all checked, Sentry is working! 🎉

---

**Questions?** Check `README.md` or `SECRETS_MANAGEMENT.md`