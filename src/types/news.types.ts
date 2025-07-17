export interface NewsHero {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar: string;
  location: string;
  category: 'healthcare' | 'environment' | 'education' | 'mental-health' | 'fitness' | 'disaster';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  headline: string;
  preview: string;
  fullDescription: string;
  impact: {
    people: number;
    metric: string;
  };
  technicalProblem: string;
  skillsNeeded: string[];
  businessConstraints: {
    budget: string;
    timeline: string;
    compliance: string[];
  };
}

export const sampleNewsHeroes: NewsHero[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Emergency Medicine Physician',
    organization: 'City General Hospital',
    avatar: '👩‍⚕️',
    location: 'Chicago, IL',
    category: 'healthcare',
    urgency: 'critical',
    headline: 'ER Doctor Creates Patient Tracking System as Hospital Overwhelmed',
    preview: 'Dr. Chen built a spreadsheet to track 300+ patients but it crashes every few hours, risking lives.',
    fullDescription: 'As our hospital faces unprecedented patient volumes, I created a spreadsheet system to track patient status, medications, and bed assignments. With over 300 patients, the system crashes frequently, and we\'ve lost critical data twice this month. Nurses spend 30 minutes per shift just trying to locate patients, and we\'ve had near-misses with medication errors.',
    impact: {
      people: 300,
      metric: 'patients at risk daily'
    },
    technicalProblem: 'Spreadsheet-based patient tracking system failing under load, no real-time updates, data loss incidents',
    skillsNeeded: ['Database Design', 'Real-time Systems', 'HIPAA Compliance', 'Mobile Development'],
    businessConstraints: {
      budget: '$15,000',
      timeline: '2 weeks',
      compliance: ['HIPAA', 'Hospital IT Security']
    }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Food Bank Coordinator',
    organization: 'Community Food Network',
    avatar: '🍎',
    location: 'Detroit, MI',
    category: 'healthcare',
    urgency: 'high',
    headline: 'Food Bank Coordinator Loses Track of 500 Families\' Needs',
    preview: 'Text messages and paper forms can\'t keep up with growing demand - families going hungry.',
    fullDescription: 'We serve 500 families weekly, but our tracking system is a disaster. We use text messages to coordinate volunteers and paper forms to track dietary restrictions, allergies, and family sizes. Last week, we sent peanut products to a family with severe allergies, and we regularly run out of baby formula because we can\'t track inventory properly.',
    impact: {
      people: 500,
      metric: 'families at risk of hunger'
    },
    technicalProblem: 'Manual coordination via text messages, paper forms, no inventory tracking, safety incidents',
    skillsNeeded: ['Inventory Management', 'Mobile Apps', 'SMS Integration', 'Volunteer Coordination'],
    businessConstraints: {
      budget: '$5,000',
      timeline: '3 weeks',
      compliance: ['Food Safety Regulations', 'Volunteer Background Checks']
    }
  },
  {
    id: '3',
    name: 'Jennifer Kim',
    title: 'Elementary School Teacher',
    organization: 'Riverside Elementary',
    avatar: '👩‍🏫',
    location: 'Portland, OR',
    category: 'education',
    urgency: 'medium',
    headline: 'Teacher Manually Tracks 200 Students\' Progress on Paper',
    preview: 'Reading levels, assignment completion, and parent communication all done by hand - kids falling behind.',
    fullDescription: 'I teach 200 students across multiple subjects, tracking their reading levels, assignment completion, and behavioral notes all on paper. Parent conferences take hours to prepare because I have to manually compile information from multiple sources. I suspect several students are falling behind, but I can\'t easily identify patterns or track progress over time.',
    impact: {
      people: 200,
      metric: 'students at risk of falling behind'
    },
    technicalProblem: 'Paper-based student tracking, no progress analytics, manual parent communication, data scattered across multiple sources',
    skillsNeeded: ['Educational Software', 'Data Analytics', 'Parent Communication', 'Progress Tracking'],
    businessConstraints: {
      budget: '$8,000',
      timeline: '6 weeks',
      compliance: ['FERPA', 'School District IT Policy']
    }
  },
  {
    id: '4',
    name: 'Alex Thompson',
    title: 'Conservation Biologist',
    organization: 'Wildlife Research Institute',
    avatar: '🐘',
    location: 'Nairobi, Kenya',
    category: 'environment',
    urgency: 'high',
    headline: 'Biologist Tracks Endangered Species on Notebook Paper',
    preview: 'Monitoring 50 elephant families with handwritten notes - conservation efforts at risk.',
    fullDescription: 'I monitor 50 elephant families across a 500-square-mile reserve, tracking their movements, health, and family structures in handwritten notebooks. When rangers need to locate specific animals for medical treatment, it takes hours to find the right notes. We\'ve lost valuable research data twice when notebooks were damaged by rain, and collaboration with other research teams is nearly impossible.',
    impact: {
      people: 50,
      metric: 'endangered elephant families'
    },
    technicalProblem: 'Handwritten research notes, no digital backup, impossible collaboration, weather damage risk',
    skillsNeeded: ['GIS Mapping', 'Mobile Data Collection', 'Research Data Management', 'Offline Systems'],
    businessConstraints: {
      budget: '$12,000',
      timeline: '4 weeks',
      compliance: ['Research Ethics', 'Data Sharing Agreements']
    }
  },
  {
    id: '5',
    name: 'Maria Santos',
    title: 'Crisis Counselor',
    organization: 'Mental Health Crisis Line',
    avatar: '🤝',
    location: 'Phoenix, AZ',
    category: 'mental-health',
    urgency: 'critical',
    headline: 'Crisis Counselor Loses Track of High-Risk Callers',
    preview: 'Managing 100+ crisis calls daily with sticky notes - people in crisis slipping through cracks.',
    fullDescription: 'I handle 100+ crisis calls daily, using sticky notes to track follow-ups, medication checks, and high-risk individuals. Our computer system is from 2005 and crashes hourly. Yesterday, I couldn\'t find notes for a high-risk caller who needed immediate follow-up. The system doesn\'t flag recurring callers or track intervention success, making it impossible to provide consistent care.',
    impact: {
      people: 100,
      metric: 'people in crisis daily'
    },
    technicalProblem: 'Outdated system crashing hourly, sticky note follow-ups, no caller history, missed high-risk cases',
    skillsNeeded: ['Crisis Management Systems', 'Caller ID Integration', 'Follow-up Tracking', 'Mental Health Privacy'],
    businessConstraints: {
      budget: '$25,000',
      timeline: '1 week',
      compliance: ['HIPAA', 'Crisis Intervention Standards', 'Suicide Prevention Guidelines']
    }
  },
  {
    id: '6',
    name: 'Coach Williams',
    title: 'Community Fitness Coordinator',
    organization: 'Youth Athletic League',
    avatar: '🏃‍♂️',
    location: 'Atlanta, GA',
    category: 'fitness',
    urgency: 'medium',
    headline: 'Coach Manually Schedules 300 Kids Across 12 Sports',
    preview: 'Whiteboard scheduling and phone calls can\'t handle growing youth sports program.',
    fullDescription: 'I coordinate sports programs for 300 kids across 12 different sports, managing schedules, equipment, and volunteer coaches all on whiteboards and through phone calls. Parents constantly miss practice times, equipment gets lost, and I spend 15 hours a week just answering scheduling questions. We\'ve had to cancel games because of miscommunication.',
    impact: {
      people: 300,
      metric: 'kids missing sports opportunities'
    },
    technicalProblem: 'Whiteboard scheduling, phone call coordination, parent communication chaos, equipment tracking impossible',
    skillsNeeded: ['Sports Management', 'Parent Communication', 'Equipment Tracking', 'Volunteer Coordination'],
    businessConstraints: {
      budget: '$6,000',
      timeline: '5 weeks',
      compliance: ['Youth Sports Safety', 'Background Check Requirements']
    }
  }
];

