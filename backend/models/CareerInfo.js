import mongoose from "mongoose";

const careerInfoSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["skills", "experience", "education", "projects", "summary", "availability"],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    embedding: {
      type: [Number],
      index: "2048" // MongoDB Atlas Vector Search index dimension for nomic-embed-text
    },
    metadata: {
      tags: [String],
      priority: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

// Create vector search index (for MongoDB Atlas)
careerInfoSchema.index({ embedding: "2048" });

export default mongoose.model("CareerInfo", careerInfoSchema);
