import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router
  .route("/me")
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

router.get("/users", verifyToken, requireAdmin, getAllUsers);

export default router;
