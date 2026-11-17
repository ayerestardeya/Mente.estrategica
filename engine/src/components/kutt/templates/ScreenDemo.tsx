// Plantilla KUTT: envoltorio de capturas de UI reales.
// - Marco de dispositivo móvil minimalista.
// - Zoom in/out fluido por keyframes (interpolate + easing) hacia un punto focal.
// - Resaltado: atenúa (dimming) todo excepto un rectángulo de la pantalla.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, KUTT } from "../theme";

/** Keyframe de cámara. focusX/focusY en % del dispositivo (0-100). */
export type ZoomKeyframe = { frame: number; scale: number; focusX?: number; focusY?: number };

/** Zona resaltada en % de la PANTALLA del dispositivo. */
export type Highlight = {
  x: number;
  y: number;
  width: number;
  height: number;
  from: number;
  to: number;
  /** Opacidad máxima del oscurecido (0-1). */
  dim?: number;
};

export type ScreenDemoProps = {
  /** Contenido de la pantalla: <Img>, <OffthreadVideo> o un placeholder. */
  children: React.ReactNode;
  /** Keyframes de zoom en frames LOCALES de la plantilla. */
  zoom?: ZoomKeyframe[];
  highlights?: Highlight[];
  /** Ancho del dispositivo en px (alto = ancho * 2.1). */
  deviceWidth?: number;
};

const EASE = Easing.bezier(0.45, 0, 0.2, 1);

const interpolarKeyframes = (frame: number, kfs: ZoomKeyframe[], key: "scale" | "focusX" | "focusY", def: number) => {
  if (kfs.length === 0) return def;
  if (kfs.length === 1) return kfs[0][key] ?? def;
  return interpolate(
    frame,
    kfs.map((k) => k.frame),
    kfs.map((k) => k[key] ?? def),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );
};

const Resaltado: React.FC<{ h: Highlight; frame: number }> = ({ h, frame }) => {
  const v = interpolate(frame, [h.from, h.from + 12, h.to - 12, h.to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  if (v <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: `${h.x}%`,
        top: `${h.y}%`,
        width: `${h.width}%`,
        height: `${h.height}%`,
        borderRadius: 18,
        // La sombra gigante oscurece el resto; overflow:hidden de la pantalla la recorta.
        boxShadow: `0 0 0 4000px ${alpha(KUTT.colores.fondo, (h.dim ?? 0.72) * v)}`,
        outline: `4px solid ${alpha(KUTT.colores.acento, v)}`,
        outlineOffset: 2,
        transform: `scale(${1.04 - 0.04 * v})`,
      }}
    />
  );
};

export const ScreenDemo: React.FC<ScreenDemoProps> = ({ children, zoom = [], highlights = [], deviceWidth = 660 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const deviceHeight = Math.round(deviceWidth * 2.1);
  const bezel = Math.round(deviceWidth * 0.035);

  const entrada = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const scale = interpolarKeyframes(frame, zoom, "scale", 1);
  const fx = interpolarKeyframes(frame, zoom, "focusX", 50);
  const fy = interpolarKeyframes(frame, zoom, "focusY", 50);

  return (
    <AbsoluteFill style={{ backgroundColor: KUTT.colores.fondo, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Halo de acento detrás del dispositivo */}
      <div
        style={{
          position: "absolute",
          width: deviceWidth * 1.5,
          height: deviceWidth * 1.5,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(KUTT.colores.acento, 0.16 * entrada)} 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          width: deviceWidth,
          height: deviceHeight,
          transformOrigin: `${fx}% ${fy}%`,
          transform: `translateY(${(1 - entrada) * 260}px) scale(${scale * (0.92 + 0.08 * entrada)})`,
          opacity: entrada,
        }}
      >
        {/* Marco del dispositivo */}
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: bezel,
            borderRadius: deviceWidth * 0.14,
            backgroundColor: "#000000",
            boxShadow: `0 0 0 3px ${alpha(KUTT.colores.texto, 0.14)}, 0 60px 120px ${alpha("#000000", 0.55)}`,
            position: "relative",
          }}
        >
          {/* Pantalla */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: deviceWidth * 0.11,
              overflow: "hidden",
            }}
          >
            <AbsoluteFill>{children}</AbsoluteFill>
            {highlights.map((h, i) => (
              <Resaltado key={i} h={h} frame={frame} />
            ))}
            {/* Isla / notch minimalista */}
            <div
              style={{
                position: "absolute",
                top: bezel * 0.9,
                left: "50%",
                width: deviceWidth * 0.28,
                height: bezel * 1.6,
                transform: "translateX(-50%)",
                borderRadius: bezel,
                backgroundColor: "#000000",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
