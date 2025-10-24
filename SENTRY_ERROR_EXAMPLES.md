# Sentry Error Examples & How to See Them

This guide provides practical examples to trigger different types of errors and see them in your Sentry dashboard.

## 🚀 Setup (Before You Start)

### 1. Start Both Services

```bash
# Terminal 1: Start Next.js frontend
npm run dev
# Output: Ready at http://localhost:3000

# Terminal 2: Start Cloudflare Workers API
npm run workers:dev
# Output: Listening at http://localhost:8787
```

### 2. Open Your App
- Browser: http://localhost:3000
- Open DevTools: Press F12
- Go to **Console** tab

## 📊 Your Sentry Dashboard

**Before running any examples**, open Sentry in another tab:
- Go to: https://sentry.io
- Sign in
- Project: **sentry-cloudflare**
- Tab: **Issues**

You'll see errors appear here in real-time as you trigger them!

---

## 🧪 Example 1: Initialization Message (✅ Should Already Be There)

### What Happens:
When the app loads, Sentry sends an initialization message automatically.

### How to See It:

1. **In Browser Console (F12)**:
   ```
   [Sentry] Initialized with DSN: https://d0e4336bfbe40fd4a67198d9e5bed834@o4510198858579968.ingest.us.sentry.io/4510242491596800
   [Sentry] Client-side initialization ready
   ```

2. **In Sentry Dashboard**:
   - Go to Issues tab
   - Look for message: **"Todo app initialized"**
   - Click it to see details

### Screenshot Location:
```
Sentry Dashboard
├── Issues
└── Find: "Todo app initialized" (green info badge)
```

---

## 🧪 Example 2: Throw a Manual Error (Easiest)

### How to Do It:

1. **Open Browser Console** (F12)
2. **Paste this code**:
   ```javascript
   throw new Error("This is a test error from my console!")
   ```
3. **Press Enter**

### What You'll See:

**Browser Console**:
```
Uncaught Error: This is a test error from my console!
    at <anonymous>:1:1
```

**Sentry Dashboard** (refresh after 5 seconds):
- New error appears
- Title: "This is a test error from my console!"
- Click to see full details

---

## 🧪 Example 3: API Error (Network Failure)

### How to Do It:

1. **Stop the Workers API**:
   ```bash
   # In Terminal 2, press Ctrl+C
   npm run workers:dev  # STOP THIS
   ```

