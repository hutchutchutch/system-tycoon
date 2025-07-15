import React from 'react';
import { Card } from '../../../atoms/Card';
import { Button } from '../../../atoms/Button';
import { X } from 'lucide-react';

interface CaseStudyModalProps {
  partner: {
    id: string;
    name: string;
    logo: string;
  };
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ partner, onClose }) => {
  const caseStudies: Record<string, { title: string; impact: string; story: string }> = {
    redcross: {
      title: "Emergency Response System",
      impact: "50,000 people rescued faster",
      story: "During flooding in Bangladesh, our developers built a real-time coordination system that helped Red Cross teams locate and rescue stranded families 73% faster."
    },
    unicef: {
      title: "Education Tracking Platform",
      impact: "2.3 million children back in school",
      story: "UNICEF needed a way to track displaced children and match them with nearby schools. Our community built a system that reunited children with education."
    }
  };

  const study = caseStudies[partner.id] || caseStudies.redcross;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{partner.logo}</div>
          <h3 className="text-2xl font-bold">{partner.name}</h3>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">{study.title}</h4>
          <p className="text-3xl font-bold text-blue-600">{study.impact}</p>
          <p className="text-gray-600">{study.story}</p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};