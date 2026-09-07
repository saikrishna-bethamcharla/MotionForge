import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderFacebookReaction(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const scale = width / 1920;
  const cardWidth = 920 * scale;
  const cardHeight = 150 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = height - 260 * scale;

  // 1. Entrance
  const entrance = windowProgress(progress, 0, 0.06, Easing.easeOutCubic);
  const alpha = windowProgress(progress, 0, 0.04, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, cardY + cardHeight / 2);
  ctx.scale(entrance, entrance);
  ctx.translate(-width / 2, -(cardY + cardHeight / 2));
  ctx.globalAlpha = alpha;

  // Background Card
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 36 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 8 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 2. Avatar with Facebook Blue Ring
  const avatarX = cardX + 32 * scale + 42 * scale;
  const avatarY = cardY + cardHeight / 2;
  const avatarRadius = 42 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#1877f2';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.avatarText || 'FB', avatarX, avatarY);
  ctx.restore();

  // 3. Page Name & Follower Count
  const textX = avatarX + avatarRadius + 22 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${25 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(config.title || 'Official Page', textX, cardY + cardHeight / 2 - 4 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(
    config.subtitle || `${config.subscriberCount || '580K'} followers`,
    textX,
    cardY + cardHeight / 2 + 5 * scale
  );

  // 4. Floating Facebook Reactions Stack (👍 Like, ❤️ Love, 🥰 Care, 😆 Haha)
  const reactions = [
    { emoji: '👍', bg: '#1877f2', delay: 0.12 },
    { emoji: '❤️', bg: '#fa3e3e', delay: 0.18 },
    { emoji: '🥰', bg: '#f7b125', delay: 0.24 },
    { emoji: '😆', bg: '#f7b125', delay: 0.30 },
  ];

  const rxStart = cardX + cardWidth - 360 * scale;
  const rxSpacing = 36 * scale;

  reactions.forEach((item, idx) => {
    const rxProgress = windowProgress(progress, item.delay, item.delay + 0.12, Easing.easeOutBack);
    if (rxProgress <= 0) return;

    const rX = rxStart + idx * rxSpacing;
    const floatY = cardY + cardHeight / 2 - Math.sin(rxProgress * Math.PI) * 14 * scale;

    ctx.save();
    ctx.translate(rX, floatY);
    ctx.scale(rxProgress, rxProgress);

    // Circle base
    ctx.beginPath();
    ctx.arc(0, 0, 18 * scale, 0, Math.PI * 2);
    ctx.fillStyle = item.bg;
    ctx.shadowColor = item.bg + '88';
    ctx.shadowBlur = 10 * scale;
    ctx.fill();

    // Emoji
    ctx.shadowBlur = 0;
    ctx.font = `${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.emoji, 0, 1 * scale);

    ctx.restore();
  });

  // 5. Follow Button (transitions at progress 0.36)
  const isFollowing = progress >= 0.36;
  const followBounce = windowProgress(progress, 0.33, 0.40, (t) => Math.sin(t * Math.PI));

  const btnW = 160 * scale;
  const btnH = 50 * scale;
  const btnX = cardX + cardWidth - btnW - 32 * scale;
  const btnY = cardY + (cardHeight - btnH) / 2;

  ctx.save();
  ctx.translate(btnX + btnW / 2, btnY + btnH / 2);
  const btnScale = 1 - followBounce * 0.12;
  ctx.scale(btnScale, btnScale);
  ctx.translate(-(btnX + btnW / 2), -(btnY + btnH / 2));

  roundRect(ctx, btnX, btnY, btnW, btnH, 25 * scale);

  if (isFollowing) {
    ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `bold ${17 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ Following', btnX + btnW / 2, btnY + btnH / 2);
  } else {
    ctx.fillStyle = '#1877f2';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+ Follow', btnX + btnW / 2, btnY + btnH / 2);
  }
  ctx.restore();

  ctx.restore();
}
