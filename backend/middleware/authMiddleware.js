import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

// Protect: must be logged in
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized. No token." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

// Admin only
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admins only." });
  }
  next();
};