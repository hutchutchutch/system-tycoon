import { supabase } from './supabase';

export interface MentorData {
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
    traits: string;
  };
  specialty: {
    tools: string[];
    domains: string[];
  };
  lore: string;
  created_at: string;
  updated_at: string;
}

export class MentorService {
  /**
   * Get mentor by ID
   */
  static async getMentorById(mentorId: string): Promise<MentorData | null> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', mentorId)
        .single();

      if (error) {
        console.error('Error fetching mentor:', error);
        return null;
      }

      return data as MentorData;
    } catch (error) {
      console.error('Error fetching mentor:', error);
      return null;
    }
  }

  /**
   * Get all mentors
   */
  static async getAllMentors(): Promise<MentorData[]> {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mentors:', error);
        return [];
      }

      return data as MentorData[];
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  }

  /**
   * Generate mentor wisdom message based on real data
   */
  static generateWisdomMessage(mentorData: MentorData): string[] {
    const messages: string[] = [];

    // Add personalized intro
    messages.push(`"${mentorData.quote}"`);
    messages.push('');
    
    // Add signature achievements
    messages.push(`My legacy: ${mentorData.signature.legacy}`);
    messages.push(`Known for: ${mentorData.signature.knownFor}`);
    messages.push('');

    // Add specialty areas
    if (mentorData.specialty.domains.length > 0) {
      messages.push('Key domains I mastered:');
      mentorData.specialty.domains.forEach(domain => {
        messages.push(`• ${domain}`);
      });
      messages.push('');
    }

    // Add tools expertise
    if (mentorData.specialty.tools.length > 0) {
      messages.push('Tools and technologies I pioneered:');
      mentorData.specialty.tools.forEach(tool => {
        messages.push(`• ${tool}`);
      });
      messages.push('');
    }

    // Add lore/background
    messages.push('About me:');
    messages.push(mentorData.lore);
    messages.push('');

    // Add personality insight
    messages.push('My approach:');
    messages.push(mentorData.personality.style);
    messages.push('');

    // Add final wisdom
    messages.push('Remember:');
    messages.push(`"${mentorData.tagline}"`);

    return messages;
  }
} 