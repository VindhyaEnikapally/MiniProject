import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badgeText,
  badgeVariant = 'neutral',
  trendText,
}) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-ambient" />
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className={`stat-card-icon-wrap stat-icon-${variant}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value-row">
          <span className="stat-card-value font-mono">{value}</span>
          {badgeText && (
            <span className={`stat-card-badge stat-badge-${badgeVariant}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        {trendText && <span className="stat-card-trend">{trendText}</span>}
      </div>
    </div>
  );
}
