import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface CareerMapGameProps {
  scenarios: any[];
  progress: any[];
  onScenarioClick: (scenarioId: string) => void;
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
  private nodeSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  private pathGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'CareerMapScene' });
    this.onScenarioClick = () => {};
  }

  init(data: { scenarios: any[]; progress: any[]; onScenarioClick: (scenarioId: string) => void }) {
    this.onScenarioClick = data.onScenarioClick;
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
    // Create simple colored rectangles for nodes
    this.load.image('node-available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-locked', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Set up the camera
    this.cameras.main.setBackgroundColor('#1a1a1a');
    
    // Create path graphics
    this.pathGraphics = this.add.graphics();
    this.drawPaths();
    
    // Create scenario nodes
    this.scenarios.forEach(scenario => {
      this.createScenarioNode(scenario);
    });
    
    // Set up camera controls
    this.setupCameraControls();
  }

  private drawPaths() {
    this.pathGraphics.clear();
    this.pathGraphics.lineStyle(3, 0x4a5568, 0.8);
    
    // Draw connecting lines between scenarios
    for (let i = 0; i < this.scenarios.length - 1; i++) {
      const current = this.scenarios[i];
      const next = this.scenarios[i + 1];
      
      this.pathGraphics.beginPath();
      this.pathGraphics.moveTo(current.x, current.y);
      this.pathGraphics.lineTo(next.x, next.y);
      this.pathGraphics.strokePath();
    }
  }

  private createScenarioNode(scenario: ScenarioNode) {
    const container = this.add.container(scenario.x, scenario.y);
    
    // Node background
    const nodeSize = 60;
    let nodeColor = 0x4a5568; // Default gray
    
    if (scenario.isCompleted) {
      nodeColor = 0x22c55e; // Success green
    } else if (!scenario.isLocked) {
      nodeColor = 0x3b82f6; // Primary blue
    }
    
    const nodeBackground = this.add.circle(0, 0, nodeSize / 2, nodeColor);
    nodeBackground.setStrokeStyle(3, 0xffffff, 0.8);
    container.add(nodeBackground);
    
    // Node icon/text
    if (scenario.isLocked) {
      const lockIcon = this.add.text(0, 0, '🔒', {
        fontSize: '20px',
        color: '#ffffff'
      }).setOrigin(0.5);
      container.add(lockIcon);
    } else if (scenario.isCompleted) {
      const checkIcon = this.add.text(0, 0, '✓', {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      container.add(checkIcon);
    } else {
      const levelText = this.add.text(0, 0, scenario.level.toString(), {
        fontSize: '18px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      container.add(levelText);
    }
    
    // Node title
    const titleText = this.add.text(0, nodeSize / 2 + 20, scenario.title, {
      fontSize: '12px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 100 }
    }).setOrigin(0.5);
    container.add(titleText);
    
    // Client name
    const clientText = this.add.text(0, nodeSize / 2 + 40, scenario.clientName, {
      fontSize: '10px',
      color: '#a0a0a0',
      align: 'center'
    }).setOrigin(0.5);
    container.add(clientText);
    
    // Score (if completed)
    if (scenario.isCompleted && scenario.bestScore) {
      const scoreText = this.add.text(0, nodeSize / 2 + 55, `${scenario.bestScore}%`, {
        fontSize: '10px',
        color: '#22c55e',
        align: 'center'
      }).setOrigin(0.5);
      container.add(scoreText);
    }
    
    // Make interactive if not locked
    if (!scenario.isLocked) {
      container.setInteractive(new Phaser.Geom.Circle(0, 0, nodeSize / 2), Phaser.Geom.Circle.Contains);
      container.on('pointerdown', () => {
        this.onScenarioClick(scenario.id);
      });
      
      container.on('pointerover', () => {
        nodeBackground.setScale(1.1);
        this.tweens.add({
          targets: nodeBackground,
          scale: 1.1,
          duration: 200,
          ease: 'Power2'
        });
      });
      
      container.on('pointerout', () => {
        this.tweens.add({
          targets: nodeBackground,
          scale: 1,
          duration: 200,
          ease: 'Power2'
        });
      });
    }
    
    this.nodeSprites.set(scenario.id, container);
  }

  private setupCameraControls() {
    // Enable camera dragging
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
        this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
      }
    });

    // Enable zoom with mouse wheel
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
    });
  }

  update() {
    // Update logic if needed
  }
}

export const CareerMapGame: React.FC<CareerMapGameProps> = ({ scenarios, progress, onScenarioClick }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 1000,
        height: 700,
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
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      phaserGameRef.current = new Phaser.Game(config);
      
      // Pass data to the scene
      phaserGameRef.current.scene.start('CareerMapScene', { 
        scenarios, 
        progress, 
        onScenarioClick 
      });
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [scenarios, progress, onScenarioClick]);

  // Update scene data when props change
  useEffect(() => {
    if (phaserGameRef.current) {
      const scene = phaserGameRef.current.scene.getScene('CareerMapScene') as CareerMapScene;
      if (scene) {
        scene.scene.restart({ scenarios, progress, onScenarioClick });
      }
    }
  }, [scenarios, progress, onScenarioClick]);

  return <div ref={gameRef} className="career-map__phaser-container" />;
}; 