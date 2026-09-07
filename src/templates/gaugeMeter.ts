import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderGaugeMeter(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const targetVal = config.metricEnd ?? 88;
  const maxVal = 100;

  const scale = width / 1920;
  const cardWidth = 860 * scale;
  const cardHeight = 640 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Rapid entrance
  const cardEntrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const cardAlpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // Background Card
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

  // Card Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Header Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'System Health & Load', width / 2, cardY + 40 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Real-time performance throughput', width / 2, cardY + 82 * scale);

  // Gauge Arch
  const centerX = width / 2;
  const centerY = cardY + 400 * scale;
  const radius = 220 * scale;
  const lineWidth = 38 * scale;
  const startAngle = Math.PI * 0.8;
  const endAngle = Math.PI * 2.2;
  const totalAngleSpan = endAngle - startAngle;

  // Track arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.stroke();

  // Active arc
  const animProg = windowProgress(progress, 0.06, 0.38, Easing.easeOutQuart);
  const currentVal = lerp(0, targetVal, animProg);
  const activeAngle = startAngle + (currentVal / maxVal) * totalAngleSpan;

  if (animProg > 0.01) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, activeAngle, false);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    const grad = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    grad.addColorStop(0, config.secondaryColor || '#38bdf8');
    grad.addColorStop(0.5, config.primaryColor || '#6366f1');
    grad.addColorStop(1, config.accentColor || '#ec4899');
    ctx.strokeStyle = grad;
    ctx.stroke();
  }

  // Needle indicator
  const needleLen = radius - 30 * scale;
  const needleAngle = activeAngle;
  const needleX = centerX + Math.cos(needleAngle) * needleLen;
  const needleY = centerY + Math.sin(needleAngle) * needleLen;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(needleX, needleY);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Center Hub Pin
  ctx.beginPath();
  ctx.arc(centerX, centerY, 18 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 8 * scale, 0, Math.PI * 2);
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fill();

  // Big Value in center
  const displayVal = Math.round(currentVal);
  const prefix = config.prefix || '';
  const suffix = config.suffix || '%';

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${68 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${prefix}${displayVal}${suffix}`, centerX, centerY - 45 * scale);

  // Status Badge below
  if (config.badgeText) {
    const badgeText = config.badgeText;
    ctx.font = `bold ${15 * scale}px system-ui, -apple-system, sans-serif`;
    const bW = ctx.measureText(badgeText).width + 28 * scale;
    const bH = 34 * scale;
    const bX = centerX - bW / 2;
    const bY = centerY + 70 * scale;

    roundRect(ctx, bX, bY, bW, bH, 17 * scale);
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, centerX, bY + bH / 2);
  }

  ctx.restore();
}
