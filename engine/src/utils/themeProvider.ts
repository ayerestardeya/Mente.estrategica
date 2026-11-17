// Diccionario de temas por marca. ESPEJO de vault/04-MARCAS/<slug>.md:
// si cambia una ficha del vault, se actualiza aquí (el vault manda).
// Regla: nada de colores de marca fuera de este archivo.
import type { BrandSlug, SkillId } from "../constants";

export interface BrandTheme {
  slug: BrandSlug;
  nombre: string;
  fondo: string;
  /** Color de texto. null = NO DEFINIDO en el vault → los skills usan NEUTRAL_TEXT. */
  texto: string | null;
  acento: string;
  /** Segundo acento o fondo secundario, si la ficha lo define. */
  acentoSecundario: string | null;
  /** Color reservado a CTAs/advertencias, si la ficha lo define. */
  cta: string | null;
  /** Tipografía declarada en el vault. null = NO DEFINIDO. */
  fuente: string | null;
  fontWeight: number;
  /** Ruta del logo relativa a la raíz del repo. null = NO DEFINIDO. */
  logo: string | null;
  skillsPreferidas: readonly SkillId[];
}

/** Valores técnicos neutros del motor (no son identidad de ninguna marca). */
export const NEUTRAL_TEXT = "#FFFFFF";
export const FALLBACK_FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export const THEMES = {
  "mente-estrategica": {
    slug: "mente-estrategica",
    nombre: "Mente Estratégica",
    fondo: "#010409",
    texto: "#FFFFFF",
    acento: "#FFB020",
    acentoSecundario: null,
    cta: null,
    fuente: null,
    fontWeight: 700,
    logo: null,
    skillsPreferidas: ["CloudAnimationBase", "PaperShades"],
  },
  kutt: {
    slug: "kutt",
    nombre: "KUTT",
    fondo: "#0A1218",
    texto: null,
    acento: "#00C4B4",
    acentoSecundario: null,
    cta: null,
    fuente: "Archivo",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/kutt-logo.svg",
    skillsPreferidas: ["OpusCard", "Lemo"],
  },
  "metal-lopez": {
    slug: "metal-lopez",
    nombre: "Metal López",
    fondo: "#0A1218",
    texto: null,
    acento: "#2F9E9B",
    acentoSecundario: "#2F9E9B",
    cta: "#F0724F",
    fuente: "Inter",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/metal-lopez-logo.svg",
    skillsPreferidas: ["PaperShades", "Lemo"],
  },
  vitaly: {
    slug: "vitaly",
    nombre: "Vitaly",
    fondo: "#010409",
    texto: null,
    acento: "#7C6BF2",
    acentoSecundario: null,
    cta: null,
    fuente: "Montserrat",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/vitaly-logo.svg",
    skillsPreferidas: ["Hyperframes", "OpusCard"],
  },
  "nicolas-lopez": {
    slug: "nicolas-lopez",
    nombre: "Nicolás López",
    fondo: "#010409",
    texto: null,
    acento: "#00C4B4",
    acentoSecundario: "#FFB020",
    cta: null,
    fuente: "Poppins",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/nicolas-lopez-logo.png",
    skillsPreferidas: ["Hyperframes"],
  },
} as const satisfies Record<BrandSlug, BrandTheme>;

/** Devuelve SOLO el tema de la marca pedida (aislamiento: nunca el diccionario entero). */
export function getTheme(marca: BrandSlug): BrandTheme {
  return THEMES[marca];
}

export function textColor(theme: BrandTheme): string {
  return theme.texto ?? NEUTRAL_TEXT;
}

export function fontFamily(theme: BrandTheme): string {
  return theme.fuente ? `'${theme.fuente}', ${FALLBACK_FONT_STACK}` : FALLBACK_FONT_STACK;
}
