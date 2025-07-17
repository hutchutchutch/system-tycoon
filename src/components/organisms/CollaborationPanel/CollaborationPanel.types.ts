export interface CollaborationPanelProps {
  scenarioId: string;
  onSessionChange: (sessionId: string | null) => void;
  currentSessionId?: string | null;
} 