import Phaser from 'phaser';
import { supabase } from '../../../services/supabase';
import type { Mentor } from '../../molecules/MentorCard';

interface MentorSelectionSceneData {
  onMentorSelected: (mentor: Mentor) => void;
  onBack: () => void;
  componentType?: string;
  scenarioId?: string;
}

export class MentorSelectionScene extends Phaser.Scene {
  private mentors: Mentor[] = [];
  private selectedMentor: Mentor | null = null;
  private onMentorSelected: (mentor: Mentor) => void;
  private onBack: () => void;
  private componentType: string;
  private scenarioId: string;
  
  // UI Elements
  private headerContainer!: Phaser.GameObjects.Container;
  private mentorCardsContainer!: Phaser.GameObjects.Container;
  private confirmationContainer!: Phaser.GameObjects.Container;
  private scrollOffset = 0;
  private maxScrollOffset = 0;
  private isLoading = true;
  private errorMessage = '';
  
  // Card dimensions and layout
  private readonly CARD_WIDTH = 320;
  private readonly CARD_HEIGHT = 480;
  private readonly CARD_SPACING = 40;
  private readonly CARDS_PER_ROW = 3;
  private readonly HEADER_HEIGHT = 120;
  
  constructor() {
    super({ key: 'MentorSelectionScene' });
    this.onMentorSelected = () => {};
    this.onBack = () => {};
    this.componentType = '';
    this.scenarioId = '';
  }

  init(data: MentorSelectionSceneData) {
    this.onMentorSelected = data.onMentorSelected;
    this.onBack = data.onBack;
    this.componentType = data.componentType || 'system-component';
    this.scenarioId = data.scenarioId || 'default';
    this.selectedMentor = null;
    this.scrollOffset = 0;
    this.isLoading = true;
    this.errorMessage = '';
  }

