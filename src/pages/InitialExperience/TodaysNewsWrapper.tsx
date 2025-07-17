import React from 'react';
import { BentoNewsDemo } from '../../components/ui/bento-news-demo';

export const TodaysNewsWrapper: React.FC = () => {
  return (
    <div className="w-full h-full bg-surface-primary overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-white">
            Today's Tech Crisis News
          </h1>
          <p className="text-lg text-muted-foreground">
            Breaking stories from the healthcare technology sector
          </p>
        </div>

        {/* News Grid */}
        <BentoNewsDemo />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}; 