2. **In the App** (http://localhost:3000):
   - Type: "Test Todo"
   - Click: **"Add"** button
   - You'll see error: "Failed to create todo"

3. **Restart Workers API**:
   ```bash
   npm run workers:dev  # START AGAIN
   ```

### What You'll See:

**In App**:
```
Failed to create todo
[Retry button]
```

**Sentry Dashboard** (refresh):
- New error: Network error or "ECONNREFUSED"
- Tags show: `endpoint: /api/todos, action: create`
- Stack trace shows where it failed

---

## 🧪 Example 4: Manually Capture an Error (Advanced)

### How to Do It:

1. **Open Browser Console** (F12)
2. **Paste this code**:
   ```javascript
   Sentry.captureException(new Error("Intentional test error"))
   ```
3. **Press Enter**

### What You'll See:

**Sentry Dashboard**:
- New error: "Intentional test error"
- Shows full stack trace
- Includes user context
- Shows breadcrumbs (previous actions)

---

## 🧪 Example 5: Send a Message to Sentry

### How to Do It:

1. **Open Browser Console** (F12)
2. **Paste this code**:
   ```javascript
   Sentry.captureMessage("User clicked the add button", "info")
   ```
3. **Press Enter**

### What You'll See:

**Sentry Dashboard**:
- New message: "User clicked the add button"
- Level: **info** (blue badge)
- Not an error, but tracked

### Other Severity Levels:
```javascript
// Info messages
Sentry.captureMessage("App initialized", "info")

// Warnings
Sentry.captureMessage("Low memory detected", "warning")

// Errors
Sentry.captureMessage("Failed to save data", "error")

// Fatal errors
Sentry.captureMessage("Critical system failure", "fatal")
```

---

## 🧪 Example 6: API Error with Tags

### How to Do It:

1. **Open Browser Console** (F12)
2. **Stop the Workers** (Ctrl+C in Terminal 2)
3. **Paste this code**:
   ```javascript
   try {
     throw new Error("API Connection Failed")
   } catch (error) {
     Sentry.captureException(error, {
       tags: {
         component: "TodoList",
         action: "fetch",
         severity: "high"
       }
     })
   }
   ```
4. **Press Enter**

### What You'll See:

**Sentry Dashboard**:
- Error with tags showing:
  - `component: TodoList`
  - `action: fetch`
  - `severity: high`
- Easier to filter and search

---

## 🧪 Example 7: Set User Context Then Error

### How to Do It:

1. **Open Browser Console** (F12)
2. **Paste this code**:
   ```javascript
   // Set user information
   Sentry.setUser({
     id: "user123",
     email: "john@example.com",
     username: "johndoe"
   })

   // Then trigger an error
   throw new Error("Error with user context")
   ```
3. **Press Enter**

### What You'll See:

**Sentry Dashboard**:
- Error: "Error with user context"
- **User** section shows:
  - ID: user123
  - Email: john@example.com
  - Username: johndoe

---

## 🧪 Example 8: Add Breadcrumb (User Action Tracking)

### How to Do It:

1. **Open Browser Console** (F12)
2. **Paste this code**:
   ```javascript
   // Record user actions
   Sentry.addBreadcrumb({
     message: "User clicked add todo button",
     category: "ui.click",
     level: "info"
   })

   Sentry.addBreadcrumb({
     message: "Entered text: Test Todo",
     category: "user-input",
     level: "info"
   })

   Sentry.addBreadcrumb({
     message: "Clicked submit",
     category: "ui.click",
     level: "info"
   })

   // Now trigger error
   throw new Error("Submission failed")
   ```
3. **Press Enter**

### What You'll See:

**Sentry Dashboard**:
- Error: "Submission failed"
- **Breadcrumbs** section shows sequence:
  1. "User clicked add todo button"
  2. "Entered text: Test Todo"
  3. "Clicked submit"
  4. ERROR

This shows what the user did before the error!

---

## 🧪 Example 9: Real App Error - Try Adding Todo with Network Down

### How to Do It:

1. **Stop Workers API**:
   ```bash
   # Terminal 2: Ctrl+C
   ```

2. **In App** (http://localhost:3000):
   - Type: "Buy groceries"
   - Click: "Add" button
   - Wait for error

3. **Check Sentry** (auto-captured)

### What You'll See:

**In App**:
```
Failed to create todo
[Retry button]
```

**Sentry Dashboard**:
- Error type: Network error
- Status: Failed to connect to API
- User context: set
- Breadcrumbs: show all actions

---

## 🧪 Example 10: Complete Workflow Test

### Do This Step-by-Step:

```javascript
// 1. Set user
Sentry.setUser({
  id: "demo-user",
  username: "demo",
  email: "demo@example.com"
})

// 2. Add breadcrumb - page load
Sentry.addBreadcrumb({
  message: "App loaded successfully",
  level: "info"
})

// 3. Add breadcrumb - user action
Sentry.addBreadcrumb({
  message: "User opened todo list",
  level: "info"
})

// 4. Add breadcrumb - click action
Sentry.addBreadcrumb({
  message: "User clicked Add button",
  category: "ui.click",
  level: "info"
})

// 5. Capture warning
Sentry.captureMessage("Input validation warning: title is short", "warning")

// 6. Trigger error
throw new Error("Failed to submit todo - Network timeout")
```

### What You'll See in Sentry:

```
Error: Failed to submit todo - Network timeout
├── User: demo-user (demo@example.com)
├── Level: error (red)
├── Breadcrumbs:
│   ├── App loaded successfully
│   ├── User opened todo list
│   └── User clicked Add button
├── Tags: (if any)
├── Stack Trace: (where error occurred)
└── Release: (which version)
```

---

## 📊 How to View Details in Sentry

### Step 1: Go to Sentry Dashboard
```
https://sentry.io
→ Select "sentry-cloudflare" project
→ Click "Issues" tab
```

### Step 2: Click on Any Error
You'll see:

```
ISSUE DETAILS
├── Title: "Failed to create todo"
├── Status: Unresolved (button to resolve)
├── Frequency: 2 events in last 24 hours
│
├── USER
│   ├── ID: todo-user
│   ├── Username: todoapps-user
│   └── Email: (if set)
│
├── TAGS
│   ├── Component: TodoList
│   ├── Action: create
│   └── (more tags...)
│
├── BREADCRUMBS
│   ├── App loaded
│   ├── Todo list opened
│   ├── Add button clicked
│   └── Error thrown
│
├── STACK TRACE
│   ├── File: components/TodoList.tsx
│   ├── Line: 42
│   ├── Function: handleAddTodo
│   └── Code snippet
│
└── MORE
    ├── Release
    ├── Device/Browser
    ├── Geographic location
    └── Session info
```

---

## 🎯 Common Error Types & What They Look Like

### Type 1: Network Error
```
Error: Network Error
Code: ECONNREFUSED
Details: Cannot reach API at localhost:8787
Location: api-client.ts:29
```

### Type 2: Validation Error
```
Error: Title is required
Location: TodoInput.tsx:15
User action: Clicked add button with empty input
```

### Type 3: State Error
```
Error: Cannot read property 'id' of undefined
Location: TodoItem.tsx:42
Context: Tried to delete todo but ID was undefined
```

### Type 4: API Response Error
```
Error: Failed to fetch todos
Status: 500
Response: Server error
Location: api-client.ts:30
```

---

## 🔍 Search & Filter Errors

In Sentry Issues page, you can:

```
Search: "Failed to create"
Filter by:
  - Status: Unresolved, Resolved, Ignored
  - Level: Error, Warning, Info
  - User: demo-user
  - Tag: component=TodoList
  - Time: Last 24h, Last 7d, Last 30d
```

---

## 📈 Real-World Scenario

### Complete Error Flow Example:

1. **User logs in** → `Sentry.setUser()` called
2. **User opens app** → "App initialized" message
3. **User adds todo** → Breadcrumb recorded
4. **Network fails** → Error auto-captured
5. **Error shows in Sentry** with full context:
   - Who had the error (user)
   - What they did (breadcrumbs)
   - Where it failed (stack trace)
   - When it happened (timestamp)
   - Environment (browser, OS, etc)

---

## ✅ Checklist - Try All Examples

- [ ] Example 1: See initialization message
- [ ] Example 2: Throw manual error
- [ ] Example 3: Network error (stop API)
- [ ] Example 4: Capture exception
- [ ] Example 5: Capture message
- [ ] Example 6: Error with tags
- [ ] Example 7: Error with user context
- [ ] Example 8: Breadcrumbs + error
- [ ] Example 9: Real app workflow
- [ ] Example 10: Complete scenario

Once all checked, you understand how Sentry works! 🎉

---

## 🆘 Troubleshooting - Errors Not Appearing?

### Checklist:

- [ ] Sentry console message shows initialization?
  ```javascript
  // Check in console
  console.log(window.__SENTRY__)
  ```

- [ ] DSN is correct?
  ```bash
  cat .env.local | grep SENTRY_DSN
  ```

- [ ] Network tab shows requests to Sentry?
  - DevTools → Network
  - Look for: `ingest.us.sentry.io`

- [ ] Refresh Sentry dashboard?
  - Press F5 on https://sentry.io

- [ ] Check project settings?
  - Sentry → Settings → Error Tracking → Enabled?

---

## 📞 Quick Commands Reference

```javascript
// Capture error
Sentry.captureException(new Error("message"))

// Capture message
Sentry.captureMessage("text", "level")  // level: info, warning, error, fatal

// Set user
Sentry.setUser({ id, email, username })

// Clear user
Sentry.setUser(null)

// Add breadcrumb
Sentry.addBreadcrumb({ message, level, category })

// Capture with context
Sentry.captureException(error, {
  tags: { key: value },
  extra: { moreInfo: "details" }
})

// Get client
Sentry.getClient()

// Last event ID
Sentry.lastEventId()
```

---

## 🎯 Next Steps

1. **Try all examples above** - Get familiar with error types
2. **Read error details** - Understand stack traces
3. **Set up alerts** - Get notified when errors occur
4. **Monitor dashboard** - Check regularly for issues
5. **Fix errors** - Use Sentry to identify and fix bugs

Your Sentry dashboard is now your error tracking hub! 🚀

---

**Questions?** Check SENTRY_TESTING.md for more details.