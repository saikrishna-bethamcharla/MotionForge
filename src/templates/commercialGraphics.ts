import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

// ==========================================
// 1. PRODUCT REVEAL
// ==========================================
export function renderCommProductReveal(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 920 * scale;
  const cardH = 540 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Background Spotlight
  const grad = ctx.createRadialGradient(width / 2, height / 2, 50 * scale, width / 2, height / 2, 500 * scale);
  grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Showcase Card
  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.94)';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#6366f1';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Floating 3D Device / Box Mockup placeholder
  const boxS = 180 * scale * enterProg;
  const bx = cardX + 180 * scale;
  const by = cardY + cardH / 2;
  ctx.save();
  ctx.translate(bx, by);
  roundRect(ctx, -boxS / 2, -boxS / 2, boxS, boxS, 20 * scale);
  const bGrad = ctx.createLinearGradient(-boxS / 2, -boxS / 2, boxS / 2, boxS / 2);
  bGrad.addColorStop(0, config.primaryColor || '#6366f1');
  bGrad.addColorStop(1, config.secondaryColor || '#38bdf8');
  ctx.fillStyle = bGrad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('3D', 0, 0);
  ctx.restore();

  // Text & Pricing
  const textX = cardX + 340 * scale;
  ctx.fillStyle = config.accentColor || '#38bdf8';
  ctx.font = `bold 16 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('OFFICIAL PRODUCT LAUNCH', textX, cardY + 90 * scale);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'ULTRA SOUND PRO X', textX, cardY + 130 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Active noise cancellation • 48hr battery', textX, cardY + 200 * scale);

  // Price & CTA
  ctx.fillStyle = '#22c55e';
  ctx.font = `900 ${48 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.productPrice || '$199', textX, cardY + 280 * scale);

  // CTA Pill
  const btnW = 220 * scale;
  const btnH = 50 * scale;
  roundRect(ctx, textX + 160 * scale, cardY + 285 * scale, btnW, btnH, 25 * scale);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.ctaText || 'ORDER NOW ➔', textX + 160 * scale + btnW / 2, cardY + 285 * scale + btnH / 2);

  ctx.restore();
}

// ==========================================
// 2. PRODUCT SHOWCASE
// ==========================================
export function renderCommProductShowcase(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1000 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  // Header Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${40 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'ENGINEERED FOR SUPREMACY', width / 2, cardY + 45 * scale);

  // 3 Feature Pill Cards
  const specs = [
    { title: 'LIGHTWEIGHT', desc: 'Carbon-Fiber Unibody (180g)', icon: '⚡' },
    { title: 'HYPER-FAST', desc: 'Sub-millisecond latency', icon: '🚀' },
    { title: 'ALL-DAY POWER', desc: 'Fast USB-C Rapid Recharge', icon: '🔋' },
  ];

  const colW = (cardW - 80 * scale - 40 * scale) / 3;
  specs.forEach((s, idx) => {
    const sProg = windowProgress(progress, 0.12 + idx * 0.08, 0.28 + idx * 0.08, Easing.easeOutBack);
    if (sProg > 0) {
      const cx = cardX + 40 * scale + idx * (colW + 20 * scale);
      const cy = cardY + 140 * scale;
      ctx.save();
      roundRect(ctx, cx, cy, colW, 260 * scale, 18 * scale);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5 * scale;
      ctx.stroke();

      // Icon
      ctx.font = `${48 * scale}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(s.icon, cx + colW / 2, cy + 65 * scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(s.title, cx + colW / 2, cy + 145 * scale);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `500 ${15 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(s.desc, cx + colW / 2, cy + 185 * scale);
      ctx.restore();
    }
  });

  ctx.restore();
}

// ==========================================
// 3. PRICE TAG
// ==========================================
export function renderCommPriceTag(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.10, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);

  // Price Tag Card
  const tagW = 500 * scale;
  const tagH = 260 * scale;
  roundRect(ctx, -tagW / 2, -tagH / 2, tagW, tagH, 24 * scale);
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Strikethrough Original Price
  ctx.fillStyle = '#94a3b8';
  ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.originalPrice || '$99.00', 0, -45 * scale);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(-70 * scale, -55 * scale);
  ctx.lineTo(70 * scale, -35 * scale);
  ctx.stroke();

  // Big Discounted Price
  ctx.fillStyle = '#22c55e';
  ctx.font = `900 ${76 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.productPrice || '$49.00', 0, 35 * scale);

  // Tagline
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${16 * scale}px monospace`;
  ctx.fillText('LIMITED TIME SPECIAL OFFER', 0, 85 * scale);

  ctx.restore();
}

