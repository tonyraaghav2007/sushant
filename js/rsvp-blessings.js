/**
 * RSVP Management & Live Blessings Wall
 * Handles interactive RSVP confirmation, digital pass generation,
 * and guestbook wishing well with live likes and localStorage persistence.
 */

// Initial starter blessings from dear family and friends
const DEFAULT_BLESSINGS = [
  {
    id: 'bless-1',
    name: 'Aarav (Brother of the Bride)',
    relation: 'Family',
    text: 'To my dearest sister Shweta and our wonderful Nishant, seeing you two together fills my heart with endless joy. May your life together be as radiant as your smiles today! Love you both always.',
    flower: 'lotus',
    likes: 24,
    time: 'Yesterday'
  },
  {
    id: 'bless-2',
    name: 'Rajesh & Sunita Sharma',
    relation: 'Uncle & Aunt',
    text: 'May Lord Ganesha shower your sacred union with health, happiness, prosperity and unending companionship. Congratulations on this auspicious beginning!',
    flower: 'marigold',
    likes: 19,
    time: '2 days ago'
  },
  {
    id: 'bless-3',
    name: 'Pooja & Rohan',
    relation: 'College Besties',
    text: 'From study sessions and endless coffee talks to the wedding mandap! We couldn’t be happier for you guys. Ready to tear up the dance floor at the Sangeet!',
    flower: 'rose',
    likes: 31,
    time: '3 days ago'
  }
];

class WeddingInteractiveManager {
  constructor() {
    this.blessings = this.loadBlessings();
    this.rsvpData = this.loadRSVP();
    this.init();
  }

  init() {
    this.setupRSVPForm();
    this.setupBlessingsWall();
    this.setupDiyaFloating();
    this.renderBlessings();
    this.checkExistingRSVP();
  }

