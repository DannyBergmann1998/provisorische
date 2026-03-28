/**
 * Input Sanitization Utilities
 * Protects against XSS, HTML injection, script injection
 */

/**
 * Sanitize a string by removing HTML tags and dangerous characters
 * @param input - The string to sanitize
 * @returns Clean string safe for storage and display
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove event handlers (onload, onclick, etc.)
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    // Remove data URLs and javascript: protocol
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    // Trim whitespace
    .trim();
}

/**
 * Sanitize an email address
 * @param email - The email to sanitize
 * @returns Lowercased, trimmed email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }
  return email.toLowerCase().trim();
}

/**
 * Sanitize a URL
 * @param url - The URL to sanitize
 * @returns Safe URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return "";
  }

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }
    return url;
  } catch {
    return "";
  }
}

/**
 * Sanitize an object's string properties
 * @param obj - Object with string values
 * @returns Object with sanitized string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key]);
    }
  }

  return sanitized;
}
