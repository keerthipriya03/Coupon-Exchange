// src/api/messageApi.js
import API from "./axios";


export const fetchConversations = async () => {
  const { data } = await API.get("/messages/conversations");
  return data; 
};

export const fetchMessages = async (userId) => {
  const { data } = await API.get(`/messages/${userId}`);
  return data;
};


export const sendMessage = async (userId, text, couponId = null) => {
  const { data } = await API.post(`/messages/${userId}`, { text, couponId });
  return data; // { success, message }
};
