# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- FASE 1 — Arnés Cognitivo Multi-Marca → SUPERADA (2026-11-17)
- FASE 2 — Motor Remotion en `engine/` → SUPERADA (render verificado)
- FASE 3 — Enrutador dinámico + primer render KUTT/OpusCard → SUPERADA
- FASE 4 — Motor JSON-driven + acabado cinematográfico (KUTT) → SUPERADA
- Stack 3D instalado + esqueleto `TextBarrier3D` (Hyperframes) → OK
- Siguiente: FASE 5 (pendiente de definir por el usuario)
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
| nicolas-lopez       | ACTIVA v3 #050505 (falta color de texto)    |
- Logos en `vault/04-MARCAS/assets/` = placeholders vacíos (reemplazar).

## Preguntas abiertas
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/`.
- Fuentes: solo KUTT (Archivo 800) se carga local; Inter/Montserrat/Poppins pendientes.
- 3D: glifos Poppins extruidos, cara wireframe y glitch por eventos (pendiente).
- CTA de `test-kutt-viral.json` = datos dummy (`_TODO`).
- ¿Overrides de FPS/formato por marca (p. ej. 60 fps para algún canal)?
