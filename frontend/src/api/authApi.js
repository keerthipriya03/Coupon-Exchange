// src/api/authApi.js
import API from "./axios";

export const signupUser = async (name, email, password) => {
  const { data } = await API.post("/auth/signup", { name, email, password });
  return data; 
};

export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data; 
};


export const getMyProfile = async () => {
  const { data } = await API.get("/auth/me");
  return data; 
};


export const updateProfile = async (formData) => {
  const { data } = await API.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