// ==========================================
// 4. DISCOUNT BADGE
// ==========================================
export function renderCommDiscountBadge(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutElastic);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);

  // Starburst Stamp Circle
  const r = 160 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${76 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.discountPercent || '50%', 0, -25 * scale);

  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('OFF', 0, 45 * scale);

  ctx.restore();
}

// ==========================================
// 5. SALE ANIMATION
// ==========================================
export function renderCommSaleAnim(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const barH = 140 * scale;
  const barY = height / 2 - barH / 2;

  // Angled Sale Ribbon
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, barY, width, barH);

  // Diagonal Stripes
  ctx.fillStyle = '#b91c1c';
  for (let x = -width; x < width * 2; x += 120 * scale) {
    ctx.beginPath();
    ctx.moveTo(x, barY);
    ctx.lineTo(x + 50 * scale, barY);
    ctx.lineTo(x - 20 * scale, barY + barH);
    ctx.lineTo(x - 70 * scale, barY + barH);
    ctx.fill();
  }

  // Giant Sale Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${72 * scale}px Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.saleTitle || 'FLASH SALE • UP TO 70% OFF', width / 2, barY + barH / 2);

  ctx.restore();
}

// ==========================================
// 6. FEATURE CALLOUT
// ==========================================
export function renderCommFeatureCallout(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const targetX = width / 2 - 100 * scale;
  const targetY = height / 2;
  const calloutX = targetX + 180 * scale;
  const calloutY = targetY - 90 * scale;

  // Target Pin Dot
  ctx.beginPath();
  ctx.arc(targetX, targetY, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Pointer Line
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(calloutX, calloutY);
  ctx.lineTo(calloutX + 280 * scale, calloutY);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Callout Box
  roundRect(ctx, calloutX, calloutY - 70 * scale, 340 * scale, 65 * scale, 12 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.title || 'Aerospace Alloy Frame', calloutX + 20 * scale, calloutY - 37 * scale);

  ctx.restore();
}

// ==========================================
// 7. PRODUCT COMPARISON
// ==========================================
export function renderCommProductComparison(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 960 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  // Table Columns Header
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Features', cardX + 48 * scale, cardY + 54 * scale);

  ctx.fillStyle = '#6366f1';
  ctx.textAlign = 'center';
  ctx.fillText(config.title || 'OUR PRODUCT', cardX + cardW - 280 * scale, cardY + 54 * scale);

  ctx.fillStyle = '#64748b';
  ctx.fillText('OTHERS', cardX + cardW - 90 * scale, cardY + 54 * scale);

  // Feature Rows
  const rows = ['Zero Server Cost', 'Export Alpha Transparent WebM', 'Procedural Audio Engine', 'Ultra Fast 60 FPS'];
  const startY = cardY + 120 * scale;
  const rowH = 75 * scale;

  rows.forEach((r, i) => {
    const ry = startY + i * rowH;
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(r, cardX + 48 * scale, ry + 20 * scale);

    // Our Checkmark
    ctx.fillStyle = '#22c55e';
    ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✓', cardX + cardW - 280 * scale, ry + 20 * scale);

    // Other's Cross
    ctx.fillStyle = '#ef4444';
    ctx.fillText('✕', cardX + cardW - 90 * scale, ry + 20 * scale);
  });

  ctx.restore();
}

// ==========================================
// 8. PRODUCT ROTATION
// ==========================================
export function renderCommProductRotation(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const cx = width / 2;
  const cy = height / 2;

  // Rotating Elliptical Pedestal
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy + 120 * scale, 300 * scale, 60 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.shadowColor = '#6366f1';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // 360 Degree Spinning Ring
  const rot = progress * Math.PI * 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  roundRect(ctx, -70 * scale, -70 * scale, 140 * scale, 140 * scale, 24 * scale);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('360°', 0, 0);
  ctx.restore();

  // Title on Top
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.title || '360° INTERACTIVE VIEW', cx, cy - 160 * scale);

  ctx.restore();
}

// ==========================================
// 9. BENEFITS LIST
// ==========================================
export function renderCommBenefitsList(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 860 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'WHY CHOOSE MOTIONFORGE?', cardX + 48 * scale, cardY + 54 * scale);

  const benefits = [
    'Save 10+ hours per video on motion design',
    'Drag-and-drop into Premiere, DaVinci, and CapCut',
    'No monthly cloud render fees or subscription traps',
    '100% private, runs offline directly in your browser',
  ];

  const startY = cardY + 120 * scale;
  const rowH = 75 * scale;

  benefits.forEach((b, i) => {
    const bProg = windowProgress(progress, 0.10 + i * 0.08, 0.25 + i * 0.08, Easing.easeOutBack);
    if (bProg > 0) {
      const ry = startY + i * rowH;
      ctx.fillStyle = '#22c55e';
      ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText('✓', cardX + 48 * scale, ry + 20 * scale);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(b, cardX + 90 * scale, ry + 20 * scale);
    }
  });

  ctx.restore();
}

