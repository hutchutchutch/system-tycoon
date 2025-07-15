import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MentorCard, type Mentor } from '../../molecules/MentorCard';
import { supabase } from '../../../services/supabase';

interface CareerMapGameProps {
  scenarios: any[];
  progress: any[];
  onScenarioClick: (scenarioId: string) => void;
  onComponentClick?: (componentType: string) => void;
}

interface ScenarioNode {
  id: string;
  title: string;
  level: number;
  x: number;
  y: number;
  isLocked: boolean;
  isCompleted: boolean;
  clientName: string;
  bestScore?: number;
}

interface HoverTooltip {
  visible: boolean;
  x: number;
  y: number;
  content: string;
  componentType: string;
}

interface SceneState {
  mode: 'career-map' | 'mentor-selection';
  selectedComponent?: string;
  scenarioId?: string;
}

// Specialized Mentor Selection Overlay Component
const MentorSelectionOverlay: React.FC<{
  componentType: string;
  onMentorSelected: (mentor: Mentor) => void;
  onBack: () => void;
}> = ({ componentType, onMentorSelected, onBack }) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('mentors')
        .select('*')
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setMentors(data || []);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmSelection = () => {
    if (selectedMentor) {
      onMentorSelected(selectedMentor);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to Load Mentors</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchMentors}
            className="btn btn--primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-selection text-white overflow-auto h-full">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mentor-selection__header">
          <h1 className="mentor-selection__title">
            Choose Your Mentor
          </h1>
          <p className="mentor-selection__subtitle">
            Select an expert to guide you through this {componentType.replace('_', ' ')} challenge
          </p>
          <p className="mentor-selection__description">
            Each mentor brings unique expertise and perspective to help you succeed
          </p>
        </div>

        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
            <p className="text-gray-400">
              Mentors are currently being prepared for your journey.
            </p>
          </div>
        ) : (
          <>
            <div className="mentor-selection__grid">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  selected={selectedMentor?.id === mentor.id}
                  onSelect={handleMentorSelect}
                />
              ))}
            </div>

            {selectedMentor && (
              <div className="mentor-selection__confirmation">
                <div className="mentor-selection__confirmation-content">
                  <div className="mentor-selection__confirmation-info">
                    <div className="mentor-selection__confirmation-avatar">
                      {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="mentor-selection__confirmation-details">
                      <h4>{selectedMentor.name}</h4>
                      <p>{selectedMentor.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmSelection}
                    className="btn btn--primary px-6 py-2"
                  >
                    Continue with {selectedMentor.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

class CareerMapScene extends Phaser.Scene {
  private scenarios: ScenarioNode[] = [];
  private onScenarioClick: (scenarioId: string) => void;
  private onComponentClick: (componentType: string) => void;
  private onShowMentorSelection: (componentType: string) => void;
  private gameScene!: Phaser.GameObjects.RenderTexture;
  private floorSprite!: Phaser.GameObjects.Sprite;
  private selectorSprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private selectedTile: { x: number; y: number } = { x: 2, y: 2 };
  private backgroundSprite!: Phaser.GameObjects.TileSprite;
  private tooltipContainer!: Phaser.GameObjects.Container;
  private tooltipBackground!: Phaser.GameObjects.Rectangle;
  private tooltipText!: Phaser.GameObjects.Text;
  private tooltipButton!: Phaser.GameObjects.Container;
  private currentHoveredComponent: string | null = null;
  private tooltipHideTimeout: number | null = null;
  
  // Isometric grid settings
  private readonly GRID_WIDTH = 8;
  private readonly GRID_HEIGHT = 6;
  private readonly TILE_WIDTH = 60;
  private readonly BORDER_OFFSET = { x: 300, y: 100 };
  private readonly FLOOR_GRAPHIC_WIDTH = 103;
  private readonly FLOOR_GRAPHIC_HEIGHT = 53;
  
  // Level data - 0 = floor, 1 = wall, 2 = selector position
  private levelData: number[][] = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,2,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ];

  constructor() {
    super({ key: 'CareerMapScene' });
    this.onScenarioClick = () => {};
    this.onComponentClick = () => {};
    this.onShowMentorSelection = () => {};
  }

  init(data: { 
    scenarios: any[]; 
    progress: any[]; 
    onScenarioClick: (scenarioId: string) => void; 
    onComponentClick?: (componentType: string) => void;
    onShowMentorSelection?: (componentType: string) => void;
  }) {
    this.onScenarioClick = data.onScenarioClick;
    this.onComponentClick = data.onComponentClick || (() => {});
    this.onShowMentorSelection = data.onShowMentorSelection || (() => {});
    this.scenarios = this.processScenarios(data.scenarios, data.progress);
  }

  private processScenarios(scenarios: any[], progress: any[]): ScenarioNode[] {
    return scenarios.map((scenario, index) => {
      const scenarioProgress = progress.find(p => p.scenarioId === scenario.id);
      const isLocked = scenario.level > 1 && !scenarioProgress;
      const isCompleted = scenarioProgress?.status === 'completed';
      
      // Create a path-like layout
      const pathWidth = 800;
      const pathHeight = 600;
      const nodesPerRow = 3;
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;
      
      // Add some organic spacing and offsets
      const baseX = 150 + (col * (pathWidth / nodesPerRow));
      const baseY = 100 + (row * 120);
      
      // Add some randomness for a more natural path
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 40;
      
      return {
        id: scenario.id,
        title: scenario.title,
        level: scenario.level,
        clientName: scenario.clientName,
        x: baseX + offsetX,
        y: baseY + offsetY,
        isLocked,
        isCompleted,
        bestScore: scenarioProgress?.bestScore
      };
    });
  }

  preload() {
    // Load background image
    this.load.image('day_background', 'src/assets/day_background.png');
    
    // Load system component images with proper asset paths
    this.load.image('api', 'src/assets/api.png');
    this.load.image('cache', 'src/assets/cache.png');
    this.load.image('compute', 'src/assets/compute.png');
    this.load.image('database', 'src/assets/database.png');
    this.load.image('load_balancer', 'src/assets/load_balancer.png');
    
    // Create simple colored rectangles for nodes
    this.load.image('node-available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-locked', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Add tiled background that covers the entire world - ensure minimum panning space
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    
    // Create tile sprite that covers the entire world, positioned at origin
    this.backgroundSprite = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'day_background');
    this.backgroundSprite.setOrigin(0, 0);
    this.backgroundSprite.setDepth(-10);
    
    // Set camera bounds based on world size - ensure there's room to pan
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Create render texture for depth sorting - use viewport dimensions
    this.gameScene = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.add.existing(this.gameScene);
    
    // Create sprite objects for rendering
    this.floorSprite = this.make.sprite({ x: 0, y: 0, key: 'database' });
    this.floorSprite.setScale(0.4);
    this.floorSprite.setTint(0x666666);
    
    this.selectorSprite = this.make.sprite({ x: 0, y: 0, key: 'database' });
    this.selectorSprite.setScale(0.5);
    this.selectorSprite.setTint(0x00ff00);
    
    // Set up keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Initialize selector position from level data
    this.findSelectorPosition();
    
    // Create tooltip system
    this.createTooltipSystem();
    
    // Add system component decorations
    this.addSystemComponents();
    
    // Initial render
    this.renderScene();
    
    // Set up camera controls
    this.setupCameraControls();
    
    // Handle resize events
    this.scale.on('resize', this.handleResize, this);
  }

  private createTooltipSystem() {
    // Create tooltip container
    this.tooltipContainer = this.add.container(0, 0);
    this.tooltipContainer.setDepth(1000); // Ensure it's on top
    this.tooltipContainer.setVisible(false);

    // Create tooltip background
    this.tooltipBackground = this.add.rectangle(0, 0, 300, 120, 0x1a1a1a, 0.95);
    this.tooltipBackground.setStrokeStyle(2, 0x333333);
    this.tooltipContainer.add(this.tooltipBackground);

    // Create tooltip text
    this.tooltipText = this.add.text(0, -20, '', {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 280 }
    });
    this.tooltipText.setOrigin(0.5);
    this.tooltipContainer.add(this.tooltipText);

    // Create button container with interactive background
    this.tooltipButton = this.add.container(0, 30);
    this.tooltipContainer.add(this.tooltipButton);
    
    const buttonBg = this.add.rectangle(0, 0, 140, 30, 0x4f46e5);
    const buttonText = this.add.text(0, 0, 'Select Mentor', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);
    
    this.tooltipButton.add([buttonBg, buttonText]);
    
    // Make button interactive
    buttonBg.setInteractive();
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x6366f1);
      // Clear any pending hide timeout when hovering over button
      this.clearTooltipHideTimeout();
    });
    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x4f46e5);
      // Schedule tooltip to hide when leaving button
      this.scheduleTooltipHide(300);
    });
    buttonBg.on('pointerdown', () => {
      if (this.currentHoveredComponent) {
        this.onShowMentorSelection(this.currentHoveredComponent);
      }
    });

    // Make the tooltip container interactive to prevent hiding when hovering over it
    this.tooltipBackground.setInteractive();
    this.tooltipBackground.on('pointerover', () => {
      this.clearTooltipHideTimeout();
    });
    this.tooltipBackground.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      // Schedule hide with a longer delay to allow moving to button
      this.scheduleTooltipHide(300);
    });
  }

  private showTooltip(x: number, y: number, componentType: string) {
    this.clearTooltipHideTimeout();
    this.currentHoveredComponent = componentType;
    
    // Update tooltip content
    const content = this.getTooltipContent(componentType);
    this.tooltipText.setText(content);
    
    // Position tooltip near the component but within screen bounds
    const tooltipX = Math.min(Math.max(x, 150), this.cameras.main.width - 150);
    const tooltipY = Math.max(y - 80, 80);
    
    this.tooltipContainer.setPosition(tooltipX, tooltipY);
    this.tooltipContainer.setVisible(true);
    
    // Add subtle fade-in animation
    this.tooltipContainer.setAlpha(0);
    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });
  }

  private hideTooltip() {
    this.clearTooltipHideTimeout();
    this.tooltipContainer.setVisible(false);
    this.currentHoveredComponent = null;
  }

  private getTooltipContent(componentType: string): string {
    const tooltips = {
      api: 'API Gateway\nManage API endpoints and routing',
      cache: 'Caching Layer\nImprove performance with data caching',
      compute: 'Compute Service\nHandle application processing',
      database: 'Database System\nStore and manage your data',
      load_balancer: 'Load Balancer\nDistribute traffic across servers'
    };
    return tooltips[componentType as keyof typeof tooltips] || 'System Component\nExplore this component';
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    // Update render texture size
    this.gameScene.setSize(gameSize.width, gameSize.height);
    
    // Update background tile sprite to ensure it covers the entire world - maintain panning space
    const worldWidth = Math.max(2000, gameSize.width * 3);
    const worldHeight = Math.max(1500, gameSize.height * 3);
    if (this.backgroundSprite) {
      this.backgroundSprite.setSize(worldWidth, worldHeight);
      this.backgroundSprite.setPosition(0, 0);
      this.backgroundSprite.setOrigin(0, 0);
    }
    
    // Update camera bounds to maintain panning space
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Re-render scene with new dimensions
    this.renderScene();
  }

  private findSelectorPosition() {
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        if (this.levelData[i][j] === 2) {
          this.selectedTile = { x: j, y: i };
          return;
        }
      }
    }
  }

  private renderScene() {
    this.gameScene.clear();
    
    // Draw all tiles in depth order
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        this.drawTileIso(i, j);
        
        // Draw selector if at this position
        if (i === this.selectedTile.y && j === this.selectedTile.x) {
          this.drawSelectorIso();
        }
      }
    }
  }

  private drawTileIso(i: number, j: number) {
    const cartPt = { x: j * this.TILE_WIDTH, y: i * this.TILE_WIDTH };
    const isoPt = this.cartesianToIsometric(cartPt);
    
    this.gameScene.draw(
      this.floorSprite,
      isoPt.x + this.BORDER_OFFSET.x,
      isoPt.y + this.BORDER_OFFSET.y
    );
  }

  private drawSelectorIso() {
    const cartPt = { 
      x: this.selectedTile.x * this.TILE_WIDTH, 
      y: this.selectedTile.y * this.TILE_WIDTH 
    };
    const isoPt = this.cartesianToIsometric(cartPt);
    
    this.gameScene.draw(
      this.selectorSprite,
      isoPt.x + this.BORDER_OFFSET.x,
      isoPt.y + this.BORDER_OFFSET.y - 10 // Slightly elevated
    );
  }

  private cartesianToIsometric(cartPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: cartPt.x - cartPt.y,
      y: (cartPt.x + cartPt.y) / 2
    };
  }

  private isometricToCartesian(isoPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (2 * isoPt.y + isoPt.x) / 2,
      y: (2 * isoPt.y - isoPt.x) / 2
    };
  }

  private getTileCoordinates(cartPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: Math.floor(cartPt.x / this.TILE_WIDTH),
      y: Math.floor(cartPt.y / this.TILE_WIDTH)
    };
  }

  update() {
    // Handle keyboard input for tile selection
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left!) && this.selectedTile.x > 0) {
      this.selectedTile.x--;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!) && this.selectedTile.x < this.GRID_WIDTH - 1) {
      this.selectedTile.x++;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) && this.selectedTile.y > 0) {
      this.selectedTile.y--;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) && this.selectedTile.y < this.GRID_HEIGHT - 1) {
      this.selectedTile.y++;
      this.updateLevel();
    }
  }

  private updateLevel() {
    // Update level data to reflect new selector position
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        if (this.levelData[i][j] === 2) {
          this.levelData[i][j] = 0; // Clear old position
        }
      }
    }
    this.levelData[this.selectedTile.y][this.selectedTile.x] = 2; // Set new position
    
    // Re-render the scene
    this.renderScene();
  }

  private addSystemComponents() {
    const components = ['api', 'cache', 'compute', 'database', 'load_balancer'];
    const componentPositions = [
      { x: 50, y: 50 },
      { x: 900, y: 100 },
      { x: 200, y: 400 },
      { x: 750, y: 350 },
      { x: 400, y: 500 },
      { x: 100, y: 300 },
      { x: 850, y: 450 },
      { x: 300, y: 150 },
    ];

    componentPositions.forEach((pos, index) => {
      const componentKey = components[index % components.length];
      const component = this.add.image(pos.x, pos.y, componentKey);
      component.setScale(0.3);
      component.setAlpha(0.4);
      component.setDepth(-1); // Place behind other elements
      
      // Make all components clickable
      component.setInteractive();
      component.setAlpha(0.6); // Make it slightly more visible
      
      let componentClickStart = { x: 0, y: 0, time: 0 };
      let hoverTimeout: number | null = null;
      
      component.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        componentClickStart = { x: pointer.x, y: pointer.y, time: Date.now() };
      });
      
      component.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        const dragDistance = Phaser.Math.Distance.Between(componentClickStart.x, componentClickStart.y, pointer.x, pointer.y);
        const clickTime = Date.now() - componentClickStart.time;
        
        // Only trigger click if it's not a drag (small movement and quick)
        if (dragDistance < 5 && clickTime < 500) {
          console.log(`🖱️ Component clicked: ${componentKey.toUpperCase()}`);
          console.log(`📊 Click details:`, {
            component: componentKey,
            position: { x: pos.x, y: pos.y },
            dragDistance,
            clickTime,
            timestamp: new Date().toISOString()
          });
          this.onComponentClick(componentKey);
        }
      });
      
      // Add hover effect with tooltip
      component.on('pointerover', (pointer: Phaser.Input.Pointer) => {
        component.setAlpha(0.8);
        component.setTint(0xffffff);
        
        // Clear any pending hide timeout
        this.clearTooltipHideTimeout();
        
        // Show tooltip after a brief delay
        hoverTimeout = window.setTimeout(() => {
          this.showTooltip(pos.x, pos.y, componentKey);
        }, 500);
      });
      
      component.on('pointerout', () => {
        component.setAlpha(0.6);
        component.clearTint();
        
        // Clear hover timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Schedule tooltip to hide with delay (allows moving to tooltip)
        this.scheduleTooltipHide(200);
      });
      
      // Add subtle floating animation
      this.tweens.add({
        targets: component,
        y: pos.y + 10,
        duration: 3000 + Math.random() * 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1000
      });
    });
  }

  private setupCameraControls() {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let clickStartTime = 0;
    
    // Enable camera dragging with proper drag detection
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = false;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
      clickStartTime = Date.now();
    });
    
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        const dragDistance = Phaser.Math.Distance.Between(dragStartX, dragStartY, pointer.x, pointer.y);
        const dragTime = Date.now() - clickStartTime;
        
        // Consider it a drag if moved more than 5 pixels or held for more than 100ms
        if (dragDistance > 5 || dragTime > 100) {
          isDragging = true;
        }
        
        if (isDragging) {
          this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
          this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
        }
      }
    });
    
    this.input.on('pointerup', () => {
      isDragging = false;
    });

    // Enable zoom with mouse wheel
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
    });
  }

  private clearTooltipHideTimeout() {
    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
      this.tooltipHideTimeout = null;
    }
  }

  private scheduleTooltipHide(delay: number = 300) {
    this.clearTooltipHideTimeout();
    this.tooltipHideTimeout = window.setTimeout(() => {
      this.hideTooltip();
    }, delay);
  }
}

