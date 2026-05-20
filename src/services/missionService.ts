import { api } from './cloudflareApi';

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
  validator?: (nodes: any[], edges: any[]) => boolean;
}

export interface ComponentRequirement {
  id: string;
  name: string;
  category: string;
  icon_name: string;
  color?: string;
  short_description: string;
  detailed_description?: string;
  concepts?: any[];
  use_cases?: any[];
  compatible_with?: any[];
  unlock_level: number;
  required: boolean;
}

export interface MissionData {
  id: string;
  slug: string;
  title: string;
  description: string;
  crisis_description: string;
  stages: any[];
  components: ComponentRequirement[];
  requirements: Requirement[];
}

interface MissionStageData {
  id: string;
  title: string;
  problem_description: string;
  system_requirements: Requirement[];
  mission: {
    id: string;
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
  validationDetails: any;
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
        return this.getFallbackMission(slug);
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
      return this.getFallbackMission(slug);
    }
  }

  // Transform database requirements to include validator functions
  private transformDatabaseRequirements(dbRequirements: any[]): Requirement[] {
    return dbRequirements.map(req => ({
      ...req,
      completed: false,
      validator: this.createValidatorFunction(req)
    }));
  }

  // Transform mission_stage_requirements table data to Requirement interface
  private transformMissionStageRequirements(dbRequirements: any[]): Requirement[] {
    return dbRequirements
      .filter(req => req.initially_visible || req.unlock_order <= 1) // Only show initially visible requirements
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
  private createValidatorFunction(requirement: any): (nodes: any[], edges: any[]) => boolean {
    const { validation_type, required_nodes, min_nodes, required_connection, min_nodes_of_type, target_metric, target_value } = requirement;

    return (nodes: any[], edges: any[]) => {
      switch (validation_type) {
        case 'node_categories':
          if (min_nodes && nodes.length < min_nodes) return false;
          if (required_nodes) {
            return required_nodes.every((category: string) =>
              nodes.some(n => n.data.category === category)
            );
          }
          return true;

        case 'node_count':
          if (min_nodes_of_type && required_nodes) {
            return required_nodes.every((category: string) => {
              const count = nodes.filter(n => n.data.category === category).length;
              const requiredCount = min_nodes_of_type[category] || 1;
              return count >= requiredCount;
            });
          }
          return true;

        case 'node_and_connection':
          // First check if required nodes exist
          if (required_nodes) {
            const hasRequiredNodes = required_nodes.every((category: string) =>
              nodes.some(n => n.data.category === category)
            );
            if (!hasRequiredNodes) return false;
          }

          // Then check the connection
          if (required_connection) {
            return edges.some((e) => {
              const sourceNode = nodes.find(n => n.id === e.source);
              const targetNode = nodes.find(n => n.id === e.target);

              return (sourceNode?.data.category === required_connection.from && targetNode?.data.category === required_connection.to) ||
                     (sourceNode?.data.category === required_connection.to && targetNode?.data.category === required_connection.from);
            });
          }
          return true;

        case 'edge_connection':
          if (required_connection) {
            return edges.some((e) => {
              const sourceNode = nodes.find(n => n.id === e.source);
              const targetNode = nodes.find(n => n.id === e.target);

              if (required_connection.from === 'families' || required_connection.to === 'families') {
                return (sourceNode?.data.label === 'Families' && targetNode?.data.category === required_connection.to) ||
                       (sourceNode?.data.category === required_connection.from && targetNode?.data.label === 'Families');
              }

              return (sourceNode?.data.category === required_connection.from && targetNode?.data.category === required_connection.to) ||
                     (sourceNode?.data.category === required_connection.to && targetNode?.data.category === required_connection.from);
            });
          }
          return true;

        case 'component_required':
          // Check if required components exist with proper min/max instances
          if (required_nodes) {
            return required_nodes.every((category: string) => {
              const count = nodes.filter(n => n.data.category === category).length;
              return count >= (min_nodes || 1);
            });
          }
          return true;

        case 'connection_required':
          // Check if required connections exist between specific component types
          if (required_connection) {
            return edges.some((e) => {
              const sourceNode = nodes.find(n => n.id === e.source);
              const targetNode = nodes.find(n => n.id === e.target);

              // Handle special cases like 'families' or user nodes
              if (required_connection.from === 'families' || required_connection.to === 'families') {
                return (sourceNode?.data.label === 'Families' && targetNode?.data.category === required_connection.to) ||
                       (sourceNode?.data.category === required_connection.from && targetNode?.data.label === 'Families');
              }

              return (sourceNode?.data.category === required_connection.from && targetNode?.data.category === required_connection.to) ||
                     (sourceNode?.data.category === required_connection.to && targetNode?.data.category === required_connection.from);
            });
          }
          return true;

        case 'cost_constraint':
          // Check if total system cost is within budget
          if (target_metric === 'cost' || target_value) {
            const totalCost = nodes.reduce((sum, node) => sum + (node.data.cost || 50), 0);
            return totalCost <= (target_value || 500);
          }
          return true;

        case 'metric':
          // For now, return true for metric-based validations as they require runtime metrics
          // This could be enhanced to check actual performance metrics if available
          return true;

        default:
          // Fallback: try to evaluate the validation string as JavaScript (careful!)
          try {
            return new Function('nodes', 'edges', `return ${requirement.validation}`)(nodes, edges);
          } catch (error) {
            console.warn('Failed to evaluate requirement validation:', error);
            return false;
          }
      }
    };
  }

  // Fallback requirements for known stages whose DB rows have no requirements yet
  private static readonly STAGE_REQUIREMENT_FALLBACKS: Record<string, Requirement[]> = {
    'stage-m4-001': [
      {
        id: 'req-m4-001-database',
        description: 'Add a proper database to replace the shared spreadsheet',
        completed: false,
        validation_type: 'component_required',
        required_nodes: ['database'],
        min_nodes: 1,
      },
      {
        id: 'req-m4-001-server',
        description: 'Add a compute server to run application logic',
        completed: false,
        validation_type: 'component_required',
        required_nodes: ['compute'],
        min_nodes: 1,
      },
      {
        id: 'req-m4-001-connection',
        description: 'Connect the server to the database',
        completed: false,
        validation_type: 'connection_required',
        required_connection: { from: 'compute', to: 'database' },
      },
    ],
  };

  // Load mission stage data by stage ID
  async loadMissionStageById(stageId: string): Promise<MissionStageData | null> {
    try {
      const stageData = await api.get<any>('/missions/stage/' + stageId);

      if (!stageData) {
        return null;
      }

      // If the Worker returns requirements already transformed, use them;
      // otherwise transform them from raw DB shape.
      let transformedRequirements: Requirement[] = stageData.system_requirements?.length
        ? stageData.system_requirements.map((req: any) => ({
            ...req,
            completed: false,
            validator: this.createValidatorFunction(req),
          }))
        : this.transformMissionStageRequirements(stageData.requirements || []);

      // If the API returned nothing and we have a known fallback, use it
      if (transformedRequirements.length === 0 && MissionService.STAGE_REQUIREMENT_FALLBACKS[stageId]) {
        console.warn(`No requirements from API for stage ${stageId} — using frontend fallback`);
        transformedRequirements = MissionService.STAGE_REQUIREMENT_FALLBACKS[stageId].map(req => ({
          ...req,
          validator: this.createValidatorFunction(req),
        }));
      }

      return {
        id: stageData.id,
        title: stageData.title,
        problem_description: stageData.problem_description,
        system_requirements: transformedRequirements,
        mission: stageData.mission,
      };
    } catch (error) {
      console.error('Failed to load mission stage:', error);
      return null;
    }
  }

  private getFallbackMission(slug: string): MissionData {
    const fallbackMissions: Record<string, MissionData> = {
      'health-tracker-crisis': {
        id: 'fallback-health-crisis',
        slug: 'health-tracker-crisis',
        title: 'Community Health Tracker Overload',
        description: 'Help a parent save critical health data for 200+ families',
        crisis_description: 'Database crashes every few hours, no backups, 200+ families depending on the data',
        stages: [],
        components: this.getDefaultComponents(),
        requirements: this.generateFallbackRequirements('health-tracker-crisis')
      },
      'outbreak-documentation-site': {
        id: 'fallback-outbreak-docs',
        slug: 'outbreak-documentation-site',
        title: 'The Outbreak Documentation Site',
        description: 'Help track a mysterious illness affecting neighborhood children',
        crisis_description: 'A mysterious illness is affecting children in the neighborhood. Parents are desperately trying to document symptoms to find patterns and prove environmental contamination.',
        stages: [],
        components: this.getDefaultComponents(),
        requirements: this.generateFallbackRequirements('outbreak-documentation-site')
      }
    };

    return fallbackMissions[slug] || fallbackMissions['health-tracker-crisis'];
  }

  private transformComponents(dbComponents: any[]): ComponentRequirement[] {
    return dbComponents.map(comp => ({
      id: comp.id,
      name: comp.name,
      category: comp.category,
      icon_name: comp.icon_name,
      color: comp.color,
      short_description: comp.short_description,
      detailed_description: comp.detailed_description,
      concepts: comp.concepts,
      use_cases: comp.use_cases,
      compatible_with: comp.compatible_with,
      unlock_level: comp.unlock_level,
      required: false
    }));
  }

  private getDefaultComponents(): ComponentRequirement[] {
    return [
      {
        id: 'compute_server',
        name: 'Compute Server',
        category: 'compute',
        icon_name: 'server',
        short_description: 'Runs your application code',
        unlock_level: 1,
        required: true
      },
      {
        id: 'data_store',
        name: 'Database',
        category: 'database',
        icon_name: 'database',
        short_description: 'Stores and manages application data',
        unlock_level: 1,
        required: true
      },
      {
        id: 'file_storage',
        name: 'File Storage',
        category: 'storage',
        icon_name: 'hard-drive',
        short_description: 'Stores files and media',
        unlock_level: 1,
        required: false
      }
    ];
  }

  // Fallback requirements (only used if database fails)
  private generateFallbackRequirements(missionSlug: string): Requirement[] {
    const requirementSets: Record<string, Requirement[]> = {
      'health-tracker-crisis': [
        {
          id: 'separate_server',
          description: 'Separate web server from database',
          completed: false,
          validator: (nodes, edges) => {
            return nodes.length >= 2 &&
              nodes.some(n => n.data.category === 'compute') &&
              nodes.some(n => n.data.category === 'database');
          }
        },
        {
          id: 'connect_server_db',
          description: 'Connect web server to database',
          completed: false,
          validator: (nodes, edges) => {
            return edges.some((e) => {
              const sourceNode = nodes.find(n => n.id === e.source);
              const targetNode = nodes.find(n => n.id === e.target);
              return (sourceNode?.data.category === 'compute' && targetNode?.data.category === 'database') ||
                     (sourceNode?.data.category === 'database' && targetNode?.data.category === 'compute');
            });
          }
        },
        {
          id: 'connect_families',
          description: 'Connect families to web server',
          completed: false,
          validator: (nodes, edges) => {
            return edges.some((e) => {
              const sourceNode = nodes.find(n => n.id === e.source);
              const targetNode = nodes.find(n => n.id === e.target);
              return (sourceNode?.data.label === 'Families' && targetNode?.data.category === 'compute') ||
                     (sourceNode?.data.category === 'compute' && targetNode?.data.label === 'Families');
            });
          }
        }
      ]
    };

    return requirementSets[missionSlug] || requirementSets['health-tracker-crisis'];
  }

  getActiveMission(): MissionData | null {
    return this.activeMission;
  }

  validateRequirements(nodes: any[], edges: any[]): Requirement[] {
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
    nodes: any[],
    edges: any[],
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
   * Get the current user ID from the API
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const user = await api.get<{ id: string }>('/auth/me');
      return user?.id || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

// Start mission when user sends contact email to news article hero
export async function startMissionFromContactEmail(params: {
  userId: string;
  newsArticleId: string;
  missionId: string;
  contactEmailData: {
    to: string;
    subject: string;
    body: string;
    hero: any;
  };
}): Promise<{ success: boolean; missionStarted: boolean; firstStageEmails?: any[]; error?: string }> {
  try {
    const { newsArticleId, missionId, contactEmailData } = params;

    const result = await api.post<{
      success: boolean;
      missionStarted: boolean;
      firstStageEmails?: any[];
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
