import {
  AlertCircle,
  Shield,
  Activity,
  TrendingUp,
  Bell,
  Server,
  Users,
  Globe,
  Database,
} from "lucide-react";

import { BentoCard, BentoGrid } from "./bento-grid";

const newsFeatures = [
  {
    Icon: AlertCircle,
    name: "Hospital System Failures Surge Nationwide",
    description: "Critical infrastructure outages affecting patient data systems across 47 major medical centers. Emergency protocols activated as IT teams scramble to restore services. Patient safety systems remain offline in multiple facilities.",
    href: "#crisis-alert",
    cta: "Emergency Update",
    category: "Emergency",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Shield,
    name: "Medical Device Network Under Cyber Attack",
    description: "Coordinated ransomware attack targets connected medical devices in 12 states. FDA issues emergency guidance as hospitals disconnect critical equipment.",
    href: "#security-breach",
    cta: "Security Alert",
    category: "Security",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "911 Communication Systems Down",
    description: "Emergency dispatch centers across the Northeast report complete communication failures. Backup systems struggling to handle call volume.",
    href: "#emergency-alert",
    cta: "Critical Update",
    category: "Emergency",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Database,
    name: "Health Data Breach Affects 2.3M Patients",
    description: "Major insurance provider confirms unauthorized access to patient records, SSNs, and payment information. Credit monitoring offered to affected customers.",
    href: "#data-breach",
    cta: "Check Exposure",
    category: "Security",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Users,
    name: "Healthcare IT Hiring Surge",
    description: "Hospitals increase recruitment by 340% for system architects, cybersecurity specialists, and DevOps engineers amid ongoing crisis.",
    href: "#job-opportunities",
    cta: "View Jobs",
    category: "Careers",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Globe,
    name: "Global Health Systems at Risk",
    description: "WHO reports similar attacks in 23 countries as healthcare infrastructure becomes primary target. International cybersecurity task force assembled to coordinate response efforts.",
    href: "#global-impact",
    cta: "Global Report",
    category: "Global",
    background: (
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)' 
      }} />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
];

interface BentoNewsDemoProps {
  selectedCategories?: string[];
}

function BentoNewsDemo({ selectedCategories = [] }: BentoNewsDemoProps) {
  const filteredFeatures = selectedCategories.length === 0 
    ? newsFeatures 
    : newsFeatures.filter(feature => selectedCategories.includes(feature.category));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <BentoGrid className="responsive-news-grid">
        {filteredFeatures.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
      
      <style>{`
        .responsive-news-grid {
          grid-template-rows: repeat(3, 22rem);
          grid-template-columns: repeat(3, 1fr);
        }
        
        @media (max-width: 1023px) {
          .responsive-news-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(6, 20rem) !important;
          }
          
          .responsive-news-grid .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        
        @media (max-width: 768px) {
          .responsive-news-grid {
            grid-template-rows: repeat(6, 16rem) !important;
          }
        }
      `}</style>
    </div>
  );
}

export { BentoNewsDemo }; 