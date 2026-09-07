import { useRef, useEffect } from 'react';
import { RESOLUTIONS } from '../types/template';
import type { BackgroundMode, RenderContext, TemplateConfig, AspectRatio } from '../types/template';
import { TEMPLATES } from '../templates/registry';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';

interface CanvasPreviewProps {
  templateId: string;
  config: TemplateConfig;
  aspectRatio: AspectRatio;
  bgMode: BackgroundMode;
  currentTime: number;
  isPlaying: boolean;
  isLooping: boolean;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
  onReset: () => void;
  onStepFrame: (direction: number) => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  templateId,
  config,
  aspectRatio,
  bgMode,
  currentTime,
  isPlaying,
  isLooping,
  onTimeChange,
  onTogglePlay,
  onToggleLoop,
  onReset,
  onStepFrame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const res = RESOLUTIONS[aspectRatio];
  const progress = Math.min(1, Math.max(0, currentTime / (config.duration || 1)));

  // Render canvas on state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (bgMode === 'greenscreen') {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, res.width, res.height);
    } else if (bgMode === 'bluescreen') {
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, res.width, res.height);
    } else if (bgMode === 'dark') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, res.width, res.height);
    } else if (bgMode === 'light') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, res.width, res.height);
    } else {
      ctx.clearRect(0, 0, res.width, res.height);
    }

    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      const renderContext: RenderContext = {
        ctx,
        width: res.width,
        height: res.height,
        progress,
        currentTime,
        duration: config.duration,
        config,
        bgMode,
      };
      template.render(renderContext);
    }
  }, [templateId, config, res, bgMode, progress, currentTime]);

  // Format time display: mm:ss.s
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/60 overflow-hidden relative">
      {/* Viewport Area */}
      <div
        ref={containerRef}
        className={`flex-1 flex items-center justify-center p-6 relative overflow-hidden ${
          bgMode === 'transparent'
            ? 'bg-checkerboard'
            : bgMode === 'greenscreen'
            ? 'bg-[#00FF00]'
            : bgMode === 'bluescreen'
            ? 'bg-[#0000FF]'
            : 'bg-slate-950'
        }`}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-slate-700/50"
          style={{
            aspectRatio: `${res.width} / ${res.height}`,
            maxHeight: 'calc(100% - 20px)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={res.width}
            height={res.height}
            className="w-full h-full object-contain block"
          />
        </div>
      </div>

      {/* Playback & Timeline Bar */}
      <div className="h-20 border-t border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex flex-col justify-center gap-2">
        {/* Scrubber Progress Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-14 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={config.duration}
              step={0.01}
              value={currentTime}
              onChange={(e) => onTimeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 group-hover:h-2 transition-all"
            />
          </div>

          <span className="text-xs font-mono text-slate-400 w-14">
            {formatTime(config.duration)}
          </span>
        </div>

        {/* Transport Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
              title="Reset to 0s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStepFrame(-1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
              title="Step 1 Frame Back"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>
            <button
              onClick={() => onStepFrame(1)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
              title="Step 1 Frame Forward"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLoop}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition ${
                isLooping
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Loop</span>
            </button>
            <div className="text-xs text-slate-500 font-mono">
              {(progress * 100).toFixed(0)}% • {res.width}x{res.height} @ {config.fps}fps
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
