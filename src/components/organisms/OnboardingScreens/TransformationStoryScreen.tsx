import React, { useState } from 'react';
import { Button } from '../../atoms/Button';

interface TransformationStory {
  id: string;
  icon: string;
  headline: string;
  body: string;
}

export interface TransformationStoryScreenProps {
  stories: TransformationStory[];
  onComplete: () => void;
}

export const TransformationStoryScreen: React.FC<TransformationStoryScreenProps> = ({
  stories,
  onComplete
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = stories[currentStoryIndex];
  const isLastStory = currentStoryIndex === stories.length - 1;

  const handleNext = () => {
    if (isLastStory) {
      onComplete();
    } else {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      maxWidth: '800px',
      padding: '40px',
      gap: '40px'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '20px'
      }}>
        {currentStory.icon}
      </div>

      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: 0,
        color: 'var(--color-text-primary)',
        lineHeight: 1.3
      }}>
        {currentStory.headline}
      </h2>
      
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-secondary)',
        maxWidth: '600px',
        lineHeight: 1.6,
        margin: 0
      }}>
        {currentStory.body}
      </p>

      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentStoryIndex === 0}
        >
          ← Previous
        </Button>

        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {stories.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index === currentStoryIndex 
                  ? 'var(--color-accent-primary)' 
                  : 'var(--color-surface-tertiary)',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        <Button
          variant="primary"
          onClick={handleNext}
        >
          {isLastStory ? 'Continue →' : 'Next →'}
        </Button>
      </div>
    </div>
  );
}; 