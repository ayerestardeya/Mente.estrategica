// Barrera de texto 3D (blueprint §3.3) + máscara wireframe (§3.4).
// - Texto: <Text3D> de drei con la typeface.json de la marca (theme.typeface3d).
//   Si la marca no tiene typeface, se usan losas extruidas (respaldo).
// - Wireframe: cabeza elipsoidal con piel oscura + malla alámbrica superpuesta;
//   la malla se revela de golpe en el primer pattern interrupt y la piel se apaga.
//
// Reglas de render (blueprint §3.5): todo depende de useCurrentFrame() + spring;
// geometrías y materiales en useMemo (nunca dentro del ciclo de render); sin
// requestAnimationFrame ni bucle autónomo (ThreeCanvas usa frameloop "never").
import { useMemo } from "react";
import { Center, PerspectiveCamera, Text3D } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { SPRINGS } from "../motion/springs";
import { textColor, type BrandTheme } from "../utils/themeProvider";

/** Parámetros físicos del blueprint (unidades en metros). */
const BARRERA = {
  profundidad: 0.18, // extrude depth 18–35 cm
  bisel: 0.012, // bevel size 1–3 cm
  fov: 40, // 35–45°
  camaraInicio: 5, // posición 0, 0, 5
  camaraFin: 3.4, // distancia al sujeto 2.5–4 m
  luzClave: "#FFF1E0", // ≈ 5600 K (valor técnico, no de marca)
} as const;

/** Material de piel del blueprint §3.4 (valor técnico neutro). */
const PIEL = { color: "#777777", roughness: 0.65, metalness: 0.05 } as const;

const TAM_TEXTO = 0.2;
const INTERLINEA = 0.3;
const MAX_CHARS_LINEA = 10;

/** Reparte el texto en líneas cortas (formato vertical 9:16). */
export function partirLineas(texto: string): string[] {
  const lineas: string[] = [];
  let actual = "";
  for (const p of texto.trim().split(/\s+/)) {
    if (actual && (actual + " " + p).length > MAX_CHARS_LINEA) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = actual ? `${actual} ${p}` : p;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

// Respaldo sin typeface: losas redondeadas.
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

interface Props {
  theme: BrandTheme;
  texto: string;
  /** Pattern interrupts: el primero revela el wireframe. */
  interrupts: readonly number[];
}

export const TextBarrier3D: React.FC<Props> = ({ theme, texto, interrupts }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const lineas = useMemo(() => partirLineas(texto), [texto]);

  // Recursos cacheados.
  const materialTexto = useMemo(
    () => new THREE.MeshStandardMaterial({ color: textColor(theme), roughness: 0.42, metalness: 0.08 }),
    [theme],
  );
  const cabeza = useMemo(() => new THREE.SphereGeometry(1, 36, 24), []);
  const piel = useMemo(() => new THREE.MeshStandardMaterial({ ...PIEL, transparent: true }), []);
  const alambre = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: theme.glitch?.cyan ?? theme.acento,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    [theme],
  );
  const losas = useMemo(
    () =>
      lineas.map(
        (l) =>
          new THREE.ExtrudeGeometry(losa(Math.min(1.25, 0.12 * l.length), 0.3, 0.06), {
            depth: BARRERA.profundidad,
            bevelEnabled: true,
            bevelSize: BARRERA.bisel,
            bevelThickness: BARRERA.bisel,
            bevelSegments: 3,
          }).center(),
      ),
    [lineas],
  );

  const rimA = theme.glitch?.cyan ?? theme.acento;
  const rimB = theme.glitch?.rojo ?? theme.acentoSecundario ?? theme.acento;

  // Cámara: dolly-in 0→100 % (resorte pesado estirado a la duración).
  const dolly = spring({ frame, fps, config: SPRINGS.heavy, durationInFrames });
  const z = interpolate(dolly, [0, 1], [BARRERA.camaraInicio, BARRERA.camaraFin]);

  // Wireframe: aparece de golpe en el primer interrupt (corte + rebote elástico).
  const revela = interrupts[0];
  const visible = revela !== undefined && frame >= revela;
  const pop = visible ? spring({ frame: frame - revela, fps, config: SPRINGS.elastic }) : 0;
  // Transición piel → wireframe (blueprint §3.4.6).
  materialesOpacidad(piel, alambre, visible ? pop : 0);

  const giro = interpolate(dolly, [0, 1], [-0.5, 0.45]);
  const y0 = ((lineas.length - 1) * INTERLINEA) / 2;

  return (
    <ThreeCanvas width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      <PerspectiveCamera makeDefault fov={BARRERA.fov} position={[0, 0, z]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[1.5, 2.5, 4]} intensity={1.6} color={BARRERA.luzClave} />
      <pointLight position={[-3, 0.5, -1.5]} intensity={22} distance={9} color={rimA} />
      <pointLight position={[3, -0.5, -1.5]} intensity={22} distance={9} color={rimB} />

      {/* Máscara: piel oscura + malla alámbrica superpuesta (detrás del texto). */}
      <group position={[0, 0.05, -1.6]} rotation={[0.08, giro, 0]} scale={[0.78, 1.02, 0.86]}>
        <mesh geometry={cabeza} material={piel} />
        <mesh geometry={cabeza} material={alambre} scale={visible ? interpolate(pop, [0, 1], [1.25, 1.003]) : 0} />
      </group>

      {lineas.map((linea, i) => {
        // Cada línea "golpea" su sitio con resorte elástico, escalonada.
        const p = spring({ frame: frame - 6 - i * 5, fps, config: SPRINGS.elastic });
        const lado = i % 2 === 0 ? -1 : 1;
        const pos: [number, number, number] = [
          interpolate(p, [0, 1], [lado * 3.5, 0]),
          y0 - i * INTERLINEA,
          interpolate(p, [0, 1], [-2, 0]),
        ];
        const rot: [number, number, number] = [
          interpolate(p, [0, 1], [0.6, -0.1]),
          interpolate(p, [0, 1], [lado * -0.9, lado * -0.12]),
          lado * 0.03,
        ];
        return theme.typeface3d ? (
          <group key={i} position={pos} rotation={rot}>
            <Center>
              <Text3D
                font={staticFile(theme.typeface3d)}
                size={TAM_TEXTO}
                height={BARRERA.profundidad}
                curveSegments={8}
                bevelEnabled
                bevelSize={BARRERA.bisel}
                bevelThickness={BARRERA.bisel}
                bevelSegments={3}
                letterSpacing={0.012}
                material={materialTexto}
              >
                {linea}
              </Text3D>
            </Center>
          </group>
        ) : (
          <mesh key={i} geometry={losas[i]} material={materialTexto} position={pos} rotation={rot} />
        );
      })}
    </ThreeCanvas>
  );
};

/** Ajusta la opacidad piel/alambre según el progreso de la revelación (0..1). */
function materialesOpacidad(piel: THREE.MeshStandardMaterial, alambre: THREE.MeshBasicMaterial, p: number) {
  const t = Math.min(1, Math.max(0, p));
  piel.opacity = interpolate(t, [0, 1], [0.9, 0.18]);
  alambre.opacity = interpolate(t, [0, 1], [0, 0.85]);
}
