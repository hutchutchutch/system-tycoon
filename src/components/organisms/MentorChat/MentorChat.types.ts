import type { Edge, Node } from '@xyflow/react';

export interface MentorCanvasNodeData extends Record<string, unknown> {
  label?: string;
  name?: string;
  category?: string;
  description?: string;
  icon?: string;
  userCount?: number;
  status?: string;
}

export interface MentorRequirement {
  id: string;
  description: string;
  completed: boolean;
}

export interface MentorChatProps {
  missionStageId?: string;
  missionTitle?: string;
  problemDescription?: string;
  className?: string;
  // Canvas state for real-time context
  canvasNodes?: Node<MentorCanvasNodeData>[];
  canvasEdges?: Edge[];
  requirements?: MentorRequirement[];
  availableComponents?: Array<Record<string, unknown>>;
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
