import type { EscenaData } from "../../schema";
import type { BrandTheme } from "../../utils/themeProvider";

/** Contrato común de todos los skills: reciben el tema de UNA sola marca. */
export interface SkillProps {
  theme: BrandTheme;
  titulo: string;
  /** Datos JSON-driven (Fase 4). Sin ellos el skill usa su escena por defecto. */
  escena?: EscenaData;
}
