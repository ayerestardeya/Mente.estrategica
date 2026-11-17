// Previsualizador Vite con @remotion/player. Marca y skill por query string:
// /?marca=kutt&skill=OpusCard
import "../style.css";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { BrandRouter, brandRouterSchema } from "../BrandRouter";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "../constants";

const q = new URLSearchParams(window.location.search);
const props = brandRouterSchema.parse({
  marca: q.get("marca") ?? "kutt",
  skillTarget: q.get("skill") ?? "OpusCard",
});

createRoot(document.getElementById("root")!).render(
  <div className="flex min-h-screen items-center justify-center">
    <Player
      component={BrandRouter}
      inputProps={props}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      compositionWidth={WIDTH}
      compositionHeight={HEIGHT}
      style={{ height: "90vh", aspectRatio: "9 / 16" }}
      controls
      loop
    />
  </div>
);
