// Composición raíz y punto de entrada del CLI: 30 fps, 1080x1920.
// Uso: remotion render src/Root.tsx out/x.mp4 --props='{"marca":"kutt","skillTarget":"OpusCard"}'
import "./style.css";
import { Composition, registerRoot } from "remotion";
import { BrandRouter, brandRouterSchema } from "./BrandRouter";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BrandRouter"
      component={BrandRouter}
      schema={brandRouterSchema}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      durationInFrames={DURATION_IN_FRAMES}
      defaultProps={{ marca: "kutt", skillTarget: "OpusCard" }}
    />
  );
};

registerRoot(RemotionRoot);
