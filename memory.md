# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- FASE 1 — Arnés Cognitivo Multi-Marca → SUPERADA (2026-11-17)
- FASE 2 — Motor Remotion en `engine/` → SUPERADA (render verificado)
- FASE 3 — Enrutador dinámico + primer render KUTT/OpusCard → SUPERADA
- FASE 4 — Motor JSON-driven + acabado cinematográfico (KUTT) → SUPERADA
- FASE 5 — Text3D Poppins + wireframe + glitch por eventos (Nicolás) → SUPERADA
- 🏁 **ARQUITECTURA DE MI-MUNDO-ENGINE: CERRADA OFICIALMENTE (2026-11-17)**
  Siguiente etapa: producción de contenido (guiones → JSON → render).
- Repo: `Mente.estrategica` (nombre definitivo, no se renombra). Rama: `claude/quirky-carson-xe955h`.

## Decisiones vigentes confirmadas
- Motor Universal: un solo repo para producir, con enrutamiento estricto por
  marca (Mente Estratégica, Metal López, KUTT, Vitaly, Nicolás López).
- FPS por defecto para los motores: 30 fps (prioridad retención Shorts/Reels).
- Entorno: monorepo con la carpeta `/vault` integrada (vault de Obsidian).
- Remotion 4.0.544 + React 19 + Vite 8 + Tailwind v4 + Zod 4 + three/R3F en `engine/`.
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
  - `2026-11-17-config-3d-esteticos.md` — stack 3D, viñeta KUTT, Nicolás #050505
  - `2026-11-17-fase5-motor-3d-glitch.md` — Text3D, wireframe, glitch; cierre
- Verificador de fase: `scripts/verify-phase1.sh`
- Motor: `engine/src/Root.tsx` (entrada CLI, comp. `BrandRouter`, 30 fps, 1080x1920)
- Temas: `engine/src/utils/themeProvider.ts` · Skills: `engine/src/components/skills/`
- JSON: esquema `engine/src/schema.ts` · comp. `MotorJSON` · ejemplos `engine/public/test-*.json`
- 3D: `engine/src/scenes/TextBarrier3D.tsx` · glitch: `engine/src/effects/`
- Permisos/denegaciones: `.claude/settings.json`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado                                      |
|---------------------|---------------------------------------------|
| mente-estrategica   | ACTIVA (falta tipografía, ruta logo)        |
| metal-lopez         | ACTIVA (falta color de texto)               |
| kutt                | ACTIVA (falta color de texto)               |
| vitaly              | ACTIVA (falta color de texto)               |
| nicolas-lopez       | ACTIVA v3 #050505 (falta color de texto)    |
- Logos en `vault/04-MARCAS/assets/` = placeholders vacíos (reemplazar).

## Preguntas abiertas
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/`.
- Fuentes: solo KUTT (Archivo 800) se carga local; Inter/Montserrat/Poppins pendientes.
- CTA de los `test-*.json` = datos dummy (`_TODO`): reemplazar antes de publicar.
- Nicolás: grano 0.07 / viñeta 0.65 del blueprint aún no aprobados.
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
