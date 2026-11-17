// Texto HTML con glitch por eventos: copias recortadas (clip-path) en Rojo/Cyan
// de la ficha y text-shadow desfasado. Fuera de los eventos es texto limpio.
import type { CSSProperties } from "react";
import type { GlitchFrame } from "./glitch";

interface Props {
  texto: string;
  g: GlitchFrame | null;
  rojo: string;
  cyan: string;
  style?: CSSProperties;
}

export const GlitchText: React.FC<Props> = ({ texto, g, rojo, cyan, style }) => {
  if (!g) return <div style={style}>{texto}</div>;
  return (
    <div
      style={{
        ...style,
        position: "relative",
        transform: `translateX(${g.dx}px)`,
        filter: `blur(${g.blur.toFixed(2)}px)`,
        textShadow: `${-g.rgb}px 0 ${rojo}, ${g.rgb}px 0 ${cyan}`,
      }}
    >
      {texto}
      {g.slices.map((s, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: i % 2 === 0 ? cyan : rojo,
            clipPath: `inset(${s.top}% 0 ${s.bottom}% 0)`,
            transform: `translateX(${s.dx}px)`,
            mixBlendMode: "screen",
            textShadow: "none",
          }}
        >
          {texto}
        </span>
      ))}
    </div>
  );
};
