// Vite sirve el previsualizador (@remotion/player). El render final usa el CLI de Remotion.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: "out/preview" },
});
