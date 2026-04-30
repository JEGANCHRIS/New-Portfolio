import React, { useEffect, useRef } from 'react';
import './NightSky.css';

const NightSky = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.5 + 0.3,
        currentOpacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: getStarColor()
      };
    };

    const getStarColor = () => {
      const colors = [
        'rgba(255, 255, 255,',
        'rgba(200, 220, 255,',
        'rgba(255, 240, 220,',
        'rgba(220, 240, 255,'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const initializeStars = () => {
      starsRef.current = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 4000);
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push(createStar());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient night sky background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.3, '#0f0c29');
      gradient.addColorStop(0.6, '#302b63');
      gradient.addColorStop(1, '#24243e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate and draw stars
      starsRef.current.forEach((star) => {
        // Twinkle effect using sine wave
        star.twinklePhase += star.twinkleSpeed;
        star.currentOpacity = star.baseOpacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        // Draw star glow
        const glowGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 4
        );
        glowGradient.addColorStop(0, `${star.color}${star.currentOpacity * 0.8})`);
        glowGradient.addColorStop(0.5, `${star.color}${star.currentOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.currentOpacity + 0.3})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw occasional shooting star
      if (Math.random() < 0.001) {
        drawShootingStar(ctx, canvas);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    const drawShootingStar = (ctx, canvas) => {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * (canvas.height / 2);
      const length = Math.random() * 100 + 50;
      const angle = Math.PI / 4;

      const gradient = ctx.createLinearGradient(
        startX, startY,
        startX - length * Math.cos(angle),
        startY + length * Math.sin(angle)
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX - length * Math.cos(angle),
        startY + length * Math.sin(angle)
      );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    resizeCanvas();
    initializeStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initializeStars();
    });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="night-sky-container">
      <canvas ref={canvasRef} className="night-sky-canvas" />
      <div className="night-sky-overlay"></div>
    </div>
  );
};

export default NightSky;
