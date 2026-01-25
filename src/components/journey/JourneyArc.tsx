// src/components/journey/JourneyArc.tsx
// Career arc visualization showing the unique journey from physics to leadership
// Built by: nux (polecat) for dv-rn5n

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import * as d3 from 'd3';

interface JourneyStage {
  id: string;
  label: string;
  shortLabel: string;
  period: string;
  description: string;
  color: string;
  icon: string;
}

interface JourneyArcProps {
  onStageClick?: (stageId: string | null) => void;
}

// Career journey stages - the unique arc from physics to leadership
const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'physics-student',
    label: 'Physics Student',
    shortLabel: 'Physics',
    period: '2012-2016',
    description: 'B.Sc. Computer Science & Mathematics at Tampere University. Built programming foundations and mathematical rigor.',
    color: '#7c3aed', // Purple - academic
    icon: '📚',
  },
  {
    id: 'teaching',
    label: 'Teaching',
    shortLabel: 'Teaching',
    period: '2014-2018',
    description: 'Teaching assistant at Tampere and Turku universities. Developed communication skills and passion for mentoring.',
    color: '#059669', // Green - growth
    icon: '🎓',
  },
  {
    id: 'quantum-research',
    label: 'Quantum Research',
    shortLabel: 'Research',
    period: '2017-2018',
    description: 'Research assistant at University of Turku. M.Sc. in Physics with focus on quantum optics.',
    color: '#9333ea', // Deep purple - science
    icon: '🔬',
  },
  {
    id: 'space-tech',
    label: 'Space Technology',
    shortLabel: 'Space',
    period: '2019-2020',
    description: 'Software Engineer at ICEYE. Applied physics expertise to satellite data processing systems.',
    color: '#1d4ed8', // Blue - space
    icon: '🛰️',
  },
  {
    id: 'rpa-automation',
    label: 'RPA Automation',
    shortLabel: 'Automation',
    period: '2020-2021',
    description: 'Software Developer at Digia. Built enterprise automation solutions using Python.',
    color: '#2563eb', // Primary blue
    icon: '🤖',
  },
  {
    id: 'senior-developer',
    label: 'Senior Developer',
    shortLabel: 'Senior Dev',
    period: '2022-2023',
    description: 'Led technical delivery of flagship projects. Established best practices, achieved 99.99% uptime.',
    color: '#3b82f6', // Lighter blue
    icon: '💻',
  },
  {
    id: 'engineering-manager',
    label: 'Engineering Manager',
    shortLabel: 'EM',
    period: '2024-Present',
    description: 'Leading 16 engineers across 3 teams. Building high-trust teams in AI & Automation.',
    color: '#60a5fa', // Lightest blue - leadership
    icon: '🚀',
  },
];

const MOBILE_BREAKPOINT = 768;

