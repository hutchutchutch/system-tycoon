import React, { useState, useEffect } from 'react';
import { Badge } from '../../atoms/Badge';

interface StatCounterProps {
  icon: string;
  value: number;
  label: string;
  prefix?: string;
  increment?: boolean;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  icon,
  value,
  label,
  prefix = '',
  increment = false
}) => {
  const [displayValue, setDisplayValue] = useState(increment ? value - 10 : value);

  useEffect(() => {
    if (increment) {
      const timer = setInterval(() => {
        setDisplayValue(prev => prev + 1);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [increment]);

  useEffect(() => {
    // Animate from 0 to value on mount
    const duration = 2000;
    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(start + (displayValue - start) * easeOutQuart);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-900">
        {prefix}{displayValue.toLocaleString()}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};