// Hyperframes: cortes agresivos, barreras de texto 3D, revelaciones wireframe.
// Estado: barrera 3D (WebGL) operativa como esqueleto; glitch y wireframe pendientes.
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Z } from "../cinematic/layers";
import { SPRINGS } from "../../motion/springs";
import { TextBarrier3D } from "../../scenes/TextBarrier3D";
import { fontFamily, textColor } from "../../utils/themeProvider";
import type { SkillProps } from "./types";

export const Hyperframes: React.FC<SkillProps> = ({ theme, titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(1, spring({ frame: frame - 18, fps, config: SPRINGS.soft }));

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: theme.fondo }}>
        <TextBarrier3D theme={theme} />
      </AbsoluteFill>
      <AbsoluteFill
        className="items-center justify-end pb-56"
        style={{ zIndex: Z.hud, fontFamily: fontFamily(theme), color: textColor(theme), opacity }}
      >
        <h1 className="text-center text-7xl" style={{ fontWeight: theme.fontWeight }}>
          {titulo}
        </h1>
        <p className="mt-6 text-3xl uppercase tracking-widest" style={{ opacity: 0.6 }}>
          Hyperframes · esqueleto 3D
        </p>
      </AbsoluteFill>
    </>
  );
};
