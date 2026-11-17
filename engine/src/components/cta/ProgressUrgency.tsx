// Barra de urgencia: el llenado también es un resorte (damping 12), nunca lineal.
import { interpolate } from "remotion";
import type { CtaData } from "../../schema";
import { rgba } from "../../utils/color";
import { fontFamily, textColor, type BrandTheme } from "../../utils/themeProvider";
import { useCtaSpring } from "./useCtaSpring";

export const ProgressUrgency: React.FC<{ theme: BrandTheme; cta: CtaData; inicio: number }> = ({ theme, cta, inicio }) => {
  const p = useCtaSpring(inicio);
  const llenado = useCtaSpring(inicio + 6);
  const color = theme.cta ?? theme.acento;
  const pct = interpolate(llenado, [0, 1], [0, cta.progreso]);

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 1440,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px)`,
        fontFamily: fontFamily(theme),
        color: textColor(theme),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
        <span style={{ opacity: 0.8 }}>{cta.urgencia}</span>
        <span style={{ color, fontVariantNumeric: "tabular-nums" }}>{Math.round(Math.min(pct, cta.progreso))}%</span>
      </div>
      <div style={{ height: 18, borderRadius: 999, background: rgba(color, 0.14), overflow: "hidden" }}>
        <div
          style={{
            width: `${Math.max(0, pct)}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${rgba(color, 0.6)}, ${color})`,
            boxShadow: `0 0 18px ${rgba(color, 0.55)}`,
          }}
        />
      </div>
    </div>
  );
};
