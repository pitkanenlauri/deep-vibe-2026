import { useState, useRef, useEffect } from 'react';

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
}

function formatPeriod(start: string, end: string | null): string {
  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return `${formatDate(start)} — ${end ? formatDate(end) : 'Present'}`;
}

export default function TimelineItem({ experience }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

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

  return (
    <article
      className="timeline-item bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
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
      <div
        id={`${experience.id}-content`}
        role="region"
        aria-labelledby={`${experience.id}-title`}
        className={`overflow-hidden transition-all ${prefersReducedMotion ? '' : 'duration-300 ease-in-out'}`}
        style={{
          maxHeight: isExpanded ? `${height}px` : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div ref={contentRef} className="deep-dive px-6 pb-6 border-t border-gray-100">
          <div className="pt-6">
            {/* Context */}
            <div className="mb-6">
              <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Context
              </h4>
              <p className="text-body text-gray-700">{deepDive.context}</p>
            </div>

            {/* Metrics */}
            <div className="mb-6">
              <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Key Metrics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {deepDive.metrics.map((metric) => (
                  <div key={metric.label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-title text-primary-600 font-bold">{metric.value}</p>
                    <p className="text-small text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Highlights */}
            <div className="mb-6">
              <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Technical Highlights
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {deepDive.technicalHighlights.map((highlight, idx) => (
                  <li key={idx} className="text-body text-gray-700">{highlight}</li>
                ))}
              </ul>
            </div>

            {/* Leadership Highlights (optional) */}
            {deepDive.leadershipHighlights && deepDive.leadershipHighlights.length > 0 && (
              <div>
                <h4 className="text-small font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Leadership Highlights
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {deepDive.leadershipHighlights.map((highlight, idx) => (
                    <li key={idx} className="text-body text-gray-700">{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
