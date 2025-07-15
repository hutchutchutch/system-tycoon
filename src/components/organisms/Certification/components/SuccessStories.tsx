import React from 'react';
import { Card } from '../../../atoms/Card';

export const SuccessStories: React.FC = () => {
  const stories = [
    {
      name: "Sarah Chen",
      before: "Bootcamp Graduate",
      after: "Senior SRE at Google",
      quote: "The real-world missions gave me experience I couldn't get anywhere else."
    },
    {
      name: "Carlos Rodriguez",
      before: "Self-taught Developer",
      after: "Cloud Architect at AWS",
      quote: "Building crisis response systems taught me to design for scale and reliability."
    },
    {
      name: "Aisha Patel",
      before: "Junior Developer",
      after: "Tech Lead at Microsoft",
      quote: "The certification opened doors I didn't even know existed."
    }
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-8">Success Stories</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((story, index) => (
          <Card key={index} className="p-6">
            <div className="mb-4">
              <h4 className="font-semibold">{story.name}</h4>
              <p className="text-sm text-gray-600">{story.before} → {story.after}</p>
            </div>
            <p className="text-gray-700 italic">"{story.quote}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};