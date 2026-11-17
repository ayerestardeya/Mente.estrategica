---
tipo: decision
fecha: 2026-11-17
fase: 5
estado: vigente
marca: nicolas-lopez
---
# Fase 5 — Motor 3D y glitch visual (Nicolás López) · Cierre de arquitectura

## Decisiones
- **Texto 3D en Poppins**: `<Text3D>` de drei con
  `engine/public/brands/nicolas-lopez/fonts/poppins-700.typeface.json`.
  - three no trae conversor propio (su TTFLoader descarga opentype.js de un CDN)
    y no hay fontTools. Por eso se escribió `engine/scripts/ttf-to-typeface.py`
    (Python estándar, sin dependencias): glifos simples y compuestos
    (Í = I + acento), ASCII + Latin-1, 190 glifos, 65 KB. Reutilizable por
    cualquier marca.
  - La fuente se carga con `staticFile` + Suspense: `ThreeCanvas` retiene el
    render hasta que está lista.
  - El texto se reparte en líneas de ≤10 caracteres (formato 9:16) y cada
    línea entra con resorte elástico escalonado.
  - Extrusión 18 cm, bisel 1,2 cm, espaciado de letras 1,2 cm.
  - Respaldo: una marca sin typeface sigue viendo las losas extruidas.
- **Wireframe**: cabeza elipsoidal (`SphereGeometry` escalada) con piel
  `#777777` (blueprint §3.4) y una malla `meshBasicMaterial wireframe` en el
  Cyan de glitch. Se revela **de golpe** en el primer `pattern_interrupt_event`
  (corte + rebote elástico) y la piel pasa de α .9 a .18.
- **Glitch** (`engine/src/effects/`): CSS estándar fuera del lienzo y solo en los
  eventos, 2–5 frames cada uno. `random(seed)` de Remotion lo hace determinista.
  - Lienzo 3D: `clip-path: inset()`, translateX ±4–12 px,
    `drop-shadow` Rojo/Cyan 3–5 px y blur 0–3 px.
  - Texto HTML (`GlitchText`): 2–5 rebanadas recortadas en Rojo `#FF003C` /
    Cyan `#00DCFF` más `text-shadow` desfasado.
  - Si la marca no tiene `glitch` en la ficha, no hay efecto.
- **Esquema**: `kpis` y `serie` pasan a ser opcionales, pero siguen siendo
  obligatorios si `skillTarget` es `OpusCard` (validado en `superRefine`).
- **HTML de Nicolás** en Poppins 700 local (`fontFile`).
- `test-nicolas-hyperframes.json` con su CTA marcado `_TODO`, igual que el de KUTT.

## Verificación
- `npx tsc --noEmit` → 0 errores.
- `npm run render:nicolas-hyperframes` → h264 1080x1920 · 30/1 fps · 210
  frames · 7.0 s · exit 0 (49 s con GL por software).
- Fotogramas revisados: 32 (texto sobre piel), 41 (interrupt: wireframe +
  glitch), 75 (wireframe revelado), 185 (CTA).
- Regresiones: `render:test-3d`, `render:test-kutt`, `render:kutt-viral` → exit 0.

## Cierre
Se da por cerrada la arquitectura del motor: enrutador multi-marca, motor
JSON-driven, acabado cinematográfico 2D (KUTT) y 3D (Nicolás López). Los
siguientes pasos son de producción de contenido, no de arquitectura.
