import type { AspectRatio, BackgroundMode } from '../types/template';
import { Download, Camera, Sparkles, Monitor, Smartphone, Square } from 'lucide-react';

interface HeaderProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  bgMode: BackgroundMode;
  onBgModeChange: (mode: BackgroundMode) => void;
  onExportClick: () => void;
  onSnapshotClick: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  aspectRatio,
  onAspectRatioChange,
  bgMode,
  onBgModeChange,
  onExportClick,
  onSnapshotClick,
  isExporting,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              MotionForge
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Alpha Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">Motion Graphics & Transparent Video Studio</p>
        </div>
      </div>

      {/* Center Controls: Aspect Ratio & Background */}
      <div className="flex items-center gap-3">
        {/* Aspect Ratio Selector */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onAspectRatioChange('16:9')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
              aspectRatio === '16:9'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Landscape 16:9 (YouTube & Desktop)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>
          <button
            onClick={() => onAspectRatioChange('9:16')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
              aspectRatio === '9:16'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vertical 9:16 (Shorts, Reels, TikTok)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16</span>
          </button>
          <button
            onClick={() => onAspectRatioChange('1:1')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
              aspectRatio === '1:1'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Square 1:1 (Instagram / LinkedIn)"
          >
            <Square className="w-3.5 h-3.5" />
            <span>1:1</span>
          </button>
        </div>

        {/* Background Mode Toggle */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => onBgModeChange('transparent')}
            className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
              bgMode === 'transparent'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-checkerboard inline-block" />
            <span>Transparent (Alpha)</span>
          </button>
          <button
            onClick={() => onBgModeChange('greenscreen')}
            className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
              bgMode === 'greenscreen'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Green Screen (for CapCut & Mobile)"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <span>Green Screen</span>
          </button>
          <button
            onClick={() => onBgModeChange('dark')}
            className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
              bgMode === 'dark'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600 inline-block" />
            <span>Solid Dark</span>
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onSnapshotClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
          title="Download single high-res PNG image"
        >
          <Camera className="w-4 h-4" />
          <span>Snapshot PNG</span>
        </button>

        <button
          onClick={onExportClick}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Encoding...' : 'Export Video'}</span>
        </button>
      </div>
    </header>
  );
};
