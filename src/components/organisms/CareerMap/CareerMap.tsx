import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

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

class CareerMapScene extends Phaser.Scene {
  private scenarios: ScenarioNode[] = [];
  private onScenarioClick: (scenarioId: string) => void;
  private onComponentClick: (componentType: string) => void;
  private gameScene!: Phaser.GameObjects.RenderTexture;
  private floorSprite!: Phaser.GameObjects.Sprite;
  private selectorSprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private selectedTile: { x: number; y: number } = { x: 2, y: 2 };
  private backgroundSprite!: Phaser.GameObjects.TileSprite;
  
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
  }

  init(data: { scenarios: any[]; progress: any[]; onScenarioClick: (scenarioId: string) => void; onComponentClick?: (componentType: string) => void }) {
    this.onScenarioClick = data.onScenarioClick;
    this.onComponentClick = data.onComponentClick || (() => {});
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
    
    // Add system component decorations
    this.addSystemComponents();
    
    // Initial render
    this.renderScene();
    
    // Set up camera controls
    this.setupCameraControls();
    
    // Handle resize events
    this.scale.on('resize', this.handleResize, this);
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
      
      // Add hover effect
      component.on('pointerover', () => {
        component.setAlpha(0.8);
        component.setTint(0xffffff);
      });
      
      component.on('pointerout', () => {
        component.setAlpha(0.6);
        component.clearTint();
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


}

export const CareerMapGame: React.FC<CareerMapGameProps> = ({ scenarios, progress, onScenarioClick, onComponentClick }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

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
        onComponentClick
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
        scene.scene.restart({ scenarios, progress, onScenarioClick, onComponentClick });
      }
    }
  }, [scenarios, progress, onScenarioClick, onComponentClick]);

  return <div ref={gameRef} className="career-map__phaser-container" />;
}; 