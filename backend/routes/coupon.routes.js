import express from "express";
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.route("/apply").post(verifyToken, applyCoupon);
router.route("/").get(verifyToken, requireAdmin, getCoupons).post(verifyToken, requireAdmin, createCoupon);
router
  .route("/:id")
  .put(verifyToken, requireAdmin, updateCoupon)
  .delete(verifyToken, requireAdmin, deleteCoupon);

export default router;
