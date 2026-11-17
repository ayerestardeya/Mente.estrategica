// Tokens de marca KUTT. Fuente de verdad: vault/04-MARCAS/kutt.md
// Uso exclusivo de componentes dentro de engine/src/components/kutt/.
// Prohibido importarlo desde otra marca (aislamiento multi-tenant).

export const KUTT = {
  marca: "kutt",
  colores: {
    fondo: "#0A1218", // Deep Slate
    acento: "#00C4B4", // Glaciar Cyan
    texto: "#FFFFFF", // Texto / Primario (oficial, confirmado 2026-11-17)
    // Placeholder de capturas de UI (gris temporal, no es color de marca).
    placeholder: "#3A3F44",
  },
  tipografia: {
    titulos: "'Archivo', sans-serif", // Archivo ExtraBold (800)
    pesoTitulos: 800,
    cuerpo: "'Inter', sans-serif", // Inter (cuerpo / subtítulos)
  },
  handle: "@kutt.cl",
  fps: 30,
  ancho: 1080,
  alto: 1920,
} as const;

/** Derivados neutros de los tokens (solo opacidad, sin colores nuevos). */
export const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Zona segura vertical 1080x1920 (Reels / Shorts / TikTok).
 * Abajo: barra de descripción y CTA. Derecha: botones de interacción.
 */
export const SAFE_ZONE = {
  top: 220,
  bottom: 420,
  left: 72,
  right: 150,
} as const;
