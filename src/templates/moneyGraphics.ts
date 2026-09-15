import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

// Helper for drawing an embossed gold/custom coin
function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  scaleX: number,
  symbol: string,
  primaryColor = '#eab308',
  secondaryColor = '#ca8a04',
  textColor = '#ffffff',
  shineAngle = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, 1);

  // Outer Edge / Coin Rim Depth (3D bevel effect)
  const rimGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  rimGrad.addColorStop(0, '#fef08a');
  rimGrad.addColorStop(0.3, primaryColor);
  rimGrad.addColorStop(0.7, secondaryColor);
  rimGrad.addColorStop(1, '#854d0e');

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = rimGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 6;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Outer Border Ridge
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.strokeStyle = '#fef9c3';
  ctx.stroke();

  // Inner Coin Face
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.84, 0, Math.PI * 2);
  const faceGrad = ctx.createRadialGradient(
    -radius * 0.2,
    -radius * 0.2,
    radius * 0.1,
    0,
    0,
    radius * 0.85
  );
  faceGrad.addColorStop(0, '#fef08a');
  faceGrad.addColorStop(0.4, primaryColor);
  faceGrad.addColorStop(1, secondaryColor);
  ctx.fillStyle = faceGrad;
  ctx.fill();

  // Milled Coin Edges / Beaded Ring
  const dots = 24;
  for (let i = 0; i < dots; i++) {
    const angle = (i / dots) * Math.PI * 2;
    const dotX = Math.cos(angle) * (radius * 0.76);
    const dotY = Math.sin(angle) * (radius * 0.76);
    ctx.beginPath();
    ctx.arc(dotX, dotY, Math.max(1.2, radius * 0.025), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  }

  // Specular Light Sweep / Shine Beam
  if (shineAngle !== 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.84, 0, Math.PI * 2);
    ctx.clip();

    ctx.rotate(shineAngle);
    const beamGrad = ctx.createLinearGradient(-radius * 0.5, 0, radius * 0.5, 0);
    beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    beamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  // Embossed Currency Symbol (₹ / $ / € / £)
  ctx.fillStyle = textColor;
  ctx.font = `bold ${radius * 0.9}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillText(symbol, 0, radius * 0.05);

  ctx.restore();
}

// ==========================================
// 1. 3D GOLD COIN FLIP & SPIN
// ==========================================
export function renderMoneyCoinFlip(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 20 * scale;
  const coinRadius = 160 * scale;

  const enterProg = windowProgress(progress, 0, 0.15, Easing.easeOutBack);
  const settleProg = windowProgress(progress, 0.12, 0.85, Easing.easeOutCubic);
  const textProg = windowProgress(progress, 0.35, 0.55, Easing.easeOutBack);

  ctx.save();

  // Glow halo behind coin
  const glowGrad = ctx.createRadialGradient(cx, cy, 50 * scale, cx, cy, 320 * scale);
  glowGrad.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
  glowGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.1)');
  glowGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 320 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Coin spin physics
  const totalRotations = 6.5;
  const currentAngle = settleProg * totalRotations * Math.PI * 2;
  const scaleX = Math.cos(currentAngle);
  const shineAngle = currentAngle * 0.8;

  const bounceY = cy - Math.sin(settleProg * Math.PI) * 40 * scale;

  const symbol = config.currencySymbol || '₹';
  drawCoin(
    ctx,
    cx,
    bounceY,
    coinRadius * enterProg,
    scaleX,
    symbol,
    config.primaryColor || '#eab308',
    config.secondaryColor || '#ca8a04',
    config.textColor || '#ffffff',
    shineAngle
  );

  // Bottom Title & Subtitle Badge
  if (textProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + coinRadius + 80 * scale);
    ctx.scale(textProg, textProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.title || 'FORTUNE AWAITS', 0, 0);

    ctx.fillStyle = config.accentColor || '#fde047';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || `${symbol} 10,00,000 WEALTH POOL`, 0, 38 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 2. GOLD COIN SHOWER / RAIN
// ==========================================
export function renderMoneyFallingCoins(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  ctx.save();

  const symbol = config.currencySymbol || '₹';
  const coinCount = 28;

  for (let i = 0; i < coinCount; i++) {
    const seedX = ((i * 137.5) % 1) * width;
    const seedSpeed = 0.6 + ((i * 31.7) % 1) * 0.8;
    const seedDelay = ((i * 53.1) % 1) * 0.35;
    const seedRadius = (35 + ((i * 19.3) % 1) * 35) * scale;
    const rotSpeed = 3 + ((i * 47.9) % 1) * 6;

    const coinProg = Math.max(0, (progress - seedDelay) / (1 - seedDelay));
    const currentY = (coinProg * seedSpeed * 1.6 - 0.2) * (height + 300 * scale);
    const scaleX = Math.cos(coinProg * rotSpeed * Math.PI * 2);

    if (currentY > -100 * scale && currentY < height + 100 * scale) {
      drawCoin(
        ctx,
        seedX,
        currentY,
        seedRadius,
        scaleX,
        symbol,
        config.primaryColor || '#eab308',
        config.secondaryColor || '#ca8a04',
        '#ffffff',
        coinProg * 3
      );
    }
  }

  // Center Headline Card Overlay
  const cardProg = windowProgress(progress, 0.15, 0.35, Easing.easeOutBack);
  if (cardProg > 0) {
    const cardW = 740 * scale;
    const cardH = 140 * scale;
    const cardX = (width - cardW) / 2;
    const cardY = (height - cardH) / 2;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(cardProg, cardProg);
    ctx.translate(-width / 2, -height / 2);

    roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
    ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.92)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 30 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = config.primaryColor || '#eab308';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${42 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(config.title || 'JACKPOT WINNER!', width / 2, cardY + 28 * scale);

    ctx.fillStyle = config.accentColor || '#fde047';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || `${symbol} 1,00,00,000 CASH PRIZE`, width / 2, cardY + 84 * scale);

    ctx.restore();
  }

  ctx.restore();
}

export interface IndianNoteStyle {
  denom: '2000' | '500' | '200' | '100' | '50';
  baseColor: string;
  darkColor: string;
  trimColor: string;
  accentGlow: string;
  hindiWord: string;
  englishWord: string;
  themeMotif: string;
  bleedLines: number;
}

export const INDIAN_NOTE_STYLES: Record<string, IndianNoteStyle> = {
  '2000': {
    denom: '2000',
    baseColor: '#db2777', // Magenta / Pink
    darkColor: '#831843',
    trimColor: '#fbcfe8',
    accentGlow: '#f472b6',
    hindiWord: 'दो हज़ार रुपये',
    englishWord: 'TWO THOUSAND RUPEES',
    themeMotif: 'MANGALYAAN / SPECIMEN',
    bleedLines: 7,
  },
  '500': {
    denom: '500',
    baseColor: '#475569', // Stone Grey / Sage
    darkColor: '#1e293b',
    trimColor: '#cbd5e1',
    accentGlow: '#22c55e', // Green optically variable ink
    hindiWord: 'पाँच सौ रुपये',
    englishWord: 'FIVE HUNDRED RUPEES',
    themeMotif: 'RED FORT / SPECIMEN',
    bleedLines: 5,
  },
  '200': {
    denom: '200',
    baseColor: '#ea580c', // Bright Orange
    darkColor: '#9a3412',
    trimColor: '#ffedd5',
    accentGlow: '#facc15',
    hindiWord: 'दो सौ रुपये',
    englishWord: 'TWO HUNDRED RUPEES',
    themeMotif: 'SANCHI STUPA / SPECIMEN',
    bleedLines: 4,
  },
  '100': {
    denom: '100',
    baseColor: '#7c3aed', // Lavender / Violet
    darkColor: '#4c1d95',
    trimColor: '#ede9fe',
    accentGlow: '#a78bfa',
    hindiWord: 'एक सौ रुपये',
    englishWord: 'ONE HUNDRED RUPEES',
    themeMotif: 'RANI KI VAV / SPECIMEN',
    bleedLines: 4,
  },
  '50': {
    denom: '50',
    baseColor: '#0284c7', // Fluorescent Cyan
    darkColor: '#075985',
    trimColor: '#e0f2fe',
    accentGlow: '#38bdf8',
    hindiWord: 'पचास रुपये',
    englishWord: 'FIFTY RUPEES',
    themeMotif: 'HAMPI CHARIOT / SPECIMEN',
    bleedLines: 0,
  },
};

/**
 * Draws a highly authentic Indian Specimen/Prop Currency Note
 * Features:
 * - Guilloche geometric border lace
 * - Color-shifting windowed security thread (green-to-blue)
 * - Mahatma Gandhi portrait vignette
 * - Ashoka Lion Pillar Capital emblem
 * - RBI Governor guarantee clause & bilingual value
 * - Explicit "SPECIMEN • FOR ENTERTAINMENT PURPOSE ONLY" markings
 */
export function drawIndianBanknote(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  denomKey = '500',
  customPrimary?: string,
  customSecondary?: string,
  tiltAngle = 0,
  serialNum = '9AB 742168'
) {
  const noteInfo = INDIAN_NOTE_STYLES[denomKey] || INDIAN_NOTE_STYLES['500'];
  const baseColor = customPrimary || noteInfo.baseColor;
  const darkColor = customSecondary || noteInfo.darkColor;

  ctx.save();
  ctx.translate(cx, cy);
  if (tiltAngle !== 0) {
    ctx.rotate(tiltAngle);
  }

  // 1. Banknote Body with Outer Drop Shadow
  roundRect(ctx, -w / 2, -h / 2, w, h, 8);
  const bodyGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  bodyGrad.addColorStop(0, baseColor);
  bodyGrad.addColorStop(0.5, darkColor);
  bodyGrad.addColorStop(1, baseColor);
  ctx.fillStyle = bodyGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // 2. Micro-Guilloche Security Border Lace
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  roundRect(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 6);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 4);
  ctx.stroke();

  // 3. Bleed Lines on Left and Right for Visually Impaired
  if (noteInfo.bleedLines > 0) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    for (let b = 0; b < noteInfo.bleedLines; b++) {
      const ly = -h * 0.25 + b * 14;
      // Left edge marks
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 10, ly);
      ctx.lineTo(-w / 2 + 22, ly + 8);
      ctx.stroke();
      // Right edge marks
      ctx.beginPath();
      ctx.moveTo(w / 2 - 10, ly);
      ctx.lineTo(w / 2 - 22, ly + 8);
      ctx.stroke();
    }
  }

  // 4. Color-Shifting Security Thread (Windowed Green/Blue Foil Ribbon)
  const threadX = -w * 0.08;
  const threadW = 8;
  const threadGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  threadGrad.addColorStop(0, '#22c55e');
  threadGrad.addColorStop(0.3, '#3b82f6');
  threadGrad.addColorStop(0.6, '#22c55e');
  threadGrad.addColorStop(1, '#06b6d4');
  ctx.fillStyle = threadGrad;
  // Windowed dashes
  for (let dy = -h / 2 + 16; dy < h / 2 - 20; dy += 24) {
    ctx.fillRect(threadX, dy, threadW, 14);
  }
  // Micro RBI lettering in thread
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RBI ₹', threadX + threadW / 2, 0);

  // 5. Watermark Window Oval (Left Section)
  const ovalX = -w * 0.31;
  const ovalY = 0;
  const ovalR = h * 0.32;
  ctx.beginPath();
  ctx.arc(ovalX, ovalY, ovalR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Subtle watermark Gandhi silhouette inside oval
  ctx.save();
  ctx.beginPath();
  ctx.arc(ovalX, ovalY, ovalR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.beginPath();
  ctx.arc(ovalX, ovalY - 10, 26, 0, Math.PI * 2); // head
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(ovalX, ovalY + 36, 42, 28, 0, 0, Math.PI * 2); // shoulder
  ctx.fill();
  ctx.restore();

  // Watermark Denomination
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${h * 0.2}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(noteInfo.denom, ovalX, ovalY);

  // 6. Header Text: "भारतीय रिज़र्व बैंक / RESERVE BANK OF INDIA"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('भारतीय रिज़र्व बैंक  •  RESERVE BANK OF INDIA', 0, -h / 2 + 18);

  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillText('GUARANTEED BY THE CENTRAL GOVERNMENT // PROPOSAL SAMPLE', 0, -h / 2 + 34);

  // 7. Mahatma Gandhi Portrait Vignette (Right-Center)
  const portraitX = w * 0.18;
  const portraitY = 4;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(portraitX, portraitY, 48, 62, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Stylized Gandhi Head with round spectacles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(portraitX, portraitY - 14, 22, 0, Math.PI * 2); // head
  ctx.fill();
  // Round spectacles
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(portraitX - 7, portraitY - 14, 6, 0, Math.PI * 2);
  ctx.arc(portraitX + 7, portraitY - 14, 6, 0, Math.PI * 2);
  ctx.stroke();
  // Shawl draped shoulders
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.ellipse(portraitX, portraitY + 28, 38, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Name tag under portrait
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('महात्मा गांधी  MAHATMA GANDHI', portraitX, portraitY + 70);

  // 8. Ashoka Lion Pillar Capital Emblem (Far Right)
  const emblemX = w * 0.41;
  const emblemY = h * 0.24;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 24px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏛️', emblemX, emblemY);
  ctx.font = 'bold 7px system-ui';
  ctx.fillText('सत्यमेव जयते', emblemX, emblemY + 18);

  // 9. Bilingual Value in Center: "दो हज़ार रुपये / TWO THOUSAND RUPEES"
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(noteInfo.hindiWord, -w * 0.03, -12);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(noteInfo.englishWord, -w * 0.03, 10);

  // 10. Large Denomination Display (Top Right & Bottom Left)
  // Top right green/gold variable ink numeral
  ctx.fillStyle = noteInfo.accentGlow;
  ctx.font = `900 32px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'right';
  ctx.shadowColor = noteInfo.accentGlow;
  ctx.shadowBlur = 10;
  ctx.fillText(`₹${noteInfo.denom}`, w / 2 - 24, -h / 2 + 42);
  ctx.shadowBlur = 0;

  // Bottom left numeral
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(`₹${noteInfo.denom}`, -w / 2 + 24, h / 2 - 28);

  // 11. Red Serial Number (Ascending font size)
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(serialNum, -w / 2 + 24, -h / 2 + 40);

  ctx.textAlign = 'right';
  ctx.fillText(serialNum, w / 2 - 24, h / 2 - 26);

  // 12. PROMINENT SPECIMEN / PROP STAMP (Clearly authentic look yet compliant)
  ctx.save();
  ctx.rotate(-0.16);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-w * 0.32, -18, w * 0.64, 36);

  ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.font = '900 15px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPECIMEN • FULL ENTERTAINMENT PURPOSE ONLY', 0, 0);
  ctx.restore();

  ctx.restore();
}

