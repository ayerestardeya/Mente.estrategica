// Enrutador multi-marca: recibe `marca` + `skillTarget` y monta el skill con
// el tema de ESA marca únicamente (aislamiento por tenant).
import { z } from "zod";
import { BRAND_SLUGS, SKILL_IDS } from "./constants";
import { SKILLS } from "./components/skills";
import { getTheme } from "./utils/themeProvider";

export const brandRouterSchema = z.object({
  marca: z.enum(BRAND_SLUGS),
  skillTarget: z.enum(SKILL_IDS),
  titulo: z.string().optional(),
});
export type BrandRouterProps = z.infer<typeof brandRouterSchema>;

export const BrandRouter: React.FC<BrandRouterProps> = ({ marca, skillTarget, titulo }) => {
  const theme = getTheme(marca);
  const Skill = SKILLS[skillTarget];
  return <Skill theme={theme} titulo={titulo ?? theme.nombre} />;
};
