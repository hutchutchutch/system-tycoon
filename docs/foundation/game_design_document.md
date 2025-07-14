# System Design Tycoon - Game Design Document

**Version:** 1.0  
**Date:** July 14, 2025  
**Author:** Game Design Team  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Game Overview](#2-game-overview)
3. [Gameplay and Mechanics](#3-gameplay-and-mechanics)
4. [Story and Narrative](#4-story-and-narrative)
5. [Characters](#5-characters)
6. [Level Design](#6-level-design)
7. [Art Direction](#7-art-direction)
8. [User Interface](#8-user-interface)
9. [Audio Design](#9-audio-design)
10. [Technical Requirements](#10-technical-requirements)
11. [Project Timeline](#11-project-timeline)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### Game Title and Tagline
**"System Design Tycoon: Build the Digital World"**  
*"Where every line of code flows like a theme park ride"*

### Genre and Platform
- **Primary Genre:** Educational Simulation / Tycoon
- **Secondary Genre:** Puzzle / Strategy
- **Platform:** Web Browser (Desktop & Mobile Responsive)
- **Engine:** Phaser.js with React Flow integration

### Target Audience
Software engineers, computer science students, and system design interview candidates seeking to learn distributed systems concepts through engaging, visual gameplay.

### Unique Selling Points
- **Meeting-Driven Requirements:** Players participate in realistic stakeholder meetings before designing systems
- **Visual Data Flow:** Watch data packets flow through architectural components like visitors through a theme park
- **Progressive Complexity:** Start with simple 3-tier architecture, advance to distributed microservices
- **Real-World Scenarios:** Build systems for actual companies (Netflix, Uber, WhatsApp) with authentic constraints
- **AI-Powered Assistance:** Contextual suggestions based on current architecture and requirements

### Core Gameplay Loop
**Meeting Phase** (3-5 min) → **Requirements Clarification** (ask 3 questions) → **System Design** (10-15 min) → **Live Simulation** (watch packets flow) → **Performance Analysis** → **Team Debrief** → **Level Complete**

---

## 2. Game Overview

### 2.1 Core Concept

System Design Tycoon transforms the abstract world of software architecture into a tangible, visual experience. Players attend team meetings to gather requirements, ask clarifying questions to refine constraints, then design system architectures using drag-and-drop components. The magic happens when the system goes live - animated data packets flow through the player's architecture like theme park visitors, revealing bottlenecks, failures, and optimization opportunities in real-time.

The game teaches both the technical aspects of system design (load balancing, caching, database scaling) and the equally important human skills (requirement gathering, stakeholder communication, constraint management). Players experience the complete software engineering lifecycle from initial stakeholder conversation to live system monitoring.

### 2.2 Genre and Sub-genre

**Primary Genre:** Educational Simulation  
- Players build and manage complex systems with realistic constraints
- Focus on learning through experimentation and immediate feedback
- Success measured by meeting requirements rather than entertainment metrics

**Secondary Genres:**
- **Tycoon Elements:** Resource management (budget, time, capacity)
- **Puzzle Strategy:** Optimization challenges with multiple valid solutions  
- **Simulation:** Real-time system behavior with emergent complexity

### 2.3 Target Platform(s)

**Primary Platform:** Modern Web Browsers
- **Minimum Requirements:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Performance Targets:** 60fps simulation, <3 second load times
- **Responsive Design:** Optimized for desktop (primary) and tablet (secondary)
- **Network:** Online required for AI assistance and progress tracking
- **Accessibility:** WCAG 2.1 AA compliance for educational use

### 2.4 Game Flow

**Single Player Mode:**
```
Main Menu → Character Creation → Level Selection → 
Meeting Phase → Requirements Review → Mentor Selection → 
Design Canvas → Live Simulation → Performance Analysis → 
Team Debrief → Progress Review → Next Level/Replay
```

**Multiplayer Modes:**
```
Challenge Mode: Lobby → Requirements Brief → Mentor Selection → 
Individual Design Canvas → Simulation → Score Comparison → Results

Collaborate Mode: Lobby → Requirements Brief → Mentor Selection → 
Shared Design Canvas (Live) → Joint Simulation → Team Results
```

**Session Structure:**
- **Single Player:** 15-25 minutes per scenario
- **Challenge Mode:** 20-30 minutes with scoring comparison
- **Collaborate Mode:** 25-35 minutes with real-time coordination
- **Progressive Unlocking:** Complete scenarios to unlock new levels
- **Meta-Progression:** Character development and component mastery

---

## 3. Gameplay and Mechanics

### 3.1 Core Gameplay Loop

**Immediate Loop (5-60 seconds):**
- Drag components from drawer to canvas
- Connect components with flow arrows
- Observe real-time cost and capacity calculations
- Receive AI suggestions for optimization

**Session Loop (15-25 minutes):**
1. **Meeting Phase** (3-5 min): Interactive stakeholder conversation
2. **Design Phase** (10-15 min): Component placement and connection under time pressure
3. **Simulation Phase** (5-8 min): Live packet flow with performance monitoring
4. **Review Phase** (2-3 min): Team feedback and learning reinforcement

**Meta Loop (hours/days):**
- Unlock new component types and architectural patterns
- Progress through 6 complexity levels
- Master different application types (social media, e-commerce, streaming)
- Build portfolio of successful system designs

### 3.2 Game Mechanics

#### Meeting & Requirements System
- **Stakeholder Interaction:** Select from pre-generated questions (3 max per scenario) in early levels
- **Question Selection:** Multiple choice options that reflect different engineering priorities
- **Dynamic Requirements:** Selected questions modify constraints and add/remove requirements
- **Question Quality:** Better question choices lead to clearer requirements and team praise
- **Progressive Complexity:** Later levels may include more open-ended question options

#### Mentor Selection System
- **Timing:** Appears after requirements gathering, before design phase
- **Mentor Pool:** Rotating selection of 3-4 available mentors per scenario
- **Specializations:** Each mentor provides different architectural guidance and component suggestions
- **Unlock Progression:** Advanced mentors become available as player progresses through levels

#### Component Placement System
- **Drag-and-Drop Interface:** Desktop-optimized component placement on React Flow canvas
- **Smart Connections:** Visual feedback for valid/invalid component relationships
- **Capacity Planning:** Real-time calculation of system throughput and bottlenecks
- **Cost Management:** Budget constraints force optimization decisions

#### Data Flow Visualization System
- **Edge Animations:** Animated flows along React Flow connection lines to show data movement
- **Flow Intensity:** Animation speed and thickness reflect traffic volume and bandwidth
- **Bottleneck Indication:** Congested connections show visual stress indicators
- **Performance Feedback:** Color-coded flows indicate healthy vs. problematic data paths

#### Multiplayer Systems
- **Challenge Mode:** 
  - Identical requirements for all players
  - Individual design canvases with time limit
  - Comparative scoring across multiple criteria
  - Leaderboard and replay system for learning from top solutions

- **Collaborate Mode:**
  - Shared React Flow canvas with real-time synchronization
  - Socket.io integration for live component placement and connections
  - Role assignment for different aspects of system design
  - Consensus-building tools for architectural decisions

### 3.3 Controls

**Desktop Controls (Primary):**
- **Mouse:** Primary interaction for drag-and-drop, clicking, and canvas navigation
- **Drag & Drop:** Move components from drawer to canvas, create connections between components
- **Click Interactions:** Select team members, choose questions, place components, access menus
- **Canvas Navigation:** Mouse wheel zoom, click-and-drag pan, double-click to center
- **Keyboard Shortcuts:** Space (pause simulation), Enter (confirm selection), Esc (main menu), Tab (cycle through UI elements)
- **Context Menus:** Right-click for component configuration and advanced options

**Accessibility Controls:**
- **Keyboard Navigation:** Full tab-order support for all interactive elements
- **Screen Reader Support:** ARIA labels and descriptions for all game elements
- **High Contrast Mode:** Alternative color schemes for visual accessibility
- **Subtitle Support:** Text display for all audio cues and dialogue

### 3.4 Game Rules

**Win Conditions:**
- Meet all functional requirements within budget and time constraints
- Achieve target performance metrics (latency, throughput, uptime)
- Handle traffic spikes and failure scenarios without system collapse

**Failure Conditions:**
- Budget exceeded by more than 20%
- Performance targets missed (response time, error rate)
- Complete system failure during simulation phase

**Scoring System:**
- **Requirement Satisfaction:** 40% of score
- **Performance Excellence:** 30% of score  
- **Cost Efficiency:** 20% of score
- **Architectural Quality:** 10% of score (patterns, best practices)

### 3.5 Player Progression

**Level-Based Progression:**
- **Level 1:** Basic 3-tier architecture (Web, Compute, Storage)
- **Level 2:** Scaling fundamentals (Load Balancers, Caches)
- **Level 3:** Global deployment (CDN, Replicas, Monitoring)
- **Level 4:** Security & compliance (Auth, Encryption, Auditing)
- **Level 5:** Distributed systems (Microservices, Message Queues)
- **Level 6:** Advanced optimization (AI/ML, Edge Computing, Auto-scaling)

**Component Mastery:**
- Bronze: Successfully use component 5 times
- Silver: Optimize component performance in 3 scenarios
- Gold: Teach community best practices for component

**Achievement System:**
- **Crisis Manager:** Successfully handle emergency failure scenarios
- **Cost Optimizer:** Complete scenarios 50% under budget  
- **Performance Expert:** Achieve sub-100ms response times
- **Architect:** Design systems handling 1M+ concurrent users

---

## 4. Story and Narrative

### 4.1 Story Synopsis

You are a tech enthusiast who has always been fascinated by how software applications work. You've spent years reading HackerNews, following tech blogs, and using various applications, but you've never actually built anything yourself. Your knowledge is theoretical—you understand concepts but lack hands-on experience.
Everything changes when your friend Sarah complains over coffee about her expensive Squarespace subscription for her small bakery website. "I'm paying $300 a year for basically a static page with our menu and hours!"
Having just read an article about AWS hosting static sites for pennies, you offer: "I could help you move it to AWS. I've been wanting to try it anyway..."
What starts as a favor for a friend becomes your entry into the world of system design consulting. Each successful project leads to word-of-mouth referrals, gradually building your reputation from neighborhood helper to sought-after system architect.

### 4.2 Career Progression Through Referrals
1. The Neighborhood Helper (Levels 1-2)

Origin Project: Sarah's bakery website (Squarespace → AWS S3 static hosting)
Referral Chain: Sarah tells other small business owners at the farmers market
Project Types:

Local restaurant online ordering system
Neighborhood book club's review website
Community center event registration


Learning: Basic web hosting, simple databases, cost optimization
Reputation: "That person who helped Sarah save money on her website"

2. The Small Business Consultant (Levels 3-4)

Breakthrough: Sarah's bakery goes viral on TikTok, your simple system handles the traffic
Referral Chain: Local business association starts recommending you
Project Types:

Regional fitness studio's class booking platform
Growing e-commerce store's inventory system
Local news blog expecting election night traffic


Critical Challenge: "The Food Truck Festival" - Design a system for 50 food trucks to take orders during a massive weekend festival
Reputation: "The affordable tech consultant who actually delivers"

3. The Startup Specialist (Levels 5-6)

Breakthrough: A VC notices the food truck system and refers their portfolio companies
Referral Chain: Startup accelerators and co-working spaces
Project Types:

Dating app preparing for launch
EdTech platform for remote learning
HealthTech startup needing HIPAA compliance


Critical Challenge: "The Acquisition Target" - A startup needs to prove their architecture can scale for a potential acquirer
Reputation: "The consultant who helps startups scale without breaking the bank"

4. The Scale Expert (Levels 7-8)

Breakthrough: One of your startups gets acquired by a major tech company
Referral Chain: CTOs at established companies facing growth challenges
Project Types:

Streaming service entering new markets
Social platform dealing with viral growth
Financial services modernizing legacy systems


Critical Challenge: "The Global Launch" - Major retailer expanding to 15 countries simultaneously
Reputation: "The architect who solved [Famous Startup]'s scaling problems"

5. The Industry Authority (Levels 9-10)

Breakthrough: You're invited to speak at major tech conferences
Referral Chain: Board members and C-suite executives
Project Types:

Nation-wide healthcare system integration
Global cryptocurrency exchange
Government digital transformation projects


Critical Challenge: "The Moonshot" - Design a system for a company attempting something never done before
Reputation: "One of the leading system design consultants in the industry"

### 4.3 Narrative Delivery Through Referrals
Referral Mechanics:
Each level begins with a referral introduction showing how you got this client:
Level 1:
[Text message from Sarah]
"Hey! Remember you helped with my website? My friend 
Mike runs a pizza place and needs the same thing. 
I gave him your number - hope that's ok! 😊"
Level 5:
[Email from VC Partner]
"I was incredibly impressed with the food truck system 
you designed. I have a portfolio company that needs 
someone with your practical approach. They're building 
something special. Are you available for a call?"
Level 9:
[LinkedIn message from Fortune 500 CTO]
"I saw your talk at KubeCon about scaling on a budget. 
We have a project that needs someone who thinks 
differently. This could define the next decade of our 
industry. Interested?"
### 4.4 Character Development Arc
Your Journey:

Impostor Phase (Level 1): "I just read about this yesterday..."
Learning Phase (Level 2-3): "I think I understand how this works now"
Confidence Phase (Level 4-5): "I've solved this type of problem before"
Expert Phase (Level 6-8): "Let me show you a better approach"
Visionary Phase (Level 9-10): "Here's how we'll revolutionize this"

Client Relationships:

Early clients become references and champions
Sarah appears throughout, proudly telling people "I gave them their first project!"
Failed projects result in lost referral chains
Success builds a portfolio you can show future clients

### 4.5 Meeting Evolution
Early Meetings (Levels 1-3):

Casual settings: coffee shops, small offices, Zoom calls from home
Clients explain things simply, assuming you're not too technical
You ask basic questions to understand their needs
Budgets discussed in relatable terms ("Less than my car payment")

Mid-Career Meetings (Levels 4-6):

Professional settings: startup offices, co-working spaces
Clients use more technical language
You ask sophisticated questions about scale and architecture
Budgets in startup terms ("We have 18 months runway")

Late-Career Meetings (Levels 7-10):

Executive settings: boardrooms, corporate headquarters
C-suite executives and technical teams present
You challenge requirements and suggest alternatives
Budgets in enterprise scale ("Q3 infrastructure allocation")

### 4.6 Personal Stakes
Unlike being an employee, as a consultant:

Financial Pressure: No salary safety net - failed projects mean no income
Reputation Risk: One public failure could end referral chains
Learning Pressure: You must stay current or lose relevance
Work-Life Balance: Success brings more referrals than you can handle

Emotional Moments:

The anxiety of your first "real" project beyond Sarah's site
The pride when a former client's business thrives on your architecture
The pressure when a high-profile project threatens to exceed your abilities
The satisfaction of turning down projects because you're fully booked

### 4.3 World Building

**Setting:** Modern technology consulting firm specializing in system architecture
**Time Period:** Present day (2025) with realistic tech constraints and opportunities
**Technology Level:** Current distributed systems technologies (cloud computing, microservices, edge computing)
**Tone:** Professional yet approachable, emphasizing learning and growth over competition

---

## 5. Characters

### 5.1 Player Character

**Role:** Junior Software Engineer → Senior System Architect
**Growth Arc:** Progresses from basic understanding to expert-level system design capabilities
**Customization:** Players choose character name and avatar appearance
**Skills Development:** Measured through component mastery and architectural pattern recognition

### 5.2 Team Members (NPCs)

#### Petra Manager - Product Manager
- **Role:** Defines user needs and business requirements
- **Personality:** User-focused, detail-oriented, concerned with market fit
- **Question Categories:** Feature priorities, user demographics, usage patterns
- **Dialogue Style:** "Our users expect..." / "The market research shows..." / "From a product perspective..."

#### Alex Executive - CEO/Founder  
- **Role:** Sets business vision and constraints
- **Personality:** Big picture thinking, cost-conscious, ambitious
- **Question Categories:** Budget limits, timeline constraints, growth expectations
- **Dialogue Style:** "We need to..." / "The vision is..." / "Can we afford..." / "The board expects..."

#### Mark Ethan - Marketing Lead
- **Role:** Provides growth projections and user acquisition insights
- **Personality:** Optimistic about growth, focused on scalability and viral potential
- **Question Categories:** Expected user growth, geographic expansion, viral scenarios
- **Dialogue Style:** "If this goes viral..." / "We're targeting..." / "Growth could be..." / "Campaign data shows..."

#### Devin Ops - DevOps Engineer
- **Role:** Infrastructure concerns and operational requirements
- **Personality:** Pragmatic, reliability-focused, prefers proven solutions
- **Question Categories:** Performance requirements, operational complexity, monitoring needs
- **Dialogue Style:** "From an ops perspective..." / "We need to maintain..." / "Consider the complexity..." / "SLA requirements..."

#### Security Stan - Security Lead (Levels 4+)
- **Role:** Security and compliance requirements
- **Personality:** Risk-averse, thorough, regulation-focused
- **Question Categories:** Compliance requirements, data sensitivity, security threats
- **Dialogue Style:** "Regulatory requirements mandate..." / "Security concerns include..." / "We must ensure..." / "Audit trail needs..."

### 5.3 Mentor Characters (Selection Screen)

#### Available Mentors Pool

**Dr. Linda Wu - Senior Systems Architect**
- **Specialization:** Foundational architecture patterns and scalability
- **Guidance Style:** Patient teacher who explains the "why" behind architectural decisions
- **Best For:** Levels 1-3, when learning core concepts
- **Signature Advice:** "Let's think about this step by step..."

**Sam Okafor - Performance Engineer**  
- **Specialization:** Optimization, caching strategies, and performance tuning
- **Guidance Style:** Data-driven, loves metrics and benchmarks
- **Best For:** Levels 2-4, when performance becomes critical
- **Signature Advice:** "The numbers don't lie, here's what the data shows..."

**Maya Patel - Cloud Solutions Architect**
- **Specialization:** Modern cloud platforms, microservices, and distributed systems
- **Guidance Style:** Forward-thinking, prefers cutting-edge solutions
- **Best For:** Levels 3-5, for cloud-native architectures
- **Signature Advice:** "In the cloud, we can leverage..."

**Chen Zhang - Security Architect**
- **Specialization:** Security patterns, compliance frameworks, and risk assessment
- **Guidance Style:** Methodical, focuses on threat modeling and defense in depth
- **Best For:** Levels 4-6, when security becomes paramount
- **Signature Advice:** "From a security standpoint, we need to consider..."

**Jordan Rivera - Startup CTO**
- **Specialization:** MVP development, rapid scaling, and technical debt management
- **Guidance Style:** Pragmatic, focuses on trade-offs and speed-to-market
- **Best For:** Early levels and startup scenarios
- **Signature Advice:** "For an MVP, I'd recommend..."

**Alex Kim - Enterprise Architect**
- **Specialization:** Large-scale systems, integration patterns, and legacy modernization
- **Guidance Style:** Systematic, emphasizes standards and governance
- **Best For:** Advanced levels with enterprise requirements
- **Signature Advice:** "At enterprise scale, governance becomes critical..."

#### Mentor Selection Screen
- **Timing:** Appears after requirements gathering, before design canvas
- **Selection Pool:** 3-4 mentors available per scenario (rotates based on level and requirements)
- **Preview Information:** Each mentor shows specialization, style, and sample advice
- **Unlock System:** Advanced mentors unlock as player progresses and demonstrates competency
- **Guidance Integration:** Selected mentor provides contextual hints during design phase

---

## 6. Level Design

### 6.1 Level Design Philosophy

**Progressive Complexity:** Each level introduces 3-5 new concepts while reinforcing previous learning
**Real-World Relevance:** Scenarios based on actual system design challenges faced by major tech companies
**Multiple Solutions:** Every scenario has several valid architectural approaches, encouraging creativity
**Failure as Learning:** System failures provide educational opportunities rather than punishment

### 6.2 Level Progression Structure

**Level 1: Foundation (Weeks 1-2)**
- **Philosophy:** "Every app needs these three things"
- **Components:** Web Interface, Compute Server, Storage Database
- **Scenarios:** Personal blog, photo gallery, todo list
- **Learning Goals:** Basic request/response cycle, data persistence

**Level 2: Scaling Fundamentals (Weeks 3-4)**  
- **Philosophy:** "What happens when you get popular"
- **New Components:** Load Balancer, Cache, File Storage
- **Scenarios:** Viral blog post, small e-commerce, news website
- **Learning Goals:** Horizontal scaling, performance optimization

**Level 3: Global Deployment (Weeks 5-7)**
- **Philosophy:** "Serving users worldwide"
- **New Components:** CDN, Database Replicas, Health Monitoring
- **Scenarios:** International social network, SaaS application, streaming service
- **Learning Goals:** Geographic distribution, reliability engineering

**Level 4: Security & Compliance (Weeks 8-10)**
- **Philosophy:** "Protecting user data and meeting regulations"
- **New Components:** Authentication, Firewall, Encryption, Audit Logging
- **Scenarios:** Banking application, healthcare platform, corporate intranet  
- **Learning Goals:** Defense in depth, compliance requirements

**Level 5: Distributed Systems (Weeks 11-15)**
- **Philosophy:** "When everything must work together"
- **New Components:** Message Queues, Service Mesh, Event Bus, Container Orchestration
- **Scenarios:** Chat platform, IoT system, marketplace
- **Learning Goals:** Microservices, event-driven architecture, fault tolerance

**Level 6: Advanced Optimization (Weeks 16-20)**
- **Philosophy:** "Squeezing performance from every resource"
- **New Components:** AI/ML Pipeline, Edge Computing, Circuit Breakers, Auto-scaling
- **Scenarios:** Real-time trading, autonomous vehicles, global CDN
- **Learning Goals:** Performance optimization, predictive scaling, chaos engineering

### 6.3 Individual Level Breakdown Example

**Level 1.1: "Personal Blog Platform"**

**Meeting Setup:**
- **Sarah:** "We want to build a simple blog where users can write and share posts"
- **Alex:** "Think Medium, but more focused on personal storytelling"
- **Jordan:** "We're targeting about 1,000 daily visitors to start"
- **Taylor:** "Keep costs low - this is a side project for now"

**Available Questions:**
- Sarah: "What features do users need most?" → Adds text editor, image upload, commenting requirements
- Alex: "What's our budget limit?" → Sets $200/month constraint
- Jordan: "How fast do you expect growth?" → Adds viral spike handling requirement
- Taylor: "Any specific performance requirements?" → Sets 3-second page load target

**Requirements (after questions):**
- Handle 1,000 daily users (peak: 100 concurrent)
- Support text posts with images
- Basic commenting system
- <3 second page load times
- Budget: $200/month
- Timeline: 3 months to launch

**Victory Conditions:**
- All three components (Web, Compute, Storage) connected correctly
- Total cost ≤ $200/month
- Predicted response time ≤ 3 seconds
- Successfully handle traffic simulation without failures

**Teaching Elements:**
- Introduction to basic web architecture
- Understanding of request/response flow
- Concept of capacity planning
- Budget constraint management

---

## 7. Art Direction

### 7.1 Visual Style

**Overall Aesthetic:** Clean, modern tech startup environment with a slight cartoon stylization for approachability
**Color Palette:** 
- Primary: Blues and teals (technology, trust, stability)
- Secondary: Greens (success, performance) and oranges (warnings, optimization opportunities)
- Accent: Purple for advanced/premium features
**Mood:** Professional yet friendly, emphasizing learning and achievement over stress

### 7.2 Character Design

**Design Principles:**
- Diverse representation across gender, ethnicity, and age
- Professional attire appropriate for tech industry roles
- Distinct visual personalities matching character roles
- Subtle animations to convey personality (Sarah adjusts glasses, Alex gestures broadly)

**Art Style:** Semi-realistic 2D illustrations with clean lines and subtle shading
**Customization:** Player character has multiple appearance options for inclusivity

### 7.3 Environment Design

**Meeting Rooms:**
- Level 1-2: Casual startup environment (standing desks, exposed brick, whiteboards)
- Level 3-4: Professional corporate setting (conference table, large windows, branded materials)  
- Level 5-6: High-tech environment (multiple monitors, glass walls, modern furniture)

**Design Canvas:**
- Clean grid background with subtle tech pattern
- Component icons follow consistent design language
- Connection lines use flow-based styling (thicker for higher bandwidth)
- Performance overlays use clear color coding for status

### 7.4 Component Visual Design

**Component Categories:**
- **Compute:** Server-like imagery with CPU indicators
- **Storage:** Database and file storage icons with capacity indicators
- **Networking:** Router/switch imagery with flow arrows
- **Security:** Shield iconography with lock elements
- **Operations:** Monitoring and tool-based imagery

**Visual States:**
- Normal: Clean, professional appearance
- Stressed: Orange highlights, subtle pulse animation
- Overloaded: Red highlights, shaking animation
- Failed: Gray-out with error iconography

---

## 8. User Interface

### 8.1 UI Flow

```
Main Menu
├── Single Player
│   ├── New Game (Character Creation → Level Selection)
│   ├── Continue Game (Level Selection)
│   └── Portfolio (Completed Designs)
├── Multiplayer
│   ├── Challenge Mode (Lobby → Matchmaking)
│   └── Collaborate Mode (Room Creation/Join)
├── Settings (Audio, Controls, Accessibility)
└── About (Credits, Help)

Single Player Session Flow
├── Meeting Phase UI
│   ├── Conference Room View
│   ├── Team Member Interaction (Pre-generated Questions)
│   ├── Question Selection Counter
│   └── Dialogue History Display
├── Mentor Selection UI
│   ├── Available Mentors Grid (3-4 options)
│   ├── Mentor Preview Cards (Specialization, Style, Sample Advice)
│   ├── Unlock Status Indicators
│   └── Selection Confirmation
├── Design Phase UI  
│   ├── Component Drawer (Categorized)
│   ├── React Flow Canvas with Animated Edges
│   ├── Requirements Panel
│   ├── Metrics Dashboard
│   ├── Selected Mentor Assistant Widget
│   └── Timer Display
├── Simulation Phase UI
│   ├── Live Metrics Dashboard
│   ├── Animated Edge Flow Visualization
│   ├── Component Stress Indicators
│   └── Performance Timeline
└── Review Phase UI
    ├── Team Feedback Display
    ├── Mentor Assessment
    ├── Performance Analysis
    ├── Achievement Notifications
    └── Next Level Preview

Multiplayer Session Flow
├── Lobby UI
│   ├── Player List with Readiness Status
│   ├── Game Settings (Time Limit, Scoring Criteria)
│   └── Chat System
├── Challenge Mode UI
│   ├── Individual Design Canvas (Same as Single Player)
│   ├── Competitor Progress Indicators
│   ├── Time Remaining Display
│   └── Score Comparison Dashboard
└── Collaborate Mode UI
    ├── Shared React Flow Canvas
    ├── Real-time Player Cursors
    ├── Component Ownership Indicators
    ├── Voice/Text Chat Integration
    ├── Consensus Building Tools
    └── Joint Performance Dashboard
```

### 8.2 HUD Design

**Meeting Phase HUD:**
- Team member portraits with available question indicators
- Question selection panel with multiple choice options
- Questions remaining counter (3/3 → 2/3 → 1/3 → 0/3)
- Dialogue text area with conversation history
- "Proceed to Mentor Selection" button (enabled after questions)

**Mentor Selection HUD:**
- Grid layout showing 3-4 available mentors
- Mentor preview cards with:
  - Portrait and name
  - Specialization area
  - Guidance style description
  - Sample advice quote
  - Unlock status (available/locked)
- "Select Mentor & Begin Design" confirmation button

**Design Phase HUD:**
- Timer display (countdown format: MM:SS) with urgency color coding
- Budget tracker (current cost vs. limit) with visual progress bar
- Requirements checklist (✓ met, ⚠ warning, ✗ unmet)
- Selected mentor assistant widget with contextual hints
- Component drawer toggle with category filters
- Canvas zoom controls and mini-map

**Data Flow Visualization:**
- **Edge Animations:** Smooth flowing particles along React Flow connections
- **Flow Direction:** Clear directional indicators showing request/response paths
- **Bandwidth Representation:** Line thickness varies with traffic volume
- **Congestion Indicators:** Color coding (green=healthy, orange=stressed, red=overloaded)
- **Performance Feedback:** Real-time flow speed reflects system response times

**Multiplayer-Specific Elements:**

**Challenge Mode HUD:**
- Competitor progress indicators (anonymous or named)
- Personal best comparison
- Time remaining with global synchronization
- Score preview with breakdown categories

**Collaborate Mode HUD:**
- Real-time player presence indicators
- Component placement permissions/ownership
- Shared chat panel (text + voice)
- Consensus voting tools for architectural decisions
- Joint performance metrics dashboard

### 8.3 Component Drawer Organization

**Level 1 Drawer (Simplified):**
```
📁 Frontend
  └ Web Interface

📁 Backend
  └ Compute Server

📁 Data  
  └ Storage Database
```

**Level 6 Drawer (Complete):**
```
📁 Compute
  ├ Web Server
  ├ App Server
  ├ Background Worker
  ├ Container Service
  └ Serverless Function

📁 Storage
  ├ SQL Database
  ├ NoSQL Database
  ├ File Storage
  ├ Cache
  ├ Search Engine
  └ Data Warehouse

📁 Networking
  ├ Load Balancer
  ├ CDN
  ├ API Gateway
  ├ Message Queue
  └ Service Mesh

📁 Security
  ├ Authentication
  ├ Firewall
  ├ SSL/TLS
  ├ Audit Logger
  └ Encryption Service

📁 Operations
  ├ Monitoring
  ├ Auto Scaler
  ├ Backup Service
  ├ CI/CD Pipeline
  └ Performance Profiler
```

### 8.4 React Flow Canvas Specifications

**Component Nodes:**
- Minimum size: 120x80px for readability
- Consistent icon + label layout
- Color-coded borders for status (green=healthy, orange=stressed, red=overloaded)
- Connection handles clearly marked
- Hover states show detailed information

**Connection Edges:**
- Animated flow to show data direction
- Thickness indicates bandwidth/capacity
- Color coding for different data types
- Smart routing to avoid overlaps
- Connection validation with visual feedback

**Canvas Controls:**
- Zoom range: 25% to 200%
- Pan boundaries to prevent components going off-screen
- Snap-to-grid for clean alignment
- Undo/redo support for design iterations
- Mini-map for large architectures

---

## 9. Audio Design

### 9.1 Music

**Musical Style:** Ambient electronic with subtle tech/corporate influences
**Adaptive Music System:**
- **Meeting Phase:** Collaborative, conversational background
- **Design Phase:** Focused, productive ambient with subtle urgency as timer runs down
- **Simulation Phase:** Dynamic intensity based on system performance
- **Review Phase:** Celebratory for success, reflective for learning moments

**Track Requirements:**
- 4-5 base tracks per game phase
- Seamless looping for extended design sessions
- Intensity variations based on game state
- Volume automation for dialogue clarity

### 9.2 Sound Effects

**UI Sounds:**
- Component placement: Satisfying "click" with tech flavor
- Connection creation: "snap" or "link" sound
- Invalid actions: Gentle "error" tone (not jarring)
- Button clicks: Clean, professional button sounds
- Achievement notifications: Positive chime

**Gameplay Sounds:**
- Packet flow: Subtle "whoosh" or data transmission sounds
- Component stress: Subtle warning beeps for overloaded systems
- System failure: Clear but not alarming error sounds
- Timer warnings: Gentle urgency sounds at 5 and 1 minute remaining
- Performance metrics: Subtle audio cues for improving/declining metrics

**Character Voices:**
- Text-to-speech for accessibility
- Distinctive voice characteristics for each team member
- Emotional inflection based on dialogue sentiment
- Configurable speech rate and voice selection

### 9.3 Implementation

**Audio Mixing:**
- Dialogue always takes priority
- Music automatically ducks during important feedback
- Sound effects balanced to not interfere with concentration
- Comprehensive audio settings (master, music, effects, voice volumes)

**Accessibility:**
- Visual indicators for all audio cues
- Subtitle support for all dialogue
- Sound replacement options for hearing-impaired users
- Audio description mode for key visual events

---

## 10. Technical Requirements

### 10.1 Engine and Tools

**Game Engine:** Phaser.js 3.70+
- **Reasoning:** Excellent web performance, mature ecosystem, strong community
- **Canvas/WebGL:** Automatic fallback for broader compatibility
- **Asset Management:** Built-in loading and caching systems

**UI Framework:** React 18+
- **Integration:** React Flow for canvas-based system design
- **State Management:** Redux Toolkit for complex game state
- **Component Library:** Custom components following design system

**Development Tools:**
- **Language:** TypeScript for type safety and maintainability
- **Build System:** Vite for fast development and optimized builds
- **Version Control:** Git with conventional commit standards
- **Testing:** Jest for unit tests, Playwright for end-to-end testing

### 10.2 Performance Targets

**Frame Rate:** Stable 60fps during simulation phases
**Load Time:** <3 seconds initial load, <1 second level transitions
**Memory Usage:** <512MB total (including browser overhead)
**Network:** <50MB initial download, <5MB per level asset package
**Simulation Performance:** Handle 100+ animated packets simultaneously

**Optimization Strategies:**
- Component pooling for packet animations
- Level-based asset loading
- Texture atlasing for UI elements
- Code splitting by level complexity

### 10.3 Browser Compatibility

**Minimum Browser Versions:**
- Chrome 90+ (Primary target - 95%+ market share)
- Firefox 88+ (WebGL and ES2020 support)
- Safari 14+ (Desktop only - no mobile Safari optimization)
- Edge 90+ (Chromium-based)

**Required Web Technologies:**
- ES2020 features (optional chaining, nullish coalescing)
- WebGL 1.0 for canvas rendering and edge animations
- Web Audio API for dynamic sound and feedback
- WebSocket support for real-time multiplayer
- LocalStorage for progress persistence
- Fetch API for asset loading

**Progressive Enhancement:**
- Canvas fallback for systems without WebGL
- Reduced animation complexity on lower-end devices
- Offline mode for completed single-player levels
- Keyboard navigation for full accessibility compliance

### 10.4 Backend Requirements

**Single Player Infrastructure:**
- Static hosting (Netlify/Vercel) for game assets and core application
- Serverless functions (Vercel Functions/Netlify Functions) for user data
- CDN for global asset delivery and performance optimization

**Multiplayer Infrastructure:**
- **Real-time Communication:** Socket.io server for live collaboration
- **Challenge Mode Backend:** 
  - Matchmaking service for skill-based pairing
  - Score comparison and leaderboard systems
  - Replay storage for learning from top solutions
- **Collaborate Mode Backend:**
  - Room management with unique identifiers
  - Real-time canvas state synchronization
  - Conflict resolution for simultaneous component placement
  - Chat and voice communication integration

**Data Management:**
- **User Authentication:** OAuth integration (Google, GitHub) for quick signup
- **Progress Tracking:** 
  - Level completion status and scoring history
  - Component mastery progress across all game modes
  - Achievement unlocks and portfolio of completed designs
  - Multiplayer statistics and ranking systems
- **Content Delivery:**
  - Scenario and component definitions (JSON-based)
  - Mentor character data and guidance systems
  - Pre-generated question banks for meeting phases

**Analytics Implementation:**
- Learning progression tracking across single and multiplayer modes
- Component usage patterns and architectural decision analytics
- Common failure points and optimization opportunities
- Multiplayer engagement metrics and collaboration effectiveness

**Technical Architecture:**
```
Frontend (Browser)
├── Phaser.js + React Flow
├── Socket.io Client (Multiplayer)
└── State Management (Redux)

Backend Services
├── Express.js + Socket.io Server
├── Authentication Service (OAuth)
├── Real-time Game State Management
├── Matchmaking & Scoring Service
└── Analytics Collection

Database Layer
├── User Profiles & Progress (PostgreSQL)
├── Game Sessions & Scores (PostgreSQL) 
├── Real-time State Cache (Redis)
└── Analytics Data (Time-series DB)
```

---

## 11. Project Timeline

### 11.1 Development Phases

**Phase 1: MVP Foundation (Week 1)**
- Level 1 meeting system (basic dialogue)
- 3-component design canvas
- Simple packet animation
- Basic victory conditions

**Phase 2: Core Gameplay (Weeks 2-4)**
- Complete meeting system with all team members
- Enhanced React Flow integration
- AI helper system
- Levels 1-2 complete with scenarios

**Phase 3: Content Expansion (Weeks 5-8)**
- Levels 3-4 implementation
- Advanced component library
- Performance optimization
- Achievement system

**Phase 4: Advanced Features (Weeks 9-12)**
- Levels 5-6 completion
- Emergency response system
- Portfolio and progress tracking
- Comprehensive testing

**Phase 5: Polish & Launch (Weeks 13-16)**
- Art and audio implementation
- Accessibility compliance
- Performance optimization
- Beta testing and feedback integration

### 11.2 Milestone Schedule

**Week 1: MVP Demo**
- Playable Level 1 scenario
- Basic meeting → design → simulation flow
- Core technical architecture validated

**Week 4: Alpha Build**
- Levels 1-2 content complete
- AI helper functional
- Basic analytics implemented

**Week 8: Beta Build**
- Levels 1-4 complete
- Full art integration
- User testing feedback incorporated

**Week 12: Release Candidate**
- All 6 levels complete
- Performance optimized
- Accessibility certified

**Week 16: Launch Ready**
- Bug fixes complete
- Marketing assets prepared
- Launch infrastructure tested

### 11.3 Risk Assessment

**Technical Risks:**
- **React Flow Performance:** Mitigation: Component pooling and virtualization
- **Cross-Browser Compatibility:** Mitigation: Progressive enhancement strategy
- **Simulation Complexity:** Mitigation: Simplified physics with visual appeal

**Design Risks:**
- **Learning Curve Too Steep:** Mitigation: Extensive playtesting with target audience
- **Content Scaling:** Mitigation: Modular scenario system for rapid content creation
- **Engagement Retention:** Mitigation: Achievement system and portfolio features

**Schedule Risks:**
- **Scope Creep:** Mitigation: Strict MVP definition and feature prioritization
- **Technical Debt:** Mitigation: TypeScript usage and testing requirements
- **Content Creation:** Mitigation: Template-based scenario system

---

## 12. Appendices

### 12.1 Competitive Analysis

**Direct Competitors:**
- **Codecademy System Design Course:** Text-based learning, lacks interactivity
- **Educative System Design Interview Prep:** Static diagrams, no simulation
- **LeetCode System Design:** Interview-focused, limited practical application

**Indirect Competitors:**
- **Two Point Hospital:** Similar tycoon mechanics, different domain
- **SimCity:** City building with flow simulation
- **Factorio:** Complex system optimization gameplay

**Differentiation:**
- Only game combining realistic stakeholder interaction with technical system design
- Real-time visual feedback through packet animation
- Progressive complexity matching real career development
- Educational focus with immediate practical application

### 12.2 Technical Architecture Diagram

```
Frontend (Browser)
├── Phaser.js Game Engine
│   ├── Meeting Phase Scene
│   ├── Design Phase Scene
│   └── Simulation Phase Scene
├── React UI Framework
│   ├── React Flow Canvas
│   ├── Component Drawer
│   └── Metrics Dashboard
└── State Management (Redux)
    ├── Game State
    ├── User Progress
    └── Component Library

Backend (Serverless)
├── Authentication Service
├── Progress Tracking API
├── Content Management
└── Analytics Collection

Content Pipeline
├── Scenario Definitions (JSON)
├── Component Library (TypeScript)
├── Art Assets (Optimized)
└── Audio Assets (Compressed)
```

### 12.3 Sample Meeting Dialogue Script

**Level 2.1: "Viral Blog Post" Scenario**

```
FADE IN: Conference room, same team as Level 1

SARAH
Remember that blog platform we built? Well, one of 
our posts just went viral on social media. We're 
getting 10x our normal traffic!

ALEX
This is exactly what we hoped for, but our current 
system is struggling. Pages are loading really slowly.

JORDAN
The traffic spike started an hour ago, and it's not 
slowing down. If anything, it's accelerating.

TAYLOR
Our server is maxed out, and I'm getting alerts 
about database connection timeouts.

[QUESTION PROMPT: Player can ask up to 3 questions]

AVAILABLE QUESTIONS:
To Sarah: "How long do we expect this traffic to last?"
To Alex: "What's our emergency budget for scaling?"
To Jordan: "Are we getting new users or just traffic?"
To Taylor: "What's failing first in our current system?"

[After questions]

SARAH
We need a solution that can handle this traffic 
without breaking our budget. Can you redesign 
our system to scale better?

FADE TO: Design canvas with updated requirements
```

### 12.4 Sample Meeting Interaction System

**Level 1.1: "Personal Blog Platform" - Pre-Generated Questions**

```
Meeting Setup:
PETRA MANAGER: "We want to build a simple blog where users can write and share posts."
ALEX EXECUTIVE: "Think Medium, but more focused on personal storytelling."
MARK ETHAN: "We're targeting about 1,000 daily visitors to start."
DEVIN OPS: "Keep costs low - this is a side project for now."

Question Selection Interface:
[Player can select 3 questions from the available options below]

Questions for Petra Manager (Product):
○ "What features do users need most?"
   → "Basic text editing, image uploads, and simple commenting. Keep it minimal."
   → IMPACT: Adds text_editor, image_upload, comments to requirements

○ "How do users discover content?"
   → "Just a homepage with recent posts and basic search functionality."
   → IMPACT: Adds search_basic, content_discovery to requirements

○ "What's the target audience demographics?"
   → "Millennials and Gen-Z who want authentic, long-form content sharing."
   → IMPACT: Sets performance expectations, mobile-friendly design needs

Questions for Alex Executive (Business):
○ "What's our budget limit?"
   → "Let's keep it under $200 per month for now. We can scale up if it takes off."
   → IMPACT: Sets budget constraint to $200/month

○ "When do we need to launch?"
   → "We want to get this out in 3 months. Nothing too complex for the first version."
   → IMPACT: Adds timeline pressure, complexity constraints

○ "What's the long-term vision?"
   → "If successful, we'd want to add monetization and premium features."
   → IMPACT: Adds future scalability considerations

Questions for Mark Ethan (Marketing):
○ "How fast do you expect growth?"
   → "If it goes viral, maybe 10,000 users in the first month. We should be prepared."
   → IMPACT: Adds viral_growth_potential to requirements (10x traffic spike)

○ "What regions are we targeting?"
   → "Just English-speaking users for now - US, UK, Canada, Australia."
   → IMPACT: Sets geographic scope, CDN considerations

○ "How will users find our platform?"
   → "Social media sharing, word of mouth, and SEO for now."
   → IMPACT: Adds social_sharing, SEO_optimization requirements

Questions for Devin Ops (Technical):
○ "Any specific performance requirements?"
   → "Users expect pages to load in under 3 seconds. Anything slower and they'll bounce."
   → IMPACT: Sets max_response_time: 3000ms requirement

○ "Do we need any special infrastructure considerations?"
   → "Keep it simple - we don't have a dedicated ops team yet. Prefer managed services."
   → IMPACT: Adds managed_services_preferred constraint

○ "What about monitoring and alerts?"
   → "Basic uptime monitoring should be enough to start. We'll grow into more later."
   → IMPACT: Adds basic_monitoring requirement, defers advanced observability

Example Question Selection Result:
If player selects:
1. "What's our budget limit?" (Alex)
2. "How fast do you expect growth?" (Mark)  
3. "Any specific performance requirements?" (Devin)

Final Requirements Generated:
✓ Handle 1,000 daily users (peak: 100 concurrent)
✓ Support text posts with images and comments
✓ Budget constraint: $200/month
✓ Performance target: <3 second page loads
✓ Prepare for viral growth (10x traffic spike potential)
✓ Prefer managed services for simplicity
```

**Question Selection UI Design:**
- **Character Selection:** Click team member portrait to see their available questions
- **Question Preview:** Hover over question to see preview of answer impact
- **Selection Counter:** Visual indicator showing 3/3 → 2/3 → 1/3 → 0/3 remaining
- **Question Categories:** Color-coded by type (Product=Blue, Business=Green, Marketing=Orange, Technical=Purple)
- **Impact Preview:** Small icons showing what each question adds/modifies in requirements

### 12.5 Component Library Reference

**Level 1 Components:**
```javascript
const LEVEL_1_COMPONENTS = {
  web_interface: {
    name: "Web Interface",
    cost: 50,
    capacity: 1000,
    description: "Serves user interface to browsers",
    connections: ["compute_server"],
    category: "frontend"
  },
  compute_server: {
    name: "Compute Server", 
    cost: 100,
    capacity: 500,
    description: "Processes business logic and API requests",
    connections: ["web_interface", "storage_database"],
    category: "backend"
  },
  storage_database: {
    name: "Storage Database",
    cost: 75, 
    capacity: 2000,
    description: "Stores application data persistently",
    connections: ["compute_server"],
    category: "data"
  }
};
```

**Multiplayer Mode Specifications:**

**Challenge Mode Configuration:**
```javascript
const CHALLENGE_MODE_CONFIG = {
  timeLimit: 900, // 15 minutes
  maxPlayers: 8,
  scoringCriteria: {
    requirements_met: 40,
    performance_score: 30,
    cost_efficiency: 20,
    architectural_quality: 10
  },
  matchmaking: {
    skill_based: true,
    level_range: 2 // Can match players within 2 levels
  }
};
```

**Collaborate Mode Configuration:**
```javascript
const COLLABORATE_MODE_CONFIG = {
  timeLimit: 1800, // 30 minutes
  maxPlayers: 4,
  realTimeSync: {
    cursorPosition: true,
    componentPlacement: true,
    connectionDrawing: true,
    chatMessages: true
  },
  conflictResolution: {
    componentPlacement: "last_wins",
    connectionDrawing: "merge_compatible",
    componentDeletion: "require_consensus"
  }
};
```

### 12.6 Learning Outcomes Assessment

**Level 1 Assessment Questions:**
1. "What happens if your compute server becomes overloaded?"
   - A) Users see faster response times
   - B) The database fails
   - C) **Response times increase and some requests fail**
   - D) The web interface stops working

2. "Why does data need to flow through the compute server?"
   - A) It's cheaper than direct connections
   - B) **Business logic and security happen here**
   - C) The database can't talk to web interfaces
   - D) It makes the system more complex

3. "How would you handle 10x more users with the current architecture?"
   - A) **Add more compute servers with a load balancer**
   - B) Replace the database with a bigger one
   - C) Add more web interfaces
   - D) Tell users to wait

**Scoring:** 80%+ required to unlock Level 2

**Multiplayer Learning Assessment:**
- **Challenge Mode:** Compare solution approaches with other players
- **Collaborate Mode:** Evaluate team communication and consensus-building skills
- **Cross-Mode Analytics:** Track learning progression across both single and multiplayer experiences

---

*This Game Design Document is a living document that will be updated throughout development to reflect design decisions, player feedback, and technical discoveries.*

**Document Version:** 1.0  
**Last Updated:** July 14, 2025  
**Next Review:** Weekly during development  
**Owner:** Game Design Team