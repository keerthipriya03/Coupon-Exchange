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

router.get("/",              getCoupons);                                           // GET  /api/coupons          (BrowseCoupons page)
router.get("/my/listings",   protect, getMyCoupons);                                // GET  /api/coupons/my/listings (Profile page)
router.get("/:id",           getCouponById);                                        // GET  /api/coupons/:id
router.post("/",             protect, upload.single("image"), createCoupon);        // POST /api/coupons          (AddListing page)
router.put("/:id",           protect, upload.single("image"), updateCoupon);        // PUT  /api/coupons/:id
router.delete("/:id",        protect, deleteCoupon);                                // DELETE /api/coupons/:id

export default router;