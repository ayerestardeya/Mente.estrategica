// Tarjeta de conversión: promesa + beneficio + botón.
import { interpolate } from "remotion";
import type { CtaData } from "../../schema";
import { rgba } from "../../utils/color";
import { fontFamily, textColor, type BrandTheme } from "../../utils/themeProvider";
import { useCtaSpring } from "./useCtaSpring";

export const ConversionCard: React.FC<{ theme: BrandTheme; cta: CtaData; inicio: number }> = ({ theme, cta, inicio }) => {
  const p = useCtaSpring(inicio);
  const boton = useCtaSpring(inicio + 8);
  const color = theme.cta ?? theme.acento;
  const tarjeta = theme.cinematic?.tarjeta;
  const fondo = tarjeta
    ? `linear-gradient(145deg, ${tarjeta.gradiente[0]}, ${tarjeta.gradiente[1]})`
    : theme.fondo;

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: 960,
        padding: "40px 44px",
        borderRadius: 36,
        background: fondo,
        border: `1px solid ${rgba(color, 0.35)}`,
        boxShadow: `0 25px 45px rgba(0,0,0,0.42), 0 10px 18px rgba(0,0,0,0.25), 0 0 45px ${rgba(color, 0.12)}`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(p, [0, 1], [140, 0])}px) scale(${interpolate(p, [0, 1], [0.86, 1])})`,
        fontFamily: fontFamily(theme),
        color: textColor(theme),
      }}
    >
      <div style={{ fontSize: 54, fontWeight: theme.fontWeight, lineHeight: 1.05, letterSpacing: "-0.01em" }}>{cta.titulo}</div>
      <div style={{ fontSize: 32, opacity: 0.72, lineHeight: 1.25 }}>{cta.beneficio}</div>
      <div
        style={{
          alignSelf: "flex-start",
          marginTop: 8,
          padding: "20px 40px",
          borderRadius: 999,
          background: color,
          color: theme.fondo,
          fontSize: 36,
          fontWeight: theme.fontWeight,
          transform: `scale(${interpolate(boton, [0, 1], [0.6, 1])})`,
          transformOrigin: "left center",
          opacity: interpolate(boton, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          boxShadow: `0 0 ${interpolate(boton, [0, 1], [0, 34])}px ${rgba(color, 0.45)}`,
        }}
      >
        {cta.boton}
      </div>
    </div>
  );
};
