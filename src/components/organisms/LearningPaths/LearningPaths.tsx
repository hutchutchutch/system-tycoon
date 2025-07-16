import React from 'react';
import { LearningTrackCard } from '../../molecules/LearningTrackCard';
import styles from './LearningPaths.module.css';

const LearningPaths: React.FC = () => {
  const tracks = [
    {
      title: "Disaster Response Developer",
      partner: "AWS Disaster Response Team",
      modules: [
        { name: "Basic Load Balancing", completed: true },
        { name: "Database Replication", completed: true },
        { name: "Auto-scaling Systems", inProgress: true },
        { name: "Geo-distributed Architecture", locked: true },
        { name: "Chaos Engineering", locked: true }
      ],
      certification: "AWS Certified Disaster Response Architect",
      careerPath: "Site Reliability Engineer → Disaster Tech Lead"
    },
    {
      title: "Healthcare Systems Specialist",
      partner: "Microsoft Health",
      modules: [
        { name: "HIPAA Compliance Basics", completed: true },
        { name: "Patient Data Security", inProgress: true },
        { name: "Real-time Health Monitoring", locked: true },
        { name: "Telemedicine Infrastructure", locked: true },
        { name: "AI Diagnostics Integration", locked: true }
      ],
      certification: "Microsoft Healthcare Cloud Expert",
      careerPath: "Health Tech Developer → Medical Systems Architect"
    },
    {
      title: "Humanitarian Tech Leader",
      partner: "Google Crisis Response",
      modules: [
        { name: "Crisis Communication Systems", completed: true },
        { name: "Offline-First Architecture", inProgress: true },
        { name: "Resource Allocation Algorithms", locked: true },
        { name: "Multi-language Support", locked: true },
        { name: "Emergency Response Protocols", locked: true }
      ],
      certification: "Google Humanitarian Technology Certificate",
      careerPath: "Full Stack Dev → Crisis Response Tech Lead"
    }
  ];
  
  return (
    <section className={styles.learningPaths}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Master Real Skills. Earn Real Credentials.
        </h2>
        
        <div className={styles.grid}>
          {tracks.map(track => (
            <LearningTrackCard key={track.title} {...track} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;