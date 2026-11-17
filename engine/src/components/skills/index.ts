import type { SkillId } from "../../constants";
import type { SkillProps } from "./types";
import { CloudAnimationBase } from "./CloudAnimationBase";
import { Hyperframes } from "./Hyperframes";
import { Lemo } from "./Lemo";
import { OpusCard } from "./OpusCard";
import { PaperShades } from "./PaperShades";

export type { SkillProps } from "./types";

export const SKILLS: Record<SkillId, React.FC<SkillProps>> = {
  OpusCard,
  Hyperframes,
  PaperShades,
  Lemo,
  CloudAnimationBase,
};
