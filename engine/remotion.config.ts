// Configuración del CLI de Remotion (studio/render). Tailwind v4 vía webpack.
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig((config) => enableTailwind(config));

// Si la red bloquea la descarga de Chrome (remotion.media), usar un navegador local.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browser) Config.setBrowserExecutable(browser);
