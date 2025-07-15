import React from 'react';
import { StatCounter } from '../../../molecules/StatCounter';

export const SocialProofBar: React.FC = () => {
  return (
    <div className="flex justify-center gap-12 mt-12">
      <StatCounter 
        icon="🌍"
        value={127834}
        label="Lives Impacted"
        increment={true}
      />
      <StatCounter 
        icon="👥"
        value={3847}
        label="Active Players"
        prefix=""
      />
      <StatCounter 
        icon="⚡"
        value={89}
        label="Crisis Systems Built Today"
      />
    </div>
  );
};