export interface NewsArticle {
  id: string;
  mission_id: string;
  headline: string;
  subheadline?: string;
  preview_text: string;
  full_text: string;
  hero_image_url?: string;
  thumbnail_url?: string;
  image_alt_text?: string;
  author_name: string;
  author_avatar_url?: string;
  publication_name: string;
  urgency_level: 'critical' | 'high' | 'medium' | 'low';
  impact_stats: Record<string, any>;
  location?: string;
  category_slug: string;
  tags: string[];
  grid_size: 'small' | 'medium' | 'large' | 'featured';
  sort_weight: number;
  article_status: 'draft' | 'active' | 'in_progress' | 'success' | 'partial_success' | 'expired';
  success_headline?: string;
  success_text?: string;
  success_stats?: Record<string, any>;
  success_published_at?: string;
  view_count: number;
  contact_count: number;
  completion_count: number;
  meta_description?: string;
  social_image_url?: string;
  published_at: string;
  updated_at: string;
  expires_at?: string;
  created_at: string;
}

export interface NewsHeroContact {
  name: string;
  title: string;
  organization: string;
  avatar: string;
  email?: string;
  technicalProblem: string;
  skillsNeeded: string[];
  businessConstraints: {
    budget: string;
    timeline: string;
  };
  impact: {
    people: number;
    metric: string;
  };
}

// Convert NewsArticle to format needed for EmailComposer
export function newsArticleToHero(article: NewsArticle): NewsHero {
  // Extract key info from article for EmailComposer
  const impactPeople = article.impact_stats.families_affected || 
                      article.impact_stats.students_benefited || 
                      article.impact_stats.children_sick || 
                      article.impact_stats.households_affected || 
                      article.impact_stats.businesses_participating || 
                      100;
  
  const impactMetric = article.category_slug === 'healthcare' ? 'people at risk' :
                      article.category_slug === 'education' ? 'students affected' :
                      article.category_slug === 'environment' ? 'households impacted' :
                      article.category_slug === 'small-business' ? 'businesses affected' :
                      'people impacted';

  // Map category_slug to NewsHero category
  const categoryMap: Record<string, NewsHero['category']> = {
    'healthcare': 'healthcare',
    'environment': 'environment', 
    'education': 'education',
    'small-business': 'education', // Map to closest match
    'community': 'mental-health' // Map to closest match
  };

  return {
    id: article.id,
    name: article.author_name,
    title: 'Community Leader',
    organization: article.location || 'Local Community',
    avatar: article.author_avatar_url || '👤',
    location: article.location || '',
    category: categoryMap[article.category_slug] || 'healthcare',
    urgency: article.urgency_level,
    headline: article.headline,
    preview: article.preview_text,
    fullDescription: article.full_text,
    impact: {
      people: impactPeople,
      metric: impactMetric
    },
    technicalProblem: article.subheadline || 'Technical system challenges requiring expert assistance',
    skillsNeeded: article.tags.filter(tag => !['urgent', 'critical', 'community'].includes(tag)),
    businessConstraints: {
      budget: article.impact_stats.budget_available || '$5,000',
      timeline: `${article.impact_stats.days_until_vote || 30} days`,
      compliance: []
    }
  };
}