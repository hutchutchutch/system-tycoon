import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import type { MentorForUI } from '../../../services/mentorService';

export interface EnhancedMentorSelectionScreenProps {
  onMentorSelected: (mentor: MentorForUI) => void;
}

// Mock mentors data for now
const mockMentors: MentorForUI[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Cloud Infrastructure Expert',
    company: 'AWS',
    contribution: 'Built scalable systems for healthcare and education',
    avatar: '👩‍💻',
    expertise: ['AWS', 'Azure', 'Cloud Architecture'],
    message: 'Former AWS Solutions Architect with 15+ years building scalable systems.',
    toastMessage: 'Dr. Chen will guide you through cloud architecture best practices.'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Full-Stack Development Lead',
    company: 'Tech Startup',
    contribution: 'Helped dozens of startups build their first products',
    avatar: '👨‍💼',
    expertise: ['React', 'Node.js', 'Full-Stack'],
    message: 'Tech lead who has helped dozens of startups build their first products from idea to launch.',
    toastMessage: 'Marcus will help you master full-stack development practices.'
  },
  {
    id: '3',
    name: 'Dr. Amara Okafor',
    title: 'Data & AI Strategist',
    company: 'Google AI',
    contribution: 'Applied ML to solve real-world social challenges',
    avatar: '👩‍🔬',
    expertise: ['Machine Learning', 'Data Analytics', 'AI Strategy'],
    message: 'Former Google AI researcher focused on applying ML to solve real-world social challenges.',
    toastMessage: 'Dr. Okafor will guide you through data science and AI applications.'
  }
];

export const EnhancedMentorSelectionScreen: React.FC<EnhancedMentorSelectionScreenProps> = ({
  onMentorSelected
}) => {
  const [selectedMentor, setSelectedMentor] = useState<MentorForUI | null>(null);

  const handleMentorClick = (mentor: MentorForUI) => {
    setSelectedMentor(mentor);
  };

  const handleConfirm = () => {
    if (selectedMentor) {
      onMentorSelected(selectedMentor);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '40px',
      maxWidth: '1200px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
          color: 'var(--color-text-primary)',
          marginBottom: '16px'
        }}>
          Choose Your Mentor
        </h2>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.6,
          margin: 0
        }}>
          Your mentor will guide you through your first projects and help you develop your consulting skills.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        width: '100%'
      }}>
        {mockMentors.map((mentor) => (
          <Card
            key={mentor.id}
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: selectedMentor?.id === mentor.id 
                ? '2px solid var(--color-accent-primary)' 
                : '2px solid transparent',
              transition: 'all 0.3s ease',
              backgroundColor: selectedMentor?.id === mentor.id 
                ? 'var(--color-surface-tertiary)' 
                : 'var(--color-surface-secondary)'
            }}
            onClick={() => handleMentorClick(mentor)}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem' }}>
                {mentor.avatar}
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: 0,
                  color: 'var(--color-text-primary)',
                  marginBottom: '4px'
                }}>
                  {mentor.name}
                </h3>
                
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--color-accent-primary)',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {mentor.title}
                </p>
              </div>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-tertiary)',
                margin: 0,
                fontWeight: '500'
              }}>
                {mentor.company}
              </p>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                lineHeight: 1.5
              }}>
                {mentor.message}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                justifyContent: 'center'
              }}>
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      backgroundColor: 'var(--color-surface-interactive)',
                      color: 'var(--color-text-secondary)',
                      borderRadius: '12px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedMentor && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirm}
          style={{
            padding: '16px 48px',
            fontSize: '1.125rem'
          }}
        >
          Start with {selectedMentor.name} →
        </Button>
      )}
    </div>
  );
}; 