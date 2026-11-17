---
tipo: decision
fecha: 2026-11-17
estado: vigente
marca: global
---
# Nombre canónico del repositorio: `mi-mundo-engine`

## Contexto
El remoto se creó como `ayerestardeya/Mente.estrategica`, pero el repo es el
motor universal y Segundo Cerebro de todo el ecosistema, no de una sola marca.

## Decisión
- Nombre canónico: **`mi-mundo-engine`** (local y remoto).
- `Mente Estratégica` es solo un tenant (`mente-estrategica`) más.

## Ejecución
- Referencias internas actualizadas (`CLAUDE.md`, `memory.md`, decisiones).
- Renombrado del remoto: GitHub → Settings → General → Repository name.
  GitHub redirige la URL vieja; luego actualizar el remoto local con
  `git remote set-url origin https://github.com/ayerestardeya/mi-mundo-engine`.
