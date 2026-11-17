// OpusCard: dashboard isométrico cinematográfico, dirigido por JSON.
// Cámara (zoom, punch, shake) + tipografía cinética + escena isométrica.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { INTENSIDAD, pulse, SPRINGS } from "../../motion/springs";
import type { EscenaData, VisualData } from "../../schema";
import { IsometricDashboard } from "../../scenes/IsometricDashboard";
import { KineticTypography } from "../cinematic/KineticTypography";
import type { SkillProps } from "./types";

const ESCALA_PLANO: Record<VisualData["shot_type"], number> = {
  wide: 0.82,
  medium: 0.92,
  close_up: 1.22,
  cinematic: 0.92,
};

/** Escena neutra para el modo Fase 3 (sin JSON): sin eventos ni CTA. */
const escenaPorDefecto = (titulo: string): EscenaData => ({
  visual: {
    shot_type: "medium",
    camera_zoom_speed: 0.06,
    motion_intensity: "medium",
    pattern_interrupt_events: [],
    visual_change_interval: 60,
    cta_trigger_time: Number.MAX_SAFE_INTEGER,
  },
  audio: { sfx_events: [], music_mood: "calm" },
  contenido: {
    hook: titulo,
    kpis: [
      { label: "Retención", valor: 87, sufijo: "%" },
      { label: "CTR", valor: 12, sufijo: "%" },
      { label: "Alcance", valor: 64, sufijo: "%" },
    ],
    serie: [0.42, 0.68, 0.55, 0.88, 0.74, 0.96],
  },
});

export const OpusCard: React.FC<SkillProps> = ({ theme, titulo, escena }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const e = escena ?? escenaPorDefecto(titulo);
  const { visual, audio } = e;
  const amp = INTENSIDAD[visual.motion_intensity];

  // Cámara: dolly-in de todo el clip (resorte pesado estirado a la duración).
  const dolly = spring({ frame, fps, config: SPRINGS.heavy, durationInFrames });
  const punch = pulse(frame, fps, visual.pattern_interrupt_events, 5);
  const impactos = audio.sfx_events.filter((s) => s.type === "impact").map((s) => s.frame);
  const shake = pulse(frame, fps, impactos, 2);
  const clicks = audio.sfx_events.filter((s) => s.type === "ui_click").map((s) => s.frame);

  // Al entrar el CTA, el dashboard retrocede y sube para dejar espacio.
  const retirada = spring({ frame: frame - visual.cta_trigger_time, fps, config: SPRINGS.heavy });

  const escala =
    ESCALA_PLANO[visual.shot_type] * (1 + visual.camera_zoom_speed * dolly) * (1 + 0.035 * amp * punch) *
    interpolate(retirada, [0, 1], [1, 0.74]);
  const y = interpolate(retirada, [0, 1], [0, -330]) - 9 * amp * shake;
  const x = 5 * amp * shake;

  return (
    <>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${escala})` }}>
        <IsometricDashboard theme={theme} visual={visual} contenido={e.contenido} clicks={clicks} />
      </AbsoluteFill>
      <KineticTypography
        theme={theme}
        texto={e.contenido.hook}
        inicio={4}
        salida={visual.cta_trigger_time - 6}
        top={190}
      />
    </>
  );
};
