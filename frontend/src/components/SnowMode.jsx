import React, { useEffect, useRef } from "react";
import "./SnowMode.css";

const SnowMode = () => {
  const canvasRef = useRef(null);
  const snowflakesRef = useRef([]);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflake = () => {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3,
        sway: Math.random() * 2 * Math.PI,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAmplitude: Math.random() * 1 + 0.5,
      };
    };

    const initializeSnowflakes = () => {
      snowflakesRef.current = [];
      for (let i = 0; i < 200; i++) {
        const flake = createSnowflake();
        flake.y = Math.random() * canvas.height;
        snowflakesRef.current.push(flake);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new snowflakes
      if (snowflakesRef.current.length < 250) {
        snowflakesRef.current.push(createSnowflake());
      }

      snowflakesRef.current.forEach((flake, index) => {
        // Update position
        flake.y += flake.speed;
        flake.x += flake.wind;
        flake.sway += flake.swaySpeed;
        flake.x += Math.sin(flake.sway) * flake.swayAmplitude;

        // Remove snowflakes that are off screen
        if (
          flake.y > canvas.height + 10 ||
          flake.x < -10 ||
          flake.x > canvas.width + 10
        ) {
          snowflakesRef.current.splice(index, 1);
          return;
        }

        // Draw snowflake with glow
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 15;
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeSnowflakes();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initializeSnowflakes();
    });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="snow-mode-container">
      <canvas ref={canvasRef} className="snow-canvas" />
      <div className="snow-overlay"></div>
    </div>
  );
};

export default SnowMode;
