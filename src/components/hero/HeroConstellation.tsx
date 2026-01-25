import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
}

interface ConstellationConfig {
  particleCount?: number;
  particleRadius?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  baseSpeed?: number;
}

const DEFAULT_CONFIG: Required<ConstellationConfig> = {
  particleCount: 50,
  particleRadius: 2,
  connectionDistance: 120,
  mouseRadius: 150,
  baseSpeed: 0.3,
};

export default function HeroConstellation(props: ConstellationConfig) {
  const config = { ...DEFAULT_CONFIG, ...props };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * config.baseSpeed,
        vy: (Math.random() - 0.5) * config.baseSpeed,
        radius: config.particleRadius + Math.random() * 1,
        baseX: x,
        baseY: y,
      });
    }
    return particles;
  }, [config.particleCount, config.particleRadius, config.baseSpeed]);

  const drawStaticConstellation = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Static fallback for reduced motion
    ctx.clearRect(0, 0, width, height);
    const particles = particlesRef.current;

    // Draw connections
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[j].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    ctx.fillStyle = 'rgba(37, 99, 235, 0.6)';
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [config.connectionDistance]);

  const animate = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Update and draw particles
    for (const particle of particles) {
      // Mouse interaction
      if (mouse) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius) {
          const force = (config.mouseRadius - distance) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          // Gentle attraction toward mouse
          particle.vx += Math.cos(angle) * force * 0.02;
          particle.vy += Math.sin(angle) * force * 0.02;
        }
      }

      // Return to base position (soft spring)
      const springForce = 0.001;
      particle.vx += (particle.baseX - particle.x) * springForce;
      particle.vy += (particle.baseY - particle.y) * springForce;

      // Apply friction
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity = 1 - distance / config.connectionDistance;
          ctx.strokeStyle = `rgba(37, 99, 235, ${opacity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const particle of particles) {
      // Particle glow based on velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      const glowOpacity = Math.min(0.8, 0.4 + speed * 2);

      ctx.fillStyle = `rgba(37, 99, 235, ${glowOpacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  }, [config.connectionDistance, config.mouseRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Reinitialize particles on resize
      particlesRef.current = initParticles(rect.width, rect.height);

      if (prefersReducedMotion) {
        drawStaticConstellation(ctx, rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    if (!prefersReducedMotion) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);

      const rect = canvas.getBoundingClientRect();
      animate(ctx, rect.width, rect.height);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion, initParticles, animate, drawStaticConstellation]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 pointer-events-auto"
      aria-hidden="true"
      role="presentation"
    />
  );
}
