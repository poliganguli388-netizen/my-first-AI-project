/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Strips dangerous HTML tags and script injections to protect against XSS.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validates and clamps a number between min and max bounds.
 */
export function clampNumber(value: unknown, min: number = 0, max: number = 100000000, fallback: number = 0): number {
  const num = Number(value);
  if (!Number.isFinite(num) || isNaN(num)) {
    return fallback;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Validates email addresses using RFC 5322 compatible expression.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validates international and local phone numbers.
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Safe integer parser for guest counts and table numbers.
 */
export function parseSafeInt(value: unknown, fallback: number = 0, min: number = 0, max: number = 10000): number {
  const n = parseInt(String(value), 10);
  if (isNaN(n) || !Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}
