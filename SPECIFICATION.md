# Portfolio Website Technical Specification v2.0
## Code Name: DEEP-VIBE-2026

**Owner:** Lauri Pitkänen  
**Last Updated:** January 2026  
**Status:** Ready for Gastown Mayor

---

## 1. Executive Summary

A high-performance, AI-maintainable portfolio website that bridges **Physics-level analytical thinking** with **Engineering Management excellence**. The site should feel like meeting someone who is simultaneously warm, approachable, and technically brilliant—reflecting the consistent feedback of "professional with a good sense of humor" and "easy to work with while maintaining exceptionally high standards."

### Design Philosophy
The portfolio embodies: **"Analytical precision meets human warmth"**

This manifests as:
- Clean, data-driven visualizations (the physicist)
- Warm, conversational micro-copy (the collaborator)  
- Meticulous attention to details others overlook (the craftsman)
- Confident simplicity that signals expertise (the leader)

---

## 2. Core Principles

### 2.1 Technical Philosophy
Adhering to *The Philosophy of Software Design* (Ousterhout) and *Modern Software Engineering* (Farley):

| Principle | Implementation |
|-----------|----------------|
| **Complexity is the Enemy** | Single JSON data source, deep modules, minimal dependencies |
| **Impact over Activity** | Every section answers "what value did this create?" |
| **Obvious > Clever** | Readable code over impressive tricks; self-documenting structure |
| **Continuous Improvement** | Built-in feedback loops, easy iteration |

### 2.2 Personality Expression
Derived from 360° feedback patterns and personality assessments:

| Trait | Design Expression |
|-------|-------------------|
| **Analytical & Thorough** | Data visualizations, metrics-first storytelling |
| **Calm & Confident** | Generous whitespace, unhurried animations, clear hierarchy |
| **Warm & Approachable** | Conversational tone, soft color accents, human photography |
| **Quality-Obsessed** | Perfect pixel alignment, considered micro-interactions |
| **Curious & Learning** | "Currently exploring" section, reading list hints |
| **Direct & Honest** | No buzzword soup; concrete examples over claims |

---

## 3. Technical Stack

### 3.1 Core Technologies

```
Framework:      Astro 5.x (SSG for speed + island architecture)
Styling:        Tailwind CSS 4.x (utility-first, minimal custom CSS)
Motion:         Framer Motion (orchestrated, purposeful animations)
Data Layer:     TypeScript-validated JSON (single source of truth)
Type Safety:    Zod schemas (runtime validation for CI/CD)
Testing:        Vitest (unit/schema) + Playwright (E2E critical paths)
Deployment:     GitHub Actions → GitHub Pages
```

### 3.2 Performance Budget

| Metric | Target | Rationale |
|--------|--------|-----------|
| Lighthouse Performance | ≥95 | Excellence signal |
| First Contentful Paint | <1.2s | Respect visitor time |
| Total Bundle Size | <100KB (gzipped) | Minimal complexity |
| CLS | 0 | Visual stability |

### 3.3 Browser Support
Modern evergreen browsers (last 2 versions). No IE11 consideration—this portfolio targets technical decision-makers.

---

## 4. Information Architecture

### 4.1 Page Structure (Single Page, Section-Based)

```
┌─────────────────────────────────────────────────────────────┐
│  HERO: Impact Dashboard                                      │
│  "Engineering Manager | 3 Teams | €0.5M+ Impact"            │
│  [Animated metrics: 270h saved, 99.99% reliability, etc.]   │
├─────────────────────────────────────────────────────────────┤
│  HIGHLIGHT: Digia Award 2024 (subtle, not boastful)         │
├─────────────────────────────────────────────────────────────┤
│  EXPERIENCE: Interactive Timeline                            │
│  [Deep-dive toggles for technical/leadership details]        │
├─────────────────────────────────────────────────────────────┤
│  PHILOSOPHY: Engineering Beliefs                             │
│  [3 cards with principles + sources]                         │
├─────────────────────────────────────────────────────────────┤
│  SKILLS: Visual Competency Map                               │
│  [Radar/bar chart showing technical + leadership balance]    │
├─────────────────────────────────────────────────────────────┤
│  ROOTS: Physics Background                                   │
│  [Brief nod to quantum optics → analytical thinking]         │
├─────────────────────────────────────────────────────────────┤
│  META-FOOTER: The "How This Was Built" Story                 │
│  [Gastown agents, bundle size, last build, GitHub link]      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Content Hierarchy (Priority Order)

1. **Immediate Impact**: What value do I create? (Hero metrics)
2. **Credibility**: Recognition + specific achievements (Award, PAM case)
3. **Depth**: Detailed experience for those who want it (Timeline)
4. **Character**: How do I think and work? (Philosophy, Roots)
5. **Meta**: Technical craft of the portfolio itself (Footer)

---

## 5. Data Schema

### 5.1 Master Schema (TypeScript + Zod)

```typescript
// src/schemas/profile.schema.ts
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════
const ImpactStatSchema = z.object({
  id: z.string(),           // Unique key for animations
  value: z.string(),        // "270+"
  unit: z.string(),         // "hours/month"
  label: z.string(),        // "Time Saved"
  detail: z.string(),       // "PAM unemployment benefit automation"
  icon: z.string().optional(), // Icon identifier
});

