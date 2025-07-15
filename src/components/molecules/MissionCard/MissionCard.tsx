import React from 'react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Users, Star } from 'lucide-react';

interface MissionCardProps {
  title: string;
  partner: string;
  location: string;
  difficulty: number;
  activePlayers: number;
  crisis: string;
  skills: string[];
  status: string;
}

const DifficultyStars: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

export const MissionCard: React.FC<MissionCardProps> = ({ 
  title, 
  partner, 
  location, 
  difficulty, 
  activePlayers, 
  crisis, 
  skills, 
  status 
}) => {
  return (
    <Card className="hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge variant={status === 'URGENT' ? 'destructive' : 'default'}>
            {status}
          </Badge>
          <DifficultyStars count={difficulty} />
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p>Partner: {partner}</p>
          <p>Location: {location}</p>
          <p className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {activePlayers} active players
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-1">The Crisis:</h4>
          <p className="text-sm text-gray-700">{crisis}</p>
        </div>
        
        <div className="mb-6 flex-1">
          <h4 className="font-semibold mb-1">Skills You'll Learn:</h4>
          <div className="flex flex-wrap gap-1">
            {skills.map(skill => (
              <Badge key={skill} variant="outline" size="sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button variant="primary" fullWidth>
          Join Mission →
        </Button>
      </div>
    </Card>
  );
};