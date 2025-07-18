import { useState, useCallback } from 'react';
import { missionService } from '../services/missionService';
import type { ValidationResponse, ValidationResult } from '../services/missionService';

export interface UseRequirementValidationProps {
  stageId: string;
  onValidationComplete?: (result: ValidationResponse) => void;
}

export interface UseRequirementValidationReturn {
  isValidating: boolean;
  validationError: string | null;
  lastValidationResult: ValidationResponse | null;
  validateRequirements: (nodes: any[], edges: any[]) => Promise<ValidationResponse | null>;
  clearError: () => void;
}

export const useRequirementValidation = ({
  stageId,
  onValidationComplete
}: UseRequirementValidationProps): UseRequirementValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastValidationResult, setLastValidationResult] = useState<ValidationResponse | null>(null);

  const validateRequirements = useCallback(async (
    nodes: any[], 
    edges: any[]
  ): Promise<ValidationResponse | null> => {
    try {
      setIsValidating(true);
      setValidationError(null);

      // Get current user
      const userId = await missionService.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Call the validation service
      const result = await missionService.validateRequirementsWithAPI(
        stageId,
        userId,
        nodes,
        edges
      );

      setLastValidationResult(result);

      // Call the completion callback if provided
      if (onValidationComplete) {
        onValidationComplete(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      setValidationError(errorMessage);
      console.error('Validation failed:', error);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [stageId, onValidationComplete]);

  const clearError = useCallback(() => {
    setValidationError(null);
  }, []);

  return {
    isValidating,
    validationError,
    lastValidationResult,
    validateRequirements,
    clearError
  };
}; 