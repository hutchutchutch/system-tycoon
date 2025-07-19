import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// React Flow configuration for mobile-friendly passive event listeners
export const getPassiveReactFlowProps = () => ({
  // Disable touch interactions that cause passive listener warnings
  zoomOnPinch: false,
  panOnDrag: true,
  panOnScroll: false,
  zoomOnScroll: true,
  zoomOnDoubleClick: false,
  preventScrolling: false,
  
  // Mobile-friendly defaults
  minZoom: 0.1,
  maxZoom: 3,
  
  // Selection and drag options
  selectionOnDrag: false,
  elementsSelectable: true,
  nodesDraggable: true,
  nodesConnectable: true,
});

// Alternative configuration for completely touch-free operation
export const getTouchFreeReactFlowProps = () => ({
  zoomOnPinch: false,
  panOnDrag: false,
  panOnScroll: false,
  zoomOnScroll: false,
  zoomOnDoubleClick: false,
  preventScrolling: false,
  nodesDraggable: false,
  nodesConnectable: false,
  elementsSelectable: false,
});