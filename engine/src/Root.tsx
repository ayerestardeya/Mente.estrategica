// Composición raíz: 30 fps, 1080x1920 (vertical Shorts/Reels).
import "./style.css";
import { Composition } from "remotion";
import { BaseVertical, baseVerticalSchema } from "./compositions/BaseVertical";
import { FPS, HEIGHT, WIDTH } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BaseVertical"
      component={BaseVertical}
      schema={baseVerticalSchema}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      durationInFrames={FPS * 5}
      // Valores neutros de prueba (no son de ninguna marca). Para producir,
      // cargar los colores desde vault/04-MARCAS/<slug>.md.
      defaultProps={{
        marca: "mente-estrategica",
        titulo: "mi-mundo-engine",
        fondo: "#111111",
        texto: "#EEEEEE",
        acento: "#888888",
      }}
    />
  );
};