const HeroSchema = z.object({
  name: z.string(),
  headline: z.string(),     // Role/title
  tagline: z.string(),      // One compelling sentence
  location: z.string(),
  impactStats: z.array(ImpactStatSchema).min(3).max(4),
  ctaLinks: z.array(z.object({
    label: z.string(),
    href: z.string().url(),
    icon: z.string(),
  })),
});

// ═══════════════════════════════════════════════════════════
// HIGHLIGHT SECTION (Award)
// ═══════════════════════════════════════════════════════════
const HighlightSchema = z.object({
  title: z.string(),        // "Digia Award 2024"
  category: z.string(),     // "Senior Trainee"
  context: z.string(),      // "1 of 6 from ~1,500 employees"
  description: z.string(),  // What it represents
  mediaUrl: z.string().url().optional(),
});

// ═══════════════════════════════════════════════════════════
// EXPERIENCE TIMELINE
// ═══════════════════════════════════════════════════════════
const MetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  period: z.object({
    start: z.string(),      // "2024-01"
    end: z.string().nullable(), // null = "Present"
  }),
  summary: z.string(),      // 2-3 sentence overview
  deepDive: z.object({
    context: z.string(),    // Expanded narrative
    technicalHighlights: z.array(z.string()),
    leadershipHighlights: z.array(z.string()).optional(),
    metrics: z.array(MetricSchema),
  }),
  tags: z.array(z.string()), // Skills/technologies
});

// ═══════════════════════════════════════════════════════════
// PHILOSOPHY CARDS
// ═══════════════════════════════════════════════════════════
const PhilosophySchema = z.object({
  id: z.string(),
  title: z.string(),        // "Complexity is the Enemy"
  belief: z.string(),       // Personal interpretation
  source: z.object({
    author: z.string(),     // "John Ousterhout"
    work: z.string(),       // "A Philosophy of Software Design"
  }).optional(),
});

// ═══════════════════════════════════════════════════════════
// SKILLS VISUALIZATION
// ═══════════════════════════════════════════════════════════
const SkillCategorySchema = z.object({
  category: z.string(),     // "Technical", "Leadership", "Domain"
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(5), // For visualization
    highlight: z.boolean().default(false),
  })),
});

// ═══════════════════════════════════════════════════════════
// ROOTS (Academic Background)
// ═══════════════════════════════════════════════════════════
const RootsSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  focus: z.string(),        // "Quantum Optics"
  transferableInsight: z.string(), // How it applies to software
});

// ═══════════════════════════════════════════════════════════
// META (Build Info)
// ═══════════════════════════════════════════════════════════
const AgenticMetaSchema = z.object({
  buildTimestamp: z.string().datetime(),
  agents: z.array(z.object({
    name: z.string(),       // "Architect", "Visualizer"
    contribution: z.string(),
  })),
  bundleSize: z.string(),   // "87KB"
  lighthouseScore: z.number().optional(),
  sourceUrl: z.string().url(),
});

// ═══════════════════════════════════════════════════════════
// MASTER EXPORT
// ═══════════════════════════════════════════════════════════
export const ProfileSchema = z.object({
  hero: HeroSchema,
  highlight: HighlightSchema,
  experience: z.array(ExperienceSchema),
  philosophy: z.array(PhilosophySchema).min(2).max(4),
  skills: z.array(SkillCategorySchema),
  roots: RootsSchema,
  meta: AgenticMetaSchema,
});

