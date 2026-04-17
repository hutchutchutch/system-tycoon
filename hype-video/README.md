# saas.game — Hype Video

A 42-second product video built with [Hyperframes](https://github.com/heygen-com/hyperframes-launch-video) — code-first video production using HTML, CSS, and GSAP.

## Narrative

The video tells the story of people doing good in the world who are limited by technology that can't scale. System design is the skill that bridges the gap.

```
Beat 1 — THE PEOPLE (0:00–0:08)
  A doctor. A teacher. An activist. Three quiet acts of courage.

Beat 2 — THE LIMIT (0:08–0:15)
  The database crashes. Data is lost. The system can't keep up.
  "They're doing the hard part. They just need the system to hold."

Beat 3 — THE BRIDGE (0:15–0:21)
  [People] → [System] → [Impact]
  "System design is the skill that scales the good."

Beat 4 — THE WORK (0:21–0:32)
  Full-screen system design canvas. Nodes, edges, requirements,
  mentor guidance. The product in action.

Beat 5 — THE PROOF (0:32–0:38)
  200+ families helped. 99.9% uptime. 15,000+ records safe.
  Crisis Resolved.

Beat 6 — THE INVITATION (0:38–0:42)
  "Learn system design. Scale the good."
  saas.game
```

## Setup

Requires Node.js ≥ 22 and FFmpeg.

```bash
cd hype-video

# Preview in browser studio
npx hyperframes preview
# → opens http://localhost:3002

# Render to MP4
npx hyperframes render
# → outputs to ./renders/
```

## Structure

```
index.html                          Root timeline (42s, 1920×1080, 30fps)
meta.json                           Duration, resolution, fps
STORYBOARD.md                       Full visual direction for each beat
SCRIPT.md                           On-screen text

compositions/
├── 01-hook/index.html              Three typing lines — doctor, teacher, activist
├── 02-stories/index.html           Crisis text, glitch, reflection
├── 03-architect/index.html         People → System → Impact diagram
├── 04-canvas/index.html            System design canvas (centerpiece, 11s)
├── 05-impact/index.html            Counter metrics + Crisis Resolved badge
└── 06-cta/index.html               "Learn system design. Scale the good."

assets/
├── audio/                          Drop ambient music here (.mp3)
├── screenshots/                    App screen captures
└── sfx/                            UI sound effects
```

## How it works

Each composition is a self-contained HTML file with:
- Embedded CSS for layout and styling
- GSAP for animation (loaded from CDN)
- A registered `window.__timelines[compositionId]` for Hyperframes playback control

The root `index.html` orchestrates all compositions via `data-composition-src` with `data-start` and `data-duration` timing attributes.

## Customization

### Change the story
Edit `STORYBOARD.md` for direction, then update the corresponding `compositions/` HTML files.

### Add music
Drop an MP3 into `assets/audio/` and add to the root `index.html`:
```html
<audio data-start="0" data-duration="42" src="assets/audio/underscore.mp3"></audio>
```

### Add voiceover
Generate with ElevenLabs, Eleven, or similar. Drop the MP3 and add:
```html
<audio data-start="0" data-duration="42" src="assets/audio/vo.mp3"></audio>
```

### Add SFX
Per-beat sound effects go in individual compositions:
```html
<audio data-start="1.5" src="../../assets/sfx/typing.mp3"></audio>
```

### Add real app screenshots
Capture screens from saas.game, place in `assets/screenshots/`, and reference in compositions as `<img>` elements with GSAP-animated entrances.

## Rendering

```bash
# Draft quality (fast, for iteration)
npx hyperframes render --quality draft

# Production quality
npx hyperframes render

# Output
ls renders/
# → master.mp4
```

Requires FFmpeg: `brew install ffmpeg`
