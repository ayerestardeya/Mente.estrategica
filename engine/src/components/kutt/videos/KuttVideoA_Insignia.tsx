// KUTT · Video A: Insignia — 30 fps, 1080x1920, 900 frames (30 s).
// Identidad: vault/04-MARCAS/kutt.md (tokens en ../theme.ts).
import { z } from "zod";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EndCard } from "../EndCard";
import { loadKuttFonts } from "../fonts";
import { Scene } from "../Scene";
import { Subtitles } from "../Subtitles";
import { alpha, KUTT, SAFE_ZONE } from "../theme";
import { HookText } from "../templates/HookText";
import { ScreenDemo } from "../templates/ScreenDemo";

loadKuttFonts();

export const KUTT_VIDEO_A = {
  // Remotion solo admite a-z, 0-9 y "-" en ids: "_" no es válido.
  id: "KuttVideoA-Insignia",
  fps: 30,
  width: 1080,
  height: 1920,
  durationInFrames: 900,
} as const;

// Línea de tiempo (frames absolutos @30 fps).
const T = {
  hook: [0, 60], //        0–2 s
  chips: [60, 270], //     2–9 s
  cuaderno: [270, 420], // 9–14 s
  demo: [420, 720], //     14–24 s
  end: [720, 900], //      24–30 s
} as const;
const XF = 12; // frames de fundido cruzado entre escenas
const ZOOM_IN_GLOBAL = 450; // zoom in suave del ScreenDemo

export const kuttVideoASchema = z.object({
  marca: z.literal("kutt"),
  /** Subtítulos opcionales (frames absolutos). Vacío hasta tener guion de voz. */
  subtitulos: z.array(z.object({ text: z.string(), from: z.number(), to: z.number() })),
});
export type KuttVideoAProps = z.infer<typeof kuttVideoASchema>;

const CHIPS = ["Arriendo de sillón", "Comisión", "Sueldo fijo"] as const;

const ChipsModelosPago: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: KUTT.colores.fondo,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE_ZONE.left,
        paddingRight: SAFE_ZONE.right - 40,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 48, width: "100%" }}>
        {CHIPS.map((chip, i) => {
          const p = spring({ frame: frame - (10 + i * 42), fps, config: { damping: 15, stiffness: 170, mass: 0.7 } });
          const lado = i % 2 === 0 ? -1 : 1;
          return (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                padding: "44px 52px",
                borderRadius: 36,
                backgroundColor: alpha(KUTT.colores.texto, 0.05),
                border: `3px solid ${alpha(KUTT.colores.acento, 0.25 + 0.55 * p)}`,
                opacity: p,
                transform: `translateX(${(1 - p) * 220 * lado}px) scale(${0.85 + 0.15 * p}) rotate(${(1 - p) * 4 * lado}deg)`,
              }}
            >
              <span
                style={{
                  fontFamily: KUTT.tipografia.cuerpo,
                  fontWeight: 700,
                  fontSize: 44,
                  color: KUTT.colores.acento,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: KUTT.tipografia.titulos,
                  fontWeight: KUTT.tipografia.pesoTitulos,
                  fontSize: 80,
                  lineHeight: 1.05,
                  color: KUTT.colores.texto,
                }}
              >
                {chip}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Placeholder gris temporal para la futura captura de pantalla real. */
const PlaceholderCaptura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: KUTT.colores.placeholder, alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontFamily: KUTT.tipografia.cuerpo, fontWeight: 500, fontSize: 30, color: alpha("#FFFFFF", 0.45) }}>
      captura UI · placeholder
    </span>
  </AbsoluteFill>
);

const escena = (i: number, [ini, fin]: readonly [number, number], ultima = false) => ({
  from: ini,
  durationInFrames: fin - ini + (ultima ? 0 : XF),
  fadeIn: i === 0 ? 0 : XF,
  fadeOut: ultima ? 0 : XF,
});

export const KuttVideoA_Insignia: React.FC<KuttVideoAProps> = ({ subtitulos }) => {
  const zoomLocal = ZOOM_IN_GLOBAL - T.demo[0]; // = 30
  return (
    <AbsoluteFill style={{ backgroundColor: KUTT.colores.fondo }}>
      <Scene name="Gancho" {...escena(0, T.hook)}>
        <HookText text={"¿Todos tus barberos\ncobran igual?"} accentWords={["igual"]} fontSize={124} stagger={3} />
      </Scene>

      <Scene name="Chips modelos de pago" {...escena(1, T.chips)}>
        <ChipsModelosPago />
      </Scene>

      <Scene name="Cuaderno" {...escena(2, T.cuaderno)}>
        <HookText
          text={"Y todo en un cuaderno.\nCada fin de mes,\na cuadrar."}
          accentWords={["cuadrar"]}
          fontSize={104}
          stagger={4}
          delay={4}
        />
      </Scene>

      <Scene name="ScreenDemo" {...escena(3, T.demo)}>
        <ScreenDemo
          zoom={[
            { frame: 0, scale: 1, focusX: 50, focusY: 50 },
            { frame: zoomLocal, scale: 1, focusX: 50, focusY: 50 },
            { frame: zoomLocal + 45, scale: 1.5, focusX: 50, focusY: 38 },
            { frame: 250, scale: 1.5, focusX: 50, focusY: 38 },
            { frame: 290, scale: 1.1, focusX: 50, focusY: 50 },
          ]}
          highlights={[{ x: 8, y: 30, width: 84, height: 16, from: 100, to: 230 }]}
        >
          <PlaceholderCaptura />
        </ScreenDemo>
      </Scene>

      <Scene name="EndCard" {...escena(4, T.end, true)}>
        <EndCard />
      </Scene>

      <Subtitles cues={subtitulos} />
    </AbsoluteFill>
  );
};
