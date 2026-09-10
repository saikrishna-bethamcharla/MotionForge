import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

// ==========================================
// 1. LOGO REVEAL
// ==========================================
export function renderBrandLogoReveal(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const ringProg = windowProgress(progress, 0, 0.22, Easing.easeOutQuart);
  const logoProg = windowProgress(progress, 0.12, 0.32, Easing.easeOutBack);
  const textProg = windowProgress(progress, 0.25, 0.45, Easing.easeOutQuart);

  const cx = width / 2;
  const cy = height / 2 - 40 * scale;

  ctx.save();

  // Expanding Energy Rings
  if (ringProg > 0 && ringProg < 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, 180 * scale * ringProg, 0, Math.PI * 2);
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = (1 - ringProg) * 8 * scale;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 260 * scale * ringProg, 0, Math.PI * 2);
    ctx.strokeStyle = config.secondaryColor || '#38bdf8';
    ctx.lineWidth = (1 - ringProg) * 4 * scale;
    ctx.stroke();
  }

  // Brand Logo Emblem
  if (logoProg > 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(logoProg, logoProg);

    // Glowing Outer Hexagon / Shield
    const emblemR = 80 * scale;
    roundRect(ctx, -emblemR, -emblemR, emblemR * 2, emblemR * 2, 28 * scale);
    const grad = ctx.createLinearGradient(-emblemR, -emblemR, emblemR, emblemR);
    grad.addColorStop(0, config.primaryColor || '#6366f1');
    grad.addColorStop(1, config.secondaryColor || '#ec4899');
    ctx.fillStyle = grad;
    ctx.shadowColor = config.primaryColor || '#6366f1';
    ctx.shadowBlur = 32 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Logo Monogram
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${68 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.brandLogoText || config.avatarText || 'M', 0, 0);

    ctx.restore();
  }

  // Brand Name & Tagline
  if (textProg > 0) {
    ctx.save();
    ctx.globalAlpha = textProg;
    const textY = cy + 130 * scale + (1 - textProg) * 20 * scale;

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${52 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || 'MOTIONFORGE', cx, textY);

    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.font = `bold 600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.letterSpacing = '4px';
    ctx.fillText(config.brandTagline || config.subtitle || 'NEXT-GENERATION VIDEO ENGINE', cx, textY + 45 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 2. LOGO ANIMATION
// ==========================================
export function renderBrandLogoAnim(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const rotProg = windowProgress(progress, 0, 0.35, Easing.easeInOutCubic);
  const scaleProg = windowProgress(progress, 0, 0.28, Easing.easeOutElastic);
  const cx = width / 2;
  const cy = height / 2 - 30 * scale;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((1 - rotProg) * -Math.PI);
  ctx.scale(scaleProg, scaleProg);

  // Rotating Multi-ring Flower / Gyroscope
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3 + progress * 2);
    roundRect(ctx, -60 * scale, -60 * scale, 120 * scale, 120 * scale, 24 * scale);
    ctx.strokeStyle = i === 0 ? (config.primaryColor || '#6366f1') : i === 1 ? (config.secondaryColor || '#38bdf8') : (config.accentColor || '#a855f7');
    ctx.lineWidth = 3.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Center Emblem Dot
  ctx.beginPath();
  ctx.arc(0, 0, 28 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();

  // Typography below
  const textAlpha = windowProgress(progress, 0.20, 0.42, Easing.easeOutQuart);
  if (textAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = textAlpha;
    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${48 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title || 'STUDIO BRAND', cx, cy + 140 * scale);
    ctx.restore();
  }
}

// ==========================================
// 3. LOGO STING
// ==========================================
export function renderBrandLogoSting(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const impactProg = windowProgress(progress, 0, 0.15, Easing.easeOutQuart);
  const flashAlpha = windowProgress(progress, 0.12, 0.25, Easing.easeOutQuad);
  const cx = width / 2;
  const cy = height / 2;

  ctx.save();

  // White Flash Impact Overlay
  if (flashAlpha > 0 && flashAlpha < 1) {
    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - flashAlpha) * 0.4})`;
    ctx.fillRect(0, 0, width, height);
  }

  // Giant Slanted Fast Emblem Slam
  const emblemScale = lerp(3.5, 1.0, impactProg);
  ctx.translate(cx, cy);
  ctx.scale(emblemScale, emblemScale);

  ctx.fillStyle = config.primaryColor || '#dc2626';
  roundRect(ctx, -70 * scale, -70 * scale, 140 * scale, 140 * scale, 22 * scale);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${72 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.brandLogoText || 'STING', 0, 0);

  ctx.restore();
}

