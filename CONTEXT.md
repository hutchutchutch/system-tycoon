# Service as a Software — Domain Context

**App name:** Service as a Software  
**Domain:** saas.game  
**Repo directory:** system-tycoon (legacy name, ignore)

---

## Glossary

### Client
The fictional person being helped by the User. Clients appear in the News Feed with a real-world problem (e.g., Dr. Sarah Chen whose patient tracker crashes). The User, acting as a tech consultant, is hired by the Client to solve that problem.

- Not called "Hero" (that's marketing copy in news headlines, not a domain term)
- Not called "User" (that refers to the human playing the game)
- A Client has a name, organization, category (healthcare, environment, etc.), urgency level, technical problem, and business constraints (budget, timeline, compliance)

### Connection
A line drawn between two Resources on the Whiteboard, representing data flow or a dependency between them. Connections are the second type of Step a User must complete to satisfy a Stage.

- Not called "Edge" (React Flow's internal term — implementation detail, not domain language)
- Not called "Link" (too generic)
- A Connection has a source Resource and a target Resource

### Email
The in-game section where the User receives messages from Clients. Presented as a browser tab alongside the Internet. Clients use Email to kick off Missions, deliver Stage briefs, and follow up on progress.

- The User "checks their Email" to see Client messages
- Contains the Inbox as its default view

### Impact
The progression currency the User earns by completing Missions. Impact represents the real-world difference the User has made by helping Clients scale their own work. Higher Impact unlocks more complex Missions and new Resources on the Whiteboard.

- Not called "Reputation" (too self-focused), "XP" or "Experience" (gamey, breaks the service framing)
- Earning Impact = helping a Client succeed, not personal achievement
- The number shown on a Mission card (e.g., "300 patients helped") is a preview of the Impact at stake

### Inbox
The default view inside the Email section. Where incoming Client messages appear.

- Lives inside the Email section
- Not called "Messages" or "Notifications"

### Internet
The in-game section where the User browses to discover Clients in crisis. Presented as a browser tab in the game's navigation. Currently shows the News Feed, but may expand to other in-game "websites" over time.

- The User "checks the Internet" to find new Clients
- Not called "News Feed" (that's the content *inside* the Internet section)
- Not called "Mission Board" or "Job Board" (breaks the immersive browser metaphor)

### Mentor
A character inside the game world who guides the User through Missions. The Mentor is a famous tech figure (e.g., Jeff Dean, Linus Torvalds) chosen by the User at the start. They help the User understand what Steps are required to complete a Stage, what Resources are needed and what they do, and provide general assistance throughout.

- Exists inside the game world (not a meta-layer AI assistant breaking the fiction)
- Educational in purpose — teaches system design concepts through in-world dialogue
- The User selects one Mentor at the start; that Mentor accompanies them through Missions
- Not called "Guide," "Tutor," or "Coach"

### Mission
The top-level unit of play. One complete arc: a Client has a problem, the User designs a system to solve it, and the result is evaluated. A Mission has a title, description, and one or more Stages.

- Not called "Scenario" (legacy term, still present in older routes and gameSlice — treat as technical debt)
- A Mission belongs to one Client
- Completing a Mission earns the User Impact

### News Feed
The content shown inside the Internet section. A grid of news stories about community members facing technical crises. The User reads the News Feed to discover Clients and choose which Missions to take on.

- Lives inside the Internet section
- Not called "Quest Log" or "Mission List"
- Each card in the News Feed represents a Client and the Impact at stake

### Resource
A draggable building block on the Whiteboard representing a piece of infrastructure (e.g., Web Server, Database, Load Balancer, Cache). Users place Resources on the Whiteboard to design systems.

- Not called "Component" (overloaded — that's a React UI term in this codebase)
- Not called "Node" (React Flow's internal term — implementation detail, not domain language)
- Not called "Service" (reserved for the app's brand: "Service as a Software," acts of service)
- A Resource has an id, name, and category (e.g., compute, database, networking)

### Results
The outcome shown to the User after a Simulation completes. Displays the Impact earned, how the design performed, and whether the Stage is passed. If all Stages are passed, the Mission is complete.

- Shown after Simulation, not directly after Whiteboard completion
- Includes Impact earned for the Mission

### Simulation
The phase after the User completes all Steps in a Stage. The User's design is animated — traffic flows through the Resources and Connections on the Whiteboard — showing the system under load. The Simulation plays out before Results are shown.

- Follows Whiteboard completion, precedes Results
- Makes the design "come to life" — the User sees their system actually working
- Not called "Test" or "Validation run"

### Stage
A sub-unit of a Mission. Each Stage presents a specific, escalating problem the User must solve by building a system on the Whiteboard. A Stage is complete when all its Steps are satisfied.

- Has a `stage_number` (determines order within the Mission)
- Not called "Step" or "Phase"

### Step
A sub-unit of a Stage. A Step is a checklist item that must be satisfied on the Whiteboard for the Stage to pass. Steps are not chronological — all Steps must be satisfied simultaneously for the Stage to be complete.

A Step is one of two things:
1. **Placement** — a specific Resource must be placed on the Whiteboard
2. **Connection** — two specific Resources must be connected on the Whiteboard

- Steps are not ordered; they form an unordered checklist
- Not called "Requirement" (that's an implementation detail in the validation code, not a domain term)
- Not the same as the old `MissionStep` type (legacy, treat as technical debt)

### User
The human playing the game. The User browses the News Feed, receives emails from Clients, completes Missions on the Whiteboard, and is guided by their Mentor.

- Not called "Player" (game jargon), "Consultant" (too narrow), or "Customer" (that's a billing term)
- The User earns Impact and unlocks new Resources and Missions over time

### Whiteboard
The interactive workspace where the User designs systems by placing Resources and drawing Connections between them. The User opens the Whiteboard to complete a Stage.

- Not called "Canvas" (used in legacy code — treat as technical debt)
- Not called "Design Board"
- The name is intentional: mirrors the "whiteboard interview" format used in real system design interviews
- The Whiteboard holds Resources and Connections; its state is validated against a Stage's Steps to determine completion

---

## Intentionally removed concepts

### Collaboration (removed)
Multi-user real-time co-editing of the Whiteboard was explored but is not part of the product. Any remaining `collaborationSlice`, `CollaborationPanel`, `InviteCollaboratorModal`, `realtimeCollaboration`, or `CursorManager` code is dead — remove it on sight. See `docs/adr/0001-remove-realtime-collaboration.md`.
