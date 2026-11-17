---
tipo: decision
fecha: 2026-11-17
fase: 4
estado: vigente
marca: kutt
---
# Fase 4 — Motor JSON-driven y acabado cinematográfico (KUTT)

## Decisiones
- **El Cerebro (`engine/src/schema.ts`)**: el JSON dicta marca, skill, duración,
  `visual` (shot_type, camera_zoom_speed, motion_intensity,
  pattern_interrupt_events, visual_change_interval, cta_trigger_time), `audio`
  (sfx_events impact/whoosh/ui_click, music_mood), `contenido` (hook, KPIs,
  serie, badge) y `cta`. Todo se mide en frames a 30 fps.
- **Validación fatal**: `calculateMetadata` vuelve a validar el JSON. Uno inválido
  (enum desconocido o evento ≥ duracion_frames) aborta con exit 1. Por sí solo,
  Remotion se limitaba a avisar y renderizaba igual.
- **Dos composiciones**: `BrandRouter` (Fase 3, intacta; `render:test-kutt`
  sigue funcionando) y `MotorJSON` (Fase 4; `--props=public/<archivo>.json`).
- **Solo resortes**: `motion/springs.ts` contiene los presets del blueprint
  (soft, standard, heavy, elastic), `CTA_SPRING` (damping 12) y `pulse()`
  (ataque y caída por resorte) para los eventos. Ya no hay ninguna
  interpolación lineal del tiempo: los esqueletos de la Fase 3 también usan resorte.
- **Dirección de arte KUTT** cargada en la ficha del vault y en `themeProvider`
  (`cinematic`):
  - Luz Cyan 0.12/0.055 y viñeta 0.15/0.75 (CSS literal).
  - Grano PNG 512² en soft-light a 0.055, cargado con `<Img>` para que el
    render espere a la textura.
  - Tarjetas con gradiente #142832→#0C171E y las sombras del blueprint.
  - Isométrico 1400px · 55/0/−35; preset `cinematic` 1100px · 48/−8/−25 · Z100.
  - Capas Z 0/10/20/30/45 y glow de KPI base/updating por evento.
  - Tipografía cinética: damping 20/170/0.8, Y 45→0, escala 0.92→1, blur 6→0,
    tracking 0.04→−0.01em, ±1.5°, 4 frames entre palabras.
- **Fuente**: Archivo 800 (OFL) local en `engine/public/brands/kutt/fonts/`,
  cargada con FontFace + delayRender. Así el render no depende de la red.
- **Capas**: la escena va debajo de la luz/viñeta; HUD (titular, CTA) a z 95,
  encima de la luz; el grano va por encima de todo (z 100). Así el titular no
  se oscurece con la viñeta.
- **CTA** (`components/cta/`): ConversionCard, ProgressUrgency y
  ProfileDirection entran escalonadas cada 6 frames desde `cta_trigger_time`,
  todas con `spring({ fps: 30, frame, config: { damping: 12 } })`. El dashboard
  retrocede con resorte pesado para dejarles sitio.
- **Audio**: `SfxLayer` solo reproduce lo que exista en `public/sfx|music`; los
  binarios no se versionan. Los SFX también mueven la imagen: impact → shake de
  cámara, ui_click → pulso de borde.

## Verificación
- `npx tsc --noEmit` → 0 errores.
- `npm run still:kutt-viral -- --frame=47` → PNG correcto, exit 0.
- `npm run render:kutt-viral` → h264 1080x1920 30 fps, 240 frames, 8.0 s.
- `npm run render:test-kutt` (regresión Fase 3) → exit 0.
- Grano medido: variación píxel a píxel en zonas planas (24–55 % de píxeles).
- JSON inválido → exit 1 con mensaje legible.

## No implementado (requiere decisión del usuario)
- **Stack 3D** (three, @react-three/fiber, drei, @remotion/three): requiere
  `npm install`. Bloqueado hasta tener autorización explícita.
- **Perfil Nicolás** del blueprint: contradice su ficha (#050505 frente a #010409;
  glitch #FF003C/#00DCFF fuera de su paleta). Manda el vault: hay que confirmarlo.
- **Viñeta KUTT**: el CSS dice 0.75 y la tabla 0.45. Se aplicó el CSS literal;
  los KPIs quedan algo oscuros.
