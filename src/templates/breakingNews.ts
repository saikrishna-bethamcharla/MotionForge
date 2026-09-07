import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderBreakingNews(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  // Banner positioned near bottom of screen
  const bannerW = width * 0.88;
  const bannerH = 130 * scale;
  const bannerX = (width - bannerW) / 2;
  const bannerY = height - bannerH - 80 * scale;

  // Slide-in entrance from left
  const slideIn = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const currentX = bannerX - (1 - slideIn) * 120 * scale;

  // Top Red "BREAKING NEWS" / "LIVE" Accent Pill
  const pillW = 240 * scale;
  const pillH = 38 * scale;
  const pillX = currentX;
  const pillY = bannerY - pillH;

  roundRect(ctx, pillX, pillY, pillW, pillH, [10 * scale, 10 * scale, 0, 0]);
  ctx.fillStyle = '#dc2626'; // Vivid Red
  ctx.fill();

  // Pulsing Live Dot
  const pulse = Math.abs(Math.sin(progress * 25));
  ctx.beginPath();
  ctx.arc(pillX + 26 * scale, pillY + pillH / 2, 7 * scale, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.badgeText || 'BREAKING NEWS', pillX + 44 * scale, pillY + pillH / 2);

  // Time / Category Tag next to pill
  ctx.fillStyle = '#0284c7';
  const tagW = 140 * scale;
  roundRect(ctx, pillX + pillW + 4 * scale, pillY, tagW, pillH, [10 * scale, 10 * scale, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${15 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('SPECIAL REPORT', pillX + pillW + 4 * scale + tagW / 2, pillY + pillH / 2);

  // Main Banner Card
  roundRect(ctx, currentX, bannerY, bannerW, bannerH, [0, 16 * scale, 16 * scale, 16 * scale]);
  ctx.fillStyle = config.cardColor || '#0a0a0c';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 12 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Left red accent stripe
  ctx.fillStyle = '#dc2626';
  roundRect(ctx, currentX, bannerY, 12 * scale, bannerH, [0, 0, 0, 16 * scale]);
  ctx.fill();

  // Headline Text
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const headline = config.title || 'HISTORIC MILESTONE REACHED IN AI ACCELERATION';
  ctx.fillText(headline, currentX + 38 * scale, bannerY + 44 * scale, bannerW - 60 * scale);

  // Ticker Subtitle Bar
  const tickerY = bannerY + 84 * scale;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(currentX + 12 * scale, tickerY - 10 * scale, bannerW - 12 * scale, 1 * scale);

  ctx.fillStyle = '#f59e0b';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('LATEST:', currentX + 38 * scale, tickerY + 14 * scale);

  ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  const tickerText = config.subtitle || 'Global markets surge as revolutionary open-source video engine launches worldwide.';
  ctx.fillText(tickerText, currentX + 130 * scale, tickerY + 14 * scale, bannerW - 160 * scale);

  ctx.restore();
}
