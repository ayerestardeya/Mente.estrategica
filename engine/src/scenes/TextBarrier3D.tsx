// Barrera 3D (blueprint §3.3) — ESQUELETO de comprobación del stack WebGL.
// Losas extruidas (ExtrudeGeometry) que cruzan el plano y una cámara en dolly-in.
// TODO Fase 5: sustituir las losas por glifos extruidos con la tipografía de la
// marca (requiere convertir Poppins a typeface JSON y guardarla en
// engine/public/brands/<slug>/fonts/).
//
// Reglas de render (blueprint §3.5): todo depende de useCurrentFrame() + spring;
// la geometría y los materiales se crean una sola vez (useMemo) y nunca dentro
// del ciclo de render; no hay requestAnimationFrame ni bucle autónomo.
import { useMemo } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { SPRINGS } from "../motion/springs";
import { textColor, type BrandTheme } from "../utils/themeProvider";

/** Parámetros físicos del blueprint (unidades en metros). */
const BARRERA = {
  profundidad: 0.25, // extrude depth 18–35 cm
  bisel: 0.02, // bevel size 1–3 cm
  fov: 40, // 35–45°
  camaraInicio: 5, // posición 0, 0, 5
  camaraFin: 3.2, // distancia al sujeto 2.5–4 m
  luzClave: "#FFF1E0", // ≈ 5600 K (valor técnico, no de marca)
} as const;

// Dimensionadas para 9:16: con FOV 40° a 3.2 m el encuadre mide ≈1.3 × 2.3 m.
const LOSAS = [
  { y: 0.44, ancho: 1.05, rotZ: -0.06 },
  { y: 0, ancho: 1.25, rotZ: 0.04 },
  { y: -0.44, ancho: 0.9, rotZ: -0.03 },
] as const;
const ALTO_LOSA = 0.3;

function losa(ancho: number, alto: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -ancho / 2;
  const y = -alto / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + ancho - r, y);
  s.quadraticCurveTo(x + ancho, y, x + ancho, y + r);
  s.lineTo(x + ancho, y + alto - r);
  s.quadraticCurveTo(x + ancho, y + alto, x + ancho - r, y + alto);
  s.lineTo(x + r, y + alto);
  s.quadraticCurveTo(x, y + alto, x, y + alto - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export const TextBarrier3D: React.FC<{ theme: BrandTheme }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Recursos cacheados: se crean una vez por marca.
  const geometrias = useMemo(
    () =>
      LOSAS.map(
        (l) =>
          new THREE.ExtrudeGeometry(losa(l.ancho, ALTO_LOSA, 0.06), {
            depth: BARRERA.profundidad,
            bevelEnabled: true,
            bevelSize: BARRERA.bisel,
            bevelThickness: BARRERA.bisel,
            bevelSegments: 3,
          }).center(),
      ),
    [],
  );
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: textColor(theme), roughness: 0.42, metalness: 0.08 }),
    [theme],
  );

  const rimA = theme.glitch?.cyan ?? theme.acento;
  const rimB = theme.glitch?.rojo ?? theme.acentoSecundario ?? theme.acento;

  // Cámara: dolly-in 0→100 % con resorte pesado estirado a la duración.
  const dolly = spring({ frame, fps, config: SPRINGS.heavy, durationInFrames });
  const z = interpolate(dolly, [0, 1], [BARRERA.camaraInicio, BARRERA.camaraFin]);

  return (
    <ThreeCanvas width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <PerspectiveCamera makeDefault fov={BARRERA.fov} position={[0, 0, z]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[1.5, 2.5, 4]} intensity={1.6} color={BARRERA.luzClave} />
      <pointLight position={[-3, 0.5, -1.5]} intensity={22} distance={9} color={rimA} />
      <pointLight position={[3, -0.5, -1.5]} intensity={22} distance={9} color={rimB} />
      {LOSAS.map((l, i) => {
        // Entrada escalonada con resorte elástico: cada losa "golpea" su sitio.
        const p = spring({ frame: frame - 6 - i * 5, fps, config: SPRINGS.elastic });
        return (
          <mesh
            key={i}
            geometry={geometrias[i]}
            material={material}
            position={[interpolate(p, [0, 1], [i % 2 === 0 ? -4 : 4, 0]), l.y, interpolate(p, [0, 1], [-2, 0])]}
            rotation={[interpolate(p, [0, 1], [0.6, -0.12]), interpolate(p, [0, 1], [i % 2 === 0 ? 0.9 : -0.9, 0.18]), l.rotZ]}
          />
        );
      })}
    </ThreeCanvas>
  );
};