// ==========================================
// 3. FLOATING BANKNOTE STACK (INDIAN CURRENCY)
// ==========================================
export function renderMoneyBanknoteStack(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 40 * scale;

  const noteW = 540 * scale;
  const noteH = 250 * scale;
  const denom = (config.denomination as any) || '500';

  const enterProg = windowProgress(progress, 0, 0.15, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Stack of 6 crisp notes
  const notesCount = 6;
  for (let i = notesCount - 1; i >= 0; i--) {
    const noteProg = windowProgress(
      progress,
      0.04 + i * 0.035,
      0.22 + i * 0.035,
      Easing.easeOutBack
    );
    const floatOffset = Math.sin(progress * Math.PI * 2 + i * 0.5) * 10 * scale;
    const yOffset = (i * -24 + floatOffset) * scale;
    const rot = (i - 2.5) * 0.032;

    ctx.save();
    ctx.scale(enterProg * noteProg, enterProg * noteProg);
    drawIndianBanknote(
      ctx,
      cx,
      cy + yOffset,
      noteW,
      noteH,
      denom,
      config.primaryColor,
      config.secondaryColor,
      rot,
      `4LK 9821${i}4`
    );
    ctx.restore();
  }

  // Bottom Title Banner
  const titleProg = windowProgress(progress, 0.35, 0.55, Easing.easeOutQuart);
  if (titleProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + noteH / 2 + 90 * scale);
    ctx.scale(titleProg, titleProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || `₹${denom} CURRENCY STACK`, 0, 0);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || 'AUTHENTIC SPECIMEN SAMPLES • ENTERTAINMENT SUITE', 0, 38 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 4. CINEMATIC ₹ RUPEE TITLE REVEAL
// ==========================================
export function renderMoneyRupeeTitle(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2;

  const rupeeProg = windowProgress(progress, 0, 0.18, Easing.easeOutBack);
  const glowProg = windowProgress(progress, 0.10, 0.30, Easing.easeOutQuart);
  const textProg = windowProgress(progress, 0.25, 0.45, Easing.easeOutQuart);

  ctx.save();

  if (glowProg > 0) {
    const glow = ctx.createRadialGradient(cx, cy - 30 * scale, 10 * scale, cx, cy - 30 * scale, 450 * scale);
    glow.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
    glow.addColorStop(0.4, 'rgba(245, 158, 11, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy - 30 * scale, 450 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(cx, cy - 60 * scale);
  ctx.scale(rupeeProg, rupeeProg);

  const rupeeGrad = ctx.createLinearGradient(0, -120 * scale, 0, 120 * scale);
  rupeeGrad.addColorStop(0, '#fef08a');
  rupeeGrad.addColorStop(0.3, config.primaryColor || '#eab308');
  rupeeGrad.addColorStop(0.7, config.secondaryColor || '#f59e0b');
  rupeeGrad.addColorStop(1, '#78350f');

  ctx.fillStyle = rupeeGrad;
  ctx.font = `900 ${220 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 40 * scale;
  ctx.fillText(config.currencySymbol || '₹', 0, 0);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 3 * scale;
  ctx.strokeText(config.currencySymbol || '₹', 0, 0);

  ctx.restore();

  if (textProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + 100 * scale);
    ctx.scale(textProg, textProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${52 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.title || '₹ 1,00,00,000', 0, 0);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `700 ${24 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || 'ONE CRORE MILESTONE UNLOCKED', 0, 48 * scale);

    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 5. FAST DYNAMIC WEALTH TICKER
// ==========================================
export function renderMoneyWealthCounter(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 880 * scale;
  const cardH = 240 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutBack);
  const countProg = windowProgress(progress, 0.08, 0.85, Easing.easeOutQuart);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 32 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.font = `900 ${16 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('● LIVE REVENUE TICKER // REAL-TIME', cardX + 48 * scale, cardY + 48 * scale);

  const targetAmount = config.amountNumber || 5000000;
  const currentVal = Math.floor(targetAmount * countProg);
  const symbol = config.currencySymbol || '₹';
  const formattedVal = currentVal.toLocaleString('en-IN');

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${64 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`${symbol} ${formattedVal}`, cardX + 48 * scale, cardY + 130 * scale);

  const badgeW = 160 * scale;
  const badgeH = 40 * scale;
  const badgeX = cardX + cardW - badgeW - 48 * scale;
  const badgeY = cardY + 105 * scale;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 20 * scale);
  ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('▲ +84.5%', badgeX + badgeW / 2, badgeY + 26 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.subtitle || 'ARR Goal Reached 30 Days Ahead of Schedule', cardX + 48 * scale, cardY + 195 * scale);

  ctx.restore();
}

// ==========================================
// 6. CASH & CONFETTI EXPLOSION
// ==========================================
export function renderMoneyCashExplosion(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2;
  const symbol = config.currencySymbol || '₹';

  ctx.save();

  const pCount = 36;
  const expProg = windowProgress(progress, 0.05, 0.90, Easing.easeOutQuart);

  for (let i = 0; i < pCount; i++) {
    const angle = (i / pCount) * Math.PI * 2 + ((i * 17) % 3);
    const speed = 300 + ((i * 37) % 400);
    const dist = expProg * speed * scale;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist + expProg * 120 * scale;
    const rot = expProg * (i % 2 === 0 ? 5 : -5);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);

    if (i % 2 === 0) {
      roundRect(ctx, -28 * scale, -14 * scale, 56 * scale, 28 * scale, 3 * scale);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${10 * scale}px system-ui`;
      ctx.textAlign = 'center';
      ctx.fillText(symbol, 0, 4 * scale);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5 * scale;
      ctx.stroke();
    }

    ctx.restore();
  }

  const badgeProg = windowProgress(progress, 0.08, 0.28, Easing.easeOutBack);
  if (badgeProg > 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(badgeProg, badgeProg);

    const bW = 680 * scale;
    const bH = 180 * scale;
    roundRect(ctx, -bW / 2, -bH / 2, bW, bH, 28 * scale);
    ctx.fillStyle = '#dc2626';
    ctx.shadowColor = 'rgba(220, 38, 38, 0.6)';
    ctx.shadowBlur = 40 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 4 * scale;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${52 * scale}px Impact, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.title || 'BIG MONEY SHOT!', 0, -20 * scale);

    ctx.fillStyle = '#fef08a';
    ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || `${symbol} 50 LAKHS BOUNTY CLAIMED`, 0, 35 * scale);

    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 7. GLOWING CRYPTO COIN
// ==========================================
export function renderMoneyCryptoCoin(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 30 * scale;
  const radius = 150 * scale;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutBack);
  const rotAngle = progress * Math.PI * 2;
  const scaleX = Math.cos(rotAngle);

  ctx.save();

  const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2.2);
  glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.15)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scaleX * enterProg, enterProg);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = '#6366f1';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#6366f1';
  ctx.lineWidth = 6 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  const faceGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  faceGrad.addColorStop(0, '#1e1b4b');
  faceGrad.addColorStop(1, '#312e81');
  ctx.fillStyle = faceGrad;
  ctx.fill();

  ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)';
  ctx.lineWidth = 2 * scale;
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * (radius * 0.45), Math.sin(angle) * (radius * 0.45));
    ctx.lineTo(Math.cos(angle) * (radius * 0.78), Math.sin(angle) * (radius * 0.78));
    ctx.stroke();
  }

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${radius * 0.8}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.currencySymbol || '₿', 0, 4 * scale);

  ctx.restore();

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${38 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.title || 'WEB3 TOKEN MINT', cx, cy + radius + 70 * scale);

  ctx.fillStyle = config.accentColor || '#38bdf8';
  ctx.font = `600 ${20 * scale}px monospace`;
  ctx.fillText(config.subtitle || 'CIRCULATING SUPPLY: 1,000,000,000', cx, cy + radius + 110 * scale);

  ctx.restore();
}

