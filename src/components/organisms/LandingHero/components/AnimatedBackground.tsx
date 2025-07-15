import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating tech icons */}
      <div className="absolute top-10 left-10 animate-float text-white opacity-20">💻</div>
      <div className="absolute top-20 right-20 animate-float-delayed text-white opacity-20">🌐</div>
      <div className="absolute bottom-20 left-1/4 animate-float text-white opacity-20">⚡</div>
      <div className="absolute bottom-10 right-1/3 animate-float-delayed text-white opacity-20">🚀</div>
    </div>
  );
};