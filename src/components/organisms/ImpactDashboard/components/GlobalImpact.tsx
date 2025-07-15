import React from 'react';
import { MetricCard } from '../../../molecules/MetricCard';
import { Card } from '../../../atoms/Card';

export const GlobalImpact: React.FC = () => {
  const globalStats = [
    { label: 'Total Lives Impacted', value: 127834, unit: '', trend: 'up', trendValue: 8 },
    { label: 'Active Crisis Systems', value: 384, unit: '', trend: 'up', trendValue: 12 },
    { label: 'Countries Reached', value: 67, unit: '', trend: 'stable' },
    { label: 'Partner Organizations', value: 142, unit: '', trend: 'up', trendValue: 5 }
  ];

  const topContributors = [
    { rank: 1, name: 'Sarah Chen', country: 'Singapore', impact: 12847 },
    { rank: 2, name: 'Alex Kumar', country: 'India', impact: 11293 },
    { rank: 3, name: 'Maria Silva', country: 'Brazil', impact: 9847 },
    { rank: 4, name: 'John Doe', country: 'USA', impact: 8739 },
    { rank: 5, name: 'You', country: 'Your Country', impact: 3847, highlight: true }
  ];
  
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {globalStats.map((stat, index) => (
          <MetricCard key={index} data={stat} />
        ))}
      </div>
      
      <Card className="p-8">
        <h3 className="text-xl font-bold mb-6">Top Contributors This Month</h3>
        <div className="space-y-4">
          {topContributors.map(contributor => (
            <div 
              key={contributor.rank}
              className={`flex items-center justify-between p-4 rounded-lg ${
                contributor.highlight ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  contributor.rank <= 3 ? 'bg-yellow-400' : 'bg-gray-300'
                } text-white font-bold`}>
                  {contributor.rank}
                </div>
                <div>
                  <p className="font-semibold">{contributor.name}</p>
                  <p className="text-sm text-gray-600">{contributor.country}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{contributor.impact.toLocaleString()}</p>
                <p className="text-sm text-gray-600">lives impacted</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};