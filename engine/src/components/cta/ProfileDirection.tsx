// Dirige la mirada al perfil (zona inferior izquierda de Reels/Shorts/TikTok).
import { interpolate } from "remotion";
import type { CtaData } from "../../schema";
import { rgba } from "../../utils/color";
import { fontFamily, textColor, type BrandTheme } from "../../utils/themeProvider";
import { useCtaSpring } from "./useCtaSpring";

export const ProfileDirection: React.FC<{ theme: BrandTheme; cta: CtaData; inicio: number }> = ({ theme, cta, inicio }) => {
  const p = useCtaSpring(inicio);
  const flecha = useCtaSpring(inicio + 6);
  const color = theme.cta ?? theme.acento;

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        top: 1545,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateX(${interpolate(p, [0, 1], [-80, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        transformOrigin: "left center",
        fontFamily: fontFamily(theme),
      }}
    >
      <svg width="74" height="74" viewBox="0 0 74 74" style={{ transform: `translate(${interpolate(flecha, [0, 1], [-14, 0])}px, ${interpolate(flecha, [0, 1], [-14, 0])}px)` }}>
        <path d="M60 14 L18 56 M18 56 L18 26 M18 56 L48 56" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div
        style={{
          padding: "16px 28px",
          borderRadius: 999,
          border: `2px solid ${rgba(color, 0.7)}`,
          background: rgba(theme.fondo, 0.82),
          color: textColor(theme),
          fontSize: 36,
          fontWeight: theme.fontWeight,
          boxShadow: `0 0 30px ${rgba(color, 0.25)}`,
        }}
      >
        {cta.direccion} <span style={{ color }}>{cta.handle}</span>
      </div>
    </div>
  );
};
