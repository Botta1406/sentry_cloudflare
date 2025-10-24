"use client";

import * as Sentry from "@sentry/nextjs";

export default function TestErrorsPage() {
  const handleThrowError = () => {
    console.log("[Test] Throwing test error...");
    throw new Error("This is a test error from the frontend!");
  };

  const handleThrowPromiseError = () => {
    console.log("[Test] Throwing unhandled promise rejection...");
    Promise.reject(new Error("This is an unhandled promise rejection!"));
  };

  const handleCaptureMessage = () => {
    console.log("[Test] Capturing test message...");
    Sentry.captureMessage("This is a test message from the frontend", "info");
  };

  const handleCaptureException = () => {
    console.log("[Test] Capturing test exception...");
    try {
      throw new Error("This is a test exception!");
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "TestErrorsPage",
          action: "testException",
        },
      });
    }
  };

  const handleNullReference = () => {
    console.log("[Test] Triggering null reference error...");
    const obj = null as any;
    obj.property.nested.value; // This will throw a TypeError
  };

  const handleFetchError = async () => {
    console.log("[Test] Triggering fetch error...");
    try {
      const response = await fetch("http://localhost:8787/api/nonexistent");
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: "TestErrorsPage",
          action: "fetchError",
        },
      });
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Sentry Error Testing Page</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Click the buttons below to test different types of errors in Sentry
      </p>

      <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <button
          onClick={handleCaptureMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Send Test Message
        </button>

        <button
          onClick={handleCaptureException}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Send Test Exception
        </button>

        <button
          onClick={handleThrowError}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Throw Uncaught Error
        </button>

        <button
          onClick={handleThrowPromiseError}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Throw Unhandled Promise
        </button>

        <button
          onClick={handleNullReference}
          style={{
            padding: "10px 20px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Trigger Null Reference
        </button>

        <button
          onClick={handleFetchError}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00BCD4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Trigger Fetch Error
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <p>
          <strong>Instructions:</strong>
        </p>
        <ul>
          <li>Click any button to trigger a test error</li>
          <li>Check your Sentry dashboard to see the errors appear</li>
          <li>Check the browser console for debug logs</li>
          <li>Go back to the main page: <a href="/">Back to Home</a></li>
        </ul>
      </div>
    </div>
  );
}