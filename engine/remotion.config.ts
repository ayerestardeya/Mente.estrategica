// Configuración del CLI de Remotion (studio/render). Tailwind v4 vía webpack.
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => enableTailwind(config));

// Si la red bloquea la descarga de Chrome (remotion.media), usar un navegador local.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browser) Config.setBrowserExecutable(browser);

// Renderizador OpenGL para escenas 3D (@remotion/three). En la nube sin GPU: swangle.
const GL = ["swangle", "angle", "egl", "swiftshader", "vulkan", "angle-egl"] as const;
const gl = process.env.REMOTION_GL;
if (gl && (GL as readonly string[]).includes(gl)) Config.setChromiumOpenGlRenderer(gl as (typeof GL)[number]);
