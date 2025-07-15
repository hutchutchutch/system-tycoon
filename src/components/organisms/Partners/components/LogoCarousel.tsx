import React from 'react';

interface Partner {
  id: string;
  name: string;
  logo: string;
}

interface LogoCarouselProps {
  onPartnerClick: (partner: Partner) => void;
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({ onPartnerClick }) => {
  const partners: Partner[] = [
    { id: 'redcross', name: 'Red Cross', logo: '🏥' },
    { id: 'unicef', name: 'UNICEF', logo: '🎒' },
    { id: 'who', name: 'World Health Organization', logo: '🌍' },
    { id: 'msf', name: 'Doctors Without Borders', logo: '⚕️' },
    { id: 'wfp', name: 'World Food Programme', logo: '🌾' },
    { id: 'unhcr', name: 'UNHCR', logo: '🏠' }
  ];
  
  // Simple static display - in production would use a carousel library
  return (
    <div className="overflow-hidden">
      <div className="flex justify-center gap-12 flex-wrap">
        {partners.map(partner => (
          <div 
            key={partner.id}
            onClick={() => onPartnerClick(partner)}
            className="flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
            <div className="text-6xl mb-2">{partner.logo}</div>
            <p className="text-sm text-gray-600">{partner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};