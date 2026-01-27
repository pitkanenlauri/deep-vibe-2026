// src/components/easter-eggs/KonamiCode.tsx
// Konami code Easter egg revealing Gas Town build log
// Enhanced with expandable sections showing build timeline and agent credits

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { GasTown, Polecat, TimelineMilestone, BuildStats } from '../../schemas/profile.schema';

interface BuildLogProps {
  buildTimestamp: string;
  bundleSize: string;
  sourceUrl: string;
  gasTown?: GasTown;
  polecats?: Polecat[];
  timeline?: TimelineMilestone[];
  stats?: BuildStats;
}

// Konami code sequence: ↑↑↓↓←→←→BA
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Animation variants following existing patterns
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
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const staggerItem = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
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
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
        className="w-full px-4 py-3 flex items-center justify-between text-left
                   hover:bg-gray-800/50 transition-colors focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset"
      >
        <div className="flex items-center gap-3">
          <span className={`transition-transform ${prefersReducedMotion ? '' : 'duration-300'} ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-medium text-gray-200">{title}</span>
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
            <div className="px-4 pb-4">
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
      <p className="text-gray-300 text-sm leading-relaxed">
        {gasTown.description}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {gasTown.roles.map((role) => (
          <div key={role.name} className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{role.emoji}</span>
              <span className="font-medium text-white text-sm">{role.name}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{role.description}</p>
          </div>
        ))}
      </div>
      <a
        href={gasTown.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
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
          className={`relative pl-6 pb-4 last:pb-0 ${item.highlight ? 'bg-purple-900/20 -mx-4 px-4 py-2 rounded-lg' : ''}`}
        >
          {/* Timeline line */}
          {index < timeline.length - 1 && (
            <div className="absolute left-[9px] top-[18px] w-[2px] h-[calc(100%-10px)] bg-gray-700" />
          )}
          {/* Timeline dot */}
          <div className={`absolute left-0 top-1 w-[18px] h-[18px] rounded-full border-2 ${
            item.highlight
              ? 'bg-purple-500 border-purple-400'
              : 'bg-gray-700 border-gray-600'
          }`} />
          {/* Content */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{item.title}</span>
                {item.beadsMerged && (
                  <span className="text-xs bg-purple-600/50 text-purple-200 px-1.5 py-0.5 rounded">
                    {item.beadsMerged} beads
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-0.5">{item.description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-gray-400 text-xs font-mono">{item.time}</div>
              <div className="text-gray-500 text-xs">{item.date}</div>
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
          className="bg-gray-800 rounded-lg p-3 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">🦨</span>
            <div>
              <div className="text-white font-medium capitalize">{polecat.name}</div>
              <div className="text-gray-400 text-sm">{polecat.focus.join(', ')}</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-green-400 font-mono font-bold">{polecat.beads}</div>
            <div className="text-gray-500 text-xs">beads</div>
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
    <div className="grid grid-cols-4 gap-1 bg-gray-800/80 border-t border-gray-700 p-3">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-white font-bold text-lg font-mono">{item.value}</div>
          <div className="text-gray-500 text-xs">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function KonamiCode({
  buildTimestamp,
  bundleSize,
  sourceUrl,
  gasTown,
  polecats,
  timeline,
  stats
}: BuildLogProps) {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('how-it-works');
  const prefersReducedMotion = useReducedMotion();

  // Check if sequence matches Konami code
  const checkSequence = useCallback((sequence: string[]) => {
    if (sequence.length < KONAMI_SEQUENCE.length) return false;
    const recentKeys = sequence.slice(-KONAMI_SEQUENCE.length);
    return recentKeys.every((key, i) => key === KONAMI_SEQUENCE[i]);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.code;

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'].includes(key)) {
        setInputSequence([]);
        return;
      }

      setInputSequence(prev => {
        const newSequence = [...prev, key].slice(-KONAMI_SEQUENCE.length);

        if (checkSequence(newSequence)) {
          setIsOpen(true);
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkSequence]);

  // Show hint after 30 seconds on page
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  // Hide hint after showing
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return ts;
    }
  };

  // Check if we have enhanced data
  const hasEnhancedData = gasTown && polecats && timeline && stats;

  return (
    <>
      {/* Subtle hint */}
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 text-xs text-gray-400 font-mono z-40"
          >
            <span className="opacity-50">psst... try the konami code</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal content */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                         md:max-w-lg md:w-full bg-gray-900 rounded-xl shadow-2xl z-50 overflow-hidden
                         flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏭</span>
                    <div>
                      <h2 className="text-white font-bold text-lg">Gas Town Build Log</h2>
                      <p className="text-white/70 text-sm">You found the secret!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {hasEnhancedData ? (
                  /* Enhanced view with expandable sections */
                  <div>
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
                  </div>
                ) : (
                  /* Fallback: Legacy view */
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Build Info</h3>
                      <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                        <div className="flex justify-between text-gray-300 mb-2">
                          <span className="text-gray-500">timestamp:</span>
                          <span>{formatTimestamp(buildTimestamp)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300 mb-2">
                          <span className="text-gray-500">bundle:</span>
                          <span className="text-green-400">{bundleSize}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span className="text-gray-500">source:</span>
                          <a
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline truncate ml-2"
                          >
                            {sourceUrl.replace('https://github.com/', '')}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-4 border-t border-gray-800">
                      <p className="text-gray-500 text-sm">
                        This portfolio was built using{' '}
                        <span className="text-purple-400 font-semibold">Gas Town</span>{' '}
                        multi-agent workflow system.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Bar - Always visible */}
              {stats && <StatsBar stats={stats} />}

              {/* Footer */}
              <div className="bg-gray-800/50 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                  <span>↑↑↓↓←→←→BA</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Press ESC to close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
