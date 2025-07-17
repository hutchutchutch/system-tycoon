import type { ParticipantInfo } from '../../../hooks/useRealtimeCollaboration';

export interface ParticipantsListProps {
  participants: Record<string, ParticipantInfo>;
} 