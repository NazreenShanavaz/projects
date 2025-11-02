# Pomodoro Timer (Two-Page Smart Study Planner)

A dark, glowing Pomodoro timer with a purple-blue gradient ring. Plan total study hours and choose between 25-5 or 50-10 modes. The timer auto-cycles focus/break, plays a bell at focus end, and celebrates with confetti when you finish your plan.

## Features
- Smart setup page to choose study hours and mode
- Two modes: 25 min focus + 5 min break or 50 min focus + 10 min break
- Auto-switch between Focus and Break with labels
- Glowing circular countdown on a black background
- Bell sound at the end of each focus session (sounds/bell.mp3)
- Confetti celebration and glowing message when plan completes
- Session/phase progress text

## Project Structure
```
promorodo-timer/
├─ index.html        # Setup page (hours + mode)
├─ timer.html        # Timer page (cycles focus/break)
├─ script.js         # Timer logic and interactions
├─ style.css         # Shared styles for both pages
└─ sounds/
   └─ bell.mp3       # Short bell sound (you provide the file)
```

## Getting Started
1. Add a short bell sound at `sounds/bell.mp3`.
2. Open `index.html` in your browser.
3. Enter planned study hours and choose a mode (25-5 or 50-10).
4. Click Start to save your plan and go to the timer.

Tip: Some browsers limit audio/autoplay when opening files directly. Consider serving via a local web server.

### Quick local server options
- VS Code Live Server extension
- Python 3: `python -m http.server 5500` then open `http://localhost:5500/index.html`
- Node: `npx http-server -p 5500` then open `http://localhost:5500/index.html`

## Usage
- Start: begins/resumes the current session
- Pause: pauses the countdown
- Reset: restarts from the first focus session of your plan
- Change Plan: returns to the setup page

## How It Works
- `index.html` saves `studyHours` and `studyMode` to localStorage, then redirects to `timer.html`.
- `timer.html` loads the plan, computes the number of focus sessions, and starts with focus.
- At focus end: plays bell and starts break automatically.
- At break end: starts next focus automatically.
- After all focus sessions complete (covering your hours), shows confetti and a glowing message.

## Customization
- Tweak colors/size/glow in `style.css`.
- Change or add modes in `script.js` (constants `MODE_25_5`, `MODE_50_10`).
- Adjust confetti via `launchConfetti(durationMs, pieceCount)` in `script.js`.
- Replace messages or add more sounds as you like.

## Troubleshooting
- No sound: ensure `sounds/bell.mp3` exists and your browser allows audio. First Start click unlocks audio.
- Plan missing: use Change Plan on `timer.html` and re-enter hours/mode.
- Confetti hidden: ensure `#confetti` exists in `timer.html` and no extensions block animations.

## License
MIT
