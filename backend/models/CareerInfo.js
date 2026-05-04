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
      default: [],
    },
    metadata: {
      tags: [String],
      priority: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("CareerInfo", careerInfoSchema);
