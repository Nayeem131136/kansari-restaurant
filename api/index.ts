// Vercel Serverless Function entry point.
// Vercel routes every request under /api/* to this single function
// (see vercel.json), and Express's app itself acts as the request handler.
//
// IMPORTANT: this must be a static import, not a dynamic import(). Vercel's
// build step statically traces `import`/`require` statements to decide
// which files to include in the deployed function bundle. A dynamic
// import() here caused "Cannot find module '/var/task/server/app'" at
// runtime because server/app.ts (and everything it depends on) wasn't
// being bundled. Runtime error resilience is instead handled inside
// server/app.ts via an Express error-handling middleware.
import { createApp } from "../server/app";

const app = createApp();

export default app;
