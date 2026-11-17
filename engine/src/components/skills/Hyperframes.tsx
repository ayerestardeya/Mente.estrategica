// Hyperframes: barrera de texto 3D + revelación wireframe + glitch por eventos.
// El glitch es CSS estándar sobre el lienzo 3D y el texto HTML, solo en los
// pattern_interrupt_events (2–5 frames), con los colores de glitch de la ficha.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Z } from "../cinematic/layers";
import { glitchAt } from "../../effects/glitch";
import { GlitchText } from "../../effects/GlitchText";
import { SPRINGS } from "../../motion/springs";
import { TextBarrier3D } from "../../scenes/TextBarrier3D";
import { fontFamily, textColor } from "../../utils/themeProvider";
import type { SkillProps } from "./types";

/** Modo sin JSON (Fase 3): eventos de demostración neutros. */
const INTERRUPTS_DEMO = [45, 105] as const;

export const Hyperframes: React.FC<SkillProps> = ({ theme, titulo, escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const interrupts = escena?.visual.pattern_interrupt_events ?? INTERRUPTS_DEMO;
  const texto3d = escena?.contenido.hook ?? titulo;
  const ctaInicio = escena?.visual.cta_trigger_time ?? Number.MAX_SAFE_INTEGER;

  // Colores de glitch: SOLO de la ficha; si la marca no los tiene, no hay glitch.
  const g = theme.glitch ? glitchAt(frame, interrupts) : null;
  const rojo = theme.glitch?.rojo ?? theme.acento;
  const cyan = theme.glitch?.cyan ?? theme.acento;

  // Al entrar el CTA, la escena 3D sube y se reduce para dejarle sitio.
  const retirada = spring({ frame: frame - ctaInicio, fps, config: SPRINGS.heavy });
  const entradaHud = Math.min(1, spring({ frame: frame - 18, fps, config: SPRINGS.soft }));

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: theme.fondo }}>
        <AbsoluteFill
          style={{
            transform: `translateY(${interpolate(retirada, [0, 1], [0, -420])}px) scale(${interpolate(retirada, [0, 1], [1, 0.72])})${g ? ` translateX(${g.dx}px)` : ""}`,
            clipPath: g ? `inset(${g.clip.top}% 0 ${g.clip.bottom}% 0)` : undefined,
            filter: g
              ? `drop-shadow(${-g.rgb}px 0 0 ${rojo}) drop-shadow(${g.rgb}px 0 0 ${cyan}) blur(${g.blur.toFixed(2)}px)`
              : undefined,
          }}
        >
          <TextBarrier3D theme={theme} texto={texto3d} interrupts={interrupts} />
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          zIndex: Z.hud,
          alignItems: "center",
          paddingTop: 170,
          fontFamily: fontFamily(theme),
          color: textColor(theme),
          opacity: entradaHud * (1 - retirada),
        }}
      >
        <GlitchText
          texto={theme.nombre.toUpperCase()}
          g={g}
          rojo={rojo}
          cyan={cyan}
          style={{ fontSize: 44, fontWeight: theme.fontWeight, letterSpacing: "0.32em" }}
        />
      </AbsoluteFill>
    </>
  );
};
