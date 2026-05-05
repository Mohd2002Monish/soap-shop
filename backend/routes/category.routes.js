import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.route("/").get(getCategories).post(verifyToken, requireAdmin, createCategory);
router.route("/:slug").get(getCategoryBySlug);
router
  .route("/:id")
  .put(verifyToken, requireAdmin, updateCategory)
  .delete(verifyToken, requireAdmin, deleteCategory);

export default router;
