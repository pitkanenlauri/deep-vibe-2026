module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    assert: {
      // Using custom assertions only (no preset for cleaner control)
      assertions: {
        // Performance budget from spec
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],

        // Bundle size enforcement (via total byte weight)
        'total-byte-weight': ['warn', { maxNumericValue: 200000 }],

        // Console errors (warn only - some are expected from theme toggle)
        'errors-in-console': 'warn',

        // Accessibility requirements
        'color-contrast': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'heading-order': 'warn',
        'link-name': 'error',
        'button-name': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
