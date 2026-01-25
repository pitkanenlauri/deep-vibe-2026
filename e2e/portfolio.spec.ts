import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Portfolio Site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load', () => {
    test('page loads with correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/Lauri Pitkänen/);
    });

    test('hero section displays name and headline', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Lauri Pitkänen' })).toBeVisible();
      await expect(page.getByText('Engineering Manager @ Digia | AI & Automation')).toBeVisible();
    });

    test('impact stats are visible', async ({ page }) => {
      await expect(page.getByText('270+')).toBeVisible();
      await expect(page.getByText('99.99%')).toBeVisible();
      await expect(page.getByText('€0.5M+')).toBeVisible();
      await expect(page.getByText('16')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('header contains navigation links', async ({ page }) => {
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
    });

    test('all main sections are present', async ({ page }) => {
      await expect(page.locator('#hero')).toBeVisible();
      await expect(page.locator('#highlight')).toBeVisible();
      await expect(page.locator('#experience')).toBeVisible();
      await expect(page.locator('#philosophy')).toBeVisible();
      await expect(page.locator('#skills')).toBeVisible();
      await expect(page.locator('#roots')).toBeVisible();
    });
  });

  test.describe('Highlight Section', () => {
    test('displays Digia Award information', async ({ page }) => {
      await expect(page.getByText('Digia Award 2024')).toBeVisible();
      await expect(page.getByText('1 of 6 recipients from ~1,500 employees')).toBeVisible();
    });
  });

  test.describe('Experience Timeline', () => {
    test('timeline items are visible', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Engineering Manager' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Senior Software Developer' })).toBeVisible();
    });

    test('timeline item expands and collapses on click', async ({ page }) => {
      const firstTimelineItem = page.locator('.timeline-item').first();
      const expandButton = firstTimelineItem.getByRole('button');
      const deepDiveContent = firstTimelineItem.locator('.deep-dive');

      // Initially collapsed - content should not be visible
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');

      // Click to expand
      await expandButton.click();
      await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      await expect(deepDiveContent).toBeVisible();

      // Verify deep dive content is shown
      await expect(firstTimelineItem.getByText('Context')).toBeVisible();
      await expect(firstTimelineItem.getByText('Key Metrics')).toBeVisible();

      // Click to collapse
      await expandButton.click();
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('timeline item expands with keyboard', async ({ page }) => {
      const firstTimelineItem = page.locator('.timeline-item').first();
      const expandButton = firstTimelineItem.getByRole('button');

      // Focus the button
      await expandButton.focus();
      await expect(expandButton).toBeFocused();

      // Press Enter to expand
      await page.keyboard.press('Enter');
      await expect(expandButton).toHaveAttribute('aria-expanded', 'true');

      // Press Space to collapse
      await page.keyboard.press('Space');
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('displays experience tags', async ({ page }) => {
      const firstTimelineItem = page.locator('.timeline-item').first();
      await expect(firstTimelineItem.getByText('Leadership')).toBeVisible();
      await expect(firstTimelineItem.getByText('AI')).toBeVisible();
    });
  });

  test.describe('Philosophy Section', () => {
    test('displays philosophy cards', async ({ page }) => {
      await expect(page.getByText('Complexity is the Enemy')).toBeVisible();
      await expect(page.getByText('Impact Over Activity')).toBeVisible();
      await expect(page.getByText('Quality as a Daily Practice')).toBeVisible();
    });

    test('displays source attributions', async ({ page }) => {
      await expect(page.getByText(/John Ousterhout/)).toBeVisible();
      await expect(page.getByText(/Dave Farley/)).toBeVisible();
    });
  });

  test.describe('Skills Section', () => {
    test('displays skill categories', async ({ page }) => {
      const skillsSection = page.locator('#skills');
      await expect(skillsSection.getByText('Technical')).toBeVisible();
      await expect(skillsSection.getByText('Leadership')).toBeVisible();
      await expect(skillsSection.getByText('Domain')).toBeVisible();
    });

    test('displays individual skills', async ({ page }) => {
      await expect(page.getByText('TypeScript')).toBeVisible();
      await expect(page.getByText('Team Building')).toBeVisible();
      await expect(page.getByText('Process Automation')).toBeVisible();
    });
  });

  test.describe('Roots Section', () => {
    test('displays academic background', async ({ page }) => {
      await expect(page.getByText('M.Sc. Physics')).toBeVisible();
      await expect(page.getByText('University of Turku')).toBeVisible();
      await expect(page.getByText('Quantum Optics')).toBeVisible();
    });
  });

  test.describe('Footer', () => {
    test('footer is visible', async ({ page }) => {
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });
  });

  test.describe('External Links', () => {
    test('CTA links have correct hrefs', async ({ page }) => {
      const linkedInLink = page.getByRole('link', { name: /linkedin/i });
      const githubLink = page.getByRole('link', { name: /github/i });

      await expect(linkedInLink).toHaveAttribute('href', /linkedin\.com/);
      await expect(githubLink).toHaveAttribute('href', /github\.com/);
    });
  });

  test.describe('Accessibility', () => {
    test('page passes automated accessibility checks', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('all images have alt text', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');

        // Images should have alt text or be decorative (aria-hidden)
        expect(alt !== null || ariaHidden === 'true').toBeTruthy();
      }
    });

    test('heading hierarchy is correct', async ({ page }) => {
      // Page should have exactly one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      // H2s should exist for main sections
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('interactive elements are focusable', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');

      // Should be able to focus on something
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});

test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('page is usable on mobile', async ({ page }) => {
    await page.goto('/');

    // Hero should be visible
    await expect(page.getByRole('heading', { name: 'Lauri Pitkänen' })).toBeVisible();

    // No horizontal scroll
    const body = page.locator('body');
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    const viewportWidth = 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
  });

  test('timeline items work on mobile', async ({ page }) => {
    await page.goto('/');

    const firstTimelineItem = page.locator('.timeline-item').first();
    const expandButton = firstTimelineItem.getByRole('button');

    // Should be tappable
    await expandButton.tap();
    await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });
});
