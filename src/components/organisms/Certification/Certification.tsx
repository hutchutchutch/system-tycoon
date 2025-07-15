import React from 'react';
import { CertificatePreview } from './components/CertificatePreview';
import { CertificationDetails } from './components/CertificationDetails';
import { HiringPartners } from './components/HiringPartners';
import { SuccessStories } from './components/SuccessStories';

const Certification: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          Turn Your Gaming Into a Career
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
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