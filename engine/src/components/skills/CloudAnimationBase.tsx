// CloudAnimationBase (esqueleto): lienzos etéreos y ritmo psicológico.
// TODO Fase siguiente: implementar la animación propia del skill.
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRINGS } from "../../motion/springs";
import { fontFamily, textColor } from "../../utils/themeProvider";
import type { SkillProps } from "./types";

export const CloudAnimationBase: React.FC<SkillProps> = ({ theme, titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(1, spring({ frame, fps, config: SPRINGS.soft }));

  return (
    <AbsoluteFill
      className="items-center justify-center gap-10 p-24"
      style={{ backgroundColor: theme.fondo, fontFamily: fontFamily(theme), color: textColor(theme), opacity }}
    >
      <h1 className="text-center text-7xl" style={{ fontWeight: theme.fontWeight }}>
        {titulo}
      </h1>
      <div className="h-3 w-2/3 rounded-full" style={{ backgroundColor: theme.acento }} />
      <p className="text-3xl uppercase tracking-widest" style={{ opacity: 0.6 }}>
        CloudAnimationBase · esqueleto
      </p>
    </AbsoluteFill>
  );
};
