import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

export function renderStarReview(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardWidth = 920 * scale;
  const cardHeight = 460 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

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

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Top header: Trustpilot/Google Reviews style badge
  const badgeText = config.badgeText || 'VERIFIED 5-STAR REVIEW';
  ctx.fillStyle = '#22c55e';
  ctx.font = `bold ${14 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`★ ${badgeText}`, cardX + 48 * scale, cardY + 44 * scale);

  // Quote Review Text
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `600 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const reviewQuote = config.title || '"This tool transformed our video production workflow in minutes!"';
  ctx.fillText(reviewQuote, cardX + 48 * scale, cardY + 84 * scale, cardWidth - 96 * scale);

  // Customer Author Info
  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Sarah Jenkins — Lead Motion Designer at TechCorp', cardX + 48 * scale, cardY + 160 * scale);

  // 5 Gold Glowing Stars (staggered cascade 0.12 -> 0.36)
  const starCount = 5;
  const starY = cardY + 260 * scale;
  const startStarX = cardX + 70 * scale;
  const starGap = 65 * scale;

  for (let i = 0; i < starCount; i++) {
    const sProg = windowProgress(progress, 0.10 + i * 0.05, 0.22 + i * 0.05, Easing.easeOutBack);
    if (sProg > 0.01) {
      ctx.save();
      const sX = startStarX + i * starGap;
      ctx.translate(sX, starY);
      ctx.scale(sProg, sProg);

      // Gold Glow
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18 * scale;

      drawStar(ctx, 0, 0, 5, 24 * scale, 11 * scale);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.restore();
    }
  }

  // Numerical Score on right
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${46 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('5.0 / 5.0', startStarX + 5 * starGap + 20 * scale, starY);

  // Footer rating summary
  ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
  ctx.font = `500 ${16 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Over 2,400+ satisfied video editors and content creators worldwide', cardX + 48 * scale, cardY + 360 * scale);

  ctx.restore();
}
