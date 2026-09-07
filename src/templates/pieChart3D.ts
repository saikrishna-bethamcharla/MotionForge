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

  // Always reset shadow at start of render to prevent any bleeding
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const defaultItems = [
    { id: '1', label: 'Product & AI', value: 42, color: '#6366f1' },
    { id: '2', label: 'Marketing', value: 28, color: '#38bdf8' },
    { id: '3', label: 'Operations', value: 18, color: '#a855f7' },
    { id: '4', label: 'Sales & BD', value: 12, color: '#ec4899' },
  ];

  const items = config.chartData && config.chartData.length >= 2 ? config.chartData : defaultItems;
  const totalValue = items.reduce((acc, it) => acc + (it.value || 0), 0) || 100;

  const scale = width / 1920;

  // Full-screen card taking up 92% of width and height for high-impact presence
  const cardWidth = width * 0.92;
  const cardHeight = height * 0.88;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Rapid entrance so visual is immediately present
  const cardEntrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const cardAlpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(cardEntrance, cardEntrance);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = cardAlpha;

  // 1. Background Card (Clean, subtle shadow without text ghosting)
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 32 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 10 * scale;
  ctx.shadowOffsetX = 0;
  ctx.fill();

  // Reset shadow immediately after card fill!
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Card Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 2. Crisp Header Title & Subtitle (Zero shadow blur for maximum sharpness)
  const titleAlpha = windowProgress(progress, 0.01, 0.08, Easing.easeOutCubic);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${44 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title, cardX + 64 * scale, cardY + 52 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
  ctx.font = `500 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle, cardX + 64 * scale, cardY + 110 * scale);

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

  // 3. 3D Pie Geometry (Full screen presence)
  const pieCenterX = cardX + cardWidth * 0.36;
  const pieCenterY = cardY + cardHeight * 0.58;
  const rx = 320 * scale;
  const ry = 175 * scale;
  const depth = 65 * scale;

  // Rotation & sweep animation: starts immediately and completes by 32% of duration!
  const animProgress = windowProgress(progress, 0.04, 0.32, Easing.easeOutCubic);
  const baseRotation = lerp(-Math.PI * 0.75, -Math.PI * 0.5, animProgress);

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
      isExploded: idx === 0 && animProgress > 0.3,
    };
  });

  ctx.save();

  // 4. Render 3D Cylindrical Side Walls
  slices.forEach((slice) => {
    if (slice.sweep <= 0.001) return;

    let explodeX = 0;
    let explodeY = 0;
    if (slice.isExploded) {
      const explodeDist = 26 * scale * windowProgress(progress, 0.35, 0.7, Easing.easeOutBack);
      explodeX = Math.cos(slice.midAngle) * explodeDist;
      explodeY = Math.sin(slice.midAngle) * explodeDist * 0.55;
    }

    const cx = pieCenterX + explodeX;
    const cy = pieCenterY + explodeY;

    // Draw rim wall facets
    const steps = 36;
    const angleStep = slice.sweep / steps;

    for (let s = 0; s < steps; s++) {
      const a1 = slice.startAngle + s * angleStep;
      const a2 = a1 + angleStep;

      const midA = (a1 + a2) / 2;
      const facing = Math.sin(midA);

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

        const light = 0.55 + facing * 0.35 + Math.cos(midA) * 0.15;
        ctx.fillStyle = shadeColor(slice.color, (light - 1) * 45);
        ctx.fill();
      }
    }

    // Radial cut wall at start angle
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

    // Radial cut wall at end angle
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

  // 5. Draw Top 3D Faces (Elliptical wedges with glossy top radial shine)
  slices.forEach((slice) => {
    if (slice.sweep <= 0.001) return;

    let explodeX = 0;
    let explodeY = 0;
    if (slice.isExploded) {
      const explodeDist = 26 * scale * windowProgress(progress, 0.35, 0.7, Easing.easeOutBack);
      explodeX = Math.cos(slice.midAngle) * explodeDist;
      explodeY = Math.sin(slice.midAngle) * explodeDist * 0.55;
    }

    const cx = pieCenterX + explodeX;
    const cy = pieCenterY + explodeY;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);

    const steps = 44;
    const angleStep = slice.sweep / steps;
    for (let s = 0; s <= steps; s++) {
      const a = slice.startAngle + s * angleStep;
      ctx.lineTo(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
    }
    ctx.closePath();

    const topGrad = ctx.createRadialGradient(cx, cy - 30 * scale, 15 * scale, cx, cy, rx);
    topGrad.addColorStop(0, shadeColor(slice.color, 25));
    topGrad.addColorStop(0.7, slice.color);
    topGrad.addColorStop(1, shadeColor(slice.color, -15));

    ctx.fillStyle = topGrad;
    ctx.fill();

    // Subtle edge bevel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.restore();

    // Floating percentage badge above slice (Crisp text, no blurry shadow)
    if (slice.fraction >= 0.07 && animProgress > 0.15) {
      const badgeProgress = windowProgress(
        progress,
        0.10 + (slice.fraction * 0.08),
        0.30,
        Easing.easeOutBack
      );

      if (badgeProgress > 0) {
        const labelDist = 0.65;
        const tx = cx + Math.cos(slice.midAngle) * (rx * labelDist);
        const ty = cy + Math.sin(slice.midAngle) * (ry * labelDist) - 10 * scale;

        const pctText = `${Math.round(slice.fraction * 100 * animProgress)}%`;
        ctx.save();
        ctx.translate(tx, ty);
        ctx.scale(badgeProgress, badgeProgress);

        // Reset any shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.font = `800 ${22 * scale}px system-ui, -apple-system, sans-serif`;
        const tw = ctx.measureText(pctText).width + 24 * scale;
        const th = 36 * scale;

        roundRect(ctx, -tw / 2, -th / 2, tw, th, 18 * scale);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5 * scale;
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

  // 6. Crisp Legend on Right Side (Large, high-contrast, perfectly sharp text)
  const legendX = cardX + cardWidth * 0.70;
  const legendY = cardY + 200 * scale;
  const legendSpacing = 72 * scale; // Increased spacing for larger text

  slices.forEach((slice, idx) => {
    const itemEntrance = windowProgress(
      progress,
      0.04 + idx * 0.03,
      0.16 + idx * 0.03,
      Easing.easeOutBack
    );

    if (itemEntrance <= 0) return;

    const ly = legendY + idx * legendSpacing;

    ctx.save();
    ctx.translate(legendX, ly);
    ctx.scale(itemEntrance, itemEntrance);

    // Guaranteed ZERO shadow on text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Glowing Color Indicator Pill
    roundRect(ctx, 0, 0, 24 * scale, 24 * scale, 8 * scale);
    ctx.fillStyle = slice.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Primary Label (Crisp, large, bold)
    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `700 ${26 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(slice.label, 40 * scale, 12 * scale);

    // Value & Pct
    const currentSliceVal = Math.round(lerp(0, slice.value, animProgress));
    const pct = Math.round(slice.fraction * 100);
    const subText = `${config.prefix || ''}${currentSliceVal}${config.suffix || ''}  •  ${pct}% share`;

    ctx.fillStyle = 'rgba(203, 213, 225, 0.95)';
    ctx.font = `600 ${19 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(subText, 40 * scale, 38 * scale);

    ctx.restore();
  });

  ctx.restore();
}
