import React from 'react';
import { clsx } from 'clsx';

export interface MetricData {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  max?: number;
  status?: 'normal' | 'warning' | 'critical';
}

export interface MetricsDashboardProps {
  title?: string;
  metrics: MetricData[];
  status?: 'normal' | 'warning' | 'critical';
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  title = 'System Metrics',
  metrics,
  status = 'normal',
}) => {
  return (
    <div className="metrics-dashboard">
      <div className="metrics-dashboard__header">
        <h3 className="metrics-dashboard__title">{title}</h3>
        <div className="metrics-dashboard__status">
          <div className={clsx(
            'metrics-dashboard__status-indicator',
            status === 'warning' && 'metrics-dashboard__status-indicator--warning',
            status === 'critical' && 'metrics-dashboard__status-indicator--critical'
          )} />
          <span className="text-sm capitalize">{status}</span>
        </div>
      </div>

      <div className="metrics-dashboard__body">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: MetricData;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const progressPercentage = metric.max ? (metric.value / metric.max) * 100 : 0;
  const progressStatus = 
    progressPercentage >= 90 ? 'critical' :
    progressPercentage >= 70 ? 'warning' :
    'normal';

  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__label">{metric.label}</span>
        {metric.trend && (
          <div className={clsx(
            'metric-card__trend',
            `metric-card__trend--${metric.trend}`
          )}>
            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
            {metric.trendValue && <span className="ml-1">{metric.trendValue}</span>}
          </div>
        )}
      </div>
      
      <div className="metric-card__value">
        {metric.value.toLocaleString()}
        {metric.unit && (
          <span className="metric-card__unit">{metric.unit}</span>
        )}
      </div>

      {metric.max && (
        <div className="metric-card__progress">
          <div
            className={clsx(
              'metric-card__progress-bar',
              progressStatus === 'warning' && 'metric-card__progress-bar--warning',
              progressStatus === 'critical' && 'metric-card__progress-bar--critical'
            )}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};