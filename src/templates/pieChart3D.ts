import type { RenderContext } from '../types/template';
import { Easing, lerp, windowProgress, roundRect } from '../engine/animator';

// Helper to adjust color brightness for 3D bevel shading
function shadeColor(colorHex: string, percent: number): string {
  let hex = colorHex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  if (isNaN(num)) return colorHex;

  const r = Math.min(255, Math.max(0, Math.round(((num >> 16) & 0xff) * (1 + percent / 100))));
  const g = Math.min(255, Math.max(0, Math.round(((num >> 8) & 0xff) * (1 + percent / 100))));
  const b = Math.min(255, Math.max(0, Math.round((num & 0xff) * (1 + percent / 100))));

  return `rgb(${r}, ${g}, ${b})`;
}

export function renderPieChart3D(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  const defaultItems = [
    { id: '1', label: 'Product & AI', value: 42, color: '#6366f1' },
    { id: '2', label: 'Marketing', value: 28, color: '#38bdf8' },
    { id: '3', label: 'Operations', value: 18, color: '#a855f7' },
    { id: '4', label: 'Sales & BD', value: 12, color: '#ec4899' },
  ];

  const items = config.chartData && config.chartData.length >= 2 ? config.chartData : defaultItems;
  const totalValue = items.reduce((acc, it) => acc + (it.value || 0), 0) || 100;

  const scale = width / 1920;
  const cardWidth = 1200 * scale;
  const cardHeight = 650 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // 1. Entrance animation (card scale and fade)
  const cardEntrance = windowProgress(progress, 0, 0.25, Easing.easeOutBack);
  const cardAlpha = windowProgress(progress, 0, 0.2, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // Background Glass Card
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 30 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 42 * scale;
  ctx.shadowOffsetY = 18 * scale;
  ctx.fill();

  // Border glow
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Title & Subtitle Header
  const titleAlpha = windowProgress(progress, 0.1, 0.35, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${34 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 0;
  ctx.fillText(config.title, cardX + 54 * scale, cardY + 44 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle, cardX + 54 * scale, cardY + 88 * scale);

  if (config.badgeText) {
    const badgeText = config.badgeText;
    ctx.font = `bold ${16 * scale}px system-ui, -apple-system, sans-serif`;
    const bw = ctx.measureText(badgeText).width + 24 * scale;
    const bh = 32 * scale;
    const bx = cardX + cardWidth - 54 * scale - bw;
    const by = cardY + 48 * scale;

    roundRect(ctx, bx, by, bw, bh, 16 * scale);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.fill();
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = config.primaryColor || '#818cf8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, bx + bw / 2, by + bh / 2);
  }
  ctx.restore();

  // 3D Pie Geometry
  // Position pie towards center-left, legend on right
  const pieCenterX = cardX + cardWidth * 0.38;
  const pieCenterY = cardY + cardHeight * 0.58;
  const rx = 210 * scale; // horizontal radius
  const ry = 115 * scale; // vertical radius (isometric tilt ~ 0.55 ratio)
  const depth = 45 * scale; // 3D extrusion thickness

  // Rotation animation (starts at -120deg and spins smoothly into position)
  const animProgress = windowProgress(progress, 0.2, 0.85, Easing.easeOutCubic);
  const baseRotation = lerp(-Math.PI * 0.75, -Math.PI * 0.5, animProgress);

  // Compute angles for each slice
  const palette = [
    config.primaryColor || '#6366f1',
    config.secondaryColor || '#38bdf8',
    config.accentColor || '#a855f7',
    '#ec4899',
    '#10b981',
    '#f59e0b',
  ];

  let currentAngle = baseRotation;
  const slices = items.map((it, idx) => {
    const fraction = it.value / totalValue;
    const sweep = fraction * (Math.PI * 2) * animProgress;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    const baseColor = it.color || palette[idx % palette.length];
    return {
      ...it,
      fraction,
      startAngle,
      endAngle,
      sweep,
      midAngle: (startAngle + endAngle) / 2,
      color: baseColor,
      isExploded: idx === 0 && animProgress > 0.4, // Slight pop-out for top slice
    };
  });

  // Render 3D Extrusion
  // Draw depth walls first (from back to front, specifically for front-facing curves)
  ctx.save();

  // Step 1: Draw 3D Cylindrical Side Walls
  // We discretize the arc into segments to create smooth shaded 3D facets
  slices.forEach((slice) => {
    if (slice.sweep <= 0.001) return;

    let explodeX = 0;
    let explodeY = 0;
    if (slice.isExploded) {
      const explodeDist = 18 * scale * windowProgress(progress, 0.4, 0.7, Easing.easeOutBack);
      explodeX = Math.cos(slice.midAngle) * explodeDist;
      explodeY = Math.sin(slice.midAngle) * explodeDist * 0.55;
    }

    const cx = pieCenterX + explodeX;
    const cy = pieCenterY + explodeY;

    // Draw the 3D rim wall for this slice
    const steps = 30;
    const angleStep = slice.sweep / steps;

    for (let s = 0; s < steps; s++) {
      const a1 = slice.startAngle + s * angleStep;
      const a2 = a1 + angleStep;

      // Normal vector facing direction to calculate lighting (front face is sin(a) > 0)
      const midA = (a1 + a2) / 2;
      const facing = Math.sin(midA);

      // Only draw side walls visible to camera (facing > -0.1)
      if (facing > -0.05) {
        const x1 = cx + Math.cos(a1) * rx;
        const y1 = cy + Math.sin(a1) * ry;
        const x2 = cx + Math.cos(a2) * rx;
        const y2 = cy + Math.sin(a2) * ry;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y2 + depth);
        ctx.lineTo(x1, y1 + depth);
        ctx.closePath();

        // Shading: darker at sides, brighter at direct light
        const light = 0.55 + facing * 0.35 + Math.cos(midA) * 0.15;
        ctx.fillStyle = shadeColor(slice.color, (light - 1) * 45);
        ctx.fill();
      }
    }

    // Radial cut wall at start angle if facing front
    const startSin = Math.sin(slice.startAngle);
    const startCos = Math.cos(slice.startAngle);
    if (startCos < 0.1 && startSin > -0.2) {
      const ex = cx + startCos * rx;
      const ey = cy + startSin * ry;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex, ey + depth);
      ctx.lineTo(cx, cy + depth);
      ctx.closePath();
      ctx.fillStyle = shadeColor(slice.color, -30);
      ctx.fill();
    }

    // Radial cut wall at end angle if facing front
    const endSin = Math.sin(slice.endAngle);
    const endCos = Math.cos(slice.endAngle);
    if (endCos > -0.1 && endSin > -0.2) {
      const ex = cx + endCos * rx;
      const ey = cy + endSin * ry;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex, ey + depth);
      ctx.lineTo(cx, cy + depth);
      ctx.closePath();
      ctx.fillStyle = shadeColor(slice.color, -40);
      ctx.fill();
    }
  });

  // Step 2: Draw Top 3D Faces (Elliptical wedges)
  slices.forEach((slice) => {
    if (slice.sweep <= 0.001) return;

    let explodeX = 0;
    let explodeY = 0;
    if (slice.isExploded) {
      const explodeDist = 18 * scale * windowProgress(progress, 0.4, 0.7, Easing.easeOutBack);
      explodeX = Math.cos(slice.midAngle) * explodeDist;
      explodeY = Math.sin(slice.midAngle) * explodeDist * 0.55;
    }

    const cx = pieCenterX + explodeX;
    const cy = pieCenterY + explodeY;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);

    // Approximate ellipse wedge
    const steps = 40;
    const angleStep = slice.sweep / steps;
    for (let s = 0; s <= steps; s++) {
      const a = slice.startAngle + s * angleStep;
      ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
    }
    ctx.closePath();

    // Top face gradient for glossy 3D shine
    const topGrad = ctx.createRadialGradient(cx, cy - 20 * scale, 10 * scale, cx, cy, rx);
    topGrad.addColorStop(0, shadeColor(slice.color, 25));
    topGrad.addColorStop(0.7, slice.color);
    topGrad.addColorStop(1, shadeColor(slice.color, -15));

    ctx.fillStyle = topGrad;
    ctx.shadowColor = slice.color + '55';
    ctx.shadowBlur = 16 * scale;
    ctx.fill();

    // Bevel top edge stroke
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();
    ctx.restore();

    // Floating percentage badge above slice
    if (slice.fraction >= 0.08 && animProgress > 0.4) {
      const badgeProgress = windowProgress(
        progress,
        0.45 + (slice.fraction * 0.2),
        0.8,
        Easing.easeOutBack
      );

      if (badgeProgress > 0) {
        const labelDist = 0.68;
        const tx = cx + Math.cos(slice.midAngle) * (rx * labelDist);
        const ty = cy + Math.sin(slice.midAngle) * (ry * labelDist) - 8 * scale;

        const pctText = `${Math.round(slice.fraction * 100 * animProgress)}%`;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.scale(badgeProgress, badgeProgress);

        ctx.font = `bold ${17 * scale}px system-ui, -apple-system, sans-serif`;
        const tw = ctx.measureText(pctText).width + 16 * scale;
        const th = 26 * scale;

        roundRect(ctx, -tw / 2, -th / 2, tw, th, 13 * scale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8 * scale;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1 * scale;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pctText, 0, 0);
        ctx.restore();
      }
    }
  });

  ctx.restore();

  // Step 3: Legend on Right Side
  const legendX = cardX + cardWidth * 0.71;
  const legendY = cardY + 160 * scale;
  const legendSpacing = 58 * scale;

  slices.forEach((slice, idx) => {
    const itemEntrance = windowProgress(
      progress,
      0.3 + idx * 0.1,
      0.55 + idx * 0.1,
      Easing.easeOutBack
    );

    if (itemEntrance <= 0) return;

    const ly = legendY + idx * legendSpacing;

    ctx.save();
    ctx.translate(legendX, ly);
    ctx.scale(itemEntrance, itemEntrance);

    // Glowing Color Indicator Pill
    roundRect(ctx, 0, 0, 20 * scale, 20 * scale, 6 * scale);
    ctx.fillStyle = slice.color;
    ctx.shadowColor = slice.color;
    ctx.shadowBlur = 10 * scale;
    ctx.fill();

    // Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(slice.label, 32 * scale, 10 * scale);

    // Value & Pct
    const currentSliceVal = Math.round(lerp(0, slice.value, animProgress));
    const pct = Math.round(slice.fraction * 100);
    const subText = `${config.prefix || ''}${currentSliceVal}${config.suffix || ''} (${pct}%)`;

    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = `500 ${15 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(subText, 32 * scale, 30 * scale);

    ctx.restore();
  });

  ctx.restore();
}
