import React, { useState } from 'react';
import { LogoCarousel } from './components/LogoCarousel';
import { CaseStudyModal } from './components/CaseStudyModal';
import styles from './Partners.module.css';

const Partners: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  
  return (
    <section className={styles.partners}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Trusted by Organizations Changing the World
        </h2>
        
        <LogoCarousel onPartnerClick={setSelectedPartner} />
        
        {selectedPartner && (
          <CaseStudyModal 
            partner={selectedPartner}
            onClose={() => setSelectedPartner(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Partners;