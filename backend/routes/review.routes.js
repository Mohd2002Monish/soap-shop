import express from "express";
import {
  getProductReviews,
  submitReview,
  getAllReviews,
  approveReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.route("/product/:productId").get(getProductReviews).post(verifyToken, submitReview);
router.route("/").get(verifyToken, requireAdmin, getAllReviews);
router.route("/:id/approve").put(verifyToken, requireAdmin, approveReview);
router.route("/:id").delete(verifyToken, requireAdmin, deleteReview);

export default router;
