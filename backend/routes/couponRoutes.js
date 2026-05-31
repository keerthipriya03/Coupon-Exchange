import express from "express";
import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getMyCoupons,
} from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/",              getCoupons);                                           
router.get("/my/listings",   protect, getMyCoupons);                                
router.get("/:id",           getCouponById);                                        
router.post("/",             protect, upload.single("image"), createCoupon);        
router.put("/:id",           protect, upload.single("image"), updateCoupon);        
router.delete("/:id",        protect, deleteCoupon);                                

export default router;
