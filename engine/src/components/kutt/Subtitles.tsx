// <Subtitles /> estandarizado KUTT para la zona segura inferior (1080x1920).
// Recibe cues en frames ABSOLUTOS de la composición donde se monta.
// Palabras entre *asteriscos* se resaltan con el acento de marca.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, KUTT, SAFE_ZONE } from "./theme";

export type SubtitleCue = { text: string; from: number; to: number };

type SubtitlesProps = {
  cues: SubtitleCue[];
  fontSize?: number;
};

const renderTexto = (text: string) =>
  text.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith("*") && parte.endsWith("*") ? (
      <span key={i} style={{ color: KUTT.colores.acento }}>
        {parte.slice(1, -1)}
      </span>
    ) : (
      <span key={i}>{parte}</span>
    ),
  );

export const Subtitles: React.FC<SubtitlesProps> = ({ cues, fontSize = 54 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = cues.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;

  const local = frame - cue.from;
  const pop = spring({ frame: local, fps, config: { damping: 16, stiffness: 220, mass: 0.6 } });
  const salida = interpolate(frame, [cue.to - 5, cue.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: SAFE_ZONE.left,
          right: SAFE_ZONE.right,
          bottom: SAFE_ZONE.bottom,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: KUTT.tipografia.cuerpo,
            fontWeight: 600,
            fontSize,
            lineHeight: 1.25,
            color: KUTT.colores.texto,
            textAlign: "center",
            padding: "18px 30px",
            borderRadius: 22,
            backgroundColor: alpha(KUTT.colores.fondo, 0.78),
            opacity: pop * salida,
            transform: `translateY(${(1 - pop) * 24}px) scale(${0.94 + pop * 0.06})`,
            maxWidth: "100%",
          }}
        >
          {renderTexto(cue.text)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