// ==========================================
// 4. BRAND INTRO
// ==========================================
export function renderBrandIntro(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const barProg = windowProgress(progress, 0, 0.12, Easing.easeOutQuart);
  const textProg = windowProgress(progress, 0.08, 0.35, Easing.easeOutCubic);

  ctx.save();

  // Top and Bottom Cinematic Letterbox Strips
  const barH = 100 * scale * barProg;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, barH);
  ctx.fillRect(0, height - barH, width, barH);

  // Center Presentation
  if (textProg > 0) {
    ctx.save();
    ctx.globalAlpha = textProg;
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.95 + textProg * 0.05, 0.95 + textProg * 0.05);

    ctx.fillStyle = config.accentColor || '#f59e0b';
    ctx.font = `bold 16 * scale}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('PRESENTS A PRODUCTION BY', 0, -45 * scale);

    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `900 ${64 * scale}px Georgia, serif`;
    ctx.fillText(config.title || 'APEX CREATIVE LABS', 0, 25 * scale);
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 5. BRAND OUTRO
// ==========================================
export function renderBrandOutro(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const alpha = windowProgress(progress, 0, 0.06, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const cardW = 1000 * scale;
  const cardH = 480 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Thank You For Watching
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.title || 'THANK YOU FOR WATCHING', width / 2, cardY + 90 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Subscribe for new releases every week', width / 2, cardY + 140 * scale);

  // Social handles and website row
  const pillY = cardY + 230 * scale;
  const pillW = 420 * scale;
  const pillH = 54 * scale;
  const pillX = width / 2 - pillW / 2;

  roundRect(ctx, pillX, pillY, pillW, pillH, 16 * scale);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${20 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.websiteUrl || 'WWW.MOTIONFORGE.IO', width / 2, pillY + pillH / 2);

  ctx.restore();
}

// ==========================================
// 6. ANIMATED WATERMARK
// ==========================================
export function renderBrandWatermark(rc: RenderContext) {
  const { ctx, width, progress, config } = rc;
  const scale = width / 1920;

  // Discreet upper-right or lower-right watermark bug
  const wmW = 240 * scale;
  const wmH = 58 * scale;
  const wmX = width - wmW - 50 * scale;
  const wmY = 50 * scale;

  const pulse = Math.sin(progress * Math.PI * 4) * 0.1;

  ctx.save();
  ctx.globalAlpha = 0.85 + pulse;

  roundRect(ctx, wmX, wmY, wmW, wmH, 29 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // Emblem Dot
  ctx.beginPath();
  ctx.arc(wmX + 28 * scale, wmY + wmH / 2, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.title || 'MOTIONFORGE', wmX + 50 * scale, wmY + wmH / 2);

  ctx.restore();
}

// ==========================================
// 7. BRAND LOWER THIRD
// ==========================================
export function renderBrandLowerThird(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 760 * scale;
  const cardH = 110 * scale;
  const cardX = 90 * scale;
  const cardY = height - cardH - 80 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX - (1 - enterProg) * 60 * scale;

  // Background
  roundRect(ctx, currentX, cardY, cardW, cardH, 16 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 24 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Left Brand Emblem
  const embX = currentX + 32 * scale;
  const embY = cardY + cardH / 2;
  ctx.beginPath();
  ctx.arc(embX, embY, 26 * scale, 0, Math.PI * 2);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.brandLogoText || 'M', embX, embY);

  // Title & Tagline
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Brand Organization', currentX + 76 * scale, cardY + 22 * scale);

  ctx.fillStyle = config.accentColor || '#38bdf8';
  ctx.font = `600 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Official Partner Network • Verified', currentX + 76 * scale, cardY + 58 * scale);

  ctx.restore();
}

