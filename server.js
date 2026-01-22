import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

import userRouter from "./routes/userRotes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import inngestHandler from "./inngest/handler.js";

const app = express();

/* =======================
   MongoDB (Vercel-safe)
======================= */
mongoose.set("bufferCommands", false);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "pingup",
  });

  isConnected = true;
  console.log("MongoDB connected");
}

connectDB();

/* =======================
   CORS — MUST BE FIRST
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://pingup-backend-server.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 🔥 HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

/* =======================
   Body parser
======================= */
app.use(express.json());

/* =======================
   Clerk webhook (raw body)
======================= */
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" })
);

/* =======================
   Clerk middleware (AFTER CORS)
======================= */
app.use(clerkMiddleware());

/* =======================
   Routes
======================= */
app.use("/api", webhookRoutes);

app.use("/api/inngest", inngestHandler);
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

/* =======================
   Health check
======================= */
app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;
