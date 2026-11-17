---
marca: kutt
nombre: KUTT
estado: ACTIVA
fps: 30
formato_default: 1080x1920
actualizado: 2026-11-17 (v2)
---
# Identidad de marca — KUTT

> Fuente de verdad estética para `kutt`. El agente aplica SOLO lo escrito aquí.
> Campos `NO DEFINIDO`: no inventar; preguntar al usuario si la pieza lo requiere.

## Visual
- Fondo: Deep Slate `#0A1218`
- Acento principal: Glaciar Cyan `#00C4B4`
- Texto / Primario: NO DEFINIDO
- Tipografía: **Archivo ExtraBold (800)** → `engine/public/brands/kutt/fonts/archivo-800-latin.woff2` (OFL)
- Logo: SVG vectorial oficial → `vault/04-MARCAS/assets/kutt-logo.svg` (placeholder vacío)

## Audio
- Voz: ElevenLabs — "Antoni" (registro profesional)

## Dirección de arte (blueprint 2026-11-17)
- Iluminación: radial Cyan centrado (50% 42%) α 0.12 → 0.055 (35%) → transparente (65%).
- Viñeta: radial desde abajo, negro α 0.15 (20%) → 0.75 (100%).
- Film grain: PNG 512×512 monocromo tileable · opacidad 0.055 · `soft-light`.
- Tarjetas: gradiente 145° `#142832` → `#0C171E` · borde Cyan α 0.16 ·
  sombras `0 25px 45px rgba(0,0,0,.42)`, `0 10px 18px rgba(0,0,0,.25)`, glow Cyan α 0.07.
- Dashboard isométrico: perspectiva 1400px · rotateX 55° · rotateY 0° · rotateZ −35°.
  Preset cinematográfico: perspectiva 1100px · 48° / −8° / −25° · translateZ 100px.
- Capas Z: base 0 · card 10 · chart 20 · KPI 30 · badge 45 (px).
- KPI glow: base `0 0 8px α.25, 0 0 20px α.15` · updating `α.65 / α.35 / α.18 (55px)`.
- Tipografía cinética: spring damping 20 · stiffness 170 · mass 0.8; translateY 45→0,
  scale 0.92→1, blur 6→0px, tracking 0.04em→−0.01em, rotación ±1.5°, 4 frames entre palabras.
- Movimiento: "controlled". Glow solo por eventos. Sin aberración cromática ni glitch.

## Motor Remotion preferido
- **OpusCard / Lemo**
- Estilo: dashboards isométricos, UI limpia, scroll fluido.

## Técnico
- FPS: 30 (default del motor) · Formato: 1080x1920 vertical

## Aislamiento
- Rutas propias: `vault/01-GUIONES/kutt/`, `vault/03-METRICAS/kutt/`, `engine/src/brands/kutt/`
- Esta marca no comparte assets, guiones ni copys con ninguna otra.
