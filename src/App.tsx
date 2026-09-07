import { useState, useEffect, useRef } from 'react';
import { TEMPLATES } from './templates/registry';
import { RESOLUTIONS } from './types/template';
import type { AspectRatio, BackgroundMode, TemplateConfig } from './types/template';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { CanvasPreview } from './components/CanvasPreview';
import { Inspector } from './components/Inspector';
import { ExportModal } from './components/ExportModal';
import { exportPNG, exportVideo } from './engine/exporter';

export function App() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('bar-chart');
  
  // Store customized configs per template
  const [configs, setConfigs] = useState<Record<string, TemplateConfig>>(() => {
    const initial: Record<string, TemplateConfig> = {};
    TEMPLATES.forEach((t) => {
      initial[t.id] = { ...t.defaultConfig };
    });
    return initial;
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [bgMode, setBgMode] = useState<BackgroundMode>('transparent');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Export states
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportFrame, setExportFrame] = useState<number>(0);
  const [exportTotalFrames, setExportTotalFrames] = useState<number>(0);

  const activeConfig = configs[selectedTemplateId] || TEMPLATES[0].defaultConfig;
  const resolution = RESOLUTIONS[aspectRatio];

  const lastTimeRef = useRef<number | null>(null);

  // Playback Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const tick = (now: number) => {
      if (lastTimeRef.current !== null && isPlaying) {
        const delta = (now - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          let next = prev + delta;
          if (next >= activeConfig.duration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return activeConfig.duration;
            }
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
    };
  }, [isPlaying, isLooping, activeConfig.duration]);

  // Update configuration
  const handleConfigChange = (updated: Partial<TemplateConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedTemplateId]: {
        ...prev[selectedTemplateId],
        ...updated,
      },
    }));
  };

  // Step 1 frame forward or backward
  const handleStepFrame = (direction: number) => {
    setIsPlaying(false);
    const frameDuration = 1 / (activeConfig.fps || 60);
    setCurrentTime((prev) => {
      const next = prev + direction * frameDuration;
      return Math.max(0, Math.min(activeConfig.duration, next));
    });
  };

  // Instant PNG Snapshot
  const handleSnapshot = async () => {
    const progress = currentTime / (activeConfig.duration || 1);
    await exportPNG(
      selectedTemplateId,
      activeConfig,
      progress,
      resolution.width,
      resolution.height,
      bgMode
    );
  };

  // Full Video Export
  const handleStartExport = async (targetBg: BackgroundMode) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportFrame(0);
    setExportTotalFrames(Math.round(activeConfig.duration * activeConfig.fps));

    // Temporarily pause interactive playback
    setIsPlaying(false);

    try {
      await exportVideo({
        config: activeConfig,
        templateId: selectedTemplateId,
        width: resolution.width,
        height: resolution.height,
        fps: activeConfig.fps,
        duration: activeConfig.duration,
        bgMode: targetBg,
        onProgress: (p, frame, total) => {
          setExportProgress(p);
          setExportFrame(frame);
          setExportTotalFrames(total);
        },
      });
    } catch (err) {
      console.error('Export failed:', err);
      alert('Video export failed. Please check browser console or permissions.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top Header */}
      <Header
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        bgMode={bgMode}
        onBgModeChange={setBgMode}
        onExportClick={() => setIsExportModalOpen(true)}
        onSnapshotClick={handleSnapshot}
        isExporting={isExporting}
      />

      {/* Template Selector Bar */}
      <TemplateSelector
        selectedId={selectedTemplateId}
        onSelect={(t) => {
          setSelectedTemplateId(t.id);
          setCurrentTime(0);
        }}
      />

      {/* Main Workspace: Canvas Preview + Customization Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <CanvasPreview
          templateId={selectedTemplateId}
          config={activeConfig}
          aspectRatio={aspectRatio}
          bgMode={bgMode}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isLooping={isLooping}
          onTimeChange={setCurrentTime}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onToggleLoop={() => setIsLooping(!isLooping)}
          onReset={() => setCurrentTime(0)}
          onStepFrame={handleStepFrame}
        />

        <Inspector config={activeConfig} onChange={handleConfigChange} />
      </div>

      {/* Video Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        config={activeConfig}
        resolution={resolution}
        bgMode={bgMode}
        onStartExport={handleStartExport}
        isExporting={isExporting}
        progress={exportProgress}
        currentFrame={exportFrame}
        totalFrames={exportTotalFrames}
      />
    </div>
  );
}

export default App;
