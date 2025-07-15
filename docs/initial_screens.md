Detailed Screen Display Requirements
1. Landing Page
Display Elements:

Hero section with animated system architecture visualization
Main tagline and subtitle
"Start Your Journey" CTA button
Value proposition cards (4 cards)
Social proof section with usage stats
Demo video/screenshots section
Navigation to sign-in/sign-up

Database Requirements: None
Empty States: N/A

2. User Sign-in/Sign-up
Display Elements:

OAuth provider buttons (Google, GitHub, LinkedIn)
Email/password form as fallback
"Remember me" checkbox
"Forgot password" link
Value proposition reminders
Terms of service and privacy policy links

Database Requirements:

Creates new entries in profiles and user_stats tables on signup via trigger

Empty States: N/A

3. Career Map Screen (Phaser.js)
Display Elements:
Background Layer:

Tech-themed subtle pattern background
Winding path connecting scenario nodes

HUD Elements (React Overlay):

User reputation points (from profiles.reputation_points)
Career title (from profiles.career_title)
Level indicator (from profiles.current_level)
Settings/menu button

Scenario Nodes:
For each scenario from scenarios table:

Locked nodes (status = 'locked' or no progress record):

Grayed out circular node
Question mark icon
No title visible
Not clickable


Available nodes (status = 'available' or first scenario):

Colored circular node with glow effect
Visible scenario title
Client name subtitle
Pulsing animation
Clickable with hover effect


Completed nodes (status = 'completed'):

Green circular node
Checkmark icon
Best score percentage (from scenario_progress.best_score)
Scenario title
Client name
Clickable to replay



First-Time User Elements:

Narrative overlay with typewriter text
Chat notification from Sarah sliding in from bottom-right
Tutorial hints pointing to first scenario

Empty States:

If user_stats.total_projects_completed = 0:

Show narrative introduction
Trigger Sarah's chat notification
Highlight first scenario node



Data Required:
- profiles: current_level, reputation_points, career_title
- user_stats: total_projects_completed
- scenarios: all fields
- scenario_progress: status, best_score, completed_at for each scenario

4. Meeting Room Screen (Phaser.js)
Display Elements:
Environment:

Coffee shop background (Level 1)
Conference room background (Higher levels)
Animated character sprites for NPCs
Player hands/coffee cup at bottom of screen
Laptop showing current website

Dialogue System:

Speaker name badge
Dialogue text box with typewriter effect
Character portrait next to dialogue

Question Selection Interface:

Questions remaining counter (3/3 → 2/3 → 1/3)
Character selection buttons:

Petra Manager (Product)
Alex Executive (Business)
Mark Ethan (Marketing)
Devin Ops (Technical)
Security Stan (Levels 4+ only)


Question list for selected character
Question preview showing impact

Requirements Tracker:

Live updating requirements list
Visual indicators for new requirements added
Budget constraint display
Timeline display

Data Required:
- scenarios.available_questions: structured JSON with questions per character
- scenarios.base_requirements: initial requirements
- scenarios.budget_limit: budget constraint
- scenario_attempts: create new record, track questions_asked
Empty States:

Always has questions available from scenario data


5. Mentor Selection Screen (Phaser.js)
Display Elements:
Screen Layout:

Dark overlay background
"Choose Your Mentor" title
3-4 mentor cards in horizontal layout

Each Mentor Card Shows:

Mentor portrait/avatar
Name and title
Specialization badge (color-coded)
Best for: level range/scenario type
Signature advice quote
Hover state with glow effect
Lock icon if not yet unlocked

Selection Feedback:

Selected card highlight animation
"Confirm Selection" button
Brief description of mentor's guidance style

Data Required:
- scenarios.available_mentors: array of mentor IDs
- profiles.preferred_mentor_id: user's previous selection
- Static mentor data (from constants or mentor table)
Empty States:

Always shows 3-4 mentors defined in scenario


6. System Design Canvas (React Flow)
Display Elements:
Top Bar (HUD):

Timer countdown (from scenarios.time_limit_seconds)
Budget used/limit bar (calculate from components vs scenarios.budget_limit)
Requirements checklist (from meeting phase + scenarios.base_requirements)
"Submit Design" button

