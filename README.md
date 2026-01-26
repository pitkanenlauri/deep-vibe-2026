# DEEP-VIBE-2026

Portfolio website for Lauri Pitkänen - Engineering Manager & AI Automation Leader.

## Tech Stack

- **Framework:** Astro 5.x (SSG + island architecture)
- **UI Framework:** React 19.x (client-side islands)
- **Styling:** Tailwind CSS 4.x + custom design tokens
- **Animations:** Framer Motion (orchestrated motion)
- **Type Safety:** TypeScript + Zod schemas
- **Testing:** Vitest (unit/schema) + Playwright (E2E)
- **Performance:** Lighthouse CI
- **Deployment:** GitHub Pages + GitHub Actions

## Key Features

- Interactive React components (ImpactDashboard, SkillsChart, Timeline)
- Animated space background with stars, rockets, comets, and satellites (dark mode)
- Data-driven content from single JSON source with Zod validation
- Full test coverage: unit tests, E2E tests, and performance budgets
- Dark/light theme toggle with system preference detection
- Easter eggs (try the Konami code)

## Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run validate-schema` | Validate profile.json against schema |
| `npm run lighthouse` | Run Lighthouse CI audit |

## Project Structure

```
src/
├── components/
│   ├── hero/              # Impact dashboard, hero section
│   ├── experience/        # Interactive timeline
│   ├── skills/            # Skill visualization chart
│   ├── education/         # Education timeline
│   ├── background/        # Animated space background
│   ├── animations/        # Scroll reveals & animated sections
│   ├── layout/            # Header, footer, section wrappers
│   ├── philosophy/        # Philosophy cards
│   ├── ui/                # Theme toggle, reusable UI
│   └── easter-eggs/       # Konami code easter egg
├── data/profile.json      # Single source of truth for content
├── schemas/               # Zod validation schemas
├── styles/global.css      # Design tokens & Tailwind config
└── pages/index.astro      # Main entry point
```

## Design System

- **Theme:** "Calm Precision" - Analytical rigor meets human warmth
- **Mode:** Dark-first design with light mode support
- **Colors:** Custom dark palette with vibrant blue/purple accents
- **Typography:** Inter (UI) + JetBrains Mono (code)

## Performance Targets

- Lighthouse Score: ≥95
- First Contentful Paint: <1.2s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub Pages setup, CI/CD configuration, and performance budgeting.

Live site: https://pitkanenlauri.github.io/deep-vibe-2026/
