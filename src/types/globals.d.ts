export {};

declare global {
  interface Window {
    refreshEmailInbox?: () => Promise<void>;
    triggerEmailNotification?: () => void;
    updateMentorNotificationProgress?: (stageId: string, step: number) => void;
  }
}
