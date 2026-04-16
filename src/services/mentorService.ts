import { api } from './cloudflareApi';

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

export const fetchMentors = async (): Promise<MentorForUI[]> => {
  try {
    // The Worker returns objects with: id, name, title, company, contribution, expertise, message, toastMessage
    const data = await api.get<any[]>('/mentors');

    if (!data) {
      return [];
    }

    // Apply the client-side avatar since it is not stored in the database
    return data.map((mentor) => ({
      id: mentor.id,
      name: mentor.name,
      title: mentor.title,
      company: mentor.company || mentor.signature?.knownFor || mentor.specialty?.domains?.[0] || 'Technology',
      contribution: mentor.contribution || mentor.signature?.legacy || mentor.tagline || '',
      avatar: getAvatarForMentor(mentor.name),
      expertise: mentor.expertise || mentor.specialty?.domains || mentor.tags || [],
      message: mentor.message || mentor.lore || mentor.quote || '',
      toastMessage: mentor.toastMessage || `"${mentor.quote || ''}" - Click to learn more about ${mentor.name}'s approach.`,
    }));
  } catch (error) {
    console.error('Error in fetchMentors:', error);
    return [];
  }
};
