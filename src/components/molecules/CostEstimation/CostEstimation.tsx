import { useAppSelector } from '../../../hooks/redux';
import { selectNodes } from '../../../features/design/designSlice';
import { gameCost } from '../../../../shared/game';
import styles from './CostEstimation.module.css';

interface CostEstimationProps { userScale?: number; budgetLimit?: number; className?: string }
export function CostEstimation({ budgetLimit, className = '' }: CostEstimationProps) {
  const nodes = useAppSelector(selectNodes);
  const total = gameCost(nodes);
  return <section className={`${styles.container} ${className}`} aria-label="Game cost">
    <h3>Monthly game cost</h3>
    <p className={budgetLimit !== undefined && total > budgetLimit ? styles.overBudget : styles.total}>{total} credits/month</p>
    {budgetLimit !== undefined && <p>Budget: {budgetLimit} credits/month</p>}
    {nodes.filter(n => gameCost([n]) > 0).map(n => <p key={n.id}>{n.data.label ?? n.data.name}: {gameCost([n])} credits</p>)}
    <small>Catalog costs per instance. Traffic sources and retired/broken equipment cost zero. These are game credits, not cloud-provider prices.</small>
  </section>;
}
