import express from "express";
import multer from "multer";
import { uploadImage, deleteImage } from "../controllers/upload.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/image")
  .post(verifyToken, requireAdmin, upload.single("image"), uploadImage)
  .delete(verifyToken, requireAdmin, deleteImage);

export default router;
