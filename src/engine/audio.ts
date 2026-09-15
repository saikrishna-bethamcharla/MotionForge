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
 * Creates audio nodes for an ultra-punchy bass logo sting impact (Brand Reveals, Stings)
 */
export function playSting(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(240, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.4);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc.start(now);
  osc.stop(now + 0.48);
}

/**
 * Creates audio nodes for a commercial cash register / purchase ding (Sales, Pricing, Discount)
 */
export function playCashRegister(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  // Bell chime + mechanical click
  playClick(ctx, dest);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1864.66, now + 0.03); // Bb6
  gain.gain.setValueAtTime(0.3, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(now + 0.03);
  osc.stop(now + 0.4);
}

/**
 * Creates audio nodes for a crisp countdown clock tick
 */
export function playCountdownTick(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(950, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + 0.04);
}

/**
 * Creates audio nodes for festive confetti pop
 */
export function playConfettiPop(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  playPop(ctx, dest);
  setTimeout(() => {
    try {
      playStarChime(ctx, dest);
    } catch (e) {}
  }, 60);
}

/**
 * Creates audio nodes for a crisp metallic coin clink / bounce
 */
export function playCoinClink(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const frequencies = [3400, 4800, 6200];
  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 120, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.88, now + 0.12);

    const initialGain = 0.18 / (idx + 1);
    gain.gain.setValueAtTime(initialGain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14 + idx * 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.18 + idx * 0.04);
  });
}

/**
 * Creates audio nodes for cascading shower of coins
 */
export function playCoinShower(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      try {
        playCoinClink(ctx, dest);
      } catch (e) {}
    }, i * 45 + Math.random() * 20);
  }
}

/**
 * Creates audio nodes for paper banknote rustle / counting
 */
export function playCashRustle(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2400, now);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  noise.start(now);
}

/**
 * Creates audio nodes for a smooth modern payment chime (e.g. UPI / transaction success)
 */
export function playPaymentChime(ctx: BaseAudioContext = getAudioContext(), dest: AudioNode = ctx.destination) {
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    const noteTime = now + idx * 0.05;
    gain.gain.setValueAtTime(0.2, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(noteTime);
    osc.stop(noteTime + 0.38);
  });
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
    if (templateId === 'breaking-news' || templateId === 'breaking-news-bar' || templateId === 'news-lower-third' || templateId === 'headline-card' || templateId === 'interview-identifier') {
      if (progress >= 0.08) fireOnce('news_whoosh', () => playWhoosh());
    }
    if (templateId === 'location-date-slug' || templateId === 'source-citation' || templateId === 'chapter-heading') {
      if (progress >= 0.06) fireOnce('doc_click', () => playClick());
    }
    if (templateId === 'document-highlight' || templateId === 'newspaper-clipping' || templateId === 'evidence-casefile') {
      if (progress >= 0.08) fireOnce('paper_slide', () => playWhoosh());
      if (progress >= 0.22) fireOnce('evidence_stamp', () => playClick());
    }
    if (templateId === 'quote-graphic' || templateId === 'according-to-graphic' || templateId === 'doc-timeline' || templateId === 'photo-collage') {
      if (progress >= 0.12) fireOnce('quote_reveal', () => playStarChime());
    }
    // Branding triggers
    if (templateId.startsWith('brand-')) {
      if (progress >= 0.08) fireOnce('brand_whoosh', () => playWhoosh());
      if (progress >= 0.22) fireOnce('brand_sting', () => playSting());
    }

    // Creator triggers
    if (templateId.startsWith('creator-')) {
      if (templateId === 'creator-subscribe-cta' || templateId === 'creator-like-sub') {
        if (progress >= 0.15) fireOnce('creator_sub', () => playClick());
        if (progress >= 0.35) fireOnce('creator_bell', () => playBell());
        if (progress >= 0.45) fireOnce('creator_confetti', () => playConfettiPop());
      } else if (templateId === 'creator-countdown') {
        if (progress >= 0.1) fireOnce('tick_1', () => playCountdownTick());
        if (progress >= 0.3) fireOnce('tick_2', () => playCountdownTick());
        if (progress >= 0.5) fireOnce('tick_3', () => playCountdownTick());
        if (progress >= 0.7) fireOnce('tick_4', () => playCountdownTick());
        if (progress >= 0.9) fireOnce('tick_5', () => playSting());
      } else {
        if (progress >= 0.08) fireOnce('creator_pop', () => playPop());
      }
    }

    // Commercial triggers
    if (templateId.startsWith('comm-')) {
      if (templateId === 'comm-price-tag' || templateId === 'comm-discount-badge' || templateId === 'comm-sale-anim') {
        if (progress >= 0.18) fireOnce('comm_cash', () => playCashRegister());
      } else if (templateId === 'comm-product-reveal' || templateId === 'comm-app-reveal') {
        if (progress >= 0.10) fireOnce('comm_whoosh', () => playWhoosh());
        if (progress >= 0.30) fireOnce('comm_chime', () => playStarChime());
      } else {
        if (progress >= 0.12) fireOnce('comm_pop', () => playPop());
      }
    }

    // Money & Currency triggers
    if (templateId.startsWith('money-')) {
      if (templateId === 'money-coin-flip') {
        if (progress >= 0.05) fireOnce('coin_whoosh', () => playWhoosh());
        if (progress >= 0.35) fireOnce('coin_clink1', () => playCoinClink());
        if (progress >= 0.50) fireOnce('coin_clink2', () => playCoinClink());
      } else if (templateId === 'money-falling-coins') {
        if (progress >= 0.08) fireOnce('coin_shower', () => playCoinShower());
      } else if (templateId === 'money-banknote-stack') {
        if (progress >= 0.10) fireOnce('cash_rustle', () => playCashRustle());
        if (progress >= 0.35) fireOnce('stack_thud', () => playClick());
      } else if (templateId === 'money-rupee-title') {
        if (progress >= 0.08) fireOnce('rupee_whoosh', () => playWhoosh());
        if (progress >= 0.25) fireOnce('rupee_sting', () => playSting());
        if (progress >= 0.45) fireOnce('rupee_chime', () => playStarChime());
      } else if (templateId === 'money-wealth-counter') {
        if (progress >= 0.15) fireOnce('tick_m1', () => playCountdownTick());
        if (progress >= 0.35) fireOnce('tick_m2', () => playCountdownTick());
        if (progress >= 0.60) fireOnce('tick_m3', () => playCountdownTick());
        if (progress >= 0.85) fireOnce('wealth_cash', () => playCashRegister());
      } else if (templateId === 'money-cash-explosion') {
        if (progress >= 0.12) fireOnce('exp_sting', () => playSting());
        if (progress >= 0.20) fireOnce('exp_coins', () => playCoinShower());
        if (progress >= 0.35) fireOnce('exp_register', () => playCashRegister());
      } else if (templateId === 'money-transaction-pill') {
        if (progress >= 0.10) fireOnce('tx_whoosh', () => playWhoosh());
        if (progress >= 0.30) fireOnce('tx_payment', () => playPaymentChime());
      } else if (templateId === 'money-piggy-bank') {
        if (progress >= 0.15) fireOnce('piggy_drop', () => playCoinClink());
        if (progress >= 0.45) fireOnce('piggy_chime', () => playStarChime());
      } else {
        if (progress >= 0.08) fireOnce('money_pop', () => playPop());
        if (progress >= 0.30) fireOnce('money_clink', () => playCoinClink());
      }
    }
  }
}

export const sfxManager = new SFXManager();
