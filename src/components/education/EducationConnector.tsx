import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  isLast?: boolean;
  index?: number;
  degreeType?: string;
}

function getDotColor(degreeType?: string): string {
  switch (degreeType) {
    case 'master':
      return 'var(--color-purple-500)';
    case 'bachelor':
      return 'var(--color-primary-500)';
    case 'doctorate':
      return 'var(--color-purple-700)';
    default:
      return 'var(--color-primary-500)';
  }
}

function getDegreeLabel(degreeType?: string): string {
  switch (degreeType) {
    case 'master':
      return 'M.Sc.';
    case 'bachelor':
      return 'B.Sc.';
    case 'doctorate':
      return 'Ph.D.';
    default:
      return '';
  }
}

export default function EducationConnector({ isLast = false, index = 0, degreeType }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const dotColor = getDotColor(degreeType);
  const degreeLabel = getDegreeLabel(degreeType);

  if (isLast) {
    return (
      <div className="education-connector education-connector--last" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="education-dot"
        >
          <motion.circle
            cx="12"
            cy="12"
            r="6"
            fill={dotColor}
            stroke="var(--color-background)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.2 + 0.2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        </svg>
        {degreeLabel && (
          <motion.div
            className="degree-badge"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.2 + 0.4
            }}
          >
            <span className="degree-badge__text">{degreeLabel}</span>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="education-connector" aria-hidden="true">
      <svg
        width="24"
        height="100%"
        viewBox="0 0 24 100"
        preserveAspectRatio="xMidYMin slice"
        className="education-svg"
      >
        {/* Timeline dot */}
        <motion.circle
          cx="12"
          cy="12"
          r="6"
          fill={dotColor}
          stroke="var(--color-background)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : index * 0.2 + 0.2,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />

        {/* Connection line with gradient effect */}
        <motion.line
          x1="12"
          y1="20"
          x2="12"
          y2="100"
          stroke="var(--color-gray-200)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            delay: prefersReducedMotion ? 0 : index * 0.2 + 0.4,
            ease: 'easeOut'
          }}
        />

        {/* Arrow indicating progression */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : index * 0.2 + 0.6
          }}
        >
          <motion.path
            d="M12 55 L8 63 L16 63 Z"
            fill="var(--color-primary-300)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : index * 0.2 + 0.7,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        </motion.g>
      </svg>

      {/* Degree badge */}
      {degreeLabel && (
        <motion.div
          className="degree-badge"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : index * 0.2 + 0.5
          }}
        >
          <span className="degree-badge__text">{degreeLabel}</span>
        </motion.div>
      )}
    </div>
  );
}