export default function JourneyArc({ onStageClick }: JourneyArcProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredStage, setHoveredStage] = useState<JourneyStage | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Setup dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = isMobile ? 280 : Math.min(350, width * 0.45);
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Animation on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimationProgress(1);
      return;
    }

    let frame: number;
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  // Calculate node positions along an arc
  const getNodePositions = useCallback(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return [];

    const padding = { top: 60, right: 40, bottom: 80, left: 40 };
    const arcWidth = width - padding.left - padding.right;
    const arcHeight = height - padding.top - padding.bottom;

    // Create an arc curve using D3
    const arcScale = d3.scaleLinear()
      .domain([0, JOURNEY_STAGES.length - 1])
      .range([0, Math.PI]);

    return JOURNEY_STAGES.map((stage, i) => {
      const angle = arcScale(i);
      // Arc formula: x based on angle, y curves up then down
      const x = padding.left + (1 - Math.cos(angle)) * (arcWidth / 2);
      const y = padding.top + arcHeight - Math.sin(angle) * arcHeight;

      return {
        ...stage,
        x,
        y,
        index: i,
      };
    });
  }, [dimensions]);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const nodes = getNodePositions();
    if (nodes.length === 0) {
      ctx.restore();
      return;
    }

    // Calculate how many nodes to show based on animation progress
    const visibleCount = Math.floor(nodes.length * animationProgress) + 1;
    const partialProgress = (nodes.length * animationProgress) % 1;

    // Draw connecting arc path
    if (nodes.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 3;

      // Draw the full arc path (background)
      const line = d3.line<typeof nodes[0]>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCardinal.tension(0.5));

      const pathData = line(nodes);
      if (pathData) {
        const path = new Path2D(pathData);
        ctx.stroke(path);
      }

      // Draw the animated arc path (gradient)
      if (animationProgress > 0) {
        const gradient = ctx.createLinearGradient(
          nodes[0].x, nodes[0].y,
          nodes[nodes.length - 1].x, nodes[nodes.length - 1].y
        );
        gradient.addColorStop(0, '#7c3aed');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#60a5fa');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;

        const visibleNodes = nodes.slice(0, visibleCount);
        if (visibleCount < nodes.length && partialProgress > 0) {
          // Add partial node
          const lastVisible = nodes[visibleCount - 1];
          const nextNode = nodes[visibleCount];
          const partialX = lastVisible.x + (nextNode.x - lastVisible.x) * partialProgress;
          const partialY = lastVisible.y + (nextNode.y - lastVisible.y) * partialProgress;
          visibleNodes.push({ ...nextNode, x: partialX, y: partialY });
        }

        const animatedPathData = line(visibleNodes);
        if (animatedPathData) {
          const animatedPath = new Path2D(animatedPathData);
          ctx.stroke(animatedPath);
        }
      }
    }

    // Draw nodes
    nodes.forEach((node, i) => {
      if (node.x == null || node.y == null) return;

      const isVisible = i < visibleCount;
      const isPartial = i === visibleCount - 1 && partialProgress < 0.5;
      const isHovered = hoveredStage?.id === node.id;
      const isSelected = selectedStage === node.id;

      // Node opacity based on animation
      let alpha = isVisible ? 1 : 0;
      if (isPartial) {
        alpha = partialProgress * 2;
      }

      if (alpha === 0) return;

      // Draw node glow for hovered/selected
      if ((isHovered || isSelected) && alpha > 0) {
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 30
        );
        glowGradient.addColorStop(0, node.color + '40');
        glowGradient.addColorStop(1, node.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw node
      const radius = isHovered || isSelected ? 20 : 16;
      ctx.globalAlpha = alpha;

      // Node background
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isHovered || isSelected ? 3 : 2;
      ctx.stroke();

      // Node icon (emoji)
      ctx.font = `${isHovered || isSelected ? 16 : 14}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.fillText(node.icon, node.x, node.y);

      // Label below node
      ctx.font = `${isHovered || isSelected ? 'bold ' : ''}11px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = isHovered || isSelected ? node.color : '#57534e';
      ctx.fillText(node.shortLabel, node.x, node.y + radius + 8);

      // Period below label
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#a8a29e';
      ctx.fillText(node.period, node.x, node.y + radius + 22);

      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }, [dimensions, getNodePositions, animationProgress, hoveredStage, selectedStage]);

  // Redraw when state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Setup canvas with proper DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    draw();
  }, [dimensions, draw]);

  // Mouse interaction handlers
  const getNodeAtPosition = useCallback((x: number, y: number): typeof JOURNEY_STAGES[0] | null => {
    const nodes = getNodePositions();
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < 20 * 20) {
        return node;
      }
    }
    return null;
  }, [getNodePositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = getNodeAtPosition(x, y);

    if (node) {
      setHoveredStage(node);
      setTooltipPos({ x: e.clientX, y: e.clientY });
      canvas.style.cursor = 'pointer';
    } else {
      setHoveredStage(null);
      canvas.style.cursor = 'default';
    }
  }, [getNodeAtPosition]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = getNodeAtPosition(x, y);

    if (node) {
      const newSelected = selectedStage === node.id ? null : node.id;
      setSelectedStage(newSelected);
      onStageClick?.(newSelected);
    } else {
      setSelectedStage(null);
      onStageClick?.(null);
    }
  }, [getNodeAtPosition, selectedStage, onStageClick]);

  const handleMouseLeave = useCallback(() => {
    setHoveredStage(null);
  }, []);

  // Mobile fallback: vertical timeline
  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3 top-0 bottom-0 w-0.5"
            style={{
              background: 'linear-gradient(180deg, #7c3aed 0%, #3b82f6 50%, #60a5fa 100%)',
            }}
          />

          <div className="space-y-6">
            {JOURNEY_STAGES.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Node dot */}
                <div
                  className="absolute -left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center text-sm"
                  style={{ borderColor: stage.color }}
                >
                  {stage.icon}
                </div>

                {/* Content */}
                <button
                  onClick={() => {
                    const newSelected = selectedStage === stage.id ? null : stage.id;
                    setSelectedStage(newSelected);
                    onStageClick?.(newSelected);
                  }}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all
                    ${selectedStage === stage.id
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{stage.label}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{stage.period}</p>
                    </div>
                  </div>
                  {selectedStage === stage.id && (
                    <motion.p
                      initial={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-gray-600 mt-2"
                    >
                      {stage.description}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full relative">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        className="w-full"
        role="img"
        aria-label="Interactive career journey arc showing progression from physics student to engineering manager"
      />

      {/* Tooltip */}
      {hoveredStage && (
        <div
          className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 text-sm max-w-xs"
          style={{
            left: tooltipPos.x + 16,
            top: tooltipPos.y - 8,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{hoveredStage.icon}</span>
            <div>
              <div className="font-semibold text-gray-900">{hoveredStage.label}</div>
              <div className="text-xs text-gray-500">{hoveredStage.period}</div>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{hoveredStage.description}</p>
        </div>
      )}

      {/* Selected stage detail panel */}
      {selectedStage && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
        >
          {(() => {
            const stage = JOURNEY_STAGES.find(s => s.id === selectedStage);
            if (!stage) return null;
            return (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg"
                    style={{ borderColor: stage.color }}
                  >
                    {stage.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{stage.label}</h4>
                    <p className="text-sm text-gray-500">{stage.period}</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-3">{stage.description}</p>
              </>
            );
          })()}
        </motion.div>
      )}

      {/* Legend / Journey narrative */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Click any stage to learn more about this unique journey
        </p>
        <div className="mt-2 flex justify-center items-center gap-2 text-xs text-gray-400">
          <span className="inline-block w-8 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, #7c3aed, #60a5fa)' }} />
          <span>From physics foundations to engineering leadership</span>
          <span className="inline-block w-8 h-0.5 rounded" style={{ background: 'linear-gradient(90deg, #60a5fa, #7c3aed)' }} />
        </div>
      </div>
    </div>
  );
}
