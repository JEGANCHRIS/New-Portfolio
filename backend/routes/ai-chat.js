import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Portfolio from "../models/Portfolio.js";
import CareerInfo from "../models/CareerInfo.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const portfolio = await Portfolio.findOne();
    const careerInfoDocs = await CareerInfo.find().select("-embedding").limit(20);

    const portfolioContext = portfolio
      ? `Name: ${portfolio.name}, Title: ${portfolio.title}, Email: ${portfolio.email}, Location: ${portfolio.location}`
      : "";

    const careerContext = careerInfoDocs
      .map((doc) => `[${doc.category.toUpperCase()}] ${doc.title}: ${doc.content}`)
      .join("\n\n");

    const systemPrompt = `You are Meshach Christo's AI Career Assistant. You help visitors learn about Meshach's skills, experience, projects, and availability.

PERSONALITY:
- Friendly, professional, and enthusiastic
- Speak in first person as if you ARE Meshach
- Keep answers concise but informative
- If you don't know something, say you'd need to check with Meshach directly

CONTEXT ABOUT MESHACH:
${portfolioContext}

KNOWLEDGE BASE:
${careerContext}

INSTRUCTIONS:
- Answer questions based on the context provided above
- If the context doesn't have enough information, be honest about it
- Encourage visitors to reach out via email for more details
- Mention availability for freelance/full-time opportunities when relevant`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const history = conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood! I'm ready to assist as Meshach's AI Career Assistant." }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ response, sources: [] });
  } catch (error) {
    console.error("AI Chat error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to process chat message", detail: error.message });
  }
});

router.get("/suggestions", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
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
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    await CareerInfo.deleteMany({});
    const careerData = [];

    if (portfolio.summary) {
      careerData.push({ category: "summary", title: "Professional Summary", content: portfolio.summary, metadata: { tags: ["about", "summary"], priority: 3 }, embedding: [] });
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

    if (portfolio.experiences?.length > 0) {
      portfolio.experiences.forEach((exp) => {
        careerData.push({ category: "experience", title: `${exp.title} at ${exp.company}`, content: `${exp.title} at ${exp.company} (${exp.period}). ${exp.description.join(". ")}`, metadata: { tags: ["experience"], priority: 2 }, embedding: [] });
      });
    }

    if (portfolio.education?.length > 0) {
      portfolio.education.forEach((edu) => {
        careerData.push({ category: "education", title: `${edu.degree}`, content: `${edu.degree} at ${edu.institution} (${edu.period}). GPA: ${edu.gpa || "N/A"}`, metadata: { tags: ["education"], priority: 1 }, embedding: [] });
      });
    }

    if (portfolio.projects?.length > 0) {
      portfolio.projects.forEach((project) => {
        careerData.push({ category: "projects", title: project.title, content: `${project.title}. Tech: ${project.techStack}. ${project.description}. Features: ${project.features.join(". ")}`, metadata: { tags: ["project"], priority: 2 }, embedding: [] });
      });
    }

    await CareerInfo.insertMany(careerData);
    res.json({ message: "Career knowledge base seeded successfully", count: careerData.length });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ message: "Failed to seed career data", error: error.message });
  }
});

router.get("/knowledge-base", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const items = await CareerInfo.find().select("-embedding");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
