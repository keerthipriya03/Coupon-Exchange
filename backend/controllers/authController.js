import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already registered." });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const avatarPath = req.file ? `/uploads/coupons/${req.file.filename}` : undefined;

    const updates = {};
    if (name) updates.name = name;
    if (avatarPath) updates.avatar = avatarPath;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};