// Composición raíz y punto de entrada del CLI: 30 fps, 1080x1920.
//  - BrandRouter (Fase 3): --props='{"marca":"kutt","skillTarget":"OpusCard"}'
//  - MotorJSON   (Fase 4): --props=public/<archivo>.json  (esquema en schema.ts)
import "./style.css";
import { Composition, registerRoot } from "remotion";
import { BrandRouter, brandRouterSchema } from "./BrandRouter";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./constants";
import { MotorJSON } from "./MotorJSON";
import { engineSchema } from "./schema";
import testKutt from "../public/test-kutt-viral.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      <Composition
        id="MotorJSON"
        component={MotorJSON}
        schema={engineSchema}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        durationInFrames={DURATION_IN_FRAMES}
        defaultProps={engineSchema.parse(testKutt)}
        calculateMetadata={({ props }) => {
          // Validación fatal: un JSON inválido aborta el render (Remotion por sí solo solo avisa).
          const r = engineSchema.safeParse(props);
          if (!r.success) {
            const detalle = r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
            throw new Error(`JSON del motor inválido → ${detalle}`);
          }
          return { durationInFrames: r.data.duracion_frames };
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
