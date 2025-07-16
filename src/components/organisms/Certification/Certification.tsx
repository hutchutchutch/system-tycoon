import React from 'react';
import { CertificatePreview } from './components/CertificatePreview';
import { CertificationDetails } from './components/CertificationDetails';
import { HiringPartners } from './components/HiringPartners';
import { SuccessStories } from './components/SuccessStories';
import styles from './Certification.module.css';

const Certification: React.FC = () => {
  return (
    <section className={styles.certification}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Turn Your Gaming Into a Career
        </h2>
        
        <div className={styles.mainGrid}>
          <CertificatePreview />
          <CertificationDetails />
        </div>
        
        <HiringPartners />
        <SuccessStories />
      </div>
    </section>
  );
};

export default Certification;