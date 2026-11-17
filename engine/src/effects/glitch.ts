// Glitch de interrupción (blueprint §2.3): solo en pattern_interrupt_events,
// nunca permanente. Determinista: `random(seed)` de Remotion, no Math.random().
import { random } from "remotion";

export interface GlitchFrame {
  /** Semilla estable del frame (para derivar más valores). */
  seed: string;
  /** Desfase RGB 3–5 px. */
  rgb: number;
  /** Desplazamiento horizontal ±4–12 px. */
  dx: number;
  /** Desenfoque 0–3 px. */
  blur: number;
  /** Rebanadas 2–5: cada una con su banda vertical [top%, bottom%] y su desfase. */
  slices: { top: number; bottom: number; dx: number }[];
  /** Recorte global del bloque: inset(top% 0 bottom% 0). */
  clip: { top: number; bottom: number };
}

/** Duración de cada evento: 2–5 frames, estable por evento. */
const duracion = (e: number) => 2 + Math.floor(random(`glitch-dur-${e}`) * 4);

export function glitchAt(frame: number, eventos: readonly number[]): GlitchFrame | null {
  const e = eventos.find((ev) => frame >= ev && frame < ev + duracion(ev));
  if (e === undefined) return null;
  const seed = `glitch-${e}-${frame}`;
  const r = (k: string) => random(`${seed}-${k}`);
  const signo = r("s") > 0.5 ? 1 : -1;
  const n = 2 + Math.floor(r("n") * 4);
  const slices = Array.from({ length: n }, (_, i) => {
    const top = Math.floor(r(`t${i}`) * 80);
    const alto = 6 + Math.floor(r(`h${i}`) * 18);
    return { top, bottom: Math.max(0, 100 - top - alto), dx: (r(`x${i}`) > 0.5 ? 1 : -1) * (4 + r(`d${i}`) * 8) };
  });
  return {
    seed,
    rgb: 3 + r("rgb") * 2,
    dx: signo * (4 + r("dx") * 8),
    blur: r("b") * 3,
    slices,
    clip: { top: Math.floor(r("ct") * 18), bottom: Math.floor(r("cb") * 18) },
  };
}
