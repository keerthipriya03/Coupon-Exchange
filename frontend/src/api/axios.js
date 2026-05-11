// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://swapnsave-backend-natz.onrender.com",
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("swapnsaveUser");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

export default API;