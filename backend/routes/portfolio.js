import express from "express";
import Portfolio from "../models/Portfolio.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get portfolio data (public)
router.get("/", async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();
    if (!portfolio) {
      // Create default portfolio if not exists
      portfolio = new Portfolio();
      await portfolio.save();
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update portfolio data (admin only)
router.put("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log(
      "📝 Received portfolio update:",
      JSON.stringify(req.body, null, 2),
    );

    const portfolio = await Portfolio.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    console.log("✅ Portfolio updated successfully");
    console.log("Saved experiences:", portfolio.experiences);

    res.json(portfolio);
  } catch (error) {
    console.error("❌ Error updating portfolio:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update stats for charts (admin only)
router.patch("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { stats: req.body },
      { new: true },
    );
    res.json(portfolio.stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