Left Sidebar - Component Drawer:
Organized by category from components table:

Each component shows:

Icon (from components.icon_url)
Name
Cost per month
Capacity/performance stats
Mastery level indicator (novice/bronze/silver/gold)
"NEW" badge if never used
Locked overlay if level requirement not met



Main Canvas (React Flow):

Grid background
Dropped components as nodes
Connection lines between components
Real-time data flow preview (subtle animation)
Invalid connection indicators

Right Sidebar - Mentor Assistant:

Selected mentor portrait
Contextual hints based on current design
Suggestions for missing components
Performance predictions
Best practices reminders

Component States on Canvas:

Normal: standard appearance
Selected: highlight border
Invalid placement: red outline
Over capacity: orange warning

Data Required:
- components: all fields filtered by min_level <= user level
- component_mastery: mastery_level, times_used for each component
- scenarios: budget_limit, time_limit_seconds
- Current architecture state (local)
Empty States:

Empty canvas: "Drag components from the left to start building!"
No components unlocked: Error state (shouldn't happen)


7. System Simulation Screen (Phaser.js)
Display Elements:
Same Canvas Layout with Animations:

Components from design phase now active
Animated data packets flowing between components
Particle effects along connection lines
Traffic intensity visualization

Component Visual States:

Idle: gentle breathing animation
Active: processing animation
Stressed: faster animation, orange tint
Overloaded: shaking, red tint
Failed: grayed out with error icon

Live Metrics Dashboard:

Requests per second gauge
Average response time (ms)
Error rate percentage
System uptime percentage
Current cost per month
Capacity utilization bars per component

Client Reactions (Top of screen):

Sarah's avatar with speech bubbles
Real-time comments based on performance
Satisfaction meter filling up

Traffic Simulation Phases:

Normal traffic (baseline)
Peak hours (2x traffic)
Viral spike (10x traffic)
Recovery phase

Data to Save:
- scenario_attempts: 
  - architecture_snapshot
  - components_used
  - total_cost
  - performance_metrics
  - final_score
  - requirements_met
Empty States: N/A - runs on submitted design

8. Results & Feedback Modal
Display Elements:
Results Summary:

Total score (out of 100)
Star rating (1-5 stars)
Score breakdown:

Requirements Met: X/40
Performance: X/30
Cost Efficiency: X/20
Architecture Quality: X/10



Client Feedback Section:

Client avatar
Testimonial text based on score
Specific callouts (good/bad)
Money saved calculation

Achievements & Unlocks:

New achievements earned (with icons)
Components unlocked preview
Next scenario teaser
Reputation points gained

Learning Summary:

What went well
Areas for improvement
Mentor's assessment
Recommended reading/practice

Action Buttons:

"Save to Portfolio"
"Try Again"
"Next Scenario"
"Return to Map"

Data Updates:
- scenario_progress: update/create with best scores
- user_stats: increment counters
- component_mastery: update usage stats
- achievements: check and award new ones
- profiles: update reputation_points, current_level
- design_portfolio: optional save
Empty States:

First completion: Special celebration animation
Perfect score: Special "Master Architect" animation


9. Career Map Return (Updated State)
Display Changes:

Completed scenario now shows green with checkmark
Score displayed on completed node
New scenario node(s) unlocked and glowing
Updated reputation in HUD
New chat notification if available
Path extended to newly unlocked nodes
Achievement toast notifications

Referral System:

New chat message from referrer
Preview of next client's problem
Excitement building for next challenge

Data Required:
- All career map data (refreshed)
- New unlocked scenarios
- Updated progress for all scenarios
- Check for new messages/referrals

Global UI Elements (Across All Screens)
Persistent HUD Elements:

User avatar/profile button
Settings gear icon
Help/tutorial button
Current level/reputation display

Loading States:

Spinner with contextual message
Progress bar for longer operations
Cancel option where appropriate

Error States:

User-friendly error messages
Retry options
Fallback to safe state

Empty States by Category:

No data: Friendly message with action to create
Loading: Skeleton screens or spinners
Error: Clear message with recovery action
First time: Tutorial or onboarding flow

Accessibility Features:

Screen reader descriptions
Keyboard navigation indicators
High contrast mode toggle
Subtitle options for audio