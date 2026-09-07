/**
 * Procedural Web Audio API Sound Effects Synthesizer (SFX Engine)
 * Zero external audio files required — 100% synthesized in real time.
 */

let globalAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

/**
 * Creates audio nodes for a tactile mouse click
 */
export function playClick(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(now);
  osc.stop(now + 0.05);
}

/**
 * Creates audio nodes for a bubbly pop sound
 */
export function playPop(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(740, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.09);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(now);
  osc.stop(now + 0.11);
}

/**
 * Creates audio nodes for a realistic metallic bell notification chime
 */
export function playBell(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const fundamental = 1760; // A6 chime

  // Multi-harmonic chime (Fundamental + overtone)
  const harmonics = [1, 2.05, 3.12];
  const gains = [0.4, 0.25, 0.12];

  harmonics.forEach((h, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(fundamental * h, now);

    gain.gain.setValueAtTime(gains[idx], now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.9);
  });
}

/**
 * Creates audio nodes for a heart like pop / double thump
 */
export function playHeart(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;

  // Thump 1
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(280, now);
  osc1.frequency.exponentialRampToValueAtTime(440, now + 0.06);
  gain1.gain.setValueAtTime(0.35, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc1.connect(gain1);
  gain1.connect(dest);
  osc1.start(now);
  osc1.stop(now + 0.09);

  // Thump 2 (higher, sweet chime)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(880, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
  gain2.gain.setValueAtTime(0.25, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc2.connect(gain2);
  gain2.connect(dest);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.26);
}

/**
 * Creates audio nodes for a high-tech glitch/pop (TikTok, Cyberpunk HUD)
 */
export function playGlitch(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(220, now + 0.02);
  osc.frequency.setValueAtTime(1760, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(now);
  osc.stop(now + 0.09);
}

/**
 * Creates audio nodes for a sparkling star/success chime (Milestones, Ratings)
 */
export function playStarChime(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

  notes.forEach((freq, idx) => {
    const t = now + idx * 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + 0.3);
  });
}

/**
 * Creates audio nodes for a smooth cinematic whoosh (Breaking News, Lower Thirds)
 */
export function playWhoosh(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 2.5;
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(2800, now + 0.12);
  filter.frequency.exponentialRampToValueAtTime(300, now + 0.24);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  noise.start(now);
  noise.stop(now + 0.26);
}

/**
 * Sound triggers dispatcher based on template timeline progression
 */
export class SFXManager {
  private lastFiredTriggers = new Set<string>();

  reset() {
    this.lastFiredTriggers.clear();
  }

  checkAndPlayTriggers(templateId: string, progress: number, isEnabled = true) {
    if (!isEnabled) return;

    const fireOnce = (id: string, fn: () => void) => {
      if (!this.lastFiredTriggers.has(id)) {
        this.lastFiredTriggers.add(id);
        try {
          fn();
        } catch (e) {
          // ignore audio context restrictions before interaction
        }
      }
    };

    // YouTube 3-in-1 triggers
    if (templateId === 'youtube-action' || templateId === 'social-callout') {
      if (progress >= 0.18) fireOnce('yt_like', () => playPop());
      if (progress >= 0.32) fireOnce('yt_sub', () => playClick());
      if (progress >= 0.44) fireOnce('yt_bell', () => playBell());
    }

    // Instagram triggers
    if (templateId === 'instagram-pop') {
      if (progress >= 0.16) fireOnce('ig_heart', () => playHeart());
      if (progress >= 0.32) fireOnce('ig_follow', () => playClick());
    }

    // Facebook reaction triggers
    if (templateId === 'facebook-reaction') {
      if (progress >= 0.15) fireOnce('fb_like', () => playPop());
      if (progress >= 0.26) fireOnce('fb_love', () => playHeart());
      if (progress >= 0.36) fireOnce('fb_follow', () => playClick());
    }

    // TikTok triggers
    if (templateId === 'tiktok-pop') {
      if (progress >= 0.12) fireOnce('tt_glitch', () => playGlitch());
      if (progress >= 0.22) fireOnce('tt_pop', () => playPop());
      if (progress >= 0.38) fireOnce('tt_click', () => playClick());
    }

    // Twitter / X triggers
    if (templateId === 'twitter-callout') {
      if (progress >= 0.18) fireOnce('tw_repost', () => playPop());
      if (progress >= 0.30) fireOnce('tw_like', () => playHeart());
      if (progress >= 0.42) fireOnce('tw_bell', () => playClick());
    }

    // Milestone & Star Rating triggers
    if (templateId === 'goal-progress' || templateId === 'star-review') {
      if (progress >= 0.25) fireOnce('milestone_chime', () => playStarChime());
    }

    // Breaking News & Cyberpunk HUD triggers
    if (templateId === 'breaking-news') {
      if (progress >= 0.08) fireOnce('news_whoosh', () => playWhoosh());
    }
    if (templateId === 'cyberpunk-hud') {
      if (progress >= 0.10) fireOnce('hud_glitch', () => playGlitch());
    }
  }
}

export const sfxManager = new SFXManager();
