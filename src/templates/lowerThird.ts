import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderLowerThird(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  const scale = width / 1920;
  
  // Lower thirds are positioned near the bottom-left
  const originX = 140 * scale;
  const originY = height - 260 * scale;

  // Animation timeline
  // 0.0 - 0.25: Line accent shoots out
  // 0.15 - 0.45: Name banner wipes in
  // 0.30 - 0.60: Subtitle banner drops in
  // 0.85 - 1.00: Optional smooth exit or hold

  const lineProgress = windowProgress(progress, 0, 0.3, Easing.easeOutExpo);
  const nameProgress = windowProgress(progress, 0.15, 0.45, Easing.easeOutCubic);
  const subProgress = windowProgress(progress, 0.28, 0.55, Easing.easeOutBack);

  // Measure text
  ctx.font = `800 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  const nameWidth = ctx.measureText(config.title).width + 60 * scale;
  const nameHeight = 64 * scale;

  ctx.font = `600 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  const subWidth = ctx.measureText(config.subtitle).width + 48 * scale;
  const subHeight = 44 * scale;

  // 1. Accent Left Vertical / Diagonal Bar
  const barHeight = (nameHeight + subHeight + 16 * scale) * lineProgress;
  if (barHeight > 0) {
    ctx.save();
    const barGrad = ctx.createLinearGradient(0, originY, 0, originY + barHeight);
    barGrad.addColorStop(0, config.primaryColor || '#6366f1');
    barGrad.addColorStop(1, config.accentColor || '#38bdf8');

    roundRect(ctx, originX, originY, 8 * scale, barHeight, 4 * scale);
    ctx.fillStyle = barGrad;
    ctx.shadowColor = config.primaryColor || '#6366f1';
    ctx.shadowBlur = 18 * scale;
    ctx.fill();
    ctx.restore();
  }

  // 2. Primary Name Banner (Sliding horizontally with clip rect)
  if (nameProgress > 0) {
    ctx.save();
    const nx = originX + 24 * scale;
    const ny = originY;
    const currentW = nameWidth * nameProgress;

    // Clip for wipe effect
    ctx.beginPath();
    ctx.rect(nx, ny - 10 * scale, currentW, nameHeight + 20 * scale);
    ctx.clip();

    // Box
    roundRect(ctx, nx, ny, nameWidth, nameHeight, [12 * scale, 12 * scale, 12 * scale, 4 * scale]);
    ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 24 * scale;
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Name Text
    ctx.fillStyle = config.textColor || '#ffffff';
    ctx.font = `800 ${36 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.title, nx + 28 * scale, ny + nameHeight / 2);

    // Accent mini tag / indicator
    if (config.badgeText) {
      const bText = config.badgeText;
      ctx.font = `bold ${14 * scale}px system-ui, -apple-system, sans-serif`;
      const bw = ctx.measureText(bText).width + 16 * scale;
      const bh = 24 * scale;
      const bx = nx + nameWidth - bw - 18 * scale;
      const by = ny + (nameHeight - bh) / 2;

      roundRect(ctx, bx, by, bw, bh, 6 * scale);
      ctx.fillStyle = config.primaryColor || '#6366f1';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bText, bx + bw / 2, by + bh / 2);
    }

    ctx.restore();
  }

  // 3. Subtitle Banner (Drops down from under name)
  if (subProgress > 0) {
    ctx.save();
    const sx = originX + 24 * scale;
    const sy = originY + nameHeight + 10 * scale;
    const currentSubW = subWidth * subProgress;

    ctx.beginPath();
    ctx.rect(sx, sy - 5 * scale, currentSubW, subHeight + 10 * scale);
    ctx.clip();

    roundRect(ctx, sx, sy, subWidth, subHeight, [4 * scale, 10 * scale, 10 * scale, 10 * scale]);
    ctx.fillStyle = config.primaryColor || '#6366f1';
    ctx.shadowColor = (config.primaryColor || '#6366f1') + '88';
    ctx.shadowBlur = 20 * scale;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `600 ${22 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.subtitle, sx + 24 * scale, sy + subHeight / 2);

    ctx.restore();
  }
}
