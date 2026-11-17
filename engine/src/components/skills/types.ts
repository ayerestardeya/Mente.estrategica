import type { BrandTheme } from "../../utils/themeProvider";

/** Contrato común de todos los skills: reciben el tema de UNA sola marca. */
export interface SkillProps {
  theme: BrandTheme;
  titulo: string;
}
