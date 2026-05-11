import express from "express";
import { signup, login, getMe, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/signup", signup);                                          // POST /api/auth/signup
router.post("/login", login);                                            // POST /api/auth/login
router.get("/me", protect, getMe);                                       // GET  /api/auth/me
router.put("/profile", protect, upload.single("avatar"), updateProfile); // PUT  /api/auth/profile

export default router;