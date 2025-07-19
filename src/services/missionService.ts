import { supabase } from './supabase';

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
      // Load mission with stages and their requirements
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select(`
          *,
          mission_stages!inner(
            id,
            stage_number,
            title,
            problem_description,
            system_requirements
          )
        `)
        .eq('slug', slug)
        .single();

      if (missionError) {
        console.warn(`Mission '${slug}' not found:`, missionError);
        return this.getFallbackMission(slug);
      }

      // Load available components
      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .order('sort_order');

      if (componentsError) {
        console.warn('Failed to load components:', componentsError);
      }

      // Use requirements from the first stage (or combine all stages)
      const firstStage = missionData.mission_stages[0];
      const requirements = this.transformDatabaseRequirements(firstStage?.system_requirements || []);

      // Transform to our interface
      const mission: MissionData = {
        id: missionData.id,
        slug: missionData.slug,
        title: missionData.title,
        description: missionData.description,
        crisis_description: missionData.crisis_description,
        stages: missionData.mission_stages || [],
        components: this.transformComponents(componentsData || []),
        requirements: requirements
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

  // Load mission stage data by stage ID
  async loadMissionStageById(stageId: string): Promise<MissionStageData | null> {
    try {
      const { data: stageData, error: stageError } = await supabase
        .from('mission_stages')
        .select(`
          id,
          title,
          problem_description,
          system_requirements,
          missions!inner(
            id,
            title,
            description,
            crisis_description
          )
        `)
        .eq('id', stageId)
        .single();

      if (stageError) {
        console.warn(`Mission stage '${stageId}' not found:`, stageError);
        return null;
      }

      return {
        id: stageData.id,
        title: stageData.title,
        problem_description: stageData.problem_description,
        system_requirements: this.transformDatabaseRequirements(stageData.system_requirements || []),
        mission: Array.isArray(stageData.missions) ? stageData.missions[0] : stageData.missions
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
   * Validate requirements using the Supabase Edge Function
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
      const { data, error } = await supabase.functions.invoke('validate-requirements', {
        body: {
          stageId,
          userId,
          nodes,
          edges,
          stageAttemptId
        }
      });

      if (error) {
        console.error('Validation API error:', error);
        throw new Error(`Validation failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error('Validation was not successful');
      }

      return data as ValidationResponse;
    } catch (error) {
      console.error('Error validating requirements:', error);
      throw error;
    }
  }

  /**
   * Get the current user ID from Supabase auth
   */
  async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }
}

export const missionService = MissionService.getInstance(); 