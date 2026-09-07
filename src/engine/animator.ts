/**
 * Animation easing and math utilities for frame-based rendering
 */

export const Easing = {
  linear: (t: number) => t,
  
  easeOutQuad: (t: number) => t * (2 - t),
  
  easeInQuad: (t: number) => t * t,
  
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  
  easeOutCubic: (t: number) => --t * t * t + 1,
  
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  
  easeOutBack: (t: number, overshoot = 1.70158) => {
    const c1 = overshoot;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Calculates a normalized progress value (0 to 1) for a specific time window
 * with optional easing.
 */
export function windowProgress(
  globalProgress: number,
  start: number,
  end: number,
  easingFn: (t: number) => number = Easing.easeOutCubic
): number {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  const local = (globalProgress - start) / (end - start);
  return easingFn(clamp(local));
}

/**
 * Draws rounded rectangle on a 2D canvas context
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
) {
  if (width < 0) {
    x += width;
    width = Math.abs(width);
  }
  if (height < 0) {
    y += height;
    height = Math.abs(height);
  }
  
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  // Fallback if roundRect is not supported
  ctx.beginPath();
  ctx.rect(x, y, width, height);
}
