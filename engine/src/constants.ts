// Defaults globales del motor (decisión 2026-11-17: 30 fps, vertical).
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Tenants válidos. Fuente de verdad estética: vault/04-MARCAS/<slug>.md
export const BRAND_SLUGS = [
  "mente-estrategica",
  "metal-lopez",
  "kutt",
  "vitaly",
  "nicolas-lopez",
] as const;
export type BrandSlug = (typeof BRAND_SLUGS)[number];
