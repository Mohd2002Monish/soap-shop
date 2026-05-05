import express from "express";
import {
  getStats,
  getRecentOrders,
  getTopProducts,
  getRevenueData,
} from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.route("/stats").get(verifyToken, requireAdmin, getStats);
router.route("/recent-orders").get(verifyToken, requireAdmin, getRecentOrders);
router.route("/top-products").get(verifyToken, requireAdmin, getTopProducts);
router.route("/revenue").get(verifyToken, requireAdmin, getRevenueData);

export default router;
