import { useState } from 'react';
import type { BackgroundMode, Resolution, TemplateConfig } from '../types/template';
import { Download, CheckCircle2, Film, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TemplateConfig;
  resolution: Resolution;
  bgMode: BackgroundMode;
  onStartExport: (targetBg: BackgroundMode) => Promise<void>;
  isExporting: boolean;
  progress: number;
  currentFrame: number;
  totalFrames: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
  resolution,
  bgMode,
  onStartExport,
  isExporting,
  progress,
  currentFrame,
  totalFrames,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'transparent' | 'greenscreen'>(
    bgMode === 'greenscreen' ? 'greenscreen' : 'transparent'
  );
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsCompleted(false);
    await onStartExport(selectedFormat);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Export Motion Graphic</h3>
              <p className="text-xs text-slate-400">High-FPS video for your editing timeline</p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Output Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Alpha Transparent */}
              <button
                type="button"
                onClick={() => setSelectedFormat('transparent')}
                disabled={isExporting}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  selectedFormat === 'transparent'
                    ? 'border-indigo-500 bg-indigo-600/10 shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-5 h-5 rounded-full border border-slate-400 bg-checkerboard" />
                  {selectedFormat === 'transparent' && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <div className="font-bold text-sm text-white">Transparent WebM</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight">
                  Alpha channel native. Ideal for DaVinci Resolve, Premiere Pro & Final Cut.
                </div>
              </button>

              {/* Option 2: Green Screen */}
              <button
                type="button"
                onClick={() => setSelectedFormat('greenscreen')}
                disabled={isExporting}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  selectedFormat === 'greenscreen'
                    ? 'border-emerald-500 bg-emerald-600/10 shadow-sm'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-green-500 shadow-sm" />
                  {selectedFormat === 'greenscreen' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="font-bold text-sm text-white">Green Screen (Chroma)</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-tight">
                  Pure #00FF00 background. 100% compatible with CapCut, InShot, phone editors.
                </div>
              </button>
            </div>
          </div>

          {/* Specs Box */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Resolution</span>
              <span className="font-mono font-medium">{resolution.width} x {resolution.height}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Duration</span>
              <span className="font-mono font-medium">{config.duration.toFixed(1)} seconds</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Target Framerate</span>
              <span className="font-mono font-medium">{config.fps} FPS</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Total Frames</span>
              <span className="font-mono font-medium">{Math.round(config.duration * config.fps)} frames</span>
            </div>
          </div>

          {/* Progress Bar (Visible while exporting) */}
          {isExporting && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Rendering frame {currentFrame} / {totalFrames}
                </span>
                <span className="text-indigo-400 font-bold font-mono">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-100 ease-out"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center animate-pulse">
                Encoding every frame deterministically directly in your browser GPU...
              </p>
            </div>
          )}

          {/* Success Message */}
          {isCompleted && !isExporting && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Video successfully rendered and downloaded to your computer!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50"
          >
            {isCompleted ? 'Close' : 'Cancel'}
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Rendering Video...' : 'Start Render & Download'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
