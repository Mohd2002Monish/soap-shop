import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getTopProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(verifyToken, requireAdmin, createProduct);
router.route("/featured").get(getFeaturedProducts);
router.route("/top").get(getTopProducts);
router.route("/:slug").get(getProductBySlug);
router
  .route("/:id")
  .put(verifyToken, requireAdmin, updateProduct)
  .delete(verifyToken, requireAdmin, deleteProduct);

export default router;
