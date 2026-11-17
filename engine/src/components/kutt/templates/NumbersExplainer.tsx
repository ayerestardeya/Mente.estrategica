// Plantilla KUTT: comparativas financieras con animación numérica.
// Incluye rótulo estático "Ejemplo" en la esquina (cifras ilustrativas).
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, KUTT, SAFE_ZONE } from "../theme";

export type NumberItem = {
  label: string;
  value: number;
  /** Destaca la fila con el acento de marca. */
  highlight?: boolean;
};

export type NumbersExplainerProps = {
  title?: string;
  items: NumberItem[];
  /** Formato de moneda (por defecto pesos chilenos). */
  locale?: string;
  currency?: string;
  /** Frame local en que arranca el conteo. */
  delay?: number;
  /** Duración del conteo en frames. */
  countDuration?: number;
  /** Frames entre filas. */
  stagger?: number;
};

export const NumbersExplainer: React.FC<NumbersExplainerProps> = ({
  title,
  items,
  locale = "es-CL",
  currency = "CLP",
  delay = 10,
  countDuration = 45,
  stagger = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 });
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  const tituloIn = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ backgroundColor: KUTT.colores.fondo }}>
      {/* Rótulo estático "Ejemplo" (sin animación, siempre visible) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top - 80,
          right: SAFE_ZONE.left,
          fontFamily: KUTT.tipografia.cuerpo,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: KUTT.colores.acento,
          border: `3px solid ${KUTT.colores.acento}`,
          borderRadius: 14,
          padding: "8px 20px",
        }}
      >
        Ejemplo
      </div>

      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top + 60,
          bottom: SAFE_ZONE.bottom,
          left: SAFE_ZONE.left,
          right: SAFE_ZONE.right - 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 56,
        }}
      >
        {title ? (
          <div
            style={{
              fontFamily: KUTT.tipografia.titulos,
              fontWeight: KUTT.tipografia.pesoTitulos,
              fontSize: 84,
              lineHeight: 1.05,
              color: KUTT.colores.texto,
              opacity: tituloIn,
              transform: `translateY(${(1 - tituloIn) * 40}px)`,
            }}
          >
            {title}
          </div>
        ) : null}

        {items.map((item, i) => {
          const inicio = delay + i * stagger;
          const entrada = spring({ frame: frame - inicio, fps, config: { damping: 18, stiffness: 160 } });
          const progreso = interpolate(frame, [inicio, inicio + countDuration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const color = item.highlight ? KUTT.colores.acento : KUTT.colores.texto;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                opacity: entrada,
                transform: `translateX(${(1 - entrada) * -80}px)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24 }}>
                <span style={{ fontFamily: KUTT.tipografia.cuerpo, fontWeight: 500, fontSize: 44, color: alpha(KUTT.colores.texto, 0.8) }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: KUTT.tipografia.titulos,
                    fontWeight: KUTT.tipografia.pesoTitulos,
                    fontSize: 72,
                    color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fmt.format(Math.round(item.value * progreso))}
                </span>
              </div>
              <div style={{ height: 18, borderRadius: 9, backgroundColor: alpha(KUTT.colores.texto, 0.08) }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(Math.abs(item.value) / max) * 100 * progreso}%`,
                    borderRadius: 9,
                    backgroundColor: item.highlight ? KUTT.colores.acento : alpha(KUTT.colores.texto, 0.45),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
