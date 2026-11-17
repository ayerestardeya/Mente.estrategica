// Composición base NEUTRA: no contiene identidad de ninguna marca.
// La identidad (colores, etc.) llega por props desde vault/04-MARCAS/<slug>.md.
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND_SLUGS } from "../constants";

export const baseVerticalSchema = z.object({
  marca: z.enum(BRAND_SLUGS),
  titulo: z.string(),
  fondo: zColor(),
  texto: zColor(),
  acento: zColor(),
});
export type BaseVerticalProps = z.infer<typeof baseVerticalSchema>;

export const BaseVertical: React.FC<BaseVerticalProps> = ({ marca, titulo, fondo, texto, acento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: "clamp" });
  const barra = interpolate(frame, [0, fps * 2], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="items-center justify-center p-24" style={{ backgroundColor: fondo }}>
      <div className="flex flex-col items-center gap-10" style={{ opacity }}>
        <h1 className="text-center text-8xl font-bold leading-tight" style={{ color: texto }}>
          {titulo}
        </h1>
        <div className="h-3 rounded-full" style={{ width: `${barra}%`, backgroundColor: acento }} />
        <p className="text-4xl uppercase tracking-widest" style={{ color: texto, opacity: 0.6 }}>
          {marca}
        </p>
      </div>
    </AbsoluteFill>
  );
};
