import React from 'react';

export function EduBadge({ level, size = 'md' }) {
  const val = (level || 'Unknown').toString().toLowerCase();

  let badgeClass = 'edu-badge-school';
  let displayLabel = level || 'School';

  if (val.includes('undergrad') || val.includes('bachelor') || val.includes('college')) {
    badgeClass = 'edu-badge-undergrad';
    displayLabel = 'Undergraduate';
  } else if (val.includes('inter') || val.includes('high school') || val.includes('12') || val.includes('+2')) {
    badgeClass = 'edu-badge-inter';
    displayLabel = val.includes('high') ? 'High School / Inter' : 'Intermediate';
  } else if (val.includes('school') || val.includes('secondary')) {
    badgeClass = 'edu-badge-school';
    displayLabel = 'School';
  }

  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : 'badge-md';

  return (
    <span className={`badge ${badgeClass} ${sizeClass}`}>
      <span className="edu-icon">🎓</span>
      <span>{displayLabel}</span>
    </span>
  );
}
