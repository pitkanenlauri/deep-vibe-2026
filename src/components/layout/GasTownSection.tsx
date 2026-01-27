// src/components/layout/GasTownSection.tsx
// Gas Town build information section with expandable accordion
// Displays How It Works, Build Timeline, and Agent Credits

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { GasTown, Polecat, TimelineMilestone, BuildStats } from '../../schemas/profile.schema';

interface GasTownSectionProps {
  gasTown: GasTown;
  polecats: Polecat[];
  timeline: TimelineMilestone[];
  stats: BuildStats;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

const expandAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.4, ease: EASE },
      opacity: { duration: 0.25, delay: 0.15 }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: EASE },
      opacity: { duration: 0.2 }
    }
  }
} as const;

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE }
  }
} as const;

// Expandable Section Component
function ExpandableSection({
  id,
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  prefersReducedMotion
}: {
  id: string;
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  prefersReducedMotion: boolean | null;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="gas-town-accordion-item">
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
        className="gas-town-accordion-button"
      >
        <div className="flex items-center gap-3">
          <span className={`transition-transform ${prefersReducedMotion ? '' : 'duration-300'} ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-xl">{icon}</span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-title`}
            initial={prefersReducedMotion ? { opacity: 1 } : expandAnimation.initial}
            animate={prefersReducedMotion ? { opacity: 1 } : expandAnimation.animate}
            exit={prefersReducedMotion ? { opacity: 0 } : expandAnimation.exit}
            className="overflow-hidden"
          >
            <div className="gas-town-accordion-content">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// How It Works Content
function HowItWorksContent({ gasTown }: { gasTown: GasTown }) {
  return (
    <div className="space-y-4">
      <p className="gas-town-text-muted text-sm leading-relaxed">
        {gasTown.description}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {gasTown.roles.map((role) => (
          <div key={role.name} className="gas-town-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{role.emoji}</span>
              <span className="font-medium gas-town-text text-sm">{role.name}</span>
            </div>
            <p className="gas-town-text-muted text-xs leading-relaxed">{role.description}</p>
          </div>
        ))}
      </div>
      <a
        href={gasTown.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        github.com/steveyegge/gastown
      </a>
    </div>
  );
}

// Timeline Content
function TimelineContent({ timeline, prefersReducedMotion }: { timeline: TimelineMilestone[]; prefersReducedMotion: boolean | null }) {
  return (
    <motion.div
      className="space-y-0"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {timeline.map((item, index) => (
        <motion.div
          key={index}
          variants={prefersReducedMotion ? {} : staggerItem}
          className={`relative pl-6 pb-3 last:pb-0 ${item.highlight ? 'gas-town-highlight -mx-2 px-2 py-2 rounded-lg' : ''}`}
        >
          {/* Timeline line */}
          {index < timeline.length - 1 && (
            <div className="absolute left-[9px] top-[18px] w-[2px] h-[calc(100%-10px)] gas-town-timeline-line" />
          )}
          {/* Timeline dot */}
          <div className={`absolute left-0 top-1 w-[18px] h-[18px] rounded-full border-2 ${
            item.highlight
              ? 'bg-purple-500 border-purple-400'
              : 'gas-town-timeline-dot'
          }`} />
          {/* Content */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="gas-town-text font-medium text-sm">{item.title}</span>
                {item.beadsMerged && (
                  <span className="text-xs bg-purple-600/30 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded">
                    {item.beadsMerged} beads
                  </span>
                )}
              </div>
              <p className="gas-town-text-muted text-xs mt-0.5">{item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="gas-town-text-muted text-xs font-mono">{item.time}</div>
              <div className="gas-town-text-muted text-xs opacity-70">{item.date}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Agent Credits Content
function AgentCreditsContent({ polecats, prefersReducedMotion }: { polecats: Polecat[]; prefersReducedMotion: boolean | null }) {
  return (
    <motion.div
      className="space-y-2"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {polecats.map((polecat) => (
        <motion.div
          key={polecat.name}
          variants={prefersReducedMotion ? {} : staggerItem}
          className="gas-town-card p-3 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">🦨</span>
            <div>
              <div className="gas-town-text font-medium capitalize">{polecat.name}</div>
              <div className="gas-town-text-muted text-sm">{polecat.focus.join(', ')}</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-green-600 dark:text-green-400 font-mono font-bold">{polecat.beads}</div>
            <div className="gas-town-text-muted text-xs">beads</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Stats Bar Component
function StatsBar({ stats }: { stats: BuildStats }) {
  const items = [
    { value: stats.beads, label: 'beads' },
    { value: stats.agents, label: 'agents' },
    { value: stats.commits, label: 'commits' },
    { value: stats.duration, label: 'build' },
  ];

  return (
    <div className="grid grid-cols-4 gap-1 gas-town-stats-bar p-3 mt-4 rounded-lg">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="gas-town-text font-bold text-lg font-mono">{item.value}</div>
          <div className="gas-town-text-muted text-xs">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function GasTownSection({ gasTown, polecats, timeline, stats }: GasTownSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('how-it-works');
  const prefersReducedMotion = useReducedMotion();

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  return (
    <div className="gas-town-section">
      <ExpandableSection
        id="how-it-works"
        title="How It Works"
        icon="🏭"
        isExpanded={expandedSection === 'how-it-works'}
        onToggle={() => toggleSection('how-it-works')}
        prefersReducedMotion={prefersReducedMotion}
      >
        <HowItWorksContent gasTown={gasTown} />
      </ExpandableSection>

      <ExpandableSection
        id="timeline"
        title="Build Timeline"
        icon="📅"
        isExpanded={expandedSection === 'timeline'}
        onToggle={() => toggleSection('timeline')}
        prefersReducedMotion={prefersReducedMotion}
      >
        <TimelineContent timeline={timeline} prefersReducedMotion={prefersReducedMotion} />
      </ExpandableSection>

      <ExpandableSection
        id="agents"
        title="Agent Credits"
        icon="🦨"
        isExpanded={expandedSection === 'agents'}
        onToggle={() => toggleSection('agents')}
        prefersReducedMotion={prefersReducedMotion}
      >
        <AgentCreditsContent polecats={polecats} prefersReducedMotion={prefersReducedMotion} />
      </ExpandableSection>

      <StatsBar stats={stats} />
    </div>
  );
}
