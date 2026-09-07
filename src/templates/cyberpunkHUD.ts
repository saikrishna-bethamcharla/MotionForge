import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

export function renderCyberpunkHUD(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 800 * scale;
  const cardH = 460 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // Entrance
  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Cyberpunk Card background
  roundRect(ctx, cardX, cardY, cardW, cardH, 12 * scale);
  ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
  ctx.fill();

  // Cyberpunk Neon Corner Brackets
  const cornerLen = 40 * scale;
  const cornerPad = 12 * scale;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3.5 * scale;
  ctx.lineCap = 'square';

  // Top-left
  ctx.beginPath();
  ctx.moveTo(cardX - cornerPad, cardY - cornerPad + cornerLen);
  ctx.lineTo(cardX - cornerPad, cardY - cornerPad);
  ctx.lineTo(cardX - cornerPad + cornerLen, cardY - cornerPad);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(cardX + cardW + cornerPad - cornerLen, cardY - cornerPad);
  ctx.lineTo(cardX + cardW + cornerPad, cardY - cornerPad);
  ctx.lineTo(cardX + cardW + cornerPad, cardY - cornerPad + cornerLen);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(cardX - cornerPad, cardY + cardH + cornerPad - cornerLen);
  ctx.lineTo(cardX - cornerPad, cardY + cardH + cornerPad);
  ctx.lineTo(cardX - cornerPad + cornerLen, cardY + cardH + cornerPad);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(cardX + cardW + cornerPad - cornerLen, cardY + cardH + cornerPad);
  ctx.lineTo(cardX + cardW + cornerPad, cardY + cardH + cornerPad);
  ctx.lineTo(cardX + cardW + cornerPad, cardY + cardH + cornerPad - cornerLen);
  ctx.stroke();

  // Grid scan line animation across card
  const scanY = cardY + ((progress * 1.8) % 1) * cardH;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(cardX, scanY);
  ctx.lineTo(cardX + cardW, scanY);
  ctx.stroke();

  // HUD Status Header
  ctx.fillStyle = '#00f0ff';
  ctx.font = `900 ${14 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('// SYSTEM_STATUS: ONLINE [PROTOCOL_V9]', cardX + 36 * scale, cardY + 36 * scale);

  ctx.fillStyle = '#ff0055';
  ctx.textAlign = 'right';
  ctx.fillText(config.badgeText || 'SECURE_NODE #84', cardX + cardW - 36 * scale, cardY + 36 * scale);

  // Main Target Label / Title
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${42 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(config.title || 'NEURAL CORE ACTIVE', cardX + 36 * scale, cardY + 80 * scale);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Sub-routine quantum encryption synced', cardX + 36 * scale, cardY + 138 * scale);

  // Data readout grid metrics
  const gridY = cardY + 200 * scale;
  const metrics = [
    { label: 'THROUGHPUT', val: '9.4 TB/S', col: '#00f0ff' },
    { label: 'LATENCY', val: '0.42 MS', col: '#39ff14' },
    { label: 'CORES', val: '128 CLUSTERS', col: '#ffe600' },
    { label: 'HEAT FLUX', val: '44.8°C', col: '#ff0055' },
  ];

  const colW = (cardW - 72 * scale) / 4;
  metrics.forEach((m, idx) => {
    const mx = cardX + 36 * scale + idx * colW;

    // Small box background
    roundRect(ctx, mx, gridY, colW - 12 * scale, 100 * scale, 6 * scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.font = `700 ${12 * scale}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(m.label, mx + 14 * scale, gridY + 18 * scale);

    ctx.fillStyle = m.col;
    ctx.font = `900 ${22 * scale}px monospace`;
    ctx.fillText(m.val, mx + 14 * scale, gridY + 54 * scale);
  });

  // Crosshair Target reticle on bottom right
  const chX = cardX + cardW - 80 * scale;
  const chY = cardY + cardH - 80 * scale;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(chX, chY, 24 * scale, 0, Math.PI * 2);
  ctx.moveTo(chX - 32 * scale, chY);
  ctx.lineTo(chX + 32 * scale, chY);
  ctx.moveTo(chX, chY - 32 * scale);
  ctx.lineTo(chX, chY + 32 * scale);
  ctx.stroke();

  // Bottom code ticker
  ctx.fillStyle = 'rgba(100, 116, 139, 0.9)';
  ctx.font = `600 ${13 * scale}px monospace`;
  ctx.fillText('> EXECUTING SHADER_PIPELINE... BUFFER[OK]', cardX + 36 * scale, cardY + cardH - 40 * scale);

  ctx.restore();
}
