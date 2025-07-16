import React from 'react';
import { clsx } from 'clsx';
import styles from './MetricsDashboard.module.css';

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
    <div className={styles['metrics-dashboard']}>
      <div className={styles['metrics-dashboard__header']}>
        <h3 className={styles['metrics-dashboard__title']}>{title}</h3>
        <div className={styles['metrics-dashboard__status']}>
          <div className={clsx(
            styles['metrics-dashboard__status-indicator'],
            {
              [styles['metrics-dashboard__status-indicator--warning']]: status === 'warning',
              [styles['metrics-dashboard__status-indicator--critical']]: status === 'critical',
            }
          )} />
          <span className="text-sm capitalize">{status}</span>
        </div>
      </div>

      <div className={styles['metrics-dashboard__body']}>
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
    <div className={styles['metric-card']}>
      <div className={styles['metric-card__header']}>
        <span className={styles['metric-card__label']}>{metric.label}</span>
        {metric.trend && (
          <div className={clsx(
            styles['metric-card__trend'],
            styles[`metric-card__trend--${metric.trend}`]
          )}>
            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
            {metric.trendValue && <span className="ml-1">{metric.trendValue}</span>}
          </div>
        )}
      </div>
      
      <div className={styles['metric-card__value']}>
        <span>{metric.value.toLocaleString()}</span>
        {metric.unit && (
          <span className={styles['metric-card__unit']}>{metric.unit}</span>
        )}
      </div>

      {metric.max && (
        <div className={styles['metric-card__progress']}>
          <div
            className={clsx(
              styles['metric-card__progress-bar'],
              {
                [styles['metric-card__progress-bar--warning']]: progressStatus === 'warning',
                [styles['metric-card__progress-bar--critical']]: progressStatus === 'critical',
              }
            )}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};