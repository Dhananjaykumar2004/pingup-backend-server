import express from "express";
import { clerkWebhook } from "../controllers/clerkWebhookController.js";

const router = express.Router();

router.post("/webhooks/clerk", clerkWebhook);

export default router;
