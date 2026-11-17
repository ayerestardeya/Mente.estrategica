// Entorno cinematográfico (blueprint §1): fondo, luz ambiente + viñeta, grano.
// Toda la identidad viene del tema; si la marca no tiene perfil cinematográfico,
// solo se pinta su fondo (comportamiento de la Fase 3).
import { AbsoluteFill } from "remotion";
import { rgba } from "../../utils/color";
import type { BrandTheme } from "../../utils/themeProvider";
import { useBrandFont } from "../../utils/useBrandFont";
import { FilmGrain } from "./FilmGrain";
import { Z } from "./layers";

export const CinematicBackground: React.FC<{ theme: BrandTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => {
  useBrandFont(theme);
  const p = theme.cinematic;

  return (
    <AbsoluteFill style={{ overflow: "hidden", isolation: "isolate", background: theme.fondo }}>
      {children}
      {p && (
        <AbsoluteFill
          style={{
            zIndex: Z.luz,
            pointerEvents: "none",
            background: [
              p.luzAmbiente &&
                `radial-gradient(ellipse at 50% 42%, ${rgba(theme.acento, p.luzAmbiente[0])} 0%, ${rgba(theme.acento, p.luzAmbiente[1])} 35%, transparent 65%)`,
              `radial-gradient(ellipse at 50% 100%, rgba(0,0,0,${p.vineta[0]}) 20%, rgba(0,0,0,${p.vineta[1]}) 100%)`,
            ]
              .filter(Boolean)
              .join(", "),
          }}
        />
      )}
      {p && <FilmGrain opacity={p.grano} />}
    </AbsoluteFill>
  );
};
