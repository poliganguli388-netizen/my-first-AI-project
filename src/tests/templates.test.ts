import { describe, it, expect } from 'vitest';
import { STARTERS, buildStateFromTemplate } from '../data/templates';

describe('event templates suite', () => {
  it('defines templates for all required event categories', () => {
    const keys = Object.keys(STARTERS);
    expect(keys).toContain('wedding');
    expect(keys).toContain('birthday');
    expect(keys).toContain('anniversary');
    expect(keys).toContain('corporate');
    expect(keys).toContain('community');
    expect(keys).toContain('party');
  });

  it('guarantees each template has valid categories with positive percentages', () => {
    Object.entries(STARTERS).forEach(([key, template]) => {
      expect(template.categories.length).toBeGreaterThan(0);
      const totalPct = template.categories.reduce((acc, c) => acc + c.pct, 0);
      expect(totalPct).toBe(100);
      expect(template.budget).toBeGreaterThan(0);
      expect(template.guests).toBeGreaterThan(0);
    });
  });

  it('buildStateFromTemplate generates a fresh, decoupled state instance with IDs', () => {
    const state = buildStateFromTemplate('wedding', undefined, 'dark');
    expect(state.type).toBe('wedding');
    expect(state.theme).toBe('dark');
    expect(state.budgetRows.length).toBeGreaterThan(0);
    expect(state.tasks.length).toBeGreaterThan(0);
    expect(state.schedule.length).toBeGreaterThan(0);
    expect(state.vendors.length).toBeGreaterThan(0);
    expect(state.guestList.length).toBeGreaterThan(0);

    // Verify unique IDs exist
    const budgetIds = state.budgetRows.map((r) => r.id);
    const uniqueIds = new Set(budgetIds);
    expect(uniqueIds.size).toBe(budgetIds.length);
  });
});
