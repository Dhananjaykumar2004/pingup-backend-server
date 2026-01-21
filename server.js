import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {inngest, functions} from './inngest/index.js'
import {serve} from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRotes.js';
import postRouter from './routes/postRoutes.js';
import storyRouter from './routes/storyRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import webhookRoutes from "./routes/webhookRoutes.js";
// import inngestRoutes from "./routes/inngestRoutes.js";
import inngestHandler from "./inngest/handler.js";



const app = express();

await connectDB();
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" })
);
// app.use("/api", inngestRoutes);

app.use("/api/inngest", inngestHandler);
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pingup-backend-server.vercel.app"
  ],
  credentials: true
}));

app.use(clerkMiddleware());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


app.use("/api", webhookRoutes);

app.get('/', (req, res)=> res.send('Server is running'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)

const PORT = process.env.PORT || 4000;

// app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
export default app;
