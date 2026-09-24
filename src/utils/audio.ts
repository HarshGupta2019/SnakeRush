/**
 * Web Audio API procedural sound engine & Haptic feedback system
 * Zero external asset dependencies, zero lag, crystal-clear audio
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private hapticsEnabled: boolean = true;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
    // Handle tab visibility to preserve battery and avoid audio context desync
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        try {
          if (document.hidden) {
            if (this.ctx && this.ctx.state === 'running') {
              this.ctx.suspend().catch(() => {});
            }
          } else {
            if (this.ctx && this.ctx.state === 'suspended') {
              this.ctx.resume().catch(() => {});
            }
          }
        } catch {}
      });
    }
  }

  private initCtx() {
    if (this.ctx && this.ctx.state === 'closed') {
      this.ctx = null;
    }
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          this.ctx = new AudioCtxClass();
        } catch {
          this.ctx = null;
        }
      }
    }
    if (this.ctx && (this.ctx.state === 'suspended' || (this.ctx.state as string) === 'interrupted')) {
      this.ctx.resume().catch(() => {});
    }
  }

  private cleanupNodes(nodes: (AudioNode | null | undefined)[]) {
    nodes.forEach(n => {
      if (!n) return;
      try {
        n.disconnect();
      } catch {}
    });
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  public setHapticsEnabled(enabled: boolean) {
    this.hapticsEnabled = enabled;
  }

  public triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
    if (!this.hapticsEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(12);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(45);
          break;
        case 'success':
          navigator.vibrate([20, 40, 30]);
          break;
        case 'warning':
          navigator.vibrate([30, 50, 30, 50, 40]);
          break;
        case 'error':
          navigator.vibrate([60, 40, 80]);
          break;
      }
    } catch {
      // Ignore vibration errors
    }
  }

  // 1. Soft UI Tap
  public playTap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio context error fallback
    }
  }

  // 2. Arrow Launch / Release Swipe
  public playArrowLaunch(isEmergency: boolean = false) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isEmergency ? 'sawtooth' : 'triangle';

      const baseFreq = isEmergency ? 420 : 340;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, this.ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(isEmergency ? 0.22 : 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {}
  }

  // 3. Arrow Exit / Successful Clear Chime (Melodic combo)
  public playArrowExit(comboIndex: number = 0, isEmergency: boolean = false) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
      const freq = notes[comboIndex % notes.length];

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, this.ctx.currentTime + 0.22);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(isEmergency ? 0.28 : 0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { osc2.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 0.3);
      osc2.stop(this.ctx.currentTime + 0.3);
    } catch {}
  }

  // 4. Blocked Collision Hit
  public playBlockedHit() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.17);
      this.triggerHaptic('error');
    } catch {}
  }

  // 5. Emergency Warning Siren (under 10s)
  public playEmergencyAlert() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, this.ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.24);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
      this.triggerHaptic('warning');
    } catch {}
  }

  // 6. Countdown Tick
  public playCountdownTick(isUrgent: boolean = false) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {}
  }

  // 7. Victory Level Complete Fanfare
  public playVictoryFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C major chord arpeggio
      chords.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.onended = () => {
          try { osc.disconnect(); } catch {}
          try { gain.disconnect(); } catch {}
        };
        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.45);
      });
      this.triggerHaptic('success');
    } catch {}
  }

  // 8. Game Over Defeat
  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const tones = [392.0, 349.23, 311.13, 261.63];
      tones.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.onended = () => {
          try { osc.disconnect(); } catch {}
          try { gain.disconnect(); } catch {}
        };
        osc.start(this.ctx!.currentTime + idx * 0.12);
        osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.38);
      });
      this.triggerHaptic('error');
    } catch {}
  }

  // 9. Freeze Skill / Ice Glass
  public playFreezeSound() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.46);
      this.triggerHaptic('medium');
    } catch {}
  }

  // 10. Coin Earn / Shop Buy
  public playCoinEarn() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.26);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { osc2.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc2.start(this.ctx.currentTime + 0.08);
      osc.stop(this.ctx.currentTime + 0.28);
      osc2.stop(this.ctx.currentTime + 0.28);
      this.triggerHaptic('light');
    } catch {}
  }

  // 11. Hint Reveal
  public playHintSound() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.0, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.onended = () => {
        try { osc.disconnect(); } catch {}
        try { gain.disconnect(); } catch {}
      };
      osc.start();
      osc.stop(this.ctx.currentTime + 0.24);
      this.triggerHaptic('light');
    } catch {}
  }

  // Ambient synth procedural background music
  public startBgm() {
    if (!this.musicEnabled || this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const chords = [
      [261.63, 329.63, 392.0],  // C
      [220.0, 261.63, 329.63],  // Am
      [174.61, 220.0, 261.63],  // F
      [196.0, 246.94, 293.66],  // G
    ];
    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.musicEnabled) return;
      try {
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime); // warm lower octave

          gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.018, this.ctx.currentTime + 0.8);
          gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 2.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          this.bgmOscillators.push(osc);
          osc.onended = () => {
            try { osc.disconnect(); } catch {}
            try { gain.disconnect(); } catch {}
            this.bgmOscillators = this.bgmOscillators.filter(activeOsc => activeOsc !== osc);
          };

          osc.start();
          osc.stop(this.ctx.currentTime + 2.9);
        });
      } catch {}
    };

    playChordStep();
    this.bgmInterval = window.setInterval(playChordStep, 3000);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.bgmOscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.bgmOscillators = [];
  }
}

export const soundManager = new SoundEngine();
