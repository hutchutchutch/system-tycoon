export interface Question {
  id: string;
  text: string;
  speaker: {
    id: string;
    name: string;
    role: string;
  };
  category: 'product' | 'business' | 'marketing' | 'technical';
  impact: RequirementImpact[];
  response: string;
}

export interface RequirementImpact {
  type: 'add_requirement' | 'modify_budget' | 'add_constraint' | 'remove_requirement';
  description: string;
  icon: string;
  value?: number;
  requirement?: any;
  requirementId?: string;
  key?: string;
}

export interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (questionId: string) => void;
  className?: string;
}