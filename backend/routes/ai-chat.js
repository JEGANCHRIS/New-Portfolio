import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Portfolio from "../models/Portfolio.js";
import CareerInfo from "../models/CareerInfo.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const portfolio = await Portfolio.findOne().select("name title email location");

    // Only fetch docs relevant to the message keyword to save tokens
    const kw = message.toLowerCase();
    let category = null;
    if (kw.includes("skill") || kw.includes("tech")) category = "skills";
    else if (kw.includes("experience") || kw.includes("work")) category = "experience";
    else if (kw.includes("project")) category = "projects";
    else if (kw.includes("education") || kw.includes("degree")) category = "education";

    const docs = await CareerInfo.find(category ? { category } : {})
      .select("category title content")
      .limit(3);

    const context = docs.map((d) => `${d.title}: ${d.content}`).join("\n");

    const prompt = `You are ${portfolio?.name || "Meshach"}'s AI assistant (${portfolio?.title || "Full Stack Developer"}). Speak as Meshach in first person. Be brief and helpful.
Contact: ${portfolio?.email || "jmchristo.2000@gmail.com"}
${context ? `Context:\n${context}` : ""}

User: ${message}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response, sources: [] });
  } catch (error) {
    console.error("AI Chat error:", error.message);
    res.status(500).json({ error: "Failed to process chat message", detail: error.message });
  }
});

router.get("/suggestions", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().select("name");
    const name = portfolio?.name || "Meshach";
    res.json({
      suggestions: [
        `What are ${name}'s top technical skills?`,
        `Tell me about ${name}'s recent projects`,
        `Is ${name} available for freelance work?`,
        `What's ${name}'s experience with React?`,
        `How can I contact ${name}?`,
      ],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load suggestions" });
  }
});

router.post("/seed", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });

    await CareerInfo.deleteMany({});
    const careerData = [];

    if (portfolio.summary) {
      careerData.push({ category: "summary", title: "Professional Summary", content: portfolio.summary, metadata: { tags: ["about"], priority: 3 }, embedding: [] });
    }

    if (portfolio.skills) {
      const allSkills = [
        ...(portfolio.skills.frontend || []).map((s) => `${s.name} (${s.level}%)`),
        ...(portfolio.skills.backend || []).map((s) => `${s.name} (${s.level}%)`),
        ...(portfolio.skills.databases || []).map((s) => `${s.name} (${s.level}%)`),
        ...(portfolio.skills.tools || []).map((s) => `${s.name} (${s.level}%)`),
      ];
      if (allSkills.length > 0) {
        careerData.push({ category: "skills", title: "Technical Skills", content: `Proficient in: ${allSkills.join(", ")}`, metadata: { tags: ["skills"], priority: 3 }, embedding: [] });
      }
    }

    portfolio.experiences?.forEach((exp) => {
      careerData.push({ category: "experience", title: `${exp.title} at ${exp.company}`, content: `${exp.title} at ${exp.company} (${exp.period}). ${exp.description.join(". ")}`, metadata: { tags: ["experience"], priority: 2 }, embedding: [] });
    });

    portfolio.education?.forEach((edu) => {
      careerData.push({ category: "education", title: edu.degree, content: `${edu.degree} at ${edu.institution} (${edu.period}). GPA: ${edu.gpa || "N/A"}`, metadata: { tags: ["education"], priority: 1 }, embedding: [] });
    });

    portfolio.projects?.forEach((project) => {
      careerData.push({ category: "projects", title: project.title, content: `${project.title}. Tech: ${project.techStack}. ${project.description}`, metadata: { tags: ["project"], priority: 2 }, embedding: [] });
    });

    await CareerInfo.insertMany(careerData);
    res.json({ message: "Career knowledge base seeded successfully", count: careerData.length });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Failed to seed career data", error: error.message });
  }
});

router.get("/knowledge-base", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    const items = await CareerInfo.find().select("-embedding");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