// ==========================================
// 8. BRAND COLORS TRANSITION
// ==========================================
export function renderBrandColorTransition(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  // Angled Triple Wipe across screen
  const p1 = windowProgress(progress, 0, 0.5, Easing.easeInOutCubic);
  const p2 = windowProgress(progress, 0.15, 0.65, Easing.easeInOutCubic);
  const p3 = windowProgress(progress, 0.3, 0.85, Easing.easeInOutCubic);

  ctx.save();

  const drawWipe = (p: number, color: string) => {
    if (p <= 0 || p >= 1) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    const x = -width * 0.5 + p * width * 2;
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.4, 0);
    ctx.lineTo(x - width * 0.2, height);
    ctx.lineTo(x - width * 0.6, height);
    ctx.closePath();
    ctx.fill();
  };

  drawWipe(p1, config.primaryColor || '#6366f1');
  drawWipe(p2, config.secondaryColor || '#38bdf8');
  drawWipe(p3, config.accentColor || '#ec4899');

  ctx.restore();
}

// ==========================================
// 9. BRANDED TITLE CARD
// ==========================================
export function renderBrandTitleCard(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1100 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentY = cardY + (1 - enterProg) * 30 * scale;

  // Background
  roundRect(ctx, cardX, currentY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || '#0a0a0c';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#6366f1';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Overline
  ctx.fillStyle = config.accentColor || '#38bdf8';
  ctx.font = `bold 16 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.badgeText || 'SPECIAL PRESENTATION', width / 2, currentY + 60 * scale);

  // Big Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${56 * scale}px Georgia, serif`;
  ctx.fillText(config.title || 'THE FUTURE OF VISUAL STORYTELLING', width / 2, currentY + 120 * scale);

  // Divider Rule
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fillRect(width / 2 - 100 * scale, currentY + 230 * scale, 200 * scale, 3 * scale);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Crafted with precision by our worldwide design collective', width / 2, currentY + 260 * scale);

  ctx.restore();
}

// ==========================================
// 10. BRANDED END SCREEN
// ==========================================
export function renderBrandEndScreen(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  // 2 Video Frames (Left: Next Video, Right: Best for Viewer)
  const vW = 540 * scale;
  const vH = 320 * scale;
  const vY = height / 2 - 60 * scale;

  // Left Frame
  const v1X = width / 2 - vW - 40 * scale;
  roundRect(ctx, v1X, vY, vW, vH, 16 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NEXT EPISODE', v1X + vW / 2, vY + vH / 2);

  // Right Frame
  const v2X = width / 2 + 40 * scale;
  roundRect(ctx, v2X, vY, vW, vH, 16 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillText('RECOMMENDED PLAYLIST', v2X + vW / 2, vY + vH / 2);

  // Bottom Center Subscribe Avatar Circle
  const subY = height - 140 * scale;
  ctx.beginPath();
  ctx.arc(width / 2, subY, 44 * scale, 0, Math.PI * 2);
  ctx.fillStyle = config.primaryColor || '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('SUB', width / 2, subY);

  ctx.restore();
}

// ==========================================
// 11. CTA ANIMATION & WEBSITE URL
// ==========================================
export function renderBrandCtaUrl(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 740 * scale;
  const cardH = 96 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, cardY + cardH / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -(cardY + cardH / 2));

  // Background Capsule Pill
  roundRect(ctx, cardX, cardY, cardW, cardH, 48 * scale);
  ctx.fillStyle = 'rgba(11, 15, 25, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Left CTA Button Pill
  const btnW = 200 * scale;
  roundRect(ctx, cardX + 12 * scale, cardY + 12 * scale, btnW, cardH - 24 * scale, 36 * scale);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.ctaText || 'EXPLORE NOW ➔', cardX + 12 * scale + btnW / 2, cardY + cardH / 2);

  // Animated Website URL Typing Simulation
  const fullUrl = config.websiteUrl || 'www.motionforge.io/pro';
  const charProg = windowProgress(progress, 0.10, 0.40, Easing.linear);
  const visibleChars = Math.floor(fullUrl.length * charProg);
  const displayUrl = fullUrl.slice(0, visibleChars);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${22 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(displayUrl, cardX + btnW + 36 * scale, cardY + cardH / 2);

  // Blinking Cursor
  if (progress < 0.6 && Math.floor(progress * 15) % 2 === 0) {
    const curX = cardX + btnW + 36 * scale + ctx.measureText(displayUrl).width + 4 * scale;
    ctx.fillStyle = config.accentColor || '#38bdf8';
    ctx.fillRect(curX, cardY + 32 * scale, 3 * scale, 32 * scale);
  }

  ctx.restore();
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
