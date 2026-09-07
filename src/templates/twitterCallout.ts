import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderTwitterCallout(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardWidth = 840 * scale;
  const cardHeight = 440 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;

  // Entrance
  const enterProg = windowProgress(progress, 0, 0.07, Easing.easeOutCubic);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Background Card (Dark sleek X theme)
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 24 * scale);
  ctx.fillStyle = config.cardColor || '#000000';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Top Row: Avatar + Name + Handle + X Logo
  const avatarX = cardX + 36 * scale;
  const avatarY = cardY + 36 * scale;
  const avatarR = 34 * scale;

  // Avatar Circle
  ctx.beginPath();
  ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
  ctx.fillStyle = '#1d9bf0';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.avatarText || 'X', avatarX + avatarR, avatarY + avatarR);

  // Author Name
  const textLeft = avatarX + avatarR * 2 + 18 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${26 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'Alex Rivera', textLeft, avatarY + 6 * scale);

  // Verified Checkmark badge
  const nameWidth = ctx.measureText(config.title || 'Alex Rivera').width;
  const badgeX = textLeft + nameWidth + 10 * scale;
  const badgeY = avatarY + 18 * scale;
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, 10 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#1d9bf0';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${12 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', badgeX, badgeY);

  // Handle
  ctx.fillStyle = 'rgba(113, 118, 123, 1)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.handle || '@alexrivera_ai', textLeft, avatarY + 40 * scale);

  // X Logo on top right
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('𝕏', cardX + cardWidth - 36 * scale, avatarY + 8 * scale);

  // Post Text / Quote
  ctx.fillStyle = '#e7e9ea';
  ctx.font = `500 ${25 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const postQuote = config.subtitle || 'Motion graphics are 10x faster now with real-time browser rendering. Game changer! 🔥';
  ctx.fillText(postQuote, cardX + 36 * scale, cardY + 130 * scale, cardWidth - 72 * scale);

  // Action Bar: Reply, Repost, Like, Bookmark
  const actY = cardY + 340 * scale;
  const cols = 4;
  const colWidth = (cardWidth - 72 * scale) / cols;

  // Repost animation (prog 0.16 -> 0.30)
  const repostProg = windowProgress(progress, 0.16, 0.30, Easing.easeOutBack);
  const isReposted = repostProg >= 0.8;

  // Like animation (prog 0.28 -> 0.42)
  const likeProg = windowProgress(progress, 0.28, 0.42, Easing.easeOutBack);
  const isLiked = likeProg >= 0.8;

  // 1. Reply
  ctx.fillStyle = 'rgba(113, 118, 123, 1)';
  ctx.font = `600 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('💬 428', cardX + 36 * scale, actY);

  // 2. Repost
  ctx.save();
  const rx = cardX + 36 * scale + colWidth;
  if (isReposted) {
    ctx.fillStyle = '#00ba7c';
  } else {
    ctx.fillStyle = 'rgba(113, 118, 123, 1)';
  }
  ctx.fillText(`🔁 ${isReposted ? '1,843' : '1,842'}`, rx, actY);
  ctx.restore();

  // 3. Like
  ctx.save();
  const lx = cardX + 36 * scale + colWidth * 2;
  if (isLiked) {
    ctx.fillStyle = '#f91880';
    ctx.fillText('❤️ 14.2K', lx, actY);
  } else {
    ctx.fillStyle = 'rgba(113, 118, 123, 1)';
    ctx.fillText('🤍 14.1K', lx, actY);
  }
  ctx.restore();

  // 4. Bookmark & Share
  const bx = cardX + 36 * scale + colWidth * 3;
  ctx.fillStyle = 'rgba(113, 118, 123, 1)';
  ctx.fillText('🔖 892', bx, actY);

  ctx.restore();
}
