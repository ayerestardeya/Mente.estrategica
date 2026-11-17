---
tipo: decision
fecha: 2026-11-17
marca: kutt
estado: vigente
---
# KUTT — sistema base Remotion y Video A: Insignia

## Decisiones
- Todo el código KUTT vive en `engine/src/components/kutt/` (tokens `theme.ts`,
  `fonts.ts`, `Scene`, `Subtitles`, `EndCard`, `templates/`, `videos/`).
  Fuentes OFL locales en `engine/public/kutt/fonts/` (render determinista, sin red).
- Única edición fuera de la carpeta KUTT: registrar la composición en `engine/src/Root.tsx`.
- Id de composición: `KuttVideoA-Insignia` (Remotion no admite `_` en ids);
  el componente se llama `KuttVideoA_Insignia`.
- Línea de tiempo (frames @30): gancho 0–60, chips 60–270, cuaderno 270–420,
  ScreenDemo 420–720 (zoom in desde 450), EndCard 720–900 (3 s de animación + pausa final).
  Fundido cruzado de 12 frames entre escenas.
- Zona segura: top 220, bottom 420, left 72, right 150 px.
- Color de texto PROVISIONAL `#FFFFFF` (kutt.md: "Texto / Primario" NO DEFINIDO).

## Verificación
- `npm run typecheck` OK · `npm run build` OK.
- `remotion render … KuttVideoA-Insignia --frames=0-29` → MP4 1080x1920, 30 fps, 30 frames.