  loadBlessings() {
    const stored = localStorage.getItem('shweta_nishant_blessings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return DEFAULT_BLESSINGS;
      }
    }
    return DEFAULT_BLESSINGS;
  }

  saveBlessings() {
    localStorage.setItem('shweta_nishant_blessings', JSON.stringify(this.blessings));
  }

  loadRSVP() {
    const stored = localStorage.getItem('shweta_nishant_rsvp');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveRSVP(data) {
    this.rsvpData = data;
    localStorage.setItem('shweta_nishant_rsvp', JSON.stringify(data));
  }

  setupRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const guestCountEl = document.getElementById('rsvp-guest-count');
    const minusBtn = document.getElementById('guest-minus');
    const plusBtn = document.getElementById('guest-plus');

    if (minusBtn && plusBtn && guestCountEl) {
      let count = parseInt(guestCountEl.textContent, 10) || 1;
      minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (count > 1) {
          count--;
          guestCountEl.textContent = count;
        }
      });
      plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (count < 10) {
          count++;
          guestCountEl.textContent = count;
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('rsvp-name');
        const phoneInput = document.getElementById('rsvp-phone');
        const eventsSelected = Array.from(document.querySelectorAll('input[name="rsvp-event"]:checked')).map(el => el.value);
        const dietary = document.getElementById('rsvp-diet')?.value || 'Standard Vegetarian';
        const guestCount = parseInt(document.getElementById('rsvp-guest-count')?.textContent, 10) || 1;

        if (!nameInput.value.trim()) {
          alert('Please enter your full name.');
          nameInput.focus();
          return;
        }

        const rsvpEntry = {
          name: nameInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : '',
          guestCount,
          events: eventsSelected.length > 0 ? eventsSelected : ['All Wedding Ceremonies'],
          dietary,
          submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        this.saveRSVP(rsvpEntry);
        if (window.weddingAudio) window.weddingAudio.playChime();
        this.triggerCelebrationConfetti();
        this.renderConfirmedPass(rsvpEntry);
      });
    }
  }

  checkExistingRSVP() {
    if (this.rsvpData) {
      this.renderConfirmedPass(this.rsvpData, false);
    }
  }

  renderConfirmedPass(rsvp, isNew = true) {
    const container = document.getElementById('rsvp-card-container');
    if (!container) return;

    const initials = rsvp.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    container.innerHTML = `
      <div class="royal-pass-card ${isNew ? 'fade-in-scale' : ''}">
        <div class="pass-seal-header">
          <div class="mini-wax-seal">${initials}</div>
          <span class="pass-status-pill">✓ Attendance Confirmed</span>
        </div>
        <div class="pass-details">
          <h3 class="pass-guest-name">${this.escapeHTML(rsvp.name)}</h3>
          <p class="pass-subtext">Joyfully Welcomed with <strong>${rsvp.guestCount} ${rsvp.guestCount > 1 ? 'Guests' : 'Guest'}</strong></p>
          <div class="pass-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Date</span>
              <span class="meta-val">Saturday, 12 Dec 2026</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Venue</span>
              <span class="meta-val">Bhanushali Wadi, Nerul</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Events</span>
              <span class="meta-val">${rsvp.events.join(', ')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Pass ID</span>
              <span class="meta-val">NS-${Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
          </div>
          <div class="pass-actions">
            <button type="button" class="btn-royal-gold" id="btn-print-pass">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
              Print / Save Guest Pass
            </button>
            <button type="button" class="btn-royal-outline" id="btn-edit-rsvp">Modify RSVP</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-print-pass')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-edit-rsvp')?.addEventListener('click', () => {
      localStorage.removeItem('shweta_nishant_rsvp');
      location.reload();
    });
  }

  setupBlessingsWall() {
    const form = document.getElementById('blessing-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('blessing-name');
      const textInput = document.getElementById('blessing-text');
      const flowerRadios = document.querySelectorAll('input[name="blessing-flower"]:checked');
      const selectedFlower = flowerRadios.length > 0 ? flowerRadios[0].value : 'lotus';

      if (!nameInput.value.trim() || !textInput.value.trim()) {
        alert('Please fill in your name and heartfelt blessing message.');
        return;
      }

      const newBlessing = {
        id: 'bless-' + Date.now(),
        name: nameInput.value.trim(),
        relation: 'Warm Well-Wisher',
        text: textInput.value.trim(),
        flower: selectedFlower,
        likes: 1,
        time: 'Just now'
      };

      this.blessings.unshift(newBlessing);
      this.saveBlessings();
      this.renderBlessings();

      textInput.value = '';
      nameInput.value = '';

      if (window.weddingAudio) window.weddingAudio.playChime();
      this.triggerFlowerBurst();
    });
  }

  renderBlessings() {
    const wall = document.getElementById('blessings-wall-container');
    if (!wall) return;

    const flowerSVGs = {
      lotus: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#D4AF37"><path d="M12 2c1.5 3 4 5 7 6-2 3-5 5-7 10-2-5-5-7-7-10 3-1 5.5-3 7-6z"/></svg>`,
      rose: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#E08B9B"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>`,
      marigold: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#FFA500"><circle cx="12" cy="12" r="8"/><path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" stroke="#fff" stroke-width="1.5"/></svg>`,
      jasmine: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#FAF0E6"><circle cx="12" cy="12" r="5"/><circle cx="12" cy="5" r="3"/><circle cx="19" cy="12" r="3"/><circle cx="12" cy="19" r="3"/><circle cx="5" cy="12" r="3"/></svg>`
    };

    wall.innerHTML = this.blessings.map(b => `
      <div class="blessing-card" data-id="${b.id}">
        <div class="blessing-top">
          <div class="blessing-flower-badge">${flowerSVGs[b.flower] || flowerSVGs.lotus}</div>
          <div class="blessing-author-info">
            <h4 class="blessing-author">${this.escapeHTML(b.name)}</h4>
            <span class="blessing-time">${b.relation ? b.relation + ' • ' : ''}${b.time}</span>
          </div>
        </div>
        <p class="blessing-message">“${this.escapeHTML(b.text)}”</p>
        <div class="blessing-footer">
          <button type="button" class="btn-like-blessing" onclick="window.interactiveManager.likeBlessing('${b.id}')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span class="like-count">${b.likes}</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  likeBlessing(id) {
    const item = this.blessings.find(b => b.id === id);
    if (item) {
      item.likes = (item.likes || 0) + 1;
      this.saveBlessings();
      this.renderBlessings();
      if (window.weddingAudio) window.weddingAudio.playChime();
    }
  }

  setupDiyaFloating() {
    const floatBtn = document.getElementById('btn-float-diya');
    if (!floatBtn) return;

    floatBtn.addEventListener('click', () => {
      this.createFloatingDiya();
      if (window.weddingAudio) window.weddingAudio.playChime();
    });
  }

  createFloatingDiya() {
    const lakeSection = document.getElementById('lake-finale');
    if (!lakeSection) return;

    const diya = document.createElement('div');
    diya.className = 'interactive-floating-diya';
    diya.style.left = `${20 + Math.random() * 60}%`;
    diya.style.bottom = '10%';
    diya.innerHTML = `
      <div class="diya-glow"></div>
      <div class="diya-flame"></div>
      <div class="diya-bowl"></div>
      <span class="diya-label">Shubh Vivah</span>
    `;

    lakeSection.appendChild(diya);

    setTimeout(() => {
      diya.remove();
    }, 12000);
  }

  triggerCelebrationConfetti() {
    const colors = ['#D4AF37', '#FFD700', '#FF69B4', '#FFA07A', '#FFFFFF', '#4CAF50'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-particle';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
      piece.style.top = `${window.scrollY + window.innerHeight * 0.4}px`;
      piece.style.transform = `scale(${0.6 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;

      document.body.appendChild(piece);

      const vx = (Math.random() - 0.5) * 500;
      const vy = -300 - Math.random() * 400;

      piece.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 800}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 2500 + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }).onfinish = () => piece.remove();
    }
  }

  triggerFlowerBurst() {
    const wall = document.getElementById('blessing-form');
    if (!wall) return;
    const rect = wall.getBoundingClientRect();

    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'burst-petal';
      petal.style.left = `${rect.left + rect.width / 2}px`;
      petal.style.top = `${rect.top + window.scrollY + 50}px`;
      document.body.appendChild(petal);

      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;

      petal.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 100}px) scale(0)`, opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 600,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
      }).onfinish = () => petal.remove();
    }
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.interactiveManager = new WeddingInteractiveManager();
});
