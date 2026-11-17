// Contenedor de escena KUTT: Sequence + fundido cruzado de entrada/salida.
// Todo el movimiento se calcula con interpolate (sin CSS transitions).
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";

type SceneProps = {
  from: number;
  durationInFrames: number;
  /** Frames de fundido de entrada (0 = corte seco). */
  fadeIn?: number;
  /** Frames de fundido de salida (0 = sin salida). */
  fadeOut?: number;
  name?: string;
  children: React.ReactNode;
};

const SceneBody: React.FC<Omit<SceneProps, "from" | "name">> = ({
  durationInFrames,
  fadeIn = 0,
  fadeOut = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.33, 0, 0.2, 1);
  const inP = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }) : 1;
  const outP =
    fadeOut > 0
      ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        })
      : 1;
  const y = (1 - inP) * 40 + (1 - outP) * -40;
  const scale = 1 - (1 - inP) * 0.03 + (1 - outP) * 0.03;

  return (
    <AbsoluteFill style={{ opacity: inP * outP, transform: `translateY(${y}px) scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<SceneProps> = ({ from, name, ...rest }) => (
  <Sequence from={from} durationInFrames={rest.durationInFrames} name={name} layout="none">
    <SceneBody {...rest} />
  </Sequence>
);
