import React from 'react';
import { MetricCard } from '../../../molecules/MetricCard';
import { Progress } from '../../../atoms/Progress';

export const PersonalImpact: React.FC = () => {
  const stats = {
    missions: 12,
    lives: 3847,
    systems: 8,
    skills: 24
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">Your Developer Journey</h3>
        <div className="space-y-4">
          <MetricCard 
            data={{
              label: 'Missions Completed',
              value: stats.missions,
              unit: '',
              trend: 'up',
              trendValue: 15
            }}
          />
          <MetricCard 
            data={{
              label: 'Lives Impacted',
              value: stats.lives,
              unit: '',
              trend: 'up',
              trendValue: 23
            }}
          />
          <MetricCard 
            data={{
              label: 'Systems Deployed',
              value: stats.systems,
              unit: '',
              trend: 'stable'
            }}
          />
          <MetricCard 
            data={{
              label: 'Skills Mastered',
              value: stats.skills,
              unit: '/45',
              target: 45
            }}
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-4">Skill Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">System Architecture</span>
              <span className="text-sm text-gray-600">80%</span>
            </div>
            <Progress value={80} variant="primary" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Database Design</span>
              <span className="text-sm text-gray-600">60%</span>
            </div>
            <Progress value={60} variant="primary" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Cloud Security</span>
              <span className="text-sm text-gray-600">50%</span>
            </div>
            <Progress value={50} variant="warning" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Performance Optimization</span>
              <span className="text-sm text-gray-600">70%</span>
            </div>
            <Progress value={70} variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
};