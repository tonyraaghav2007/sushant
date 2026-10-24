/**
 * Royal Indian Wedding Audio Synthesizer (Web Audio API)
 * Procedural Tanpura Drone, Sitar/Flute Harmonics & Interactive Sound Effects
 * 100% self-contained: No external audio assets needed!
 */

class WeddingAudioManager {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.droneOscillators = [];
    this.melodyTimer = null;
    this.notes = [
      130.81, // C3 (Sa)
      146.83, // D3 (Re)
      164.81, // E3 (Ga)
      185.00, // F#3 (Teevra Ma)
      196.00, // G3 (Pa)
      220.00, // A3 (Dha)
      246.94, // B3 (Ni)
      261.63, // C4 (Sa)
      293.66, // D4 (Re)
      329.63, // E4 (Ga)
      392.00, // G4 (Pa)
      523.25  // C5 (High Sa)
    ];
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);

    this.musicGain = this.audioCtx.createGain();
    this.musicGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.audioCtx.createGain();
    this.sfxGain.gain.setValueAtTime(0.6, this.audioCtx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  startMusic() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startTanpuraDrone();
    this.startBansuriMelody();
  }

  stopMusic() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    this.droneOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.droneOscillators = [];
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startTanpuraDrone() {
    // Tanpura drone strings: Pa (G3), Sa (C4), Sa (C4), Sa (C3)
    const droneFreqs = [196.00, 261.63, 261.63 * 1.002, 130.81];
    
    droneFreqs.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = i === 3 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Lowpass filter for warm acoustic resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + i * 200, this.audioCtx.currentTime);

      // Subtle LFO for natural acoustic shimmer
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.2 + i * 0.1, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      lfo.connect(lfoGain);

      gain.gain.setValueAtTime(0.08 / (i + 1), this.audioCtx.currentTime);
      lfoGain.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      lfo.start();
      this.droneOscillators.push(osc, lfo);
    });
  }

  startBansuriMelody() {
    // Raag Yaman / Bhairavi wedding notes
    let noteIdx = 0;
    const ragaPhrases = [
      [261.63, 293.66, 329.63, 392.00], // Sa Re Ga Pa
      [329.63, 392.00, 523.25, 392.00], // Ga Pa Sa' Pa
      [392.00, 329.63, 293.66, 261.63], // Pa Ga Re Sa
      [246.94, 261.63, 293.66, 261.63]  // Ni Sa Re Sa
    ];
    let phraseIdx = 0;

    const playMelodicNote = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const phrase = ragaPhrases[phraseIdx % ragaPhrases.length];
      const freq = phrase[noteIdx % phrase.length];
      noteIdx++;
      if (noteIdx >= phrase.length) {
        noteIdx = 0;
        phraseIdx++;
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      // Sine wave with slight vibrato for Indian bamboo flute (Bansuri) tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Gentle pitch glide (Meend)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.002, this.audioCtx.currentTime + 0.3);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(3.0, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 2.3);
    };

    // Play next note every 1.8 seconds with pleasant variations
    this.melodyTimer = setInterval(playMelodicNote, 1800);
    playMelodicNote();
  }

  // Sound Effect: Wax Seal Crack & Pop
  playWaxSealBreak() {
    this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const now = this.audioCtx.currentTime;
    
    // Crack noise
    const bufferSize = this.audioCtx.sampleRate * 0.1;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, now);

    const noiseGain = this.audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now);

    // Warm resonant snap tone
    const osc = this.audioCtx.createOscillator();
    const oscGain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Sound Effect: Paper Flutter / Fold
  playPaperRustle() {
    this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    const now = this.audioCtx.currentTime;

    const bufferSize = this.audioCtx.sampleRate * 0.25;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.linearRampToValueAtTime(1200, now + 0.2);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  // Sound Effect: Auspicious Temple Bell / Chime (Ghungroo / Tingsha)
  playChime() {
    this.init();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    const now = this.audioCtx.currentTime;

    const freqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    freqs.forEach((f, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      gain.gain.setValueAtTime(0.12 / (i + 1), now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + i * 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.06);
      osc.stop(now + 2.0);
    });
  }
}

window.weddingAudio = new WeddingAudioManager();
