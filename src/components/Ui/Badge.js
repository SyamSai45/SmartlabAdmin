// src/components/ui/Badge.js
import React from 'react';
import { statusBadgeClass } from '../../utils/helpers';

export function Badge({ status, children, className = '' }) {
  const cls = statusBadgeClass(status);
  return (
    <span className={`badge ${cls} ${className}`} style={{ textTransform: 'capitalize' }}>
      {children || status}
    </span>
  );
}

export function DotBadge({ color = 'blue', pulse = false }) {
  const colors = { green: 'dot-green', amber: 'dot-amber', blue: 'dot-blue', red: 'dot-red' };
  return <span className={`dot ${colors[color] || 'dot-blue'} ${pulse ? 'animate-pulse2' : ''}`} />;
}