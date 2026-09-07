import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderGoalProgress(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const targetVal = config.metricEnd ?? 1000000;
  const currentVal = config.metricStart ?? 780000;
  const percent = Math.min(100, Math.round((currentVal / targetVal) * 100));

  const scale = width / 1920;
  const cardWidth = 1040 * scale;
  const cardHeight = 420 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const enterProg = windowProgress(progress, 0, 0.07, Easing.easeOutCubic);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Card Background
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 28 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 36 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Header Title & Goal Flag
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${34 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Annual ARR Goal', cardX + 48 * scale, cardY + 44 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Series A Milestone Tracking', cardX + 48 * scale, cardY + 88 * scale);

  // Goal Target badge on right
  const badgeText = config.badgeText || `Goal: $${(targetVal / 1000000).toFixed(1)}M`;
  ctx.font = `bold ${15 * scale}px system-ui, -apple-system, sans-serif`;
  const bW = ctx.measureText(badgeText).width + 28 * scale;
  const bH = 36 * scale;
  const bX = cardX + cardWidth - 48 * scale - bW;
  const bY = cardY + 48 * scale;
  roundRect(ctx, bX, bY, bW, bH, 18 * scale);
  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.7)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.fillStyle = '#a5b4fc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, bX + bW / 2, bY + bH / 2);

  // Big Counter Numbers
  const fillProg = windowProgress(progress, 0.08, 0.38, Easing.easeOutQuart);
  const animatedVal = Math.round(lerp(0, currentVal, fillProg));
  const prefix = config.prefix || '$';

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${52 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${prefix}${animatedVal.toLocaleString()}`, cardX + 48 * scale, cardY + 180 * scale);

  // Percentage on right of counter
  const animatedPercent = Math.round(lerp(0, percent, fillProg));
  ctx.fillStyle = '#38bdf8';
  ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillText(`${animatedPercent}% Achieved`, cardX + cardWidth - 48 * scale, cardY + 180 * scale);

  // Main Progress Bar Track
  const barY = cardY + 240 * scale;
  const barW = cardWidth - 48 * scale * 2;
  const barH = 34 * scale;

  roundRect(ctx, cardX + 48 * scale, barY, barW, barH, 17 * scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();

  // Active Fill Bar
  const activeW = Math.max(barH, (barW * (percent / 100)) * fillProg);
  roundRect(ctx, cardX + 48 * scale, barY, activeW, barH, 17 * scale);

  const grad = ctx.createLinearGradient(cardX + 48 * scale, 0, cardX + 48 * scale + activeW, 0);
  grad.addColorStop(0, config.primaryColor || '#6366f1');
  grad.addColorStop(0.5, config.secondaryColor || '#38bdf8');
  grad.addColorStop(1, '#a855f7');
  ctx.fillStyle = grad;
  ctx.fill();

  // Shimmer pulse across bar
  if (fillProg > 0.2) {
    const shimmerPos = ((progress * 2) % 1) * activeW;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cardX + 48 * scale + shimmerPos, barY + barH / 2, 14 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12 * scale;
    ctx.fill();
    ctx.restore();
  }

  // Footer status note
  ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
  ctx.font = `500 ${16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`🚀 ${(targetVal - animatedVal) > 0 ? `${prefix}${(targetVal - animatedVal).toLocaleString()} remaining to hit target` : 'Target Exceeded!'}`, cardX + 48 * scale, barY + 54 * scale);

  ctx.restore();
}
