import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GradientMeshProps {
  className?: string;
}

export default function GradientMesh({ className = '' }: GradientMeshProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle mouse interaction for non-reduced-motion users
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      container.style.setProperty('--mouse-x', `${x * 100}%`);
      container.style.setProperty('--mouse-y', `${y * 100}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Animation variants for the gradient blobs
  const blobVariants = {
    animate: (custom: { duration: number; delay: number }) => ({
      scale: [1, 1.2, 1],
      x: ['0%', '5%', '-5%', '0%'],
      y: ['0%', '-5%', '5%', '0%'],
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    }),
  };

  // Static version for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden="true"
        role="presentation"
      >
        {/* Static gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 30% 30%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
              radial-gradient(ellipse 50% 50% at 70% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
            `,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
      role="presentation"
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      } as React.CSSProperties}
    >
      {/* Base gradient layer */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
        }}
      />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: '10%',
          top: '-20%',
        }}
        variants={blobVariants}
        animate="animate"
        custom={{ duration: 20, delay: 0 }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)',
          right: '5%',
          top: '10%',
        }}
        variants={blobVariants}
        animate="animate"
        custom={{ duration: 25, delay: 2 }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          left: '30%',
          bottom: '-10%',
        }}
        variants={blobVariants}
        animate="animate"
        custom={{ duration: 22, delay: 4 }}
      />

      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)',
          right: '20%',
          bottom: '20%',
        }}
        variants={blobVariants}
        animate="animate"
        custom={{ duration: 18, delay: 6 }}
      />

      {/* Mouse-following subtle highlight */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          left: 'calc(var(--mouse-x) - 150px)',
          top: 'calc(var(--mouse-y) - 150px)',
          opacity: 0.5,
        }}
      />

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
