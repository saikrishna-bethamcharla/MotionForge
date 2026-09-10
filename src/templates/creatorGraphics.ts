import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

// ==========================================
// 1. SUBSCRIBE CTA
// ==========================================
export function renderCreatorSubscribeCta(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 680 * scale;
  const cardH = 110 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, cardY + cardH / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -(cardY + cardH / 2));

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Avatar / Channel initial
  const avX = cardX + 32 * scale;
  const avY = cardY + cardH / 2;
  ctx.beginPath();
  ctx.arc(avX, avY, 28 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('▶', avX, avY);

  // Channel Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'Creator Studio', avX + 44 * scale, avY - 14 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || '1.4M Subscribers', avX + 44 * scale, avY + 14 * scale);

  // Subscribe Pill Transformation
  const subProg = windowProgress(progress, 0.20, 0.40, Easing.easeOutCubic);
  const isSubbed = subProg > 0.6;

  const btnW = 180 * scale;
  const btnH = 52 * scale;
  const btnX = cardX + cardW - btnW - 24 * scale;
  const btnY = cardY + (cardH - btnH) / 2;

  roundRect(ctx, btnX, btnY, btnW, btnH, 26 * scale);
  ctx.fillStyle = isSubbed ? 'rgba(255, 255, 255, 0.15)' : '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(isSubbed ? '✓ SUBSCRIBED' : 'SUBSCRIBE', btnX + btnW / 2, btnY + btnH / 2);

  ctx.restore();
}

// ==========================================
// 2. "LIKE & SUBSCRIBE"
// ==========================================
export function renderCreatorLikeSub(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 640 * scale;
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

  roundRect(ctx, cardX, cardY, cardW, cardH, 48 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Like Button with Bounce
  const likeProg = windowProgress(progress, 0.15, 0.30, Easing.easeOutBack);
  const isLiked = likeProg > 0.7;

  ctx.fillStyle = isLiked ? '#38bdf8' : '#ffffff';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('👍 LIKE', cardX + 50 * scale, cardY + cardH / 2);

  // Divider
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(cardX + 220 * scale, cardY + 24 * scale, 1.5 * scale, cardH - 48 * scale);

  // Subscribe Button
  const subProg = windowProgress(progress, 0.32, 0.45, Easing.easeOutBack);
  const isSubbed = subProg > 0.7;

  ctx.fillStyle = isSubbed ? '#22c55e' : '#dc2626';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(isSubbed ? '✓ SUBSCRIBED' : '🔔 SUBSCRIBE', cardX + 260 * scale, cardY + cardH / 2);

  ctx.restore();
}

// ==========================================
// 3. COMMENT CTA
// ==========================================
export function renderCreatorCommentCta(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 700 * scale;
  const cardH = 110 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = height - cardH - 90 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, cardY + cardH / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -(cardY + cardH / 2));

  // Speech Bubble Shape
  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#6366f1';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Chat Icon
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💬', cardX + 54 * scale, cardY + cardH / 2);

  // Question Prompt
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'WHAT DO YOU THINK?', cardX + 100 * scale, cardY + cardH * 0.38);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Drop your thoughts in the comments below!', cardX + 100 * scale, cardY + cardH * 0.72);

  ctx.restore();
}

// ==========================================
// 4. NEW VIDEO INTRO
// ==========================================
export function renderCreatorVideoIntro(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const cy = height / 2;

  // Category Tag Pill
  const pillW = 200 * scale;
  const pillH = 38 * scale;
  roundRect(ctx, width / 2 - pillW / 2, cy - 80 * scale, pillW, pillH, 19 * scale);
  ctx.fillStyle = config.primaryColor || '#ec4899';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.badgeText || 'NEW EPISODE', width / 2, cy - 80 * scale + pillH / 2);

  // Giant Punchy Video Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${68 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'THE ULTIMATE CREATOR SETUP', width / 2, cy + 10 * scale);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Episode 42 • Full Studio Tour', width / 2, cy + 70 * scale);

  ctx.restore();
}

