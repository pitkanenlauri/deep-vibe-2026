import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface ImpactStat {
  id: string;
  value: string;
  unit: string;
  label: string;
  detail: string;
  icon?: string;
}

interface ImpactDashboardProps {
  stats: ImpactStat[];
}

function parseNumericValue(value: string): { numeric: number; prefix: string; suffix: string } {
  const match = value.match(/^([€$£]?)(\d+(?:\.\d+)?)(.*)/);
  if (match) {
    return {
      prefix: match[1] || '',
      numeric: parseFloat(match[2]),
      suffix: match[3] || ''
    };
  }
  return { prefix: '', numeric: 0, suffix: value };
}

function CountUp({ value, duration = 800 }: { value: string; duration?: number }) {
  const { prefix, numeric, suffix } = parseNumericValue(value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion || numeric === 0) {
      setCount(numeric);
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * numeric));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(numeric);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, numeric, duration, prefersReducedMotion]);

  const displayValue = numeric === 0 ? value : `${prefix}${count}${suffix}`;

  return <span ref={ref}>{displayValue}</span>;
}

function StatCard({ stat, index }: { stat: ImpactStat; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0, 0, 0.2, 1] as const,
        delay: prefersReducedMotion ? 0 : index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={prefersReducedMotion ? {} : {
        y: -4,
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.15), 0 4px 8px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group p-5 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors duration-150"
    >
      <div className="flex flex-col h-full min-h-[140px]">
        <div className="mb-2">
          <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            <CountUp value={stat.value} duration={800} />
          </div>
          <div className="text-xs md:text-sm text-gray-500 truncate">{stat.unit}</div>
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">{stat.label}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{stat.detail}</p>
      </div>
    </motion.div>
  );
}

export default function ImpactDashboard({ stats }: ImpactDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.2
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.id} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}
