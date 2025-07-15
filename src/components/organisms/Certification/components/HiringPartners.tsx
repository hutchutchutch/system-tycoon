import React from 'react';

export const HiringPartners: React.FC = () => {
  const partners = [
    { name: 'Google', emoji: '🌐' },
    { name: 'Microsoft', emoji: '💻' },
    { name: 'Amazon', emoji: '📦' },
    { name: 'Meta', emoji: '👥' },
    { name: 'Netflix', emoji: '🎬' },
    { name: 'Spotify', emoji: '🎵' }
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-8">Hiring Partners</h3>
      <div className="flex justify-center gap-8 flex-wrap">
        {partners.map(partner => (
          <div key={partner.name} className="text-center">
            <div className="text-4xl mb-2">{partner.emoji}</div>
            <p className="text-sm text-gray-600">{partner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};