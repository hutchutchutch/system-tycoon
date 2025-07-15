import React, { useState } from 'react';
import { SystemDesignCanvas } from '../../components/organisms/SystemDesignCanvas';
import './SystemDesignCanvasWrapper.css';

export const SystemDesignCanvasWrapper: React.FC = () => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading the broken system
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="system-design-wrapper">
        <div className="system-design-loading">
          <div className="system-design-loading__spinner"></div>
          <p>Loading Sarah's broken website configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-design-wrapper">
      <div className="system-design-header">
        <h2>Sarah's Bakery Website - System Configuration</h2>
        <p className="system-design-header__error">
          ⚠️ System is over-engineered and not working properly!
        </p>
      </div>
      
      <SystemDesignCanvas
        projectId="sarahsbakery"
        requirements={[
          { id: '1', name: 'View blog posts', met: false },
          { id: '2', name: 'Images load quickly (<3s)', met: false },
          { id: '3', name: 'Handle 100 concurrent visitors', met: false },
          { id: '4', name: 'Cost under $50/month', met: false },
        ]}
        budget={{
          monthly: 50,
          setup: 0,
        }}
        onValidate={(system) => {
          // Validation logic would go here
          return {
            isValid: false,
            errors: ['No storage for images', 'Databases not connected properly', 'Excessive redundancy ($847/month)'],
          };
        }}
      />
    </div>
  );
};