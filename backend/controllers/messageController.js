import Message from "../models/Message.js";
import User from "../models/User.js";

// ─── GET /api/messages/conversations ─────────────────────────────────────────
// Returns list of unique users this user has chatted with (for left panel)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: -1 });

    // Build unique conversation list
    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const other = msg.sender._id.toString() === userId.toString()
        ? msg.receiver
        : msg.sender;

      if (!seen.has(other._id.toString())) {
        seen.add(other._id.toString());
        conversations.push({
          user: other,
          lastMessage: msg.text,
          updatedAt: msg.createdAt,
        });
      }
    }

    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/messages/:userId ────────────────────────────────────────────────
// Get full chat between logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: otherId, receiver: myId, read: false },
      { read: true }
    );

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/messages/:userId ───────────────────────────────────────────────
// Send a message to another user
export const sendMessage = async (req, res) => {
  try {
    const { text, couponId } = req.body;
    const receiverId = req.params.userId;

    if (!text?.trim())
      return res.status(400).json({ success: false, message: "Message cannot be empty." });

    const receiver = await User.findById(receiverId);
    if (!receiver)
      return res.status(404).json({ success: false, message: "Receiver not found." });

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
      coupon: couponId || null,
    });

    const populated = await message.populate("sender", "name avatar");
    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};