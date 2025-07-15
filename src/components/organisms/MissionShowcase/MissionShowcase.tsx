import React, { useState } from 'react';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { MissionCard } from '../../molecules/MissionCard';

const MissionShowcase: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const missions = [
    {
      id: '1',
      title: 'Emergency Room Overflow System',
      partner: 'Doctors Without Borders',
      location: 'Mumbai, India',
      difficulty: 3,
      activePlayers: 127,
      crisis: 'Hospital experiencing 300% capacity. Patients waiting 8+ hours. Need immediate triage optimization.',
      skills: ['System Design', 'Load Balancing', 'Real-time Data', 'API Development'],
      status: 'URGENT'
    },
    {
      id: '2',
      title: 'Flood Response Coordination',
      partner: 'Red Cross Bangladesh',
      location: 'Dhaka, Bangladesh',
      difficulty: 4,
      activePlayers: 89,
      crisis: 'Coordinating rescue efforts for 2,847 families across 12 districts. Current system cannot handle the load.',
      skills: ['Distributed Systems', 'Geolocation', 'Mobile Dev', 'Offline-First'],
      status: 'URGENT'
    },
    {
      id: '3',
      title: 'School Meal Distribution Tracker',
      partner: 'World Food Programme',
      location: 'Nairobi, Kenya',
      difficulty: 2,
      activePlayers: 45,
      crisis: '50,000 children need daily meals. Manual tracking causing 30% food waste and missed deliveries.',
      skills: ['Database Design', 'Analytics', 'Cloud Functions', 'Auth Systems'],
      status: 'ACTIVE'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Missions' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'global', label: 'Global' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          Choose Your Mission. Make Your Impact.
        </h2>
        
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'primary' : 'outline'}
              size="small"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {missions.map(mission => (
            <MissionCard key={mission.id} {...mission} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="large">
            View All 147 Active Missions →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionShowcase;