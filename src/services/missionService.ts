import { supabase } from './supabase';
import { deliverMissionEmails } from './emailService';

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
  initial_system_state?: any; // Add initial_system_state to the interface
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

  // Load mission stage data by stage ID
  async loadMissionStageById(stageId: string): Promise<MissionStageData | null> {
    try {
      // Load stage basic data
      const { data: stageData, error: stageError } = await supabase
        .from('mission_stages')
        .select(`
          id,
          title,
          problem_description,
          initial_system_state,
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

      // Load requirements from mission_stage_requirements table
      const { data: requirementsData, error: requirementsError } = await supabase
        .from('mission_stage_requirements')
        .select('*')
        .eq('stage_id', stageId)
        .order('unlock_order');

      if (requirementsError) {
        console.warn(`Failed to load requirements for stage '${stageId}':`, requirementsError);
      }

      // Transform mission_stage_requirements data to match Requirement interface
      const transformedRequirements = this.transformMissionStageRequirements(requirementsData || []);

      return {
        id: stageData.id,
        title: stageData.title,
        problem_description: stageData.problem_description,
        system_requirements: transformedRequirements,
        initial_system_state: stageData.initial_system_state,
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
    const { userId, newsArticleId, missionId, contactEmailData } = params;

    // Check if user has already started this mission
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_mission_progress')
      .select('id, status')
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .single();

    if (progressError && progressError.code !== 'PGRST116') { // Not found is OK
      console.error('Error checking mission progress:', progressError);
      return { success: false, missionStarted: false, error: progressError.message };
    }

    let missionStarted = false;
    let firstStageId: string | null = null;

    // If no existing progress or mission is not started yet, start the mission
    if (!existingProgress || existingProgress.status === 'locked' || existingProgress.status === 'available') {
      // Get the first stage of this mission
      const { data: firstStage, error: stageError } = await supabase
        .from('mission_stages')
        .select('id, stage_number')
        .eq('mission_id', missionId)
        .eq('stage_number', 1)
        .single();

      if (stageError) {
        console.error('Error fetching first stage:', stageError);
        return { success: false, missionStarted: false, error: stageError.message };
      }

      firstStageId = firstStage.id;

      // Create or update mission progress
      const { error: upsertError } = await supabase
        .from('user_mission_progress')
        .upsert({
          user_id: userId,
          mission_id: missionId,
          status: 'in_progress',
          current_stage_id: firstStage.id,
          stage_id: firstStage.id,
          started_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error('Error starting mission:', upsertError);
        return { success: false, missionStarted: false, error: upsertError.message };
      }

      missionStarted = true;

      // Deliver mission start emails to user's inbox
      if (firstStageId) {
        console.log('Attempting to deliver mission emails:', { missionId, firstStageId });
        const deliveryResult = await deliverMissionEmails(missionId, firstStageId);
        if (!deliveryResult.success) {
          console.error('Failed to deliver mission emails:', deliveryResult.error);
          // Don't fail the whole operation, mission was started successfully
        } else {
          console.log(`Delivered ${deliveryResult.emailsDelivered} mission start emails to user inbox`);
        }
      } else {
        console.warn('No firstStageId found - cannot deliver mission emails');
      }
    }

    // Get first stage mission emails (trigger_type = 'mission_start') for response
    const { data: firstStageEmails, error: emailsError } = await supabase
      .from('mission_emails')
      .select(`
        id,
        subject,
        preview,
        body,
        sender_name,
        sender_email,
        sender_avatar,
        priority,
        trigger_type,
        created_at
      `)
      .eq('mission_id', missionId)
      .eq('trigger_type', 'mission_start')
      .order('created_at');

    if (emailsError) {
      console.error('Error fetching mission emails:', emailsError);
      return { success: false, missionStarted, error: emailsError.message };
    }

    return { 
      success: true, 
      missionStarted, 
      firstStageEmails: firstStageEmails || [] 
    };
  } catch (error) {
    console.error('Error starting mission from contact email:', error);
    return { 
      success: false, 
      missionStarted: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export const missionService = MissionService.getInstance(); 