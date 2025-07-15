export interface Requirement {
  id: string;
  name: string;
  met: boolean;
}

export interface Budget {
  monthly: number;
  setup: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SystemDesign {
  components: any[];
  connections: any[];
  totalCost: number;
}

export interface SystemDesignCanvasProps {
  projectId: string;
  requirements: Requirement[];
  budget: Budget;
  onValidate: (system: SystemDesign) => ValidationResult;
}