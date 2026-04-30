import mongoose from "mongoose";
import dotenv from "dotenv";
import Portfolio from "./models/Portfolio.js";

dotenv.config();

const seedPortfolioData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
    );
    console.log("✅ MongoDB connected");

    // Find existing portfolio or create new one
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio();
      console.log("Creating new portfolio document...");
    } else {
      console.log("Found existing portfolio document");
    }

    // Update with sample data
    portfolio.skills = {
      frontend: [
        { name: "HTML5/CSS3", level: 90 },
        { name: "JavaScript ES6+", level: 85 },
        { name: "React.js", level: 88 },
        { name: "Bootstrap", level: 82 },
      ],
      backend: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 83 },
        { name: "REST APIs", level: 87 },
        { name: "PHP", level: 75 },
      ],
      databases: [
        { name: "MongoDB", level: 80 },
        { name: "MySQL", level: 78 },
        { name: "Oracle Database", level: 70 },
      ],
      tools: [
        { name: "Gemini API", level: 85 },
        { name: "OpenAI API", level: 83 },
        { name: "Ollama", level: 80 },
        { name: "Git/GitHub", level: 85 },
        { name: "Qwen AI", level: 78 },
        { name: "DEEPSEEK", level: 75 },
        { name: "Co-pilot", level: 82 },
        { name: "Amazon Q", level: 70 },
        { name: "Codex", level: 72 },
        { name: "Antigravity Agent", level: 68 },
        { name: "Claude AI", level: 80 },
      ],
    };

    portfolio.experiences = [
      {
        title: "Full Stack Web Developer Intern",
        company: "Askan Technology Pvt Ltd",
        period: "March 2025 – September 2025",
        location: "Remote",
        description: [
          "Developed and maintained full-stack web applications using React.js, Node.js, and MongoDB",
          "Designed and implemented responsive frontend user interfaces with reusable React components",
          "Built and integrated backend RESTful APIs to support frontend functionality",
          "Participated actively in agile sprints, daily stand-ups, and peer code reviews",
        ],
      },
      {
        title: "MERN Stack Developer Intern",
        company: "Hema's Enterprise Pvt Ltd",
        period: "February 2026 – May 2026",
        location: "Remote",
        description: [
          "Developed AI-integrated web applications using the MERN stack",
          "Built an AI-powered Admin module for a Dairy Management System using Ollama 3.2",
          "Incorporated RAG, NLP, and Machine Learning techniques",
          "Designed and implemented role-based access control system",
          "Collaborated with cross-functional teams to deliver high-quality solutions",
        ],
      },
    ];

    portfolio.education = [
      {
        degree: "Master of Computer Applications (MCA)",
        institution:
          "Christ College of Engineering and Technology, Pondicherry",
        period: "2021 - 2023",
        gpa: "76.76%",
      },
      {
        degree: "Bachelor of Computer Science (B.Sc)",
        institution: "St. Joseph's College, Tiruchirapalli",
        period: "2018 - 2021",
        gpa: "61.71%",
      },
    ];

    portfolio.projects = [
      {
        title: "Blog Site",
        techStack: "React.js • Node.js • MongoDB • Express.js",
        description:
          "Full-featured blogging platform with user authentication and role-based management.",
        features: [
          "User authentication and role-based access",
          "Create, edit, delete blog posts",
          "Comment system with moderation",
          "Responsive design with modern UI",
        ],
        githubLink: "",
        liveLink: "",
      },
      {
        title: "Dairy Management System",
        techStack: "MERN • Ollama 3.2 • AI/ML",
        description:
          "AI-powered admin module with RAG implementation and role-based access control.",
        features: [
          "AI-powered admin module using Ollama 3.2",
          "RAG (Retrieval-Augmented Generation) implementation",
          "Role-based access control system",
          "Real-time data management",
        ],
        githubLink: "",
        liveLink: "",
      },
      {
        title: "Bike Rental System",
        techStack: "PHP • MySQL",
        description:
          "Online rental management with booking and availability tracking.",
        features: [
          "Online bike booking system",
          "Real-time availability tracking",
          "User registration and login",
          "Admin dashboard for management",
        ],
        githubLink: "",
        liveLink: "",
      },
      {
        title: "Online Toll Booking",
        techStack: "PHP • MySQL",
        description: "Toll booking portal enabling pre-booking of passes.",
        features: [
          "Pre-booking toll passes online",
          "Payment integration",
          "Booking history and receipts",
          "Vehicle management",
        ],
        githubLink: "",
        liveLink: "",
      },
      {
        title: "Pet Shop Website",
        techStack: "HTML • CSS • Bootstrap • JavaScript",
        description:
          "Responsive e-commerce style website with product listings.",
        features: [
          "Product catalog with categories",
          "Shopping cart functionality",
          "Responsive design for all devices",
          "Contact and inquiry forms",
        ],
        githubLink: "",
        liveLink: "",
      },
    ];

    await portfolio.save();
    console.log("✅ Portfolio data seeded successfully!");
    console.log("Skills:", portfolio.skills);
    console.log("Experiences:", portfolio.experiences.length);
    console.log("Education:", portfolio.education.length);
    console.log("Projects:", portfolio.projects.length);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedPortfolioData();
