import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  cta: string;
  impact?: string | null;
  popular?: boolean;
  isTeam?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  price, 
  features, 
  cta, 
  impact, 
  popular, 
  isTeam 
}) => {
  return (
    <Card className={`relative ${popular ? 'border-2 border-blue-500 transform scale-105' : ''}`}>
      {popular && (
        <Badge variant="primary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">{name}</h3>
          <div className="mt-4">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-gray-600">/{isTeam ? 'team/month' : 'month'}</span>
          </div>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map(feature => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {impact && (
          <div className="mb-4 p-3 bg-green-50 rounded">
            <p className="text-sm text-green-800">💚 {impact}</p>
          </div>
        )}
        
        <Button 
          variant={popular ? 'primary' : 'outline'} 
          fullWidth
        >
          {cta}
        </Button>
      </div>
    </Card>
  );
};