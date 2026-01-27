import { motion, useReducedMotion } from 'framer-motion';

interface Education {
  id: string;
  degree: string;
  institution: string;
  focus: string;
  type: string;
  period: {
    start: string;
    end: string | null;
  };
  transferableInsight?: string;
  highlights?: string[];
}

interface Props {
  education: Education;
  index?: number;
  isLast?: boolean;
}

function formatPeriod(start: string, end: string | null): string {
  const formatDate = (dateStr: string) => {
    // Handle both "YYYY" and "YYYY-MM" formats
    if (!dateStr.includes('-')) {
      return dateStr; // Just year, return as-is
    }
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric' });
  };

  return `${formatDate(start)} — ${end ? formatDate(end) : 'Present'}`;
}

function getDegreeIcon(type: string): string {
  switch (type) {
    case 'master':
      return '🎓';
    case 'bachelor':
      return '📚';
    case 'doctorate':
      return '🔬';
    default:
      return '📖';
  }
}

export default function EducationCard({ education, index = 0, isLast: _isLast = false }: Props) {
  const prefersReducedMotion = useReducedMotion();

  const { degree, institution, focus, type, period, transferableInsight, highlights } = education;

  const cardVariants = {
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
        delay: prefersReducedMotion ? 0 : index * 0.2
      }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="education-card bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      aria-labelledby={`${education.id}-title`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`${education.id}-title`} className="text-title text-gray-900">
              {degree}
            </h3>
            <span className="text-2xl" aria-hidden="true">{getDegreeIcon(type)}</span>
          </div>
          <p className="text-body text-gray-600">{institution}</p>
          <p className="text-small text-muted">{formatPeriod(period.start, period.end)}</p>
        </div>

        {/* Focus Area Tag */}
        <div className="mt-4">
          <span className="px-3 py-1 text-small bg-primary-100 text-primary-700 rounded-full">
            {focus}
          </span>
        </div>

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <motion.ul
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.2 + 0.2
            }}
            viewport={{ once: true }}
          >
            {highlights.map((highlight, idx) => (
              <motion.li
                key={idx}
                className="text-small text-gray-600 flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : index * 0.2 + 0.3 + idx * 0.1
                }}
                viewport={{ once: true }}
              >
                <span className="text-primary-500 mt-0.5" aria-hidden="true">•</span>
                <span>{highlight}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Transferable Insight */}
        {transferableInsight && (
          <motion.blockquote
            className="mt-6 pl-4 border-l-2 border-primary-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.4,
              delay: prefersReducedMotion ? 0 : index * 0.2 + 0.4
            }}
            viewport={{ once: true }}
          >
            <p className="text-small text-gray-600 italic">
              "{transferableInsight}"
            </p>
          </motion.blockquote>
        )}
      </div>
    </motion.article>
  );
}
