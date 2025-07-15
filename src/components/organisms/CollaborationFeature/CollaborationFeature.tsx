import React from 'react';
import { Card } from '../../atoms/Card';
import { Users, GraduationCap, Globe } from 'lucide-react';
import { CollaborationDemo } from './components/CollaborationDemo';

const CollaborationFeature: React.FC = () => {
  const features = [
    {
      title: "Real-time Collaboration",
      description: "Work together on the same canvas. See teammate cursors, components, and changes instantly.",
      icon: <Users className="w-8 h-8" />
    },
    {
      title: "Mentor Mode",
      description: "Experienced players guide newcomers through complex missions.",
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      title: "Global Hackathons",
      description: "Join monthly 48-hour challenges with players worldwide.",
      icon: <Globe className="w-8 h-8" />
    }
  ];
  
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          Never Solve Alone. Multiply Your Impact.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="flex gap-4">
                    <div className="text-blue-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <CollaborationDemo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationFeature;