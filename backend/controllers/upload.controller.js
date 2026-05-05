import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "soap-shop" },
    (error, result) => {
      if (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: error.message || "Image upload failed" });
      }
      res.json({ url: result.secure_url, publicId: result.public_id });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

export const deleteImage = async (req, res) => {
  const { publicId } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ message: "No public ID provided" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(400).json({ message: "Image deletion failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image deletion failed" });
  }
};
