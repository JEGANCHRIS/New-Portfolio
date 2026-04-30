import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    // Personal Info
    name: { type: String, default: "Meshach Christo I" },
    title: {
      type: String,
      default: "Full Stack Developer | MERN Stack | AI Integration",
    },
    email: { type: String, default: "jmchristo.2000@gmail.com" },
    phone: { type: String, default: "+91 7339433206" },
    location: { type: String, default: "Cuddalore, Tamil Nadu 607003" },
    summary: {
      type: String,
      default:
        "Full Stack Developer with hands-on experience building web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Skilled in creating responsive user interfaces, developing backend APIs, and integrating AI-powered features into real-world projects. Comfortable working in agile teams and passionate about writing clean, maintainable code. Currently exploring AI chatbot development using tools like Gemini, OpenAI, and Ollama to build smarter, more interactive applications.",
    },

    // Social Links
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    // Skills
    skills: {
      frontend: [{ name: String, level: Number }],
      backend: [{ name: String, level: Number }],
      databases: [{ name: String, level: Number }],
      tools: [{ name: String, level: Number }],
    },

    // Experience
    experiences: [
      {
        title: String,
        company: String,
        period: String,
        description: [String],
        location: String,
      },
    ],

    // Education
    education: [
      {
        degree: String,
        institution: String,
        period: String,
        gpa: String,
      },
    ],

    // Projects
    projects: [
      {
        title: String,
        techStack: String,
        description: String,
        features: [String],
        githubLink: String,
        liveLink: String,
      },
    ],

    // Stats for charts
    stats: {
      projectsCompleted: { type: Number, default: 15 },
      yearsExperience: { type: Number, default: 3 },
      clients: { type: Number, default: 12 },
      technologies: { type: Number, default: 25 },
    },

    resumeUrl: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Portfolio", portfolioSchema);
