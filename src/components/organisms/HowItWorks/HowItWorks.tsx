import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import styles from './HowItWorks.module.css';

interface Step {
  icon: string;
  title: string;
  description: string;
  example: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      icon: '📧',
      title: 'Receive Urgent Mission',
      description: 'Every mission is based on real challenges from our NGO partners.',
      example: 'Hospital in Mumbai overloaded - patient tracking system failing'
    },
    {
      icon: '💻',
      title: 'Build & Deploy Solutions',
      description: 'Use modern cloud architectures to solve real-world problems.',
      example: 'Design scalable microservices with Redis caching and load balancing'
    },
    {
      icon: '🌍',
      title: 'See Real Impact',
      description: 'Your code goes live and helps real people in crisis situations.',
      example: '2,847 patients tracked, 89% reduction in wait times'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 0.86, 0.39, 0.96]
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Badge variant="primary" size="small" className={styles.badge}>
            How It Works
          </Badge>
          <h2 className={styles.title}>From Crisis to Code to Change</h2>
          <p className={styles.subtitle}>
            Transform urgent humanitarian needs into impactful software solutions
          </p>
        </motion.div>

        <motion.div
          className={styles.stepsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={styles.stepWrapper}
            >
              <StepCard step={step} number={index + 1} />
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <svg className={styles.arrow} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14m0 0l-7-7m7 7l-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

interface StepCardProps {
  step: Step;
  number: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, number }) => {
  return (
    <Card className={styles.stepCard}>
      <div className={styles.stepNumber}>
        <span>{number}</span>
      </div>
      
      <div className={styles.stepIcon}>
        <span className={styles.iconEmoji}>{step.icon}</span>
      </div>
      
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepDescription}>{step.description}</p>
      
      <div className={styles.exampleBox}>
        <span className={styles.exampleLabel}>Real Example:</span>
        <p className={styles.exampleText}>{step.example}</p>
      </div>
    </Card>
  );
};

export default HowItWorks;