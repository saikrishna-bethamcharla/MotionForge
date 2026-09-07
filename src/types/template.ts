export type TemplateCategory = 'chart' | 'metric' | 'title' | 'social';

export type BackgroundMode = 'transparent' | 'greenscreen' | 'bluescreen' | 'dark' | 'light';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface Resolution {
  width: number;
  height: number;
  label: string;
}

export const RESOLUTIONS: Record<AspectRatio, Resolution> = {
  '16:9': { width: 1920, height: 1080, label: '1080p Landscape (16:9)' },
  '9:16': { width: 1080, height: 1920, label: '1080p Vertical (9:16)' },
  '1:1': { width: 1080, height: 1080, label: 'Square (1:1)' },
};

export interface ChartDataItem {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  duration: number; // in seconds
  fps: number;
  
  // Customization fields
  title: string;
  subtitle: string;
  badgeText?: string;
  
  // Palette
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  cardColor: string;

  // Template specific data
  chartData?: ChartDataItem[];
  metricStart?: number;
  metricEnd?: number;
  prefix?: string;
  suffix?: string;
  
  // Social specific
  handle?: string;
  subscriberCount?: string;
  avatarText?: string;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  progress: number; // 0.0 to 1.0
  currentTime: number; // in seconds
  duration: number; // in seconds
  config: TemplateConfig;
  bgMode: BackgroundMode;
}
