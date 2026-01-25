import { describe, it, expect } from 'vitest';
import {
  ProfileSchema,
  EducationSchema,
  VolunteeringSchema,
  EmploymentTypeEnum,
  CareerLevelEnum,
  EducationTypeEnum,
} from './profile.schema';
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

  // ═══════════════════════════════════════════════════════════
  // Education Schema Tests
  // ═══════════════════════════════════════════════════════════
  it('should validate education array if present', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success && result.data.education) {
      expect(result.data.education.length).toBeGreaterThan(0);
      result.data.education.forEach(edu => {
        expect(edu.id).toBeDefined();
        expect(edu.degree).toBeDefined();
        expect(edu.institution).toBeDefined();
        expect(edu.type).toBeDefined();
        expect(edu.period.start).toBeDefined();
      });
    }
  });

  it('should validate education type enum values', () => {
    const validTypes = ['bachelor', 'master', 'doctorate', 'associate', 'certificate', 'bootcamp', 'self-taught', 'other'];
    validTypes.forEach(type => {
      const result = EducationTypeEnum.safeParse(type);
      expect(result.success).toBe(true);
    });

    const invalidResult = EducationTypeEnum.safeParse('invalid-type');
    expect(invalidResult.success).toBe(false);
  });

  // ═══════════════════════════════════════════════════════════
  // Employment Type & Career Level Tests
  // ═══════════════════════════════════════════════════════════
  it('should validate employment type enum values', () => {
    const validTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'apprenticeship'];
    validTypes.forEach(type => {
      const result = EmploymentTypeEnum.safeParse(type);
      expect(result.success).toBe(true);
    });

    const invalidResult = EmploymentTypeEnum.safeParse('invalid-type');
    expect(invalidResult.success).toBe(false);
  });

  it('should validate career level enum values', () => {
    const validLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'executive'];
    validLevels.forEach(level => {
      const result = CareerLevelEnum.safeParse(level);
      expect(result.success).toBe(true);
    });

    const invalidResult = CareerLevelEnum.safeParse('invalid-level');
    expect(invalidResult.success).toBe(false);
  });

  it('should have valid employment types in experience entries', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success) {
      result.data.experience.forEach(exp => {
        if (exp.employmentType) {
          const typeResult = EmploymentTypeEnum.safeParse(exp.employmentType);
          expect(typeResult.success).toBe(true);
        }
        if (exp.careerLevel) {
          const levelResult = CareerLevelEnum.safeParse(exp.careerLevel);
          expect(levelResult.success).toBe(true);
        }
      });
    }
  });

  // ═══════════════════════════════════════════════════════════
  // Volunteering Schema Tests
  // ═══════════════════════════════════════════════════════════
  it('should validate volunteering array if present', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);

    if (result.success && result.data.volunteering) {
      expect(result.data.volunteering.length).toBeGreaterThan(0);
      result.data.volunteering.forEach(vol => {
        expect(vol.id).toBeDefined();
        expect(vol.organization).toBeDefined();
        expect(vol.role).toBeDefined();
        expect(vol.description).toBeDefined();
        expect(vol.period.start).toBeDefined();
      });
    }
  });

  it('should validate a valid volunteering entry', () => {
    const validVolunteering = {
      id: 'test-volunteer',
      organization: 'Test Org',
      role: 'Volunteer',
      period: { start: '2023-01', end: null },
      description: 'Helping the community',
      impact: 'Made a difference',
      highlights: ['Did something good'],
      tags: ['Community', 'Volunteer'],
    };

    const result = VolunteeringSchema.safeParse(validVolunteering);
    expect(result.success).toBe(true);
  });

  // ═══════════════════════════════════════════════════════════
  // Backwards Compatibility Tests
  // ═══════════════════════════════════════════════════════════
  it('should accept profile with only roots (legacy format)', () => {
    const legacyProfile = {
      ...profileData,
      education: undefined,
    };

    const result = ProfileSchema.safeParse(legacyProfile);
    expect(result.success).toBe(true);
  });

  it('should accept profile with only education array (new format)', () => {
    const newProfile = {
      ...profileData,
      roots: undefined,
    };

    const result = ProfileSchema.safeParse(newProfile);
    expect(result.success).toBe(true);
  });

  it('should reject profile with neither roots nor education', () => {
    const invalidProfile = {
      ...profileData,
      roots: undefined,
      education: undefined,
    };

    const result = ProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });
});
