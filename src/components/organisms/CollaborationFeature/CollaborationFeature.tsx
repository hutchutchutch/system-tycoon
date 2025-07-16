import React from 'react';
import { Card } from '../../atoms/Card';
import { Users, GraduationCap, Globe } from 'lucide-react';
import { CollaborationDemo } from './components/CollaborationDemo';
import styles from './CollaborationFeature.module.css';

const CollaborationFeature: React.FC = () => {
  const features = [
    {
      title: "Real-time Collaboration",
      description: "Work together on the same canvas. See teammate cursors, components, and changes instantly.",
      icon: <Users className="w-8 h-8" />
    },
    {
      title: "Mentor Mode",
      description: "Experienced players guide newcomers through complex missions.",
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      title: "Global Hackathons",
      description: "Join monthly 48-hour challenges with players worldwide.",
      icon: <Globe className="w-8 h-8" />
    }
  ];
  
  return (
    <section className={styles.collaboration}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Never Solve Alone. Multiply Your Impact.
        </h2>
        
        <div className={styles.grid}>
          <div>
            <div className={styles.features}>
              {features.map((feature, index) => (
                <Card key={index} className={styles.featureCard}>
                  <div className={styles.featureContent}>
                    <div className={styles.featureIcon}>
                      {feature.icon}
                    </div>
                    <div className={styles.featureText}>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className={styles.demoContainer}>
            <CollaborationDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationFeature;