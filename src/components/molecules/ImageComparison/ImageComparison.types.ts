export interface ImageComparisonProps {
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;
  
  /**
   * Initial position of the slider (0-100)
   * @default 50
   */
  initialPosition?: number;
  
  /**
   * Callback when the slider position changes
   */
  onPositionChange?: (position: number) => void;
  
  /**
   * Whether to show labels for each side
   * @default true
   */
  showLabels?: boolean;
  
  /**
   * Custom label for the left side (ProblemVille)
   * @default "ProblemVille"
   */
  leftLabel?: string;
  
  /**
   * Custom label for the right side (DataWorld)
   * @default "DataWorld"
   */
  rightLabel?: string;
  
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
}