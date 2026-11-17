// Grano global: PNG 512x512 tileable en soft-light. Se usa <Img> (no background-image)
// para que Remotion espere a la carga de la textura antes de capturar cada frame.
import { AbsoluteFill, Img, staticFile } from "remotion";
import { HEIGHT, WIDTH } from "../../constants";
import { Z } from "./layers";

const TILE = 512;
const COLS = Math.ceil(WIDTH / TILE);
const ROWS = Math.ceil(HEIGHT / TILE);
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => i);

export const FilmGrain: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ zIndex: Z.grano, pointerEvents: "none", opacity, mixBlendMode: "soft-light" }}>
    {TILES.map((i) => (
      <Img
        key={i}
        src={staticFile("textures/film-grain.png")}
        style={{
          position: "absolute",
          left: (i % COLS) * TILE,
          top: Math.floor(i / COLS) * TILE,
          width: TILE,
          height: TILE,
        }}
      />
    ))}
  </AbsoluteFill>
);
