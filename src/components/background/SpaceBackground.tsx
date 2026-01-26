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
  color: string;
}

interface Rocket {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number; // Direction of travel (degrees, 0 = right, -90 = up)
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

interface Satellite {
  id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  size: number;
  blinkPhase: number;
}

interface Planet {
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  layer: 'far' | 'mid';
}

// Design system colors
const COLORS = {
  deepSpace: '#0f172a',
  deepSpaceLight: '#1e293b',
  starWhite: '#ffffff',
  starBlue: '#93c5fd',
  starGold: '#fcd34d',
  rocketBody: '#e2e8f0',
  rocketNose: '#ef4444',
  rocketWindow: '#3b82f6',
  cometCore: '#ffffff',
  cometAmber: '#f59e0b',
  cometOrange: '#ea580c',
  exhaustCore: '#fef3c7',
  exhaustMid: '#f97316',
  exhaustOuter: '#dc2626',
  satelliteBody: '#94a3b8',
  planetPurple: '#8b5cf6',
  planetBlue: '#3b82f6',
  planetTeal: '#14b8a6',
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
  const satellitesRef = useRef<Satellite[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const lastRocketSpawnRef = useRef(0);
  const lastCometSpawnRef = useRef(0);
  const lastShootingStarRef = useRef(0);
  const lastSatelliteSpawnRef = useRef(0);

  // Initialize stars with more variety
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];

    // Far stars (tiny, minimal twinkle)
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 0.8,
        opacity: 0.2 + Math.random() * 0.4,
        twinkleSpeed: Math.random() * 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 'far',
        color: COLORS.starWhite,
      });
    }

    // Near stars (bigger, more pronounced twinkle, some colored)
    for (let i = 0; i < 60; i++) {
      const colorRoll = Math.random();
      let color = COLORS.starWhite;
      if (colorRoll > 0.85) color = COLORS.starBlue;
      else if (colorRoll > 0.75) color = COLORS.starGold;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 2,
        opacity: 0.7 + Math.random() * 0.3,
        twinkleSpeed: 1 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 'near',
        color,
      });
    }

    starsRef.current = stars;

    // Initialize distant planets (static, 2-3 visible)
    const planets: Planet[] = [];
    const planetCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < planetCount; i++) {
      const colorRoll = Math.random();
      let color = COLORS.planetPurple;
      let glowColor = 'rgba(139, 92, 246, 0.3)';
      if (colorRoll > 0.66) {
        color = COLORS.planetBlue;
        glowColor = 'rgba(59, 130, 246, 0.3)';
      } else if (colorRoll > 0.33) {
        color = COLORS.planetTeal;
        glowColor = 'rgba(20, 184, 166, 0.3)';
      }

      planets.push({
        x: 100 + Math.random() * (width - 200),
        y: 50 + Math.random() * (height * 0.4),
        size: 8 + Math.random() * 12,
        color,
        glowColor,
        layer: Math.random() > 0.5 ? 'far' : 'mid',
      });
    }
    planetsRef.current = planets;
  }, []);

  // Spawn a new rocket - angle is direction of travel
  const spawnRocket = useCallback((width: number, height: number) => {
    // Rockets fly up and to the right: angle between -50 and -70 degrees
    const travelAngle = -50 - Math.random() * 20;
    const rocket: Rocket = {
      id: Date.now() + Math.random(),
      x: Math.random() * (width * 0.4),
      y: height + 30,
      size: 24 + Math.random() * 12,
      speed: 0.6 + Math.random() * 0.3,
      angle: travelAngle,
    };
    rocketsRef.current.push(rocket);
  }, []);

  // Spawn a comet - travels mostly horizontal with slight downward angle
  const spawnComet = useCallback((_width: number, height: number) => {
    const travelAngle = 5 + Math.random() * 10; // Slight downward (positive = down in screen coords)
    const comet: Comet = {
      id: Date.now() + Math.random(),
      x: -150,
      y: 30 + Math.random() * (height * 0.4),
      speed: 1.2 + Math.random() * 0.6,
      angle: travelAngle,
      trailLength: 180 + Math.random() * 120,
    };
    cometsRef.current.push(comet);
  }, []);

  // Spawn a shooting star
  const spawnShootingStar = useCallback((width: number, height: number) => {
    const shootingStar: ShootingStar = {
      id: Date.now() + Math.random(),
      x: Math.random() * width * 0.7,
      y: Math.random() * height * 0.3,
      length: 100 + Math.random() * 80,
      speed: 18 + Math.random() * 12,
      angle: 20 + Math.random() * 25,
      opacity: 1,
      life: 1,
    };
    shootingStarsRef.current.push(shootingStar);
  }, []);

  // Spawn a satellite
  const spawnSatellite = useCallback((width: number, height: number) => {
    const fromLeft = Math.random() > 0.5;
    const satellite: Satellite = {
      id: Date.now() + Math.random(),
      x: fromLeft ? -10 : width + 10,
      y: 50 + Math.random() * (height * 0.5),
      speed: 0.3 + Math.random() * 0.2,
      angle: fromLeft ? (Math.random() * 10 - 5) : (180 + Math.random() * 10 - 5),
      size: 2 + Math.random() * 1.5,
      blinkPhase: Math.random() * Math.PI * 2,
    };
    satellitesRef.current.push(satellite);
  }, []);

  // Draw rocket with animated exhaust - pointing in direction of travel
  const drawRocket = useCallback((ctx: CanvasRenderingContext2D, rocket: Rocket, scrollOffset: number, time: number) => {
    const { x, y, size, angle } = rocket;
    const adjustedY = y - scrollOffset * 0.3;

    ctx.save();
    ctx.translate(x, adjustedY);
    // Rotate so rocket points in direction of travel
    // Rocket is drawn pointing UP (-90°), so add 90° to align with travel direction
    ctx.rotate(((angle + 90) * Math.PI) / 180);

    const scale = size / 28;
    ctx.scale(scale, scale);

    // Animated exhaust flame
    const flicker = 0.8 + 0.2 * Math.sin(time * 0.02) * Math.sin(time * 0.035);
    const flicker2 = 0.7 + 0.3 * Math.sin(time * 0.025 + 1);

    // Outer exhaust glow
    const outerExhaust = ctx.createRadialGradient(0, 18, 0, 0, 22, 14 * flicker);
    outerExhaust.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
    outerExhaust.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
    outerExhaust.addColorStop(1, 'transparent');
    ctx.fillStyle = outerExhaust;
    ctx.beginPath();
    ctx.ellipse(0, 20, 6 * flicker, 12 * flicker, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner exhaust core (bright)
    const innerExhaust = ctx.createRadialGradient(0, 16, 0, 0, 18, 8 * flicker2);
    innerExhaust.addColorStop(0, 'rgba(254, 243, 199, 1)');
    innerExhaust.addColorStop(0.4, 'rgba(251, 191, 36, 0.9)');
    innerExhaust.addColorStop(0.7, 'rgba(249, 115, 22, 0.6)');
    innerExhaust.addColorStop(1, 'transparent');
    ctx.fillStyle = innerExhaust;
    ctx.beginPath();
    ctx.ellipse(0, 17, 3 * flicker2, 7 * flicker2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rocket body
    ctx.fillStyle = COLORS.rocketBody;
    ctx.beginPath();
    ctx.moveTo(0, -14);     // Nose tip
    ctx.lineTo(5, -6);      // Right shoulder
    ctx.lineTo(5, 10);      // Right body
    ctx.lineTo(7, 14);      // Right fin tip
    ctx.lineTo(5, 12);      // Right fin inner
    ctx.lineTo(3, 14);      // Right fin base
    ctx.lineTo(-3, 14);     // Left fin base
    ctx.lineTo(-5, 12);     // Left fin inner
    ctx.lineTo(-7, 14);     // Left fin tip
    ctx.lineTo(-5, 10);     // Left body
    ctx.lineTo(-5, -6);     // Left shoulder
    ctx.closePath();
    ctx.fill();

    // Nose cone (red)
    ctx.fillStyle = COLORS.rocketNose;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(4, -7);
    ctx.lineTo(-4, -7);
    ctx.closePath();
    ctx.fill();

    // Fins (red accent)
    ctx.fillStyle = COLORS.rocketNose;
    ctx.beginPath();
    ctx.moveTo(5, 10);
    ctx.lineTo(7, 14);
    ctx.lineTo(5, 12);
    ctx.lineTo(3, 14);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-5, 10);
    ctx.lineTo(-7, 14);
    ctx.lineTo(-5, 12);
    ctx.lineTo(-3, 14);
    ctx.closePath();
    ctx.fill();

    // Window (glowing)
    const windowGradient = ctx.createRadialGradient(0, -1, 0, 0, -1, 4);
    windowGradient.addColorStop(0, '#93c5fd');
    windowGradient.addColorStop(0.5, COLORS.rocketWindow);
    windowGradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)');
    ctx.fillStyle = windowGradient;
    ctx.beginPath();
    ctx.arc(0, -1, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  // Draw comet with trail pointing opposite to direction of travel
  const drawComet = useCallback((ctx: CanvasRenderingContext2D, comet: Comet, scrollOffset: number, time: number) => {
    const { x, y, angle, trailLength } = comet;
    const adjustedY = y - scrollOffset * 0.3;

    // Trail points opposite to direction of travel
    const angleRad = (angle * Math.PI) / 180;
    const tailX = x - Math.cos(angleRad) * trailLength;
    const tailY = adjustedY - Math.sin(angleRad) * trailLength;

    // Animated shimmer
    const shimmer = 0.9 + 0.1 * Math.sin(time * 0.01);

    // Wide outer glow trail
    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Main trail gradient
    const trailGradient = ctx.createLinearGradient(x, adjustedY, tailX, tailY);
    trailGradient.addColorStop(0, `rgba(255, 255, 255, ${0.95 * shimmer})`);
    trailGradient.addColorStop(0.05, `rgba(254, 243, 199, ${0.9 * shimmer})`);
    trailGradient.addColorStop(0.15, `rgba(249, 115, 22, ${0.7 * shimmer})`);
    trailGradient.addColorStop(0.4, 'rgba(234, 88, 12, 0.35)');
    trailGradient.addColorStop(0.7, 'rgba(234, 88, 12, 0.1)');
    trailGradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = trailGradient;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Core glow
    const coreGradient = ctx.createRadialGradient(x, adjustedY, 0, x, adjustedY, 10);
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    coreGradient.addColorStop(0.2, 'rgba(254, 243, 199, 0.9)');
    coreGradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.5)');
    coreGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(x, adjustedY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x, adjustedY, 3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw shooting star
  const drawShootingStar = useCallback((ctx: CanvasRenderingContext2D, star: ShootingStar, scrollOffset: number) => {
    const { x, y, length, angle, opacity } = star;
    const adjustedY = y - scrollOffset * 0.2;

    const angleRad = (angle * Math.PI) / 180;
    const tailX = x - Math.cos(angleRad) * length;
    const tailY = adjustedY - Math.sin(angleRad) * length;

    const gradient = ctx.createLinearGradient(x, adjustedY, tailX, tailY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
    gradient.addColorStop(0.15, `rgba(191, 219, 254, ${opacity * 0.9})`);
    gradient.addColorStop(0.5, `rgba(147, 197, 253, ${opacity * 0.5})`);
    gradient.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.moveTo(x, adjustedY);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright head
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, adjustedY, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw satellite
  const drawSatellite = useCallback((ctx: CanvasRenderingContext2D, satellite: Satellite, scrollOffset: number, time: number) => {
    const { x, y, size, blinkPhase } = satellite;
    const adjustedY = y - scrollOffset * 0.25;

    // Blinking light
    const blink = Math.sin(time * 0.003 + blinkPhase) > 0.7 ? 1 : 0.3;

    ctx.fillStyle = `rgba(148, 163, 184, ${0.6 + blink * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, adjustedY, size, 0, Math.PI * 2);
    ctx.fill();

    // Solar panel glint
    if (blink > 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, adjustedY, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Draw planet
  const drawPlanet = useCallback((ctx: CanvasRenderingContext2D, planet: Planet, scrollOffset: number) => {
    const parallax = planet.layer === 'far' ? 0.05 : 0.1;
    const adjustedY = planet.y - scrollOffset * parallax;

    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      planet.x, adjustedY, planet.size * 0.5,
      planet.x, adjustedY, planet.size * 2
    );
    glowGradient.addColorStop(0, planet.glowColor);
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(planet.x, adjustedY, planet.size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Planet body
    const bodyGradient = ctx.createRadialGradient(
      planet.x - planet.size * 0.3, adjustedY - planet.size * 0.3, 0,
      planet.x, adjustedY, planet.size
    );
    bodyGradient.addColorStop(0, planet.color);
    bodyGradient.addColorStop(1, `${planet.color}88`);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(planet.x, adjustedY, planet.size, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Main animation loop
  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height);

    // Deep space gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, COLORS.deepSpace);
    bgGradient.addColorStop(0.5, '#111827');
    bgGradient.addColorStop(1, COLORS.deepSpaceLight);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const scrollOffset = scrollRef.current;

    // Draw distant planets (behind everything)
    planetsRef.current.forEach((planet) => {
      drawPlanet(ctx, planet, scrollOffset);
    });

    // Draw stars with enhanced twinkling
    starsRef.current.forEach((star) => {
      const parallaxMultiplier = star.layer === 'far' ? 0.1 : 0.2;
      const adjustedY = star.y - scrollOffset * parallaxMultiplier;

      let opacity = star.opacity;
      if (star.twinkleSpeed > 0 && !prefersReducedMotion) {
        // Enhanced twinkling: wider range, more noticeable
        const twinkle = Math.sin(time * star.twinkleSpeed * 0.002 + star.twinklePhase);
        opacity *= 0.4 + 0.6 * ((twinkle + 1) / 2); // Range: 0.4 to 1.0
      }

      // Draw glow for near stars
      if (star.layer === 'near' && opacity > 0.6) {
        const glowGradient = ctx.createRadialGradient(
          star.x, adjustedY, 0,
          star.x, adjustedY, star.size * 3
        );
        glowGradient.addColorStop(0, star.color.replace(')', `, ${opacity * 0.5})`).replace('rgb', 'rgba'));
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, adjustedY, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star core
      ctx.fillStyle = star.color.includes('rgba')
        ? star.color.replace(/[\d.]+\)$/, `${opacity})`)
        : `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, adjustedY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      // Spawn management
      if (time - lastRocketSpawnRef.current > 25000 + Math.random() * 15000) {
        if (rocketsRef.current.length < 2) {
          spawnRocket(width, height);
          lastRocketSpawnRef.current = time;
        }
      }

      if (time - lastCometSpawnRef.current > 50000 + Math.random() * 40000) {
        if (cometsRef.current.length < 2) {
          spawnComet(width, height);
          lastCometSpawnRef.current = time;
        }
      }

      if (time - lastShootingStarRef.current > 25000 + Math.random() * 35000) {
        spawnShootingStar(width, height);
        lastShootingStarRef.current = time;
      }

      if (time - lastSatelliteSpawnRef.current > 35000 + Math.random() * 25000) {
        if (satellitesRef.current.length < 2) {
          spawnSatellite(width, height);
          lastSatelliteSpawnRef.current = time;
        }
      }

      // Update and draw satellites
      satellitesRef.current = satellitesRef.current.filter((satellite) => {
        const angleRad = (satellite.angle * Math.PI) / 180;
        satellite.x += Math.cos(angleRad) * satellite.speed;
        satellite.y += Math.sin(angleRad) * satellite.speed;

        if (satellite.x < -20 || satellite.x > width + 20) {
          return false;
        }

        drawSatellite(ctx, satellite, scrollOffset, time);
        return true;
      });

      // Update and draw rockets
      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        const angleRad = (rocket.angle * Math.PI) / 180;
        rocket.x += Math.cos(angleRad) * rocket.speed;
        rocket.y += Math.sin(angleRad) * rocket.speed;

        if (rocket.y < -100 || rocket.x > width + 100 || rocket.x < -100) {
          return false;
        }

        drawRocket(ctx, rocket, scrollOffset, time);
        return true;
      });

      // Update and draw comets
      cometsRef.current = cometsRef.current.filter((comet) => {
        const angleRad = (comet.angle * Math.PI) / 180;
        comet.x += Math.cos(angleRad) * comet.speed;
        comet.y += Math.sin(angleRad) * comet.speed;

        if (comet.x > width + 300) {
          return false;
        }

        drawComet(ctx, comet, scrollOffset, time);
        return true;
      });

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        const angleRad = (star.angle * Math.PI) / 180;
        star.x += Math.cos(angleRad) * star.speed;
        star.y += Math.sin(angleRad) * star.speed;
        star.life -= 0.025;
        star.opacity = Math.max(0, star.life);

        if (star.life <= 0) {
          return false;
        }

        drawShootingStar(ctx, star, scrollOffset);
        return true;
      });
    }
  }, [prefersReducedMotion, spawnRocket, spawnComet, spawnShootingStar, spawnSatellite, drawRocket, drawComet, drawShootingStar, drawSatellite, drawPlanet]);

  // Setup effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const loop = (time: number) => {
      if (theme === 'dark') {
        const rect = container.getBoundingClientRect();
        animate(ctx, rect.width, rect.height, time);
      }
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    // Initial spawns
    setTimeout(() => {
      const rect = container.getBoundingClientRect();
      if (rocketsRef.current.length === 0) spawnRocket(rect.width, rect.height);
    }, 3000);

    setTimeout(() => {
      const rect = container.getBoundingClientRect();
      if (cometsRef.current.length === 0) spawnComet(rect.width, rect.height);
    }, 8000);

    setTimeout(() => {
      const rect = container.getBoundingClientRect();
      if (satellitesRef.current.length === 0) spawnSatellite(rect.width, rect.height);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [theme, initStars, animate, spawnRocket, spawnComet, spawnSatellite]);

  // Theme observer
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
    const initialTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    setTheme(initialTheme || 'dark');

    return () => observer.disconnect();
  }, []);

  if (theme === 'light') return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
