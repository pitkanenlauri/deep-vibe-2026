// src/components/skills/SkillsChart.tsx
// Clean 3-column skills visualization with larger circles
// Redesigned for clarity and visual impact

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string; light: string }> = {
  Technical: {
    bg: '#2563eb',
    text: '#1d4ed8',
    accent: '#3b82f6',
    light: '#dbeafe',
  },
  Leadership: {
    bg: '#059669',
    text: '#047857',
    accent: '#10b981',
    light: '#d1fae5',
  },
  Domain: {
    bg: '#d97706',
    text: '#b45309',
    accent: '#f59e0b',
    light: '#fef3c7',
  },
};

const DEFAULT_COLOR = {
  bg: '#6b7280',
  text: '#4b5563',
  accent: '#9ca3af',
  light: '#f3f4f6',
};

function SkillNode({
  skill,
  colors,
  index,
  isSelected,
  onClick,
}: {
  skill: Skill;
  colors: typeof DEFAULT_COLOR;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Size based on level: 40px base + level * 8px
  const size = 40 + skill.level * 8;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.05,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-full
        transition-all duration-200 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${isSelected ? 'ring-2 ring-offset-2' : ''}
      `}
      style={{
        width: size,
        height: size,
        backgroundColor: skill.highlight ? colors.bg : colors.light,
        color: skill.highlight ? 'white' : colors.text,
        boxShadow: isSelected
          ? `0 4px 20px ${colors.bg}40`
          : skill.highlight
            ? `0 4px 12px ${colors.bg}30`
            : '0 2px 8px rgba(0,0,0,0.08)',
        // @ts-ignore - CSS custom property for ring color
        '--tw-ring-color': colors.accent,
      }}
      aria-label={`${skill.name}: Level ${skill.level}/5${skill.highlight ? ' (Key strength)' : ''}`}
    >
      <span
        className={`text-center font-medium leading-tight ${
          size < 60 ? 'text-xs' : 'text-sm'
        }`}
        style={{ maxWidth: size - 12 }}
      >
        {skill.name.split(' ').length > 1 && size < 70
          ? skill.name.split(' ').map(w => w[0]).join('')
          : skill.name}
      </span>

      {/* Level indicator dots */}
      <div className="absolute -bottom-2 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: level <= skill.level ? colors.accent : '#e5e7eb',
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}

function CategoryCluster({
  category,
  index,
  selectedSkill,
  onSkillClick,
}: {
  category: SkillCategory;
  index: number;
  selectedSkill: string | null;
  onSkillClick: (name: string | null) => void;
}) {
  const colors = CATEGORY_COLORS[category.category] || DEFAULT_COLOR;
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.15,
      }}
      className="flex flex-col items-center"
    >
      {/* Category header */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          delay: prefersReducedMotion ? 0 : index * 0.15,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: colors.bg + '15',
          border: `3px solid ${colors.bg}`,
        }}
      >
        <span
          className="text-sm font-bold text-center leading-tight"
          style={{ color: colors.text }}
        >
          {category.category}
        </span>
      </motion.div>

      {/* Skills cluster */}
      <div className="flex flex-wrap justify-center gap-4 max-w-[200px]">
        {category.skills.map((skill, skillIndex) => (
          <SkillNode
            key={skill.name}
            skill={skill}
            colors={colors}
            index={index * 5 + skillIndex}
            isSelected={selectedSkill === skill.name}
            onClick={() =>
              onSkillClick(selectedSkill === skill.name ? null : skill.name)
            }
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsChart({ skills, onSkillClick }: SkillsChartProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (name: string | null) => {
    setSelectedSkill(name);
    onSkillClick?.(name);
  };

  // Find the selected skill details for the info panel
  const selectedSkillDetails = selectedSkill
    ? skills
        .flatMap((cat) => cat.skills.map((s) => ({ ...s, category: cat.category })))
        .find((s) => s.name === selectedSkill)
    : null;

  return (
    <div className="w-full">
      {/* Three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {skills.map((category, index) => (
          <CategoryCluster
            key={category.category}
            category={category}
            index={index}
            selectedSkill={selectedSkill}
            onSkillClick={handleSkillClick}
          />
        ))}
      </div>

      {/* Selected skill info panel */}
      {selectedSkillDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{selectedSkillDetails.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      (CATEGORY_COLORS[selectedSkillDetails.category] || DEFAULT_COLOR).light,
                    color: (CATEGORY_COLORS[selectedSkillDetails.category] || DEFAULT_COLOR).text,
                  }}
                >
                  {selectedSkillDetails.category}
                </span>
                <span className="text-sm text-gray-500">
                  Level {selectedSkillDetails.level}/5
                </span>
                {selectedSkillDetails.highlight && (
                  <span className="text-sm text-primary-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Key strength
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleSkillClick(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
          <span key={cat} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.bg }}
            />
            {cat}
          </span>
        ))}
        <span className="flex items-center gap-2 text-gray-400">
          <span className="text-xs">Click skill for details</span>
        </span>
      </div>
    </div>
  );
}
