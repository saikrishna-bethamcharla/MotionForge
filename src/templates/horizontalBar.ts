import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderHorizontalBar(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const items = config.chartData || [
    { id: '1', label: 'MotionForge', value: 92, color: '#6366f1' },
    { id: '2', label: 'After Effects', value: 74, color: '#38bdf8' },
    { id: '3', label: 'Canva Pro', value: 65, color: '#a855f7' },
    { id: '4', label: 'CapCut Web', value: 52, color: '#ec4899' },
  ];

  const scale = width / 1920;
  const cardWidth = 1120 * scale;
  const cardHeight = 640 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const cardEntrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const cardAlpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // Card background
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

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Header
  const titleEntrance = windowProgress(progress, 0.02, 0.08, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleEntrance;
  ctx.translate(0, (1 - titleEntrance) * -12 * scale);

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${34 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Performance Benchmark', cardX + 48 * scale, cardY + 44 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Rendering Speed & Efficiency Score', cardX + 48 * scale, cardY + 88 * scale);

  if (config.badgeText) {
    const bPadX = 14 * scale;
    ctx.font = `bold ${13 * scale}px system-ui, -apple-system, sans-serif`;
    const bWidth = ctx.measureText(config.badgeText).width + bPadX * 2;
    const bHeight = 28 * scale;
    const bX = cardX + cardWidth - 48 * scale - bWidth;
    const bY = cardY + 44 * scale;

    roundRect(ctx, bX, bY, bWidth, bHeight, 14 * scale);
    ctx.fillStyle = config.accentColor || '#a855f7';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.badgeText, bX + bWidth / 2, bY + bHeight / 2);
  }
  ctx.restore();

  // Horizontal Bars
  const contentTop = cardY + 140 * scale;
  const rowHeight = (cardHeight - 170 * scale) / items.length;
  const labelWidth = 190 * scale;
  const maxBarWidth = cardWidth - 48 * scale * 2 - labelWidth - 90 * scale;
  const maxValue = Math.max(...items.map((i) => i.value), 100);

  const animProg = windowProgress(progress, 0.08, 0.40, Easing.easeOutQuart);

  items.forEach((item, i) => {
    const itemProg = windowProgress(animProg, (i / items.length) * 0.4, 1.0, Easing.easeOutCubic);
    const rowY = contentTop + i * rowHeight + rowHeight * 0.15;
    const barH = 34 * scale;
    const barX = cardX + 48 * scale + labelWidth;

    // Label
    ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
    ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, cardX + 48 * scale, rowY + barH / 2);

    // Track background
    roundRect(ctx, barX, rowY, maxBarWidth, barH, 17 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();

    // Active Bar
    const targetW = (item.value / maxValue) * maxBarWidth;
    const currentW = Math.max(barH, targetW * itemProg);

    if (currentW > 0) {
      roundRect(ctx, barX, rowY, currentW, barH, 17 * scale);
      const grad = ctx.createLinearGradient(barX, 0, barX + currentW, 0);
      grad.addColorStop(0, item.color || config.primaryColor || '#6366f1');
      grad.addColorStop(1, config.secondaryColor || '#38bdf8');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Value tag
    const currentVal = Math.round(lerp(0, item.value, itemProg));
    const prefix = config.prefix || '';
    const suffix = config.suffix || '%';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${prefix}${currentVal}${suffix}`, barX + currentW + 16 * scale, rowY + barH / 2);
  });

  ctx.restore();
}
