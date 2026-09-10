import React, { useState, useMemo } from 'react';
import { TEMPLATES } from '../templates/registry';
import type { TemplateDefinition } from '../templates/registry';
import type { TemplateCategory } from '../types/template';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CircleDot,
  Hash,
  Subtitles,
  Bell,
  PlaySquare,
  Camera,
  ThumbsUp,
  Layers,
  Search,
  SlidersHorizontal,
  Gauge,
  Target,
  Star,
  Newspaper,
  Cpu,
  Video,
  MessageSquare,
  FileText,
  MapPin,
  Quote,
  Bookmark,
  FileQuestion,
  Milestone,
  Highlighter,
  FolderOpen,
  Image as ImageIcon,
  Mic,
  BookOpen,
  Sparkles,
  ShoppingBag,
  Tag,
  Percent,
  QrCode,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: TemplateDefinition) => void;
}

type FilterCategory = 'all' | TemplateCategory;

const CATEGORY_TABS: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Templates', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'branding', label: 'Branding', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
  { id: 'creator', label: 'YouTube & Creator', icon: <PlaySquare className="w-3.5 h-3.5 text-red-500" /> },
  { id: 'commercial', label: 'Commercial & Ads', icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'news', label: 'News & Doc', icon: <Newspaper className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'chart', label: 'Graphs & Charts', icon: <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> },
  { id: 'social', label: 'Social Media', icon: <Camera className="w-3.5 h-3.5 text-pink-400" /> },
  { id: 'metric', label: 'Metrics & Goals', icon: <Hash className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'title', label: 'Titles & HUD', icon: <Subtitles className="w-3.5 h-3.5 text-purple-400" /> },
];

