import React from 'react';
import { Card } from '../../../atoms/Card';
import { Check } from 'lucide-react';

export const CertificationDetails: React.FC = () => {
  const benefits = [
    "Recognized by 500+ tech companies globally",
    "Validates real-world system design skills",
    "Blockchain-verified and tamper-proof",
    "Includes portfolio of completed missions",
    "Direct referrals to hiring partners",
    "Lifetime validity with continuous updates"
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Why Our Certification Matters</h3>
      
      <Card className="p-6">
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Did you know?</strong> 87% of our certified players received job offers 
          within 3 months of certification.
        </p>
      </div>
    </div>
  );
};