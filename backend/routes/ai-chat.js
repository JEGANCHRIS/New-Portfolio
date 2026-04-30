import express from "express";
import { Ollama } from "ollama";
import CareerInfo from "../models/CareerInfo.js";
import Portfolio from "../models/Portfolio.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || "http://localhost:11434",
});

// Chat with AI Career Assistant
router.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Step 1: Generate embedding for the user's query
    const embeddingResponse = await ollama.embeddings({
      model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
      prompt: message,
    });

    const queryEmbedding = embeddingResponse.embedding;

    // Step 2: Vector search in MongoDB Atlas
    const similarDocs = await CareerInfo.aggregate([
      {
        $vectorSearch: {
          index: "career_info_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 10,
          limit: 5,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    // Step 3: Build context from retrieved documents
    const context = similarDocs
      .map(
        (doc) => `[${doc.category.toUpperCase()}] ${doc.title}: ${doc.content}`,
      )
      .join("\n\n");

    // Step 4: Get portfolio data for additional context
    const portfolio = await Portfolio.findOne();
    const portfolioContext = portfolio
      ? `
Name: ${portfolio.name}
Title: ${portfolio.title}
Email: ${portfolio.email}
Location: ${portfolio.location}
    `.trim()
      : "";

    // Step 5: Build the RAG prompt
    const systemPrompt = `You are Meshach Christo's AI Career Assistant. You help visitors learn about Meshach's skills, experience, projects, and availability.

PERSONALITY:
- Friendly, professional, and enthusiastic
- Speak in first person as if you ARE Meshach
- Keep answers concise but informative
- If you don't know something, say you'd need to check with Meshach directly

CONTEXT ABOUT MESHACH:
${portfolioContext}

RELEVANT INFORMATION FROM KNOWLEDGE BASE:
${context}

INSTRUCTIONS:
- Answer questions based on the context provided above
- If the context doesn't have enough information, be honest about it
- Encourage visitors to reach out via email for more details
- Mention availability for freelance/full-time opportunities when relevant`;

    // Step 6: Get AI response
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await ollama.chat({
      model: process.env.CHAT_MODEL || "llama3.2",
      messages: messages,
      stream: false,
    });

    res.json({
      response: response.message.content,
      sources: similarDocs.map((doc) => ({
        title: doc.title,
        category: doc.category,
        score: doc.score,
      })),
    });
  } catch (error) {
    console.error("AI Chat error:", error.message);

    // Fallback response if Ollama is not available
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        response:
          "Hi! I'm Meshach's AI assistant. Currently, my AI brain is taking a nap (Ollama server isn't running). But feel free to reach out to Meshach directly at jmchristo.2000@gmail.com!",
        sources: [],
        fallback: true,
      });
    }

    res.status(500).json({ error: "Failed to process chat message" });
  }
});

// Get conversation suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    const name = portfolio?.name || "Meshach";

    const suggestions = [
      `What are ${name}'s top technical skills?`,
      `Tell me about ${name}'s recent projects`,
      `Is ${name} available for freelance work?`,
      `What's ${name}'s experience with React?`,
      `How can I contact ${name}?`,
    ];

    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: "Failed to load suggestions" });
  }
});

