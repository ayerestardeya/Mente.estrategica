# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- Fase activa: **FASE 1 — Arnés Cognitivo Multi-Marca** → SUPERADA (2026-11-17)
- Siguiente fase: FASE 2 (pendiente de definir por el usuario)
- Nombre canónico del repo: `mi-mundo-engine`. Push a `claude/quirky-carson-xe955h` aprobado.

## Decisiones vigentes confirmadas
- Motor Universal: un solo repo para producir, con enrutamiento estricto por
  marca (Mente Estratégica, Metal López, KUTT, Vitaly, Nicolás López).
- FPS por defecto para los motores: 30 fps (prioridad retención Shorts/Reels).
- Entorno: monorepo con la carpeta `/vault` integrada (vault de Obsidian).
- Dependencias de producción (Remotion, whisper, Kokoro…): NO instaladas aún.
- MCP / n8n: NO conectados (faltan credenciales de la nube).

## Punteros
- Reglas del agente: `CLAUDE.md`
- Identidades de marca: `vault/04-MARCAS/<slug>.md`
- Decisiones fechadas: `vault/02-DECISIONES/`
  - `2026-11-17-fase1-init.md` — inicialización Fase 1
  - `2026-11-17-renombrado-repo.md` — nombre canónico `mi-mundo-engine`
- Verificador de fase: `scripts/verify-phase1.sh`
- Permisos/denegaciones: `.claude/settings.json`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado                                      |
|---------------------|---------------------------------------------|
| mente-estrategica   | ACTIVA (falta tipografía, ruta logo)        |
| metal-lopez         | ACTIVA (Coral vs Teal sin regla; voz, tipo) |
| kutt                | ACTIVA (falta voz ElevenLabs, ruta SVG)     |
| vitaly              | ACTIVA (falta tipografía, logo, voz)        |
| nicolas-lopez       | ACTIVA (falta tipografía, logo, voz)        |

## Preguntas abiertas
- Renombrado remoto `Mente.estrategica` → `mi-mundo-engine`: aprobado, pendiente de
  ejecutar en GitHub Settings (ver `2026-11-17-renombrado-repo.md`).
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/`.
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
