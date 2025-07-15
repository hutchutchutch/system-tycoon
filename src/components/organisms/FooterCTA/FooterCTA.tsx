import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { CountdownTimer } from '../../molecules/CountdownTimer';
import { AnimatedCounter } from '../../molecules/AnimatedCounter';

const FooterCTA: React.FC = () => {
  const [stats] = useState({
    activeDevelopers: 2384,
    nextMissionTime: 16997 // seconds
  });
  
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-4">
          Ready to Code for Good?
        </h2>
        
        <p className="text-xl text-center mb-8 opacity-90 max-w-2xl mx-auto">
          Join a global community using technology to solve humanity's greatest challenges.
          Your next line of code could save lives.
        </p>
        
        <div className="flex justify-center gap-8 mb-8 flex-wrap">
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <span className="font-mono text-2xl">
                <AnimatedCounter value={stats.activeDevelopers} />
              </span>
            </div>
            <p className="text-sm opacity-75">developers solving missions</p>
          </div>
          <CountdownTimer 
            icon="⏰"
            seconds={stats.nextMissionTime}
            label="Next urgent mission in"
          />
        </div>
        
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="large" className="hover:scale-105 transition-transform">
            🚀 Start Your First Mission - Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;