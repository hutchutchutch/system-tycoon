import React from 'react';
import Marquee from 'react-fast-marquee';
import styles from './MessageRecommendations.module.css';

interface Mentor {
  id: string;
  name: string;
  signature: {
    legacy: string;
    knownFor: string;
  };
  specialty: {
    tools: string[];
    domains: string[];
  };
}

interface MessageRecommendationsProps {
  mentors: Mentor[];
  onRecommendationClick: (message: string) => void;
}

const generateRecommendations = (mentors: Mentor[]): string[] => {
  const recommendations: string[] = [];
  
  mentors.forEach(mentor => {
    // Generate prompts based on their signature and specialty
    recommendations.push(
      `Ask ${mentor.name} about ${mentor.signature.knownFor.split(',')[0]} in system design`,
      `How did ${mentor.name}'s work on ${mentor.specialty.domains[0]} influence modern architectures?`,
      `What insights does ${mentor.name} have about ${mentor.specialty.tools[0]} for scalable systems?`
    );
  });
  
  return recommendations;
};

export const MessageRecommendations: React.FC<MessageRecommendationsProps> = ({
  mentors,
  onRecommendationClick
}) => {
  const recommendations = generateRecommendations(mentors);
  
  console.log('MessageRecommendations rendered with:', {
    mentorCount: mentors.length,
    recommendationCount: recommendations.length,
    firstFewRecommendations: recommendations.slice(0, 3)
  });

  // Always show marquee with test data if no mentors
  const testRecommendations = recommendations.length > 0 ? recommendations : [
    'Ask Werner Vogels about AWS architecture',
    'How did Jeff Dean influence scalable systems?',
    'What insights does Donald Knuth have about algorithms?'
  ];

  return (
    <div className={styles.container}>
      <Marquee
        speed={30}
        gradient={false}
        className={styles.marquee}
        autoFill
      >
        {testRecommendations.map((recommendation, index) => (
          <div
            key={index}
            className={styles.recommendationTag}
            onClick={() => onRecommendationClick(recommendation)}
          >
            {recommendation}
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default MessageRecommendations; 