const ICONS: Record<string, React.ReactNode> = {
  'bar-chart': <BarChart3 className="w-4 h-4 text-indigo-400" />,
  'line-chart': <TrendingUp className="w-4 h-4 text-sky-400" />,
  'pie-chart-3d': <PieChart className="w-4 h-4 text-purple-400" />,
  'radial-donut': <CircleDot className="w-4 h-4 text-emerald-400" />,
  'horizontal-bar': <SlidersHorizontal className="w-4 h-4 text-indigo-400" />,
  'gauge-meter': <Gauge className="w-4 h-4 text-amber-400" />,
  'metric-counter': <Hash className="w-4 h-4 text-emerald-400" />,
  'goal-progress': <Target className="w-4 h-4 text-cyan-400" />,
  'star-review': <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />,
  'lower-third': <Subtitles className="w-4 h-4 text-violet-400" />,
  'breaking-news': <Newspaper className="w-4 h-4 text-red-500" />,
  'cyberpunk-hud': <Cpu className="w-4 h-4 text-cyan-400" />,
  'social-callout': <Bell className="w-4 h-4 text-amber-400" />,
  'youtube-action': <PlaySquare className="w-4 h-4 text-red-500" />,
  'instagram-pop': <Camera className="w-4 h-4 text-pink-500" />,
  'facebook-reaction': <ThumbsUp className="w-4 h-4 text-blue-500" />,
  'tiktok-pop': <Video className="w-4 h-4 text-teal-400" />,
  'twitter-callout': <MessageSquare className="w-4 h-4 text-sky-400" />,
  // News & Documentary icons
  'breaking-news-bar': <Newspaper className="w-4 h-4 text-red-500" />,
  'news-lower-third': <Subtitles className="w-4 h-4 text-blue-400" />,
  'location-date-slug': <MapPin className="w-4 h-4 text-amber-500" />,
  'headline-card': <FileText className="w-4 h-4 text-red-400" />,
  'quote-graphic': <Quote className="w-4 h-4 text-indigo-400" />,
  'source-citation': <Bookmark className="w-4 h-4 text-sky-400" />,
  'according-to-graphic': <FileQuestion className="w-4 h-4 text-amber-400" />,
  'doc-timeline': <Milestone className="w-4 h-4 text-indigo-400" />,
  'document-highlight': <Highlighter className="w-4 h-4 text-yellow-400" />,
  'newspaper-clipping': <Newspaper className="w-4 h-4 text-amber-200" />,
  'evidence-casefile': <FolderOpen className="w-4 h-4 text-yellow-600" />,
  'photo-collage': <ImageIcon className="w-4 h-4 text-blue-300" />,
  'interview-identifier': <Mic className="w-4 h-4 text-cyan-400" />,
  'chapter-heading': <BookOpen className="w-4 h-4 text-amber-400" />,
  // Branding
  'brand-logo-reveal': <Sparkles className="w-4 h-4 text-indigo-400" />,
  'brand-logo-anim': <Sparkles className="w-4 h-4 text-cyan-400" />,
  'brand-logo-sting': <Flame className="w-4 h-4 text-amber-400" />,
  'brand-intro': <Subtitles className="w-4 h-4 text-indigo-400" />,
  'brand-outro': <Subtitles className="w-4 h-4 text-purple-400" />,
  'brand-watermark': <CircleDot className="w-4 h-4 text-emerald-400" />,
  'brand-lower-third': <Subtitles className="w-4 h-4 text-sky-400" />,
  'brand-colors-transition': <Layers className="w-4 h-4 text-violet-400" />,
  'brand-title-card': <FileText className="w-4 h-4 text-amber-400" />,
  'brand-end-screen': <PlaySquare className="w-4 h-4 text-pink-400" />,
  'brand-cta-url': <Target className="w-4 h-4 text-teal-400" />,
  // Creator / YouTube
  'creator-subscribe-cta': <PlaySquare className="w-4 h-4 text-red-500" />,
  'creator-like-sub': <ThumbsUp className="w-4 h-4 text-red-400" />,
  'creator-comment-cta': <MessageSquare className="w-4 h-4 text-indigo-400" />,
  'creator-video-intro': <Video className="w-4 h-4 text-amber-400" />,
  'creator-chapter-title': <BookOpen className="w-4 h-4 text-sky-400" />,
  'creator-coming-up': <Flame className="w-4 h-4 text-amber-500" />,
  'creator-previously': <Milestone className="w-4 h-4 text-purple-400" />,
  'creator-meanwhile': <CircleDot className="w-4 h-4 text-emerald-400" />,
  'creator-pov': <Camera className="w-4 h-4 text-cyan-400" />,
  'creator-did-you-know': <FileQuestion className="w-4 h-4 text-yellow-400" />,
  'creator-fact-card': <FileText className="w-4 h-4 text-emerald-400" />,
  'creator-top5': <Award className="w-4 h-4 text-amber-400" />,
  'creator-countdown': <Gauge className="w-4 h-4 text-red-500" />,
  'creator-reaction-popup': <Bell className="w-4 h-4 text-pink-400" />,
  'creator-meme-popup': <Sparkles className="w-4 h-4 text-yellow-400" />,
  'creator-end-screen': <PlaySquare className="w-4 h-4 text-indigo-400" />,
  // Commercial
  'comm-product-reveal': <ShoppingBag className="w-4 h-4 text-emerald-400" />,
  'comm-product-showcase': <ShoppingBag className="w-4 h-4 text-indigo-400" />,
  'comm-price-tag': <Tag className="w-4 h-4 text-amber-400" />,
  'comm-discount-badge': <Percent className="w-4 h-4 text-red-500" />,
  'comm-sale-anim': <Flame className="w-4 h-4 text-red-400" />,
  'comm-feature-callout': <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
  'comm-product-comparison': <SlidersHorizontal className="w-4 h-4 text-blue-400" />,
  'comm-product-rotation': <CircleDot className="w-4 h-4 text-purple-400" />,
  'comm-benefits-list': <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  'comm-cta-banner': <Target className="w-4 h-4 text-teal-400" />,
  'comm-app-reveal': <Layers className="w-4 h-4 text-sky-400" />,
  'comm-qr-code': <QrCode className="w-4 h-4 text-emerald-400" />,
  'comm-testimonial-card': <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Category counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: TEMPLATES.length };
    TEMPLATES.forEach((t) => {
      c[t.category] = (c[t.category] || 0) + 1;
    });
    return c;
  }, []);

  // Filtered list
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md flex flex-col">
      {/* Top Bar: Category Section Tabs & Search Filter */}
      <div className="px-6 py-2 border-b border-slate-800/80 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            const count = counts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative w-48 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </div>
      </div>

      {/* Bottom Bar: Horizontal Scrolling Template Pills */}
      <div className="px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        {filteredTemplates.length === 0 ? (
          <div className="text-xs text-slate-500 py-1 italic">
            No templates matching "{searchQuery}" in this section.
          </div>
        ) : (
          filteredTemplates.map((tmpl) => {
            const isSelected = tmpl.id === selectedId;
            return (
              <button
                key={tmpl.id}
                onClick={() => onSelect(tmpl)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 group ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                <span className={isSelected ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}>
                  {ICONS[tmpl.id] || <Layers className="w-4 h-4" />}
                </span>
                <span className="font-semibold">{tmpl.name}</span>
                {tmpl.defaultConfig.enableSFX && (
                  <span className="text-[10px] px-1 py-0.2 bg-pink-500/10 text-pink-400 rounded border border-pink-500/20 font-bold uppercase tracking-wider">
                    SFX
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
