import React, { useState, useEffect, useRef } from "react";
import {
  FaCode,
  FaUserAstronaut,
  FaRocket,
  FaShieldAlt,
  FaArrowRight,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaBrain,
  FaDatabase,
  FaCloud,
  FaServer,
  FaMobileAlt,
  FaHandPeace,
  FaBolt,
  FaPalette,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import "./LandingPage.css";
import { apiUrl } from "../config/api";

const LandingPage = ({
  onAdminLogin,
  onGuestAccess,
  setIsHovering,
  theme,
  setTheme,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Mouse follow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onAdminLogin(data.token, data.user);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { number: "6+", label: "Projects Completed" },
    { number: "1+", label: "Years Experience" },
    { number: "4+", label: "Happy Clients" },
    { number: "25+", label: "Technologies" },
  ];

  return (
    <div className="landing-page-advanced">
      {/* Particle Background */}
      <ParticleBackground />

      {/* 3D Floating Elements */}
      <div className="floating-elements">
        <div
          className="floating-element"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        >
          <FaCode />
        </div>
        <div
          className="floating-element"
          style={{ top: "70%", left: "85%", animationDelay: "2s" }}
        >
          <FaBrain />
        </div>
        <div
          className="floating-element"
          style={{ top: "40%", left: "90%", animationDelay: "1s" }}
        >
          <FaRocket />
        </div>
        <div
          className="floating-element"
          style={{ top: "80%", left: "15%", animationDelay: "1.5s" }}
        >
          <FaServer />
        </div>
        <div
          className="floating-element"
          style={{ top: "15%", left: "85%", animationDelay: "0.5s" }}
        >
          <FaPalette />
        </div>
      </div>

      {/* Navigation */}
      <nav className="landing-nav-advanced">
        <div className="nav-container-advanced">
          <motion.div
            className="logo-advanced"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCode className="logo-icon-advanced" />
            <span className="logo-text-advanced">Meshach.dev</span>
          </motion.div>
          <div className="nav-right-advanced">
            <div className="nav-links-advanced">
              <motion.a href="#features" whileHover={{ y: -2 }}>
                Features
              </motion.a>
              <motion.a href="#skills" whileHover={{ y: -2 }}>
                Skills
              </motion.a>
              <motion.a href="#stats" whileHover={{ y: -2 }}>
                Stats
              </motion.a>
            </div>
            {/* Theme Selector */}
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Tilt */}
      <div
        className="hero-section-advanced"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        {/* Geometric Background */}
        <div className="hero-bg-gradient"></div>

        {/* Geometric Decorative Shapes */}
        <div className="hero-geometric-shapes">
          {/* Floating 3D Spheres - Original 5 */}
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

        <motion.div
          className="hero-content-advanced"
          style={{
            transform: useTransform(
              springX,
              (x) =>
                `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-springY.get() * 10}deg)`,
            ),
          }}
        >
          <motion.div
            className="hero-badge-advanced"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FaUserAstronaut />
            <span>Portfolio 2026</span>
          </motion.div>

          <motion.h1
            className="hero-title-advanced"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Crafting Digital
            <span className="gradient-text-advanced"> Experiences</span>
          </motion.h1>

          <motion.p
            className="hero-description-advanced"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Full Stack Developer specializing in MERN Stack and AI Integration.
            I build scalable, cutting-edge web applications that push
            boundaries.
          </motion.p>

          <motion.div
            className="access-options-advanced"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="access-card-advanced guest-card-advanced"
              onClick={onGuestAccess}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="card-glow"></div>
              <div className="card-icon-advanced">
                <FaHandPeace />
              </div>
              <h3>Continue as Guest</h3>
              <p>
                Explore my portfolio, projects, and download resume instantly
              </p>
              <span className="card-link-advanced">
                View Portfolio <FaArrowRight />
              </span>
            </motion.button>

            <motion.button
              className="access-card-advanced admin-card-advanced"
              onClick={() => setShowLogin(true)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="card-glow"></div>
              <div className="card-icon-advanced">
                <FaShieldAlt />
              </div>
              <h3>Admin Access</h3>
              <p>Login to manage content and control portfolio settings</p>
              <span className="card-link-advanced">
                Login as Admin <FaArrowRight />
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="stats-section-advanced">
        <div className="container">
          <motion.div
            className="stats-grid-advanced"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card-advanced"
                whileHover={{ scale: 1.05, y: -5 }}
                custom={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-number-advanced">{stat.number}</div>
                <div className="stat-label-advanced">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="features-section-advanced">
        <div className="container">
          <motion.h2
            className="section-title-advanced"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Makes This Special
          </motion.h2>
          <div className="features-grid-advanced">
            {[
              {
                icon: <FaRocket />,
                title: "Full-Stack Excellence",
                desc: "MERN stack applications with modern architecture",
              },
              {
                icon: <FaBrain />,
                title: "AI Integration",
                desc: "LLM integration, RAG implementation, intelligent systems",
              },
              {
                icon: <FaBolt />,
                title: "Performance Optimized",
                desc: "Lightning fast load times and smooth animations",
              },
              {
                icon: <FaPalette />,
                title: "Advanced UI/UX",
                desc: "Glassmorphism, 3D effects, micro-interactions",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card-advanced"
                whileHover={{ scale: 1.05, y: -10 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon-advanced">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="feature-shine"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="login-modal-overlay-advanced"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogin(false)}
          >
            <motion.div
              className="login-modal-advanced"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-advanced">
                <h2>Admin Access</h2>
                <button
                  className="close-btn-advanced"
                  onClick={() => setShowLogin(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleLogin}>
                <div className="input-group-advanced">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="casper@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group-advanced">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="error-message-advanced">{error}</div>}
                <motion.button
                  type="submit"
                  className="login-submit-advanced"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Dashboard"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="landing-footer-advanced">
        <div className="container">
          <motion.div
            className="footer-content-advanced"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="footer-social-advanced">
              <motion.a href="#" whileHover={{ y: -3 }}>
                <FaGithub />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -3 }}>
                <FaLinkedin />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -3 }}>
                <FaTwitter />
              </motion.a>
            </div>
            <p>© 2026 Meshach Christo. Built with ❤️ using React & Node.js</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

export default LandingPage;