// ==========================================
// 5. CHAPTER TITLE
// ==========================================
export function renderCreatorChapterTitle(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 680 * scale;
  const cardH = 90 * scale;
  const cardX = 90 * scale;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX - (1 - enterProg) * 60 * scale;

  roundRect(ctx, currentX, cardY, cardW, cardH, 16 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Timestamp Tag
  const tagW = 110 * scale;
  const tagH = 46 * scale;
  roundRect(ctx, currentX + 22 * scale, cardY + (cardH - tagH) / 2, tagW, tagH, 10 * scale);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${18 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.dateText || '04:15', currentX + 22 * scale + tagW / 2, cardY + cardH / 2);

  // Chapter Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'Phase 2: Hardware Architecture', currentX + 154 * scale, cardY + cardH / 2);

  ctx.restore();
}

// ==========================================
// 6. "COMING UP..."
// ==========================================
export function renderCreatorComingUp(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 560 * scale;
  const cardH = 110 * scale;
  const cardX = 90 * scale;
  const cardY = 90 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 16 * scale);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  ctx.strokeStyle = config.accentColor || '#f59e0b';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.font = `900 ${16 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('// COMING UP NEXT //', cardX + 28 * scale, cardY + 22 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${26 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'The $10,000 Blind Camera Test', cardX + 28 * scale, cardY + 54 * scale);

  ctx.restore();
}

// ==========================================
// 7. "PREVIOUSLY..."
// ==========================================
export function renderCreatorPreviously(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const cardW = 580 * scale;
  const cardH = 100 * scale;
  const cardX = 90 * scale;
  const cardY = 90 * scale;

  roundRect(ctx, cardX, cardY, cardW, cardH, 14 * scale);
  ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.font = `bold 16 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('⏪ PREVIOUSLY ON THE CHANNEL:', cardX + 28 * scale, cardY + 20 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'We Built an AI Automation Farm', cardX + 28 * scale, cardY + 52 * scale);

  ctx.restore();
}

// ==========================================
// 8. "MEANWHILE..."
// ==========================================
export function renderCreatorMeanwhile(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);

  // Comic / Meme Box
  const bw = 540 * scale;
  const bh = 140 * scale;
  roundRect(ctx, -bw / 2, -bh / 2, bw, bh, 18 * scale);
  ctx.fillStyle = '#facc15'; // Bright yellow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.font = `900 ${52 * scale}px Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.title || 'MEANWHILE...', 0, 0);

  ctx.restore();
}

// ==========================================
// 9. "POV:"
// ==========================================
export function renderCreatorPov(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const cardW = 760 * scale;
  const cardH = 110 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = 100 * scale;

  roundRect(ctx, cardX, cardY, cardW, cardH, 20 * scale);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fill();

  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#ec4899';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('POV:', cardX + 36 * scale, cardY + cardH / 2);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'You just found the ultimate free motion graphics app', cardX + 130 * scale, cardY + cardH / 2);

  ctx.restore();
}

// ==========================================
// 10. "DID YOU KNOW?"
// ==========================================
export function renderCreatorDidYouKnow(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 900 * scale;
  const cardH = 340 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = config.primaryColor || '#38bdf8';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Header Pill
  ctx.fillStyle = config.primaryColor || '#38bdf8';
  roundRect(ctx, cardX + 44 * scale, cardY + 36 * scale, 180 * scale, 36 * scale, 18 * scale);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💡 DID YOU KNOW?', cardX + 44 * scale + 90 * scale, cardY + 54 * scale);

  // Big Fact Title
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'Over 82% of all internet traffic is video content.', cardX + 44 * scale, cardY + 130 * scale, cardW - 88 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Adding animated motion graphics increases audience retention by 3.4x.', cardX + 44 * scale, cardY + 210 * scale, cardW - 88 * scale);

  ctx.restore();
}

