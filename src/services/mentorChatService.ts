import { api } from './cloudflareApi';
import type { GraphSnapshot } from '../../shared/game';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor' | 'system';
  mentorId?: string;
}

export interface PageContextData {
  currentPage: string;
  purpose: string;
  availableData?: unknown;
  userGoals?: string[];
  relevantEntities?: unknown[];
}

interface PageContextInput {
  newsArticles?: unknown;
  filteredArticles?: unknown[];
  emails?: unknown;
  emailList?: unknown[];
  missionStage?: unknown;
  mission?: unknown;
  requirements?: unknown;
  components?: unknown;
  canvasState?: unknown;
  currentNodes?: unknown[];
  currentEdges?: unknown[];
  gameState?: unknown;
  activeMissions?: unknown[];
}

interface MentorHistoryDto {
  id: string;
  content?: string;
  message_content?: string;
  timestamp?: string;
  created_at?: string;
  sender?: ChatMessage['sender'];
  sender_type?: ChatMessage['sender'];
  mentorId?: string;
  mentor_id?: string;
}

export interface MentorChatSession {
  canvasState?: GraphSnapshot;
  userId: string;
  mentorId: string;
  conversationSessionId: string;
  missionStageId?: string;
  missionTitle?: string;
  problemDescription?: string;
  contextData?: PageContextData;
}

// Context collection functions for different pages
export const collectPageContext = (pathname: string, additionalData?: PageContextInput): PageContextData => {
  switch (true) {
    case pathname.includes('/browser/news') || pathname === '/browser/news':
      return {
        currentPage: 'ChooseMission',
        purpose: 'Users browse through news articles to find communities and organizations that need help with their technical challenges. They look for bento cards showing problems they can solve.',
        userGoals: [
          'Find news articles about technical problems',
          'Identify organizations that need help',
          'Click "Contact" to reach out and offer assistance',
          'Look for articles matching their expertise level'
        ],
        availableData: additionalData?.newsArticles || 'Various news articles about technical challenges and system failures',
        relevantEntities: additionalData?.filteredArticles || []
      };

    case pathname.includes('/email') || pathname === '/email':
      return {
        currentPage: 'EmailClient',
        purpose: 'Users manage their emails, including mission briefings, urgent requests from communities, and communications about ongoing projects.',
        userGoals: [
          'Read mission briefings and urgent communications',
          'Respond to community requests for help',
          'Track progress on ongoing technical assistance',
          'Prioritize high-priority communications (red dots)'
        ],
        availableData: additionalData?.emails || 'Email inbox with mission briefings and community requests',
        relevantEntities: additionalData?.emailList || []
      };

    case pathname.includes('/whiteboard') || pathname.includes('CrisisSystemDesign'):
      return {
        currentPage: 'CrisisSystemDesign',
        purpose: 'Users design system architecture solutions to fix technical problems, drag components onto canvas, make connections, and validate their solutions meet requirements.',
        userGoals: [
          'Understand the technical problem and requirements',
          'Design system architecture using available components',
          'Connect components to show data flow',
          'Test and validate the solution meets all requirements',
          'Optimize for cost and performance'
        ],
        availableData: {
          missionStage: additionalData?.missionStage || 'Current mission stage details',
          mission: additionalData?.mission || 'Current mission information',
          requirements: additionalData?.requirements || 'System requirements to meet',
          components: additionalData?.components || 'Available system components',
          canvasState: additionalData?.canvasState || {
            nodes: [],
            edges: [],
            connectionSummary: { totalNodes: 0, totalConnections: 0 }
          }
        },
        relevantEntities: [
          ...(additionalData?.currentNodes || []),
          ...(additionalData?.currentEdges || [])
        ]
      };

    case pathname.includes('/game') || pathname === '/game':
      return {
        currentPage: 'GameDashboard',
        purpose: 'Main game interface where users see their progress, available missions, statistics, and can navigate to different game sections.',
        userGoals: [
          'View current mission progress',
          'Check statistics and achievements',
          'Navigate to different game sections',
          'See available mentors and resources'
        ],
        availableData: additionalData?.gameState || 'Game progress and statistics',
        relevantEntities: additionalData?.activeMissions || []
      };

    default:
      return {
        currentPage: 'Unknown',
        purpose: 'User is on an unrecognized page',
        userGoals: ['Navigate to known sections of the application'],
        availableData: 'Limited context available'
      };
  }
};

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
      const data = await api.post<{ response: string }>('/mentors/chat', {
        mentorId: session.mentorId,
        conversationSessionId: session.conversationSessionId,
        messageContent: message,
        senderType: 'user',
        missionStageId: session.missionStageId,
        missionTitle: session.missionTitle,
        problemDescription: session.problemDescription,
        contextData: session.contextData,
        canvasState: session.canvasState,
      });

      return data.response;
    } catch (error) {
      console.error('Error sending mentor chat message:', error);
      throw new Error('Failed to send message to mentor');
    }
  }

  async getChatHistory(conversationSessionId: string): Promise<ChatMessage[]> {
    try {
      const data = await api.get<MentorHistoryDto[]>('/mentors/chat/' + conversationSessionId);

      if (!data) {
        return [];
      }

      return data.map((msg) => ({
        id: msg.id,
        content: msg.message_content || msg.content || '',
        timestamp: new Date(msg.created_at || msg.timestamp || Date.now()),
        sender: (msg.sender_type || msg.sender) as 'user' | 'mentor' | 'system',
        mentorId: msg.mentor_id || msg.mentorId,
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Failed to load chat history');
    }
  }

  generateSessionId(): string {
    return `session_${crypto.randomUUID()}`;
  }
}

export const mentorChatService = MentorChatService.getInstance();
