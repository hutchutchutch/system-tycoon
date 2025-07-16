import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { PersonalImpact } from './components/PersonalImpact';
import { GlobalImpact } from './components/GlobalImpact';
import styles from './ImpactDashboard.module.css';

const ImpactDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  return (
    <section className={styles.impactDashboard}>
      <div className={styles.container}>
        <h2 className={styles.title}>Your Code in Action</h2>
        
        <div className={styles.tabs}>
          <Button
            variant={activeTab === 'personal' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('personal')}
          >
            Personal Impact
          </Button>
          <Button
            variant={activeTab === 'global' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('global')}
          >
            Global Impact
          </Button>
        </div>
        
        {activeTab === 'personal' ? <PersonalImpact /> : <GlobalImpact />}
      </div>
    </section>
  );
};

export default ImpactDashboard;