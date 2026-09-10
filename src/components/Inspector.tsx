import { useState } from 'react';
import type { TemplateConfig, ChartDataItem } from '../types/template';
import { Sliders, Palette, Clock, Plus, Trash2 } from 'lucide-react';

interface InspectorProps {
  config: TemplateConfig;
  onChange: (updated: Partial<TemplateConfig>) => void;
}

const COLOR_PRESETS = [
  {
    name: 'Cyber Indigo',
    primary: '#6366f1',
    secondary: '#38bdf8',
    accent: '#a855f7',
    card: 'rgba(15, 23, 42, 0.94)',
  },
  {
    name: 'Sunset Glow',
    primary: '#f43f5e',
    secondary: '#fb923c',
    accent: '#fbbf24',
    card: 'rgba(24, 24, 27, 0.94)',
  },
  {
    name: 'Emerald Fintech',
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#34d399',
    card: 'rgba(6, 78, 59, 0.3)',
  },
  {
    name: 'Studio Neon',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    accent: '#06b6d4',
    card: 'rgba(17, 24, 39, 0.94)',
  },
  {
    name: 'Minimal Mono',
    primary: '#ffffff',
    secondary: '#94a3b8',
    accent: '#38bdf8',
    card: 'rgba(2, 6, 23, 0.96)',
  },
];

