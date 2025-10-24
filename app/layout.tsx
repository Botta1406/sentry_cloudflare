import type { Metadata } from "next";
import "./globals.css";
import { SentryInit } from "./sentry-init";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application with Cloudflare Workers and Sentry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <SentryInit />
        {children}
      </body>
    </html>
  );
}