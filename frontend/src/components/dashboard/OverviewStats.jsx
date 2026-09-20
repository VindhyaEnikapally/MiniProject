import React from 'react';
import { StatCard } from '../common/StatCard';
import { User, ShieldAlert, CheckCircle2, TrendingUp, Brain, Sparkles } from '../common/Icons';

export function OverviewStats({ analytics, loading }) {
  const overview = analytics?.overview || {};

  const total = overview.total_students ?? 0;
  const atRisk = overview.at_risk_students ?? 0;
  const notAtRisk = overview.not_at_risk_students ?? 0;
  const atRiskPct = overview.at_risk_percentage ?? 0;
  const avgRiskPct = overview.average_risk_percentage ?? ((analytics?.average_risk || 0) * 100);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card stat-card-skeleton">
            <div className="stat-skeleton-line w-1/3 mb-4" />
            <div className="stat-skeleton-line w-1/2 mb-2" />
            <div className="stat-skeleton-line w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <StatCard
        title="Total Students Monitored"
        value={total.toLocaleString()}
        subtitle="Active cohort records evaluated by model"
        icon={User}
        variant="default"
        badgeText="100% Evaluated"
        badgeVariant="neutral"
      />

      <StatCard
        title="At-Risk Students"
        value={atRisk.toLocaleString()}
        subtitle={`${atRiskPct}% of cohort requires faculty intervention`}
        icon={ShieldAlert}
        variant="danger"
        badgeText={`${atRiskPct}%`}
        badgeVariant="danger"
        trendText="Requires Advisor Contact"
      />

      <StatCard
        title="Not At-Risk Students"
        value={notAtRisk.toLocaleString()}
        subtitle="Meeting or exceeding all academic milestones"
        icon={CheckCircle2}
        variant="success"
        badgeText={`${(100 - atRiskPct).toFixed(0)}%`}
        badgeVariant="success"
        trendText="On Track"
      />

      <StatCard
        title="Cohort Average Risk"
        value={`${Number(avgRiskPct).toFixed(1)}%`}
        subtitle="Institutional baseline cutoff: 35.2%"
        icon={TrendingUp}
        variant={avgRiskPct >= 35.2 ? 'warning' : 'default'}
        badgeText={avgRiskPct >= 35.2 ? '+8.0% vs Baseline' : 'Within Baseline'}
        badgeVariant={avgRiskPct >= 35.2 ? 'warning' : 'success'}
        trendText={avgRiskPct >= 35.2 ? 'Above Baseline' : 'Normal'}
      />
    </div>
  );
}
