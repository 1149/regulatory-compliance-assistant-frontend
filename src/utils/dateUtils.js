/**
 * Date utility functions for formatting dates consistently across the app
 */

/**
 * Format date as "Month Day, Year, HH:MM AM/PM PST"
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  });
}

/**
 * Format date as short format for compact display
 * @param {string} dateString - ISO date string
 * @returns {string} Short formatted date string
 */
export function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if date is recent (within last 24 hours)
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is within last 24 hours
 */
export function isRecent(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  return diffInHours <= 24;
}