export type Profile = z.infer<typeof ProfileSchema>;
```

### 5.2 Sample Data Extraction

```json
{
  "hero": {
    "name": "Lauri Pitkänen",
    "headline": "Engineering Manager @ Digia | AI & Automation",
    "tagline": "I turn complex automation challenges into elegant, reliable systems—and help engineers do the best work of their careers.",
    "location": "Finland",
    "impactStats": [
      {
        "id": "time-saved",
        "value": "270+",
        "unit": "hours/month",
        "label": "Time Saved",
        "detail": "PAM unemployment benefit automation"
      },
      {
        "id": "reliability",
        "value": "99.99%",
        "unit": "uptime",
        "label": "System Reliability",
        "detail": "70,000+ applications processed annually"
      },
      {
        "id": "revenue",
        "value": "€0.5M+",
        "unit": "revenue",
        "label": "Business Impact",
        "detail": "Flagship client win → 30+ follow-up projects"
      },
      {
        "id": "team",
        "value": "16",
        "unit": "engineers",
        "label": "Team Size",
        "detail": "3 development teams, Trust score 4.8/5"
      }
    ],
    "ctaLinks": [
      { "label": "LinkedIn", "href": "https://linkedin.com/in/...", "icon": "linkedin" },
      { "label": "GitHub", "href": "https://github.com/...", "icon": "github" },
      { "label": "Email", "href": "mailto:...", "icon": "mail" }
    ]
  },
  "highlight": {
    "title": "Digia Award 2024",
    "category": "Senior Trainee",
    "context": "1 of 6 recipients from ~1,500 employees",
    "description": "Recognized for continuous learning and embodying company values in leadership & software engineering."
  },
  "philosophy": [
    {
      "id": "complexity",
      "title": "Complexity is the Enemy",
      "belief": "Every line of code, every process, every meeting should justify its existence. Simplicity isn't about doing less—it's about enabling more.",
      "source": { "author": "John Ousterhout", "work": "A Philosophy of Software Design" }
    },
    {
      "id": "impact",
      "title": "Impact Over Activity",
      "belief": "I measure success by outcomes: hours saved, reliability achieved, confidence restored. Activity without impact is just motion.",
      "source": { "author": "Dave Farley", "work": "Modern Software Engineering" }
    },
    {
      "id": "craft",
      "title": "Quality as a Daily Practice",
      "belief": "Quality isn't a phase or a gate—it's how you write every function, run every meeting, give every code review. Small disciplines compound."
    }
  ],
  "roots": {
    "degree": "M.Sc. Physics",
    "institution": "University of Turku",
    "focus": "Quantum Optics",
    "transferableInsight": "Physics taught me to find simple models for complex phenomena. That skill transfers directly to software architecture and organizational design."
  }
}
```

---

## 6. Visual Design Direction

### 6.1 Design Tokens

```css
/* Color Palette: "Calm Precision" */
:root {
  /* Primary - Deep, trustworthy blue */
  --color-primary-500: #2563eb;
  --color-primary-600: #1d4ed8;
  
  /* Neutral - Warm grays (not cold) */
  --color-gray-50: #fafaf9;
  --color-gray-100: #f5f5f4;
  --color-gray-800: #292524;
  --color-gray-900: #1c1917;
  
  /* Accent - Subtle warmth */
  --color-accent: #f59e0b;  /* Sparingly, for CTAs */
  
  /* Semantic */
  --color-success: #10b981;
  --color-text: var(--color-gray-800);
  --color-text-muted: #78716c;
  
  /* Spacing Scale (8px base) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-4xl: 2.25rem;
}
```

### 6.2 Animation Philosophy

**Principle**: Animations should feel **intentional and unhurried**, like a confident professional who doesn't need to rush.

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page load metrics | Staggered count-up | 800ms each | ease-out |
| Section reveals | Fade + subtle rise | 400ms | ease-out |
| Timeline expansion | Accordion slide | 300ms | ease-in-out |
| Hover states | Subtle scale/shadow | 150ms | ease-out |
| **No** | Bouncing, spinning, attention-grabbing | - | - |

### 6.3 Responsive Breakpoints

```css
/* Mobile-first approach */
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 7. Component Architecture

### 7.1 Component Tree

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro        # Minimal, appears on scroll
│   │   ├── Section.astro       # Consistent section wrapper
│   │   └── Footer.astro        # Meta/agentic info
│   │
│   ├── hero/
│   │   ├── Hero.astro          # Container
│   │   ├── ImpactDashboard.tsx # React island (animated)
│   │   └── StatCard.tsx        # Individual metric
│   │
│   ├── experience/
│   │   ├── Timeline.astro      # Static structure
│   │   ├── TimelineItem.tsx    # Expandable (React)
│   │   └── DeepDive.tsx        # Hidden details panel
│   │
│   ├── philosophy/
│   │   └── PhilosophyCard.astro
│   │
│   ├── skills/
│   │   └── SkillsChart.tsx     # SVG visualization
│   │
│   └── ui/
│       ├── Button.astro
│       ├── Tag.astro
│       └── Icon.astro
│
├── data/
│   └── profile.json            # Single source of truth
│
├── schemas/
│   └── profile.schema.ts       # Zod validation
│
├── styles/
│   └── global.css              # Tailwind + custom tokens
│
└── pages/
    └── index.astro             # Main composition
```

### 7.2 Island Architecture Strategy

| Component | Hydration | Reason |
|-----------|-----------|--------|
| ImpactDashboard | `client:visible` | Animate on scroll into view |
| TimelineItem | `client:visible` | Expand/collapse interaction |
| SkillsChart | `client:idle` | Non-critical, can wait |
| Everything else | Static | No JS needed |

---

## 8. Gastown Implementation Roadmap

### 8.1 Bead Sequence

```
BEAD A: Foundation (Agent: Architect)
├── Initialize Astro project with TypeScript strict mode
├── Configure Tailwind with design tokens
├── Create Zod schemas (profile.schema.ts)
├── Set up Vitest for schema validation
├── Create profile.json with real content
└── Validate: `npm run validate-schema` passes

BEAD B: Layout & Structure (Agent: Scaffolder)  
├── Build Section.astro wrapper component
├── Create responsive page layout
├── Implement smooth scroll navigation
├── Add minimal sticky header
└── Validate: Mobile + desktop layouts render correctly

BEAD C: Hero & Impact Dashboard (Agent: Visualizer)
├── Build Hero.astro container
├── Create ImpactDashboard.tsx with Framer Motion
├── Implement staggered count-up animations
├── Add responsive stat card grid
└── Validate: Lighthouse performance ≥95, animations smooth

BEAD D: Experience Timeline (Agent: Historian)
├── Build Timeline.astro with semantic HTML
├── Create expandable TimelineItem.tsx
├── Implement DeepDive panel with metrics
├── Add print-friendly styles
└── Validate: Accessibility audit passes, keyboard nav works

BEAD E: Philosophy & Roots (Agent: Storyteller)
├── Create PhilosophyCard.astro
├── Build Roots section with academic connection
├── Add subtle blockquote styling
└── Validate: Content renders correctly from JSON

BEAD F: Skills Visualization (Agent: Chartist)
├── Design skills data structure
├── Create SkillsChart.tsx (SVG-based)
├── Implement responsive scaling
└── Validate: Chart readable at all breakpoints

BEAD G: Meta Footer (Agent: Reporter)
├── Display build metadata dynamically
├── Show Gastown agent credits
├── Add GitHub source link
├── Inject bundle size at build time
└── Validate: Build info updates automatically

BEAD H: Polish & Testing (Agent: QA)
├── Write Playwright E2E tests (critical paths)
├── Conduct accessibility audit (axe-core)
├── Optimize images (if any)
├── Performance budget verification
└── Validate: All tests green, Lighthouse ≥95

BEAD I: Deployment (Agent: Deployer)
├── Configure GitHub Actions workflow
├── Set up GitHub Pages
├── Add caching headers
├── Create deployment documentation
└── Validate: Site live, CI/CD working
```

### 8.2 Agent Responsibilities

| Agent | Focus | Key Deliverables |
|-------|-------|------------------|
| **Architect** | Foundation, structure, validation | Schemas, config, project setup |
| **Scaffolder** | Layout, responsive design | Section components, navigation |
| **Visualizer** | Animations, visual impact | Hero, dashboard, motion design |
| **Historian** | Experience, timeline | Timeline component, data display |
| **Storyteller** | Philosophy, narrative | Content sections, copy polish |
| **Chartist** | Data visualization | Skills chart, metrics display |
| **Reporter** | Meta information | Footer, build info, documentation |
| **QA** | Quality assurance | Tests, accessibility, performance |
| **Deployer** | CI/CD, hosting | GitHub Actions, deployment |

---

## 9. Content Guidelines

### 9.1 Tone of Voice

**Do:**
- Use first person sparingly ("I led" → "Led")
- Lead with outcomes, follow with methods
- Be specific: "270 hours/month" not "significant time savings"
- Show confidence without arrogance

**Don't:**
- Use buzzwords without substance
- Overuse superlatives ("best", "amazing", "revolutionary")
- List technologies without context
- Sound like a generic LinkedIn profile

### 9.2 Example Copy Transformations

| Before (Generic) | After (Specific + Human) |
|------------------|--------------------------|
| "Passionate software engineer" | "I obsess over the details that make systems reliable" |
| "Led team of developers" | "Led 16 engineers across 3 teams; trust score 4.8/5" |
| "Improved efficiency" | "Automated process: 70k applications/year, 270h saved monthly" |
| "Strong communication skills" | (Show, don't tell—let the writing speak for itself) |

---

## 10. Testing Strategy

### 10.1 Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  Playwright: 5-10 critical paths
                    │ (slow)  │  - Page loads, navigation works
                    └────┬────┘  - Timeline expands/collapses
                         │       - Mobile responsive
                    ┌────┴────┐
                    │  Integ  │  Vitest: Component integration
                    │ (fast)  │  - Data flows to components
                    └────┬────┘  - Schema → render correctness
                         │
               ┌─────────┴─────────┐
               │      Unit         │  Vitest: Schema validation
               │    (fastest)      │  - profile.json is valid
               └───────────────────┘  - Edge cases handled
```

### 10.2 CI/CD Checks (All Must Pass)

```yaml
- npm run lint          # ESLint + Prettier
- npm run typecheck     # TypeScript strict
- npm run test          # Vitest
- npm run test:e2e      # Playwright
- npm run build         # Astro build
- npm run lighthouse    # Performance budget
```

---

## 11. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Semantic HTML | Proper heading hierarchy, landmarks |
| Keyboard navigation | All interactive elements focusable |
| Screen reader support | ARIA labels where needed |
| Color contrast | WCAG AA minimum (4.5:1) |
| Reduced motion | `prefers-reduced-motion` media query |
| Focus indicators | Visible focus rings |

---

## 12. SEO Considerations

```html
<title>Lauri Pitkänen | Engineering Manager & AI Automation Leader</title>
<meta name="description" content="Engineering Manager leading 16 engineers in AI & Automation. Delivered systems processing 70k+ applications annually at 99.99% reliability.">
<meta property="og:image" content="/og-image.png">
<!-- Structured data for person/professional -->
```

---

## 13. Maintenance & Evolution

### 13.1 Content Update Workflow

```
1. Edit src/data/profile.json
2. Run `npm run validate-schema`
3. Commit & push
4. GitHub Actions rebuilds & deploys
```

### 13.2 Future Enhancements (Out of Scope for v1)

- Blog/writing section
- Dark mode toggle
- Multi-language support (Finnish)
- Interactive project case studies
- Visitor analytics (privacy-respecting)

---

## 14. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | ≥95 | CI check |
| Lighthouse Accessibility | 100 | CI check |
| Time to Interactive | <2s | Lighthouse |
| Schema Validation | 0 errors | CI check |
| E2E Tests | 100% pass | CI check |
| Mobile Usability | No issues | Manual QA |
| "Would I hire this person?" | Yes | Peer review |

---

## Appendix A: Key Differentiators

What makes this portfolio stand out:

1. **Metrics-First Storytelling**: Impact dashboard immediately communicates value
2. **Physics-to-Software Arc**: Unique background as narrative device
3. **Meta-Transparency**: "Here's how this was built" builds trust
4. **Deep Dive Toggle**: Respects reader's time while allowing exploration
5. **AI-Native Workflow**: Demonstrates cutting-edge development practices
6. **Quality Signals**: Performance scores, clean code, thoughtful details

---

## Appendix B: Personality Insights (Design Reference)

*Derived from 360° feedback and assessments—these inform design decisions:*

**Consistent Themes Across All Feedback:**
- "Professional with a good sense of humor"
- "Easy to work with, easy to approach"  
- "Thorough, doesn't cut corners"
- "Creates positive atmosphere, builds trust"
- "Explains things clearly"
- "Quality-focused, maintainable solutions"

**Design Implications:**
- Warm but not casual; professional but not cold
- Clear information hierarchy (thoroughness expressed through organization)
- Subtle moments of personality (micro-copy, animation character)
- Trust-building through transparency (meta section, source code)

---

*Document ready for Gastown Mayor handoff.*
