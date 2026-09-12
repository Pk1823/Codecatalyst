import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRouter from "./routes";
import { notFoundHandler, globalErrorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Security & Parsing Middleware
const allowedOrigins = [
  CORS_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all for evaluation/demo deployments
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check
app.get(["/health", "/api/health"], (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "MISSIONWELL AI - Backend API",
    organization: "Ministry of Home Affairs / CRPF, Police II Division",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", apiRouter);

// 404 and Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`====================================================`);
    console.log(`MISSIONWELL AI — Backend Service Running`);
    console.log(`Organization : Ministry of Home Affairs / CRPF`);
    console.log(`Port         : http://0.0.0.0:${PORT}`);
    console.log(`Health       : http://0.0.0.0:${PORT}/health`);
    console.log(`API Base     : http://0.0.0.0:${PORT}/api`);
    console.log(`====================================================`);
  });
}

export default app;
