// src/components/skills/SkillsChart.tsx
// Force-directed graph visualization for skills
// Built by: nux (polecat) for dv-nddk

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

interface Skill {
  name: string;
  level: number;
  highlight: boolean;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface SkillsChartProps {
  skills: SkillCategory[];
  onSkillClick?: (skillName: string | null) => void;
}

interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  level: number;
  highlight: boolean;
  category: string;
  radius: number;
}

interface CategoryNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  isCategory: true;
  radius: number;
}

type GraphNode = SkillNode | CategoryNode;

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode | string;
  target: GraphNode | string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technical: '#2563eb',
  Leadership: '#059669',
  Domain: '#d97706',
};

const DEFAULT_COLOR = '#6b7280';

const MOBILE_BREAKPOINT = 768;

export default function SkillsChart({ skills, onSkillClick }: SkillsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);

  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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
        const height = isMobile ? 300 : Math.min(450, width * 0.6);
        setDimensions({ width, height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Build nodes and links from skills data
  useEffect(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Create category nodes (larger, act as cluster centers)
    skills.forEach((cat) => {
      const categoryNode: CategoryNode = {
        id: `cat-${cat.category}`,
        name: cat.category,
        category: cat.category,
        isCategory: true,
        radius: 24,
      };
      nodes.push(categoryNode);

      // Create skill nodes
      cat.skills.forEach((skill) => {
        const skillNode: SkillNode = {
          id: `skill-${skill.name}`,
          name: skill.name,
          level: skill.level,
          highlight: skill.highlight,
          category: cat.category,
          radius: 8 + skill.level * 3,
        };
        nodes.push(skillNode);

        // Link skill to its category
        links.push({
          source: categoryNode.id,
          target: skillNode.id,
        });
      });
    });

    nodesRef.current = nodes;
    linksRef.current = links;
  }, [skills]);

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

    const nodes = nodesRef.current;
    const links = linksRef.current;

    // Draw links
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;
    links.forEach((link) => {
      const source = link.source as GraphNode;
      const target = link.target as GraphNode;
      if (source.x != null && source.y != null && target.x != null && target.y != null) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      if (node.x == null || node.y == null) return;

      const color = CATEGORY_COLORS[node.category] || DEFAULT_COLOR;
      const isCategory = 'isCategory' in node && node.isCategory;
      const isSkillNode = !isCategory;
      const skillNode = isSkillNode ? (node as SkillNode) : null;

      // Determine if this node should be highlighted
      const isSelected = selectedSkill === node.name;
      const isHovered = hoveredNode?.id === node.id;
      const shouldDim = selectedSkill && !isSelected && isSkillNode;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      if (isCategory) {
        // Category nodes: filled with color, slightly transparent
        ctx.fillStyle = color + '20';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Category label
        ctx.fillStyle = color;
        ctx.font = 'bold 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.name, node.x, node.y);
      } else {
        // Skill nodes
        const alpha = shouldDim ? 0.3 : 1;
        ctx.fillStyle = isHovered || isSelected
          ? color
          : skillNode?.highlight
            ? color + 'cc'
            : color + '80';
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (isHovered || isSelected) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Skill label (show on hover or if highlighted)
        if (isHovered || isSelected || skillNode?.highlight) {
          ctx.fillStyle = shouldDim ? '#9ca3af' : '#374151';
          ctx.font = `${isHovered || isSelected ? 'bold ' : ''}10px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(node.name, node.x, node.y + node.radius + 4);
        }
      }
    });

    ctx.restore();
  }, [dimensions, hoveredNode, selectedSkill]);

  // Initialize force simulation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    if (nodesRef.current.length === 0) return;

    const { width, height } = dimensions;

    // Stop existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodesRef.current)
      .force('link', d3.forceLink<GraphNode, GraphLink>(linksRef.current)
        .id((d) => d.id)
        .distance(60)
        .strength(0.8))
      .force('charge', d3.forceManyBody()
        .strength((d) => ('isCategory' in d && d.isCategory) ? -200 : -30))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>()
        .radius((d) => d.radius + 8))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    if (prefersReducedMotion) {
      // Skip animation, run to completion
      simulation.stop();
      for (let i = 0; i < 300; i++) {
        simulation.tick();
      }
      draw();
    } else {
      simulation.on('tick', draw);
    }

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [dimensions, prefersReducedMotion, draw, skills]);

  // Redraw when hover/selection changes
  useEffect(() => {
    draw();
  }, [draw, hoveredNode, selectedSkill]);

  // Mouse interaction handlers
  const getNodeAtPosition = useCallback((x: number, y: number): GraphNode | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (node.x == null || node.y == null) continue;
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < node.radius * node.radius) {
        return node;
      }
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = getNodeAtPosition(x, y);

    if (node && !('isCategory' in node && node.isCategory)) {
      setHoveredNode(node as SkillNode);
      setTooltipPos({ x: e.clientX, y: e.clientY });
      canvas.style.cursor = 'pointer';
    } else {
      setHoveredNode(null);
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

    if (node && !('isCategory' in node && node.isCategory)) {
      const skillName = node.name;
      const newSelected = selectedSkill === skillName ? null : skillName;
      setSelectedSkill(newSelected);
      onSkillClick?.(newSelected);
    } else {
      setSelectedSkill(null);
      onSkillClick?.(null);
    }
  }, [getNodeAtPosition, selectedSkill, onSkillClick]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

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

  // Mobile fallback: simple tag-based view
  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full">
        <div className="space-y-6">
          {skills.map((category) => {
            const color = CATEGORY_COLORS[category.category] || DEFAULT_COLOR;
            return (
              <div key={category.category}>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color }}
                >
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => {
                        const newSelected = selectedSkill === skill.name ? null : skill.name;
                        setSelectedSkill(newSelected);
                        onSkillClick?.(newSelected);
                      }}
                      className={`
                        px-3 py-1.5 rounded-full text-sm transition-all
                        ${selectedSkill === skill.name
                          ? 'ring-2 ring-offset-1'
                          : ''
                        }
                        ${skill.highlight
                          ? 'font-medium'
                          : ''
                        }
                      `}
                      style={{
                        backgroundColor: skill.highlight ? color + '20' : '#f3f4f6',
                        color: skill.highlight ? color : '#374151',
                        borderColor: color,
                        // Use CSS custom property for Tailwind ring color
                        '--tw-ring-color': color,
                      } as React.CSSProperties}
                    >
                      {skill.name}
                      <span className="ml-1.5 opacity-60 text-xs">
                        {'●'.repeat(skill.level)}{'○'.repeat(5 - skill.level)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <span key={cat} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {cat}
            </span>
          ))}
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
        aria-label="Interactive skills visualization showing skill clusters by category"
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-sm"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 12,
            transform: 'translateY(-100%)',
          }}
        >
          <div className="font-medium text-gray-900">{hoveredNode.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: (CATEGORY_COLORS[hoveredNode.category] || DEFAULT_COLOR) + '20',
                color: CATEGORY_COLORS[hoveredNode.category] || DEFAULT_COLOR,
              }}
            >
              {hoveredNode.category}
            </span>
            <span className="text-gray-500 text-xs">
              Level {hoveredNode.level}/5
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {'●'.repeat(hoveredNode.level)}{'○'.repeat(5 - hoveredNode.level)}
          </div>
          {hoveredNode.highlight && (
            <div className="mt-1 text-xs text-primary-600 font-medium">
              ★ Key strength
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <span key={cat} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            {cat}
          </span>
        ))}
        <span className="flex items-center gap-2 text-gray-400">
          <span className="text-xs">Click skill to highlight</span>
        </span>
      </div>
    </div>
  );
}