export const Inspector: React.FC<InspectorProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'timing'>('content');

  // Chart data management
  const handleItemChange = (index: number, field: keyof ChartDataItem, value: any) => {
    if (!config.chartData) return;
    const next = [...config.chartData];
    next[index] = { ...next[index], [field]: value };
    onChange({ chartData: next });
  };

  const handleAddItem = () => {
    const next = [...(config.chartData || [])];
    const newIdx = next.length + 1;
    next.push({
      id: `${Date.now()}`,
      label: `Item ${newIdx}`,
      value: Math.floor(Math.random() * 80) + 20,
      color: config.primaryColor,
    });
    onChange({ chartData: next });
  };

  const handleRemoveItem = (index: number) => {
    if (!config.chartData || config.chartData.length <= 2) return;
    const next = config.chartData.filter((_, i) => i !== index);
    onChange({ chartData: next });
  };

  return (
    <aside className="w-84 border-l border-slate-800 bg-slate-900/70 backdrop-blur flex flex-col h-full overflow-hidden shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/90 p-1 gap-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition ${
            activeTab === 'content'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Data & Text</span>
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition ${
            activeTab === 'style'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Palette</span>
        </button>
        <button
          onClick={() => setActiveTab('timing')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition ${
            activeTab === 'timing'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timing</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activeTab === 'content' && (
          <>
            {/* Common Text Inputs */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Titles & Labels
              </label>
              <div>
                <span className="text-xs text-slate-300 block mb-1">Primary Title / Name</span>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onChange({ title: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-300 block mb-1">Subtitle / Role</span>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => onChange({ subtitle: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {config.badgeText !== undefined && (
                <div>
                  <span className="text-xs text-slate-300 block mb-1">Tag / Pill Badge</span>
                  <input
                    type="text"
                    value={config.badgeText}
                    onChange={(e) => onChange({ badgeText: e.target.value })}
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Metric specifics */}
            {config.category === 'metric' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Counter Values
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Start Value</span>
                    <input
                      type="number"
                      value={config.metricStart ?? 0}
                      onChange={(e) => onChange({ metricStart: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Target End Value</span>
                    <input
                      type="number"
                      value={config.metricEnd ?? 1000}
                      onChange={(e) => onChange({ metricEnd: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Prefix (e.g. $)</span>
                    <input
                      type="text"
                      value={config.prefix || ''}
                      onChange={(e) => onChange({ prefix: e.target.value })}
                      placeholder="$"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Suffix (e.g. + / %)</span>
                    <input
                      type="text"
                      value={config.suffix || ''}
                      onChange={(e) => onChange({ suffix: e.target.value })}
                      placeholder="%"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social specifics */}
            {config.category === 'social' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Social Details
                </label>
                <div>
                  <span className="text-xs text-slate-300 block mb-1">Avatar Initials</span>
                  <input
                    type="text"
                    maxLength={3}
                    value={config.avatarText || 'YT'}
                    onChange={(e) => onChange({ avatarText: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-300 block mb-1">Handle (e.g. @username)</span>
                  <input
                    type="text"
                    value={config.handle || ''}
                    onChange={(e) => onChange({ handle: e.target.value })}
                    placeholder="@channel"
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-300 block mb-1">Followers / Subscriber Count</span>
                  <input
                    type="text"
                    value={config.subscriberCount || ''}
                    onChange={(e) => onChange({ subscriberCount: e.target.value })}
                    placeholder="1.2M"
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* News & Documentary specifics */}
            {config.category === 'news' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Documentary & Source Details
                </label>
                {config.locationText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Location Stamp</span>
                    <input
                      type="text"
                      value={config.locationText}
                      onChange={(e) => onChange({ locationText: e.target.value })}
                      placeholder="KYIV, UKRAINE"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.dateText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Date / Timestamp Stamp</span>
                    <input
                      type="text"
                      value={config.dateText}
                      onChange={(e) => onChange({ dateText: e.target.value })}
                      placeholder="OCTOBER 24, 2024"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.sourceCitation !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Source / Archive Citation</span>
                    <input
                      type="text"
                      value={config.sourceCitation}
                      onChange={(e) => onChange({ sourceCitation: e.target.value })}
                      placeholder="National Security Archive"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.quoteText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Full Quotation Body</span>
                    <textarea
                      rows={3}
                      value={config.quoteText}
                      onChange={(e) => onChange({ quoteText: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.chapterNumber !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Chapter Tag</span>
                    <input
                      type="text"
                      value={config.chapterNumber}
                      onChange={(e) => onChange({ chapterNumber: e.target.value })}
                      placeholder="CHAPTER 04"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Branding specifics */}
            {config.category === 'branding' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Branding Details
                </label>
                {config.brandLogoText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Brand Monogram / Logo Mark</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={config.brandLogoText}
                      onChange={(e) => onChange({ brandLogoText: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.brandTagline !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Brand Tagline</span>
                    <input
                      type="text"
                      value={config.brandTagline}
                      onChange={(e) => onChange({ brandTagline: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.websiteUrl !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Website URL</span>
                    <input
                      type="text"
                      value={config.websiteUrl}
                      onChange={(e) => onChange({ websiteUrl: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.ctaText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Call To Action (CTA)</span>
                    <input
                      type="text"
                      value={config.ctaText}
                      onChange={(e) => onChange({ ctaText: e.target.value })}
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Commercial specifics */}
            {config.category === 'commercial' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Commercial & Pricing
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {config.productPrice !== undefined && (
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">Current Price</span>
                      <input
                        type="text"
                        value={config.productPrice}
                        onChange={(e) => onChange({ productPrice: e.target.value })}
                        placeholder="$299"
                        className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                  {config.originalPrice !== undefined && (
                    <div>
                      <span className="text-xs text-slate-300 block mb-1">Original Price</span>
                      <input
                        type="text"
                        value={config.originalPrice}
                        onChange={(e) => onChange({ originalPrice: e.target.value })}
                        placeholder="$499"
                        className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
                {config.discountPercent !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Discount Tag</span>
                    <input
                      type="text"
                      value={config.discountPercent}
                      onChange={(e) => onChange({ discountPercent: e.target.value })}
                      placeholder="-40%"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.saleTitle !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Promo / Sale Header</span>
                    <input
                      type="text"
                      value={config.saleTitle}
                      onChange={(e) => onChange({ saleTitle: e.target.value })}
                      placeholder="FLASH SALE"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.ctaText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Button / CTA Text</span>
                    <input
                      type="text"
                      value={config.ctaText}
                      onChange={(e) => onChange({ ctaText: e.target.value })}
                      placeholder="SHOP NOW"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Creator specifics */}
            {config.category === 'creator' && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Creator Details
                </label>
                {config.handle !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Handle</span>
                    <input
                      type="text"
                      value={config.handle}
                      onChange={(e) => onChange({ handle: e.target.value })}
                      placeholder="@creator"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.subscriberCount !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Subscribers / Stats</span>
                    <input
                      type="text"
                      value={config.subscriberCount}
                      onChange={(e) => onChange({ subscriberCount: e.target.value })}
                      placeholder="1.25M SUBSCRIBERS"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
                {config.ctaText !== undefined && (
                  <div>
                    <span className="text-xs text-slate-300 block mb-1">Call to Action</span>
                    <input
                      type="text"
                      value={config.ctaText}
                      onChange={(e) => onChange({ ctaText: e.target.value })}
                      placeholder="SUBSCRIBE"
                      className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Chart items list */}
            {config.chartData && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Data Points ({config.chartData.length})
                  </label>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {config.chartData.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700/40 text-xs"
                    >
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                        className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-white font-medium"
                      />
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) =>
                          handleItemChange(index, 'value', parseFloat(e.target.value) || 0)
                        }
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-white font-mono"
                      />
                      <button
                        onClick={() => handleRemoveItem(index)}
                        disabled={config.chartData!.length <= 2}
                        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'style' && (
          <div className="space-y-5">
            {/* Presets */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Color Themes
              </label>
              <div className="grid grid-cols-1 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      onChange({
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        accentColor: preset.accent,
                        cardColor: preset.card,
                      })
                    }
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition group"
                  >
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                      {preset.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Custom Palette
              </label>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Primary Accent</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{config.primaryColor}</span>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => onChange({ primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Secondary Accent</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{config.secondaryColor}</span>
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => onChange({ secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Highlight / Tooltip</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{config.accentColor}</span>
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => onChange({ accentColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Text Color</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{config.textColor}</span>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Animation Duration
            </label>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Total Duration</span>
                <span className="font-mono text-indigo-400 font-bold">{config.duration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={10.0}
                step={0.5}
                value={config.duration}
                onChange={(e) => onChange({ duration: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex gap-1.5 mt-2">
                {[3, 5, 8, 10].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onChange({ duration: sec })}
                    className={`flex-1 py-1 rounded text-[11px] font-mono font-medium transition ${
                      Math.abs(config.duration - sec) < 0.1
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Export Framerate
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChange({ fps: 30 })}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                    config.fps === 30
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  30 FPS (Standard)
                </button>
                <button
                  onClick={() => onChange({ fps: 60 })}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                    config.fps === 60
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  60 FPS (Ultra Smooth)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
