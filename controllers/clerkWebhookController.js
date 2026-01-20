import { Webhook } from "svix";
import { inngest } from "../inngest/index.js";

export const clerkWebhook = async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    const headers = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const event = wh.verify(payload, headers);

    const { type, data } = event;

    // Forward Clerk event to Inngest
    await inngest.send({
      name: `clerk/${type}`,
      data,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    return res.status(400).json({ success: false });
  }
};
