import { Question } from '../../molecules/QuestionCard';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface DialogueEntry {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  type: 'question' | 'response' | 'narration';
}

export interface MeetingRoomProps {
  teamMembers: TeamMember[];
  availableQuestions: Question[];
  selectedQuestions: string[];
  maxQuestions: number;
  dialogueHistory: DialogueEntry[];
  onQuestionSelect: (questionId: string) => void;
  onProceedToDesign: () => void;
  className?: string;
}