/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Formatting Utilities
 * 
 * Provides localized financial currency formatting, human-readable date
 * transformation, and collision-resistant unique identifier generation.
 */

/**
 * Formats a numerical monetary value into a localized currency string with proper grouping.
 * 
 * @param amount - Numerical monetary sum to format.
 * @param currency - Currency symbol prefix (defaults to '₹'). Supported: '₹', '$', '€', '£'.
 * @returns Formatted currency string (e.g., '₹12,00,000' or '$50,000').
 * 
 * @example
 * formatCurrency(1200000, '₹'); // Returns "₹12,00,000"
 * formatCurrency(50000, '$');   // Returns "$50,000"
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
  const roundedAmount = Math.round(amount || 0);

  if (currency === '₹') {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(roundedAmount);
  } else if (currency === '$') {
    return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(roundedAmount);
  } else if (currency === '€') {
    return '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(roundedAmount);
  } else if (currency === '£') {
    return '£' + new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(roundedAmount);
  }

  return `${currency} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(roundedAmount)}`;
}

/**
 * Converts an ISO date string (YYYY-MM-DD) into an internationalized calendar representation.
 * 
 * @param dateString - Date string representation.
 * @returns Formatted calendar string (e.g., 'Nov 15, 2026').
 * 
 * @example
 * formatDate('2026-11-15'); // Returns "Nov 15, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) {
    return 'Date not set';
  }

  try {
    const calendarParts = dateString.split('-');
    if (calendarParts.length === 3) {
      const year = parseInt(calendarParts[0], 10);
      const monthIndex = parseInt(calendarParts[1], 10) - 1;
      const day = parseInt(calendarParts[2], 10);
      const calendarDate = new Date(year, monthIndex, day);
      return calendarDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Generates a compact, pseudo-random alphanumeric identifier for entities.
 * 
 * @returns 7-character random alphanumeric string.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
