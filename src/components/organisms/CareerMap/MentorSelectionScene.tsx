import Phaser from 'phaser';

export class MentorSelectionScene extends Phaser.Scene {
  private componentType: string;
  private mentors: any[];
  private onMentorSelect: (mentor: any, componentType: string) => void;

  constructor() {
    super({ key: 'MentorSelectionScene' });
  }

  init(data: { componentType: string; mentors: any[]; onMentorSelect: (mentor: any, componentType: string) => void }) {
    this.componentType = data.componentType;
    this.mentors = data.mentors;
    this.onMentorSelect = data.onMentorSelect;
  }

  create() {
    // Create a semi-transparent background overlay
    const { width, height } = this.scale;
    const background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    background.setInteractive();

    // Create mentor selection UI
    const panel = this.add.rectangle(width / 2, height / 2, 800, 600, 0x2a2a2a);
    panel.setStrokeStyle(2, 0x4a4a4a);

    // Title
    const title = this.add.text(width / 2, height / 2 - 250, 'Select a Mentor', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    title.setOrigin(0.5);

    // Component type subtitle
    const subtitle = this.add.text(width / 2, height / 2 - 200, `For ${this.componentType}`, {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'Arial'
    });
    subtitle.setOrigin(0.5);

    // Create mentor cards
    const startX = width / 2 - 300;
    const startY = height / 2 - 100;
    const cardWidth = 180;
    const cardHeight = 200;
    const spacing = 20;

    this.mentors.forEach((mentor, index) => {
      const x = startX + (index % 3) * (cardWidth + spacing);
      const y = startY + Math.floor(index / 3) * (cardHeight + spacing);

      // Card background
      const card = this.add.rectangle(x, y, cardWidth, cardHeight, 0x3a3a3a);
      card.setStrokeStyle(2, 0x5a5a5a);
      card.setInteractive();

      // Mentor name
      const name = this.add.text(x, y - 70, mentor.name, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial',
        wordWrap: { width: cardWidth - 20 }
      });
      name.setOrigin(0.5);

      // Mentor bio
      const bio = this.add.text(x, y - 20, mentor.bio, {
        fontSize: '12px',
        color: '#cccccc',
        fontFamily: 'Arial',
        wordWrap: { width: cardWidth - 20 }
      });
      bio.setOrigin(0.5);

      // Specialties
      const specialties = this.add.text(x, y + 40, `Specialties:\n${mentor.specialties.join(', ')}`, {
        fontSize: '11px',
        color: '#888888',
        fontFamily: 'Arial',
        wordWrap: { width: cardWidth - 20 }
      });
      specialties.setOrigin(0.5);

      // Card hover effect
      card.on('pointerover', () => {
        card.setFillStyle(0x4a4a4a);
        this.input.setDefaultCursor('pointer');
      });

      card.on('pointerout', () => {
        card.setFillStyle(0x3a3a3a);
        this.input.setDefaultCursor('default');
      });

      // Card click handler
      card.on('pointerdown', () => {
        this.onMentorSelect(mentor, this.componentType);
      });
    });

    // Close button
    const closeButton = this.add.text(width / 2 + 380, height / 2 - 280, 'X', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive();
    closeButton.on('pointerover', () => {
      closeButton.setColor('#ff6666');
      this.input.setDefaultCursor('pointer');
    });
    closeButton.on('pointerout', () => {
      closeButton.setColor('#ffffff');
      this.input.setDefaultCursor('default');
    });
    closeButton.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume('CareerMapScene');
    });
  }
}