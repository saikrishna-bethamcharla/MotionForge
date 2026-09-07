import type { TemplateConfig, BackgroundMode, RenderContext } from '../types/template';
import { TEMPLATES } from '../templates/registry';

export interface ExportOptions {
  config: TemplateConfig;
  templateId: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  bgMode: BackgroundMode;
  onProgress?: (progress: number, frame: number, totalFrames: number) => void;
}

/**
 * Downloads a Blob as a file in the browser
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Captures a single still snapshot as a transparent or solid PNG
 */
export async function exportPNG(
  templateId: string,
  config: TemplateConfig,
  progress: number,
  width: number,
  height: number,
  bgMode: BackgroundMode
): Promise<void> {
  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error('Template not found');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Failed to get canvas 2d context');

  // Background
  if (bgMode === 'greenscreen') {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(0, 0, width, height);
  } else if (bgMode === 'bluescreen') {
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 0, width, height);
  } else if (bgMode === 'dark') {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
  } else if (bgMode === 'light') {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
  } else {
    // Transparent: clearRect guarantees true alpha 0
    ctx.clearRect(0, 0, width, height);
  }

  const renderContext: RenderContext = {
    ctx,
    width,
    height,
    progress,
    currentTime: progress * config.duration,
    duration: config.duration,
    config,
    bgMode,
  };

  template.render(renderContext);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        triggerDownload(
          blob,
          `${config.name.toLowerCase().replace(/\s+/g, '-')}-frame.png`
        );
      }
      resolve();
    }, 'image/png');
  });
}

/**
 * Frame-by-frame deterministic offline video exporter
 */
export async function exportVideo(options: ExportOptions): Promise<void> {
  const {
    config,
    templateId,
    width,
    height,
    fps = 60,
    duration = 3.5,
    bgMode = 'transparent',
    onProgress,
  } = options;

  const template = TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error('Template not found');

  const totalFrames = Math.max(1, Math.round(duration * fps));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Failed to get canvas 2d context');

  // Select best supported MIME type
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  // Create stream from canvas
  const stream = canvas.captureStream(fps);
  const track = stream.getVideoTracks()[0];

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 25_000_000, // 25 Mbps high quality
  });

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const finalBlob = new Blob(recordedChunks, { type: mimeType });
      resolve(finalBlob);
    };
    recorder.onerror = (e) => reject(e);
  });

  recorder.start();

  const frameIntervalMs = 1000 / fps;

  // Render each frame sequentially
  for (let f = 0; f < totalFrames; f++) {
    const progress = f / (totalFrames - 1 || 1);
    const currentTime = progress * duration;

    // Clear / background fill
    if (bgMode === 'greenscreen') {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === 'bluescreen') {
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === 'dark') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    } else if (bgMode === 'light') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const renderContext: RenderContext = {
      ctx,
      width,
      height,
      progress,
      currentTime,
      duration,
      config,
      bgMode,
    };

    template.render(renderContext);

    // If canvas stream track supports requestFrame, invoke it
    if (track && 'requestFrame' in track) {
      (track as any).requestFrame();
    }

    if (onProgress) {
      onProgress(progress, f + 1, totalFrames);
    }

    // Small delay between frames for MediaRecorder buffer ingestion
    await new Promise((resolve) => setTimeout(resolve, Math.max(8, frameIntervalMs / 2)));
  }

  // Finalize
  await new Promise((resolve) => setTimeout(resolve, 200));
  recorder.stop();

  const videoBlob = await recordingPromise;
  const extension = 'webm';
  const suffix = bgMode === 'transparent' ? 'alpha' : bgMode;
  const filename = `${config.name.toLowerCase().replace(/\s+/g, '-')}-${suffix}.${extension}`;

  triggerDownload(videoBlob, filename);
}
