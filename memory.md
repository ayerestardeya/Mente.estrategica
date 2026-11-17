# memory.md — Índice evolutivo de Mi Mundo Engine
> Punteros y estado. No guardar contenido largo aquí (máx. 60 líneas).
> Última actualización: 2026-11-17

## Estado actual
- FASES 1–5 SUPERADAS (2026-11-17): arnés multi-marca → Remotion → enrutador →
  motor JSON + cinemática 2D (KUTT) → 3D Text3D + wireframe + glitch (Nicolás).
- 🏁 **ARQUITECTURA DE MI-MUNDO-ENGINE: CERRADA OFICIALMENTE (2026-11-17)**
- 🔀 **MODO HÍBRIDO ACTIVO**: la nube programa; el PC local (Windows + GPU) renderiza.
- Siguiente etapa: producción de contenido (guiones → JSON → render local).
- Repo: `Mente.estrategica` (nombre definitivo). Rama: `claude/quirky-carson-xe955h`.

## Decisiones vigentes confirmadas
- Motor Universal: un solo repo para producir, con enrutamiento estricto por
  marca (Mente Estratégica, Metal López, KUTT, Vitaly, Nicolás López).
- FPS por defecto para los motores: 30 fps (prioridad retención Shorts/Reels).
- Entorno: monorepo con la carpeta `/vault` integrada (vault de Obsidian).
- Remotion 4.0.544 + React 19 + Vite 8 + Tailwind v4 + Zod 4 + three/R3F en `engine/`.
  whisper, Kokoro: NO instalados. `npm install` y `git push` bloqueados por defecto.
- GL: nube `swangle` (CPU) · PC local `angle` (GPU), vía `engine/.env` (no versionado).
- MCP / n8n: NO conectados (faltan credenciales de la nube).

## Punteros
- Reglas del agente: `CLAUDE.md` · Permisos: `.claude/settings.json`
- Identidades de marca: `vault/04-MARCAS/<slug>.md`
- Decisiones fechadas (`vault/02-DECISIONES/2026-11-17-*`):
  `fase1-init` · `nombre-repo` · `fase2-remotion` · `fase3-kutt` ·
  `fase4-json-cinematico` · `config-3d-esteticos` · `fase5-motor-3d-glitch` ·
  **`estrategia-hibrida`** (guía de clonado, `.env` local y flujo diario)
- Setup local: `setup-local.ps1` (raíz) · plantilla `engine/env.local.example`
- Verificador de fase: `scripts/verify-phase1.sh`
- Motor: `engine/src/Root.tsx` (comps. `BrandRouter` y `MotorJSON`, 30 fps, 1080x1920)
- Temas: `engine/src/utils/themeProvider.ts` · Skills: `engine/src/components/skills/`
- JSON: esquema `engine/src/schema.ts` · ejemplos `engine/public/test-*.json`
- 3D: `engine/src/scenes/TextBarrier3D.tsx` · glitch: `engine/src/effects/`
- Conversor de fuentes 3D: `engine/scripts/ttf-to-typeface.py`
- Entorno dev: `.devcontainer/devcontainer.json` (Node 20, Python 3.11, ffmpeg)

## Estado de identidades de marca
| Slug                | Estado                                          |
|---------------------|-------------------------------------------------|
| mente-estrategica   | ACTIVA (falta tipografía, ruta logo)            |
| metal-lopez         | ACTIVA (falta color de texto)                   |
| kutt                | ACTIVA · cinemático (falta color de texto)      |
| vitaly              | ACTIVA (falta color de texto)                   |
| nicolas-lopez       | ACTIVA v4 · grano 0.07 / viñeta 0.65 (falta texto) |
- Logos en `vault/04-MARCAS/assets/` = placeholders vacíos (reemplazar).

## Preguntas abiertas
- Completar campos `NO DEFINIDO` en `vault/04-MARCAS/`.
- Fuentes locales: KUTT (Archivo 800) y Nicolás (Poppins 700) OK; Inter/Montserrat pendientes.
- CTA de los `test-*.json` = datos dummy (`_TODO`): reemplazar antes de publicar.
- `setup-local.ps1` aún sin primera ejecución real (no hay PowerShell en la nube).
- ¿Overrides de FPS/formato por marca? ¿PR de la rama a `main`?
