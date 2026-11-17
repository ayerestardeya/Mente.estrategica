// Composición JSON-driven (Fase 4): el JSON decide marca, skill, eventos, audio y CTA.
import { SKILLS } from "./components/skills";
import { CinematicBackground } from "./components/cinematic/CinematicBackground";
import { CtaLayer } from "./components/cta/CtaLayer";
import { SfxLayer } from "./components/audio/SfxLayer";
import type { EngineProps } from "./schema";
import { getTheme } from "./utils/themeProvider";

export const MotorJSON: React.FC<EngineProps> = ({ marca, skillTarget, titulo, visual, audio, contenido, cta }) => {
  const theme = getTheme(marca);
  const Skill = SKILLS[skillTarget];
  return (
    <CinematicBackground theme={theme}>
      <Skill theme={theme} titulo={titulo ?? theme.nombre} escena={{ visual, audio, contenido }} />
      <CtaLayer theme={theme} cta={cta} inicio={visual.cta_trigger_time} />
      <SfxLayer audio={audio} />
    </CinematicBackground>
  );
};
