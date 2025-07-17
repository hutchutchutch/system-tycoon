import type { CursorPosition, ParticipantInfo } from '../../../hooks/useRealtimeCollaboration';

export interface CursorManagerProps {
  cursors: Record<string, CursorPosition>;
  participants: Record<string, ParticipantInfo>;
  canvasRef: React.RefObject<HTMLDivElement>;
} 