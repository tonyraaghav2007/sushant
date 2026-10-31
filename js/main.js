/**
 * Nishant & Shweta Royal Wedding Invitation
 * High-Performance Full-Screen Scrollytelling Engine
 * Zero-Lag Transitions • Optimized for Vertical Displays • GPU Accelerated
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. INITIALIZE CANVAS PARTICLES & ENGINES ---
  const petals = new window.PetalShower('petals-canvas');
  const goldDust = new FastGoldDustEngine('dust-canvas');

  // --- 2. DOM ELEMENTS ---
  const scrollProgressLine = document.getElementById('scroll-progress-line');
  const scenePanels = Array.from(document.querySelectorAll('.scene-panel'));
  const railDots = Array.from(document.querySelectorAll('.rail-dot'));
  const scrollPrompt = document.getElementById('scroll-prompt');
  const foilGlint = document.getElementById('foil-glint');
  const musicToggleBtn = document.getElementById('btn-toggle-music');
  const petalsToggleBtn = document.getElementById('btn-toggle-petals');
  const toastBox = document.getElementById('royal-toast');
  const toastMsg = document.getElementById('toast-message');

  const totalScenes = scenePanels.length; // 8 scenes: 0 to 7
  let currentSceneIndex = 0;
  let isTransitioning = false;
  let hasUserScrolled = false;

  // --- 3. HIGH PERFORMANCE SCROLL ENGINE ---
  function updateScrollState() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const rawProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

    // Update Top Gold Progress Line
    if (scrollProgressLine) {
      scrollProgressLine.style.width = `${(rawProgress * 100).toFixed(1)}%`;
    }

    // Hide initial scroll prompt after first gesture
    if (!hasUserScrolled && scrollY > 30) {
      hasUserScrolled = true;
      if (scrollPrompt) scrollPrompt.classList.add('fade-out');
    } else if (scrollY <= 15 && hasUserScrolled) {
      hasUserScrolled = false;
      if (scrollPrompt) scrollPrompt.classList.remove('fade-out');
    }

    // Map progress to active scene index (0 to 7)
    const stepSize = 1 / totalScenes;
    let targetIndex = Math.floor(rawProgress / stepSize);
    if (targetIndex >= totalScenes) targetIndex = totalScenes - 1;

    if (targetIndex !== currentSceneIndex && !isTransitioning) {
      transitionToScene(targetIndex);
    }
  }

  // --- 4. BESPOKE SCENE TRANSITIONS (ZERO-LAG GPU DRIVEN) ---
  function transitionToScene(newIndex) {
    if (newIndex < 0 || newIndex >= totalScenes || newIndex === currentSceneIndex) return;

    isTransitioning = true;
    const oldIndex = currentSceneIndex;
    const oldScene = scenePanels[oldIndex];
    const newScene = scenePanels[newIndex];
    currentSceneIndex = newIndex;

    // Update Nav Rail Dots
    railDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === newIndex);
    });

    // Play subtle paper rustle
    if (window.weddingAudio && typeof window.weddingAudio.playPaperRustle === 'function') {
      window.weddingAudio.playPaperRustle();
    }

    // Clear previous animation classes
    scenePanels.forEach(panel => {
      panel.classList.remove(
        'transition-out-dust', 'transition-in-dust',
        'transition-out-zoom', 'transition-in-zoom',
        'transition-out-stamp', 'transition-in-stamp',
        'transition-out-arch', 'transition-in-arch',
        'transition-out-drift', 'transition-in-drift',
        'transition-out-stagger', 'transition-in-stagger',
        'transition-out-bloom', 'transition-in-bloom',
        'transition-in-diya'
      );
    });

    // SCENE 0 SPECIFIC: GOLD DUST DISSOLUTION ("dusts away and comes back")
    if (oldIndex === 0 && newIndex > 0) {
      oldScene.classList.add('transition-out-dust');
      goldDust.burstScatter('upwards', 70);
    } else if (newIndex === 0 && oldIndex > 0) {
      newScene.classList.add('transition-in-dust');
      goldDust.burstCoalesce(70);
    }

    // SCENE 1 SPECIFIC: 3D DEPTH ZOOM
    if (newIndex === 1) {
      newScene.classList.add('transition-in-zoom');
    } else if (oldIndex === 1) {
      oldScene.classList.add('transition-out-zoom');
    }

    // SCENE 2 SPECIFIC: SEAL STAMP & SHOCKWAVE PULSE
    if (newIndex === 2) {
      newScene.classList.add('transition-in-stamp');
      goldDust.burstShockwave();
    } else if (oldIndex === 2) {
      oldScene.classList.add('transition-out-stamp');
    }

    // SCENE 3 SPECIFIC: ARCH GATES REVEAL
    if (newIndex === 3) {
      newScene.classList.add('transition-in-arch');
    } else if (oldIndex === 3) {
      oldScene.classList.add('transition-out-arch');
    }

    // SCENE 4 SPECIFIC: POLAROID TILT DRIFT
    if (newIndex === 4) {
      newScene.classList.add('transition-in-drift');
    } else if (oldIndex === 4) {
      oldScene.classList.add('transition-out-drift');
    }

    // SCENE 5 SPECIFIC: TIMELINE CASCADE
    if (newIndex === 5) {
      newScene.classList.add('transition-in-stagger');
    } else if (oldIndex === 5) {
      oldScene.classList.add('transition-out-stagger');
    }

    // SCENE 6 SPECIFIC: LOTUS RADIAL BLOOM
    if (newIndex === 6) {
      newScene.classList.add('transition-in-bloom');
    } else if (oldIndex === 6) {
      oldScene.classList.add('transition-out-bloom');
    }

    // SCENE 7 SPECIFIC: TWILIGHT LAKE FINALE
    if (newIndex === 7) {
      newScene.classList.add('transition-in-diya');
      goldDust.burstGentle(35);
    }

    // Toggle active state
    scenePanels.forEach((panel, idx) => {
      panel.classList.toggle('active', idx === newIndex);
    });

    // Release lock after transition duration
    setTimeout(() => {
      isTransitioning = false;
    }, 380);
  }

  // --- 5. SMOOTH NAVIGATION ---
  function scrollToSceneIndex(index) {
    if (index < 0 || index >= totalScenes) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = (index / (totalScenes - 1)) * maxScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  // Rail dots
  railDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      scrollToSceneIndex(targetIdx);
    });
  });

  // Chapter jump pills
  document.querySelectorAll('[data-jump]').forEach(pill => {
    pill.addEventListener('click', () => {
      const jumpIdx = parseInt(pill.getAttribute('data-jump'), 10);
      scrollToSceneIndex(jumpIdx);
    });
  });

  // Explore button on Scene 0
  const beginScrollBtn = document.getElementById('btn-begin-scroll');
  if (beginScrollBtn) {
    beginScrollBtn.addEventListener('click', () => {
      scrollToSceneIndex(1);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentSceneIndex < totalScenes - 1) scrollToSceneIndex(currentSceneIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSceneIndex > 0) scrollToSceneIndex(currentSceneIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSceneIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSceneIndex(totalScenes - 1);
    }
  });

  // Throttled native scroll listener with RAF
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateScrollState();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollState();

  // --- 6. GLINT FOIL CURSOR (RAF Throttled) ---
  let glintTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (!glintTicking && foilGlint) {
      window.requestAnimationFrame(() => {
        const glintX = Math.round((e.clientX / window.innerWidth) * 100);
        const glintY = Math.round((e.clientY / window.innerHeight) * 100);
        foilGlint.style.setProperty('--glint-x', `${glintX}%`);
        foilGlint.style.setProperty('--glint-y', `${glintY}%`);
        glintTicking = false;
      });
      glintTicking = true;
    }
  }, { passive: true });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma === null || e.beta === null || !foilGlint) return;
      const clampGamma = Math.max(-25, Math.min(25, e.gamma));
      const clampBeta = Math.max(10, Math.min(55, e.beta)) - 30;
      const glintX = Math.round(50 + (clampGamma / 25) * 35);
      const glintY = Math.round(35 + (clampBeta / 25) * 35);
      foilGlint.style.setProperty('--glint-x', `${glintX}%`);
      foilGlint.style.setProperty('--glint-y', `${glintY}%`);
    }, { passive: true });
  }

  // --- 7. AUDIO & PETALS CONTROLS ---
  function updateMusicButtonUI(isPlaying) {
    if (!musicToggleBtn) return;
    musicToggleBtn.classList.toggle('playing', isPlaying);
    const label = musicToggleBtn.querySelector('.audio-label');
    if (label) label.textContent = isPlaying ? 'Music: On' : 'Music: Off';
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (window.weddingAudio) {
        const isPlaying = window.weddingAudio.toggleMusic();
        updateMusicButtonUI(isPlaying);
        showToast(isPlaying ? 'Shehnai & Tanpura Melodies Playing 🎶' : 'Music Paused');
      }
    });
  }

  // User gesture audio auto-start
  const unlockAudioOnGesture = () => {
    if (window.weddingAudio && !window.weddingAudio.isPlaying) {
      window.weddingAudio.startMusic();
      updateMusicButtonUI(true);
    }
    window.removeEventListener('click', unlockAudioOnGesture);
    window.removeEventListener('touchstart', unlockAudioOnGesture);
  };
  window.addEventListener('click', unlockAudioOnGesture, { once: true });
  window.addEventListener('touchstart', unlockAudioOnGesture, { once: true });

  if (petalsToggleBtn) {
    petalsToggleBtn.addEventListener('click', () => {
      const active = petals.toggle();
      petalsToggleBtn.classList.toggle('active', active);
      const label = petalsToggleBtn.querySelector('.petal-label');
      if (label) label.textContent = active ? 'Petals: On' : 'Petals: Off';
      showToast(active ? 'Rose Petals Shower Active 🌸' : 'Petals Paused');
    });
  }

  // --- 8. REAL-TIME COUNTDOWN TIMER ---
  const weddingDate = new Date('2026-12-12T12:20:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-minutes');
    const secsEl = document.getElementById('count-seconds');

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 9. CALENDAR EXPORT (Google & Apple iCal) ---
  const btnGoogleCal = document.getElementById('btn-add-google-cal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const title = encodeURIComponent("Wedding Celebration of Nishant & Shweta");
      const details = encodeURIComponent("Together with our families, we joyfully invite you to celebrate our royal wedding!\n\nTiming: 12:20 PM Onwards\nVenue: Bhanushali Wadi Banquet Hall, Nerul East, Navi Mumbai");
      const location = encodeURIComponent("Bhanushali Wadi Banquet Hall, Basteshwar Maharaj Marg, Sector 10A, Nerul East, Navi Mumbai 400706");
      const startIso = "20261212T065000Z";
      const endIso = "20261212T173000Z";
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
      window.open(url, '_blank');
      showToast('Opening Google Calendar...');
    });
  }

  const btnICal = document.getElementById('btn-add-ical');
  if (btnICal) {
    btnICal.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nishant and Shweta//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:nishant-shweta-wedding-2026@wedding.invitation',
        'DTSTAMP:20261212T000000Z',
        'DTSTART:20261212T065000Z',
        'DTEND:20261212T173000Z',
        'SUMMARY:Nishant & Shweta Royal Wedding',
        'DESCRIPTION:Together with our families, we joyfully invite you to celebrate the wedding of Nishant & Shweta.',
        'LOCATION:Bhanushali Wadi Banquet Hall, Nerul East, Navi Mumbai 400706',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Nishant_Shweta_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloaded Wedding Calendar Invite (.ics)!');
    });
  }

  // --- 10. COPY ACTIONS & TOAST NOTIFICATION ---
  function showToast(message) {
    if (!toastBox || !toastMsg) return;
    toastMsg.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastBox._timeout);
    toastBox._timeout = setTimeout(() => {
      toastBox.classList.remove('show');
    }, 2800);
  }

  const btnCopyAddress = document.getElementById('btn-copy-address');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const address = "Bhanushali Wadi Banquet Hall, Basteshwar Maharaj Marg, Nerul East, Sector 10A, Nerul, Navi Mumbai, Maharashtra 400706";
      navigator.clipboard.writeText(address).then(() => {
        showToast('Venue Address Copied to Clipboard! ✦');
      }).catch(() => {
        showToast('Venue: Bhanushali Wadi Banquet Hall, Nerul East');
      });
    });
  }

  const btnCopyLink = document.getElementById('btn-copy-invite-link');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Invitation Link Copied to Clipboard! ✦');
      }).catch(() => {
        showToast('Share link copied!');
      });
    });
  }

  // --- 11. WHATSAPP SHARE ---
  const btnShareWhatsApp = document.getElementById('btn-share-whatsapp');
  if (btnShareWhatsApp) {
    btnShareWhatsApp.addEventListener('click', () => {
      const inviteUrl = window.location.href;
      const text = encodeURIComponent(
        `॥ श्री गणेशाय नमः ॥\n\n` +
        `Together with our families, we joyfully invite you to celebrate the wedding of\n` +
        `*Nishant & Shweta*\n\n` +
        `🗓 Date: Saturday, 12 December 2026\n` +
        `⏰ Timing: 12:20 PM Onwards\n` +
        `📍 Venue: Bhanushali Wadi Banquet Hall, Nerul East, Navi Mumbai\n\n` +
        `Open our royal interactive wedding card:\n${inviteUrl}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  // --- 12. FLOATING DIYAS ON LAKE FINALE ---
  const btnFloatDiya = document.getElementById('btn-float-diya');
  const diyasLakeArea = document.getElementById('diyas-lake-area');
  let diyaCount = 0;

  if (btnFloatDiya && diyasLakeArea) {
    btnFloatDiya.addEventListener('click', () => {
      diyaCount++;
      spawnFloatingDiya();

      const diyaHint = document.getElementById('diya-hint');
      if (diyaHint) {
        diyaHint.textContent = `✦ ${diyaCount} sacred diya${diyaCount > 1 ? 's' : ''} shining bright upon the lake ✦`;
      }

      showToast('Diya illuminated & floating on the lake! 🪔');
      goldDust.burstGentle(25);
    });
  }

  function spawnFloatingDiya() {
    if (!diyasLakeArea) return;

    const diya = document.createElement('div');
    diya.className = 'floating-diya-entity';

    const startX = 10 + Math.random() * 60;
    const startY = 35 + Math.random() * 45;
    const scale = 0.65 + Math.random() * 0.45;
    const duration = 8 + Math.random() * 4;

    diya.style.left = `${startX}%`;
    diya.style.top = `${startY}%`;
    diya.style.transform = `scale(${scale})`;
    diya.style.animationDuration = `${duration}s`;

    diya.innerHTML = `
      <div class="diya-flame-glow"></div>
      <div class="diya-base-clay"></div>
      <div class="diya-water-ripple"></div>
    `;

    diyasLakeArea.appendChild(diya);

    setTimeout(() => {
      diya.remove();
    }, duration * 1000);
  }

});

/**
 * ========================================================
 * FAST GOLD DUST ENGINE (Zero shadowBlur Lag, Pure 60fps)
 * ========================================================
 */
class FastGoldDustEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.ambientParticles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.animId = null;

    this.colors = [
      '#FFFDF9',
      '#FFF0C7',
      '#F5D37E',
      '#D4AF37'
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // 20 ambient lightweight particles
    for (let i = 0; i < 20; i++) {
      this.ambientParticles.push(this.createAmbientParticle());
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createAmbientParticle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: 0.8 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      alpha: 0.2 + Math.random() * 0.4,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    };
  }

  // Trigger: Content dusts away upwards
  burstScatter(direction = 'upwards', count = 70) {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * (this.width * 0.65),
        y: centerY + (Math.random() - 0.5) * (this.height * 0.4),
        vx: Math.cos(angle) * speed * 0.7,
        vy: -Math.abs(Math.sin(angle) * speed * 1.1) - (direction === 'upwards' ? 2 : 0),
        size: 1.2 + Math.random() * 2.4,
        alpha: 0.95,
        decay: 0.018 + Math.random() * 0.02,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        gravity: -0.04
      });
    }
  }

  // Trigger: Gold dust particles converge back
  burstCoalesce(count = 70) {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.45;

    for (let i = 0; i < count; i++) {
      const spawnX = Math.random() < 0.5 ? (Math.random() * this.width) : (Math.random() < 0.5 ? 0 : this.width);
      const spawnY = Math.random() < 0.5 ? 0 : (Math.random() * this.height);
      const targetX = centerX + (Math.random() - 0.5) * 260;
      const targetY = centerY + (Math.random() - 0.5) * 260;

      const dx = targetX - spawnX;
      const dy = targetY - spawnY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = 7 + Math.random() * 7;

      this.particles.push({
        x: spawnX,
        y: spawnY,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        size: 1.4 + Math.random() * 2.2,
        alpha: 0.9,
        decay: 0.022 + Math.random() * 0.018,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        gravity: 0
      });
    }
  }

  // Trigger: Date Seal Shockwave Pulse
  burstShockwave() {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const count = 45;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 3 + Math.random() * 4.5;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        alpha: 1,
        decay: 0.025,
        color: '#F5D37E',
        gravity: 0.015
      });
    }
  }

  // Trigger: Gentle festive celebration sparkle
  burstGentle(count = 25) {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.6;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3;
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 160,
        y: centerY + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.2 + Math.random() * 1.8,
        alpha: 0.9,
        decay: 0.03,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        gravity: 0.04
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Ambient particles (fast direct fill, no shadowBlur)
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Transition burst particles (pure fast rendering)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.animate());
  }
}
