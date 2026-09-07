import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderRadialDonut(rc: RenderContext) {
  const { ctx, width, height, progress, config, currentTime } = rc;

  // Zero-out shadow initially to prevent any font blurring
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const defaultItems = [
    { id: '1', label: 'Primary Target', value: 85, color: '#6366f1' },
    { id: '2', label: 'Efficiency Goal', value: 68, color: '#38bdf8' },
    { id: '3', label: 'Consistency', value: 92, color: '#ec4899' },
  ];

  const items = config.chartData && config.chartData.length >= 2 ? config.chartData.slice(0, 4) : defaultItems;

  const scale = width / 1920;
  const cardWidth = width * 0.92;
  const cardHeight = height * 0.88;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // 1. Rapid entrance (instantly on screen within first 0.3s)
  const cardEntrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const cardAlpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // Background Card
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 32 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;
  ctx.shadowOffsetX = 0;
  ctx.fill();

  // Reset shadow immediately after card fill to keep all text razor-sharp
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 2. Header Title & Subtitle
  const titleAlpha = windowProgress(progress, 0.01, 0.08, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Activity & Goal Rings', cardX + 64 * scale, cardY + 52 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
  ctx.font = `500 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Real-time performance completion metrics', cardX + 64 * scale, cardY + 110 * scale);

  // Badge Tag
  if (config.badgeText) {
    const badgeText = config.badgeText;
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    const bw = ctx.measureText(badgeText).width + 32 * scale;
    const bh = 38 * scale;
    const bx = cardX + cardWidth - 64 * scale - bw;
    const by = cardY + 56 * scale;

    roundRect(ctx, bx, by, bw, bh, 19 * scale);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fill();
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    ctx.fillStyle = config.primaryColor || '#818cf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, bx + bw / 2, by + bh / 2);
  }
  ctx.restore();

  // 3. Radial Donut Rings Geometry
  const donutCenterX = cardX + cardWidth * 0.35;
  const donutCenterY = cardY + cardHeight * 0.58;
  const maxRadius = 240 * scale;
  const ringThickness = 28 * scale;
  const ringGap = 16 * scale;

  // Animation sweep: completes early by 35% so it covers 65%+ of the video duration!
  const animProgress = windowProgress(progress, 0.04, 0.35, Easing.easeOutCubic);

  // Center Stats calculation (average of all ring values)
  const avgValue = Math.round(
    items.reduce((acc, it) => acc + Math.min(100, it.value), 0) / items.length
  );
  const displayAvg = Math.round(lerp(0, avgValue, animProgress));

  // Center Ambient Glow
  ctx.save();
  const centerGlow = ctx.createRadialGradient(
    donutCenterX,
    donutCenterY,
    10 * scale,
    donutCenterX,
    donutCenterY,
    160 * scale
  );
  centerGlow.addColorStop(0, (config.primaryColor || '#6366f1') + '26');
  centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerGlow;
  ctx.beginPath();
  ctx.arc(donutCenterX, donutCenterY, 160 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Center Text (Bold percentage & description)
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `800 ${68 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${displayAvg}%`, donutCenterX, donutCenterY - 14 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `600 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('AVG COMPLETION', donutCenterX, donutCenterY + 40 * scale);
  ctx.restore();

  // 4. Render Concentric Rings
  const palette = [
    config.primaryColor || '#6366f1',
    config.secondaryColor || '#38bdf8',
    config.accentColor || '#ec4899',
    '#10b981',
  ];

  items.forEach((item, idx) => {
    const ringRadius = maxRadius - idx * (ringThickness + ringGap);
    const ringColor = item.color || palette[idx % palette.length];
    const targetPct = Math.min(100, Math.max(0, item.value));
    const sweepFraction = (targetPct / 100) * animProgress;

    const startAngle = -Math.PI / 2; // start from top 12 o'clock
    const endAngle = startAngle + sweepFraction * (Math.PI * 2);

    // Subtle breathing pulse for glowing tip during steady hold
    const pulse = Math.sin(currentTime * 3 + idx) * 3 * scale;

    // A. Background Translucent Track
    ctx.save();
    ctx.beginPath();
    ctx.arc(donutCenterX, donutCenterY, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = ringColor + '26'; // 15% opacity
    ctx.lineWidth = ringThickness;
    ctx.lineCap = 'round';
    ctx.stroke();

    // B. Foreground Animated Sweep Arc
    if (sweepFraction > 0.005) {
      ctx.beginPath();
      ctx.arc(donutCenterX, donutCenterY, ringRadius, startAngle, endAngle, false);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = ringThickness;
      ctx.lineCap = 'round';

      // Soft glow on the ring
      ctx.shadowColor = ringColor + '88';
      ctx.shadowBlur = 16 * scale;
      ctx.stroke();

      // C. Glowing Tip Particle at end of arc
      const tipX = donutCenterX + Math.cos(endAngle) * ringRadius;
      const tipY = donutCenterY + Math.sin(endAngle) * ringRadius;

      ctx.beginPath();
      ctx.arc(tipX, tipY, (ringThickness / 2.8) + pulse * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18 * scale;
      ctx.fill();
    }
    ctx.restore();
  });

  // 5. Crisp Legend / Metric Breakdown Cards on Right Side
  const legendX = cardX + cardWidth * 0.65;
  const legendY = cardY + 190 * scale;
  const cardW = cardWidth * 0.30;
  const itemHeight = 100 * scale;
  const itemGap = 20 * scale;

  items.forEach((item, idx) => {
    const itemEntrance = windowProgress(
      progress,
      0.04 + idx * 0.04,
      0.20 + idx * 0.04,
      Easing.easeOutBack
    );

    if (itemEntrance <= 0) return;

    const iy = legendY + idx * (itemHeight + itemGap);
    const ringColor = item.color || palette[idx % palette.length];
    const targetPct = Math.min(100, Math.max(0, item.value));
    const currentPct = Math.round(lerp(0, targetPct, animProgress));

    ctx.save();
    ctx.translate(legendX, iy);
    ctx.scale(itemEntrance, itemEntrance);

    // Guaranteed ZERO shadow on text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Card Container
    roundRect(ctx, 0, 0, cardW, itemHeight, 18 * scale);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Glowing Color Indicator Pill
    roundRect(ctx, 22 * scale, 24 * scale, 14 * scale, 52 * scale, 7 * scale);
    ctx.fillStyle = ringColor;
    ctx.shadowColor = ringColor + 'aa';
    ctx.shadowBlur = 10 * scale;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Metric Label
    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `700 ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(item.label, 48 * scale, 22 * scale);

    // Percentage value
    ctx.fillStyle = ringColor;
    ctx.font = `800 ${26 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`${currentPct}%`, cardW - 24 * scale, 20 * scale);

    // Mini Linear Progress Bar at bottom of card
    const barX = 48 * scale;
    const barY = 62 * scale;
    const barW = cardW - 72 * scale;
    const barH = 8 * scale;

    roundRect(ctx, barX, barY, barW, barH, 4 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    const fillW = barW * (currentPct / 100);
    if (fillW > 0) {
      roundRect(ctx, barX, barY, fillW, barH, 4 * scale);
      ctx.fillStyle = ringColor;
      ctx.fill();
    }

    ctx.restore();
  });

  ctx.restore();
}
