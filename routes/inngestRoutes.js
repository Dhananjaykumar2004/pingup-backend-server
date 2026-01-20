import express from "express";
import inngestHandler from "../inngest/handler.js";

const router = express.Router();

// Inngest endpoint
router.use("/inngest", inngestHandler);

export default router;
