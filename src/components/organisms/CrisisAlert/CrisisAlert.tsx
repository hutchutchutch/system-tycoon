import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';

const CrisisAlert: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Slide down after 3 seconds
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinMission = () => {
    navigate('/auth/signin');
  };
  
  return (
    <div className={`fixed top-0 w-full bg-red-600 text-white p-3 transform transition-transform z-50 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">⚠️</span>
          <span className="text-sm md:text-base">URGENT: Flood response system needed in Bangladesh - 2,847 families awaiting help</span>
        </div>
        <Button 
          variant="outline" 
          size="small" 
          className="!text-white !border-white hover:!bg-white hover:!text-red-600"
          onClick={handleJoinMission}
        >
          Join Mission →
        </Button>
      </div>
    </div>
  );
};

export default CrisisAlert;