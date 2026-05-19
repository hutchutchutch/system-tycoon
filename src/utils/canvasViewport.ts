/**
 * Computes an initial viewport (x, y, zoom) that frames a set of canvas nodes
 * nicely in the visible area.
 *
 * Design goals:
 *  - Few nodes (2–3)  → high zoom (~1.8–2.2), nodes fill the screen
 *  - Many nodes (6–10) → lower zoom (~1.0–1.4), all nodes visible
 *  - Never below 0.8 (unreadable) or above 2.5 (too close)
 *  - Accounts for the component drawer width on the left
 *  - Works with ReactFlow's nodeOrigin={[0.5, 0.5]} (positions are node centers)
 */

export interface CanvasNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
}

export interface ViewportConfig {
  x: number;
  y: number;
  zoom: number;
}

// Approximate rendered dimensions per node type (pixels at zoom=1)
const NODE_SIZE: Record<string, { w: number; h: number }> = {
  user:    { w: 170, h: 130 },
  custom:  { w: 230, h: 200 },
  default: { w: 200, h: 160 },
};

function nodeSize(type?: string) {
  return NODE_SIZE[type ?? 'default'] ?? NODE_SIZE.default;
}

export interface ViewportOptions {
  /** Width of the visible canvas area in CSS pixels (excluding left sidebar). */
  canvasWidth: number;
  /** Height of the visible canvas area in CSS pixels (excluding top HUD). */
  canvasHeight: number;
  /** Width of the left component drawer. 0 if collapsed. */
  drawerWidth?: number;
  /** Padding around the node bounding box (px at target zoom). Default 80. */
  padding?: number;
  /** Hard min zoom. Default 0.8. */
  minZoom?: number;
  /** Hard max zoom. Default 2.4. */
  maxZoom?: number;
  /** Target fill fraction of the available area (0–1). Default 0.72. */
  fillRatio?: number;
}

export function computeInitialViewport(
  nodes: CanvasNode[],
  options: ViewportOptions,
): ViewportConfig {
  const {
    canvasWidth,
    canvasHeight,
    drawerWidth = 0,
    minZoom = 0.8,
    maxZoom = 2.4,
    fillRatio = 0.72,
  } = options;

  // Available screen area (after drawer)
  const availW = canvasWidth - drawerWidth;
  const availH = canvasHeight;

  if (nodes.length === 0) {
    return {
      x: availW / 2 + drawerWidth,
      y: availH / 2,
      zoom: 1.0,
    };
  }

  // Build bounding box from node centers + their half-dimensions
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const node of nodes) {
    const { w, h } = nodeSize(node.type);
    minX = Math.min(minX, node.position.x - w / 2);
    maxX = Math.max(maxX, node.position.x + w / 2);
    minY = Math.min(minY, node.position.y - h / 2);
    maxY = Math.max(maxY, node.position.y + h / 2);
  }

  const contentW = maxX - minX;
  const contentH = maxY - minY;
  const contentCX = (minX + maxX) / 2;
  const contentCY = (minY + maxY) / 2;

  // Zoom to fill `fillRatio` of the available area
  const zoomX = (availW * fillRatio) / contentW;
  const zoomY = (availH * fillRatio) / contentH;
  const zoom = Math.min(
    Math.max(Math.min(zoomX, zoomY), minZoom),
    maxZoom,
  );

  // Center the content in the available area
  const screenCX = drawerWidth + availW / 2;
  const screenCY = availH / 2;
  const x = screenCX - contentCX * zoom;
  const y = screenCY - contentCY * zoom;

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    zoom: Math.round(zoom * 1000) / 1000,
  };
}
