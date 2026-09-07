import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderMetricCounter(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  const scale = width / 1920;
  const cardWidth = 840 * scale;
  const cardHeight = 440 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const entrance = windowProgress(progress, 0, 0.25, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.18, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(entrance, entrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Card Background
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 32 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.92)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 48 * scale;
  ctx.shadowOffsetY = 20 * scale;
  ctx.fill();

  // Reset shadow immediately
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Glowing Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Top Accent Gradient Line
  ctx.save();
  const accentGrad = ctx.createLinearGradient(cardX, 0, cardX + cardWidth, 0);
  accentGrad.addColorStop(0, config.primaryColor || '#6366f1');
  accentGrad.addColorStop(0.5, config.accentColor || '#38bdf8');
  accentGrad.addColorStop(1, config.secondaryColor || '#ec4899');
  roundRect(ctx, cardX + 32 * scale, cardY + 2 * scale, cardWidth - 64 * scale, 3 * scale, 2 * scale);
  ctx.fillStyle = accentGrad;
  ctx.shadowColor = config.primaryColor || '#6366f1';
  ctx.shadowBlur = 12 * scale;
  ctx.fill();
  ctx.restore();

  // Title & Pill
  const titleAlpha = windowProgress(progress, 0.1, 0.3, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
  ctx.font = `600 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title.toUpperCase(), cardX + 54 * scale, cardY + 54 * scale);

  // Badge (e.g. "+28.4% this month")
  if (config.badgeText) {
    const bText = config.badgeText;
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    const bw = ctx.measureText(bText).width + 36 * scale;
    const bh = 36 * scale;
    const bx = cardX + cardWidth - 54 * scale - bw;
    const by = cardY + 48 * scale;

    roundRect(ctx, bx, by, bw, bh, 18 * scale);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    // Up arrow
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(bx + 16 * scale, by + 22 * scale);
    ctx.lineTo(bx + 22 * scale, by + 14 * scale);
    ctx.lineTo(bx + 28 * scale, by + 22 * scale);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(bText, bx + 36 * scale, by + bh / 2);
  }
  ctx.restore();

  // Metric Roll-Up Counter
  const countProgress = windowProgress(progress, 0.2, 0.75, Easing.easeOutExpo);
  const startVal = config.metricStart ?? 0;
  const endVal = config.metricEnd ?? 84520;
  const currentNumber = Math.round(lerp(startVal, endVal, countProgress));
  const formattedNumber = currentNumber.toLocaleString();

  const fullDisplay = `${config.prefix || ''}${formattedNumber}${config.suffix || ''}`;

  ctx.save();
  ctx.shadowColor = config.primaryColor || '#6366f1';
  ctx.shadowBlur = 32 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `800 ${88 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(fullDisplay, cardX + 54 * scale, cardY + 180 * scale);
  ctx.restore();

  // Subtitle / Description
  ctx.save();
  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.subtitle, cardX + 54 * scale, cardY + 250 * scale);
  ctx.restore();

  // Bottom Progress Track
  const trackX = cardX + 54 * scale;
  const trackY = cardY + 340 * scale;
  const trackW = cardWidth - 108 * scale;
  const trackH = 10 * scale;

  roundRect(ctx, trackX, trackY, trackW, trackH, 5 * scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();

  const barFillW = trackW * countProgress;
  if (barFillW > 0) {
    const barGrad = ctx.createLinearGradient(trackX, 0, trackX + barFillW, 0);
    barGrad.addColorStop(0, config.primaryColor || '#6366f1');
    barGrad.addColorStop(1, config.accentColor || '#38bdf8');
    roundRect(ctx, trackX, trackY, barFillW, trackH, 5 * scale);
    ctx.fillStyle = barGrad;
    ctx.shadowColor = config.accentColor || '#38bdf8';
    ctx.shadowBlur = 14 * scale;
    ctx.fill();
  }

  ctx.restore();
}
