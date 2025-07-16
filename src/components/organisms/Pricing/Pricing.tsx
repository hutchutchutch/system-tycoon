import React from 'react';
import { PricingCard } from '../../molecules/PricingCard';
import { Shield } from 'lucide-react';
import styles from './Pricing.module.css';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Volunteer',
      price: 0,
      features: [
        '3 missions per month',
        'Basic cloud components',
        'Solo play only',
        'Community forums',
        'Impact tracking'
      ],
      cta: 'Start Free',
      impact: null
    },
    {
      name: 'Responder',
      price: 9.99,
      features: [
        'Unlimited missions',
        'All cloud components',
        'Real-time collaboration',
        'Voice chat',
        'Priority crisis alerts',
        'Certification eligible'
      ],
      cta: 'Upgrade to Responder',
      impact: '10% goes to mission partners',
      popular: true
    },
    {
      name: 'Guardian',
      price: 49,
      features: [
        'Everything in Responder',
        'Custom branded missions',
        'Team analytics dashboard',
        'Direct partner connections',
        'Implementation support',
        'Priority support'
      ],
      cta: 'Contact Sales',
      impact: '25% goes to selected charity',
      isTeam: true
    }
  ];
  
  return (
    <section className={styles.pricing}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Choose Your Impact Level
        </h2>
        
        <div className={styles.grid}>
          {tiers.map(tier => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        <p className={styles.disclaimer}>
          <Shield className={styles.disclaimerIcon} />
          100% transparent impact reporting. See exactly how your subscription helps.
        </p>
      </div>
    </section>
  );
};

export default Pricing;