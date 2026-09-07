import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderYouTubeAction(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  // Zero-out shadow to prevent text blurring
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const scale = width / 1920;
  const cardWidth = 1050 * scale;
  const cardHeight = 150 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = height - 260 * scale; // Positioned near bottom of screen like typical YouTube overlays

  // 1. Snappy entrance (< 0.25s)
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

  // Reset shadow immediately after card
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 2. Avatar with YouTube red accent ring
  const avatarX = cardX + 32 * scale + 42 * scale;
  const avatarY = cardY + cardHeight / 2;
  const avatarRadius = 40 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ff0000';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${28 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.avatarText || 'YT', avatarX, avatarY);
  ctx.restore();

  // 3. Channel Name & Subscribers
  const textX = avatarX + avatarRadius + 22 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(config.title || 'Creator Channel', textX, cardY + cardHeight / 2 - 4 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(
    config.subtitle || `${config.subscriberCount || '1.5M'} subscribers`,
    textX,
    cardY + cardHeight / 2 + 5 * scale
  );

  // 4. Action 1: LIKE BUTTON (Animated click at progress 0.18)
  const isLiked = progress >= 0.18;
  const likeBounce = windowProgress(progress, 0.15, 0.22, (t) => Math.sin(t * Math.PI));

  const likeW = 120 * scale;
  const likeH = 50 * scale;
  const likeX = cardX + cardWidth - 430 * scale;
  const likeY = cardY + (cardHeight - likeH) / 2;

  ctx.save();
  ctx.translate(likeX + likeW / 2, likeY + likeH / 2);
  const likeScale = 1 + likeBounce * 0.18;
  ctx.scale(likeScale, likeScale);
  ctx.translate(-(likeX + likeW / 2), -(likeY + likeH / 2));

  roundRect(ctx, likeX, likeY, likeW, likeH, 25 * scale);
  ctx.fillStyle = isLiked ? 'rgba(56, 189, 248, 0.25)' : 'rgba(51, 65, 85, 0.6)';
  ctx.fill();
  ctx.strokeStyle = isLiked ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Thumbs up icon & text
  ctx.fillStyle = isLiked ? '#38bdf8' : '#ffffff';
  ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`👍 ${isLiked ? 'Liked' : 'Like'}`, likeX + likeW / 2, likeY + likeH / 2);
  ctx.restore();

  // 5. Action 2: SUBSCRIBE BUTTON (Animated click at progress 0.32)
  const isSubscribed = progress >= 0.32;
  const subBounce = windowProgress(progress, 0.29, 0.36, (t) => Math.sin(t * Math.PI));

  const subW = 185 * scale;
  const subH = 50 * scale;
  const subX = likeX + likeW + 16 * scale;
  const subY = cardY + (cardHeight - subH) / 2;

  ctx.save();
  ctx.translate(subX + subW / 2, subY + subH / 2);
  const subScale = 1 - subBounce * 0.12;
  ctx.scale(subScale, subScale);
  ctx.translate(-(subX + subW / 2), -(subY + subH / 2));

  roundRect(ctx, subX, subY, subW, subH, 25 * scale);

  if (isSubscribed) {
    ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `bold ${17 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ SUBSCRIBED', subX + subW / 2, subY + subH / 2);
  } else {
    ctx.fillStyle = '#ff0000';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUBSCRIBE', subX + subW / 2, subY + subH / 2);
  }
  ctx.restore();

  // 6. Action 3: BELL NOTIFICATION (Rings at progress 0.44)
  const isBellActive = progress >= 0.44;
  const bellRing =
    isBellActive && progress < 0.70
      ? Math.sin((progress - 0.44) * 50) * 0.32
      : 0;

  const bellW = 54 * scale;
  const bellH = 50 * scale;
  const bellX = subX + subW + 16 * scale;
  const bellY = cardY + (cardHeight - bellH) / 2;

  ctx.save();
  roundRect(ctx, bellX, bellY, bellW, bellH, 25 * scale);
  ctx.fillStyle = isBellActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(51, 65, 85, 0.6)';
  ctx.fill();
  ctx.strokeStyle = isBellActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Bell drawing with vibration
  ctx.translate(bellX + bellW / 2, bellY + bellH / 2);
  ctx.rotate(bellRing);

  ctx.fillStyle = isBellActive ? '#f59e0b' : '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -3 * scale, 9 * scale, Math.PI, 0, false);
  ctx.lineTo(12 * scale, 9 * scale);
  ctx.lineTo(-12 * scale, 9 * scale);
  ctx.closePath();
  ctx.fill();

  // Bell clapper
  ctx.beginPath();
  ctx.arc(0, 12 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}
