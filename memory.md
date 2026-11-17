# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- FASE 1 — Arnés Cognitivo Multi-Marca → SUPERADA (2026-11-17)
- FASE 2 — Motor Remotion en `engine/` → SUPERADA (render verificado)
- KUTT: sistema base + Video A Insignia (`engine/src/components/kutt/`) → OK
- Nombre canónico del repo: `mi-mundo-engine`. Push a `claude/quirky-carson-xe955h` aprobado.

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
  - `2026-11-17-renombrado-repo.md` — nombre canónico `mi-mundo-engine`
  - `2026-11-17-fase2-remotion.md` — instalación del motor Remotion
  - `2026-11-17-kutt-sistema-video-a.md` — sistema KUTT y Video A
- Verificador de fase: `scripts/verify-phase1.sh`
- Motor: `engine/` (Root: `engine/src/Root.tsx`, 30 fps, 1080x1920)
- Permisos/denegaciones: `.claude/settings.json`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado                                      |
|---------------------|---------------------------------------------|
| mente-estrategica   | ACTIVA (falta tipografía, ruta logo)        |
| metal-lopez         | ACTIVA (falta voz, tipografía, logo)        |
| kutt                | ACTIVA (falta voz, SVG, color de texto)     |
| vitaly              | ACTIVA (falta tipografía, logo, voz)        |
| nicolas-lopez       | ACTIVA (falta tipografía, logo, voz)        |

## Preguntas abiertas
- Renombrado remoto `Mente.estrategica` → `mi-mundo-engine`: aprobado, pendiente de
  ejecutar en GitHub Settings (ver `2026-11-17-renombrado-repo.md`).
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/` (KUTT: texto `#FFFFFF` provisional).
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
