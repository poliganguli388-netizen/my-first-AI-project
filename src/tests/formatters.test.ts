import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, generateId } from '../utils/formatters';

describe('formatters utility suite', () => {
  describe('formatCurrency', () => {
    it('formats Indian Rupee (₹) correctly with en-IN formatting', () => {
      expect(formatCurrency(150000, '₹')).toContain('1,50,000');
      expect(formatCurrency(0, '₹')).toBe('₹0');
    });

    it('formats US Dollar ($) correctly with en-US formatting', () => {
      expect(formatCurrency(125000, '$')).toBe('$125,000');
      expect(formatCurrency(19.99, '$')).toBe('$20');
    });

    it('formats Euro (€) correctly', () => {
      expect(formatCurrency(45000, '€')).toContain('45.000');
    });

    it('formats British Pound (£) correctly', () => {
      expect(formatCurrency(8500, '£')).toBe('£8,500');
    });

    it('gracefully handles NaN and negative amounts', () => {
      expect(formatCurrency(NaN, '₹')).toBe('₹0');
      expect(formatCurrency(-5000, '$')).toBe('$-5,000');
    });
  });

  describe('formatDate', () => {
    it('formats YYYY-MM-DD cleanly without timezone shift', () => {
      const formatted = formatDate('2026-11-15');
      expect(formatted).toBe('Nov 15, 2026');
    });

    it('handles empty date strings safely', () => {
      expect(formatDate('')).toBe('Date not set');
    });
  });

  describe('generateId', () => {
    it('generates unique non-empty alphanumeric IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeTruthy();
      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(4);
    });
  });
});
