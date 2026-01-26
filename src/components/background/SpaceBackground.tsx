import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: 'far' | 'near';
}

interface Rocket {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
}

interface Comet {
  id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  trailLength: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
}

// Design system colors
const COLORS = {
  deepSpace: '#0f172a',
  deepSpaceLight: '#1e293b',
  starWhite: '#ffffff',
  starBlue: '#3b82f6',
  rocketBody: '#94a3b8',
  rocketWindow: '#3b82f6',
  cometCore: '#ffffff',
  cometAmber: '#f59e0b',
  cometOrange: '#ea580c',
  exhaustGlow: '#f59e0b',
};

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const animationRef = useRef<number | undefined>(undefined);
  const scrollRef = useRef(0);

  // State refs for animation loop
  const starsRef = useRef<Star[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const cometsRef = useRef<Comet[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastRocketSpawnRef = useRef(0);
  const lastCometSpawnRef = useRef(0);
  const lastShootingStarRef = useRef(0);

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];

    // Far stars (tiny, static-ish)
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 1,
        opacity: 0.3 + Math.random() * 0.3,
        twinkleSpeed: 0,
        twinklePhase: 0,
        layer: 'far',
      });
    }

    // Near stars (bigger, twinkle)
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 1.5,
        opacity: 0.6 + Math.random() * 0.4,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 'near',
      });
    }

    starsRef.current = stars;
  }, []);

  // Spawn a new rocket
  const spawnRocket = useCallback((width: number, height: number) => {
    const rocket: Rocket = {
      id: Date.now() + Math.random(),
      x: -50 + Math.random() * (width * 0.3),
      y: height + 50,
      size: 20 + Math.random() * 16,
      speed: 0.3 + Math.random() * 0.2,
      angle: -55 - Math.random() * 20, // -55 to -75 degrees (up and right)
    };
    rocketsRef.current.push(rocket);
  }, []);

  // Spawn a new comet
  const spawnComet = useCallback((_width: number, height: number) => {
    const comet: Comet = {
      id: Date.now() + Math.random(),
      x: -100,
      y: 50 + Math.random() * (height * 0.5),
      speed: 0.8 + Math.random() * 0.4,
      angle: -5 - Math.random() * 10, // Slight downward angle
      trailLength: 150 + Math.random() * 100,
    };
    cometsRef.current.push(comet);
  }, []);

  // Spawn a shooting star
  const spawnShootingStar = useCallback((width: number, height: number) => {
    const shootingStar: ShootingStar = {
      id: Date.now() + Math.random(),
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      length: 80 + Math.random() * 60,
      speed: 15 + Math.random() * 10,
      angle: 15 + Math.random() * 30, // Downward right
      opacity: 1,
      life: 1,
    };
    shootingStarsRef.current.push(shootingStar);
  }, []);

  // Draw a minimal rocket
  const drawRocket = useCallback((ctx: CanvasRenderingContext2D, rocket: Rocket, scrollOffset: number) => {
    const { x, y, size, angle } = rocket;
    const adjustedY = y - scrollOffset * 0.3;

    ctx.save();
    ctx.translate(x, adjustedY);
    ctx.rotate((angle * Math.PI) / 180);

    const scale = size / 24;
    ctx.scale(scale, scale);

    // Exhaust glow (subtle amber)
    const exhaustGradient = ctx.createRadialGradient(0, 14, 0, 0, 14, 8);
    exhaustGradient.addColorStop(0, 'rgba(249, 115, 22, 0.6)');
    exhaustGradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.2)');
    exhaustGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = exhaustGradient;
    ctx.beginPath();
    ctx.ellipse(0, 16, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rocket body (minimal silhouette)
    ctx.fillStyle = COLORS.rocketBody;
    ctx.beginPath();
    // Nose cone
    ctx.moveTo(0, -12);
    ctx.lineTo(4, -4);
    ctx.lineTo(4, 8);
    // Fins
    ctx.lineTo(6, 12);
    ctx.lineTo(4, 10);
    ctx.lineTo(4, 12);
    ctx.lineTo(-4, 12);
    ctx.lineTo(-4, 10);
    ctx.lineTo(-6, 12);
    ctx.lineTo(-4, 8);
    ctx.lineTo(-4, -4);
    ctx.closePath();
    ctx.fill();

    // Window (glowing dot)
    const windowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 3);
    windowGradient.addColorStop(0, COLORS.rocketWindow);
    windowGradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.5)');
    windowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = windowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  // Draw a comet with warm trail
  const drawComet = useCallback((ctx: CanvasRenderingContext2D, comet: Comet, scrollOffset: number) => {
    const { x, y, angle, trailLength } = comet;
    const adjustedY = y - scrollOffset * 0.3;

    const angleRad = (angle * Math.PI) / 180;
    const tailX = x - Math.cos(angleRad) * trailLength;
    const tailY = adjustedY - Math.sin(angleRad) * trailLength;

    // Trail gradient
    const trailGradient = ctx.createLinearGradient(x, adjustedY, tailX, tailY);
    trailGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    trailGradient.addColorStop(0.1, 'rgba(249, 115, 22, 0.7)');
    trailGradient.addColorStop(0.4, 'rgba(234, 88, 12, 0.4)');
    trailGradient.addColorStop(0.7, 'rgba(234, 88, 12, 0.1)');
    trailGradient.addColorStop(1, 'transparent');

    // Draw trail
    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = trailGradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Wider faint trail
    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.1)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Core glow
    const coreGradient = ctx.createRadialGradient(x, adjustedY, 0, x, adjustedY, 8);
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    coreGradient.addColorStop(0.3, 'rgba(249, 115, 22, 0.8)');
    coreGradient.addColorStop(0.6, 'rgba(249, 115, 22, 0.3)');
    coreGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, adjustedY, 8, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw shooting star
  const drawShootingStar = useCallback((ctx: CanvasRenderingContext2D, star: ShootingStar, scrollOffset: number) => {
    const { x, y, length, angle, opacity } = star;
    const adjustedY = y - scrollOffset * 0.2;

    const angleRad = (angle * Math.PI) / 180;
    const tailX = x - Math.cos(angleRad) * length;
    const tailY = adjustedY + Math.sin(angleRad) * length;

    const gradient = ctx.createLinearGradient(x, adjustedY, tailX, tailY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.2, `rgba(147, 197, 253, ${opacity * 0.8})`);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }, []);

  // Main animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Deep space gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, COLORS.deepSpace);
    bgGradient.addColorStop(1, COLORS.deepSpaceLight);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const scrollOffset = scrollRef.current;

    // Draw stars
    starsRef.current.forEach((star) => {
      const parallaxMultiplier = star.layer === 'far' ? 0.1 : 0.2;
      const adjustedY = star.y - scrollOffset * parallaxMultiplier;

      let opacity = star.opacity;
      if (star.twinkleSpeed > 0 && !prefersReducedMotion) {
        opacity *= 0.7 + 0.3 * Math.sin(time * star.twinkleSpeed * 0.001 + star.twinklePhase);
      }

      // Slight blue tint for some near stars
      const isBlue = star.layer === 'near' && star.twinklePhase > Math.PI;
      const color = isBlue
        ? `rgba(147, 197, 253, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(star.x, adjustedY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      // Spawn rockets
      if (time - lastRocketSpawnRef.current > 20000 + Math.random() * 10000) {
        if (rocketsRef.current.length < 3) {
          spawnRocket(width, height);
          lastRocketSpawnRef.current = time;
        }
      }

      // Spawn comets
      if (time - lastCometSpawnRef.current > 45000 + Math.random() * 30000) {
        if (cometsRef.current.length < 2) {
          spawnComet(width, height);
          lastCometSpawnRef.current = time;
        }
      }

      // Spawn shooting stars
      if (time - lastShootingStarRef.current > 30000 + Math.random() * 30000) {
        spawnShootingStar(width, height);
        lastShootingStarRef.current = time;
      }

      // Update and draw rockets
      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        const angleRad = (rocket.angle * Math.PI) / 180;
        rocket.x += Math.cos(angleRad) * rocket.speed;
        rocket.y += Math.sin(angleRad) * rocket.speed;

        // Remove if off screen
        if (rocket.y < -100 || rocket.x > width + 100) {
          return false;
        }

        drawRocket(ctx, rocket, scrollOffset);
        return true;
      });

      // Update and draw comets
      cometsRef.current = cometsRef.current.filter((comet) => {
        const angleRad = (comet.angle * Math.PI) / 180;
        comet.x += Math.cos(angleRad) * comet.speed;
        comet.y -= Math.sin(angleRad) * comet.speed;

        // Remove if off screen
        if (comet.x > width + 200) {
          return false;
        }

        drawComet(ctx, comet, scrollOffset);
        return true;
      });

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        const angleRad = (star.angle * Math.PI) / 180;
        star.x += Math.cos(angleRad) * star.speed;
        star.y += Math.sin(angleRad) * star.speed;
        star.life -= 0.02;
        star.opacity = star.life;

        if (star.life <= 0) {
          return false;
        }

        drawShootingStar(ctx, star, scrollOffset);
        return true;
      });
    }
  }, [prefersReducedMotion, spawnRocket, spawnComet, spawnShootingStar, drawRocket, drawComet, drawShootingStar]);

  // Setup and animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      initStars(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Handle scroll
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    const loop = (time: number) => {
      if (theme === 'dark') {
        const rect = container.getBoundingClientRect();
        animate(ctx, rect.width, rect.height, time);
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(loop);

    // Initial spawns (delayed)
    setTimeout(() => {
      if (rocketsRef.current.length === 0) {
        const rect = container.getBoundingClientRect();
        spawnRocket(rect.width, rect.height);
      }
    }, 2000);

    setTimeout(() => {
      if (cometsRef.current.length === 0) {
        const rect = container.getBoundingClientRect();
        spawnComet(rect.width, rect.height);
      }
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, initStars, animate, spawnRocket, spawnComet]);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
          setTheme(newTheme || 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Initial theme
    const initialTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    setTheme(initialTheme || 'dark');

    return () => observer.disconnect();
  }, []);

  // Hide in light mode
  if (theme === 'light') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
