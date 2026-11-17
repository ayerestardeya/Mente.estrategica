// Configuración del CLI de Remotion (studio/render). Tailwind v4 vía webpack.
// Modo híbrido: los parámetros de máquina (GPU, navegador, concurrencia) salen de
// variables de entorno, o de engine/.env (local, ignorado por git). Prioridad:
// variable de la shell > engine/.env > valor por defecto de Remotion.
import fs from "node:fs";
import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// Cargador mínimo de engine/.env (KEY=VALUE, # comentarios). No imprime valores.
const envFile = path.join(process.cwd(), ".env");
if (fs.existsSync(envFile)) {
  for (const linea of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !linea.trimStart().startsWith("#") && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => enableTailwind(config));

// Navegador: vacío = Chrome Headless Shell de Remotion (local). En la nube, el preinstalado.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browser) Config.setBrowserExecutable(browser);

// OpenGL para escenas 3D (@remotion/three). Nube sin GPU: swangle. PC Windows con GPU: angle.
const GL = ["swangle", "angle", "egl", "swiftshader", "vulkan", "angle-egl"] as const;
const gl = process.env.REMOTION_GL;
if (gl && (GL as readonly string[]).includes(gl)) Config.setChromiumOpenGlRenderer(gl as (typeof GL)[number]);

// Concurrencia de render: número de pestañas ("8") o porcentaje de núcleos ("50%").
const conc = process.env.REMOTION_CONCURRENCY;
if (conc) Config.setConcurrency(/^\d+%$/.test(conc) ? conc : Number(conc));
