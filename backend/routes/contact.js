import express from "express";
import Contact from "../models/Contact.js";
import rateLimit from "express-rate-limit";
import auth from "../middleware/auth.js";

const router = express.Router();

// Rate limiting for contact form
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});

// Submit contact form
router.post("/submit", limiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, subject, and message are required." });
    }

    // Save to database
    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();

    console.log("✅ Contact saved:", contact);

    // Send email notification (optional - non-blocking)
    // Only attempt if EMAIL_PASS is properly configured
    if (
      process.env.EMAIL_PASS &&
      process.env.EMAIL_PASS !== "your-app-specific-password"
    ) {
      sendEmailNotification(email, name, phone, subject, message).catch(
        (err) => {
          console.warn(
            "⚠️ Email notification failed (non-critical):",
            err.message,
          );
        },
      );
    } else {
      console.log(
        "ℹ️ Email notifications disabled - configure EMAIL_PASS in .env to enable",
      );
    }

    res.json({ message: "Message sent successfully", contactId: contact._id });
  } catch (error) {
    console.error("❌ Contact error:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
});

// Email notification function (non-blocking)
async function sendEmailNotification(userEmail, name, phone, subject, message) {
  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.default.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "jmchristo.2000@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: userEmail,
      to: "jmchristo.2000@gmail.com",
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.warn("⚠️ Email sending failed:", error.message);
    throw error; // Re-throw for the caller to handle
  }
}

// Get all contacts (admin only)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a contact (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    console.log("✅ Contact deleted:", contact._id);
    res.json({
      message: "Contact deleted successfully",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("❌ Error deleting contact:", error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

// Mark contact as read (admin only)
router.patch("/:id/read", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact marked as read", contact });
  } catch (error) {
    console.error("❌ Error updating contact:", error);
    res.status(500).json({ message: "Failed to update contact" });
  }
});

export default router;
