import { describe, it, expect } from 'vitest';
import { ProfileSchema } from './profile.schema';
import profileData from '../data/profile.json';

describe('Profile Schema Validation', () => {
  it('should validate the profile.json data successfully', () => {
    const result = ProfileSchema.safeParse(profileData);

    if (!result.success) {
      console.error('Validation errors:', JSON.stringify(result.error.issues, null, 2));
    }

    expect(result.success).toBe(true);
  });

  it('should have required hero fields', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.hero.name).toBeDefined();
      expect(result.data.hero.headline).toBeDefined();
      expect(result.data.hero.tagline).toBeDefined();
      expect(result.data.hero.impactStats.length).toBeGreaterThanOrEqual(3);
      expect(result.data.hero.impactStats.length).toBeLessThanOrEqual(4);
    }
  });

  it('should have valid philosophy entries (2-4)', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.philosophy.length).toBeGreaterThanOrEqual(2);
      expect(result.data.philosophy.length).toBeLessThanOrEqual(4);
    }
  });

  it('should have valid skill levels (1-5)', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      result.data.skills.forEach(category => {
        category.skills.forEach(skill => {
          expect(skill.level).toBeGreaterThanOrEqual(1);
          expect(skill.level).toBeLessThanOrEqual(5);
        });
      });
    }
  });

  it('should have valid URLs in ctaLinks', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      result.data.hero.ctaLinks.forEach(link => {
        expect(link.href).toMatch(/^(https?:|mailto:)/);
      });
    }
  });

  it('should have valid meta information', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.meta.sourceUrl).toMatch(/^https?:\/\//);
      expect(result.data.meta.agents.length).toBeGreaterThan(0);
    }
  });

  it('should reject invalid data', () => {
    const invalidData = {
      hero: {
        name: 'Test',
        // Missing required fields
      }
    };

    const result = ProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
