import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderSocialCallout(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;

  const scale = width / 1920;
  const cardWidth = 760 * scale;
  const cardHeight = 160 * scale;
  const cardX = (width - cardWidth) / 2;
  const cardY = height - 320 * scale;

  // Entrance
  const entrance = windowProgress(progress, 0, 0.25, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.2, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, cardY + cardHeight / 2);
  ctx.scale(entrance, entrance);
  ctx.translate(-width / 2, -(cardY + cardHeight / 2));
  ctx.globalAlpha = alpha;

  // Card Background
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 36 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.94)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 14 * scale;
  ctx.fill();

  // Reset shadow immediately
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Avatar Circle
  const avatarX = cardX + 32 * scale + 48 * scale;
  const avatarY = cardY + cardHeight / 2;
  const avatarRadius = 46 * scale;

  ctx.save();
  const avatarGrad = ctx.createLinearGradient(
    avatarX - avatarRadius,
    avatarY - avatarRadius,
    avatarX + avatarRadius,
    avatarY + avatarRadius
  );
  avatarGrad.addColorStop(0, config.primaryColor || '#ef4444');
  avatarGrad.addColorStop(1, config.secondaryColor || '#f97316');

  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
  ctx.fillStyle = avatarGrad;
  ctx.shadowColor = (config.primaryColor || '#ef4444') + '88';
  ctx.shadowBlur = 18 * scale;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 0;
  ctx.fillText(config.avatarText || 'YT', avatarX, avatarY);
  ctx.restore();

  // Channel Name & Followers
  const textX = avatarX + avatarRadius + 24 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold ${26 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(config.title, textX, cardY + cardHeight / 2 - 4 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(
    config.subtitle || `${config.subscriberCount || '1.25M'} subscribers`,
    textX,
    cardY + cardHeight / 2 + 6 * scale
  );

  // Subscribe Button click animation sequence
  // 0.0 - 0.45: Normal "SUBSCRIBE" red button
  // 0.45 - 0.55: Mouse click compression effect
  // 0.55 - 1.0: Turns into "SUBSCRIBED" with checkmark + bell ringing
  const isSubscribed = progress > 0.52;
  const clickBounce = windowProgress(progress, 0.45, 0.55, (t) => Math.sin(t * Math.PI));

  const btnWidth = 175 * scale;
  const btnHeight = 52 * scale;
  const btnX = cardX + cardWidth - btnWidth - 85 * scale;
  const btnY = cardY + (cardHeight - btnHeight) / 2;

  ctx.save();
  ctx.translate(btnX + btnWidth / 2, btnY + btnHeight / 2);
  const btnScale = 1 - clickBounce * 0.15;
  ctx.scale(btnScale, btnScale);
  ctx.translate(-(btnX + btnWidth / 2), -(btnY + btnHeight / 2));

  roundRect(ctx, btnX, btnY, btnWidth, btnHeight, 26 * scale);

  if (isSubscribed) {
    ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ SUBSCRIBED', btnX + btnWidth / 2, btnY + btnHeight / 2);
  } else {
    ctx.fillStyle = config.primaryColor || '#ef4444';
    ctx.shadowColor = (config.primaryColor || '#ef4444') + '99';
    ctx.shadowBlur = 18 * scale;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${19 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SUBSCRIBE', btnX + btnWidth / 2, btnY + btnHeight / 2);
  }
  ctx.restore();

  // Bell Icon with Ringing Animation
  const bellX = cardX + cardWidth - 48 * scale;
  const bellY = cardY + cardHeight / 2;
  const bellRing =
    isSubscribed && progress < 0.85
      ? Math.sin((progress - 0.52) * 45) * 0.3
      : 0;

  ctx.save();
  ctx.translate(bellX, bellY);
  ctx.rotate(bellRing);

  // Bell icon drawing
  ctx.fillStyle = isSubscribed ? (config.accentColor || '#fbbf24') : '#94a3b8';
  if (isSubscribed) {
    ctx.shadowColor = (config.accentColor || '#fbbf24') + 'aa';
    ctx.shadowBlur = 16 * scale;
  }
  
  ctx.beginPath();
  ctx.arc(0, -4 * scale, 12 * scale, Math.PI, 0, false);
  ctx.lineTo(16 * scale, 12 * scale);
  ctx.lineTo(-16 * scale, 12 * scale);
  ctx.closePath();
  ctx.fill();

  // Bell clapper
  ctx.beginPath();
  ctx.arc(0, 15 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}
