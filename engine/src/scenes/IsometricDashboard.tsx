// Dashboard isométrico (blueprint §4). Geometría y física aquí; colores desde el tema.
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { pulse, SPRINGS } from "../motion/springs";
import type { ContenidoData, VisualData } from "../schema";
import { rgba } from "../utils/color";
import { fontFamily, textColor, type BrandTheme } from "../utils/themeProvider";

/** Capas Z en px (blueprint §4.2). */
const CAPA = { base: 0, card: 10, chart: 20, kpi: 30, badge: 45 } as const;

const SOMBRA_TARJETA = (acento: string) =>
  `0 25px 45px rgba(0,0,0,0.42), 0 10px 18px rgba(0,0,0,0.25), 0 0 35px ${rgba(acento, 0.07)}`;

interface Props {
  theme: BrandTheme;
  visual: VisualData;
  contenido: ContenidoData;
  /** Frames extra de pulso de borde (p. ej. sfx ui_click). */
  clicks: readonly number[];
}

export const IsometricDashboard: React.FC<Props> = ({ theme, visual, contenido, clicks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cine = theme.cinematic;
  const acento = theme.acento;

  // Geometría: preset principal o cinematográfico según shot_type.
  const geo =
    visual.shot_type === "cinematic" && cine
      ? { ...cine.dashboardCinematico }
      : { rotacion: cine?.dashboard.rotacion ?? ([55, 0, -35] as const), perspectiva: cine?.dashboard.perspectiva ?? 1400, translateZ: 0 };
  const [rx, ry, rz] = geo.rotacion;

  const gradiente = cine
    ? `linear-gradient(145deg, ${cine.tarjeta.gradiente[0]}, ${cine.tarjeta.gradiente[1]})`
    : theme.fondo;
  const bordeBase = cine?.tarjeta.bordeAlfa ?? 0.16;

  // Entrada del plano (resorte pesado).
  const entrada = spring({ frame: frame - 2, fps, config: SPRINGS.heavy });

  // Eventos.
  const interrupts = visual.pattern_interrupt_events;
  const glow = pulse(frame, fps, interrupts, 8);
  const borde = pulse(frame, fps, [...interrupts, ...clicks], 4);

  const kpis = contenido.kpis ?? [];
  const serie = contenido.serie ?? [];

  // Cambio de foco cada visual_change_interval frames.
  const tramo = Math.floor(frame / visual.visual_change_interval);
  const foco = kpis.length ? tramo % kpis.length : -1;
  const focoP = spring({ frame: frame - tramo * visual.visual_change_interval, fps, config: SPRINGS.standard });

  const texto = textColor(theme);

  const tarjeta = (z: number, extraBorde: number): React.CSSProperties => ({
    transformStyle: "preserve-3d",
    transform: `translateZ(${z}px)`,
    background: gradiente,
    border: `1px solid ${rgba(acento, Math.min(1, bordeBase + extraBorde))}`,
    boxShadow: SOMBRA_TARJETA(acento),
    borderRadius: 28,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: `${geo.perspectiva}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translateZ(${geo.translateZ}px) translateY(${interpolate(entrada, [0, 1], [180, 0])}px) scale(${interpolate(entrada, [0, 1], [0.88, 1])})`,
          opacity: interpolate(entrada, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: fontFamily(theme),
          color: texto,
        }}
      >
        {/* Base */}
        <div
          style={{
            ...tarjeta(CAPA.base, borde * 0.5),
            width: 780,
            padding: 36,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            position: "relative",
          }}
        >
          {/* KPIs */}
          <div style={{ display: "flex", gap: 22, transformStyle: "preserve-3d" }}>
            {kpis.map((kpi, i) => {
              const inicio = 14 + i * 5;
              const conteo = spring({ frame: frame - inicio, fps, config: SPRINGS.standard, durationInFrames: 18 });
              const valor = interpolate(conteo, [0, 1], [0, kpi.valor], { extrapolateRight: "clamp" });
              const destacado = i === foco ? focoP : 0;
              return (
                <div
                  key={kpi.label}
                  style={{
                    ...tarjeta(CAPA.card - CAPA.base + destacado * 8, borde * 0.6 + destacado * 0.3),
                    flex: 1,
                    padding: "22px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    opacity: interpolate(conteo, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  <span style={{ fontSize: 22, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.62, fontWeight: 600 }}>
                    {kpi.label}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      transform: `translateZ(${CAPA.kpi - CAPA.card}px)`,
                      fontSize: 62,
                      fontWeight: theme.fontWeight,
                      color: acento,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: [
                        `0 0 ${interpolate(glow, [0, 1], [8, 10])}px ${rgba(acento, interpolate(glow, [0, 1], [0.25, 0.65]))}`,
                        `0 0 ${interpolate(glow, [0, 1], [20, 30])}px ${rgba(acento, interpolate(glow, [0, 1], [0.15, 0.35]))}`,
                        `0 0 55px ${rgba(acento, interpolate(glow, [0, 1], [0, 0.18]))}`,
                      ].join(", "),
                    }}
                  >
                    {valor.toFixed(kpi.decimales ?? 0)}
                    {kpi.sufijo ?? ""}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Gráfico */}
          <div
            style={{
              ...tarjeta(CAPA.card - CAPA.base, borde * 0.6),
              height: 360,
              padding: 26,
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
            }}
          >
            {serie.map((v, i) => {
              const p = spring({ frame: frame - 24 - i * 3, fps, config: SPRINGS.standard, durationInFrames: 20 });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.max(0, v * 100 * p)}%`,
                    transform: `translateZ(${CAPA.chart - CAPA.card}px)`,
                    borderRadius: "12px 12px 4px 4px",
                    background: `linear-gradient(180deg, ${rgba(acento, 0.55 + v * 0.45)}, ${rgba(acento, 0.18)})`,
                    boxShadow: `0 0 ${18 * glow}px ${rgba(acento, 0.35 * glow)}`,
                  }}
                />
              );
            })}
          </div>

          {/* Badge flotante */}
          {contenido.badge && (() => {
            const b = spring({ frame: frame - 40, fps, config: SPRINGS.elastic });
            return (
              <div
                style={{
                  position: "absolute",
                  top: -46,
                  right: 40,
                  transform: `translateZ(${CAPA.badge}px) scale(${b})`,
                  padding: "14px 26px",
                  borderRadius: 999,
                  background: acento,
                  color: theme.fondo,
                  fontWeight: theme.fontWeight,
                  fontSize: 30,
                  boxShadow: `0 18px 30px rgba(0,0,0,0.45), 0 0 ${20 + 30 * glow}px ${rgba(acento, 0.25 + 0.4 * glow)}`,
                  whiteSpace: "nowrap",
                }}
              >
                {contenido.badge}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
