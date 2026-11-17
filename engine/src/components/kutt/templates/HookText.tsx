// Plantilla KUTT: texto cinético rápido e impactante (palabra a palabra).
// Cada palabra entra con spring (escala + desplazamiento + opacidad).
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { KUTT, SAFE_ZONE } from "../theme";

export type HookTextProps = {
  /** Texto completo. Un salto de línea "\n" fuerza nueva línea. */
  text: string;
  /** Palabras (sin puntuación, sin distinguir mayúsculas) pintadas con el acento. */
  accentWords?: string[];
  fontSize?: number;
  /** Frames entre palabra y palabra. */
  stagger?: number;
  /** Frame local en que empieza la animación. */
  delay?: number;
  align?: "left" | "center";
};

const limpiar = (w: string) => w.toLowerCase().replace(/[¿?¡!.,;:]/g, "");

export const HookText: React.FC<HookTextProps> = ({
  text,
  accentWords = [],
  fontSize = 120,
  stagger = 3,
  delay = 0,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const acentos = new Set(accentWords.map(limpiar));
  let indice = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: KUTT.colores.fondo,
        justifyContent: "center",
        paddingTop: SAFE_ZONE.top,
        paddingBottom: SAFE_ZONE.bottom,
        paddingLeft: SAFE_ZONE.left,
        paddingRight: SAFE_ZONE.right - 40,
      }}
    >
      <div
        style={{
          fontFamily: KUTT.tipografia.titulos,
          fontWeight: KUTT.tipografia.pesoTitulos,
          fontSize,
          lineHeight: 1.04,
          letterSpacing: -fontSize * 0.02,
          color: KUTT.colores.texto,
          textAlign: align,
          display: "flex",
          flexDirection: "column",
          gap: fontSize * 0.12,
        }}
      >
        {text.split("\n").map((linea, li) => (
          <div
            key={li}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: align === "center" ? "center" : "flex-start",
              columnGap: fontSize * 0.26,
            }}
          >
            {linea.split(" ").filter(Boolean).map((palabra, wi) => {
              const p = spring({
                frame: frame - delay - indice++ * stagger,
                fps,
                config: { damping: 14, stiffness: 260, mass: 0.55 },
              });
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, p * 1.4),
                    transform: `translateY(${(1 - p) * fontSize * 0.6}px) scale(${0.7 + 0.3 * p})`,
                    color: acentos.has(limpiar(palabra)) ? KUTT.colores.acento : undefined,
                  }}
                >
                  {palabra}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
