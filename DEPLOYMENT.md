# Deployment Guide

## GitHub Pages Deployment

This portfolio is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Setup Steps

1. **Enable GitHub Pages in Repository Settings**
   - Go to repository Settings > Pages
   - Under "Source", select "GitHub Actions"

2. **Configure Site URL (Optional)**

   For custom domains or specific GitHub Pages URLs, set environment variables in your GitHub repository:

   - `SITE_URL`: Your site's full URL (e.g., `https://yourusername.github.io`)
   - `BASE_PATH`: For project pages, set to `/repository-name`

   To set these:
   - Go to Settings > Secrets and variables > Actions > Variables
   - Add `SITE_URL` and `BASE_PATH` as repository variables

3. **Custom Domain (Optional)**

   To use a custom domain:
   - Add a `CNAME` file to the `public/` directory with your domain
   - Configure DNS as per [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
   - Set `SITE_URL` to your custom domain

### Deployment Workflow

The CI/CD pipeline (`.github/workflows/deploy.yml`) runs on every push to `main`:

| Stage | Description |
|-------|-------------|
| **Build** | Type check, schema validation, unit tests, Astro build |
| **E2E Tests** | Playwright tests against built site |
| **Lighthouse** | Performance, accessibility, SEO audits |
| **Deploy** | Publish to GitHub Pages (only if all checks pass) |

### Manual Deployment

Trigger a manual deployment:
- Go to Actions > "Deploy to GitHub Pages" > "Run workflow"

### Environment Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SITE_URL` | Full site URL | `https://lauri.dev` |
| `BASE_PATH` | Path prefix for project pages | `/deep-vibe-2026` |
| `LHCI_GITHUB_APP_TOKEN` | (Optional) Lighthouse CI status checks | GitHub App token |

## Caching Strategy

### Asset Caching

All generated assets are fingerprinted for optimal caching:

- **Fingerprinted assets** (`/_assets/*`): 1 year cache, immutable
- **HTML pages**: No cache, always revalidate
- **Fonts**: 1 year cache, immutable
- **Images**: 1 week cache with stale-while-revalidate

### Cache Headers

The `public/_headers` file configures caching for platforms that support it (Cloudflare Pages, Netlify, Vercel).

For GitHub Pages:
- Astro's asset fingerprinting provides automatic cache busting
- GitHub Pages sets default cache headers for static assets

## Performance Budget

The deployment enforces these performance requirements via Lighthouse CI:

| Metric | Target |
|--------|--------|
| Performance Score | ≥ 95 |
| Accessibility Score | 100 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |
| First Contentful Paint | < 1.2s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | 0 |
| Total Bundle Size | < 150KB |

## Troubleshooting

### Build Fails

1. Check type errors: `npm run typecheck`
2. Validate schema: `npm run validate-schema`
3. Run tests locally: `npm run test`

### E2E Tests Fail

1. Build the site: `npm run build`
2. Run E2E locally: `npm run test:e2e`
3. Check Playwright report in CI artifacts

### Lighthouse Score Too Low

1. Run locally: `npm run build && npm run lighthouse`
2. Check for large images or blocking resources
3. Verify accessibility in dev tools

## Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

The site will be available at `http://localhost:4321`.
