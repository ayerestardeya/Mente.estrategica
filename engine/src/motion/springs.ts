// Sistema de movimiento: SOLO físicas de resorte, frame-based y deterministas.
// Prohibido: interpolación lineal de tiempo, requestAnimationFrame, setInterval.
import { spring, type SpringConfig } from "remotion";

/** Presets físicos del blueprint de Dirección de Arte (§2.2). */
export const SPRINGS = {
  soft: { damping: 24, stiffness: 120, mass: 1 },
  standard: { damping: 18, stiffness: 170, mass: 0.8 },
  heavy: { damping: 27, stiffness: 100, mass: 2.2 },
  elastic: { damping: 10, stiffness: 180, mass: 0.7 },
} as const satisfies Record<string, Partial<SpringConfig>>;

/** Resorte obligatorio de los módulos CTA (decisión Fase 4). */
export const CTA_SPRING = { damping: 12 } as const satisfies Partial<SpringConfig>;

/** Ataque rápido para pulsos de evento (glow, borde, punch). */
const ATAQUE: Partial<SpringConfig> = { damping: 14, stiffness: 260, mass: 0.6 };

/**
 * Pulso por eventos: sube con un resorte rápido en cada frame de `eventos`,
 * se mantiene `hold` frames y cae con un resorte suave. Devuelve 0..~1.
 */
export function pulse(frame: number, fps: number, eventos: readonly number[], hold: number): number {
  let max = 0;
  for (const e of eventos) {
    if (frame < e) continue;
    const sube = spring({ frame: frame - e, fps, config: ATAQUE });
    const baja = spring({ frame: frame - e - hold, fps, config: SPRINGS.soft });
    max = Math.max(max, sube - baja);
  }
  return Math.max(0, max);
}

/** Multiplicador de amplitud según `motion_intensity`. */
export const INTENSIDAD = { low: 0.5, medium: 1, high: 1.5, aggressive: 2 } as const;
