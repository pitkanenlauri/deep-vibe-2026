# DEEP-VIBE-2026

Portfolio website for Lauri Pitkänen - Engineering Manager & AI Automation Leader.

## Tech Stack

- **Framework:** Astro 5.x (SSG + island architecture)
- **Styling:** Tailwind CSS 4.x
- **Data Validation:** Zod schemas
- **Testing:** Vitest

## Commands

| Command | Action |
|:--------|:-------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build production site to ./dist/ |
| `npm run test` | Run all tests |
| `npm run validate-schema` | Validate profile.json against schema |

## Project Structure

```
src/
├── data/profile.json       # Content data (single source of truth)
├── schemas/
│   ├── profile.schema.ts   # Zod validation schemas
│   └── profile.schema.test.ts
├── styles/global.css       # Tailwind + design tokens
└── pages/index.astro       # Main page
```

## Status

In development via Gastown agents.
