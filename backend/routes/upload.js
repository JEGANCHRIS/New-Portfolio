import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Portfolio from "../models/Portfolio.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `resume_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Profile image upload configuration
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const profileImageDir = path.join(uploadsDir, "profile-images");
    if (!fs.existsSync(profileImageDir)) {
      fs.mkdirSync(profileImageDir, { recursive: true });
    }
    cb(null, profileImageDir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images are allowed"));
    }
  },
});

// Upload resume (admin only)
router.post("/resume", auth, upload.single("resume"), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    // Update portfolio with resume URL
    await Portfolio.findOneAndUpdate({}, { resumeUrl }, { upsert: true });

    res.json({
      success: true,
      resumeUrl,
      filename: req.file.filename,
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

// Get uploaded resume info (admin only)
router.get("/resume", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolio = await Portfolio.findOne();

    if (!portfolio || !portfolio.resumeUrl) {
      return res.json({
        success: true,
        hasResume: false,
        message: "No resume uploaded yet",
      });
    }

    // Check if file exists
    const filePath = path.join(uploadsDir, path.basename(portfolio.resumeUrl));
    const fileExists = fs.existsSync(filePath);

    res.json({
      success: true,
      hasResume: true,
      resumeUrl: portfolio.resumeUrl,
      fileExists,
      filename: portfolio.resumeUrl.split("/").pop(),
    });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get resume info",
      error: error.message,
    });
  }
});

// Delete resume (admin only)
router.delete("/resume", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolio = await Portfolio.findOne();

    if (!portfolio || !portfolio.resumeUrl) {
      return res.status(404).json({ message: "No resume found" });
    }

    // Delete file
    const filePath = path.join(uploadsDir, path.basename(portfolio.resumeUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove URL from portfolio
    await Portfolio.findOneAndUpdate({}, { resumeUrl: "" });

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
      error: error.message,
    });
  }
});

// Upload profile image (admin only)
router.post(
  "/profile-image",
  auth,
  uploadProfileImage.single("profileImage"),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profileImagePath = `/uploads/profile-images/${req.file.filename}`;

      // Update portfolio with profile image URL
      await Portfolio.findOneAndUpdate(
        {},
        { profileImage: profileImagePath },
        { upsert: true },
      );

      res.json({
        success: true,
        profileImage: profileImagePath,
        filename: req.file.filename,
        message: "Profile image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Upload failed",
        error: error.message,
      });
    }
  },
);

export default router;
