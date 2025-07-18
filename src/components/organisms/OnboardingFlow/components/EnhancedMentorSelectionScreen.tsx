import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MentorSelectionCard } from '../../../molecules/MentorSelectionCard';
import { MentorDetailCard } from '../../../molecules/MentorDetailCard';
import { fetchMentors, type MentorForUI } from '../../../../services/mentorService';
import styles from './EnhancedMentorSelectionScreen.module.css';

export interface EnhancedMentorSelectionScreenProps {
  onMentorSelected: (mentor: MentorForUI) => void;
}

export const EnhancedMentorSelectionScreen: React.FC<EnhancedMentorSelectionScreenProps> = ({
  onMentorSelected
}) => {
  const [mentors, setMentors] = useState<MentorForUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [centerIndex, setCenterIndex] = useState(2); // Start with middle card
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!carouselRef.current || mentors.length === 0) return;
    
    const carousel = carouselRef.current;
    const cardWidth = 220; // 180px card + 40px gap
    const scrollLeft = carousel.scrollLeft;
    const centerPosition = scrollLeft + carousel.offsetWidth / 2;
    const newCenterIndex = Math.round(centerPosition / cardWidth);
    
    setCenterIndex(Math.max(0, Math.min(mentors.length - 1, newCenterIndex)));
  };

  useEffect(() => {
    const loadMentors = async () => {
      setLoading(true);
      const fetchedMentors = await fetchMentors();
      setMentors(fetchedMentors);
      setLoading(false);
    };

    loadMentors();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel && mentors.length > 0) {
      // Center the middle card initially
      const cardWidth = 220;
      const initialScroll = Math.floor(mentors.length / 2) * cardWidth;
      carousel.scrollLeft = initialScroll;
      
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [mentors]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.loading}>
            <h2>Loading Epic Software Humans...</h2>
            <p>Gathering the legends who will guide your journey</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.error}>
            <h2>No Mentors Available</h2>
            <p>Unable to load mentors. Please try again later.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={styles.title}>Choose Your Epic Software Human</h2>
          <p className={styles.subtitle}>
            These legendary pioneers transformed how we build technology. Now one of them will be your personal guide, 
            mentor, and companion throughout your entire journey in this app.
          </p>
          <p className={styles.description}>
            Select the software legend who inspires you most - they'll provide wisdom, encouragement, 
            and insights as you tackle real-world challenges and build solutions that matter.
          </p>
        </motion.div>

        {/* Mentor Carousel */}
        <motion.div
          ref={carouselRef}
          className={styles.mentorCarousel}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mentors.map((mentor, index) => (
            <motion.div 
              key={mentor.id} 
              className={styles.carouselItem}
              variants={itemVariants}
              style={{
                transform: index === centerIndex ? 'scale(1.25)' : 'scale(1)',
                zIndex: index === centerIndex ? 10 : 1,
                transition: 'transform 0.3s ease, z-index 0.3s ease'
              }}
            >
              <MentorSelectionCard
                mentor={mentor}
                onClick={onMentorSelected}
                isSelected={index === centerIndex}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Scroll hint */}
        <motion.p 
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Scroll to explore all {mentors.length} mentors
        </motion.p>

        {/* Mentor Detail Card */}
        {mentors[centerIndex] && (
          <motion.div
            className={styles.detailCardContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MentorDetailCard
              mentor={mentors[centerIndex]}
              onSelectMentor={onMentorSelected}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}; 