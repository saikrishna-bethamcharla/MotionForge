import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderBarChart(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const items = config.chartData || [
    { id: '1', label: 'Jan', value: 45, color: '#38bdf8' },
    { id: '2', label: 'Feb', value: 72, color: '#6366f1' },
    { id: '3', label: 'Mar', value: 58, color: '#818cf8' },
    { id: '4', label: 'Apr', value: 94, color: '#a855f7' },
    { id: '5', label: 'May', value: 85, color: '#ec4899' },
  ];

  const scale = width / 1920; // responsive scale relative to 1080p
  const cardWidth = 1100 * scale;
  const cardHeight = 620 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // 1. Rapid entrance
  const cardEntrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const cardAlpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // Background Card
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 28 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.92)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fill();

  // Reset shadow immediately to keep text razor sharp
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Card Border Glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Header Title & Subtitle
  const titleEntrance = windowProgress(progress, 0.02, 0.08, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleEntrance;
  ctx.translate(0, (1 - titleEntrance) * -15 * scale);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${34 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 0;
  ctx.fillText(config.title, cardX + 48 * scale, cardY + 44 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle, cardX + 48 * scale, cardY + 88 * scale);

  if (config.badgeText) {
    const badgeText = config.badgeText;
    ctx.font = `bold ${16 * scale}px system-ui, -apple-system, sans-serif`;
    const badgeWidth = ctx.measureText(badgeText).width + 24 * scale;
    const badgeHeight = 32 * scale;
    const badgeX = cardX + cardWidth - 48 * scale - badgeWidth;
    const badgeY = cardY + 48 * scale;

    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 16 * scale);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fill();
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = config.primaryColor || '#818cf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
  }
  ctx.restore();

  // Chart Area Calculations
  const chartX = cardX + 70 * scale;
  const chartY = cardY + 160 * scale;
  const chartW = cardWidth - 140 * scale;
  const chartH = cardHeight - 240 * scale;

  // Background Grid Lines
  const gridAlpha = windowProgress(progress, 0.03, 0.10, Easing.easeOutQuad);
  ctx.save();
  ctx.globalAlpha = gridAlpha;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1 * scale;
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = chartY + (chartH / gridSteps) * i;
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartW, y);
    ctx.stroke();
  }
  ctx.restore();

  // Bars
  const maxValue = Math.max(...items.map((it) => it.value), 100);
  const n = items.length;
  const gap = 28 * scale;
  const barWidth = Math.min(100 * scale, (chartW - gap * (n + 1)) / n);
  const totalBarsWidth = n * barWidth + (n - 1) * gap;
  const startX = chartX + (chartW - totalBarsWidth) / 2;

  items.forEach((item, index) => {
    // Staggered bar animation completes by 30% of timeline!
    const staggerStart = 0.04 + (index / n) * 0.16;
    const staggerEnd = staggerStart + 0.16;
    const barProgress = windowProgress(progress, staggerStart, staggerEnd, Easing.easeOutBack);
    
    if (barProgress <= 0) return;

    const barHeight = (item.value / maxValue) * chartH * barProgress;
    const bx = startX + index * (barWidth + gap);
    const by = chartY + chartH - barHeight;

    // Gradient fill
    const grad = ctx.createLinearGradient(bx, by, bx, chartY + chartH);
    grad.addColorStop(0, item.color || config.primaryColor || '#6366f1');
    grad.addColorStop(1, config.secondaryColor || '#38bdf8');

    roundRect(ctx, bx, by, barWidth, barHeight, [12 * scale, 12 * scale, 4 * scale, 4 * scale]);
    ctx.fillStyle = grad;
    ctx.shadowColor = (item.color || config.primaryColor || '#6366f1') + '66';
    ctx.shadowBlur = 18 * scale;
    ctx.fill();

    // Value Label on Top of Bar
    if (barProgress > 0.4) {
      const currentVal = Math.round(lerp(0, item.value, barProgress));
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.fillStyle = config.textColor || '#ffffff';
      ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(
        `${config.prefix || ''}${currentVal}${config.suffix || ''}`,
        bx + barWidth / 2,
        by - 10 * scale
      );
      ctx.restore();
    }

    // Category Label below Bar
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
    ctx.font = `600 ${16 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(item.label, bx + barWidth / 2, chartY + chartH + 16 * scale);
    ctx.restore();
  });

  ctx.restore();
}
