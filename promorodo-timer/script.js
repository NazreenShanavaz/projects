(() => {
  const MODE_25_5 = { focusMin: 25, breakMin: 5 };
  const MODE_50_10 = { focusMin: 50, breakMin: 10 };

  const timeEl = document.getElementById('time');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const progressCircle = document.querySelector('.ring-progress');
  const bellSound = new Audio('sounds/bell.mp3');
  bellSound.preload = 'auto';
  const confettiContainer = document.getElementById('confetti');
  const completionMessage = document.getElementById('completionMessage');
  const motivationEl = document.querySelector('.motivation');

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = '0';

  let totalMs = 25 * 60 * 1000;
  let remainingMs = totalMs;
  let intervalId = null;
  let lastTick = null;
  let isRunning = false;
  let configured = false;
  let selectedMode = MODE_25_5;
  let studyHours = 1;
  let totalFocusSessions = 0;
  let completedFocusSessions = 0;
  let isFocusPhase = true;

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function updateDisplay() {
    timeEl.textContent = formatTime(remainingMs);
    const progress = 1 - remainingMs / totalMs; // 0 -> 1
    const offset = Math.min(circumference, Math.max(0, progress * circumference));
    progressCircle.style.strokeDashoffset = `${offset}`;
    if (motivationEl) {
      const phase = isFocusPhase ? 'Focus' : 'Break';
      motivationEl.textContent = `${phase} — Session ${Math.min(completedFocusSessions + (isFocusPhase ? 1 : 0), totalFocusSessions)} of ${totalFocusSessions}. Stay focused, you got this!`;
    }
  }

  function tick() {
    const now = Date.now();
    const delta = now - lastTick;
    lastTick = now;
    remainingMs -= delta;
    if (remainingMs <= 0) {
      remainingMs = 0;
      stopInterval();
      isRunning = false;
      updateDisplay();
      handlePhaseCompletion();
      return;
    }
    updateDisplay();
  }

  function startInterval() {
    if (intervalId) return;
    lastTick = Date.now();
    intervalId = setInterval(tick, 250);
  }

  function stopInterval() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  function handleStart() {
    if (isRunning) return;
    isRunning = true;
    // Unlock audio on first user interaction to satisfy autoplay policies
    try {
      bellSound.play().then(() => {
        bellSound.pause();
        bellSound.currentTime = 0;
      }).catch(() => {});
    } catch (_) {}
    if (!configured) {
      // No plan configured, send back to setup page
      isRunning = false;
      try { window.location.href = 'index.html'; } catch(_) {}
      return;
    }
    startInterval();
  }

  function handlePause() {
    if (!isRunning) return;
    isRunning = false;
    stopInterval();
  }

  function handleReset() {
    isRunning = false;
    stopInterval();
    // Reset current plan back to first focus session
    completedFocusSessions = 0;
    isFocusPhase = true;
    totalMs = selectedMode.focusMin * 60 * 1000;
    remainingMs = totalMs;
    updateDisplay();
    hideCompletion();
  }

  startBtn.addEventListener('click', handleStart);
  pauseBtn.addEventListener('click', handlePause);
  resetBtn.addEventListener('click', handleReset);

  updateDisplay();

  // Completion UI helpers
  function showCompletion() {
    if (completionMessage) {
      completionMessage.hidden = false;
    }
    launchConfetti(3000, 160);
  }

  function hideCompletion() {
    if (completionMessage) {
      completionMessage.hidden = true;
    }
    if (confettiContainer) {
      confettiContainer.innerHTML = '';
    }
  }

  function launchConfetti(durationMs = 3000, pieceCount = 120) {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    const colors = [
      '#f43f5e', // rose
      '#f59e0b', // amber
      '#10b981', // emerald
      '#3b82f6', // blue
      '#8b5cf6', // violet
      '#ec4899'  // pink
    ];
    const start = Date.now();
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const left = Math.random() * 100; // vw
      const xDrift = (Math.random() * 200 - 100) + 'px';
      const size = 6 + Math.random() * 8;
      const fallDuration = 2500 + Math.random() * 1500;
      const delay = Math.random() * 600;
      piece.style.left = left + 'vw';
      piece.style.setProperty('--x', xDrift);
      piece.style.width = size + 'px';
      piece.style.height = (size * 1.4) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${fallDuration}ms, ${800 + Math.random() * 1200}ms`;
      piece.style.animationDelay = `${delay}ms, 0ms`;
      confettiContainer.appendChild(piece);
    }
    const clearTimer = setInterval(() => {
      if (Date.now() - start > durationMs) {
        confettiContainer.innerHTML = '';
        clearInterval(clearTimer);
      }
    }, 500);
  }

  // Load plan from localStorage (set on index.html)
  function configureFromStorage() {
    try {
      const hoursStr = localStorage.getItem('studyHours');
      const modeStr = localStorage.getItem('studyMode');
      const parsedHours = parseFloat((hoursStr || '').replace(',', '.'));
      if (!isFinite(parsedHours) || parsedHours <= 0) return false;
      studyHours = parsedHours;
      if (modeStr === '50-10') selectedMode = MODE_50_10; else if (modeStr === '25-5') selectedMode = MODE_25_5; else return false;
      const minutesPerFocus = selectedMode.focusMin;
      const totalMinutes = studyHours * 60;
      totalFocusSessions = Math.ceil(totalMinutes / minutesPerFocus);
      completedFocusSessions = 0;
      isFocusPhase = true;
      totalMs = minutesPerFocus * 60 * 1000;
      remainingMs = totalMs;
      configured = true;
      updateDisplay();
      return true;
    } catch (_) {
      return false;
    }
  }

  function handlePhaseCompletion() {
    if (isFocusPhase) {
      // End of a focus session
      completedFocusSessions += 1;
      playBell(2000, 0.7);

      if (completedFocusSessions >= totalFocusSessions) {
        // All done!
        showCompletion();
        return;
      }

      // Switch to break
      isFocusPhase = false;
      totalMs = selectedMode.breakMin * 60 * 1000;
      remainingMs = totalMs;
      updateDisplay();
      // Auto-start break
      isRunning = true;
      startInterval();
    } else {
      // End of a break, start next focus
      isFocusPhase = true;
      totalMs = selectedMode.focusMin * 60 * 1000;
      remainingMs = totalMs;
      updateDisplay();
      // Auto-start next focus
      isRunning = true;
      startInterval();
    }
  }

  function playBell(maxMs = 2000, volume = 0.7) {
    try {
      bellSound.pause();
      bellSound.currentTime = 0;
      bellSound.volume = volume;
      bellSound.play().then(() => {
        setTimeout(() => {
          try {
            bellSound.pause();
            bellSound.currentTime = 0;
          } catch (_) {}
        }, maxMs);
      }).catch(() => {});
    } catch (_) {}
  }

  // Initialize from storage when on timer page
  configureFromStorage();
})();