// ==========================================
// 11. FACT CARD
// ==========================================
export function renderCreatorFactCard(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 860 * scale;
  const cardH = 300 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 20 * scale);
  ctx.fillStyle = 'rgba(10, 15, 29, 0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Left Green Accent
  roundRect(ctx, cardX, cardY, 8 * scale, cardH, [20 * scale, 0, 0, 20 * scale]);
  ctx.fillStyle = '#22c55e';
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.font = `900 ${16 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('QUICK FACT CHECK // VERIFIED', cardX + 36 * scale, cardY + 36 * scale);

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.title || 'Human Attention Spans Peak in First 3 Seconds', cardX + 36 * scale, cardY + 80 * scale);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Hooks and motion callouts prevent drop-off before the mid-roll.', cardX + 36 * scale, cardY + 145 * scale, cardW - 72 * scale);

  ctx.restore();
}

// ==========================================
// 12. TOP 5 LIST
// ==========================================
export function renderCreatorTop5(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 800 * scale;
  const cardH = 560 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  // Header
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.font = `900 ${30 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'TOP 5 CREATOR TOOLS', width / 2, cardY + 36 * scale);

  // 5 Items
  const items = ['#1 MotionForge Web', '#2 DaVinci Resolve', '#3 OBS Studio', '#4 Audacity', '#5 Blender 3D'];
  const startY = cardY + 110 * scale;
  const rowH = 75 * scale;

  items.forEach((item, idx) => {
    const itemProg = windowProgress(progress, 0.10 + idx * 0.08, 0.25 + idx * 0.08, Easing.easeOutBack);
    if (itemProg > 0) {
      ctx.save();
      const iy = startY + idx * rowH;
      roundRect(ctx, cardX + 44 * scale, iy, cardW - 88 * scale, 58 * scale, 12 * scale);
      ctx.fillStyle = idx === 0 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fill();

      ctx.fillStyle = idx === 0 ? '#818cf8' : '#ffffff';
      ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, cardX + 68 * scale, iy + 29 * scale);
      ctx.restore();
    }
  });

  ctx.restore();
}

// ==========================================
// 13. COUNTDOWN
// ==========================================
export function renderCreatorCountdown(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  // 5 to 1 Countdown
  const currentNum = 5 - Math.min(4, Math.floor(progress * 5));
  const frac = (progress * 5) % 1;
  const pulseScale = 1 + (1 - frac) * 0.3;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(pulseScale, pulseScale);

  // Outer Ring
  ctx.beginPath();
  ctx.arc(0, 0, 140 * scale, 0, Math.PI * 2 * (1 - frac));
  ctx.strokeStyle = config.primaryColor || '#dc2626';
  ctx.lineWidth = 12 * scale;
  ctx.stroke();

  // Big Digit
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${140 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(currentNum), 0, 0);

  ctx.restore();
}

// ==========================================
// 14. REACTION POPUP
// ==========================================
export function renderCreatorReactionPopup(rc: RenderContext) {
  const { ctx, width, height, progress } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.12, Easing.easeOutElastic);
  const alpha = windowProgress(progress, 0, 0.08, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg * scale, enterProg * scale);

  // Huge animated emoji cluster
  ctx.font = `${140 * scale}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('😱 🔥 🤯', 0, 0);

  ctx.restore();
}

// ==========================================
// 15. MEME-STYLE POP-UP
// ==========================================
export function renderCreatorMemePopup(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);

  // Impact Font Meme Text
  ctx.font = `900 ${76 * scale}px Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10 * scale;
  const memeText = config.title || 'WAIT... WHAT?!';
  ctx.strokeText(memeText, 0, 0);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(memeText, 0, 0);

  ctx.restore();
}

// ==========================================
// 16. END SCREEN
// ==========================================
export function renderCreatorEndScreen(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const vW = 540 * scale;
  const vH = 320 * scale;
  const vY = height / 2 - 50 * scale;

  // Next Video Card
  const v1X = width / 2 - vW - 40 * scale;
  roundRect(ctx, v1X, vY, vW, vH, 16 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WATCH NEXT ➔', v1X + vW / 2, vY + vH / 2);

  // Playlist Card
  const v2X = width / 2 + 40 * scale;
  roundRect(ctx, v2X, vY, vW, vH, 16 * scale);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.fillText('FULL PLAYLIST 📂', v2X + vW / 2, vY + vH / 2);

  // Subscribe Circle
  const avY = height - 120 * scale;
  ctx.beginPath();
  ctx.arc(width / 2, avY, 48 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('SUB', width / 2, avY);

  ctx.restore();
}
