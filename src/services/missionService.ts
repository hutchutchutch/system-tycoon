import { supabase } from './supabase';

export interface MissionData {
  id: string;
  slug: string;
  title: string;
  description: string;
  crisis_description: string;
  stages: MissionStage[];
  components: ComponentRequirement[];
  requirements: Requirement[];
}

export interface MissionStage {
  id: string;
  stage_number: number;
  title: string;
  problem_description: string;
  required_components: any;
  validation_rules: any;
}

export interface ComponentRequirement {
  id: string;
  name: string;
  category: string;
  icon_name: string;
  short_description: string;
  unlock_level: number;
  required?: boolean;
}

export interface Requirement {
  id: string;
  description: string;
  completed: boolean;
  validator?: (nodes: any[], edges: any[]) => boolean;
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
      // Load mission with stages
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .select(`
          *,
          mission_stages!inner(
            id,
            stage_number,
            title,
            problem_description,
            required_components,
            validation_rules
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

      // Transform to our interface
      const mission: MissionData = {
        id: missionData.id,
        slug: missionData.slug,
        title: missionData.title,
        description: missionData.description,
        crisis_description: missionData.crisis_description,
        stages: missionData.mission_stages || [],
        components: this.transformComponents(componentsData || []),
        requirements: this.generateRequirements(missionData.slug)
      };

      this.activeMission = mission;
      return mission;
    } catch (error) {
      console.error('Failed to load mission:', error);
      return this.getFallbackMission(slug);
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
        requirements: this.generateRequirements('health-tracker-crisis')
      },
      'outbreak-documentation-site': {
        id: 'fallback-outbreak-docs',
        slug: 'outbreak-documentation-site',
        title: 'The Outbreak Documentation Site',
        description: 'Help track a mysterious illness affecting neighborhood children',
        crisis_description: 'A mysterious illness is affecting children in the neighborhood. Parents are desperately trying to document symptoms to find patterns and prove environmental contamination.',
        stages: [],
        components: this.getDefaultComponents(),
        requirements: this.generateRequirements('outbreak-documentation-site')
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
      short_description: comp.short_description,
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

  private generateRequirements(missionSlug: string): Requirement[] {
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

  async getMissionFromEmail(emailId: string): Promise<MissionData | null> {
    try {
      const { data: emailData, error } = await supabase
        .from('mission_emails')
        .select(`
          mission_id,
          missions!inner(slug)
        `)
        .eq('id', emailId)
        .single();

      if (error || !emailData) {
        console.warn('Email not found or not linked to mission');
        return null;
      }

      return this.loadMissionBySlug((emailData.missions as any).slug);
    } catch (error) {
      console.error('Failed to get mission from email:', error);
      return null;
    }
  }
}

export const missionService = MissionService.getInstance(); 