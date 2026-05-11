// src/api/messageApi.js
import API from "./axios";

// Chat.jsx left panel — replaces hardcoded users array
export const fetchConversations = async () => {
  const { data } = await API.get("/messages/conversations");
  return data; // { success, conversations: [{ user, lastMessage, updatedAt }] }
};

// Chat.jsx right panel — load messages for selected user
export const fetchMessages = async (userId) => {
  const { data } = await API.get(`/messages/${userId}`);
  return data; // { success, messages }
};

// Chat.jsx send button — replaces the local state append
export const sendMessage = async (userId, text, couponId = null) => {
  const { data } = await API.post(`/messages/${userId}`, { text, couponId });
  return data; // { success, message }
};