  preload() {
    // Create colored rectangles for UI elements
    this.load.image('card-bg', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('button-bg', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  async create() {
    console.log('🎮 MentorSelectionScene: Creating scene...');
    
    // Create dark background
    const bg = this.add.rectangle(
      this.cameras.main.centerX, 
      this.cameras.main.centerY,
      this.cameras.main.width, 
      this.cameras.main.height,
      0x1a1a1a
    );
    bg.setDepth(-10);

    // Create header section
    this.createHeader();
    
    // Start with loading screen
    this.createLoadingScreen();
    
    // Set up input handlers
    this.setupInputHandlers();
    
    console.log('✅ MentorSelectionScene: Scene created successfully');
    
    // Fetch mentors data after scene is created
    await this.fetchMentors();
  }

  private async fetchMentors() {
    try {
      console.log('📡 Fetching mentors from Supabase...');
      
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      this.mentors = data || [];
      this.isLoading = false;
      console.log(`✅ Fetched ${this.mentors.length} mentors successfully`);
      
      // Refresh the scene content after mentors are loaded
      this.refreshSceneContent();
    } catch (error) {
      console.error('❌ Error fetching mentors:', error);
      this.errorMessage = 'Failed to load mentors. Please try again.';
      this.isLoading = false;
      
      // Refresh the scene to show error state
      this.refreshSceneContent();
    }
  }

  private refreshSceneContent() {
    // Clear existing content containers (except header and background)
    if (this.mentorCardsContainer) {
      this.mentorCardsContainer.destroy();
      this.mentorCardsContainer = null as any;
    }
    
    // Clear loading/error screens by removing all containers except header
    const childrenToDestroy: Phaser.GameObjects.GameObject[] = [];
    this.children.list.forEach(child => {
      if (child !== this.headerContainer && 
          child instanceof Phaser.GameObjects.Container) {
        childrenToDestroy.push(child);
      } else if (child instanceof Phaser.GameObjects.Graphics ||
                 child instanceof Phaser.GameObjects.Text) {
        // Also destroy standalone loading elements
        if (child.depth >= 50) { // Loading/error elements have depth 50+
          childrenToDestroy.push(child);
        }
      }
    });
    
    childrenToDestroy.forEach(child => child.destroy());
    
    // Create appropriate content based on current state
    if (this.isLoading) {
      this.createLoadingScreen();
    } else if (this.errorMessage) {
      this.createErrorScreen();
    } else {
      this.createMentorCards();
    }
  }

  private createHeader() {
    this.headerContainer = this.add.container(0, 0);
    
    // Header background
    const headerBg = this.add.rectangle(
      this.cameras.main.centerX,
      this.HEADER_HEIGHT / 2,
      this.cameras.main.width,
      this.HEADER_HEIGHT,
      0x2a2a2a,
      0.8
    );
    this.headerContainer.add(headerBg);
    
    // Back button
    const backButton = this.createButton(60, 40, 'Back', 0x666666, () => {
      this.onBack();
    });
    this.headerContainer.add(backButton);
    
    // Title
    const title = this.add.text(this.cameras.main.centerX, 30, 'Choose Your Mentor', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5, 0);
    this.headerContainer.add(title);
    
    // Subtitle
    const subtitle = this.add.text(this.cameras.main.centerX, 70, 
      `Select an expert to guide you through ${this.componentType} design`, {
      fontSize: '16px',
      color: '#cccccc'
    });
    subtitle.setOrigin(0.5, 0);
    this.headerContainer.add(subtitle);
    
    this.headerContainer.setDepth(100);
  }

  private createLoadingScreen() {
    const loadingContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    // Loading spinner (simple rotating circle)
    const spinner = this.add.graphics();
    spinner.lineStyle(4, 0x3b82f6);
    spinner.arc(0, 0, 30, 0, Math.PI * 1.5);
    loadingContainer.add(spinner);
    
    // Rotate the spinner
    this.tweens.add({
      targets: spinner,
      rotation: Math.PI * 2,
      duration: 1000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Loading text
    const loadingText = this.add.text(0, 60, 'Loading mentors...', {
      fontSize: '18px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);
    loadingContainer.add(loadingText);
    
    loadingContainer.setDepth(50);
  }

  private createErrorScreen() {
    const errorContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    // Error icon
    const errorIcon = this.add.text(0, -40, '⚠️', {
      fontSize: '48px'
    });
    errorIcon.setOrigin(0.5);
    errorContainer.add(errorIcon);
    
    // Error message
    const errorText = this.add.text(0, 20, this.errorMessage, {
      fontSize: '18px',
      color: '#ff6b6b',
      align: 'center',
      wordWrap: { width: 400 }
    });
    errorText.setOrigin(0.5);
    errorContainer.add(errorText);
    
    // Retry button
    const retryButton = this.createButton(0, 80, 'Try Again', 0x3b82f6, async () => {
      this.isLoading = true;
      this.errorMessage = '';
      errorContainer.destroy();
      this.createLoadingScreen();
      await this.fetchMentors();
      this.scene.restart();
    });
    errorContainer.add(retryButton);
    
    errorContainer.setDepth(50);
  }

  private createMentorCards() {
    this.mentorCardsContainer = this.add.container(0, this.HEADER_HEIGHT + 20);
    
    if (this.mentors.length === 0) {
      this.createNoMentorsMessage();
      return;
    }
    
    // Calculate grid layout
    const startX = (this.cameras.main.width - (this.CARDS_PER_ROW * this.CARD_WIDTH + (this.CARDS_PER_ROW - 1) * this.CARD_SPACING)) / 2 + this.CARD_WIDTH / 2;
    const startY = 40;
    
    this.mentors.forEach((mentor, index) => {
      const row = Math.floor(index / this.CARDS_PER_ROW);
      const col = index % this.CARDS_PER_ROW;
      
      const x = startX + col * (this.CARD_WIDTH + this.CARD_SPACING);
      const y = startY + row * (this.CARD_HEIGHT + this.CARD_SPACING);
      
      const mentorCard = this.createMentorCard(mentor, x, y);
      this.mentorCardsContainer.add(mentorCard);
    });
    
    // Calculate max scroll offset
    const totalRows = Math.ceil(this.mentors.length / this.CARDS_PER_ROW);
    const totalHeight = totalRows * (this.CARD_HEIGHT + this.CARD_SPACING);
    const visibleHeight = this.cameras.main.height - this.HEADER_HEIGHT - 40;
    this.maxScrollOffset = Math.max(0, totalHeight - visibleHeight);
    
    this.mentorCardsContainer.setDepth(10);
  }

  private createMentorCard(mentor: Mentor, x: number, y: number): Phaser.GameObjects.Container {
    const cardContainer = this.add.container(x, y);
    
    // Card background
    const cardBg = this.add.rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, 0x2a2a2a);
    cardBg.setStrokeStyle(2, 0x404040);
    cardContainer.add(cardBg);
    
    // Avatar circle
    const avatar = this.add.circle(0, -180, 40, 0x4a5568);
    cardContainer.add(avatar);
    
    // Avatar initials
    const initials = mentor.name.split(' ').map(n => n[0]).join('');
    const avatarText = this.add.text(0, -180, initials, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    avatarText.setOrigin(0.5);
    cardContainer.add(avatarText);
    
    // Name
    const nameText = this.add.text(0, -120, mentor.name, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    nameText.setOrigin(0.5);
    cardContainer.add(nameText);
    
    // Title
    const titleText = this.add.text(0, -95, mentor.title, {
      fontSize: '14px',
      color: '#a0a0a0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    titleText.setOrigin(0.5);
    cardContainer.add(titleText);
    
    // Tags
    const tagsY = -60;
    mentor.tags.slice(0, 3).forEach((tag, index) => {
      const tagBg = this.add.rectangle(
        -60 + index * 40, tagsY, 35, 20, 
        this.getTagColor(tag), 0.8
      );
      tagBg.setStrokeStyle(1, 0x666666);
      cardContainer.add(tagBg);
      
      const tagText = this.add.text(-60 + index * 40, tagsY, tag.slice(0, 3), {
        fontSize: '10px',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      tagText.setOrigin(0.5);
      cardContainer.add(tagText);
    });
    
    // Tagline
    const taglineText = this.add.text(0, -20, `"${mentor.tagline}"`, {
      fontSize: '12px',
      color: '#e0e0e0',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 30 }
    });
    taglineText.setOrigin(0.5);
    cardContainer.add(taglineText);
    
    // Specialties
    const specialtyTitle = this.add.text(0, 20, 'Specializes in:', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    specialtyTitle.setOrigin(0.5);
    cardContainer.add(specialtyTitle);
    
    const domains = mentor.specialty.domains.slice(0, 3).join(' • ');
    const domainsText = this.add.text(0, 40, domains, {
      fontSize: '11px',
      color: '#b0b0b0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    domainsText.setOrigin(0.5);
    cardContainer.add(domainsText);
    
    // Tools
    const toolsTitle = this.add.text(0, 80, 'Key Tools:', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    toolsTitle.setOrigin(0.5);
    cardContainer.add(toolsTitle);
    
    const tools = mentor.specialty.tools.slice(0, 4).join(' • ');
    const toolsText = this.add.text(0, 100, tools, {
      fontSize: '11px',
      color: '#b0b0b0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    toolsText.setOrigin(0.5);
    cardContainer.add(toolsText);
    
    // Known for
    const knownForText = this.add.text(0, 140, `Known for: ${mentor.signature.knownFor}`, {
      fontSize: '10px',
      color: '#a0a0a0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    knownForText.setOrigin(0.5);
    cardContainer.add(knownForText);
    
    // Select button
    const selectButton = this.createButton(0, 200, `Choose ${mentor.name.split(' ')[0]}`, 0x3b82f6, () => {
      this.selectMentor(mentor);
    });
    cardContainer.add(selectButton);
    
    // Make card interactive
    cardBg.setInteractive();
    cardBg.on('pointerover', () => {
      cardBg.setStrokeStyle(3, 0x3b82f6);
      this.tweens.add({
        targets: cardContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    cardBg.on('pointerout', () => {
      if (this.selectedMentor?.id !== mentor.id) {
        cardBg.setStrokeStyle(2, 0x404040);
        this.tweens.add({
          targets: cardContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2'
        });
      }
    });
    
    cardBg.on('pointerdown', () => {
      this.selectMentor(mentor);
    });
    
    return cardContainer;
  }

  private createNoMentorsMessage() {
    const messageContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    const icon = this.add.text(0, -40, '👥', {
      fontSize: '64px'
    });
    icon.setOrigin(0.5);
    messageContainer.add(icon);
    
    const title = this.add.text(0, 20, 'No Mentors Available', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    messageContainer.add(title);
    
    const subtitle = this.add.text(0, 50, 'Mentors are currently being prepared for your journey.', {
      fontSize: '16px',
      color: '#a0a0a0'
    });
    subtitle.setOrigin(0.5);
    messageContainer.add(subtitle);
    
    messageContainer.setDepth(50);
  }

  private selectMentor(mentor: Mentor) {
    console.log(`🎯 Mentor selected: ${mentor.name}`);
    
    // Update selection state
    this.selectedMentor = mentor;
    
    // Update card appearances
    this.mentorCardsContainer.each((child: any) => {
      const cardBg = child.list[0]; // First child is the background rectangle
      cardBg.setStrokeStyle(2, 0x404040);
      this.tweens.add({
        targets: child,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    // Highlight selected card
    const selectedCardIndex = this.mentors.findIndex(m => m.id === mentor.id);
    if (selectedCardIndex >= 0) {
      const selectedCard = this.mentorCardsContainer.list[selectedCardIndex] as Phaser.GameObjects.Container;
      const cardBg = selectedCard.list[0];
      (cardBg as Phaser.GameObjects.Rectangle).setStrokeStyle(3, 0x22c55e);
      this.tweens.add({
        targets: selectedCard,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    }
    
    // Show confirmation UI
    this.createConfirmationUI();
  }

  private createConfirmationUI() {
    if (!this.selectedMentor) return;
    
    // Remove existing confirmation UI
    if (this.confirmationContainer) {
      this.confirmationContainer.destroy();
    }
    
    this.confirmationContainer = this.add.container(0, 0);
    
    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );
    overlay.setInteractive();
    this.confirmationContainer.add(overlay);
    
    // Confirmation panel
    const panelWidth = 500;
    const panelHeight = 300;
    const panel = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      panelWidth,
      panelHeight,
      0x2a2a2a
    );
    panel.setStrokeStyle(2, 0x3b82f6);
    this.confirmationContainer.add(panel);
    
    // Mentor avatar
    const avatar = this.add.circle(this.cameras.main.centerX - 150, this.cameras.main.centerY - 50, 30, 0x4a5568);
    this.confirmationContainer.add(avatar);
    
    const initials = this.selectedMentor.name.split(' ').map(n => n[0]).join('');
    const avatarText = this.add.text(this.cameras.main.centerX - 150, this.cameras.main.centerY - 50, initials, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    avatarText.setOrigin(0.5);
    this.confirmationContainer.add(avatarText);
    
    // Confirmation text
    const confirmTitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 80, 
      `You've selected ${this.selectedMentor.name}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    confirmTitle.setOrigin(0.5);
    this.confirmationContainer.add(confirmTitle);
    
    const confirmSubtitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 
      this.selectedMentor.title, {
      fontSize: '14px',
      color: '#a0a0a0'
    });
    confirmSubtitle.setOrigin(0.5);
    this.confirmationContainer.add(confirmSubtitle);
    
    // Benefits
    const benefits = [
      `Expert guidance in ${this.selectedMentor.specialty.domains[0]}`,
      `Optimized for ${this.componentType} design`,
      `Access to specialized knowledge and best practices`
    ];
    
    benefits.forEach((benefit, index) => {
      const bulletText = this.add.text(this.cameras.main.centerX - 200, this.cameras.main.centerY + index * 20, 
        `• ${benefit}`, {
        fontSize: '12px',
        color: '#b0b0b0',
        wordWrap: { width: 400 }
      });
      this.confirmationContainer.add(bulletText);
    });
    
    // Action buttons
    const confirmButton = this.createButton(
      this.cameras.main.centerX + 80, 
      this.cameras.main.centerY + 100, 
      `Continue with ${this.selectedMentor.name.split(' ')[0]}`, 
      0x22c55e, 
      () => {
        this.confirmSelection();
      }
    );
    this.confirmationContainer.add(confirmButton);
    
    const backButton = this.createButton(
      this.cameras.main.centerX - 80, 
      this.cameras.main.centerY + 100, 
      'Back', 
      0x666666, 
      () => {
        this.confirmationContainer.destroy();
      }
    );
    this.confirmationContainer.add(backButton);
    
    this.confirmationContainer.setDepth(200);
  }

  private confirmSelection() {
    if (this.selectedMentor) {
      console.log(`✅ Confirmed mentor selection: ${this.selectedMentor.name}`);
      this.onMentorSelected(this.selectedMentor);
    }
  }

  private createButton(x: number, y: number, text: string, color: number, onClick: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, text.length * 8 + 20, 35, color);
    bg.setStrokeStyle(1, 0x666666);
    button.add(bg);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);
    button.add(buttonText);
    
    bg.setInteractive();
    bg.on('pointerover', () => {
      bg.setFillStyle(color === 0x666666 ? 0x888888 : color + 0x222222);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(color);
    });
    
    bg.on('pointerdown', onClick);
    
    return button;
  }

  private getTagColor(tag: string): number {
    // Color-code tags based on type
    if (tag.includes('Leader') || tag.includes('Architect')) return 0x3b82f6; // Blue
    if (tag.includes('Performance') || tag.includes('Systems')) return 0xf59e0b; // Orange  
    if (tag.includes('Academic') || tag.includes('Research')) return 0x8b5cf6; // Purple
    if (tag.includes('Pioneer') || tag.includes('Revolutionary')) return 0x22c55e; // Green
    return 0x6b7280; // Gray default
  }

  private setupInputHandlers() {
    // Mouse wheel scrolling
    this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      if (this.mentorCardsContainer && this.maxScrollOffset > 0) {
        const scrollSpeed = 50;
        this.scrollOffset = Phaser.Math.Clamp(
          this.scrollOffset + (deltaY > 0 ? scrollSpeed : -scrollSpeed),
          0,
          this.maxScrollOffset
        );
        this.mentorCardsContainer.y = this.HEADER_HEIGHT + 20 - this.scrollOffset;
      }
    });
    
    // Keyboard controls
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors) {
      this.input.keyboard?.on('keydown-ESC', () => {
        if (this.confirmationContainer) {
          this.confirmationContainer.destroy();
        } else {
          this.onBack();
        }
      });
    }
  }

  update() {
    // Update any animations or ongoing effects here if needed
  }
} 