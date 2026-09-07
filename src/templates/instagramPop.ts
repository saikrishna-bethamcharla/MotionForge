import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderInstagramPop(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const scale = width / 1920;
  const cardWidth = 880 * scale;
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

  // Background Glass Card
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

  // 2. Avatar with Instagram Story Gradient Ring
  const avatarX = cardX + 32 * scale + 42 * scale;
  const avatarY = cardY + cardHeight / 2;
  const outerRadius = 45 * scale;
  const innerRadius = 38 * scale;

  ctx.save();
  // Story gradient ring
  const ringGrad = ctx.createLinearGradient(
    avatarX - outerRadius,
    avatarY + outerRadius,
    avatarX + outerRadius,
    avatarY - outerRadius
  );
  ringGrad.addColorStop(0, '#feda75');
  ringGrad.addColorStop(0.25, '#fa7e1e');
  ringGrad.addColorStop(0.5, '#d62976');
  ringGrad.addColorStop(0.75, '#962fbf');
  ringGrad.addColorStop(1, '#4f5bd5');

  ctx.beginPath();
  ctx.arc(avatarX, avatarY, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = ringGrad;
  ctx.fill();

  // Gap ring
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, outerRadius - 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fill();

  // Avatar center
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#262626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${26 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.avatarText || 'IG', avatarX, avatarY);
  ctx.restore();

  // 3. Username + Verified Badge + Subtitle
  const textX = avatarX + outerRadius + 22 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${25 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const handleName = config.handle || '@motion.creator';
  ctx.fillText(handleName, textX, cardY + cardHeight / 2 - 4 * scale);

  // Blue Verified Badge
  const nameW = ctx.measureText(handleName).width;
  const badgeX = textX + nameW + 12 * scale;
  const badgeY = cardY + cardHeight / 2 - 16 * scale;
  const badgeR = 10 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
  ctx.fillStyle = '#0095f6';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${12 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', badgeX, badgeY);
  ctx.restore();

  // Subtitle / Follower count
  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(
    config.subtitle || `${config.subscriberCount || '240K'} followers`,
    textX,
    cardY + cardHeight / 2 + 5 * scale
  );

  // 4. Double-Tap Heart Animation (pops at progress 0.16)
  const isHeartPopped = progress >= 0.16;
  const heartScaleProgress = windowProgress(progress, 0.14, 0.28, Easing.easeOutBack);
  const heartBounce = Math.sin(heartScaleProgress * Math.PI) * 0.3;

  const heartX = cardX + cardWidth - 280 * scale;
  const heartY = cardY + cardHeight / 2;

  ctx.save();
  ctx.translate(heartX, heartY);
  const currentHeartScale = isHeartPopped ? 1 + heartBounce : 0.85;
  ctx.scale(currentHeartScale, currentHeartScale);

  // Heart Icon drawing
  ctx.fillStyle = isHeartPopped ? '#ff3040' : 'rgba(255, 255, 255, 0.4)';
  if (isHeartPopped) {
    ctx.shadowColor = '#ff3040aa';
    ctx.shadowBlur = 18 * scale;
  }

  ctx.font = `${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isHeartPopped ? '❤️' : '🤍', 0, 0);
  ctx.restore();

  // 5. Follow Button (transitions at 0.32)
  const isFollowing = progress >= 0.32;
  const followBounce = windowProgress(progress, 0.29, 0.36, (t) => Math.sin(t * Math.PI));

  const btnW = 165 * scale;
  const btnH = 50 * scale;
  const btnX = cardX + cardWidth - btnW - 36 * scale;
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
    ctx.fillStyle = '#0095f6';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Follow', btnX + btnW / 2, btnY + btnH / 2);
  }
  ctx.restore();

  ctx.restore();
}
