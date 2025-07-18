import { supabase } from './supabase';

export interface DatabaseMentor {
  id: string;
  name: string;
  title: string;
  tags: string[];
  tagline: string;
  quote: string;
  signature: {
    legacy: string;
    knownFor: string;
  };
  personality: {
    style: string;
    traits: string | string[];
  };
  specialty: {
    tools: string[];
    domains: string[];
  };
  lore: string;
  created_at: string;
  updated_at: string;
}

export interface MentorForUI {
  id: string;
  name: string;
  title: string;
  company: string;
  contribution: string;
  avatar: string;
  expertise: string[];
  message: string;
  toastMessage: string;
}

// Map mentor names to appropriate emojis
const getAvatarForMentor = (name: string): string => {
  const avatarMap: Record<string, string> = {
    'Jeff Dean': '🏗️',
    'Grace Hopper': '👩‍💻',
    'Barbara Liskov': '👩‍🏫',
    'Werner Vogels': '☁️',
    'Leslie Lamport': '🔬',
    'Linus Torvalds': '🐧',
    'James Gosling': '☕',
    'Ken Thompson': '🔧',
    'Martin Fowler': '📐',
    'Sanjay Ghemawat': '⚡',
    'Fei-Fei Li': '👁️',
    'Donald Knuth': '📚',
    'Vint Cerf': '🌐',
    'Margaret Hamilton': '🚀',
    'Pat Helland': '🔄',
    'Dr. Linda Wu': '👩‍🏫',
    'Sam Okafor': '📊',
    'Maya Patel': '☁️',
    'Chen Zhang': '🛡️',
    'Jordan Rivera': '🚀',
    'Alex Kim': '🏢'
  };
  
  return avatarMap[name] || '👨‍💻';
};

// Transform database mentor to UI format
const transformMentorForUI = (dbMentor: DatabaseMentor): MentorForUI => {
  const traits = Array.isArray(dbMentor.personality.traits) 
    ? dbMentor.personality.traits 
    : [dbMentor.personality.traits];

  return {
    id: dbMentor.id,
    name: dbMentor.name,
    title: dbMentor.title,
    company: dbMentor.signature?.knownFor || dbMentor.specialty?.domains?.[0] || 'Technology',
    contribution: dbMentor.signature?.legacy || dbMentor.tagline,
    avatar: getAvatarForMentor(dbMentor.name),
    expertise: dbMentor.specialty?.domains || dbMentor.tags || [],
    message: dbMentor.lore || dbMentor.quote,
    toastMessage: `"${dbMentor.quote}" - Click to learn more about ${dbMentor.name}'s approach.`
  };
};

export const fetchMentors = async (): Promise<MentorForUI[]> => {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('created_at');

    if (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }

    return data.map(transformMentorForUI);
  } catch (error) {
    console.error('Error in fetchMentors:', error);
    return [];
  }
}; 