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

// ==========================================
// 3. FLOATING BANKNOTE STACK
// ==========================================
export function renderMoneyBanknoteStack(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cx = width / 2;
  const cy = height / 2 - 30 * scale;

  const noteW = 460 * scale;
  const noteH = 220 * scale;
  const symbol = config.currencySymbol || '₹';
  const denom = config.denomination || '500';

  const enterProg = windowProgress(progress, 0, 0.15, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const notesCount = 5;
  for (let i = notesCount - 1; i >= 0; i--) {
    const noteProg = windowProgress(
      progress,
      0.05 + i * 0.04,
      0.25 + i * 0.04,
      Easing.easeOutBack
    );
    const floatOffset = Math.sin(progress * Math.PI * 2 + i * 0.6) * 8 * scale;
    const yOffset = (i * -26 + floatOffset) * scale;
    const rot = (i - 2) * 0.035;

    ctx.save();
    ctx.translate(cx, cy + yOffset);
    ctx.rotate(rot);
    ctx.scale(noteProg * enterProg, noteProg * enterProg);

    roundRect(ctx, -noteW / 2, -noteH / 2, noteW, noteH, 12 * scale);
    const billGrad = ctx.createLinearGradient(-noteW / 2, -noteH / 2, noteW / 2, noteH / 2);
    billGrad.addColorStop(0, config.primaryColor || '#0d9488');
    billGrad.addColorStop(1, config.secondaryColor || '#115e59');
    ctx.fillStyle = billGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 18 * scale;
    ctx.shadowOffsetY = 8 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2 * scale;
    roundRect(ctx, -noteW / 2 + 10 * scale, -noteH / 2 + 10 * scale, noteW - 20 * scale, noteH - 20 * scale, 8 * scale);
    ctx.stroke();

    ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.fillRect(noteW * 0.12, -noteH / 2 + 10 * scale, 10 * scale, noteH - 20 * scale);

    ctx.beginPath();
    ctx.arc(-noteW * 0.22, 0, 48 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${symbol}${denom}`, -noteW * 0.22, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `bold ${16 * scale}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('RESERVE BANK OF INDIA', noteW / 2 - 24 * scale, -noteH / 2 + 32 * scale);

    ctx.font = `bold ${13 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('GUARANTEED BY CENTRAL AUTHORITY', noteW / 2 - 24 * scale, -noteH / 2 + 56 * scale);

    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${15 * scale}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('7AB 938210', noteW / 2 - 24 * scale, noteH / 2 - 28 * scale);

    ctx.restore();
  }

  const titleProg = windowProgress(progress, 0.35, 0.55, Easing.easeOutQuart);
  if (titleProg > 0) {
    ctx.save();
    ctx.translate(cx, cy + noteH / 2 + 80 * scale);
    ctx.scale(titleProg, titleProg);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${40 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || 'CASH FLOW EMPIRE', 0, 0);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(config.subtitle || 'UNLIMITED LIQUIDITY ON DEMAND', 0, 36 * scale);
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
