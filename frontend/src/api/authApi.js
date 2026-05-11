// src/api/authApi.js
import API from "./axios";

// Called in Signup.jsx instead of localStorage simulation
export const signupUser = async (name, email, password) => {
  const { data } = await API.post("/auth/signup", { name, email, password });
  return data; // { success, token, user }
};

// Called in Login.jsx instead of localStorage simulation
export const loginUser = async (email, password) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data; // { success, token, user }
};

// Called in Navbar.jsx / Profile.jsx to get current user
export const getMyProfile = async () => {
  const { data } = await API.get("/auth/me");
  return data; // { success, user }
};

// Called in Profile.jsx Edit Profile form
export const updateProfile = async (formData) => {
  const { data } = await API.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};