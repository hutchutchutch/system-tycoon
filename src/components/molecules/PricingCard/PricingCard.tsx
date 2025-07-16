import React from 'react';
import clsx from 'clsx';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Check } from 'lucide-react';
import styles from './PricingCard.module.css';

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  cta: string;
  impact?: string | null;
  popular?: boolean;
  isTeam?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  price, 
  features, 
  cta, 
  impact, 
  popular, 
  isTeam 
}) => {
  return (
    <Card className={clsx(
      styles.card,
      popular && styles['card--popular']
    )}>
      {popular && (
        <Badge variant="primary" className={styles.popularBadge}>
          Most Popular
        </Badge>
      )}
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.pricing}>
            <span className={styles.price}>${price}</span>
            <span className={styles.period}>/{isTeam ? 'team/month' : 'month'}</span>
          </div>
        </div>
        
        <ul className={styles.features}>
          {features.map(feature => (
            <li key={feature} className={styles.feature}>
              <Check className={styles.checkIcon} />
              <span className={styles.featureText}>{feature}</span>
            </li>
          ))}
        </ul>
        
        {impact && (
          <div className={styles.impact}>
            <p className={styles.impactText}>💚 {impact}</p>
          </div>
        )}
        
        <div className={styles.ctaWrapper}>
          <Button 
            variant={popular ? 'primary' : 'outline'} 
            fullWidth
          >
            {cta}
          </Button>
        </div>
      </div>
    </Card>
  );
};