import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes, { seedAdmin } from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
import aiChatRoutes from "./routes/ai-chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-frontend.netlify.app",
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai-chat", aiChatRoutes);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(async () => {
    console.log("MongoDB connected successfully");
    await seedAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log(
      "Server will run without database. Some features may not work.",
    );
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API endpoints:");
  console.log("   - POST /api/auth/login");
  console.log("   - GET  /api/portfolio");
  console.log("   - POST /api/contact/submit");
  console.log("   - POST /api/upload/resume (admin only)");
  console.log("   - POST /api/ai-chat/chat (AI Career Assistant)");
  console.log("   - POST /api/ai-chat/seed (seed knowledge base)");
  console.log("   - GET  /api/ai-chat/suggestions (chat suggestions)");
});
