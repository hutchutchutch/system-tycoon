import React, { useState } from 'react';
import { LogoCarousel } from './components/LogoCarousel';
import { CaseStudyModal } from './components/CaseStudyModal';

const Partners: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
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