// ==========================================
// 8. SAVINGS & INVESTMENT GOAL
// ==========================================
export function renderMoneyPiggyBank(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 760 * scale;
  const cardH = 340 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutQuart);
  const fillProg = windowProgress(progress, 0.10, 0.75, Easing.easeOutQuart);
  const symbol = config.currencySymbol || '₹';

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 32 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = `bold ${32 * scale}px system-ui`;
  ctx.textAlign = 'left';
  ctx.fillText('🏦', cardX + 44 * scale, cardY + 54 * scale);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'ANNUAL SAVINGS GOAL', cardX + 96 * scale, cardY + 54 * scale);

  const target = config.amountNumber || 2500000;
  const current = Math.floor(target * fillProg);

  ctx.fillStyle = '#38bdf8';
  ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`${symbol} ${current.toLocaleString('en-IN')}`, cardX + 44 * scale, cardY + 125 * scale);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(`TARGET: ${symbol} ${target.toLocaleString('en-IN')}`, cardX + cardW - 44 * scale, cardY + 125 * scale);

  const barW = cardW - 88 * scale;
  const barH = 28 * scale;
  const barX = cardX + 44 * scale;
  const barY = cardY + 170 * scale;

  roundRect(ctx, barX, barY, barW, barH, 14 * scale);
  ctx.fillStyle = '#1e293b';
  ctx.fill();

  const filledW = barW * fillProg;
  if (filledW > 0) {
    roundRect(ctx, barX, barY, filledW, barH, 14 * scale);
    const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    barGrad.addColorStop(0, config.primaryColor || '#06b6d4');
    barGrad.addColorStop(1, config.secondaryColor || '#3b82f6');
    ctx.fillStyle = barGrad;
    ctx.fill();
  }

  const percent = Math.floor(fillProg * 100);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`${percent}% ACHIEVED`, barX, barY + 60 * scale);

  ctx.fillStyle = '#22c55e';
  ctx.textAlign = 'right';
  ctx.fillText('ON TRACK FOR COMPLETION ✓', barX + barW, barY + 60 * scale);

  ctx.restore();
}

