import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import MissionCard from '../../molecules/MissionCard/MissionCard';
import styles from './MissionShowcase.module.css';

interface Mission {
  id: string;
  title: string;
  partner: string;
  location: string;
  difficulty: number;
  activePlayers: number;
  crisis: string;
  skills: string[];
  status: 'URGENT' | 'ACTIVE' | 'NEW';
  category: string;
}

const MissionShowcase: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const missions: Mission[] = [
    {
      id: '1',
      title: 'Emergency Patient Tracking System',
      partner: 'Mumbai General Hospital',
      location: 'Mumbai, India',
      difficulty: 3,
      activePlayers: 47,
      crisis: 'Hospital overwhelmed with 2,847 patients. Paper tracking system collapsed. Doctors can\'t find critical cases.',
      skills: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
      status: 'URGENT',
      category: 'healthcare'
    },
    {
      id: '2',
      title: 'Flood Response Coordination Platform',
      partner: 'Bangladesh Red Cross',
      location: 'Dhaka, Bangladesh',
      difficulty: 4,
      activePlayers: 128,
      crisis: 'Monsoon flooding displaced 50,000 families. Relief teams can\'t coordinate rescue efforts effectively.',
      skills: ['Vue.js', 'Express', 'PostgreSQL', 'WebSockets', 'AWS'],
      status: 'URGENT',
      category: 'disaster'
    },
    {
      id: '3',
      title: 'School Resource Distribution System',
      partner: 'Education Without Borders',
      location: 'Kenya',
      difficulty: 2,
      activePlayers: 23,
      crisis: 'Rural schools lacking basic supplies. No system to track needs or coordinate donations.',
      skills: ['React', 'Firebase', 'Material-UI', 'Google Maps API'],
      status: 'ACTIVE',
      category: 'education'
    },
    {
      id: '4',
      title: 'Wildlife Poaching Alert Network',
      partner: 'Save The Rhino International',
      location: 'South Africa',
      difficulty: 5,
      activePlayers: 89,
      crisis: 'Rangers can\'t respond to poaching incidents fast enough. Need real-time alert system.',
      skills: ['Python', 'TensorFlow', 'React Native', 'GraphQL', 'IoT'],
      status: 'NEW',
      category: 'environment'
    },
    {
      id: '5',
      title: 'Refugee Camp Supply Chain',
      partner: 'UNHCR',
      location: 'Jordan',
      difficulty: 4,
      activePlayers: 156,
      crisis: 'Supply shortages in camps. No visibility into inventory or distribution needs.',
      skills: ['Angular', 'Java Spring', 'Kubernetes', 'RabbitMQ', 'MySQL'],
      status: 'ACTIVE',
      category: 'humanitarian'
    },
    {
      id: '6',
      title: 'Clean Water Monitoring Dashboard',
      partner: 'WaterAid',
      location: 'Cambodia',
      difficulty: 3,
      activePlayers: 34,
      crisis: 'Villages getting sick from contaminated wells. No system to track water quality.',
      skills: ['Vue.js', 'Django', 'TimescaleDB', 'D3.js', 'Arduino'],
      status: 'NEW',
      category: 'health'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Missions' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'environment', label: 'Environment' },
    { value: 'disaster', label: 'Disaster Response' },
    { value: 'humanitarian', label: 'Humanitarian' }
  ];

  const filteredMissions = missions.filter(mission => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return mission.status === 'URGENT';
    return mission.category === filter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.23, 0.86, 0.39, 0.96]
      }
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <Badge variant="primary" size="small" className={styles.badge}>
            Live Missions
          </Badge>
          <h2 className={styles.title}>Choose Your Mission. Make Your Impact.</h2>
          <p className={styles.subtitle}>
            Every mission is a real crisis happening right now. Your code will be deployed to help real people.
          </p>
        </motion.div>

        <div className={styles.filterBar}>
          {categories.map(category => (
            <Button
              key={category.value}
              variant={filter === category.value ? 'primary' : 'outline'}
              size="small"
              onClick={() => setFilter(category.value)}
              className={styles.filterButton}
            >
              {category.label}
              {category.value === 'urgent' && (
                <span className={styles.urgentCount}>2</span>
              )}
            </Button>
          ))}
        </div>

        <motion.div
          className={styles.missionGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredMissions.map(mission => (
            <motion.div key={mission.id} variants={itemVariants}>
              <MissionCard {...mission} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className={styles.footer}
        >
          <p className={styles.liveUpdate}>
            🔴 Live: 2,847 developers solving missions worldwide
          </p>
          <Button variant="outline" size="medium">
            View All Missions →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionShowcase;