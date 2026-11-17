// Resorte obligatorio de los módulos CTA: spring({ fps: 30, frame, config: { damping: 12 } }).
import { spring, useCurrentFrame } from "remotion";
import { FPS } from "../../constants";
import { CTA_SPRING } from "../../motion/springs";

export function useCtaSpring(inicio: number): number {
  const frame = useCurrentFrame();
  return spring({ fps: FPS, frame: frame - inicio, config: CTA_SPRING });
}
