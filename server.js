import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

const app = express();

mongoose.set("bufferCommands", false);

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}
connectDB();

/* CORS FIRST */
const allowedOrigins = [
  "http://localhost:5173",
  "https://pingup-backend-server.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.use(express.json());

app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }));

app.use(clerkMiddleware());

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

export default app;
