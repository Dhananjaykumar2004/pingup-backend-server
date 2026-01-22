import express from 'express';
import { getChatMessages, sendMessage, sseController } from '../controllers/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';


const messageRouter = express.Router();

messageRouter.get('/:userId', sseController)
messageRouter.post('/send', upload.single('image'), protect, sendMessage)
messageRouter.post('/get', protect, getChatMessages)
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
res.setHeader("Access-Control-Allow-Credentials", "true");


export default messageRouter