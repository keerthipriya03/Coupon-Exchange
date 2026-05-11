import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All message routes require auth
router.use(protect);

router.get("/conversations",  getConversations);    // GET  /api/messages/conversations
router.get("/:userId",        getMessages);          // GET  /api/messages/:userId
router.post("/:userId",       sendMessage);          // POST /api/messages/:userId

export default router;