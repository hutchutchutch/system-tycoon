import { api } from './cloudflareApi';
import type {
  ActiveProject,
  ProjectStatus,
  ProjectMetrics,
  ProjectEvent,
} from '../types/social';

// =============================================
// Project Service
// Talks to the Cloudflare Worker API (/api/projects).
// Realtime is replaced by lightweight polling (hybrid strategy).
// =============================================

export const projectService = {
  // ----- Reads -----
  async getProjects(): Promise<ActiveProject[]> {
    return api.get<ActiveProject[]>('/projects');
  },

  async getProjectById(projectId: string): Promise<ActiveProject | null> {
    return api.get<ActiveProject>(`/projects/${projectId}`);
  },

  async getProjectMetrics(projectId: string): Promise<ProjectMetrics | null> {
    return api.get<ProjectMetrics | null>(`/projects/${projectId}/metrics`);
  },

  async getProjectEvents(projectId: string, limit = 50): Promise<ProjectEvent[]> {
    return api.get<ProjectEvent[]>(`/projects/${projectId}/events?limit=${limit}`);
  },

  // ----- Create / update -----
  async createProject(missionId: string, npcId: string, conversationId: string): Promise<ActiveProject> {
    return api.post<ActiveProject>('/projects', { missionId, npcId, conversationId });
  },

  async updateProjectStatus(projectId: string, status: ProjectStatus): Promise<void> {
    await api.patch(`/projects/${projectId}/status`, { status });
  },

  async saveDesignState(projectId: string, nodes: any[], edges: any[]): Promise<void> {
    await api.put(`/projects/${projectId}/design`, { nodes, edges });
  },

  async updateRequirementsMet(projectId: string, requirementIds: string[]): Promise<void> {
    await api.patch(`/projects/${projectId}/requirements`, { requirementIds });
  },

  async deployProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return api.post(`/projects/${projectId}/deploy`);
  },

  async completeProject(projectId: string): Promise<{ score: number; revenue: number }> {
    return api.post(`/projects/${projectId}/complete`);
  },

  async abandonProject(projectId: string): Promise<void> {
    await api.post(`/projects/${projectId}/abandon`);
  },

  // ----- Events -----
  async createEvent(
    projectId: string,
    event: Omit<ProjectEvent, 'id' | 'project_id' | 'acknowledged' | 'created_at'>
  ): Promise<ProjectEvent> {
    return api.post<ProjectEvent>(`/projects/${projectId}/events`, event);
  },

  async acknowledgeEvent(eventId: string): Promise<void> {
    await api.patch(`/projects/events/${eventId}/ack`);
  },

  async acknowledgeAllEvents(projectId: string): Promise<void> {
    await api.post(`/projects/${projectId}/ack-events`);
  },

  // ----- Polling (replaces Supabase Realtime) -----
  subscribeToProject(
    projectId: string,
    callbacks: {
      onProjectUpdate?: (project: ActiveProject) => void;
      onMetricsUpdate?: (metrics: ProjectMetrics) => void;
      onNewEvent?: (event: ProjectEvent) => void;
    }
  ): () => void {
    const seenEvents = new Set<string>();
    let primed = false;
    const tick = async () => {
      const [project, metrics, events] = await Promise.all([
        callbacks.onProjectUpdate ? this.getProjectById(projectId) : Promise.resolve(null),
        callbacks.onMetricsUpdate ? this.getProjectMetrics(projectId) : Promise.resolve(null),
        callbacks.onNewEvent ? this.getProjectEvents(projectId) : Promise.resolve([] as ProjectEvent[]),
      ]);
      if (project && callbacks.onProjectUpdate) callbacks.onProjectUpdate(project);
      if (metrics && callbacks.onMetricsUpdate) callbacks.onMetricsUpdate(metrics);
      if (callbacks.onNewEvent) {
        for (const e of events) {
          if (!seenEvents.has(e.id)) {
            seenEvents.add(e.id);
            if (primed) callbacks.onNewEvent(e);
          }
        }
      }
      primed = true;
    };
    void tick();
    const timer = setInterval(() => void tick(), 5000);
    return () => clearInterval(timer);
  },

  subscribeToUserProjects(_userId: string, onUpdate: (projects: ActiveProject[]) => void): () => void {
    const tick = async () => onUpdate(await this.getProjects());
    void tick();
    const timer = setInterval(() => void tick(), 10000);
    return () => clearInterval(timer);
  },
};

export default projectService;
