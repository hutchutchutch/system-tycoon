import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for concatenating class names
 * Currently using clsx directly, but can be extended with tailwind-merge if needed
 * 
 * @example
 * cn('base-class', conditional && 'conditional-class', 'another-class')
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}