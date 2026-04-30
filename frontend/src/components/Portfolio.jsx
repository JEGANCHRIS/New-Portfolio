import React, { useState, useEffect } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaLaptopCode,
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaSignOutAlt,
  FaRobot,
  FaDatabase,
  FaCloud,
  FaHandPeace,
  FaProjectDiagram,
  FaFilePdf,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "./Navbar";
import AICareerAssistant from "./AICareerAssistant";
import ExperienceSection from "./ExperienceSection";
import Icons from "./Icons";
import "./ResumePreview.css";
import "./Portfolio.css";
import { apiUrl, assetUrl } from "../config/api";

const Portfolio = ({ isAdmin, onLogout, theme, setTheme }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(apiUrl("/api/portfolio"));
      const data = await response.json();
      console.log("Fetched portfolio data:", data);
      setPortfolio(data);
      setEditData(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const handleSave = async () => {
    console.log("💾 Save button clicked!");
    console.log("💾 editData to save:", editData);

    try {
      const token = localStorage.getItem("token");
      console.log("💾 Token:", token ? "Present" : "Missing");

      const response = await fetch(apiUrl("/api/portfolio"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      console.log("💾 Response status:", response.status);

      if (response.ok) {
        const updated = await response.json();
        console.log("✅ Saved portfolio:", updated);
        toast.success("✅ Portfolio updated successfully!");
        // Reload fresh data from database
        await fetchPortfolio();
        setEditing(false);
        setTimeout(() => {
          window.location.reload(); // Full reload to refresh all components
        }, 1500);
      } else {
        const error = await response.json();
        console.error("❌ Save failed:", error);
        toast.error("❌ Failed to save: " + error.message);
      }
    } catch (error) {
      console.error("❌ Error saving portfolio:", error);
      toast.error("❌ Error saving portfolio. Please try again.");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl("/api/upload/resume"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        apiUrl("/api/upload/profile-image"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  if (!portfolio) return <div className="loading">Loading...</div>;

  return (
    <div className="portfolio-advanced">
      {/* Navbar with Theme Toggle - Fixed at Top */}
      <Navbar
        onLogout={onLogout}
        userRole={isAdmin ? "admin" : null}
        theme={theme}
        setTheme={setTheme}
        onNavigate={() => {
          if (editing) {
            setEditing(false); // Exit edit mode when navigating to portfolio
          }
        }}
      />

      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* Admin Controls */}
      {isAdmin && !editing && (
        <div className="floating-admin-controls-advanced">
          <button
            onClick={() => setEditing(true)}
            className="floating-edit-btn-advanced"
          >
            <FaEdit /> Edit Portfolio
          </button>
          <label className="floating-upload-btn-advanced">
            <FaUpload /> Upload Resume
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      {editing ? (
        <EditPortfolioForm
          editData={editData}
          setEditData={setEditData}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          {/* Hero Section - Fixed Background */}
          <section className="hero-section-advanced">
            <div className="hero-bg-gradient"></div>

            {/* Geometric Decorative Shapes */}
            <div className="hero-geometric-shapes">
              {/* Floating 3D Spheres */}
              <div className="geometric-sphere"></div>
              <div className="geometric-sphere"></div>
              <div className="geometric-sphere"></div>
              <div className="geometric-sphere"></div>
              <div className="geometric-sphere"></div>

              {/* Additional Floating 3D Spheres */}
              <div className="geometric-sphere geometric-sphere-6"></div>
              <div className="geometric-sphere geometric-sphere-7"></div>
              <div className="geometric-sphere geometric-sphere-8"></div>
              <div className="geometric-sphere geometric-sphere-9"></div>
              <div className="geometric-sphere geometric-sphere-10"></div>

              {/* Decorative Circles */}
              <div className="decorative-circle"></div>
              <div className="decorative-circle"></div>
              <div className="decorative-circle"></div>

              {/* Decorative Dots Grid */}
              <div className="decorative-dots decorative-dots-1">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="decorative-dots decorative-dots-2">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              {/* Decorative Dashed Lines */}
              <div className="decorative-dash decorative-dash-1"></div>
              <div className="decorative-dash decorative-dash-2"></div>

              {/* Ambient Glow Orbs */}
              <div className="ambient-orb ambient-orb-1"></div>
              <div className="ambient-orb ambient-orb-2"></div>
              <div className="ambient-orb ambient-orb-3"></div>

              {/* Floating Particles */}
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>

              {/* Floating Geometric Polygons */}
              <div className="floating-polygon floating-polygon-1"></div>
              <div className="floating-polygon floating-polygon-2"></div>
              <div className="floating-polygon floating-polygon-3"></div>

              {/* Sparkle Effects */}
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </div>

            <div className="container">
              <motion.div
                className="hero-content-advanced"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="hero-avatar-advanced"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="avatar-circle-advanced">
                    <span>MC</span>
                  </div>
                </motion.div>

                <motion.h1
                  className="hero-name-advanced"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {portfolio.name}
                </motion.h1>

                <motion.p
                  className="hero-title-advanced"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {portfolio.title}
                </motion.p>

                <motion.div
                  className="hero-info-grid-advanced"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="info-item-advanced">
                    <FaEnvelope />
                    <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
                  </div>
                  <div className="info-item-advanced">
                    <FaPhone />
                    <a href={`tel:${portfolio.phone}`}>{portfolio.phone}</a>
                  </div>
                  <div className="info-item-advanced">
                    <FaMapMarkerAlt />
                    <span>{portfolio.location}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="hero-social-advanced"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <a
                    href={portfolio.socialLinks?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-advanced"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={portfolio.socialLinks?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-advanced"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={portfolio.socialLinks?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-advanced"
                  >
                    <FaTwitter />
                  </a>
                </motion.div>

                {portfolio.resumeUrl && (
                  <>
                    <motion.button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            assetUrl(portfolio.resumeUrl),
                          );
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `${portfolio.name?.replace(/\s+/g, "_") || "Resume"}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                          toast.success("Resume downloaded successfully!");
                        } catch (error) {
                          console.error("Download error:", error);
                          toast.error("Failed to download resume");
                        }
                      }}
                      className="resume-btn-advanced"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload /> Download Resume
                    </motion.button>
                  </>
                )}
              </motion.div>
            </div>
          </section>

          {/* Rest of your sections remain the same */}
          <AboutSection
            portfolio={portfolio}
            isAdmin={isAdmin}
            onProfileImageUpload={handleProfileImageUpload}
          />
          <SkillsSection portfolio={portfolio} />
          <ExperienceSection portfolio={portfolio} />
          <ProjectsSection portfolio={portfolio} />
          <EducationSection portfolio={portfolio} />
          <TrainingSection />

          {/* Resume Preview Section - For All Users (Admin & Guest) */}
          {portfolio.resumeUrl && (
            <section className="resume-preview-section-advanced">
              <div className="container">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="resume-preview-header">
                    <div className="preview-title">
                      <FaFilePdf className="preview-icon" />
                      <h2>My Resume</h2>
                    </div>
                    <div className="preview-actions">
                      <a
                        href={assetUrl(portfolio.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-btn"
                      >
                        <FaExternalLinkAlt /> View Full Screen
                      </a>
                      <a
                        href={assetUrl(portfolio.resumeUrl)}
                        download
                        className="download-btn"
                      >
                        <FaDownload /> Download PDF
                      </a>
                    </div>
                  </div>

                  <div className="resume-preview-wrapper">
                    <div className="resume-preview-container-large">
                      <iframe
                        src={`${assetUrl(portfolio.resumeUrl)}#toolbar=0&navpanes=0&scrollbar=0`}
                        title="Resume Preview"
                        className="resume-preview-iframe-large"
                      />
                    </div>
                  </div>

                  <div className="preview-hint">
                    <FaInfoCircle />
                    <span>
                      Scroll through the preview or use the full screen button
                      for a better viewing experience
                    </span>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          <ContactForm />

          {/* AI Career Assistant - Floating Chat Widget */}
          <AICareerAssistant />
        </>
      )}
    </div>
  );
};

// About Section Component - Modern Split Design
const AboutSection = ({ portfolio, isAdmin, onProfileImageUpload }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // SVG Icons components
  const RocketIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stat-svg-icon"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );

  const BriefcaseIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stat-svg-icon"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  const StarIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stat-svg-icon"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const ToolsIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stat-svg-icon"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  const CodeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="badge-svg-icon"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  const PaletteIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="badge-svg-icon"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8.83" y2="8.83" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );

  const BrainIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="badge-svg-icon"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );

  const stats = [
    { number: "1+", label: "Years Experience", icon: RocketIcon },
    { number: "6+", label: "Projects Completed", icon: BriefcaseIcon },
    { number: "4+", label: "Happy Clients", icon: StarIcon },
    { number: "25+", label: "Technologies", icon: ToolsIcon },
  ];

  return (
    <section id="about" className="about-section-advanced" ref={ref}>
      <div className="container">
        <motion.div
          className="about-wrapper-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side - Avatar/Image */}
          <motion.div
            className="about-visual-advanced"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="about-avatar-frame-advanced">
              <div className="about-avatar-advanced">
                {portfolio.profileImage ? (
                  <img
                    src={assetUrl(portfolio.profileImage)}
                    alt={portfolio.name}
                    className="avatar-image"
                  />
                ) : (
                  <span>MC</span>
                )}

                {/* Edit Button - Only visible for admin */}
                {isAdmin && (
                  <label
                    className="avatar-edit-btn-advanced"
                    title="Change Profile Image"
                  >
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={onProfileImageUpload}
                      hidden
                    />
                  </label>
                )}
              </div>
              <div className="about-avatar-glow-advanced"></div>
            </div>

            {/* Floating badges */}
            <div className="about-badge-floating-advanced badge-1">
              <CodeIcon /> Developer
            </div>
            <div className="about-badge-floating-advanced badge-2">
              <PaletteIcon /> Designer
            </div>
            <div className="about-badge-floating-advanced badge-3">
              <BrainIcon /> AI Enthusiast
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="about-content-advanced"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h2 className="about-title-advanced">
              <span className="title-accent-advanced">About</span> Me
            </h2>

            <p className="about-description-advanced">{portfolio.summary}</p>

            {/* Stats Grid */}
            <div className="about-stats-grid-advanced">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="about-stat-item-advanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className="stat-icon-advanced">
                      <StatIcon />
                    </div>
                    <div className="stat-number-advanced">{stat.number}</div>
                    <div className="stat-label-advanced">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.a
              href="#contact"
              className="about-cta-advanced"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Let's Work Together
              <span className="cta-arrow-advanced">→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Skills Section Component
const SkillsSection = ({ portfolio }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get skills from portfolio (database)
  const skillsData = portfolio
    ? [
        {
          category: "Frontend Development",
          icon: <FaLaptopCode />,
          skills: portfolio.skills?.frontend?.map((s) => s.name) || [],
        },
        {
          category: "Backend Development",
          icon: <FaCode />,
          skills: portfolio.skills?.backend?.map((s) => s.name) || [],
        },
        {
          category: "Databases",
          icon: <FaDatabase />,
          skills: portfolio.skills?.databases?.map((s) => s.name) || [],
        },
        {
          category: "AI & Tools",
          icon: <FaRobot />,
          skills: portfolio.skills?.tools?.map((s) => s.name) || [],
        },
      ]
    : [];

  return (
    <section id="skills" className="skills-section-advanced" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Technical Arsenal
        </motion.h2>
        <div className="skills-grid-advanced">
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-category-advanced"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <h3>
                {skill.icon} {skill.category}
              </h3>
              <div className="skill-tags-advanced">
                {skill.skills.map((s, i) => (
                  <motion.span
                    key={i}
                    className="skill-tag-advanced"
                    whileHover={{ scale: 1.05 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Projects Section Component
const ProjectsSection = ({ portfolio }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get projects from portfolio (database) or use original hardcoded projects
  const projects =
    portfolio?.projects && portfolio.projects.length > 0
      ? portfolio.projects.map((proj) => ({
          iconType: "document",
          title: proj.title,
          tech: proj.techStack,
          desc: proj.description,
          github: proj.githubLink,
          live: proj.liveLink,
        }))
      : [
          {
            iconType: "document",
            title: "Blog Site",
            tech: "React.js • Node.js • MongoDB • Express.js",
            desc: "Full-featured blogging platform with user authentication and role-based management.",
          },
          {
            iconType: "database",
            title: "Dairy Management System",
            tech: "MERN • Ollama 3.2 • AI/ML",
            desc: "AI-powered admin module with RAG implementation and role-based access control.",
          },
          {
            iconType: "bike",
            title: "Bike Rental System",
            tech: "PHP • MySQL",
            desc: "Online rental management with booking and availability tracking.",
          },
          {
            iconType: "road",
            title: "Online Toll Booking",
            tech: "PHP • MySQL",
            desc: "Toll booking portal enabling pre-booking of passes.",
          },
          {
            iconType: "pet",
            title: "Pet Shop Website",
            tech: "HTML • CSS • Bootstrap • JavaScript",
            desc: "Responsive e-commerce style website with product listings.",
          },
        ];

  return (
    <section id="projects" className="projects-section-advanced" ref={ref}>
      <div className="container">
        {/* Night mode shooting stars */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>

        <motion.h2
          className="section-title-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>
        <div className="projects-grid-advanced">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card-advanced"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="card-glow"></div>
              <div className="project-icon-advanced">
                {project.iconType === "document" && <Icons.Document />}
                {project.iconType === "database" && <Icons.Database />}
                {project.iconType === "bike" && <Icons.Bike />}
                {project.iconType === "road" && <Icons.Road />}
                {project.iconType === "pet" && <Icons.Paw />}
              </div>
              <h3>{project.title}</h3>
              <p className="tech-advanced">{project.tech}</p>
              <p>{project.desc}</p>
              <a
                href={project.link}
                className="project-link-advanced"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project <span>→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Education Section Component
const EducationSection = ({ portfolio }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get education from portfolio (database)
  const education = portfolio?.education || [];

  return (
    <section id="education" className="education-section-advanced" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Education
        </motion.h2>
        <div className="education-grid-advanced">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="education-card-advanced"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <FaGraduationCap className="edu-icon-advanced" />
              <h3>{edu.degree}</h3>
              <p className="institution-advanced">{edu.institution}</p>
              <p className="period-advanced">
                {edu.period} {edu.gpa && `| GPA: ${edu.gpa}`}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Training Section Component
const TrainingSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="training-section-advanced" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Certifications & Training
        </motion.h2>
        <div className="training-grid-advanced">
          <motion.div
            className="training-card-advanced"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            <h3>Web Development</h3>
            <p>Next Gen Solutions, Cuddalore | 2024</p>
            <p className="training-desc-advanced">
              Hands-on course covering HTML, CSS, Bootstrap, and JavaScript.
            </p>
          </motion.div>
          <motion.div
            className="training-card-advanced"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            <h3>Python, Data Science & Machine Learning</h3>
            <p>Besant Technologies, Chennai | Apr 2023 – Dec 2023</p>
            <p className="training-desc-advanced">
              Intensive training in Python, Data Science, and Machine Learning.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine countryCode and phone for submission
      const submissionData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        phone: formData.countryCode + " " + formData.phone,
      };

      const response = await fetch(apiUrl("/api/contact/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          countryCode: "+1",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          result.message || "Failed to send message. Please try again.",
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section-advanced" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>
        <motion.div
          className="contact-wrapper-advanced"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="contact-form-advanced">
            <div className="form-row-advanced">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="phone-input-wrapper">
              <select
                value={formData.countryCode}
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
                className="country-code-select"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+27">🇿🇦 +27</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+31">🇳🇱 +31</option>
                <option value="+46">🇸🇪 +46</option>
                <option value="+41">🇨🇭 +41</option>
              </select>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
            <motion.button
              type="submit"
              className="submit-btn-advanced"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// Edit Portfolio Form Component
const EditPortfolioForm = ({ editData, setEditData, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaUser },
    { id: "skills", label: "Skills", icon: FaCode },
    { id: "experience", label: "Experience", icon: FaBriefcase },
    { id: "education", label: "Education", icon: FaGraduationCap },
    { id: "projects", label: "Projects", icon: FaProjectDiagram },
  ];

  // Debug logging
  console.log("EditPortfolioForm - editData:", editData);

  // Initialize data synchronously with proper defaults
  const currentData = editData
    ? {
        ...editData,
        skills: {
          frontend: editData.skills?.frontend || [],
          backend: editData.skills?.backend || [],
          databases: editData.skills?.databases || [],
          tools: editData.skills?.tools || [],
        },
        experiences: editData.experiences || [],
        education: editData.education || [],
        projects: editData.projects || [],
      }
    : null;

  console.log("EditPortfolioForm - currentData.skills:", currentData?.skills);
  console.log(
    "EditPortfolioForm - currentData.experiences:",
    currentData?.experiences,
  );
  console.log(
    "EditPortfolioForm - currentData.education:",
    currentData?.education,
  );
  console.log(
    "EditPortfolioForm - currentData.projects:",
    currentData?.projects,
  );

  // Handle Profile Image Upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        apiUrl("/api/upload/profile-image"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const data = await response.json();
        setEditData({ ...editData, profileImage: data.profileImage });
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const addSkill = (category) => {
    const newSkill = { name: "", level: 50 };
    const currentSkills = currentData.skills?.[category] || [];
    const newData = {
      ...currentData,
      skills: {
        ...currentData.skills,
        [category]: [...currentSkills, newSkill],
      },
    };
    setEditData(newData);
  };

  const updateSkill = (category, index, field, value) => {
    const currentSkills = currentData.skills?.[category] || [];
    const updated = currentSkills.map((skill, i) =>
      i === index ? { ...skill, [field]: value } : skill,
    );
    const newData = {
      ...currentData,
      skills: { ...currentData.skills, [category]: updated },
    };
    setEditData(newData);
  };

  const removeSkill = (category, index) => {
    confirmAlert({
      title: "Remove Skill",
      message: "Are you sure you want to remove this skill?",
      buttons: [
        {
          label: "Yes, Remove",
          onClick: () => {
            const currentSkills = currentData.skills?.[category] || [];
            const updated = currentSkills.filter((_, i) => i !== index);
            const newData = {
              ...currentData,
              skills: { ...currentData.skills, [category]: updated },
            };
            setEditData(newData);
            toast.success("Skill removed successfully!");
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const addExperience = () => {
    const newExp = {
      title: "",
      company: "",
      period: "",
      location: "",
      description: [""],
    };
    const newData = {
      ...currentData,
      experiences: [...(currentData.experiences || []), newExp],
    };
    setEditData(newData);

    // Scroll to the new experience after render
    setTimeout(() => {
      const experienceCards = document.querySelectorAll(".edit-item-card");
      const lastCard = experienceCards[experienceCards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
        lastCard.style.animation = "slideIn 0.5s ease";
      }
    }, 100);
  };

  const updateExperience = (index, field, value) => {
    const updated = (currentData.experiences || []).map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp,
    );
    const newData = { ...currentData, experiences: updated };
    setEditData(newData);
  };

  const removeExperience = (index) => {
    confirmAlert({
      title: "Remove Experience",
      message: "Are you sure you want to remove this experience?",
      buttons: [
        {
          label: "Yes, Remove",
          onClick: () => {
            const updated = (currentData.experiences || []).filter(
              (_, i) => i !== index,
            );
            const newData = { ...currentData, experiences: updated };
            setEditData(newData);
            toast.success("Experience removed successfully!");
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const addEducation = () => {
    const newEdu = { degree: "", institution: "", period: "", gpa: "" };
    const newData = {
      ...currentData,
      education: [...(currentData.education || []), newEdu],
    };
    setEditData(newData);

    // Scroll to the new education after render
    setTimeout(() => {
      const educationCards = document.querySelectorAll(
        ".education-edit-section .edit-item-card",
      );
      const lastCard = educationCards[educationCards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
        lastCard.style.animation = "slideIn 0.5s ease";
      }
    }, 100);
  };

  const updateEducation = (index, field, value) => {
    const updated = (currentData.education || []).map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu,
    );
    const newData = { ...currentData, education: updated };
    setEditData(newData);
  };

  const removeEducation = (index) => {
    confirmAlert({
      title: "Remove Education",
      message: "Are you sure you want to remove this education?",
      buttons: [
        {
          label: "Yes, Remove",
          onClick: () => {
            const updated = (currentData.education || []).filter(
              (_, i) => i !== index,
            );
            const newData = { ...currentData, education: updated };
            setEditData(newData);
            toast.success("Education removed successfully!");
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const addProject = () => {
    const newProj = {
      title: "",
      techStack: "",
      description: "",
      features: [""],
      githubLink: "",
      liveLink: "",
    };
    const newData = {
      ...currentData,
      projects: [...(currentData.projects || []), newProj],
    };
    setEditData(newData);

    // Scroll to the new project after render
    setTimeout(() => {
      const projectCards = document.querySelectorAll(
        ".projects-edit-section .edit-item-card",
      );
      const lastCard = projectCards[projectCards.length - 1];
      if (lastCard) {
        lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
        lastCard.style.animation = "slideIn 0.5s ease";
      }
    }, 100);
  };

  const updateProject = (index, field, value) => {
    const updated = (currentData.projects || []).map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj,
    );
    const newData = { ...currentData, projects: updated };
    setEditData(newData);
  };

  const removeProject = (index) => {
    confirmAlert({
      title: "Remove Project",
      message: "Are you sure you want to remove this project?",
      buttons: [
        {
          label: "Yes, Remove",
          onClick: () => {
            const updated = (currentData.projects || []).filter(
              (_, i) => i !== index,
            );
            const newData = { ...currentData, projects: updated };
            setEditData(newData);
            toast.success("Project removed successfully!");
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="edit-portfolio-container-advanced">
      <div className="container">
        <div className="edit-header-advanced">
          <h2>
            <FaEdit /> Edit Portfolio
          </h2>
          <button onClick={onCancel} className="close-edit-btn-advanced">
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="edit-tabs-advanced">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`edit-tab-advanced ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="edit-content-advanced">
          {activeTab === "basic" && (
            <div className="edit-form-grid-advanced">
              <div className="form-group-advanced full-width">
                <label>Profile Image</label>
                <div className="profile-image-upload-advanced">
                  {editData.profileImage && (
                    <div className="profile-image-preview-advanced">
                      <img
                        src={assetUrl(editData.profileImage)}
                        alt="Profile Preview"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleProfileImageUpload}
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="upload-btn-advanced"
                  >
                    <FaUpload /> Choose Profile Image (JPG/PNG)
                  </label>
                  {editData.profileImage && (
                    <button
                      className="remove-image-btn-advanced"
                      onClick={() =>
                        setEditData({ ...editData, profileImage: null })
                      }
                    >
                      <FaTimes /> Remove Image
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group-advanced">
                <label>Name</label>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced full-width">
                <label>Summary</label>
                <textarea
                  rows="5"
                  value={editData.summary || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, summary: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced">
                <label>Email</label>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced">
                <label>Phone</label>
                <input
                  type="text"
                  value={editData.phone || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced">
                <label>Location</label>
                <input
                  type="text"
                  value={editData.location || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                />
              </div>
              <div className="form-group-advanced full-width">
                <label>Resume URL</label>
                <input
                  type="text"
                  value={editData.resumeUrl || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, resumeUrl: e.target.value })
                  }
                  placeholder="/uploads/resume_123456.pdf"
                />
                <small>Paste the upload path here after uploading resume</small>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="skills-edit-section">
              {["frontend", "backend", "databases", "tools"].map((category) => (
                <div key={category} className="skill-category-edit">
                  <div className="category-header">
                    <h3>
                      {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                      Skills
                    </h3>
                    <button
                      onClick={() => addSkill(category)}
                      className="add-btn"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="skills-list">
                    {(currentData.skills?.[category] || []).map(
                      (skill, index) => (
                        <div key={index} className="skill-item">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              updateSkill(
                                category,
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Skill name"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) =>
                              updateSkill(
                                category,
                                index,
                                "level",
                                parseInt(e.target.value),
                              )
                            }
                          />
                          <span>{skill.level}%</span>
                          <button
                            onClick={() => removeSkill(category, index)}
                            className="remove-btn"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "experience" && (
            <div className="experience-edit-section">
              <button onClick={addExperience} className="add-item-btn">
                + Add Experience
              </button>
              {currentData.experiences?.map((exp, index) => (
                <div key={index} className="edit-item-card">
                  <div className="item-header">
                    <h3>Experience #{index + 1}</h3>
                    <button
                      onClick={() => removeExperience(index)}
                      className="remove-btn-sm"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="form-group-advanced">
                    <label>Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group-advanced">
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-row-advanced">
                    <div className="form-group-advanced">
                      <label>Period</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) =>
                          updateExperience(index, "period", e.target.value)
                        }
                        placeholder="Jan 2024 - Present"
                      />
                    </div>
                    <div className="form-group-advanced">
                      <label>Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(index, "location", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group-advanced full-width">
                    <label>Description (one per line)</label>
                    <textarea
                      rows="4"
                      value={exp.description.join("\n")}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "description",
                          e.target.value.split("\n"),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "education" && (
            <div className="education-edit-section">
              <button onClick={addEducation} className="add-item-btn">
                + Add Education
              </button>
              {currentData.education?.map((edu, index) => (
                <div key={index} className="edit-item-card">
                  <div className="item-header">
                    <h3>Education #{index + 1}</h3>
                    <button
                      onClick={() => removeEducation(index)}
                      className="remove-btn-sm"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="form-group-advanced">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group-advanced">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-row-advanced">
                    <div className="form-group-advanced">
                      <label>Period</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) =>
                          updateEducation(index, "period", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group-advanced">
                      <label>GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(index, "gpa", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="projects-edit-section">
              <button onClick={addProject} className="add-item-btn">
                + Add Project
              </button>
              {currentData.projects?.map((proj, index) => (
                <div key={index} className="edit-item-card">
                  <div className="item-header">
                    <h3>Project #{index + 1}</h3>
                    <button
                      onClick={() => removeProject(index)}
                      className="remove-btn-sm"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="form-group-advanced">
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) =>
                        updateProject(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group-advanced">
                    <label>Tech Stack</label>
                    <input
                      type="text"
                      value={proj.techStack}
                      onChange={(e) =>
                        updateProject(index, "techStack", e.target.value)
                      }
                      placeholder="React.js • Node.js • MongoDB"
                    />
                  </div>
                  <div className="form-group-advanced full-width">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group-advanced full-width">
                    <label>Features (one per line)</label>
                    <textarea
                      rows="4"
                      value={proj.features.join("\n")}
                      onChange={(e) =>
                        updateProject(
                          index,
                          "features",
                          e.target.value.split("\n"),
                        )
                      }
                    />
                  </div>
                  <div className="form-row-advanced">
                    <div className="form-group-advanced">
                      <label>GitHub Link</label>
                      <input
                        type="url"
                        value={proj.githubLink}
                        onChange={(e) =>
                          updateProject(index, "githubLink", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group-advanced">
                      <label>Live Link</label>
                      <input
                        type="url"
                        value={proj.liveLink}
                        onChange={(e) =>
                          updateProject(index, "liveLink", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="edit-actions-advanced">
            <button
              onClick={() => {
                console.log("🔘 Save button clicked!");
                console.log("📦 editData:", editData);
                onSave();
              }}
              className="save-btn-advanced"
            >
              <FaSave /> Save All Changes
            </button>
            <button onClick={onCancel} className="cancel-btn-advanced">
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
