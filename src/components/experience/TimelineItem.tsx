import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Metric {
  value: string;
  label: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  period: {
    start: string;
    end: string | null;
  };
  summary: string;
  deepDive: {
    context: string;
    technicalHighlights: string[];
    leadershipHighlights?: string[];
    metrics: Metric[];
  };
  tags: string[];
}

interface Props {
  experience: Experience;
  index?: number;
  isPromotion?: boolean;
}

function formatPeriod(start: string, end: string | null): string {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return `${formatDate(start)} — ${end ? formatDate(end) : 'Present'}`;
}

export default function TimelineItem({ experience, index = 0, isPromotion = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const { role, company, period, summary, deepDive, tags } = experience;

  // Animation variants for scroll reveal
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -24
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: prefersReducedMotion ? 0 : index * 0.15
      }
    }
  };

  return (
    <motion.article
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`timeline-item bg-white rounded-lg border shadow-sm overflow-hidden ${
        isPromotion ? 'border-success-200 ring-1 ring-success-100' : 'border-gray-200'
      }`}
      aria-labelledby={`${experience.id}-title`}
    >
      {/* Header - Always visible */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`${experience.id}-content`}
        className="w-full text-left p-6 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`${experience.id}-title`} className="text-title text-gray-900">
              {role}
            </h3>
            <span
              className={`shrink-0 transition-transform ${prefersReducedMotion ? '' : 'duration-300'} ${isExpanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <p className="text-body text-gray-600">{company}</p>
          <p className="text-small text-muted">{formatPeriod(period.start, period.end)}</p>
        </div>
        <p className="text-body mt-3">{summary}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4" aria-label="Skills and technologies">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-small bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      {/* Expandable DeepDive Panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`${experience.id}-content`}
            role="region"
            aria-labelledby={`${experience.id}-title`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: {
                  duration: prefersReducedMotion ? 0 : 0.4,
                  ease: [0.25, 0.1, 0.25, 1]
                },
                opacity: {
                  duration: prefersReducedMotion ? 0 : 0.25,
                  delay: prefersReducedMotion ? 0 : 0.15
                }
              }
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: prefersReducedMotion ? 0 : 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                },
                opacity: {
                  duration: prefersReducedMotion ? 0 : 0.2
                }
              }
            }}
            className="overflow-hidden"
          >
            <div className="deep-dive px-6 pb-6 border-t border-gray-100">
              <div className="pt-6">
                {/* Context */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : 0.1
                  }}
                >
                  <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Context
                  </h4>
                  <p className="text-body text-gray-700">{deepDive.context}</p>
                </motion.div>

                {/* Metrics */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : 0.2
                  }}
                >
                  <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {deepDive.metrics.map((metric, metricIdx) => (
                      <motion.div
                        key={metric.label}
                        className="text-center p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.3,
                          delay: prefersReducedMotion ? 0 : 0.25 + metricIdx * 0.05
                        }}
                      >
                        <p className="text-title text-primary-600 font-bold">{metric.value}</p>
                        <p className="text-small text-muted">{metric.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Technical Highlights */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.3,
                    delay: prefersReducedMotion ? 0 : 0.35
                  }}
                >
                  <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Technical Highlights
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {deepDive.technicalHighlights.map((highlight, idx) => (
                      <motion.li
                        key={idx}
                        className="text-body text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 0.2,
                          delay: prefersReducedMotion ? 0 : 0.4 + idx * 0.05
                        }}
                      >
                        {highlight}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Leadership Highlights (optional) */}
                {deepDive.leadershipHighlights && deepDive.leadershipHighlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.3,
                      delay: prefersReducedMotion ? 0 : 0.5
                    }}
                  >
                    <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Leadership Highlights
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {deepDive.leadershipHighlights.map((highlight, idx) => (
                        <motion.li
                          key={idx}
                          className="text-body text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.2,
                            delay: prefersReducedMotion ? 0 : 0.55 + idx * 0.05
                          }}
                        >
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
