import React from 'react';

export function RiskBadge({ level, prediction, showDot = true, size = 'md' }) {
  // Normalize value
  const val = (level || prediction || '').toString().toLowerCase();

  let colorClasses = 'badge-low';
  let label = level || prediction || 'Unknown';

  if (val.includes('high') || val === 'at risk') {
    colorClasses = 'badge-high';
    label = level ? `${level} Risk` : 'At Risk';
  } else if (val.includes('medium') || val.includes('moderate')) {
    colorClasses = 'badge-medium';
    label = level ? `${level} Risk` : 'Moderate Risk';
  } else if (val.includes('low') || val === 'not at risk') {
    colorClasses = 'badge-low';
    label = level ? `${level} Risk` : 'Not At Risk';
  }

  const sizeClasses = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : 'badge-md';

  return (
    <span className={`badge ${colorClasses} ${sizeClasses}`}>
      {showDot && <span className="badge-dot" />}
      <span>{label}</span>
    </span>
  );
}
