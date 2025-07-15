import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { PersonalImpact } from './components/PersonalImpact';
import { GlobalImpact } from './components/GlobalImpact';

const ImpactDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Your Code in Action</h2>
        
        <div className="flex justify-center gap-2 mb-12">
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