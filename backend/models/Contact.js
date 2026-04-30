import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["read", "unread"], default: "unread" },
  },
  { timestamps: true },
);

export default mongoose.model("Contact", contactSchema);
