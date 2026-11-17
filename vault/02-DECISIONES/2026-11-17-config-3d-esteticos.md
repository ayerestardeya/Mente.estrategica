---
tipo: decision
fecha: 2026-11-17
estado: vigente
marca: global
---
# Configuración 3D y ajustes estéticos (post-Fase 4)

## Ajustes estéticos aprobados por el usuario
- **KUTT** (`kutt`): la viñeta exterior baja de 0.75 a **0.45** para que los KPIs
  se lean. Actualizado en la ficha y en `themeProvider`.
- **Nicolás López** (`nicolas-lopez`): manda el blueprint cinemático.
  - Fondo `#050505` (antes `#010409`).
  - Glitch Rojo `#FF003C` y Cyan `#00DCFF`, solo en eventos.
  - Nuevo campo de tema `glitch` (null en las demás marcas).
- Rutas de assets en las fichas: `engine/src/brands/<slug>/` pasa a
  `engine/public/brands/<slug>/`, que es la ruta real que indica `CLAUDE.md`.

## Stack 3D (autorizado explícitamente)
- Instalado solo en `engine/`: `three` 0.187, `@react-three/fiber` 9.8,
  `@react-three/drei` 10.7, `@remotion/three` **4.0.544** (fijado a la versión
  de Remotion) y `@types/three` (dev), que hace falta para compilar TypeScript.
- Permisos: se abrieron temporalmente (allow `npm --prefix engine install`, sin
  deny de `git push`) y se **restauraron** al terminar. Antes se hizo el push
  de las Fases 3 y 4 (`124376a`).

## Esqueleto 3D — `scenes/TextBarrier3D.tsx` (montado en `Hyperframes`)
- Tres losas `ExtrudeGeometry` con los valores del blueprint §3.3:
  profundidad 25 cm, bisel 2 cm, FOV 40°, cámara 0,0,5 con dolly-in a 3.2 m,
  luz clave ≈5600 K y luces de contorno con los colores de glitch de la marca
  (o su acento si no tiene).
- Reglas §3.5: geometría y material en `useMemo`; cámara y entradas por
  `spring` sobre `useCurrentFrame()`. `ThreeCanvas` usa `frameloop: never`
  al renderizar, así que no hay bucle autónomo.
- Renderizador GL configurable: `REMOTION_GL=swangle` en la nube sin GPU.
- **Pendiente**: sustituir las losas por glifos extruidos en Poppins (hay que
  convertir la fuente a typeface JSON), cara wireframe y glitch por eventos.

## Verificación
- `npx tsc --noEmit` → 0 errores, con el stack 3D instalado.
- `npm run render:test-3d` → h264 1080x1920 · 30/1 fps · 60 frames · exit 0
  (unos 12 s en total, empaquetado incluido, con GL por software).
- Regresiones: `render:test-kutt` y `still:kutt-viral` → exit 0.
- `test-kutt-viral.json`: el CTA lleva `"_TODO": "TODO: Reemplazar con datos de
  producción…"`. JSON no admite comentarios y Zod descarta la clave.