// ==========================================
// 10. CTA BANNER
// ==========================================
export function renderCommCtaBanner(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 900 * scale;
  const cardH = 120 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, cardY + cardH / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -(cardY + cardH / 2));

  // Glowing Gradient Banner
  roundRect(ctx, cardX, cardY, cardW, cardH, 28 * scale);
  const grad = ctx.createLinearGradient(cardX, 0, cardX + cardW, 0);
  grad.addColorStop(0, config.primaryColor || '#6366f1');
  grad.addColorStop(1, config.secondaryColor || '#ec4899');
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Title on Left
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.title || 'LIMITED OFFER: GET 50% OFF', cardX + 40 * scale, cardY + cardH / 2);

  // Button on Right
  const btnW = 200 * scale;
  const btnH = 56 * scale;
  const btnX = cardX + cardW - btnW - 30 * scale;
  const btnY = cardY + (cardH - btnH) / 2;

  roundRect(ctx, btnX, btnY, btnW, btnH, 28 * scale);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.ctaText || 'CLAIM NOW ➔', btnX + btnW / 2, btnY + btnH / 2);

  ctx.restore();
}

// ==========================================
// 11. WEBSITE / APP REVEAL
// ==========================================
export function renderCommAppReveal(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const phoneW = 380 * scale;
  const phoneH = 680 * scale;
  const phoneX = width / 2 - phoneW - 40 * scale;
  const phoneY = (height - phoneH) / 2;

  // Smartphone Frame
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 44 * scale);
  ctx.fillStyle = '#1e293b';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Screen Area
  roundRect(ctx, phoneX + 16 * scale, phoneY + 16 * scale, phoneW - 32 * scale, phoneH - 32 * scale, 32 * scale);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('LIVE APP PREVIEW', phoneX + phoneW / 2, phoneY + phoneH / 2);

  // Right Side Text
  const textX = width / 2 + 50 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${48 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'NOW AVAILABLE ON MOBILE', textX, height / 2 - 40 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Download on iOS and Android today', textX, height / 2 + 20 * scale);

  ctx.restore();
}

// ==========================================
// 12. QR CODE ANIMATION
// ==========================================
export function renderCommQrCode(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 420 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Simulated QR Code Blocks
  const qrX = cardX + 60 * scale;
  const qrY = cardY + 60 * scale;
  const qrS = 300 * scale;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(qrX, qrY, qrS, qrS);

  // White inner patterns
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX + 30 * scale, qrY + 30 * scale, 60 * scale, 60 * scale);
  ctx.fillRect(qrX + qrS - 90 * scale, qrY + 30 * scale, 60 * scale, 60 * scale);
  ctx.fillRect(qrX + 30 * scale, qrY + qrS - 90 * scale, 60 * scale, 60 * scale);

  // Animated Scan Line
  const scanY = qrY + (progress * 2 % 1) * qrS;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(qrX, scanY);
  ctx.lineTo(qrX + qrS, scanY);
  ctx.stroke();

  // Scan To Buy label
  ctx.fillStyle = '#0f172a';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(config.title || 'SCAN TO ORDER', cardX + cardW / 2, cardY + cardH - 50 * scale);

  ctx.restore();
}

// ==========================================
// 13. TESTIMONIAL CARD
// ==========================================
export function renderCommTestimonialCard(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 860 * scale;
  const cardH = 340 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // enterProg
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 20 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 5 Stars
  ctx.fillStyle = '#f59e0b';
  ctx.font = `${32 * scale}px serif`;
  ctx.textAlign = 'left';
  ctx.fillText('★★★★★', cardX + 48 * scale, cardY + 54 * scale);

  // Testimonial quote
  ctx.fillStyle = '#ffffff';
  ctx.font = `italic 600 ${26 * scale}px Georgia, serif`;
  ctx.fillText(config.quoteText || '“The best investment we made for our marketing team this year.”', cardX + 48 * scale, cardY + 120 * scale, cardW - 96 * scale);

  // Author info
  ctx.fillStyle = '#38bdf8';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'David Miller', cardX + 48 * scale, cardY + 230 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'VP of Growth • TechFlow', cardX + 48 * scale, cardY + 265 * scale);

  ctx.restore();
}
