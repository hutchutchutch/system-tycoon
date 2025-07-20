import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { fetchMentors, type MentorForUI } from '../../../services/mentorService';

export interface EnhancedMentorSelectionScreenProps {
  onMentorSelected: (mentor: MentorForUI) => void;
}

export const EnhancedMentorSelectionScreen: React.FC<EnhancedMentorSelectionScreenProps> = ({
  onMentorSelected
}) => {
  const [mentors, setMentors] = useState<MentorForUI[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorForUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const mentorsData = await fetchMentors();
      
      if (mentorsData.length === 0) {
        // Fallback to mock data if no mentors from database
        // Using IDs that match the MENTORS constant in src/constants/mentors.ts
        const mockMentors: MentorForUI[] = [
          {
            id: 'linda-wu',
            name: 'Dr. Linda Wu',
            title: 'Senior Systems Architect',
            company: 'Tech Solutions Inc',
            contribution: 'Built foundational architecture patterns for scalable systems',
            avatar: '👩‍🏫',
            expertise: ['System Design', 'Architecture Patterns', 'Scalability'],
            message: 'Patient teacher who explains the "why" behind architectural decisions. Let\'s think about this step by step and build a solid foundation.',
            toastMessage: 'Dr. Wu will guide you through foundational architecture patterns and scalability principles.'
          },
          {
            id: 'jordan-rivera',
            name: 'Jordan Rivera',
            title: 'Startup CTO',
            company: 'TechFlow Ventures',
            contribution: 'Helped dozens of startups build their first products from idea to scale',
            avatar: '🚀',
            expertise: ['MVP Development', 'Rapid Scaling', 'Startup Architecture'],
            message: 'Pragmatic approach focused on getting to market fast while building for scale. For an MVP, I\'d recommend starting simple and iterating.',
            toastMessage: 'Jordan will help you master pragmatic development and rapid scaling strategies.'
          },
          {
            id: 'maya-patel',
            name: 'Maya Patel',
            title: 'Cloud Solutions Architect',
            company: 'CloudFirst Technologies',
            contribution: 'Pioneered modern cloud architectures and microservices patterns',
            avatar: '☁️',
            expertise: ['Cloud Platforms', 'Microservices', 'Distributed Systems'],
            message: 'Forward-thinking approach using cutting-edge cloud solutions. In the cloud, we can leverage managed services to focus on what matters.',
            toastMessage: 'Maya will guide you through modern cloud architectures and distributed system patterns.'
          }
        ];
        setMentors(mockMentors);
      } else {
        setMentors(mentorsData);
      }
    } catch (err) {
      console.error('Error loading mentors:', err);
      setError('Failed to load mentors. Please try again.');
      
      // Fallback to mock data if there's an error
      const mockMentors: MentorForUI[] = [
        {
          id: 'linda-wu',
          name: 'Dr. Linda Wu',
          title: 'Senior Systems Architect',
          company: 'Tech Solutions Inc',
          contribution: 'Built foundational architecture patterns for scalable systems',
          avatar: '👩‍🏫',
          expertise: ['System Design', 'Architecture Patterns', 'Scalability'],
          message: 'Patient teacher who explains the "why" behind architectural decisions. Let\'s think about this step by step and build a solid foundation.',
          toastMessage: 'Dr. Wu will guide you through foundational architecture patterns and scalability principles.'
        },
        {
          id: 'jordan-rivera',
          name: 'Jordan Rivera',
          title: 'Startup CTO',
          company: 'TechFlow Ventures',
          contribution: 'Helped dozens of startups build their first products from idea to scale',
          avatar: '🚀',
          expertise: ['MVP Development', 'Rapid Scaling', 'Startup Architecture'],
          message: 'Pragmatic approach focused on getting to market fast while building for scale. For an MVP, I\'d recommend starting simple and iterating.',
          toastMessage: 'Jordan will help you master pragmatic development and rapid scaling strategies.'
        },
        {
          id: 'maya-patel',
          name: 'Maya Patel',
          title: 'Cloud Solutions Architect',
          company: 'CloudFirst Technologies',
          contribution: 'Pioneered modern cloud architectures and microservices patterns',
          avatar: '☁️',
          expertise: ['Cloud Platforms', 'Microservices', 'Distributed Systems'],
          message: 'Forward-thinking approach using cutting-edge cloud solutions. In the cloud, we can leverage managed services to focus on what matters.',
          toastMessage: 'Maya will guide you through modern cloud architectures and distributed system patterns.'
        }
      ];
      setMentors(mockMentors);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorClick = (mentor: MentorForUI) => {
    setSelectedMentor(mentor);
  };

  const handleConfirm = () => {
    if (selectedMentor) {
      setIsConfirming(true);
      // Fade to black, then call the callback
      setTimeout(() => {
        onMentorSelected(selectedMentor);
      }, 1000); // 1 second fade duration
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '20px',
        height: '100%',
        color: 'white'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #00d4ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Loading mentors...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && mentors.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        gap: '24px',
        height: '100%',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          ⚠️
        </div>
        <div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: 'white'
          }}>
            Failed to Load Mentors
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 24px 0'
          }}>
            {error}
          </p>
          <Button
            variant="primary"
            onClick={loadMentors}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      gap: '40px',
      minHeight: '100%',
      color: 'white',
      position: 'relative'
    }}>
      {/* Fade to black overlay */}
      {isConfirming && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          zIndex: 9999,
          opacity: isConfirming ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: 'none'
        }} />
      )}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
          color: 'white',
          marginBottom: '16px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          Choose Your Mentor
        </h2>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.8)',
          maxWidth: '600px',
          lineHeight: 1.6,
          margin: 0
        }}>
          Your mentor will guide you through your first projects and help you help others.
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div style={{
        width: '100vw',
        position: 'relative',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'visible'
      }}>
        {/* Left gradient fade */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none'
        }} />
        
        {/* Right gradient fade */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 10,
          pointerEvents: 'none'
        }} />
        
        <div style={{
          display: 'flex',
          gap: '24px',
          overflowX: 'auto',
          overflowY: 'visible',
          paddingBottom: '20px',
          paddingTop: '20px',
          paddingLeft: '80px',
          paddingRight: '80px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {mentors.map((mentor) => (
            <Card
              key={mentor.id}
              style={{
                minWidth: '320px',
                maxWidth: '320px',
                padding: '24px',
                cursor: 'pointer',
                border: selectedMentor?.id === mentor.id 
                  ? '2px solid #00d4ff' 
                  : '2px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                backgroundColor: selectedMentor?.id === mentor.id 
                  ? 'rgba(0, 212, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                transform: selectedMentor?.id === mentor.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedMentor?.id === mentor.id 
                  ? '0 8px 32px rgba(0, 212, 255, 0.3)' 
                  : '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
              onClick={() => handleMentorClick(mentor)}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center',
                height: '100%'
              }}>
                <div style={{ 
                  fontSize: '3rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}>
                  {mentor.avatar}
                </div>
                
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: 0,
                    color: 'white',
                    marginBottom: '4px'
                  }}>
                    {mentor.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '1rem',
                    color: '#00d4ff',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {mentor.title}
                  </p>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {mentor.company}
                </p>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  lineHeight: 1.5,
                  flex: 1
                }}>
                  {mentor.message}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  {mentor.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
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
      </div>

      {selectedMentor && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirm}
          style={{
            padding: '16px 48px',
            fontSize: '1.125rem',
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 4px 16px rgba(0, 212, 255, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          Start with {selectedMentor.name} →
        </Button>
      )}

      <style>{`
        /* Hide scrollbar for webkit browsers */
        div::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for firefox */
        * {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}; 