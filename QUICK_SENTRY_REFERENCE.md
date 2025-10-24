# Quick Sentry Reference Card

Quick copy-paste examples for common Sentry operations.

## 🚀 Start App & Open Sentry

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run workers:dev

# Browser - Open both:
# App: http://localhost:3000
# Sentry: https://sentry.io (Issues tab)
# Console: F12 → Console tab
```

---

## 📝 Copy-Paste Examples

### 1️⃣ Throw Simple Error (Fastest)
```javascript
throw new Error("Something went wrong!")
```
✅ Check Sentry dashboard after 5 seconds

---

### 2️⃣ Send Message to Sentry
```javascript
Sentry.captureMessage("This is a test message", "info")
```
✅ Message appears in Sentry as "info" level

---

### 3️⃣ Throw Error with User Info
```javascript
Sentry.setUser({
  id: "user123",
  email: "test@example.com",
  username: "testuser"
})

throw new Error("Error with user context")
```
✅ Error shows who the user was

---

### 4️⃣ Error with Tags
```javascript
try {
  throw new Error("API failed")
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      component: "TodoList",
      action: "create",
      severity: "high"
    }
  })
}
```
✅ Tags help you search/filter errors

---

### 5️⃣ Track User Actions (Breadcrumbs)
```javascript
// Record what user did
Sentry.addBreadcrumb({
  message: "User clicked button",
  category: "ui.click",
  level: "info"
})

Sentry.addBreadcrumb({
  message: "Entered text: Hello",
  category: "user-input",
  level: "info"
})

// Then if error happens, shows breadcrumbs
throw new Error("Action failed")
```
✅ Breadcrumbs show sequence of events

---

### 6️⃣ Complete Error Flow
```javascript
// 1. Set user
Sentry.setUser({ id: "user1", username: "john" })

// 2. Track action
Sentry.addBreadcrumb({ message: "Clicked add", level: "info" })

// 3. Throw error
throw new Error("Add failed")
```

---

### 7️⃣ Different Error Levels
```javascript
// Info - just information
Sentry.captureMessage("App started", "info")

// Warning - something might be wrong
Sentry.captureMessage("Low memory", "warning")

// Error - something went wrong
Sentry.captureMessage("Failed to save", "error")

// Fatal - critical problem
Sentry.captureMessage("System crash", "fatal")
```

---

### 8️⃣ Network Error (Stop API then try adding todo)
```bash
# Stop Workers (Ctrl+C in Terminal 2)

# In app: Type "Test" and click Add
# Error auto-captured!

# Start Workers again
npm run workers:dev
```

---

## 🎯 Quick Commands

| Command | What It Does |
|---------|-------------|
| `throw new Error("msg")` | Throw error |
| `Sentry.captureException(err)` | Send error to Sentry |
| `Sentry.captureMessage("msg", "info")` | Send message |
| `Sentry.setUser({...})` | Set who the user is |
| `Sentry.setUser(null)` | Clear user info |
| `Sentry.addBreadcrumb({...})` | Track action |
| `Sentry.getClient()` | Get Sentry client |
| `Sentry.lastEventId()` | Last error ID |

---

## 📊 Viewing in Sentry Dashboard

```
1. Go to: https://sentry.io
2. Project: sentry-cloudflare
3. Tab: Issues
4. Click any error to see details
```

**Error details show:**
- User who had it
- What they did (breadcrumbs)
- Where it failed (stack trace)
- When it happened
- Browser/device info

---

## ✅ Test Checklist

Try each example in browser console (F12):

- [ ] `throw new Error("test")` - See error in Sentry
- [ ] `Sentry.captureMessage("test", "info")` - See message
- [ ] Set user, then error - See user in error
- [ ] Add breadcrumb, then error - See breadcrumbs
- [ ] Stop API, add todo - See network error
- [ ] Use tags - See tags in error

---

## 🚨 If Errors Don't Appear

**Checklist:**
1. Is Sentry initialized?
   - Check console for: `[Sentry] Initialized...`

2. Did you wait 5 seconds?
   - Sentry batches and sends errors

3. Refresh Sentry dashboard
   - Go to https://sentry.io
   - Press F5

4. Check network tab
   - DevTools → Network
   - Look for: `ingest.us.sentry.io`

5. Is DSN set?
   - Check: `cat .env.local | grep SENTRY_DSN`

---

## 📱 Error Types You'll See

### Network Error
```
Stop Workers (Ctrl+C)
Try to add todo
→ "Failed to create todo"
```

### Manual Error
```
throw new Error("test")
→ "test" appears in Sentry
```

### Message
```
Sentry.captureMessage("info", "info")
→ Message appears in Sentry
```

### User Context
```
Sentry.setUser({...})
throw new Error("test")
→ Error shows user info
```

### Breadcrumbs
```
Sentry.addBreadcrumb(...)
throw new Error("test")
→ Error shows breadcrumbs
```

---

## 🎬 Step-by-Step Example

**Follow these exact steps:**

1. Open two terminals
   ```bash
   # Terminal 1
   npm run dev

   # Terminal 2
   npm run workers:dev
   ```

2. Open browser
   - http://localhost:3000 (your app)
   - https://sentry.io (Sentry dashboard, Issues tab)

3. Open app console
   - F12 → Console tab

4. Paste and run this:
   ```javascript
   Sentry.setUser({ id: "test-user", username: "tester" })
   Sentry.addBreadcrumb({ message: "Starting test", level: "info" })
   throw new Error("This is my first test error!")
   ```

5. Look at Sentry dashboard
   - Refresh page (F5)
   - You should see your error!
   - Click it to see all details

---

## 💡 Pro Tips

1. **Errors appear in 5 seconds** - Wait before refreshing
2. **Network tab shows requests** - DevTools → Network → search "sentry"
3. **Console shows init message** - Tells you Sentry is ready
4. **Breadcrumbs = detective work** - Shows what user did before error
5. **Tags = organization** - Use tags to filter errors

---

## 🔗 Useful Links

- **Dashboard**: https://sentry.io
- **Docs**: https://docs.sentry.io/
- **Settings**: https://sentry.io/settings/
- **Your Project**: https://sentry.io/organizations/your-org/issues/

---

**Questions?** Read `SENTRY_ERROR_EXAMPLES.md` for detailed examples!