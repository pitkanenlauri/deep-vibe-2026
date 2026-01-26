import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  isPromotion?: boolean;
  isLast?: boolean;
  index?: number;
}

export default function TimelineConnector({ isPromotion = false, isLast = false, index = 0 }: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (isLast) {
    return (
      <div className="timeline-connector timeline-connector--last" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="timeline-dot"
        >
          <motion.circle
            cx="12"
            cy="12"
            r="6"
            fill="var(--color-primary-500)"
            stroke="var(--color-background)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.15 + 0.2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`timeline-connector ${isPromotion ? 'timeline-connector--promotion' : ''}`}
      aria-hidden="true"
    >
      <svg
        width="24"
        height="100%"
        viewBox="0 0 24 100"
        preserveAspectRatio="xMidYMin slice"
        className="timeline-svg"
      >
        {/* Timeline dot */}
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          fill={isPromotion ? 'var(--color-success-500)' : 'var(--color-primary-500)'}
          stroke="var(--color-background)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : index * 0.15 + 0.2,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />

        {/* Connection line */}
        <motion.line
          x1="12"
          y1="20"
          x2="12"
          y2="100"
          stroke={isPromotion ? 'var(--color-success-300)' : 'var(--color-gray-200)'}
          strokeWidth="2"
          strokeDasharray={isPromotion ? '0' : '0'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : index * 0.15 + 0.4,
            ease: 'easeOut'
          }}
        />

        {/* Promotion indicator - upward arrow */}
        {isPromotion && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.15 + 0.8
            }}
          >
            <motion.path
              d="M12 60 L8 68 L16 68 Z"
              fill="var(--color-success-500)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : index * 0.15 + 0.9,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            />
          </motion.g>
        )}
      </svg>

    </div>
  );
}
