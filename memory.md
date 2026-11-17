# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- FASE 1 — Arnés Cognitivo Multi-Marca → SUPERADA (2026-11-17)
- FASE 2 — Motor Remotion en `engine/` → SUPERADA (render verificado)
- FASE 3 — Enrutador dinámico + primer render KUTT/OpusCard → SUPERADA
- FASE 4 — Motor JSON-driven + acabado cinematográfico (KUTT) → SUPERADA
- Siguiente: FASE 5 (pendiente; ver preguntas abiertas: 3D y perfil Nicolás)
- Repo: `Mente.estrategica` (nombre definitivo, no se renombra). Rama: `claude/quirky-carson-xe955h`.

## Decisiones vigentes confirmadas
- Motor Universal: un solo repo para producir, con enrutamiento estricto por
  marca (Mente Estratégica, Metal López, KUTT, Vitaly, Nicolás López).
- FPS por defecto para los motores: 30 fps (prioridad retención Shorts/Reels).
- Entorno: monorepo con la carpeta `/vault` integrada (vault de Obsidian).
- Remotion 4.0.544 + React 19 + Vite 8 + Tailwind v4 + Zod 4 en `engine/`.
  whisper, Kokoro: NO instalados. `npm install` vuelve a estar bloqueado.
- MCP / n8n: NO conectados (faltan credenciales de la nube).

## Punteros
- Reglas del agente: `CLAUDE.md`
- Identidades de marca: `vault/04-MARCAS/<slug>.md`
- Decisiones fechadas: `vault/02-DECISIONES/`
  - `2026-11-17-fase1-init.md` — inicialización Fase 1
  - `2026-11-17-nombre-repo.md` — se conserva `Mente.estrategica`
  - `2026-11-17-fase2-remotion.md` — instalación del motor Remotion
  - `2026-11-17-fase3-kutt.md` — enrutador, temas, skills, render KUTT
  - `2026-11-17-fase4-json-cinematico.md` — esquema JSON, cinemática, CTA
- Verificador de fase: `scripts/verify-phase1.sh`
- Motor: `engine/src/Root.tsx` (entrada CLI, comp. `BrandRouter`, 30 fps, 1080x1920)
- Temas: `engine/src/utils/themeProvider.ts` · Skills: `engine/src/components/skills/`
- JSON: esquema `engine/src/schema.ts` · comp. `MotorJSON` · ejemplo `engine/public/test-kutt-viral.json`
- Permisos/denegaciones: `.claude/settings.json`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado                                      |
|---------------------|---------------------------------------------|
| mente-estrategica   | ACTIVA (falta tipografía, ruta logo)        |
| metal-lopez         | ACTIVA (falta color de texto)               |
| kutt                | ACTIVA (falta color de texto)               |
| vitaly              | ACTIVA (falta color de texto)               |
| nicolas-lopez       | ACTIVA (falta color de texto)               |
- Logos en `vault/04-MARCAS/assets/` = placeholders vacíos (reemplazar).

## Preguntas abiertas
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/`.
- Fuentes: solo KUTT (Archivo 800) se carga local; Inter/Montserrat/Poppins pendientes.
- ¿Autorizar stack 3D (three, R3F, @remotion/three)? Requiere npm install.
- Perfil Nicolás del blueprint choca con su ficha (#050505 vs #010409, glitch RGB).
- Viñeta KUTT: CSS literal 0.75 vs tabla 0.45 (KPIs quedan oscuros).
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
