import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { StepCard } from '../../molecules/StepCard';
import { Mail, Users, Code, Zap } from 'lucide-react';
import styles from './HowItWorks.module.css';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Mail className="w-16 h-16" />,
      title: "Receive Urgent Mission",
      description: "Every mission is based on real challenges from our NGO partners.",
      example: "Hospital in Mumbai overloaded - patient tracking system failing"
    },
    {
      icon: <Code className="w-16 h-16" />,
      title: "Build & Deploy",
      description: "Use real cloud components to architect scalable solutions.",
      example: "Design load-balanced API with patient queue management"
    },
    {
      icon: <Zap className="w-16 h-16" />,
      title: "See Real Impact",
      description: "Watch your code help real people in real-time.",
      example: "1,247 patients processed - wait time reduced by 73%"
    }
  ];
  
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          From Crisis to Code to Change
        </h2>
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <StepCard key={index} {...step} number={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;