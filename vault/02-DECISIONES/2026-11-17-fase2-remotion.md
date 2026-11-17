---
tipo: decision
fecha: 2026-11-17
fase: 2
estado: vigente
marca: global
---
# Fase 2 — Instalación del motor Remotion

## Decisiones
- Stack en `engine/`: Remotion 4.0.544 (versión fija), React 19, TypeScript 5.9,
  Tailwind CSS v4, Zod 4, Vite 8.
- **Vite solo previsualiza** (`npm run dev`, con `@remotion/player`). Remotion no
  renderiza con Vite: el render final usa su CLI con webpack (`npm run render`),
  con Tailwind activado por `@remotion/tailwind-v4`.
- `Root.tsx`: composición `BaseVertical` a 30 fps, 1080x1920, 150 frames, con
  esquema Zod. Es neutra: la identidad de marca llega por props.
- Navegador de render: en la nube `remotion.media` está bloqueado; se usa
  `REMOTION_BROWSER_EXECUTABLE` (p. ej. el Chromium preinstalado).

## Verificación
- `npm --prefix engine install` → 282 paquetes.
- `tsc --noEmit` OK · `vite build` OK.
- `remotion compositions` → `BaseVertical 30 1080x1920 150 (5.00 sec)`.
- `remotion still … --frame=60` → PNG 1080x1920 correcto (salida en `engine/out/`,
  no versionada).

## Seguridad
- Permisos abiertos temporalmente (allow `npm --prefix engine install`, sin deny
  de `git push`) y **restaurados** al terminar: `.claude/settings.json` vuelve a
  denegar `git push` y `npm install`, sin regla allow.
