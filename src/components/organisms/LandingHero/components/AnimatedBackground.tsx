import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating cloud icons */}
        <div className="absolute top-10 left-10 animate-float">☁️</div>
        <div className="absolute top-20 right-20 animate-float-delayed">🌐</div>
        <div className="absolute bottom-20 left-1/4 animate-float">💚</div>
        <div className="absolute bottom-10 right-1/3 animate-float-delayed">⚡</div>
      </div>
    </div>
  );
};