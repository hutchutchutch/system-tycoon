import React from 'react';
import { BentoNewsDemo } from '../../components/ui/bento-news-demo';

export const NewsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
                Live Updates
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Tech Crisis News Feed
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Breaking stories from the healthcare technology sector. 
              Critical system failures require immediate attention.
            </p>
          </div>

          {/* News Grid */}
          <BentoNewsDemo />

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-red-500">247</div>
              <div className="text-sm text-gray-400">Systems Affected</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-amber-500">14</div>
              <div className="text-sm text-gray-400">States Impacted</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-500">89</div>
              <div className="text-sm text-gray-400">Teams Responding</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-blue-500">Live</div>
              <div className="text-sm text-gray-400">Status Updates</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Last updated: {new Date().toLocaleString()}</p>
            <p className="mt-2">Press SPACE to refresh • ESC to close</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDemo; 