export const CareerMapGame: React.FC<CareerMapGameProps> = ({ scenarios, progress, onScenarioClick, onComponentClick }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [sceneState, setSceneState] = useState<SceneState>({ mode: 'career-map' });

  const handleShowMentorSelection = (componentType: string) => {
    setSceneState({ 
      mode: 'mentor-selection', 
      selectedComponent: componentType,
      scenarioId: 'demo-scenario' // You can make this dynamic based on your needs
    });
  };

  const handleMentorSelectionBack = () => {
    setSceneState({ mode: 'career-map' });
  };

  const handleMentorSelected = (mentor: Mentor) => {
    console.log(`✅ Mentor selected: ${mentor.name} for ${sceneState.selectedComponent}`);
    
    // Store selected mentor in localStorage or state management
    localStorage.setItem('selectedMentor', JSON.stringify(mentor));
    localStorage.setItem('mentorContext', JSON.stringify({
      componentType: sceneState.selectedComponent,
      scenarioId: sceneState.scenarioId,
      timestamp: Date.now()
    }));
    
    // You could trigger additional logic here, like:
    // - Show a success toast
    // - Navigate to a design screen
    // - Update game state
    
    // For now, return to the career map
    setSceneState({ mode: 'career-map' });
  };

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameRef.current,
        backgroundColor: '#1a1a1a',
        scene: CareerMapScene,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      phaserGameRef.current = new Phaser.Game(config);
      
      // Pass data to the scene
      phaserGameRef.current.scene.start('CareerMapScene', { 
        scenarios, 
        progress, 
        onScenarioClick,
        onComponentClick,
        onShowMentorSelection: handleShowMentorSelection
      });

      // Handle window resize
      const handleResize = () => {
        if (phaserGameRef.current) {
          phaserGameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [scenarios, progress, onScenarioClick, onComponentClick]);

  // Update scene data when props change
  useEffect(() => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('CareerMapScene') as CareerMapScene;
      if (scene) {
        scene.scene.restart({ 
          scenarios, 
          progress, 
          onScenarioClick, 
          onComponentClick,
          onShowMentorSelection: handleShowMentorSelection
        });
      }
    }
  }, [scenarios, progress, onScenarioClick, onComponentClick]);

  return (
    <div className="career-map__phaser-container relative">
      <div ref={gameRef} className="w-full h-full" />
      
      {/* Mentor Selection Overlay */}
      {sceneState.mode === 'mentor-selection' && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative w-full h-full">
            {/* Back Button */}
            <button
              onClick={handleMentorSelectionBack}
              className="absolute top-4 left-4 z-60 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Map
            </button>
            
            {/* Component Context Banner */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-sm opacity-90">Selecting mentor for</div>
                  <div className="text-lg font-semibold capitalize">
                    {sceneState.selectedComponent?.replace('_', ' ')} Component
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mentor Selection Screen */}
            <div className="pt-20 h-full">
              <MentorSelectionOverlay 
                componentType={sceneState.selectedComponent || ''} 
                onMentorSelected={handleMentorSelected}
                onBack={handleMentorSelectionBack}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 