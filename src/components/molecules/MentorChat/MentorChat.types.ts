export interface MentorChatProps {
  missionStageId?: string;
  missionTitle?: string;
  problemDescription?: string;
  className?: string;
  // Canvas state for real-time context
  canvasNodes?: any[];
  canvasEdges?: any[];
  requirements?: any[];
  availableComponents?: any[];
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor' | 'system';
  mentorId?: string;
}

export interface MentorChatState {
  isExpanded: boolean;
  messages: ChatMessage[];
  currentInput: string;
  isLoading: boolean;
  selectedMentorId: string;
} 