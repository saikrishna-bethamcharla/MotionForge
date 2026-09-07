import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderTikTokPop(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardWidth = 560 * scale;
  const cardHeight = 720 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance with elastic bounce
  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // TikTok Glitch border effect during entrance
  if (progress < 0.14) {
    const glitchOffset = Math.sin(progress * 150) * 6 * scale;
    // Cyan shadow pass
    ctx.fillStyle = 'rgba(37, 244, 238, 0.25)';
    roundRect(ctx, cardX - glitchOffset, cardY, cardWidth, cardHeight, 32 * scale);
    ctx.fill();
    // Red/Pink shadow pass
    ctx.fillStyle = 'rgba(254, 44, 85, 0.25)';
    roundRect(ctx, cardX + glitchOffset, cardY, cardWidth, cardHeight, 32 * scale);
    ctx.fill();
  }

  // Card Background
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 32 * scale);
  ctx.fillStyle = 'rgba(18, 18, 18, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 20 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Avatar with TikTok Cyan/Red dual glow ring
  const avatarCenterX = width / 2;
  const avatarCenterY = cardY + 140 * scale;
  const avatarRadius = 64 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarCenterX - 3 * scale, avatarCenterY, avatarRadius + 4 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = '#25F4EE';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(avatarCenterX + 3 * scale, avatarCenterY, avatarRadius + 4 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = '#FE2C55';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Avatar fill
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#27272a';
  ctx.fill();

  // Avatar initials / icon
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${38 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.avatarText || 'TT', avatarCenterX, avatarCenterY);
  ctx.restore();

  // Username & Handle
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${30 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Creative Visionary', width / 2, cardY + 230 * scale);

  ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
  ctx.font = `500 ${19 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.handle || '@creator.vision', width / 2, cardY + 274 * scale);

  // Big Animated Heart Pop in Center (prog 0.16 -> 0.32)
  const heartProg = windowProgress(progress, 0.16, 0.32, Easing.easeOutElastic);
  const heartScale = heartProg > 0 ? (heartProg < 0.6 ? heartProg * 1.5 : 1 + (1 - heartProg) * 0.4) : 0;

  if (heartScale > 0.05) {
    ctx.save();
    ctx.translate(width / 2, cardY + 390 * scale);
    ctx.scale(heartScale * scale, heartScale * scale);

    // Draw Heart shape
    ctx.beginPath();
    const topCurveHeight = 28;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -45, 0, -45, topCurveHeight);
    ctx.bezierCurveTo(-45, 55, 0, 75, 0, 95);
    ctx.bezierCurveTo(0, 75, 45, 55, 45, topCurveHeight);
    ctx.bezierCurveTo(45, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();

    ctx.fillStyle = '#FE2C55';
    ctx.fill();

    // Floating sparkle particles
    if (heartProg > 0.3) {
      const pProg = windowProgress(progress, 0.20, 0.45, Easing.easeOutQuad);
      const particles = [
        { dx: -70, dy: -40, r: 5 },
        { dx: 65, dy: -35, r: 6 },
        { dx: -40, dy: 60, r: 4 },
        { dx: 50, dy: 55, r: 5 },
      ];
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.dx * pProg, p.dy * pProg, p.r * (1 - pProg), 0, Math.PI * 2);
        ctx.fillStyle = '#25F4EE';
        ctx.fill();
      });
    }
    ctx.restore();
  }

  // Follow Button (prog 0.32 -> 0.45 transitions into Followed)
  const followProg = windowProgress(progress, 0.32, 0.44, Easing.easeOutCubic);
  const isFollowed = followProg >= 0.7;

  const btnW = 380 * scale;
  const btnH = 64 * scale;
  const btnX = width / 2 - btnW / 2;
  const btnY = cardY + 530 * scale;

  roundRect(ctx, btnX, btnY, btnW, btnH, 14 * scale);
  if (isFollowed) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ Friends', width / 2, btnY + btnH / 2);
  } else {
    ctx.fillStyle = '#FE2C55';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+ Follow', width / 2, btnY + btnH / 2);
  }

  // Follower count ticker
  const countProg = windowProgress(progress, 0.20, 0.45, Easing.easeOutCubic);
  const baseCount = 450;
  const extra = Math.round(countProg * 80);
  ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
  ctx.font = `600 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${baseCount + extra}.8K Followers • 1.2M Likes`, width / 2, cardY + 635 * scale);

  ctx.restore();
}
