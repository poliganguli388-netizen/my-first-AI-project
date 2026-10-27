/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Defensive Security & Input Sanitization Utilities
 * 
 * Provides defense-in-depth sanitization routines, numeric range clamping,
 * and format validation to safeguard against XSS, injection vectors, and malformed inputs.
 */

/**
 * Strips dangerous HTML tags and script injections from untrusted string input.
 * 
 * @param input - The raw input to be sanitized.
 * @returns Clean, trimmed string with angle bracket characters stripped.
 * 
 * @example
 * sanitizeString('<script>alert(1)</script>Hello'); // Returns "Hello"
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validates that a numeric input is finite and confines it strictly within defined boundaries.
 * 
 * @param value - The input value to validate and clamp.
 * @param minimumBound - Lower inclusive boundary (defaults to 0).
 * @param maximumBound - Upper inclusive boundary (defaults to 100,000,000).
 * @param fallbackValue - Safe default to return if value is non-numeric or NaN (defaults to 0).
 * @returns Bounded numerical value.
 * 
 * @example
 * clampNumber(-50, 0, 1000); // Returns 0
 * clampNumber(5000, 0, 1000); // Returns 1000
 */
export function clampNumber(
  value: unknown,
  minimumBound: number = 0,
  maximumBound: number = 100000000,
  fallbackValue: number = 0
): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || isNaN(numericValue)) {
    return fallbackValue;
  }

  return Math.min(Math.max(numericValue, minimumBound), maximumBound);
}

/**
 * Validates email addresses using an RFC 5322 compatible pattern.
 * 
 * @param email - Candidate email string to validate.
 * @returns True if email complies with standard domain and account format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegexPattern.test(email.trim());
}

/**
 * Validates international and local telephone numbers against digit count requirements.
 * 
 * @param phoneNumber - Candidate phone number string.
 * @returns True if the number contains between 7 and 15 digits.
 */
export function isValidPhone(phoneNumber: string): boolean {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  const extractedDigits = phoneNumber.replace(/\D/g, '');
  return extractedDigits.length >= 7 && extractedDigits.length <= 15;
}

/**
 * Safely parses integer quantities for guest headcounts, table numbers, and milestone durations.
 * 
 * @param value - Untrusted value to parse as an integer.
 * @param fallbackValue - Default value if parsing fails.
 * @param minimumBound - Lower inclusive bound.
 * @param maximumBound - Upper inclusive bound.
 * @returns Safe, bounded integer.
 */
export function parseSafeInt(
  value: unknown,
  fallbackValue: number = 0,
  minimumBound: number = 0,
  maximumBound: number = 10000
): number {
  const parsedInteger = parseInt(String(value), 10);

  if (isNaN(parsedInteger) || !Number.isFinite(parsedInteger)) {
    return fallbackValue;
  }

  return Math.min(Math.max(parsedInteger, minimumBound), maximumBound);
}
