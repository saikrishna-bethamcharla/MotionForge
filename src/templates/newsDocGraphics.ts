import type { RenderContext } from '../types/template';
import { Easing, windowProgress, roundRect } from '../engine/animator';

// ==========================================
// 1. BREAKING-NEWS BAR
// ==========================================
export function renderBreakingNewsBar(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const barW = width;
  const barH = 135 * scale;
  const barY = height - barH - 35 * scale;

  // Slide-in entrance from bottom-left
  const slideProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const currentY = barY + (1 - slideProg) * 60 * scale;

  // Top Red Alert Stripe
  const alertH = 46 * scale;
  ctx.fillStyle = config.primaryColor || '#dc2626';
  ctx.fillRect(0, currentY, barW, alertH);

  // Pulsing "LIVE" / "BREAKING" Indicator
  const pulse = Math.abs(Math.sin(progress * 20));
  const dotX = 48 * scale;
  const dotY = currentY + alertH / 2;

  ctx.beginPath();
  ctx.arc(dotX, dotY, 9 * scale, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.badgeText || 'BREAKING NEWS', dotX + 22 * scale, dotY);

  // Time / Network Stamp on Right
  const timeStr = config.dateText || 'LIVE • 14:32 EST';
  ctx.font = `bold ${16 * scale}px monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(timeStr, barW - 48 * scale, dotY);

  // Lower Main Headline Ticker Background
  const mainH = barH - alertH;
  ctx.fillStyle = config.cardColor || '#0a0a0c';
  ctx.fillRect(0, currentY + alertH, barW, mainH);

  // Yellow Left Marker Tag
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.fillRect(0, currentY + alertH, 12 * scale, mainH);

  // Primary Headline
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const headline = config.title || 'CRITICAL DEVELOPMENTS UNFOLD IN CAPITAL ACCORDING TO RECENT REPORTS';
  ctx.fillText(headline, 48 * scale, currentY + alertH + mainH * 0.4, barW - 96 * scale);

  // Sub-ticker
  ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
  ctx.font = `500 ${17 * scale}px system-ui, -apple-system, sans-serif`;
  const ticker = config.subtitle || 'Officials urge calm as investigation into anomalous event begins • Developing story';
  ctx.fillText(ticker, 48 * scale, currentY + alertH + mainH * 0.78, barW - 96 * scale);

  ctx.restore();
}

// ==========================================
// 2. NEWS LOWER THIRD
// ==========================================
export function renderNewsLowerThird(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 980 * scale;
  const cardH = 150 * scale;
  const cardX = 90 * scale;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX - (1 - enterProg) * 80 * scale;

  // Top Network Badge / Category
  const tagW = 200 * scale;
  const tagH = 34 * scale;
  roundRect(ctx, currentX, cardY, tagW, tagH, [8 * scale, 8 * scale, 0, 0]);
  ctx.fillStyle = config.primaryColor || '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${14 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.badgeText || 'SPECIAL REPORT', currentX + tagW / 2, cardY + tagH / 2);

  // Main Banner Background
  roundRect(ctx, currentX, cardY + tagH, cardW, cardH - tagH, [0, 16 * scale, 16 * scale, 16 * scale]);
  ctx.fillStyle = config.cardColor || 'rgba(11, 15, 25, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.shadowOffsetY = 12 * scale;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Blue / Accent Left Accent Column
  ctx.fillStyle = config.secondaryColor || '#2563eb';
  roundRect(ctx, currentX, cardY + tagH, 10 * scale, cardH - tagH, [0, 0, 0, 16 * scale]);
  ctx.fill();

  // Speaker Name & Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.title || 'DR. JONATHAN REED, Ph.D.', currentX + 38 * scale, cardY + tagH + 34 * scale);

  // Speaker Description / Location
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  const subText = config.subtitle || 'Senior Research Fellow, Atmospheric Sciences • Geneva';
  ctx.fillText(subText, currentX + 38 * scale, cardY + tagH + 74 * scale, cardW - 70 * scale);

  ctx.restore();
}

// ==========================================
// 3. LOCATION / DATE SLUG
// ==========================================
export function renderLocationDateSlug(rc: RenderContext) {
  const { ctx, width, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 540 * scale;
  const cardH = 92 * scale;
  const cardX = 90 * scale;
  const cardY = 90 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX - (1 - enterProg) * 40 * scale;

  // Background
  roundRect(ctx, currentX, cardY, cardW, cardH, 10 * scale);
  ctx.fillStyle = 'rgba(10, 10, 12, 0.88)';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Left Orange / Red vertical pill
  ctx.fillStyle = config.primaryColor || '#ea580c';
  roundRect(ctx, currentX, cardY, 6 * scale, cardH, [10 * scale, 0, 0, 10 * scale]);
  ctx.fill();

  // Location Pin Icon + Location Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${24 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const loc = config.locationText || config.title || 'KYIV, UKRAINE';
  ctx.fillText(`📍 ${loc}`, currentX + 26 * scale, cardY + 30 * scale);

  // Timestamp & Date
  ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
  ctx.font = `600 ${16 * scale}px monospace`;
  const dateStr = config.dateText || config.subtitle || 'OCTOBER 24, 2024 // 04:15 AM LOCAL';
  ctx.fillText(dateStr, currentX + 30 * scale, cardY + 64 * scale);

  ctx.restore();
}

// ==========================================
// 4. HEADLINE CARD
// ==========================================
export function renderHeadlineCard(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1180 * scale;
  const cardH = 540 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Background Card
  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 20 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Top Category Pill
  const pillW = 220 * scale;
  const pillH = 36 * scale;
  roundRect(ctx, cardX + 54 * scale, cardY + 50 * scale, pillW, pillH, 18 * scale);
  ctx.fillStyle = config.primaryColor || '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${15 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(config.badgeText || 'GLOBAL INVESTIGATION', cardX + 54 * scale + pillW / 2, cardY + 50 * scale + pillH / 2);

  // Big Headline
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${46 * scale}px Georgia, serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const headline = config.title || 'THE CLASSIFIED ARCHIVE: INSIDE THE DECADE OF SECRETS';
  ctx.fillText(headline, cardX + 54 * scale, cardY + 115 * scale, cardW - 108 * scale);

  // Decorative Rule Line
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.fillRect(cardX + 54 * scale, cardY + 250 * scale, 120 * scale, 4 * scale);

  // Lead Paragraph
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  const lead = config.subtitle || 'Thousands of unredacted communications reveal how top directives shaped historical diplomatic outcomes behind closed doors.';
  ctx.fillText(lead, cardX + 54 * scale, cardY + 280 * scale, cardW - 108 * scale);

  // Timestamp & Source citation footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${16 * scale}px monospace`;
  const citation = config.sourceCitation || 'VERIFIED BY INDEPENDENT CONSORTIUM OF JOURNALISTS';
  ctx.fillText(`DOCUMENT ARCHIVE // ${citation}`, cardX + 54 * scale, cardY + cardH - 60 * scale);

  ctx.restore();
}

