import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { MentorCard } from '../game/MentorCard';
import { QuestionCard } from '../game/QuestionCard';
import { CharacterPortrait } from '../game/CharacterPortrait';
import { MetricsDashboard } from '../game/MetricsDashboard';
import { AchievementToast } from '../game/AchievementToast';

/**
 * Component Showcase - Demonstrates all design system components
 * This component serves as both documentation and a visual test suite
 */
export const ComponentShowcase: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Sample data
  const sampleMentor = {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Systems Architect',
    avatar: '/avatars/sarah.png',
    specializations: ['Architecture', 'Scalability', 'Cloud'],
    advicePreview: 'Focus on building systems that can scale horizontally...',
    levelRange: 'Levels 1-5',
    isRecommended: true,
  };

  const sampleQuestion = {
    id: '1',
    text: 'What are your expected traffic patterns during peak hours?',
    category: 'technical' as const,
    impact: {
      requirements: 2,
      budget: 1,
    },
  };

  const sampleMetrics = [
    {
      label: 'Requests/sec',
      value: 1250,
      unit: 'req/s',
      trend: 'up' as const,
      trendValue: '+12%',
      max: 2000,
    },
    {
      label: 'Response Time',
      value: 145,
      unit: 'ms',
      trend: 'down' as const,
      trendValue: '-5%',
    },
    {
      label: 'Error Rate',
      value: 0.02,
      unit: '%',
      status: 'normal' as const,
    },
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">System Design Tycoon - Component Showcase</h1>

      {/* Buttons Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
            <Button size="icon-only">🎮</Button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
            <Button icon="🚀" iconPosition="left">With Icon</Button>
            <Button icon="→" iconPosition="right">Icon Right</Button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Basic Card</h3>
            </CardHeader>
            <CardBody>
              <p>This is a basic card with header, body, and footer sections.</p>
            </CardBody>
            <CardFooter>
              <Button size="small" variant="ghost">Action</Button>
            </CardFooter>
          </Card>

          <Card interactive>
            <CardBody>
              <h3 className="font-semibold mb-2">Interactive Card</h3>
              <p>Hover over this card to see the interactive effects.</p>
            </CardBody>
          </Card>

          <Card selected>
            <CardBody>
              <h3 className="font-semibold mb-2">Selected Card</h3>
              <p>This card shows the selected state styling.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="premium">Premium</Badge>
        </div>
      </section>

      {/* Progress Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Progress Bars</h2>
        <div className="space-y-4">
          <Progress value={25} />
          <Progress value={50} variant="success" />
          <Progress value={75} variant="warning" />
          <Progress value={90} variant="error" />
        </div>
      </section>

      {/* Game Components Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Game Components</h2>
        
        <div className="space-y-8">
          {/* Mentor Card */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Mentor Card</h3>
            <div className="max-w-md">
              <MentorCard
                mentor={sampleMentor}
                selected={selectedMentor === sampleMentor.id}
                onSelect={(mentor) => setSelectedMentor(mentor.id)}
              />
            </div>
          </div>

          {/* Question Card */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Question Cards</h3>
            <div className="space-y-2 max-w-lg">
              <QuestionCard
                question={sampleQuestion}
                selected={selectedQuestion === sampleQuestion.id}
                onSelect={(q) => setSelectedQuestion(q.id)}
              />
              <QuestionCard
                question={{
                  ...sampleQuestion,
                  id: '2',
                  text: 'What is your budget for this project?',
                  category: 'business',
                  impact: { budget: 3 },
                }}
                disabled
              />
            </div>
          </div>

          {/* Character Portrait */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Character Portraits</h3>
            <div className="flex gap-4">
              <CharacterPortrait
                name="Sarah"
                avatar="/avatars/sarah.png"
                size="small"
              />
              <CharacterPortrait
                name="Alex"
                avatar="/avatars/alex.png"
                isAvailable
                badge="3"
              />
              <CharacterPortrait
                name="Mike"
                avatar="/avatars/mike.png"
                size="large"
                isAvailable
              />
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Metrics Dashboard</h3>
            <div className="max-w-sm">
              <MetricsDashboard
                title="System Performance"
                metrics={sampleMetrics}
                status="normal"
              />
            </div>
          </div>

          {/* Achievement Toast */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Achievement Toast</h3>
            <Button onClick={() => setShowToast(true)}>
              Show Achievement Toast
            </Button>
            {showToast && (
              <div className="fixed bottom-4 right-4 z-50">
                <AchievementToast
                  title="First System Deployed!"
                  description="You've successfully deployed your first system architecture."
                  onClose={() => setShowToast(false)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-4xl">Heading 1 - System Design Tycoon</h1>
          <h2 className="text-3xl">Heading 2 - Build Complex Systems</h2>
          <h3 className="text-2xl">Heading 3 - Learn Through Gaming</h3>
          <h4 className="text-xl">Heading 4 - Interactive Experience</h4>
          <h5 className="text-lg">Heading 5 - Real-World Scenarios</h5>
          <h6 className="text-base">Heading 6 - Industry Best Practices</h6>
          
          <p className="text-base">
            Body text - Master system design through engaging visual gameplay. 
            Design architectures for real companies, watch data flow through 
            your systems, and learn from industry experts.
          </p>
          
          <p className="text-sm text-gray-600">
            Small text - Additional information and helper text appears in this size.
          </p>
        </div>
      </section>

      {/* Colors Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Primary Colors</h3>
            <div className="flex gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className="w-12 h-12 rounded"
                  style={{ backgroundColor: `var(--color-primary-${shade})` }}
                  title={`Primary ${shade}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Secondary Colors</h3>
            <div className="flex gap-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className="w-12 h-12 rounded"
                  style={{ backgroundColor: `var(--color-secondary-${shade})` }}
                  title={`Secondary ${shade}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};