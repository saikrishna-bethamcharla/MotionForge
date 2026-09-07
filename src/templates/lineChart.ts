import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

export function renderLineChart(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const items = config.chartData || [
    { id: '1', label: 'Q1', value: 30 },
    { id: '2', label: 'Q2', value: 65 },
    { id: '3', label: 'Q3', value: 50 },
    { id: '4', label: 'Q4', value: 95 },
    { id: '5', label: 'Q5', value: 85 },
    { id: '6', label: 'Q6', value: 120 },
  ];

  const scale = width / 1920;
  const cardWidth = 1150 * scale;
  const cardHeight = 640 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const cardEntrance = windowProgress(progress, 0, 0.25, Easing.easeOutBack);
  const cardAlpha = windowProgress(progress, 0, 0.2, Easing.easeOutQuad);

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

  // Reset shadow immediately
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Title
  const titleAlpha = windowProgress(progress, 0.15, 0.35, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${34 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 0;
  ctx.fillText(config.title, cardX + 50 * scale, cardY + 44 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle, cardX + 50 * scale, cardY + 88 * scale);
  ctx.restore();

  // Coordinates
  const chartX = cardX + 70 * scale;
  const chartY = cardY + 160 * scale;
  const chartW = cardWidth - 140 * scale;
  const chartH = cardHeight - 240 * scale;

  // Grid
  const gridAlpha = windowProgress(progress, 0.2, 0.4, Easing.easeOutQuad);
  ctx.save();
  ctx.globalAlpha = gridAlpha;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1 * scale;
  for (let i = 0; i <= 4; i++) {
    const y = chartY + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartW, y);
    ctx.stroke();
  }
  ctx.restore();

  // Calculate points
  const maxValue = Math.max(...items.map((it) => it.value), 100);
  const n = items.length;
  const points = items.map((it, idx) => ({
    x: chartX + (idx / (n - 1)) * chartW,
    y: chartY + chartH - (it.value / maxValue) * chartH,
    val: it.value,
    label: it.label,
  }));

  // Line drawing animation progress
  const lineDrawProgress = windowProgress(progress, 0.3, 0.85, Easing.easeOutCubic);

  if (points.length >= 2 && lineDrawProgress > 0) {
    // We construct the path up to lineDrawProgress
    const totalSegments = points.length - 1;
    const currentProgressTotal = lineDrawProgress * totalSegments;
    const currentSegmentIndex = Math.min(
      Math.floor(currentProgressTotal),
      totalSegments - 1
    );
    const segmentFrac = currentProgressTotal - currentSegmentIndex;

    const visiblePoints: { x: number; y: number }[] = [];
    for (let i = 0; i <= currentSegmentIndex; i++) {
      visiblePoints.push({ x: points[i].x, y: points[i].y });
    }

    if (currentSegmentIndex < totalSegments) {
      const p1 = points[currentSegmentIndex];
      const p2 = points[currentSegmentIndex + 1];
      visiblePoints.push({
        x: lerp(p1.x, p2.x, segmentFrac),
        y: lerp(p1.y, p2.y, segmentFrac),
      });
    }

    // Draw Gradient Area Fill under curve
    if (visiblePoints.length >= 2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(visiblePoints[0].x, chartY + chartH);
      for (const pt of visiblePoints) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.lineTo(visiblePoints[visiblePoints.length - 1].x, chartY + chartH);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
      areaGrad.addColorStop(0, (config.primaryColor || '#6366f1') + '44');
      areaGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();
      ctx.restore();
    }

    // Draw Stroke
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(visiblePoints[0].x, visiblePoints[0].y);
    for (let i = 1; i < visiblePoints.length; i++) {
      ctx.lineTo(visiblePoints[i].x, visiblePoints[i].y);
    }
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = 5 * scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = config.primaryColor || '#6366f1';
    ctx.shadowBlur = 20 * scale;
    ctx.stroke();
    ctx.restore();

    // Data dots & labels
    points.forEach((pt, idx) => {
      const dotThreshold = idx / (points.length - 1);
      if (lineDrawProgress >= dotThreshold) {
        const dotPop = windowProgress(
          lineDrawProgress,
          dotThreshold,
          Math.min(1, dotThreshold + 0.1),
          Easing.easeOutBack
        );

        ctx.save();
        ctx.shadowColor = config.accentColor || '#38bdf8';
        ctx.shadowBlur = 15 * scale;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7 * scale * dotPop, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = config.primaryColor || '#6366f1';
        ctx.stroke();

        // Label
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.font = `600 ${16 * scale}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(pt.label, pt.x, chartY + chartH + 16 * scale);

        // Value tooltip on peak point
        if (idx === points.length - 1) {
          const valText = `${config.prefix || ''}${pt.val}${config.suffix || ''}`;
          ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
          const tw = ctx.measureText(valText).width + 20 * scale;
          const th = 32 * scale;
          const tx = pt.x - tw / 2;
          const ty = pt.y - 48 * scale;

          roundRect(ctx, tx, ty, tw, th, 8 * scale);
          ctx.fillStyle = config.accentColor || '#38bdf8';
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(valText, tx + tw / 2, ty + th / 2);
        }

        ctx.restore();
      }
    });
  }

  ctx.restore();
}
