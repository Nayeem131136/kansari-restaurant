import express from "express";
import { authRouter } from "./routes/authRoutes";
import { reservationRouter } from "./routes/reservationRoutes";
import { menuRouter } from "./routes/menuRoutes";
import { galleryRouter } from "./routes/galleryRoutes";
import { reviewRouter } from "./routes/reviewRoutes";
import { restaurantRouter } from "./routes/restaurantRoutes";
import { analyticsRouter } from "./routes/analyticsRoutes";
import { uploadRouter } from "./routes/uploadRoutes";

export function createApp() {
  const app = express();

  // JSON Body Parser & URL Encoded
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Note: uploaded images are stored in Supabase Storage and served
  // directly from Supabase's public URL — no local /uploads static route
  // is needed (or would work reliably on Vercel's serverless filesystem).

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mount API Routers
  app.use("/api/auth", authRouter);
  app.use("/api", reservationRouter);
  app.use("/api", menuRouter);
  app.use("/api", galleryRouter);
  app.use("/api", reviewRouter);
  app.use("/api", restaurantRouter);
  app.use("/api", analyticsRouter);
  app.use("/api", uploadRouter);

  // 404 handler for unmatched /api/* routes
  app.use("/api", (req, res) => {
    res.status(404).json({ error: `No API route matches ${req.method} ${req.path}` });
  });

  // Global error handler — catches anything thrown/rejected in a route
  // that wasn't already caught locally, and any unexpected framework-level
  // error (e.g. malformed JSON body), returning clean JSON instead of
  // Express's default HTML error page or an opaque platform crash page.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled error in request pipeline:", err);
    res.status(err?.status || 500).json({
      error: "Internal server error",
      message: err?.message || String(err),
    });
  });

  return app;
}
