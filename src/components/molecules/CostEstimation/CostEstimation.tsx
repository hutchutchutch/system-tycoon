import React, { useMemo } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { selectNodes } from '../../../features/design/designSlice';
import styles from './CostEstimation.module.css';

// Cloudflare pricing (simplified monthly estimates per component type)
const CLOUDFLARE_PRICING: Record<string, { label: string; monthly: number; unit: string; detail: string }> = {
  compute: { label: 'Workers', monthly: 5, unit: '/mo', detail: '10M requests included free, then $0.30/M' },
  database: { label: 'D1 Database', monthly: 5, unit: '/mo', detail: '5M reads/day free, then $0.001/M' },
  cache: { label: 'KV Cache', monthly: 5, unit: '/mo', detail: '100K reads/day free, then $0.50/M' },
  networking: { label: 'Network', monthly: 0, unit: '/mo', detail: 'Included with Workers (no bandwidth fees)' },
  storage: { label: 'R2 Storage', monthly: 5, unit: '/mo', detail: '10GB free, then $0.015/GB' },
  security: { label: 'Security', monthly: 0, unit: '/mo', detail: 'WAF + DDoS included free' },
  observability: { label: 'Analytics', monthly: 2, unit: '/mo', detail: 'Workers Analytics free, custom $0.25/M events' },
};

// Scale multiplier based on user count in the mission
const SCALE_TIERS = [
  { users: 200, label: '200 users', multiplier: 1 },
  { users: 2000, label: '2K users', multiplier: 3 },
  { users: 10000, label: '10K users', multiplier: 8 },
  { users: 50000, label: '50K users', multiplier: 20 },
];

interface CostEstimationProps {
  userScale?: number; // number of users the system serves
  budgetLimit?: number; // optional budget constraint
  className?: string;
}

export const CostEstimation: React.FC<CostEstimationProps> = ({
  userScale = 200,
  budgetLimit,
  className,
}) => {
  const nodes = useAppSelector(selectNodes);

  const { breakdown, total, scaleTier } = useMemo(() => {
    // Find appropriate scale tier
    const tier = SCALE_TIERS.reduce((best, t) =>
      t.users <= userScale ? t : best, SCALE_TIERS[0]);

    // Group nodes by category and calculate costs
    const categoryMap: Record<string, { count: number; cost: number; label: string; detail: string }> = {};

    nodes.forEach((node: any) => {
      const category = node.data?.category || 'compute';
      const pricing = CLOUDFLARE_PRICING[category] || CLOUDFLARE_PRICING.compute;

      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, cost: 0, label: pricing.label, detail: pricing.detail };
      }
      categoryMap[category].count += 1;
      categoryMap[category].cost += pricing.monthly * tier.multiplier;
    });

    const breakdown = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b.cost - a.cost);

    const total = breakdown.reduce((sum, [, item]) => sum + item.cost, 0);

    return { breakdown, total, scaleTier: tier };
  }, [nodes, userScale]);

  const isOverBudget = budgetLimit !== undefined && total > budgetLimit;
  const nodeCount = nodes.length;

  if (nodeCount === 0) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Cost Estimate</span>
        </div>
        <div className={styles.empty}>
          Add components to see cost estimates
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Cost Estimate</span>
        <span className={styles.scale}>{scaleTier.label}</span>
      </div>

      <div className={`${styles.total} ${isOverBudget ? styles.overBudget : ''}`}>
        <span className={styles.totalLabel}>Monthly</span>
        <span className={styles.totalValue}>
          ${total.toFixed(0)}
          <span className={styles.totalUnit}>/mo</span>
        </span>
        {budgetLimit !== undefined && (
          <span className={styles.budget}>
            Budget: ${budgetLimit}/mo
          </span>
        )}
      </div>

      <div className={styles.breakdown}>
        {breakdown.map(([category, item]) => (
          <div key={category} className={styles.lineItem}>
            <div className={styles.lineInfo}>
              <span className={styles.lineName}>
                {item.label}
                {item.count > 1 && <span className={styles.lineCount}>×{item.count}</span>}
              </span>
              <span className={styles.lineDetail}>{item.detail}</span>
            </div>
            <span className={styles.lineCost}>${item.cost.toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerNote}>
          Based on Cloudflare pricing • {nodeCount} component{nodeCount !== 1 ? 's' : ''}
        </span>
        {total <= 15 && (
          <span className={styles.freeNote}>
            Most of this fits in the free tier
          </span>
        )}
      </div>
    </div>
  );
};
