import { api } from './cloudflareApi';
import { evaluateGraph, repairLegacyGraph } from '../../shared/game';

export interface CanvasNodeData extends Record<string, unknown> {
  category?: string;
  label?: string;
  cost?: number;
}

export interface CanvasNodeInput {
  id: string;
  data: CanvasNodeData;
}

export interface CanvasEdgeInput {
  source: string;
  target: string;
}

interface ValidatorRequirement {
  validation_type?: string;
  required_nodes?: string[];
  min_nodes?: number;
  min_nodes_of_type?: Record<string, number>;
  required_connection?: { from: string; to: string };
  target_metric?: string;
  target_value?: number;
}

interface RawStageRequirement {
  id: string;
  title: string;
  requirement_type: string;
  priority?: number | string;
  initially_visible?: boolean;
  unlock_order?: number;
  validation_config?: {
    required_components?: string[];
    min_instances?: number;
    source_types?: string[];
    target_types?: string[];
    max_monthly_cost?: number;
  };
}

type ApiRequirement = Omit<Requirement, 'completed' | 'validator'> & { completed?: boolean };

interface MissionStageApiResponse extends Omit<MissionStageData, 'system_requirements'> {
  system_requirements: ApiRequirement[];
  requirements?: RawStageRequirement[];
}

export interface Requirement {
  id: string;
  description: string;
  completed: boolean;
  type?: string;
  priority?: string;
  validation?: string;
  validation_type?: string;
  required_nodes?: string[];
  min_nodes?: number;
  min_nodes_of_type?: Record<string, number>;
  required_connection?: { from: string; to: string };
  target_metric?: string;
  target_value?: number;
  validator?: (nodes: CanvasNodeInput[], edges: CanvasEdgeInput[]) => boolean;
}

export interface ComponentRequirement {
  id: string;
  name: string;
  category: string;
  icon_name: string;
  color?: string;
  short_description: string;
  detailed_description?: string;
  concepts?: unknown[];
  use_cases?: unknown[];
  compatible_with?: unknown[];
  unlock_level: number;
  required: boolean;
}

export interface MissionData {
  id: string;
  slug: string;
  title: string;
  description: string;
  crisis_description: string;
  stages: MissionStageSummary[];
  components: ComponentRequirement[];
  requirements: Requirement[];
}

export interface MissionStageSummary {
  id: string;
  mission_id: string;
  stage_number: number;
  title: string;
  problem_description: string;
}

export interface MissionStageData extends MissionStageSummary {
  id: string;
  system_requirements: Requirement[];
  stages: MissionStageSummary[];
  mission: {
    id: string;
    slug: string;
    title: string;
    description: string;
    crisis_description: string;
  };
}

// New types for our enhanced validation system
export interface ValidationResult {
  id: string;
  title: string;
  description: string;
  type: string;
  completed: boolean;
  visible: boolean;
  priority: number;
  points: number;
  message: string;
  hint?: string;
  validationDetails: unknown;
}

export interface ValidationResponse {
  success: boolean;
  stageAttemptId?: string;
  summary: {
    totalRequirements: number;
    completedRequirements: number;
    pointsEarned: number;
    allCompleted: boolean;
    completionPercentage: number;
  };
  requirements: ValidationResult[];
}

export interface DeliveredEmailPreview {
  id: string;
  subject: string;
  preview: string | null;
  sender_name: string;
  sender_email: string;
  priority: string;
  trigger_type: string;
}

export interface CompleteStageResponse {
  success: boolean;
  stageCompleted: boolean;
  firstCompletion: boolean;
  missionCompleted: boolean;
  nextStageId: string | null;
  nextStageNumber: number | null;
  pointsEarned: number;
  impactTotal: number | null;
  deliveredEmails: DeliveredEmailPreview[];
  validation: {
    summary: ValidationResponse['summary'];
    requirements: ValidationResult[];
  };
}

export class MissionService {
  private static instance: MissionService;
  private activeMission: MissionData | null = null;

  static getInstance(): MissionService {
    if (!MissionService.instance) {
      MissionService.instance = new MissionService();
    }
    return MissionService.instance;
  }

  async loadMissionBySlug(slug: string): Promise<MissionData | null> {
    try {
      const missionData = await api.get<MissionData>('/missions/' + slug);

      if (!missionData) {
        return null;
      }

      // Attach validator functions to requirements
      const requirements = missionData.requirements.map((req) => ({
        ...req,
        completed: false,
        validator: this.createValidatorFunction(req),
      }));

      const mission: MissionData = {
        ...missionData,
        requirements,
      };

      this.activeMission = mission;
      return mission;
    } catch (error) {
      console.error('Failed to load mission:', error);
      return null;
    }
  }

