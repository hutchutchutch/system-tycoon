import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  seconds: number;
  label: string;
  icon: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, label, icon }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  
  return (
    <div className="text-center">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono text-2xl">
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(secs).padStart(2, '0')}
        </span>
      </div>
      <p className="text-sm opacity-75">{label}</p>
    </div>
  );
};