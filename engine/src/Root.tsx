// Composición raíz: 30 fps, 1080x1920 (vertical Shorts/Reels).
import "./style.css";
import { Composition } from "remotion";
import { BaseVertical, baseVerticalSchema } from "./compositions/BaseVertical";
import { FPS, HEIGHT, WIDTH } from "./constants";
import {
  KUTT_VIDEO_A,
  KuttVideoA_Insignia,
  kuttVideoASchema,
} from "./components/kutt/videos/KuttVideoA_Insignia";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      {/* KUTT — identidad: vault/04-MARCAS/kutt.md */}
      <Composition
        id={KUTT_VIDEO_A.id}
        component={KuttVideoA_Insignia}
        schema={kuttVideoASchema}
        fps={KUTT_VIDEO_A.fps}
        width={KUTT_VIDEO_A.width}
        height={KUTT_VIDEO_A.height}
        durationInFrames={KUTT_VIDEO_A.durationInFrames}
        defaultProps={{ marca: "kutt", subtitulos: [] }}
      />
    </>
  );
};
