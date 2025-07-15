export interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  status?: 'normal' | 'warning' | 'critical';
  target?: number;
}

export interface MetricCardProps {
  data: MetricData;
  onHover?: (metric: MetricData) => void;
  className?: string;
}