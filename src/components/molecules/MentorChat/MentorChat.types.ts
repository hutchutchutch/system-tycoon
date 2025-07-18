export interface MentorChatProps {
  missionStageId?: string;
  missionTitle?: string;
  problemDescription?: string;
  className?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'mentor';
  mentorId?: string;
}

export interface MentorChatState {
  isExpanded: boolean;
  messages: ChatMessage[];
  currentInput: string;
  isLoading: boolean;
  selectedMentorId: string;
} 