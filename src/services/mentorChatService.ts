import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor';
  mentorId?: string;
}

export interface MentorChatSession {
  userId: string;
  mentorId: string;
  conversationSessionId: string;
  missionStageId?: string;
  missionTitle?: string;
  problemDescription?: string;
}

class MentorChatService {
  private static instance: MentorChatService;

  static getInstance(): MentorChatService {
    if (!MentorChatService.instance) {
      MentorChatService.instance = new MentorChatService();
    }
    return MentorChatService.instance;
  }

  async sendMessage(session: MentorChatSession, message: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('mentor-chat', {
        body: {
          userId: session.userId,
          mentorId: session.mentorId,
          message,
          conversationSessionId: session.conversationSessionId,
          missionStageId: session.missionStageId,
          missionTitle: session.missionTitle,
          problemDescription: session.problemDescription,
        },
      });

      if (error) {
        throw error;
      }

      return data.response;
    } catch (error) {
      console.error('Error sending mentor chat message:', error);
      throw new Error('Failed to send message to mentor');
    }
  }

  async getChatHistory(conversationSessionId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('mentor_chat_messages')
        .select('*')
        .eq('conversation_session_id', conversationSessionId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data.map(msg => ({
        id: msg.id,
        content: msg.message_content,
        timestamp: new Date(msg.created_at),
        sender: msg.sender_type as 'user' | 'mentor',
        mentorId: msg.mentor_id,
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Failed to load chat history');
    }
  }

  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const mentorChatService = MentorChatService.getInstance(); 