  // Transform mission_stage_requirements table data to Requirement interface
  private transformMissionStageRequirements(dbRequirements: RawStageRequirement[]): Requirement[] {
    return dbRequirements
      .filter(req => req.initially_visible || (req.unlock_order ?? 1) <= 1) // Only show initially visible requirements
      .map(req => ({
        id: req.id,
        description: req.title, // Use title as the main description for Requirements component
        completed: false,
        type: req.requirement_type,
        priority: req.priority?.toString() || '1',
        validation: req.validation_config ? JSON.stringify(req.validation_config) : undefined,
        validation_type: req.requirement_type,
        // Parse validation_config for validator creation
        required_nodes: req.validation_config?.required_components || undefined,
        min_nodes: req.validation_config?.min_instances || undefined,
        min_nodes_of_type: req.validation_config?.min_instances ?
          { [req.validation_config.required_components?.[0] || 'unknown']: req.validation_config.min_instances } : undefined,
        required_connection: req.validation_config?.source_types && req.validation_config?.target_types ?
          { from: req.validation_config.source_types[0], to: req.validation_config.target_types[0] } : undefined,
        target_metric: req.validation_config?.max_monthly_cost ? 'cost' : undefined,
        target_value: req.validation_config?.max_monthly_cost || undefined,
        validator: this.createValidatorFunction({
          validation_type: req.requirement_type,
          required_nodes: req.validation_config?.required_components,
          min_nodes: req.validation_config?.min_instances,
          required_connection: req.validation_config?.source_types && req.validation_config?.target_types ?
            { from: req.validation_config.source_types[0], to: req.validation_config.target_types[0] } : undefined,
          target_metric: req.validation_config?.max_monthly_cost ? 'cost' : undefined,
          target_value: req.validation_config?.max_monthly_cost
        })
      }));
  }

  // Create validator function based on database validation criteria
  private createValidatorFunction(requirement: ValidatorRequirement): (nodes: CanvasNodeInput[], edges: CanvasEdgeInput[]) => boolean {
    return (nodes, edges) => evaluateGraph(repairLegacyGraph({ nodes, edges }), [{
      id: 'legacy', title: 'Design requirement', requirement_type: requirement.validation_type ?? '',
      validation_config: { required_components: requirement.required_nodes, min_instances: requirement.min_nodes,
        source_types: requirement.required_connection ? [requirement.required_connection.from] : undefined,
        target_types: requirement.required_connection ? [requirement.required_connection.to] : undefined,
        max_monthly_cost: requirement.target_value },
    }]).summary.allCompleted;
  }

  async loadMissionStageById(stageId: string): Promise<MissionStageData | null> {
    try {
      const stageData = await api.get<MissionStageApiResponse>('/missions/stage/' + stageId);

      if (!stageData) {
        return null;
      }

      // If the Worker returns requirements already transformed, use them;
      // otherwise transform them from raw DB shape.
      const transformedRequirements: Requirement[] = stageData.system_requirements?.length
        ? stageData.system_requirements.map((req) => ({
            ...req,
            completed: false,
            validator: this.createValidatorFunction(req),
          }))
        : this.transformMissionStageRequirements(stageData.requirements || []);

      return {
        id: stageData.id,
        mission_id: stageData.mission_id,
        stage_number: stageData.stage_number,
        title: stageData.title,
        problem_description: stageData.problem_description,
        system_requirements: transformedRequirements,
        stages: stageData.stages,
        mission: stageData.mission,
      };
    } catch (error) {
      console.error('Failed to load mission stage:', error);
      return null;
    }
  }

  getActiveMission(): MissionData | null {
    return this.activeMission;
  }

  validateRequirements(nodes: CanvasNodeInput[], edges: CanvasEdgeInput[]): Requirement[] {
    if (!this.activeMission) return [];

    return this.activeMission.requirements.map(req => ({
      ...req,
      completed: req.validator ? req.validator(nodes, edges) : false
    }));
  }

  /**
   * Validate requirements using the Cloudflare Worker API
   * This integrates with our database-driven requirement system
   */
  async validateRequirementsWithAPI(
    stageId: string,
    userId: string,
    nodes: CanvasNodeInput[],
    edges: CanvasEdgeInput[],
    stageAttemptId?: string
  ): Promise<ValidationResponse> {
    try {
      const data = await api.post<ValidationResponse>('/missions/validate', {
        stageId,
        userId,
        nodes,
        edges,
        stageAttemptId,
      });

      if (!data.success) {
        throw new Error('Validation was not successful');
      }

      return data;
    } catch (error) {
      console.error('Error validating requirements:', error);
      throw error;
    }
  }

  /**
   * Complete a stage on the server. Re-validates server-side, advances
   * the user's mission progress, awards Impact, and delivers the next
   * stage's brief email (or the mission_complete email on the final stage).
   * Throws ApiError with status 409 if requirements aren't actually met.
   */
  async completeStage(
    stageId: string,
    nodes: CanvasNodeInput[],
    edges: CanvasEdgeInput[],
    idempotencyKey: string = crypto.randomUUID(),
  ): Promise<CompleteStageResponse> {
    return await api.post<CompleteStageResponse>('/missions/complete-stage', {
      stageId,
      nodes,
      edges,
      idempotencyKey,
    });
  }

  /**
   * Get the current user ID from the API.
   * (Better Auth profile endpoint — there is no /auth/me on the worker.)
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const user = await api.get<{ id: string }>('/profile/me');
      return user?.id || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

// Start mission when user sends contact email to news article hero
export async function startMissionFromContactEmail(params: {
  newsArticleId: string;
  missionId: string;
  contactEmailData: {
    to: string;
    subject: string;
    body: string;
    hero?: unknown;
  };
}): Promise<{ success: boolean; missionStarted: boolean; firstStageEmails?: unknown[]; error?: string }> {
  try {
    const { newsArticleId, missionId, contactEmailData } = params;

    const result = await api.post<{
      success: boolean;
      missionStarted: boolean;
      firstStageEmails?: unknown[];
    }>('/missions/start', {
      newsArticleId,
      missionId,
      contactEmailData,
    });

    return {
      success: result.success,
      missionStarted: result.missionStarted,
      firstStageEmails: result.firstStageEmails || [],
    };
  } catch (error) {
    console.error('Error starting mission from contact email:', error);
    return {
      success: false,
      missionStarted: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const missionService = MissionService.getInstance();
