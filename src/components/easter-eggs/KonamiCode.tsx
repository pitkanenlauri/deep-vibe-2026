// src/components/easter-eggs/KonamiCode.tsx
// Konami code Easter egg - Terminal build log simulation
// Shows a retro terminal with auto-scrolling fake build output

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Konami code sequence: ↑↑↓↓←→←→BA
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Build log entries - simulated build process
const BUILD_LOG = [
  { time: '11:33:42', agent: 'mayor', message: 'Initializing Gas Town swarm...' },
  { time: '11:33:45', agent: 'mayor', message: 'Parsing SPECIFICATION.md (27KB)' },
  { time: '11:33:48', agent: 'mayor', message: 'Creating 7 beads for parallel execution' },
  { time: '11:34:02', agent: 'mayor', message: 'Assigning dv-k6c (Foundation) → furiosa' },
  { time: '11:34:03', agent: 'polecat', name: 'furiosa', message: 'Claimed bead dv-k6c' },
  { time: '11:34:15', agent: 'polecat', name: 'furiosa', message: 'npm create astro@latest ✓' },
  { time: '11:35:22', agent: 'polecat', name: 'furiosa', message: 'Created src/schemas/profile.schema.ts' },
  { time: '11:48:30', agent: 'polecat', name: 'furiosa', message: 'Foundation complete, submitting MR' },
  { time: '11:48:35', agent: 'refinery', message: 'Received MR dv-abc from furiosa' },
  { time: '11:48:42', agent: 'refinery', message: 'Running tests... ✓' },
  { time: '11:48:50', agent: 'refinery', message: 'Merged dv-k6c to main' },
  { time: '11:49:00', agent: 'mayor', message: 'Dispatching parallel work to polecats...' },
  { time: '14:55:00', agent: 'polecat', name: 'nux', message: 'Hero section complete!' },
  { time: '14:55:02', agent: 'polecat', name: 'slit', message: 'Timeline component ready' },
  { time: '14:55:05', agent: 'polecat', name: 'rictus', message: 'Philosophy cards done' },
  { time: '14:55:08', agent: 'polecat', name: 'dementus', message: 'Skills chart submitted' },
  { time: '14:55:10', agent: 'polecat', name: 'capable', message: 'Meta footer ready' },
  { time: '14:57:00', agent: 'refinery', message: 'Processing merge queue (6 MRs)' },
  { time: '14:57:08', agent: 'refinery', message: 'Conflict in src/pages/index.astro' },
  { time: '14:57:12', agent: 'refinery', message: 'Auto-resolved: keeping both imports' },
  { time: '14:57:15', agent: 'refinery', message: 'Resolved 3 conflicts automatically' },
  { time: '14:57:30', agent: 'witness', message: 'Swarm peak detected - 6 parallel merges!' },
  { time: '15:00:00', agent: 'witness', message: 'All polecats reported complete' },
  { time: '15:00:05', agent: 'mayor', message: 'Portfolio build successful!' },
  { time: '15:00:10', agent: 'mayor', message: 'Deploying to GitHub Pages...' },
  { time: '15:04:22', agent: 'success', message: 'Live at pitkanenlauri.github.io/deep-vibe-2026' },
  { time: '', agent: 'final', message: '' },
  { time: '', agent: 'final', message: '> You found the secret! 🎩' },
];

function getAgentEmoji(agent: string): string {
  switch (agent) {
    case 'mayor': return '🎩';
    case 'polecat': return '🦨';
    case 'refinery': return '🏭';
    case 'witness': return '🦉';
    case 'success': return '✅';
    default: return '>';
  }
}

function getAgentClass(agent: string): string {
  switch (agent) {
    case 'mayor': return 'terminal-mayor';
    case 'polecat': return 'terminal-polecat';
    case 'refinery': return 'terminal-refinery';
    case 'witness': return 'terminal-witness';
    case 'success': return 'terminal-success';
    default: return '';
  }
}

export default function KonamiCode() {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
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
          setVisibleLines(0);
          setIsComplete(false);
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkSequence]);

  // Auto-scroll terminal and reveal lines
  useEffect(() => {
    if (!isOpen || isComplete) return;

    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= BUILD_LOG.length) {
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, prefersReducedMotion ? 50 : 150);

    return () => clearInterval(interval);
  }, [isOpen, isComplete, prefersReducedMotion]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

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

      {/* Terminal Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Terminal */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                         md:max-w-2xl md:w-full terminal-container z-50 flex flex-col max-h-[85vh]"
            >
              {/* Terminal Header */}
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot terminal-dot-red" />
                  <span className="terminal-dot terminal-dot-yellow" />
                  <span className="terminal-dot terminal-dot-green" />
                </div>
                <span className="terminal-title">GAS TOWN TERMINAL — deep_vibe_2026</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="Close terminal"
                >
                  ✕
                </button>
              </div>

              {/* Terminal Body */}
              <div ref={terminalRef} className="terminal-body flex-1 relative">
                <div className="terminal-scanlines" />
                {BUILD_LOG.slice(0, visibleLines).map((entry, index) => (
                  <div key={index} className="terminal-line">
                    {entry.time && (
                      <span className="terminal-timestamp">[{entry.time}] </span>
                    )}
                    {entry.agent !== 'final' && (
                      <>
                        <span className={getAgentClass(entry.agent)}>
                          {getAgentEmoji(entry.agent)}{' '}
                          {entry.agent === 'polecat' && entry.name ? entry.name : entry.agent.charAt(0).toUpperCase() + entry.agent.slice(1)}:
                        </span>{' '}
                      </>
                    )}
                    <span>{entry.message}</span>
                  </div>
                ))}
                {!isComplete && (
                  <span className="terminal-cursor" />
                )}
              </div>

              {/* Terminal Footer */}
              <div className="terminal-footer">
                <span className="font-mono">↑↑↓↓←→←→BA</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:text-white transition-colors"
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
