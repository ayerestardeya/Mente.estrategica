// Capa de conversión: entra en cta_trigger_time con escalonado de 6 frames.
import { AbsoluteFill } from "remotion";
import type { CtaData } from "../../schema";
import type { BrandTheme } from "../../utils/themeProvider";
import { Z } from "../cinematic/layers";
import { ConversionCard } from "./ConversionCard";
import { ProfileDirection } from "./ProfileDirection";
import { ProgressUrgency } from "./ProgressUrgency";

export const CtaLayer: React.FC<{ theme: BrandTheme; cta: CtaData; inicio: number }> = ({ theme, cta, inicio }) => (
  <AbsoluteFill style={{ zIndex: Z.hud, pointerEvents: "none" }}>
    <ConversionCard theme={theme} cta={cta} inicio={inicio} />
    <ProgressUrgency theme={theme} cta={cta} inicio={inicio + 6} />
    <ProfileDirection theme={theme} cta={cta} inicio={inicio + 12} />
  </AbsoluteFill>
);
