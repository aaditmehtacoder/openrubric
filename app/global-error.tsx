"use client";

/**
 * Last-resort boundary for errors in the root layout itself. Renders its own
 * <html>/<body> with inline styles (the app shell may not have loaded).
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F5F0",
          color: "#0A0A0A",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>
          OpenRubric hit an unexpected error
        </h1>
        <p style={{ marginTop: "8px", color: "#6C6A64", maxWidth: "42ch" }}>
          Please reload the page. Your data is safe.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "24px",
            background: "#0A0A0A",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "12px 22px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
