// Diccionario de temas por marca. ESPEJO de vault/04-MARCAS/<slug>.md:
// si cambia una ficha del vault, se actualiza aquí (el vault manda).
// Regla: nada de colores de marca fuera de este archivo.
import type { SpringConfig } from "remotion";
import type { BrandSlug, SkillId } from "../constants";

/** Perfil cinematográfico (Dirección de Arte). null = la marca no lo tiene definido. */
export interface CinematicProfile {
  /** Opacidad del film grain (soft-light). */
  grano: number;
  /** Alfa de la luz ambiente del acento: [centro 0%, medio 35%]. Ausente = sin luz ambiente. */
  luzAmbiente?: readonly [number, number];
  /** Alfa de la viñeta negra: [interior 20%, exterior 100%]. */
  vineta: readonly [number, number];
  dashboard?: { rotacion: readonly [number, number, number]; perspectiva: number };
  dashboardCinematico?: { rotacion: readonly [number, number, number]; perspectiva: number; translateZ: number };
  tarjeta?: { gradiente: readonly [string, string]; bordeAlfa: number };
  /** Resorte de la tipografía cinética de la marca. */
  springTexto?: Partial<SpringConfig>;
}

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
  /** Colores de glitch/aberración (solo eventos). null = la marca no usa glitch. */
  glitch: { rojo: string; cyan: string } | null;
  /** Tipografía declarada en el vault. null = NO DEFINIDO. */
  fuente: string | null;
  fontWeight: number;
  /** Archivo de fuente local en engine/public/ (staticFile). null = fuente del sistema. */
  fontFile: string | null;
  /** Fuente en formato typeface.json para texto 3D (<Text3D>). null = sin texto 3D. */
  typeface3d: string | null;
  /** Ruta del logo relativa a la raíz del repo. null = NO DEFINIDO. */
  logo: string | null;
  skillsPreferidas: readonly SkillId[];
  cinematic: CinematicProfile | null;
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
    glitch: null,
    fuente: null,
    fontWeight: 700,
    logo: null,
    skillsPreferidas: ["CloudAnimationBase", "PaperShades"],
    fontFile: null,
    typeface3d: null,
    cinematic: null,
  },
  kutt: {
    slug: "kutt",
    nombre: "KUTT",
    fondo: "#0A1218",
    texto: null,
    acento: "#00C4B4",
    acentoSecundario: null,
    cta: null,
    glitch: null,
    fuente: "Archivo",
    fontWeight: 800,
    logo: "vault/04-MARCAS/assets/kutt-logo.svg",
    skillsPreferidas: ["OpusCard", "Lemo"],
    fontFile: "brands/kutt/fonts/archivo-800-latin.woff2",
    typeface3d: null,
    cinematic: {
      grano: 0.055,
      luzAmbiente: [0.12, 0.055],
      vineta: [0.15, 0.45],
      dashboard: { rotacion: [55, 0, -35], perspectiva: 1400 },
      dashboardCinematico: { rotacion: [48, -8, -25], perspectiva: 1100, translateZ: 100 },
      tarjeta: { gradiente: ["#142832", "#0C171E"], bordeAlfa: 0.16 },
      springTexto: { damping: 20, stiffness: 170, mass: 0.8 },
    },
  },
  "metal-lopez": {
    slug: "metal-lopez",
    nombre: "Metal López",
    fondo: "#0A1218",
    texto: null,
    acento: "#2F9E9B",
    acentoSecundario: "#2F9E9B",
    cta: "#F0724F",
    glitch: null,
    fuente: "Inter",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/metal-lopez-logo.svg",
    skillsPreferidas: ["PaperShades", "Lemo"],
    fontFile: null,
    typeface3d: null,
    cinematic: null,
  },
  vitaly: {
    slug: "vitaly",
    nombre: "Vitaly",
    fondo: "#010409",
    texto: null,
    acento: "#7C6BF2",
    acentoSecundario: null,
    cta: null,
    glitch: null,
    fuente: "Montserrat",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/vitaly-logo.svg",
    skillsPreferidas: ["Hyperframes", "OpusCard"],
    fontFile: null,
    typeface3d: null,
    cinematic: null,
  },
  "nicolas-lopez": {
    slug: "nicolas-lopez",
    nombre: "Nicolás López",
    fondo: "#050505",
    texto: null,
    acento: "#00C4B4",
    acentoSecundario: "#FFB020",
    cta: null,
    glitch: { rojo: "#FF003C", cyan: "#00DCFF" },
    fuente: "Poppins",
    fontWeight: 700,
    logo: "vault/04-MARCAS/assets/nicolas-lopez-logo.png",
    skillsPreferidas: ["Hyperframes"],
    fontFile: "brands/nicolas-lopez/fonts/poppins-700-latin.woff2",
    typeface3d: "brands/nicolas-lopez/fonts/poppins-700.typeface.json",
    cinematic: {
      // Blueprint §1.3: grano 0.07 · viñeta 0.65. Luz ambiente "selectiva" (sin valor) → apagada.
      grano: 0.07,
      vineta: [0.15, 0.65],
    },
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
