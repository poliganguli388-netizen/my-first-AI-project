import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  clampNumber,
  isValidEmail,
  isValidPhone,
  parseSafeInt,
} from '../utils/validation';

describe('validation and sanitization suite', () => {
  describe('sanitizeString', () => {
    it('strips angle brackets to neutralize XSS vectors', () => {
      const malicious = '<script>alert("hack")</script>Grand Ballroom';
      expect(sanitizeString(malicious)).toBe('scriptalert("hack")/scriptGrand Ballroom');
      expect(sanitizeString('<b>Bold Decor</b>')).toBe('bBold Decor/b');
    });

    it('trims excess whitespace and handles non-strings', () => {
      expect(sanitizeString('   Clean Title   ')).toBe('Clean Title');
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(12345)).toBe('');
    });
  });

  describe('clampNumber', () => {
    it('clamps values within bounds', () => {
      expect(clampNumber(50, 0, 100)).toBe(50);
      expect(clampNumber(-20, 0, 100)).toBe(0);
      expect(clampNumber(150, 0, 100)).toBe(100);
    });

    it('returns fallback on invalid numbers', () => {
      expect(clampNumber('invalid', 0, 100, 10)).toBe(10);
      expect(clampNumber(NaN, 0, 100, 25)).toBe(25);
    });
  });

  describe('isValidEmail', () => {
    it('validates standard email addresses correctly', () => {
      expect(isValidEmail('organizer@eventcraft.com')).toBe(true);
      expect(isValidEmail('jane.doe@sub.company.org')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@missinguser.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('validates international and national phone formats', () => {
      expect(isValidPhone('+91 98765 43210')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
      expect(isValidPhone('123')).toBe(false); // Too short
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('parseSafeInt', () => {
    it('parses integers safely with clamping', () => {
      expect(parseSafeInt('250', 0, 10, 500)).toBe(250);
      expect(parseSafeInt('5', 0, 10, 500)).toBe(10); // Clamped to min 10
      expect(parseSafeInt('invalid', 50)).toBe(50);
    });
  });
});
