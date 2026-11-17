// Tipografía cinética (blueprint §2.1): entrada palabra a palabra con resorte.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRINGS } from "../../motion/springs";
import { fontFamily, textColor, type BrandTheme } from "../../utils/themeProvider";
import { Z } from "./layers";

interface Props {
  theme: BrandTheme;
  texto: string;
  /** Frame de entrada de la primera palabra. */
  inicio: number;
  /** Frame de salida (opcional): el bloque se retira con resorte suave. */
  salida?: number;
  top: number;
  fontSize?: number;
}

const DELAY_PALABRA = 4;
const ROTACION_MAX = 1.5;

export const KineticTypography: React.FC<Props> = ({ theme, texto, inicio, salida, top, fontSize = 92 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = theme.cinematic?.springTexto ?? SPRINGS.standard;
  const palabras = texto.split(/\s+/).filter(Boolean);
  const fuera = salida === undefined ? 0 : spring({ frame: frame - salida, fps, config: SPRINGS.soft });

  return (
    <AbsoluteFill style={{ zIndex: Z.hud, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: 80,
          right: 80,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.28em",
          rowGap: 4,
          fontFamily: fontFamily(theme),
          fontWeight: theme.fontWeight,
          fontSize,
          lineHeight: 1.04,
          color: textColor(theme),
          opacity: 1 - fuera,
          transform: `translateY(${interpolate(fuera, [0, 1], [0, -60])}px)`,
        }}
      >
        {palabras.map((palabra, i) => {
          const progress = spring({ frame: frame - inicio - i * DELAY_PALABRA, fps, config });
          const signo = i % 2 === 0 ? 1 : -1;
          return (
            <span
              key={`${palabra}-${i}`}
              style={{
                display: "inline-block",
                opacity: interpolate(progress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(progress, [0, 1], [45, 0])}px) scale(${interpolate(progress, [0, 1], [0.92, 1])}) rotate(${interpolate(progress, [0, 1], [signo * ROTACION_MAX, 0])}deg)`,
                filter: `blur(${interpolate(progress, [0, 1], [6, 0], { extrapolateRight: "clamp" })}px)`,
                letterSpacing: `${interpolate(progress, [0, 1], [0.04, -0.01])}em`,
              }}
            >
              {palabra}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
