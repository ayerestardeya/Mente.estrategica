# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- Fase activa: **FASE 1 — Arnés Cognitivo Multi-Marca** → SUPERADA (2026-11-17)
- Siguiente fase: FASE 2 (pendiente de definir por el usuario)
- Remoto: sin push. Commit local inicial únicamente.

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
- Verificador de fase: `scripts/verify-phase1.sh`
- Permisos/denegaciones: `.claude/settings.json`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado     |
|---------------------|------------|
| mente-estrategica   | PENDIENTE  |
| metal-lopez         | PENDIENTE  |
| kutt                | PENDIENTE  |
| vitaly              | PENDIENTE  |
| nicolas-lopez       | PENDIENTE  |

## Preguntas abiertas
- El repo remoto se llama `Mente.estrategica`; ¿renombrar a `mi-mundo-engine`?
- Completar paleta, tipografías, voz y logo de cada marca.
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
