// OpusCard: dashboard isométrico con UI limpia. Colores 100% desde el tema.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, textColor } from "../../utils/themeProvider";
import type { SkillProps } from "./types";

const BARRAS = [0.42, 0.68, 0.55, 0.88, 0.74, 0.96];
const KPIS = [
  { label: "Retención", valor: 87 },
  { label: "CTR", valor: 12 },
  { label: "Alcance", valor: 64 },
];

export const OpusCard: React.FC<SkillProps> = ({ theme, titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texto = textColor(theme);
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const deriva = interpolate(frame, [0, fps * 5], [0, -40]);

  return (
    <AbsoluteFill
      className="items-center justify-center overflow-hidden"
      style={{ backgroundColor: theme.fondo, fontFamily: fontFamily(theme), color: texto }}
    >
      <h1
        className="absolute top-40 px-16 text-center text-7xl font-bold"
        style={{ opacity: entrada, fontWeight: theme.fontWeight }}
      >
        {titulo}
      </h1>

      {/* Plano isométrico */}
      <div
        style={{
          transform: `translateY(${deriva}px) rotateX(55deg) rotateZ(-45deg) scale(${0.8 + entrada * 0.2})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="flex flex-col gap-8 rounded-3xl p-10"
          style={{
            width: 760,
            backgroundColor: `${theme.acento}14`,
            border: `3px solid ${theme.acento}`,
            boxShadow: `30px 30px 0 ${theme.acento}33`,
          }}
        >
          <div className="flex gap-6">
            {KPIS.map((kpi, i) => {
              const p = spring({ frame: frame - 10 - i * 6, fps, config: { damping: 200 } });
              return (
                <div
                  key={kpi.label}
                  className="flex flex-1 flex-col gap-2 rounded-2xl p-6"
                  style={{ backgroundColor: theme.fondo, border: `2px solid ${theme.acento}66`, opacity: p }}
                >
                  <span className="text-2xl uppercase tracking-widest" style={{ opacity: 0.6 }}>
                    {kpi.label}
                  </span>
                  <span className="text-6xl font-bold" style={{ color: theme.acento }}>
                    {Math.round(kpi.valor * p)}%
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="flex h-80 items-end gap-5 rounded-2xl p-6"
            style={{ backgroundColor: theme.fondo, border: `2px solid ${theme.acento}66` }}
          >
            {BARRAS.map((h, i) => {
              const p = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 200 } });
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-xl"
                  style={{ height: `${h * 100 * p}%`, backgroundColor: theme.acento, opacity: 0.4 + h * 0.6 }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <p className="absolute bottom-40 text-3xl uppercase tracking-[0.4em]" style={{ opacity: 0.5 * entrada }}>
        {theme.nombre}
      </p>
    </AbsoluteFill>
  );
};
