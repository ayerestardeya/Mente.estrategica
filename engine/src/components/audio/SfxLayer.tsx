// Audio dirigido por JSON. Solo suena lo que exista en engine/public/sfx|music
// (los binarios no se versionan). Sin archivos, la capa no emite nada.
import { Audio, getStaticFiles, Sequence, staticFile } from "remotion";
import type { AudioData } from "../../schema";

const buscar = (base: string): string | null => {
  const f = getStaticFiles().find((s) => s.name === `${base}.wav` || s.name === `${base}.mp3`);
  return f ? f.name : null;
};

export const SfxLayer: React.FC<{ audio: AudioData }> = ({ audio }) => {
  const musica = buscar(`music/${audio.music_mood}`);
  return (
    <>
      {musica && <Audio src={staticFile(musica)} volume={0.35} />}
      {audio.sfx_events.map((ev, i) => {
        const archivo = buscar(`sfx/${ev.type}`);
        return archivo ? (
          <Sequence key={i} from={ev.frame} layout="none">
            <Audio src={staticFile(archivo)} />
          </Sequence>
        ) : null;
      })}
    </>
  );
};
