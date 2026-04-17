# Service as a Software — Hype Video Storyboard (v2)

## Core Thesis
People are out there trying to change the world — doctors tracking patients, teachers managing schools, activists fighting contamination. They're doing the hard part. But they're limited by systems that crash, data that disappears, and technology that can't keep up. **System design is the skill that scales the good in the world.** This app is where you learn it — by actually helping.

## Narrative Arc
**Empathy** → **The Limit** → **The Bridge** → **The Work** → **The Proof** → **The Invitation**

---

## Beat 1 — THE PEOPLE (0:00 – 0:08)
**Duration:** 8s | **Emotion:** warmth, admiration

**Visual:**
- Dark screen (#0B1426). 1.5s pause.
- Three lines type themselves sequentially, each with a subtle icon appearing to the left:

  🩺 `"A doctor tracking symptoms for 200 families."`   (2s typing, 0.5s pause)
  📚 `"A teacher keeping a school district running."`    (2s typing, 0.5s pause)
  🌱 `"An activist proving contamination is real."`      (2s typing, holds)

- Each line fades from white to 60% opacity as the next begins, keeping focus on the current one.
- After all three, they hold together for 1s — three quiet acts of courage on screen.

**Motion:** Typing at 40ms/char. Icons fade in 200ms before text starts. Previous lines dim to rgba(255,255,255,0.4).
**Typography:** Inter 500, 36px, centered vertically, left-aligned as a group.
**Color:** White text on #0B1426. Icons slightly tinted blue.

---

## Beat 2 — THE LIMIT (0:08 – 0:15)
**Duration:** 7s | **Emotion:** frustration, urgency

**Visual:**
- The three lines from Beat 1 shatter/glitch — a quick distortion effect (2 frames of offset, red-shift, then recovery).
- They fade, replaced by a new sequence:

  `"But the database crashes every few hours."` (types in red-tinted text)
  `"Critical data — lost."` (appears with a hard cut, no typing, bold)
  `"The system can't keep up."` (fades in, then the whole screen pulses dark)

- Transition: screen goes to near-black, then a single line emerges:

  `"They're doing the hard part."`
  `"They just need the system to hold."`

  These two lines appear centered, white, calm — a moment of clarity after chaos.

**Motion:**
- Glitch: CSS transform skew + hue-rotate for 100ms, twice
- Red text: #EF4444, types at 25ms/char (faster = more urgent)
- "Critical data — lost.": scale 1.2→1.0 hard cut, 200ms
- Final lines: fade in 600ms, centered, generous spacing

**Typography:**
- Crisis text: Inter 600, 32px, #EF4444
- "Critical data — lost.": Inter 700, 44px, white
- Final reflection: Inter 400, 28px, #CBD5E1

---

## Beat 3 — THE BRIDGE (0:15 – 0:21)
**Duration:** 6s | **Emotion:** possibility, quiet confidence

**Visual:**
- Clean transition: screen is dark.
- A simple diagram draws itself, line by line:

  `[People]` ——→ `[System]` ——→ `[Impact]`

  Left node: person icon, warm yellow border
  Center node: server icon, blue border
  Right node: heart/globe icon, green border

  Edges draw themselves with animated stroke, left to right.

- Below the diagram, text fades in:

  `"System design is the skill that scales the good."`

  Inter 600, 36px, white. Centered.

- The diagram nodes pulse once with their accent color — a heartbeat of potential.

**Motion:**
- Node entrance: scale 0→1 with spring, staggered 500ms
- Edge draw: stroke-dasharray animation, 800ms each
- Text fade: 600ms ease-in
- Pulse: box-shadow glow expand 0→8px→0, 400ms, once

**Color:**
- People node: var(--color-yellow-500) border
- System node: var(--color-blue-600) border
- Impact node: var(--color-green-500) border

---

## Beat 4 — THE WORK (0:21 – 0:32)
**Duration:** 11s | **Emotion:** craftsmanship, focus, flow

**Visual:**
Full-screen system design canvas. This is the product in action.

- 0.0s: "Families" user node already placed (top-left, yellow border, person icon)
- 0.5s: cursor drags "Web Server" from left side onto canvas — snaps into place with elastic bounce
- 2.0s: cursor drags "Database" — snaps center-right
- 3.0s: Edge draws from Families → Web Server (green animated pulse along path)
- 4.0s: Edge draws from Web Server → Database
- 5.0s: Requirements panel slides in from right:
    ✅ "Separate server from database" — checks with green flash
    ✅ "Connect families to server" — checks
    ✅ "Protect the data" — checks
- 7.0s: All three requirements glow. Brief celebration (subtle particle burst).
- 8.0s: Mentor chat slides up:
    `"The families can reach the server now. The data is safe."`
- 10.0s: Chat fades. Nodes pulse with warm success glow.

**Same visual spec as v1 storyboard Beat 4 — the canvas centerpiece.**

---

## Beat 5 — THE PROOF (0:32 – 0:38)
**Duration:** 6s | **Emotion:** pride, warmth, payoff

**Visual:**
- Canvas shrinks to left 35%.
- Right side: impact metrics count up from zero:

  `200+` families still being helped
  `99.9%` uptime — the system holds
  `15,000+` health records — safe

- Each metric has a colored icon (green, blue, violet).
- Below: a news card morphs from "CRISIS" (red) to "RESOLVED" (green) — the same card from Beat 2, transformed.
- Subtle particles drift upward — visual metaphor for rising hope.

**The message: your system design work had real consequences.**

---

## Beat 6 — THE INVITATION (0:38 – 0:42)
**Duration:** 4s | **Emotion:** quiet invitation, not a hard sell

**Visual:**
- Fade to dark.
- No logo first. Instead, text:

  `"Learn system design."`    (fades in, Inter 500, 28px, #CBD5E1)
  `"Scale the good."`          (fades in below, Inter 700, 44px, white)

  Hold 1.5s.

- Then: `saas.game` appears below in blue (Inter 400, 24px, #3B82F6) with subtle underline draw.
- No "Start your first mission" — the video has already shown what that means.
- Ambient pad resolves.

---

## Audio Design

**Underscore:** Warm, hopeful ambient. Not cinematic — intimate. Think: a quiet room where someone is building something that matters. Gentle pad, no drums. Swell during Beat 4 (the work). Near-silence during Beat 5 metrics. Resolve on final chord.

**SFX:**
- Beat 1: Soft typing clicks, warm
- Beat 2: Glitch buzz (brief), error tone, silence
- Beat 3: Gentle "connection" sounds as edges draw
- Beat 4: Component snap, edge link, check tick, mentor bloop
- Beat 5: Counter tick settling, success chime
- Beat 6: Nothing. Just the music resolving.

---

## Why this narrative works

1. **Leads with empathy, not product.** The viewer meets real people doing real work before seeing any UI.
2. **Creates a gap.** "They're doing the hard part. The system can't keep up." This makes the viewer want to help.
3. **Positions system design as leverage.** Not as a career skill or a game — as a way to amplify good.
4. **Shows, doesn't tell.** Beat 4 proves the claim by showing the actual work.
5. **Ends quietly.** "Scale the good." — an invitation, not a CTA button.