// ==========================================
// 9. PAYMENT RECEIVED NOTIFICATION TOAST
// ==========================================
export function renderMoneyTransactionPill(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 620 * scale;
  const cardH = 110 * scale;
  const cardX = (width - cardW) / 2;
  const targetY = 70 * scale;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutBack);
  const currentY = -cardH + (targetY + cardH) * enterProg;
  const symbol = config.currencySymbol || '₹';

  ctx.save();

  roundRect(ctx, cardX, currentY, cardW, cardH, 28 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 32 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  const iconX = cardX + 50 * scale;
  const iconY = currentY + cardH / 2;
  ctx.beginPath();
  ctx.arc(iconX, iconY, 26 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${26 * scale}px system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', iconX, iconY);

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || `${symbol} 50,000 Received`, iconX + 44 * scale, iconY - 14 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Payment transferred via UPI / Bank Wire', iconX + 44 * scale, iconY + 18 * scale);

  ctx.restore();
}

// ==========================================
// 10. WEALTH CARD / NET WORTH PORTFOLIO
// ==========================================
export function renderMoneyNetWorth(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 840 * scale;
  const cardH = 460 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);
  const symbol = config.currencySymbol || '₹';

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(10, 15, 29, 0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#eab308';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('PORTFOLIO NET WORTH', cardX + 48 * scale, cardY + 44 * scale);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${64 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || `${symbol} 8,50,00,000`, cardX + 48 * scale, cardY + 84 * scale);

  const assets = [
    { label: 'EQUITIES & MUTUAL FUNDS', val: `${symbol} 4.2 Cr`, change: '+24.8%' },
    { label: 'REAL ESTATE ASSETS', val: `${symbol} 3.1 Cr`, change: '+12.4%' },
    { label: 'GOLD & CASH LIQUIDITY', val: `${symbol} 1.2 Cr`, change: '+8.2%' },
  ];

  const colW = (cardW - 96 * scale - 32 * scale) / 3;
  const startY = cardY + 200 * scale;

  assets.forEach((a, i) => {
    const colX = cardX + 48 * scale + i * (colW + 16 * scale);
    roundRect(ctx, colX, startY, colW, 190 * scale, 16 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = `bold ${12 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(a.label, colX + 18 * scale, startY + 24 * scale);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(a.val, colX + 18 * scale, startY + 68 * scale);

    ctx.fillStyle = '#22c55e';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(a.change, colX + 18 * scale, startY + 120 * scale);
  });

  ctx.restore();
}

// ==========================================
// 11. INDIAN NOTE 3D SHOWCASE (INTERACTIVE INSPECTION)
// ==========================================
export function renderMoneyIndianNoteShowcase(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 25 * scale;
  const noteW = 680 * scale;
  const noteH = 310 * scale;
  const denom = (config.denomination as any) || '2000';

  const enterProg = windowProgress(progress, 0, 0.15, Easing.easeOutBack);
  const tiltCycle = Math.sin(progress * Math.PI * 2) * 0.08;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-cx, -cy);

  // Background Ambient Glow matching the note's authentic denomination hue
  const noteInfo = INDIAN_NOTE_STYLES[denom] || INDIAN_NOTE_STYLES['2000'];
  const glow = ctx.createRadialGradient(cx, cy, 80 * scale, cx, cy, 400 * scale);
  glow.addColorStop(0, `${noteInfo.baseColor}44`);
  glow.addColorStop(0.6, `${noteInfo.baseColor}11`);
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 400 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Draw 3D Tilting Single Note
  drawIndianBanknote(
    ctx,
    cx,
    cy,
    noteW,
    noteH,
    denom,
    config.primaryColor,
    config.secondaryColor,
    tiltCycle,
    '7BC 839215'
  );

  // Bottom Title & Denomination Tag
  const textProg = windowProgress(progress, 0.25, 0.45, Easing.easeOutQuart);
  if (textProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + noteH / 2 + 75 * scale);
    ctx.scale(textProg, textProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${42 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || `INDIAN ₹${denom} SPECIMEN NOTE`, 0, 0);

    ctx.fillStyle = noteInfo.accentGlow;
    ctx.font = `bold 18 * scale}px monospace`;
    ctx.fillText(config.subtitle || `${noteInfo.hindiWord} • ${noteInfo.englishWord}`, 0, 34 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 12. CASH FANNING / MONEY SPREAD
// ==========================================
export function renderMoneyCashFanning(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 + 10 * scale;
  const noteW = 460 * scale;
  const noteH = 210 * scale;
  const denom = (config.denomination as any) || '500';

  const enterProg = windowProgress(progress, 0, 0.15, Easing.easeOutQuart);
  const fanProg = windowProgress(progress, 0.08, 0.45, Easing.easeOutBack);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-cx, -cy);

  // Fan of 7 Indian notes spreading out from a central hinge
  const fanCount = 7;
  for (let i = 0; i < fanCount; i++) {
    const normalizedIdx = i - (fanCount - 1) / 2; // -3, -2, -1, 0, 1, 2, 3
    const targetAngle = normalizedIdx * 0.14 * fanProg;
    const xOffset = normalizedIdx * 45 * scale * fanProg;
    const yOffset = Math.abs(normalizedIdx) * 12 * scale * fanProg;

    drawIndianBanknote(
      ctx,
      cx + xOffset,
      cy - 40 * scale + yOffset,
      noteW,
      noteH,
      denom,
      config.primaryColor,
      config.secondaryColor,
      targetAngle,
      `8DL 10482${i}`
    );
  }

  // Header Title
  const textProg = windowProgress(progress, 0.35, 0.55, Easing.easeOutQuart);
  if (textProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + noteH / 2 + 80 * scale);
    ctx.scale(textProg, textProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || '₹ 50,000 CASH SPREAD', 0, 0);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || 'HIGH-ROLLER FINANCES • 100% SPECIMEN ENTERTAINMENT', 0, 36 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 13. INDIAN NOTES BUNDLE / WAD OF CASH
// ==========================================
export function renderMoneyIndianNotesBundle(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 35 * scale;
  const noteW = 500 * scale;
  const noteH = 230 * scale;
  const denom = (config.denomination as any) || '500';

  const enterProg = windowProgress(progress, 0, 0.18, Easing.easeOutBack);
  const bundleThick = 60 * scale; // 100 notes wad depth

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-cx, -cy);

  // Draw simulated 3D stacked depth (rim layers of 100 notes)
  const layers = 14;
  for (let l = layers; l >= 0; l--) {
    const ly = cy + l * (bundleThick / layers);
    roundRect(ctx, cx - noteW / 2, ly - noteH / 2, noteW, noteH, 6);
    ctx.fillStyle = l === 0 ? '#1e293b' : 'rgba(241, 245, 249, 0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Top Note
  drawIndianBanknote(
    ctx,
    cx,
    cy,
    noteW,
    noteH,
    denom,
    config.primaryColor,
    config.secondaryColor,
    0,
    '5KR 618924'
  );

  // Bank Currency Band (White/Gold paper strap wrapping around center of wad)
  const bandW = 95 * scale;
  const bandX = cx - bandW / 2;
  const bandY = cy - noteH / 2 - 2;
  const bandH = noteH + bundleThick + 4;

  ctx.save();
  roundRect(ctx, bandX, bandY, bandW, bandH, 4);
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 14;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Band text details (e.g. "100 PIECES / ₹50,000")
  ctx.fillStyle = '#dc2626';
  ctx.font = `bold ${10 * scale}px system-ui`;
  ctx.textAlign = 'center';
  ctx.fillText('100 PCS', cx, cy - 45 * scale);

  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${14 * scale}px system-ui`;
  const totalWadVal = parseInt(denom, 10) * 100;
  ctx.fillText(`₹${totalWadVal.toLocaleString('en-IN')}`, cx, cy - 20 * scale);

  ctx.fillStyle = '#475569';
  ctx.font = `bold ${8 * scale}px monospace`;
  ctx.fillText('BANK SEALED', cx, cy + 5 * scale);
  ctx.fillText('PROP / SPECIMEN', cx, cy + 22 * scale);
  ctx.restore();

  // Bottom Title
  const textProg = windowProgress(progress, 0.30, 0.50, Easing.easeOutQuart);
  if (textProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + noteH / 2 + bundleThick + 60 * scale);
    ctx.scale(textProg, textProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || `₹${totalWadVal.toLocaleString('en-IN')} CASH BUNDLE`, 0, 0);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || `100 NOTES OF ₹${denom} • ENTERTAINMENT PROP SAMPLE`, 0, 36 * scale);
    ctx.restore();
  }

  ctx.restore();
}