// ==========================================
// 5. QUOTE GRAPHIC
// ==========================================
export function renderQuoteGraphic(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1200 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentY = cardY + (1 - enterProg) * 30 * scale;

  // Background
  roundRect(ctx, cardX, currentY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Huge Editorial Stylized Quotation Mark
  ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.font = `900 ${180 * scale}px Georgia, serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('“', cardX + 50 * scale, currentY + 15 * scale);

  // Quote Text
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `italic 600 ${36 * scale}px Georgia, serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const quote = config.quoteText || config.title || '“We knew the risks from day one, but staying silent was no longer an option when human lives were at stake.”';
  ctx.fillText(quote, cardX + 110 * scale, currentY + 100 * scale, cardW - 200 * scale);

  // Author & Credentials
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.font = `bold ${26 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`— ${config.subtitle || 'Marcus Vance'}`, cardX + 110 * scale, currentY + 340 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${19 * scale}px system-ui, -apple-system, sans-serif`;
  const role = config.authorRole || config.badgeText || 'Former Operations Director • 2019-2024';
  ctx.fillText(role, cardX + 110 * scale, currentY + 385 * scale);

  ctx.restore();
}

// ==========================================
// 6. SOURCE CITATION
// ==========================================
export function renderSourceCitation(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 580 * scale;
  const cardH = 88 * scale;
  const cardX = width - cardW - 80 * scale;
  const cardY = height - cardH - 80 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX + (1 - enterProg) * 40 * scale;

  roundRect(ctx, currentX, cardY, cardW, cardH, 10 * scale);
  ctx.fillStyle = 'rgba(10, 15, 25, 0.9)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // Left Tag
  ctx.fillStyle = '#2563eb';
  roundRect(ctx, currentX, cardY, 6 * scale, cardH, [10 * scale, 0, 0, 10 * scale]);
  ctx.fill();

  // Source Label
  ctx.fillStyle = '#38bdf8';
  ctx.font = `900 ${14 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SOURCE ARCHIVE // OFFICIAL CITATION', currentX + 24 * scale, cardY + 18 * scale);

  // Source Name & Reference
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${20 * scale}px system-ui, -apple-system, sans-serif`;
  const cite = config.sourceCitation || config.title || 'National Security Archive • Declassified Dossier #4092';
  ctx.fillText(cite, currentX + 24 * scale, cardY + 44 * scale, cardW - 48 * scale);

  ctx.restore();
}

// ==========================================
// 7. "ACCORDING TO..." GRAPHIC
// ==========================================
export function renderAccordingToGraphic(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1120 * scale;
  const cardH = 500 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentY = cardY + (1 - enterProg) * 20 * scale;

  // Background Card
  roundRect(ctx, cardX, currentY, cardW, cardH, 20 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 20, 32, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 32 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Top Red / Yellow Heading
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.font = `900 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const prefix = config.badgeText || 'ACCORDING TO INTERNAL EMAILS & COURT TESTIMONY:';
  ctx.fillText(prefix, cardX + 54 * scale, currentY + 46 * scale);

  // Key Quote / Revelation
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `bold 600 ${36 * scale}px Georgia, serif`;
  const quote = config.quoteText || config.title || '“Leadership was briefed three months prior to the failure, but no remediation protocol was authorized.”';
  ctx.fillText(quote, cardX + 54 * scale, currentY + 110 * scale, cardW - 108 * scale);

  // Divider
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(cardX + 54 * scale, currentY + 280 * scale, cardW - 108 * scale, 1 * scale);

  // Source & Exhibit Details
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${18 * scale}px monospace`;
  const exhibit = config.sourceCitation || config.subtitle || 'UNITED STATES DISTRICT COURT // EXHIBIT C-198';
  ctx.fillText(`REF: ${exhibit}`, cardX + 54 * scale, currentY + 310 * scale);

  // Watermark stamp
  ctx.save();
  ctx.translate(cardX + cardW - 220 * scale, currentY + 360 * scale);
  ctx.rotate(-0.15);
  ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
  ctx.font = `900 ${32 * scale}px monospace`;
  ctx.fillText('[CONFIDENTIAL]', 0, 0);
  ctx.restore();

  ctx.restore();
}

// ==========================================
// 8. TIMELINE
// ==========================================
export function renderDocTimeline(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 1400 * scale;
  const cardH = 460 * scale;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Background
  roundRect(ctx, cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fillStyle = config.cardColor || 'rgba(15, 23, 42, 0.95)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Header Title
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'CHRONOLOGY OF EVENTS', cardX + 54 * scale, cardY + 44 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${18 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Key milestones leading up to the historic accord', cardX + 54 * scale, cardY + 88 * scale);

  // Timeline Items
  const items = config.timelineItems || [
    { id: '1', date: 'JAN 2021', title: 'First Detection', description: 'Unusual signal variance logged' },
    { id: '2', date: 'AUG 2022', title: 'Taskforce Formed', description: 'Joint committee convenes in Zurich' },
    { id: '3', date: 'MAR 2023', title: 'Whistleblower Leak', description: 'Internal dossier published' },
    { id: '4', date: 'NOV 2024', title: 'Treaty Signed', description: 'Global resolution ratified' },
  ];

  const lineY = cardY + 230 * scale;
  const startX = cardX + 120 * scale;
  const endX = cardX + cardW - 120 * scale;
  const totalW = endX - startX;

  // Animated Path Progress
  const pathProg = windowProgress(progress, 0.08, 0.40, Easing.easeOutQuart);

  // Background connecting line
  ctx.beginPath();
  ctx.moveTo(startX, lineY);
  ctx.lineTo(endX, lineY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Active glowing path line
  if (pathProg > 0) {
    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(startX + totalW * pathProg, lineY);
    ctx.strokeStyle = config.primaryColor || '#6366f1';
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
  }

  // Nodes
  items.forEach((item, idx) => {
    const nodeX = startX + (idx / (items.length - 1)) * totalW;
    const nodeProg = windowProgress(pathProg, idx / items.length, 1.0, Easing.easeOutBack);

    if (nodeProg > 0.01) {
      ctx.save();
      ctx.translate(nodeX, lineY);
      ctx.scale(nodeProg, nodeProg);

      // Node Outer Ring
      ctx.beginPath();
      ctx.arc(0, 0, 16 * scale, 0, Math.PI * 2);
      ctx.fillStyle = config.primaryColor || '#6366f1';
      ctx.shadowColor = config.primaryColor || '#6366f1';
      ctx.shadowBlur = 12 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node Inner Dot
      ctx.beginPath();
      ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // Date above
      ctx.fillStyle = config.accentColor || '#f59e0b';
      ctx.font = `900 ${18 * scale}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(item.date, nodeX, lineY - 45 * scale);

      // Title & Description below
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(item.title, nodeX, lineY + 36 * scale);

      if (item.description) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = `500 ${14 * scale}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(item.description, nodeX, lineY + 65 * scale);
      }
    }
  });

  ctx.restore();
}

// ==========================================
// 9. DOCUMENT HIGHLIGHT
// ==========================================
export function renderDocumentHighlight(rc: RenderContext) {
  const { ctx, width, height, progress } = rc;
  const scale = width / 1920;

  const docW = 900 * scale;
  const docH = 680 * scale;
  const docX = (width - docW) / 2;
  const docY = (height - docH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentY = docY + (1 - enterProg) * 30 * scale;

  // Paper Memo Background (Off-white / aged doc)
  roundRect(ctx, docX, currentY, docW, docH, 12 * scale);
  ctx.fillStyle = '#f8fafc';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 36 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Header Stamp
  ctx.fillStyle = '#dc2626';
  ctx.font = `900 ${20 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('TOP SECRET // EYES ONLY // DECLASSIFIED', docX + 54 * scale, currentY + 54 * scale);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${14 * scale}px monospace`;
  ctx.fillText('MEMORANDUM FOR THE SPECIAL COMMITTEE', docX + 54 * scale, currentY + 84 * scale);

  // Divider
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(docX + 54 * scale, currentY + 104 * scale, docW - 108 * scale, 2 * scale);

  // Document Lines Simulation
  const startLineY = currentY + 140 * scale;
  ctx.fillStyle = '#334155';
  ctx.font = `500 ${20 * scale}px 'Courier New', Courier, monospace`;

  const lines = [
    'SUBJECT: REVIEW OF SYSTEM TELEMETRY ANOMALIES',
    'DATE: 14 SEPTEMBER 2023 // LOG REF: 902-DX',
    '',
    'During routine inspections of Sector 4 facilities,',
    'field engineers recorded unaccounted energy surges',
    'reaching threshold limits. Prior disclosures were',
    'deliberately omitted from congressional packets.',
  ];

  lines.forEach((l, i) => {
    ctx.fillText(l, docX + 54 * scale, startLineY + i * 36 * scale);
  });

  // Animated Yellow Highlighter Sweep on Line 5 & 6 (deliberately omitted)
  const highProg = windowProgress(progress, 0.12, 0.38, Easing.easeOutQuart);
  if (highProg > 0) {
    const hlY = startLineY + 5 * 36 * scale - 20 * scale;
    const targetW = (docW - 108 * scale) * 0.9;
    const hlW = targetW * highProg;

    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)'; // Bright highlighter yellow
    ctx.fillRect(docX + 50 * scale, hlY, hlW, 32 * scale);
    ctx.restore();
  }

  // Red Stamp: EXHIBIT B
  ctx.save();
  ctx.translate(docX + docW - 160 * scale, currentY + docH - 80 * scale);
  ctx.rotate(-0.1);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3 * scale;
  roundRect(ctx, -70 * scale, -24 * scale, 140 * scale, 48 * scale, 6 * scale);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.font = `900 ${20 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('EXHIBIT A', 0, 0);
  ctx.restore();

  ctx.restore();
}

// ==========================================
// 10. NEWSPAPER CLIPPING ANIMATION
// ==========================================
export function renderNewspaperClipping(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const clipW = 1040 * scale;
  const clipH = 620 * scale;
  const clipX = (width - clipW) / 2;
  const clipY = (height - clipH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutBack);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(enterProg, enterProg);
  ctx.translate(-width / 2, -height / 2);
  ctx.globalAlpha = alpha;

  // Newsprint Paper
  roundRect(ctx, clipX, clipY, clipW, clipH, 6 * scale);
  ctx.fillStyle = '#f4eedb'; // Aged paper parchment
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40 * scale;
  ctx.shadowOffsetY = 20 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Newspaper Masthead
  ctx.fillStyle = '#1c1917';
  ctx.font = `900 ${44 * scale}px 'Times New Roman', Times, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(config.badgeText || 'THE DAILY CHRONICLE', width / 2, clipY + 36 * scale);

  // Date and Price bar
  ctx.fillStyle = '#44403c';
  ctx.font = `italic 600 ${15 * scale}px 'Times New Roman', Times, serif`;
  ctx.fillText(config.dateText || 'Vol. CXXXIV No. 42 • Morning Edition • Five Cents', width / 2, clipY + 92 * scale);

  // Thick Masthead Divider Lines
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(clipX + 48 * scale, clipY + 118 * scale, clipW - 96 * scale, 3 * scale);
  ctx.fillRect(clipX + 48 * scale, clipY + 125 * scale, clipW - 96 * scale, 1 * scale);

  // Giant Main Headline
  ctx.fillStyle = '#0c0a09';
  ctx.font = `900 ${52 * scale}px 'Times New Roman', Times, serif`;
  ctx.textAlign = 'center';
  const headline = config.title || 'CRITICAL SYSTEM FAILURE SHUTS DOWN POWER GRID';
  ctx.fillText(headline, width / 2, clipY + 145 * scale, clipW - 120 * scale);

  // Multi-column newspaper text simulation
  const colsY = clipY + 280 * scale;
  const colW = (clipW - 96 * scale - 60 * scale) / 3;

  for (let c = 0; c < 3; c++) {
    const cx = clipX + 48 * scale + c * (colW + 30 * scale);
    ctx.fillStyle = '#292524';
    ctx.font = `500 ${14 * scale}px 'Times New Roman', Times, serif`;
    ctx.textAlign = 'left';
    ctx.fillText('Federal investigators arrived on the scene early this morning following unprecedented failures across interconnected energy networks...', cx, colsY, colW);
    ctx.fillText('Eyewitnesses described rapid cascading blackouts occurring within seconds across multiple metropolitan zones simultaneously...', cx, colsY + 90 * scale, colW);
  }

  // Red Evidence Marker Circle Drawn over the Headline
  const circleProg = windowProgress(progress, 0.14, 0.38, Easing.easeOutQuart);
  if (circleProg > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(width / 2, clipY + 195 * scale, 380 * scale, 55 * scale, -0.04, 0, Math.PI * 2 * circleProg);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ==========================================
// 11. EVIDENCE / CASE-FILE GRAPHIC
// ==========================================
export function renderEvidenceCasefile(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const fileW = 1080 * scale;
  const fileH = 600 * scale;
  const fileX = (width - fileW) / 2;
  const fileY = (height - fileH) / 2;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentY = fileY + (1 - enterProg) * 30 * scale;

  // Manila Dossier Folder
  roundRect(ctx, fileX, currentY, fileW, fileH, 16 * scale);
  ctx.fillStyle = '#d7c49e'; // Manila folder tan
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 36 * scale;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Top Tab
  const tabW = 260 * scale;
  const tabH = 34 * scale;
  roundRect(ctx, fileX + 40 * scale, currentY - tabH + 4 * scale, tabW, tabH, [10 * scale, 10 * scale, 0, 0]);
  ctx.fillStyle = '#c7b38d';
  ctx.fill();

  ctx.fillStyle = '#443322';
  ctx.font = `bold ${14 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CASE DOSSIER #492-B', fileX + 40 * scale + tabW / 2, currentY - tabH / 2);

  // Red CONFIDENTIAL stamp
  ctx.save();
  ctx.translate(fileX + fileW - 200 * scale, currentY + 80 * scale);
  ctx.rotate(0.12);
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 4 * scale;
  roundRect(ctx, -100 * scale, -25 * scale, 200 * scale, 50 * scale, 8 * scale);
  ctx.stroke();

  ctx.fillStyle = '#b91c1c';
  ctx.font = `900 ${22 * scale}px monospace`;
  ctx.fillText('CONFIDENTIAL', 0, 0);
  ctx.restore();

  // White Paper Sheet inside folder
  const sheetPad = 48 * scale;
  roundRect(ctx, fileX + sheetPad, currentY + sheetPad + 20 * scale, fileW - sheetPad * 2, fileH - sheetPad * 2 - 20 * scale, 8 * scale);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Case Subject Title
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${32 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'SUBJECT: OPERATION NIGHTFALL', fileX + sheetPad + 36 * scale, currentY + sheetPad + 50 * scale);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${18 * scale}px monospace`;
  ctx.fillText(config.subtitle || 'PRIMARY WITNESS STATEMENT • EXHIBIT 04', fileX + sheetPad + 36 * scale, currentY + sheetPad + 95 * scale);

  // Evidence Summary Body
  ctx.fillStyle = '#334155';
  ctx.font = `500 ${20 * scale}px 'Courier New', Courier, monospace`;
  const summary = config.quoteText || 'Physical hard drives recovered from the submerged site were transferred directly to cryptographic analysis on 12-OCT-2024.';
  ctx.fillText(summary, fileX + sheetPad + 36 * scale, currentY + sheetPad + 150 * scale, fileW - sheetPad * 2 - 72 * scale);

  // Barcode and Metadata footer
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 ${18 * scale}px monospace`;
  ctx.fillText('||| | | |||| | ||| |||| | | |||', fileX + sheetPad + 36 * scale, currentY + fileH - sheetPad - 40 * scale);
  ctx.fillStyle = '#64748b';
  ctx.font = `600 ${14 * scale}px monospace`;
  ctx.fillText('CHAIN OF CUSTODY VERIFIED', fileX + sheetPad + 360 * scale, currentY + fileH - sheetPad - 40 * scale);

  ctx.restore();
}

// ==========================================
// 12. PHOTO COLLAGE
// ==========================================
export function renderPhotoCollage(rc: RenderContext) {
  const { ctx, width, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Title on Top Left
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'ARCHIVAL PHOTOGRAPHIC EVIDENCE', 100 * scale, 90 * scale);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${20 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.subtitle || 'Documentary survey records (1998 - 2004)', 100 * scale, 140 * scale);

  // 3 Polaroid Style Photo Frames
  const photos = [
    { title: 'FIG 1.1: PRIMARY FACILITY', angle: -0.06, x: 260 * scale, y: 380 * scale },
    { title: 'FIG 1.2: UNDERGROUND VAULT', angle: 0.04, x: 780 * scale, y: 360 * scale },
    { title: 'FIG 1.3: RECOVERED LOGS', angle: -0.03, x: 1300 * scale, y: 390 * scale },
  ];

  const pw = 420 * scale;
  const ph = 460 * scale;

  photos.forEach((p, idx) => {
    const pProg = windowProgress(enterProg, idx * 0.2, 1.0, Easing.easeOutBack);
    if (pProg > 0) {
      ctx.save();
      ctx.translate(p.x + pw / 2, p.y + ph / 2);
      ctx.rotate(p.angle);
      ctx.scale(pProg, pProg);

      // White Photo Border
      roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 8 * scale);
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 24 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Photo Window (Dark cinematic blue)
      const pad = 24 * scale;
      roundRect(ctx, -pw / 2 + pad, -ph / 2 + pad, pw - pad * 2, ph - 110 * scale, 4 * scale);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Camera Crosshair Icon in Photo
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.arc(0, -50 * scale, 24 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Label at bottom of polaroid
      ctx.fillStyle = '#1e293b';
      ctx.font = `bold ${16 * scale}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(p.title, 0, ph / 2 - 45 * scale);

      ctx.restore();
    }
  });

  ctx.restore();
}

// ==========================================
// 13. INTERVIEW IDENTIFIER
// ==========================================
export function renderInterviewIdentifier(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const cardW = 900 * scale;
  const cardH = 135 * scale;
  const cardX = 90 * scale;
  const cardY = height - cardH - 85 * scale;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;
  const currentX = cardX - (1 - enterProg) * 60 * scale;

  // Background Card
  roundRect(ctx, currentX, cardY, cardW, cardH, 16 * scale);
  ctx.fillStyle = 'rgba(11, 15, 25, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Audio Waveform indicator on Left
  const waveX = currentX + 40 * scale;
  const waveY = cardY + cardH / 2;
  const barCount = 5;

  for (let i = 0; i < barCount; i++) {
    const waveH = (20 + Math.sin(progress * 25 + i) * 14) * scale;
    ctx.fillStyle = config.accentColor || '#38bdf8';
    roundRect(ctx, waveX + i * 10 * scale, waveY - waveH / 2, 4 * scale, waveH, 2 * scale);
    ctx.fill();
  }

  // Interviewee Name
  const textX = waveX + barCount * 10 * scale + 30 * scale;
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${36 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(config.title || 'ELENA ROSTOVA', textX, cardY + 28 * scale);

  // Subtitle / Title Credentials
  ctx.fillStyle = '#94a3b8';
  ctx.font = `600 ${19 * scale}px system-ui, -apple-system, sans-serif`;
  const role = config.subtitle || 'Former Lead Cryptographer • Ministry of Communications';
  ctx.fillText(role, textX, cardY + 76 * scale, cardW - (textX - currentX) - 30 * scale);

  ctx.restore();
}

// ==========================================
// 14. CHAPTER HEADING
// ==========================================
export function renderChapterHeading(rc: RenderContext) {
  const { ctx, width, height, progress, config } = rc;
  const scale = width / 1920;

  const enterProg = windowProgress(progress, 0, 0.08, Easing.easeOutQuart);
  const alpha = windowProgress(progress, 0, 0.05, Easing.easeOutQuad);

  ctx.save();
  ctx.globalAlpha = alpha;

  const centerY = height / 2;

  // Chapter Number Pill / Tag
  const chapterTag = config.chapterNumber || config.badgeText || 'CHAPTER 04';
  ctx.fillStyle = config.accentColor || '#f59e0b';
  ctx.font = `900 ${22 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`// ${chapterTag} //`, width / 2, centerY - 25 * scale);

  // Main Chapter Title (Cinematic Serif)
  ctx.fillStyle = config.textColor || '#ffffff';
  ctx.font = `900 ${58 * scale}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const title = config.title || 'THE TURNING POINT';
  ctx.fillText(title, width / 2, centerY + 25 * scale);

  // Subtitle / Context
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${22 * scale}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';
  const subtitle = config.subtitle || 'When the silence was finally broken';
  ctx.fillText(subtitle, width / 2, centerY + 80 * scale);

  // Animated Minimalist Line Rule under title
  const lineW = 340 * scale * enterProg;
  ctx.fillStyle = config.primaryColor || '#6366f1';
  ctx.fillRect(width / 2 - lineW / 2, centerY + 65 * scale, lineW, 2.5 * scale);

  ctx.restore();
}
