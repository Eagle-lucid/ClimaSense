// src/utils/helpers/dateFormatter.js
export function formatHour(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(dateString) {
  // Returns day of week, e.g., "Monday"
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'long' });
}