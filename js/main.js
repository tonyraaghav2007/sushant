/**
 * Nishant & Shweta Royal Wedding Invitation
 * 3D Card Opening, Scroll Page-Flipping Engine & Cursor Reactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Petal Shower
  const petals = new window.PetalShower('petals-canvas');

  // DOM Elements
  const tiltBox = document.getElementById('tilt-box');
  const cardShadow = document.getElementById('card-shadow');
  const royalEnvelope = document.getElementById('royal-envelope');
  const envelopeFlap = document.getElementById('envelope-flap');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const openPrompt = document.getElementById('open-card-prompt');
  const royalBook = document.getElementById('royal-book');
  const pages = document.querySelectorAll('.book-page');
  const prevBtn = document.getElementById('book-prev-btn');
  const nextBtn = document.getElementById('book-next-btn');
  const navPills = document.querySelectorAll('.nav-pill');
  const pageDotsContainer = document.getElementById('page-dots');
  const musicToggleBtn = document.getElementById('btn-toggle-music');
  const petalsToggleBtn = document.getElementById('btn-toggle-petals');

  let isCardOpened = false;
  let currentPageIndex = 0;
  const totalPages = pages.length;
  let isFlipping = false;

  // --- 1. SETUP PAGINATION DOTS ---
  if (pageDotsContainer) {
    pageDotsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = `page-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => {
        if (!isCardOpened) openCardEnvelope();
        flipToPage(i);
      });
      pageDotsContainer.appendChild(dot);
    }
  }

  // --- 2. CARD OPENING & EXTRACTION MECHANIC ---
  function openCardEnvelope() {
    if (isCardOpened) return;
    isCardOpened = true;
    document.body.classList.add('card-is-open');
    if (typeof requestOrientationPermission === 'function') {
      requestOrientationPermission();
    }

    // Play auspicious opening sounds
    if (window.weddingAudio) {
      window.weddingAudio.playWaxSealBreak();
      setTimeout(() => window.weddingAudio.playPaperRustle(), 350);
      window.weddingAudio.startMusic();
      updateMusicButtonUI(true);
    }

    // 1. Break wax seal & flip envelope flap
    if (waxSealBtn) waxSealBtn.classList.add('broken');
    if (envelopeFlap) envelopeFlap.classList.add('opened');
    if (openPrompt) openPrompt.style.display = 'none';

    // 2. Slide inner card out of the envelope
    setTimeout(() => {
      if (royalEnvelope) royalEnvelope.classList.add('opened');
      if (royalBook) royalBook.classList.add('unfolded');
      updateNavControls();
    }, 600);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCardEnvelope();
    });
  }

  // --- 3. 3D PAGE FLIPPING ENGINE ---
  function flipToPage(targetIndex) {
    if (targetIndex < 0 || targetIndex >= totalPages || targetIndex === currentPageIndex || isFlipping) return;
    isFlipping = true;

    if (window.weddingAudio) {
      window.weddingAudio.playPaperRustle();
    }

    const direction = targetIndex > currentPageIndex ? 'forward' : 'backward';

    pages.forEach((page, idx) => {
      page.classList.remove('active-page', 'flipped-past', 'upcoming');
      if (idx < targetIndex) {
        page.classList.add('flipped-past');
      } else if (idx === targetIndex) {
        page.classList.add('active-page');
      } else {
        page.classList.add('upcoming');
      }
    });

    currentPageIndex = targetIndex;
    updateNavControls();

    setTimeout(() => {
      isFlipping = false;
    }, 850);
  }

  function nextPage() {
    if (!isCardOpened) {
      openCardEnvelope();
      return;
    }
    if (currentPageIndex < totalPages - 1) {
      flipToPage(currentPageIndex + 1);
    }
  }

  function prevPage() {
    if (!isCardOpened) return;
    if (currentPageIndex > 0) {
      flipToPage(currentPageIndex - 1);
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextPage();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevPage();
    });
  }

  // Update Navigation UI (Pills, Dots, Arrows)
  function updateNavControls() {
    // Nav Pills
    navPills.forEach(pill => {
      const pIdx = parseInt(pill.getAttribute('data-page'), 10);
      pill.classList.toggle('active', pIdx === currentPageIndex);
    });

    // Pagination Dots
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentPageIndex);
    });

    // Arrow states
    if (prevBtn) prevBtn.disabled = !isCardOpened || currentPageIndex === 0;
    if (nextBtn) nextBtn.disabled = !isCardOpened || currentPageIndex === totalPages - 1;
  }

  // Nav Pill Clicks
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const pIdx = parseInt(pill.getAttribute('data-page'), 10);
      if (!isCardOpened) openCardEnvelope();
      flipToPage(pIdx);
    });
  });

  // --- 4. SCROLL & WHEEL PAGE-FLIPPING CONTROLLER ---
  let scrollTimeout = null;
  let accumulatedDelta = 0;

  window.addEventListener('wheel', (e) => {
    if (!isCardOpened) {
      // Any wheel scroll opens the card!
      openCardEnvelope();
      return;
    }

    // Check if the current active page has scrollable content that isn't at edge
    const activePage = pages[currentPageIndex];
    const scrollableEl = activePage ? activePage.querySelector('.scrollable-content') : null;

    if (scrollableEl) {
      const atTop = scrollableEl.scrollTop <= 5;
      const atBottom = scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight - 5;

      if (e.deltaY > 0 && !atBottom) {
        // Scrolling down within page content
        return;
      }
      if (e.deltaY < 0 && !atTop) {
        // Scrolling up within page content
        return;
      }
    }

    // Otherwise scroll turns the pages!
    e.preventDefault();
    accumulatedDelta += e.deltaY;

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (accumulatedDelta > 45) {
        nextPage();
      } else if (accumulatedDelta < -45) {
        prevPage();
      }
      accumulatedDelta = 0;
    }, 60);
  }, { passive: false });

  // Touch Swipe on Mobile (Natural book flip & smart content scroll)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchTarget = null;

  window.addEventListener('touchstart', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchTarget = e.target;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // If envelope is not open, any swipe or tap on envelope opens it
    if (!isCardOpened) {
      if (absX > 25 || absY > 25 || (touchTarget && (touchTarget.closest('.wax-seal-btn') || touchTarget.closest('.royal-envelope-sleeve')))) {
        openCardEnvelope();
      }
      return;
    }

    // Don't flip page if interacting with form inputs, buttons, or chips
    if (touchTarget && touchTarget.closest('input, textarea, button, select, label, .palette-chip')) {
      return;
    }

    // Horizontal Swipe (Natural Book Page Flip: Left = Next, Right = Prev)
    if (absX > absY && absX > 35) {
      if (diffX < -35) {
        nextPage();
      } else if (diffX > 35) {
        prevPage();
      }
      return;
    }

    // Vertical Swipe (Scroll boundaries trigger page flip)
    if (absY > 60) {
      const activePage = pages[currentPageIndex];
      const scrollableEl = activePage ? activePage.querySelector('.scrollable-content') : null;

      if (scrollableEl) {
        const atTop = scrollableEl.scrollTop <= 5;
        const atBottom = scrollableEl.scrollTop + scrollableEl.clientHeight >= scrollableEl.scrollHeight - 5;

        if (diffY < -60 && atBottom) {
          nextPage();
        } else if (diffY > 60 && atTop) {
          prevPage();
        }
      } else {
        if (diffY < -60) {
          nextPage();
        } else if (diffY > 60) {
          prevPage();
        }
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevPage();
    }
  });

  // --- 5. CURSOR & GYROSCOPE REACTIVITY (3D Tilt & Specular Light Parallax) ---
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  // Mobile Gyroscope Parallax for vertical screens
  function handleDeviceOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    const clampGamma = Math.max(-25, Math.min(25, e.gamma));
    const clampBeta = Math.max(15, Math.min(65, e.beta)) - 40;

    mouseTargetX = (clampGamma / 25) * 8;
    mouseTargetY = -(clampBeta / 25) * 6;

    const glintX = Math.round(50 + (clampGamma / 25) * 35);
    const glintY = Math.round(40 + (clampBeta / 25) * 35);
    if (tiltBox) {
      tiltBox.style.setProperty('--glint-x', `${glintX}%`);
      tiltBox.style.setProperty('--glint-y', `${glintY}%`);
    }
  }

  function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
          }
        })
        .catch(() => {});
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }
  }

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
  }

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

    mouseTargetX = normX * 12;  // max 12deg tilt
    mouseTargetY = -normY * 10; // max 10deg tilt

    // Specular light position following cursor
    const glintX = Math.round((e.clientX / window.innerWidth) * 100);
    const glintY = Math.round((e.clientY / window.innerHeight) * 100);
    if (tiltBox) {
      tiltBox.style.setProperty('--glint-x', `${glintX}%`);
      tiltBox.style.setProperty('--glint-y', `${glintY}%`);
    }

    // Sparkle trail
    if (Math.random() > 0.6) {
      createSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  // Smooth lerp loop for card tilt
  function renderTilt() {
    currentTiltX += (mouseTargetX - currentTiltX) * 0.08;
    currentTiltY += (mouseTargetY - currentTiltY) * 0.08;

    if (tiltBox) {
      tiltBox.style.transform = `rotateX(${currentTiltY.toFixed(2)}deg) rotateY(${currentTiltX.toFixed(2)}deg)`;
    }

    if (cardShadow) {
      const shadowOffsetX = -currentTiltX * 2.2;
      const shadowOffsetY = currentTiltY * 1.5;
      cardShadow.style.transform = `translate(${shadowOffsetX}px, ${shadowOffsetY}px) scale(${1 + Math.abs(currentTiltX) * 0.01})`;
    }

    requestAnimationFrame(renderTilt);
  }
  requestAnimationFrame(renderTilt);

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.style.left = `${x + (Math.random() - 0.5) * 18}px`;
    sparkle.style.top = `${y + (Math.random() - 0.5) * 18}px`;
    sparkle.style.transform = `scale(${0.4 + Math.random() * 0.8})`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 700);
  }

  // --- 6. AUDIO & PETALS CONTROLS ---
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (window.weddingAudio) {
        const isPlaying = window.weddingAudio.toggleMusic();
        updateMusicButtonUI(isPlaying);
      }
    });
  }

  function updateMusicButtonUI(isPlaying) {
    if (!musicToggleBtn) return;
    if (isPlaying) {
      musicToggleBtn.classList.add('playing');
      const label = musicToggleBtn.querySelector('.audio-label');
      if (label) label.textContent = 'Music: On';
    } else {
      musicToggleBtn.classList.remove('playing');
      const label = musicToggleBtn.querySelector('.audio-label');
      if (label) label.textContent = 'Music: Off';
    }
  }

  if (petalsToggleBtn) {
    petalsToggleBtn.addEventListener('click', () => {
      const active = petals.toggle();
      petalsToggleBtn.classList.toggle('active', active);
      const label = petalsToggleBtn.querySelector('.petal-label');
      if (label) label.textContent = active ? 'Petals: On' : 'Petals: Off';
    });
  }

  // --- 7. LIVE WEDDING COUNTDOWN ---
  const weddingDate = new Date('2026-12-12T12:00:00+05:30').getTime();

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

  // --- 8. CALENDAR EXPORT (Google & Apple iCal) ---
  const btnGoogleCal = document.getElementById('btn-add-google-cal');
  const btnIcal = document.getElementById('btn-add-ical');

  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('Wedding of Nishant & Shweta') +
        '&dates=20261212T063000Z/20261212T173000Z' +
        '&details=' + encodeURIComponent('Together with our families, we joyfully invite you to celebrate the wedding of Nishant & Shweta at Bhanushali Wadi Banquet Hall, Nerul Navi Mumbai.') +
        '&location=' + encodeURIComponent('Bhanushali Wadi Banquet Hall, Basteshwar Maharaj Marg, Nerul East, Sector 10A, Nerul, Navi Mumbai, Maharashtra 400706');
      window.open(gcalUrl, '_blank');
    });
  }

  if (btnIcal) {
    btnIcal.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nishant and Shweta Wedding//EN',
        'BEGIN:VEVENT',
        'UID:wedding-nishant-shweta-20261212@invitation',
        'DTSTAMP:20261024T120000Z',
        'DTSTART:20261212T063000Z',
        'DTEND:20261212T173000Z',
        'SUMMARY:Wedding of Nishant & Shweta',
        'DESCRIPTION:We joyfully invite you to celebrate our wedding ceremony at Bhanushali Wadi Banquet Hall, Nerul Navi Mumbai.',
        'LOCATION:Bhanushali Wadi Banquet Hall, Basteshwar Maharaj Marg, Nerul East, Sector 10A, Nerul, Navi Mumbai, Maharashtra 400706',
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
    });
  }

  // --- 9. COPY VENUE ADDRESS ---
  const btnCopyAddress = document.getElementById('btn-copy-address');
  if (btnCopyAddress) {
    btnCopyAddress.addEventListener('click', () => {
      const address = "Bhanushali Wadi Banquet Hall, Basteshwar Maharaj Marg, Nerul East, Sector 10A, Nerul, Navi Mumbai, Maharashtra 400706";
      navigator.clipboard.writeText(address).then(() => {
        showToast("Address copied to clipboard!");
      });
    });
  }

  function showToast(msg) {
    const existing = document.querySelector('.royal-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'royal-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // --- 10. DRESS CODE INTERACTIVE SWATCHES ---
  const colorSwatches = document.querySelectorAll('.palette-chip');
  const dressCodeHint = document.getElementById('dress-code-dynamic-hint');

  const dressHints = {
    emerald: "Royal Emerald Green: Elegant, majestic, and auspicious for both kurtas and sarees/lehengas.",
    champagne: "Champagne Ivory: Subtle, luminous, and pairs gorgeously with gold temple jewelry.",
    gold: "Golden Sand & Brass: Rich traditional royalty that glimmers beautifully under evening chandeliers.",
    rose: "Pastel Rose Blush: Romantic and gentle, echoing the bride's regal palace walk lehenga.",
    rust: "Terracotta & Royal Rust: Warm autumnal depth, rich in festive heritage vibrancy."
  };

  colorSwatches.forEach(chip => {
    chip.addEventListener('click', () => {
      colorSwatches.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const colorKey = chip.getAttribute('data-color');
      if (dressCodeHint && dressHints[colorKey]) {
        dressCodeHint.textContent = dressHints[colorKey];
      }
    });
  });

  // --- 11. GALLERY LIGHTBOX ---
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-full');
      const caption = item.getAttribute('data-caption') || 'Nishant & Shweta';
      if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }

  // --- 12. SHARING (WhatsApp & Copy Link) ---
  const btnShareWhatsApp = document.getElementById('btn-share-whatsapp');
  const btnCopyInviteLink = document.getElementById('btn-copy-invite-link');

  if (btnShareWhatsApp) {
    btnShareWhatsApp.addEventListener('click', () => {
      const text = `🌸 *Wedding Invitation: Nishant & Shweta* 🌸\n\nWith the blessings of our families, we joyfully invite you to celebrate our wedding on *Saturday, 12 December 2026* at *Bhanushali Wadi Banquet Hall, Nerul, Navi Mumbai*.\n\nPlease open our interactive wedding invitation card here:\n${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  if (btnCopyInviteLink) {
    btnCopyInviteLink.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast("Invitation link copied to clipboard!");
      });
    });
  }

  // --- 13. INTERACTIVE MODAL CONTROLS ---
  // RSVP Modal
  const rsvpModal = document.getElementById('rsvp-modal');
  const btnTriggerRsvp = document.getElementById('btn-trigger-rsvp-modal');
  const rsvpCloseBtn = document.getElementById('rsvp-modal-close');

  if (btnTriggerRsvp && rsvpModal) {
    btnTriggerRsvp.addEventListener('click', (e) => {
      e.stopPropagation();
      rsvpModal.classList.add('active');
    });
  }
  if (rsvpCloseBtn && rsvpModal) {
    rsvpCloseBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('active');
    });
  }
  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) rsvpModal.classList.remove('active');
    });
  }

  // Blessings Modal
  const blessingsModal = document.getElementById('blessings-modal');
  const btnTriggerBlessings = document.getElementById('btn-trigger-blessings-modal');
  const blessingsCloseBtn = document.getElementById('blessings-modal-close');

  if (btnTriggerBlessings && blessingsModal) {
    btnTriggerBlessings.addEventListener('click', (e) => {
      e.stopPropagation();
      blessingsModal.classList.add('active');
    });
  }
  if (blessingsCloseBtn && blessingsModal) {
    blessingsCloseBtn.addEventListener('click', () => {
      blessingsModal.classList.remove('active');
    });
  }
  if (blessingsModal) {
    blessingsModal.addEventListener('click', (e) => {
      if (e.target === blessingsModal) blessingsModal.classList.remove('active');
    });
  }

  // Gallery Zoom Trigger
  const btnOpenGalleryZoom = document.getElementById('btn-open-gallery-zoom');
  if (btnOpenGalleryZoom && lightbox) {
    btnOpenGalleryZoom.addEventListener('click', (e) => {
      e.stopPropagation();
      lightbox.classList.add('active');
    });
  }
});

