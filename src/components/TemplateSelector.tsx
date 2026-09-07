import { TEMPLATES } from '../templates/registry';
import type { TemplateDefinition } from '../templates/registry';
import { BarChart3, TrendingUp, PieChart, CircleDot, Hash, Subtitles, Bell, PlaySquare, Camera, ThumbsUp, Layers } from 'lucide-react';

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (template: TemplateDefinition) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  'bar-chart': <BarChart3 className="w-4 h-4" />,
  'line-chart': <TrendingUp className="w-4 h-4" />,
  'pie-chart-3d': <PieChart className="w-4 h-4" />,
  'radial-donut': <CircleDot className="w-4 h-4" />,
  'metric-counter': <Hash className="w-4 h-4" />,
  'lower-third': <Subtitles className="w-4 h-4" />,
  'social-callout': <Bell className="w-4 h-4" />,
  'youtube-action': <PlaySquare className="w-4 h-4 text-red-500" />,
  'instagram-pop': <Camera className="w-4 h-4 text-pink-500" />,
  'facebook-reaction': <ThumbsUp className="w-4 h-4 text-blue-500" />,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider pr-2 border-r border-slate-800 shrink-0">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Templates</span>
      </div>

      <div className="flex items-center gap-2">
        {TEMPLATES.map((tmpl) => {
          const isSelected = tmpl.id === selectedId;
          return (
            <button
              key={tmpl.id}
              onClick={() => onSelect(tmpl)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                isSelected
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                {ICONS[tmpl.id] || <Layers className="w-4 h-4" />}
              </span>
              <span>{tmpl.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
