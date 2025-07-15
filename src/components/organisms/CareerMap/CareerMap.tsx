import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { MentorCard, type Mentor } from '../../molecules/MentorCard';
import { supabase } from '../../../services/supabase';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { updateCareerMapViewport, updateCareerMapData, selectCareerMapData } from '../../../features/game/gameSlice';
import { MentorSelectionScene } from './MentorSelectionScene';

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



class CareerMapScene extends Phaser.Scene {
  private scenarios: ScenarioNode[] = [];
  private onScenarioClick: (scenarioId: string) => void;
  private onComponentClick: (componentType: string) => void;
  private onShowMentorSelection: (componentType: string) => void;
  private dispatch: any; // Redux dispatch function
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
    onScenarioClick: (scenarioId: string) => void; 
    onComponentClick?: (componentType: string) => void;
    onShowMentorSelection?: (componentType: string) => void;
    dispatch?: any;
  }) {
    this.onScenarioClick = data.onScenarioClick;
    this.onComponentClick = data.onComponentClick || (() => {});
    this.onShowMentorSelection = data.onShowMentorSelection || (() => {});
    this.dispatch = data.dispatch || (() => {});
    // Scenarios will be loaded via updateScenariosData from Redux
    this.scenarios = [];
  }

  // Method for selective updates without scene restart
  updateScenariosData(scenarios: any[], progress: any[]) {
    // Update internal scenarios data
    this.scenarios = this.processScenarios(scenarios, progress);
    
    // Clear existing scenario nodes (find them by a data property)
    this.children.list.forEach(child => {
      if (child.getData && child.getData('type') === 'scenario-node') {
        child.destroy();
      }
    });
    
    // Re-add scenario nodes with updated data
    this.addScenarioNodes();
    console.log('🔄 Scenarios updated:', this.scenarios.length, 'scenarios now displayed');
  }

  private processScenarios(scenarios: any[], progress: any[]): ScenarioNode[] {
    // Calculate world center for positioning scenarios
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;
    
    // If no scenarios provided, create test scenarios
    if (!scenarios || scenarios.length === 0) {
      console.log('⚠️ No scenarios provided, creating test scenarios');
      const testScenarios = [
        { id: 'test-1', title: 'Test Scenario 1', level: 1, clientName: 'Test Client A' },
        { id: 'test-2', title: 'Test Scenario 2', level: 2, clientName: 'Test Client B' },
        { id: 'test-3', title: 'Test Scenario 3', level: 3, clientName: 'Test Client C' },
      ];
      scenarios = testScenarios;
    }
    
    return scenarios.map((scenario, index) => {
      const scenarioProgress = progress.find(p => p.scenarioId === scenario.id);
      const isLocked = scenario.level > 1 && !scenarioProgress;
      const isCompleted = scenarioProgress?.status === 'completed';
      
      // Create a path-like layout centered in the world
      const pathWidth = 600;
      const pathHeight = 400;
      const nodesPerRow = 3;
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;
      
      // Position relative to center, creating a path layout
      const baseX = centerX - pathWidth/2 + (col * (pathWidth / nodesPerRow));
      const baseY = centerY - pathHeight/2 + (row * 120);
      
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
    console.log('🎮 CareerMapScene: Starting preload...');
    
    // Add error handlers for asset loading
    this.load.on('loaderror', (file: any) => {
      console.error('❌ Failed to load asset:', file.src || file.key);
    });
    
    this.load.on('complete', () => {
      console.log('✅ All assets loaded successfully');
    });
    
    // Load background image
    this.load.image('day_background', '/day_background.png');
    
    // Load system component images with proper asset paths
    this.load.image('api', '/api.png');
    this.load.image('cache', '/cache.png');
    this.load.image('compute', '/compute.png');
    this.load.image('database', '/database.png');
    this.load.image('load_balancer', '/load_balancer.png');
    
    // Load nature assets
    this.load.image('tree_pine', '/tree_pine.png');
    this.load.image('tree_round', '/tree_round.png');
    this.load.image('rocks', '/rocks.png');
    this.load.image('boulder', '/boulder.png');
    
    // Create simple colored rectangles for nodes
    this.load.image('node-available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-locked', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    console.log('🎮 CareerMapScene: Starting create...');
    
    // Add tiled background that covers the entire world - ensure minimum panning space
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    
    console.log('🌍 World dimensions:', { worldWidth, worldHeight });
    console.log('📷 Camera dimensions:', { width: this.cameras.main.width, height: this.cameras.main.height });
    
    // Create tile sprite that covers the entire world, positioned at origin
    try {
      this.backgroundSprite = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'day_background');
      this.backgroundSprite.setOrigin(0, 0);
      this.backgroundSprite.setDepth(-10);
      console.log('✅ Background sprite created successfully');
    } catch (error) {
      console.error('❌ Failed to create background sprite:', error);
      // Fallback: create a colored rectangle background
      const fallbackBg = this.add.rectangle(worldWidth/2, worldHeight/2, worldWidth, worldHeight, 0x2a4d3a);
      fallbackBg.setDepth(-10);
      console.log('🔄 Created fallback green background');
    }
    
    // Set camera bounds based on world size - ensure there's room to pan
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Center camera initially so user can pan in all directions
    const centerX = (worldWidth - this.cameras.main.width) / 2;
    const centerY = (worldHeight - this.cameras.main.height) / 2;
    this.cameras.main.scrollX = centerX;
    this.cameras.main.scrollY = centerY;
    
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
    
    // Add scenario nodes
    console.log('📊 Scenarios data:', this.scenarios.length, 'scenarios loaded');
    this.addScenarioNodes();
    
    // Initial render
    this.renderScene();
    
    console.log('✨ CareerMapScene create() completed');
    
    // Set up camera controls
    this.setupCameraControls();
    
    // Initialize Redux state with current camera position
    this.updateCameraViewportState();
    
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

  private showTooltip(worldX: number, worldY: number, componentType: string) {
    this.clearTooltipHideTimeout();
    this.currentHoveredComponent = componentType;
    
    // Update tooltip content
    const content = this.getTooltipContent(componentType);
    this.tooltipText.setText(content);
    
    // Convert world coordinates to screen coordinates
    const camera = this.cameras.main;
    const screenX = worldX - camera.scrollX;
    const screenY = worldY - camera.scrollY;
    
    // Get current viewport dimensions
    const viewportWidth = camera.width;
    const viewportHeight = camera.height;
    const viewportCenterX = viewportWidth / 2;
    
    // Determine if asset is on left or right side of current view
    const isOnLeftSide = screenX < viewportCenterX;
    
    // Calculate tooltip position based on side
    const tooltipWidth = 300;
    const tooltipHeight = 120;
    const padding = 20;
    
    let tooltipX: number;
    let tooltipY: number;
    
    if (isOnLeftSide) {
      // Asset on left side - place tooltip to the right
      tooltipX = screenX + 50; // 50px to the right of asset
      // Ensure tooltip doesn't go off right edge
      if (tooltipX + tooltipWidth > viewportWidth - padding) {
        tooltipX = viewportWidth - tooltipWidth - padding;
      }
    } else {
      // Asset on right side - place tooltip to the left  
      tooltipX = screenX - tooltipWidth - 50; // 50px to the left of asset
      // Ensure tooltip doesn't go off left edge
      if (tooltipX < padding) {
        tooltipX = padding;
      }
    }
    
    // Vertical positioning - prefer above asset, but adjust if off-screen
    tooltipY = screenY - tooltipHeight - 20; // 20px above asset
    if (tooltipY < padding) {
      tooltipY = screenY + 50; // Place below if not enough space above
    }
    if (tooltipY + tooltipHeight > viewportHeight - padding) {
      tooltipY = viewportHeight - tooltipHeight - padding;
    }
    
    // Apply screen coordinates to tooltip (convert back to world for container)
    const worldTooltipX = tooltipX + camera.scrollX;
    const worldTooltipY = tooltipY + camera.scrollY;
    
    this.tooltipContainer.setPosition(worldTooltipX, worldTooltipY);
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
    // Check if camera is available before accessing bounds
    if (!this.cameras.main) {
      console.warn('⚠️ Camera not available during resize, skipping...');
      return;
    }
    
    // Store current camera position as a percentage of the world
    const bounds = this.cameras.main.getBounds();
    if (!bounds) {
      console.warn('⚠️ Camera bounds not available during resize, skipping...');
      return;
    }
    
    const currentWorldWidth = bounds.width;
    const currentWorldHeight = bounds.height;
    const scrollXPercent = this.cameras.main.scrollX / currentWorldWidth;
    const scrollYPercent = this.cameras.main.scrollY / currentWorldHeight;
    
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
    
    // Restore camera position proportionally or center if first time
    if (currentWorldWidth > 0) {
      this.cameras.main.scrollX = scrollXPercent * worldWidth;
      this.cameras.main.scrollY = scrollYPercent * worldHeight;
    } else {
      // Center camera if this is initial resize
      const centerX = (worldWidth - gameSize.width) / 2;
      const centerY = (worldHeight - gameSize.height) / 2;
      this.cameras.main.scrollX = centerX;
      this.cameras.main.scrollY = centerY;
    }
    
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
    // Calculate world center for positioning components
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;
    
    const components = ['api', 'cache', 'compute', 'database', 'load_balancer'];
    // Position components relative to center with spread around the area
    const componentPositions = [
      { x: centerX - 400, y: centerY - 200 },
      { x: centerX + 300, y: centerY - 150 },
      { x: centerX - 200, y: centerY + 100 },
      { x: centerX + 200, y: centerY + 50 },
      { x: centerX, y: centerY + 200 },
      { x: centerX - 350, y: centerY + 50 },
      { x: centerX + 350, y: centerY + 150 },
      { x: centerX - 100, y: centerY - 100 },
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
    
    // Add nature assets for environment decoration
    this.addNatureAssets(centerX, centerY);
  }
  
  private addNatureAssets(centerX: number, centerY: number) {
    const natureAssets = [
      { key: 'tree_pine', scale: 0.4, positions: [
        { x: centerX - 500, y: centerY - 300 },
        { x: centerX + 450, y: centerY - 250 },
        { x: centerX - 300, y: centerY + 300 },
        { x: centerX + 200, y: centerY + 280 }
      ]},
      { key: 'tree_round', scale: 0.35, positions: [
        { x: centerX - 450, y: centerY - 100 },
        { x: centerX + 400, y: centerY + 100 },
        { x: centerX - 150, y: centerY + 250 },
        { x: centerX + 300, y: centerY - 200 }
      ]},
      { key: 'rocks', scale: 0.3, positions: [
        { x: centerX - 350, y: centerY + 150 },
        { x: centerX + 320, y: centerY - 100 },
        { x: centerX - 100, y: centerY + 300 },
        { x: centerX + 150, y: centerY - 250 }
      ]},
      { key: 'boulder', scale: 0.4, positions: [
        { x: centerX - 480, y: centerY + 200 },
        { x: centerX + 380, y: centerY - 180 },
        { x: centerX + 100, y: centerY + 320 }
      ]}
    ];
    
    natureAssets.forEach(asset => {
      asset.positions.forEach(pos => {
        const natureSprite = this.add.image(pos.x, pos.y, asset.key);
        natureSprite.setScale(asset.scale);
        natureSprite.setAlpha(0.7);
        natureSprite.setDepth(-2); // Place behind system components
        
        // Add subtle swaying animation to trees
        if (asset.key.includes('tree')) {
          this.tweens.add({
            targets: natureSprite,
            rotation: 0.05,
            duration: 4000 + Math.random() * 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 2000
          });
        }
      });
    });
  }
  
  private addScenarioNodes() {
    this.scenarios.forEach((scenario, index) => {
      // Create scenario node based on status
      let nodeColor = 0x666666; // locked
      let nodeAlpha = 0.5;
      let nodeScale = 0.8;
      
      if (scenario.isCompleted) {
        nodeColor = 0x22c55e; // green - completed
        nodeAlpha = 1.0;
        nodeScale = 1.0;
      } else if (!scenario.isLocked) {
        nodeColor = 0x3b82f6; // blue - available
        nodeAlpha = 0.9;
        nodeScale = 0.9;
      }
      
      // Create main node circle
      const nodeGraphics = this.add.graphics();
      nodeGraphics.fillStyle(nodeColor, nodeAlpha);
      nodeGraphics.fillCircle(0, 0, 30);
      nodeGraphics.setPosition(scenario.x, scenario.y);
      nodeGraphics.setScale(nodeScale);
      nodeGraphics.setDepth(10); // Above background elements
      nodeGraphics.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add scenario title text
      const titleText = this.add.text(scenario.x, scenario.y - 50, scenario.title, {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 120 }
      });
      titleText.setOrigin(0.5);
      titleText.setDepth(11);
      titleText.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add client name text
      const clientText = this.add.text(scenario.x, scenario.y + 45, scenario.clientName, {
        fontSize: '12px',
        color: '#cccccc',
        align: 'center'
      });
      clientText.setOrigin(0.5);
      clientText.setDepth(11);
      clientText.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add completion indicator for completed scenarios
      if (scenario.isCompleted && scenario.bestScore) {
        const scoreText = this.add.text(scenario.x, scenario.y + 60, `${scenario.bestScore}%`, {
          fontSize: '10px',
          color: '#22c55e',
          fontStyle: 'bold',
          align: 'center'
        });
        scoreText.setOrigin(0.5);
        scoreText.setDepth(11);
        scoreText.setData('type', 'scenario-node'); // Mark for selective updates
      }
      
      // Make clickable if not locked
      if (!scenario.isLocked) {
        nodeGraphics.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
        
        nodeGraphics.on('pointerover', () => {
          nodeGraphics.setScale(nodeScale * 1.1);
          nodeGraphics.setAlpha(Math.min(nodeAlpha + 0.2, 1.0));
        });
        
        nodeGraphics.on('pointerout', () => {
          nodeGraphics.setScale(nodeScale);
          nodeGraphics.setAlpha(nodeAlpha);
        });
        
        nodeGraphics.on('pointerup', () => {
          console.log(`🎯 Scenario clicked: ${scenario.title}`);
          this.onScenarioClick(scenario.id);
        });
        
        // Add pulsing animation for available scenarios
        if (!scenario.isCompleted) {
          this.tweens.add({
            targets: nodeGraphics,
            alpha: nodeAlpha + 0.3,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: index * 200
          });
        }
      }
      
      // Add lock icon for locked scenarios
      if (scenario.isLocked) {
        const lockText = this.add.text(scenario.x, scenario.y, '🔒', {
          fontSize: '16px'
        });
        lockText.setOrigin(0.5);
        lockText.setDepth(12);
      }
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
          
          // Update Redux state when camera moves
          this.updateCameraViewportState();
        }
      }
    });
    
    this.input.on('pointerup', () => {
      isDragging = false;
      // Final state update when dragging ends
      this.updateCameraViewportState();
    });

    // Enable zoom with mouse wheel
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
      
      // Update Redux state when zoom changes
      this.updateCameraViewportState();
    });
  }
  
  private updateCameraViewportState() {
    if (!this.dispatch) return;
    
    const camera = this.cameras.main;
    const worldWidth = Math.max(2000, camera.width * 3);
    const worldHeight = Math.max(1500, camera.height * 3);
    
    this.dispatch(updateCareerMapViewport({
      scrollX: camera.scrollX,
      scrollY: camera.scrollY,
      zoom: camera.zoom,
      worldWidth,
      worldHeight,
      viewportWidth: camera.width,
      viewportHeight: camera.height,
    }));
  }
  
  private isAssetOnLeftSideOfView(worldX: number): boolean {
    const camera = this.cameras.main;
    const screenX = worldX - camera.scrollX;
    const viewportCenterX = camera.width / 2;
    return screenX < viewportCenterX;
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
  const sceneRef = useRef<CareerMapScene | null>(null);
  const navigate = useNavigate();
  const [sceneState, setSceneState] = useState<SceneState>({ mode: 'career-map' });
  const dispatch = useAppDispatch();
  const careerMapViewport = useAppSelector(state => state.game.careerMapViewport);
  const careerMapData = useAppSelector(selectCareerMapData);

  // Debug logging
  React.useEffect(() => {
    console.log('🎮 CareerMapGame props:', {
      scenarios: scenarios?.length || 0,
      progress: progress?.length || 0,
      scenariosData: scenarios,
      progressData: progress
    });
  }, [scenarios, progress]);

  const handleShowMentorSelection = (componentType: string) => {
    console.log(`🎯 Switching to mentor selection for: ${componentType}`);
    
    // Update scene state first
    const mentorSelectionData = {
      mode: 'mentor-selection' as const,
      selectedComponent: componentType,
      scenarioId: 'demo-scenario'
    };
    setSceneState(mentorSelectionData);
    
    if (phaserGameRef.current) {
      // Switch to MentorSelectionScene with mentor selection handler that has access to componentType
      phaserGameRef.current.scene.start('MentorSelectionScene', {
        onMentorSelected: (mentor: Mentor) => handleMentorSelected(mentor, componentType, 'demo-scenario'),
        onBack: handleMentorSelectionBack,
        componentType: componentType,
        scenarioId: 'demo-scenario'
      });
      // Stop the current CareerMapScene
      phaserGameRef.current.scene.stop('CareerMapScene');
    }
  };

  const handleMentorSelectionBack = () => {
    console.log(`🔙 Returning to career map`);
    if (phaserGameRef.current) {
      // Switch back to CareerMapScene
      phaserGameRef.current.scene.start('CareerMapScene', { 
        onScenarioClick,
        onComponentClick,
        onShowMentorSelection: handleShowMentorSelection,
        dispatch
      });
      // Stop the MentorSelectionScene
      phaserGameRef.current.scene.stop('MentorSelectionScene');
    }
    setSceneState({ mode: 'career-map' });
  };

  const handleMentorSelected = (mentor: Mentor, componentType?: string, scenarioId?: string) => {
    const finalComponentType = componentType || sceneState.selectedComponent;
    const finalScenarioId = scenarioId || sceneState.scenarioId || 'demo-scenario';
    
    console.log(`✅ Mentor selected: ${mentor.name} for ${finalComponentType}`);
    
    // Store selected mentor in localStorage or state management
    localStorage.setItem('selectedMentor', JSON.stringify(mentor));
    localStorage.setItem('mentorContext', JSON.stringify({
      componentType: finalComponentType,
      scenarioId: finalScenarioId,
      timestamp: Date.now()
    }));
    
    // Show success feedback
    console.log(`🎉 Mentor ${mentor.name} is now guiding you through ${finalComponentType} design!`);
    
    // Navigate to the SystemDesignCanvas with the scenario ID
    navigate(`/design/${finalScenarioId}`);
  };

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      console.log('🚀 Initializing Phaser game...');
      
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameRef.current,
        backgroundColor: '#1a1a1a',
        scene: [CareerMapScene, MentorSelectionScene], // Add MentorSelectionScene to the config
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

      try {
        phaserGameRef.current = new Phaser.Game(config);
        console.log('✅ Phaser game created successfully');
      } catch (error) {
        console.error('❌ Failed to create Phaser game:', error);
        return;
      }
      
      // Pass callbacks and dispatch to the scene (data will come from Redux)
      phaserGameRef.current.scene.start('CareerMapScene', { 
        onScenarioClick,
        onComponentClick,
        onShowMentorSelection: handleShowMentorSelection,
        dispatch
      });
      
      // Store scene reference for selective updates
      const scene = phaserGameRef.current.scene.getScene('CareerMapScene') as CareerMapScene;
      sceneRef.current = scene;
      
      // Initialize Redux state with current data
      dispatch(updateCareerMapData({ scenarios, progress }));

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
        sceneRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update Redux state when props change (but don't restart scene)
  useEffect(() => {
    dispatch(updateCareerMapData({ scenarios, progress }));
  }, [scenarios, progress, dispatch]);

  // Selectively update scene when Redux state changes
  useEffect(() => {
    if (sceneRef.current && careerMapData.lastUpdate > 0) {
      // Use selective updates instead of restarting the entire scene
      sceneRef.current.updateScenariosData(careerMapData.scenarios, careerMapData.progress);
    }
  }, [careerMapData]);

  return (
    <div className="career-map__phaser-container relative">
      <div ref={gameRef} className="w-full h-full" />
    </div>
  );
}; 