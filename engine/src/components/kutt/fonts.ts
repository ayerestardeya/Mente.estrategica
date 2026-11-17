// Carga determinista de tipografías KUTT (archivos locales, licencia OFL).
// Archivos en engine/public/kutt/fonts/. Bloquea el render hasta que cargan.
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const FUENTES = [
  { family: "Archivo", file: "kutt/fonts/Archivo-ExtraBold-latin.woff2", weight: "800" },
  { family: "Inter", file: "kutt/fonts/Inter-Variable-latin.woff2", weight: "100 900" },
] as const;

let iniciado = false;

export const loadKuttFonts = (): void => {
  if (iniciado || typeof document === "undefined") return;
  iniciado = true;
  const handle = delayRender("Cargando tipografías KUTT (Archivo, Inter)");
  Promise.all(
    FUENTES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format('woff2')`, {
        weight: f.weight,
        style: "normal",
        display: "block",
      });
      document.fonts.add(await face.load());
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};
