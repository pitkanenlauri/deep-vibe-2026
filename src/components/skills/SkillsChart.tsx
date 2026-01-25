// src/components/skills/SkillsChart.tsx
import { useEffect, useRef, useState } from 'react';

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
}

const CATEGORY_COLORS: Record<string, { bar: string; bg: string }> = {
  Technical: { bar: '#2563eb', bg: '#dbeafe' },
  Leadership: { bar: '#059669', bg: '#d1fae5' },
  Domain: { bar: '#d97706', bg: '#fef3c7' },
};

const DEFAULT_COLOR = { bar: '#6b7280', bg: '#f3f4f6' };

export default function SkillsChart({ skills }: SkillsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const maxLevel = 5;
  const barHeight = 28;
  const barGap = 8;
  const labelWidth = 160;
  const levelIndicatorWidth = 32;

  return (
    <div ref={containerRef} className="w-full">
      <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
        {skills.map((category, categoryIndex) => {
          const colors = CATEGORY_COLORS[category.category] || DEFAULT_COLOR;
          const categoryHeight = category.skills.length * (barHeight + barGap) - barGap;

          return (
            <div key={category.category} className="space-y-4">
              <h3 className="text-title text-gray-900 font-semibold">
                {category.category}
              </h3>
              <svg
                viewBox={`0 0 ${labelWidth + 200 + levelIndicatorWidth} ${categoryHeight}`}
                className="w-full h-auto"
                role="img"
                aria-label={`${category.category} skills chart`}
              >
                <title>{category.category} Skills</title>
                <desc>
                  Bar chart showing {category.category.toLowerCase()} skill levels
                </desc>

                {category.skills.map((skill, skillIndex) => {
                  const y = skillIndex * (barHeight + barGap);
                  const barWidth = (skill.level / maxLevel) * 200;
                  const animationDelay = prefersReducedMotion
                    ? 0
                    : categoryIndex * 150 + skillIndex * 80;

                  return (
                    <g key={skill.name}>
                      {/* Skill name label */}
                      <text
                        x={labelWidth - 8}
                        y={y + barHeight / 2}
                        textAnchor="end"
                        dominantBaseline="central"
                        className={`text-sm ${
                          skill.highlight
                            ? 'fill-gray-900 font-medium'
                            : 'fill-gray-600'
                        }`}
                        style={{ fontSize: '13px' }}
                      >
                        {skill.name}
                      </text>

                      {/* Background bar track */}
                      <rect
                        x={labelWidth}
                        y={y + 4}
                        width={200}
                        height={barHeight - 8}
                        rx={4}
                        fill={colors.bg}
                      />

                      {/* Animated progress bar */}
                      <rect
                        x={labelWidth}
                        y={y + 4}
                        width={isVisible || prefersReducedMotion ? barWidth : 0}
                        height={barHeight - 8}
                        rx={4}
                        fill={colors.bar}
                        style={{
                          transition: prefersReducedMotion
                            ? 'none'
                            : `width 400ms ease-out ${animationDelay}ms`,
                        }}
                      />

                      {/* Level indicator */}
                      <text
                        x={labelWidth + 200 + 12}
                        y={y + barHeight / 2}
                        dominantBaseline="central"
                        className="fill-gray-500"
                        style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)' }}
                      >
                        {skill.level}/{maxLevel}
                      </text>

                      {/* Highlight indicator */}
                      {skill.highlight && (
                        <circle
                          cx={labelWidth - 16}
                          cy={y + barHeight / 2}
                          r={3}
                          fill={colors.bar}
                          opacity={isVisible || prefersReducedMotion ? 1 : 0}
                          style={{
                            transition: prefersReducedMotion
                              ? 'none'
                              : `opacity 300ms ease-out ${animationDelay + 200}ms`,
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })}
      </div>

      {/* Legend for highlighted skills */}
      <div className="mt-8 flex items-center gap-2 text-small text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS.Technical.bar }}
          />
          Key strength
        </span>
      </div>
    </div>
  );
}
