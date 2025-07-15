import React from 'react';
import { PricingCard } from '../../molecules/PricingCard';
import { Shield } from 'lucide-react';

const Pricing: React.FC = () => {
  const tiers = [
    {
      name: 'Volunteer',
      price: 0,
      features: [
        '3 missions per month',
        'Basic cloud components',
        'Solo play only',
        'Community forums',
        'Impact tracking'
      ],
      cta: 'Start Free',
      impact: null
    },
    {
      name: 'Responder',
      price: 9.99,
      features: [
        'Unlimited missions',
        'All cloud components',
        'Real-time collaboration',
        'Voice chat',
        'Priority crisis alerts',
        'Certification eligible'
      ],
      cta: 'Upgrade to Responder',
      impact: '10% goes to mission partners',
      popular: true
    },
    {
      name: 'Guardian',
      price: 49,
      features: [
        'Everything in Responder',
        'Custom branded missions',
        'Team analytics dashboard',
        'Direct partner connections',
        'Implementation support',
        'Priority support'
      ],
      cta: 'Contact Sales',
      impact: '25% goes to selected charity',
      isTeam: true
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          Choose Your Impact Level
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map(tier => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        <p className="text-center mt-8 text-gray-600 flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          100% transparent impact reporting. See exactly how your subscription helps.
        </p>
      </div>
    </section>
  );
};

export default Pricing;