// Seed career knowledge base (admin only)
router.post("/seed", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const portfolio = await Portfolio.findOne();
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Clear existing data
    await CareerInfo.deleteMany({});

    const careerData = [];

    // Add summary
    if (portfolio.summary) {
      careerData.push({
        category: "summary",
        title: "Professional Summary",
        content: portfolio.summary,
        metadata: { tags: ["about", "summary", "intro"], priority: 3 },
      });
    }

    // Add skills
    if (portfolio.skills) {
      const allSkills = [
        ...(portfolio.skills.frontend || []).map(
          (s) => `${s.name} (${s.level}%)`,
        ),
        ...(portfolio.skills.backend || []).map(
          (s) => `${s.name} (${s.level}%)`,
        ),
        ...(portfolio.skills.databases || []).map(
          (s) => `${s.name} (${s.level}%)`,
        ),
        ...(portfolio.skills.tools || []).map((s) => `${s.name} (${s.level}%)`),
      ];

      if (allSkills.length > 0) {
        careerData.push({
          category: "skills",
          title: "Technical Skills",
          content: `Meshach is proficient in: ${allSkills.join(", ")}. He continuously learns new technologies and stays updated with industry trends.`,
          metadata: {
            tags: ["skills", "technologies", "expertise"],
            priority: 3,
          },
        });
      }

      // Individual skill entries for better search
      if (portfolio.skills.frontend) {
        portfolio.skills.frontend.forEach((skill) => {
          careerData.push({
            category: "skills",
            title: `Frontend: ${skill.name}`,
            content: `${skill.name} - Proficiency: ${skill.level}%. Experience building responsive and interactive user interfaces.`,
            metadata: {
              tags: ["frontend", skill.name.toLowerCase(), "react", "ui"],
              priority: 2,
            },
          });
        });
      }

      if (portfolio.skills.backend) {
        portfolio.skills.backend.forEach((skill) => {
          careerData.push({
            category: "skills",
            title: `Backend: ${skill.name}`,
            content: `${skill.name} - Proficiency: ${skill.level}%. Experience building scalable APIs and server-side applications.`,
            metadata: {
              tags: ["backend", skill.name.toLowerCase(), "api", "node"],
              priority: 2,
            },
          });
        });
      }
    }

    // Add experiences
    if (portfolio.experiences && portfolio.experiences.length > 0) {
      portfolio.experiences.forEach((exp) => {
        careerData.push({
          category: "experience",
          title: `${exp.title} at ${exp.company}`,
          content: `${exp.title} at ${exp.company} (${exp.period}). Location: ${exp.location}. Responsibilities: ${exp.description.join(". ")}`,
          metadata: {
            tags: ["experience", "work", exp.company.toLowerCase()],
            priority: 2,
          },
        });
      });
    }

    // Add education
    if (portfolio.education && portfolio.education.length > 0) {
      portfolio.education.forEach((edu) => {
        careerData.push({
          category: "education",
          title: `${edu.degree} from ${edu.institution}`,
          content: `${edu.degree} at ${edu.institution} (${edu.period}). GPA: ${edu.gpa || "N/A"}`,
          metadata: {
            tags: ["education", "degree", edu.institution.toLowerCase()],
            priority: 1,
          },
        });
      });
    }

    // Add projects
    if (portfolio.projects && portfolio.projects.length > 0) {
      portfolio.projects.forEach((project) => {
        careerData.push({
          category: "projects",
          title: project.title,
          content: `${project.title}. Tech Stack: ${project.techStack}. Description: ${project.description}. Key Features: ${project.features.join(". ")}. ${project.liveLink ? `Live: ${project.liveLink}` : ""} ${project.githubLink ? `GitHub: ${project.githubLink}` : ""}`,
          metadata: {
            tags: [
              "project",
              "portfolio",
              ...project.techStack
                .toLowerCase()
                .split(",")
                .map((s) => s.trim()),
            ],
            priority: 2,
          },
        });
      });
    }

    // Add availability info
    careerData.push({
      category: "availability",
      title: "Work Availability",
      content: `Meshach is currently ${portfolio.stats?.yearsExperience > 0 ? "open to" : "actively seeking"} new opportunities including full-time positions, freelance projects, and internships. Available for remote work and willing to relocate. Contact: ${portfolio.email}`,
      metadata: {
        tags: ["availability", "hiring", "freelance", "full-time", "remote"],
        priority: 3,
      },
    });

    // Generate embeddings and save
    const embeddingModel = process.env.EMBEDDING_MODEL || "nomic-embed-text";

    for (const item of careerData) {
      try {
        const embedding = await ollama.embeddings({
          model: embeddingModel,
          prompt: `${item.title}: ${item.content}`,
        });
        item.embedding = embedding.embedding;
      } catch (embedError) {
        console.error(
          `Failed to generate embedding for "${item.title}":`,
          embedError.message,
        );
        // Save without embedding if Ollama fails
        item.embedding = new Array(768).fill(0);
      }
    }

    await CareerInfo.insertMany(careerData);

    res.json({
      message: "Career knowledge base seeded successfully",
      count: careerData.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    res
      .status(500)
      .json({ message: "Failed to seed career data", error: error.message });
  }
});

// Get all career info (for debugging/admin)
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
