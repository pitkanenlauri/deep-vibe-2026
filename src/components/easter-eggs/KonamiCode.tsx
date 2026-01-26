// src/components/easter-eggs/KonamiCode.tsx
// Konami code Easter egg revealing Gas Town build log
// Built by: mayor for dv-jlhz

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Agent {
  name: string;
  contribution: string;
}

interface BuildLogProps {
  agents: Agent[];
  buildTimestamp: string;
  bundleSize: string;
  sourceUrl: string;
}

// Konami code sequence: ↑↑↓↓←→←→BA
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export default function KonamiCode({ agents, buildTimestamp, bundleSize, sourceUrl }: BuildLogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
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
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.code;

      // Only track relevant keys
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
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Hide hint after showing
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000);
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
                         md:max-w-lg md:w-full bg-gray-900 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
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

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Build info */}
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

                {/* Agents */}
                <div className="mb-6">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                    Polecat Agents ({agents.length})
                  </h3>
                  <div className="space-y-2">
                    {agents.map((agent, index) => (
                      <motion.div
                        key={agent.name}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-3 flex items-start gap-3"
                      >
                        <span className="text-lg">
                          {getAgentEmoji(agent.name)}
                        </span>
                        <div>
                          <div className="text-white font-medium">{agent.name}</div>
                          <div className="text-gray-400 text-sm">{agent.contribution}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Easter egg message */}
                <div className="text-center py-4 border-t border-gray-800">
                  <p className="text-gray-500 text-sm">
                    This portfolio was built using the{' '}
                    <span className="text-purple-400 font-semibold">Gas Town</span>{' '}
                    multi-agent workflow system.
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Each agent is a specialized Claude instance working in concert.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800/50 px-6 py-3 flex items-center justify-between">
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

function getAgentEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    'Architect': '🏗️',
    'Scaffolder': '🪜',
    'Visualizer': '🎨',
    'Historian': '📜',
    'Storyteller': '📖',
    'Chartist': '📊',
    'Reporter': '📰',
    'QA': '🔍',
    'Deployer': '🚀',
    'Furiosa': '⚡',
    'Mayor': '🎩',
  };
  return emojiMap[name] || '🤖';
}
