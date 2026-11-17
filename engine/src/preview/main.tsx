// Previsualizador Vite con @remotion/player (mismos parámetros que Root.tsx).
import "../style.css";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { BaseVertical } from "../compositions/BaseVertical";
import { FPS, HEIGHT, WIDTH } from "../constants";

createRoot(document.getElementById("root")!).render(
  <div className="flex min-h-screen items-center justify-center">
    <Player
      component={BaseVertical}
      inputProps={{ marca: "mente-estrategica", titulo: "mi-mundo-engine", fondo: "#111111", texto: "#EEEEEE", acento: "#888888" }}
      durationInFrames={FPS * 5}
      fps={FPS}
      compositionWidth={WIDTH}
      compositionHeight={HEIGHT}
      style={{ height: "90vh", aspectRatio: "9 / 16" }}
      controls
      loop
    />
  </div>
);
