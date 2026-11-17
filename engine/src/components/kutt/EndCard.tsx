// <EndCard /> estandarizado KUTT: coreografía de 3 s (90 frames a 30 fps).
// Si su Sequence dura más, mantiene el estado final (hold).
// Logo SVG: NO DEFINIDO en kutt.md -> solo tipografía, sin inventar logo.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, KUTT } from "./theme";

export const END_CARD_DURATION_FRAMES = 90; // 3 s @ 30 fps

type EndCardProps = {
  frase?: string;
  handle?: string;
};

export const EndCard: React.FC<EndCardProps> = ({ frase = "KUTT, todo en orden.", handle = KUTT.handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const linea = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const titulo = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 140 } });
  const handleIn = spring({ frame: frame - 22, fps, config: { damping: 20, stiffness: 120 } });
  // Respiración muy sutil del halo durante el resto de los 3 s.
  const halo = interpolate(frame, [0, END_CARD_DURATION_FRAMES], [0.1, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: KUTT.colores.fondo,
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 48%, ${alpha(KUTT.colores.acento, halo)} 0%, ${KUTT.colores.fondo} 55%)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div
          style={{
            width: 220 * linea,
            height: 10,
            borderRadius: 5,
            backgroundColor: KUTT.colores.acento,
          }}
        />
        <div
          style={{
            fontFamily: KUTT.tipografia.titulos,
            fontWeight: KUTT.tipografia.pesoTitulos,
            fontSize: 104,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: KUTT.colores.texto,
            textAlign: "center",
            padding: "0 90px",
            opacity: titulo,
            transform: `translateY(${(1 - titulo) * 60}px)`,
          }}
        >
          {frase}
        </div>
        <div
          style={{
            fontFamily: KUTT.tipografia.cuerpo,
            fontWeight: 600,
            fontSize: 56,
            color: KUTT.colores.acento,
            opacity: handleIn,
            transform: `translateY(${(1 - handleIn) * 30}px)`,
          }}
        >
          {handle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
