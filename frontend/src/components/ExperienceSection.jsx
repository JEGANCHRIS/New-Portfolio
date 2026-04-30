import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Icons from "./Icons";
import "./Timeline.css";

// Experience Section - Dynamic from Database
const ExperienceSection = ({ portfolio }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get experiences from portfolio (database)
  const experiences = portfolio?.experiences || [];

  // If no experiences, don't render
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Work Journey</h2>
          <p className="section-subtitle">
            My professional experience and internships
          </p>
        </motion.div>

        <div className="experience-grid">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="experience-card-modern"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7 }}
              whileHover={{ y: -8 }}
            >
              <div className="card-modern-header">
                <div className="header-left">
                  <div
                    className="icon-badge"
                    style={{
                      background: `linear-gradient(135deg, #add8e6, #fffacd, #ffb6c1)`,
                    }}
                  >
                    <Icons.Briefcase />
                  </div>
                  <div>
                    <h3 className="card-title">{exp.title}</h3>
                    <div className="card-meta">
                      <span className="meta-item">
                        <Icons.Building />
                        {exp.company}
                      </span>
                      <span className="meta-divider">•</span>
                      <span className="meta-item">
                        <Icons.Calendar />
                        {exp.period}
                      </span>
                      {exp.location && (
                        <>
                          <span className="meta-divider">•</span>
                          <span className="meta-item">
                            <Icons.Location />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <ul className="card-description">
                {exp.description &&
                  exp.description.map((item, i) => (
                    <li key={i}>
                      <span className="description-bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
