import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  addAdminNote,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

// Optional auth — attaches req.user if token present, but doesn't block if missing
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (_) {
      // Token invalid, proceed as guest
    }
  }
  next();
};

const router = express.Router();

// User & Guest routes
router.route("/").post(optionalAuth, addOrderItems).get(verifyToken, requireAdmin, getOrders);
router.route("/my").get(verifyToken, getMyOrders);
router.route("/my/:id").get(verifyToken, getMyOrderById).delete(verifyToken, cancelMyOrder);

// Admin routes
router.route("/:id").get(verifyToken, requireAdmin, getOrderById);
router.route("/:id/status").put(verifyToken, requireAdmin, updateOrderStatus);
router.route("/:id/payment").put(verifyToken, requireAdmin, updateOrderToPaid);
router.route("/:id/note").put(verifyToken, requireAdmin, addAdminNote);

export default router;
