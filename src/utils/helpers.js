// src/utils/helpers.js

/** Format a date string to Indian locale short date */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/** Format a date string to HH:MM */
export const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/** Format a number to Indian currency string */
export const fmtPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');

/** Return the CSS class for a status badge */
export const statusBadgeClass = (s) => {
  const map = {
    pending:  'badge-amber',
    replied:  'badge-green',
    sent:     'badge-green',
    approved: 'badge-blue',
    rejected: 'badge-red',
    active:   'badge-green',
    hidden:   'badge-slate',
    archived: 'badge-slate',
  };
  return map[s] || 'badge-slate';
};

/** Generate slug from a string */
export const toSlug = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/** Clamp a number between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);