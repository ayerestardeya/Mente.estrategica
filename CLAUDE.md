# CLAUDE.md — Mi Mundo Engine (repo `Mente.estrategica`)

Motor audiovisual centralizado (monorepo) para todo el ecosistema, con
**segregación estricta de datos por marca (Multi-Tenant)**.
Estado vivo y punteros: ver `memory.md`. Leerlo al iniciar cada sesión.

## Marcas registradas (tenants)
| Slug                | Marca              | Identidad                              |
|---------------------|--------------------|----------------------------------------|
| `mente-estrategica` | Mente Estratégica  | `vault/04-MARCAS/mente-estrategica.md` |
| `metal-lopez`       | Metal López        | `vault/04-MARCAS/metal-lopez.md`       |
| `kutt`              | KUTT               | `vault/04-MARCAS/kutt.md`              |
| `vitaly`            | Vitaly             | `vault/04-MARCAS/vitaly.md`            |
| `nicolas-lopez`     | Nicolás López      | `vault/04-MARCAS/nicolas-lopez.md`     |

Cualquier slug fuera de esta tabla es inválido: detente y pregunta.

## Enrutamiento Multi-Marca (OBLIGATORIO)
1. **Declara la marca activa** antes de cualquier tarea: `MARCA ACTIVA: <slug>`.
   Si el pedido no deja claro el slug, pregunta. Nunca lo deduzcas.
2. **NUNCA asumas la estética.** Antes de renderizar o crear componentes en
   Remotion, debes leer estrictamente el archivo de identidad en
   `vault/04-MARCAS/[nombre-marca].md` para aplicar la identidad correcta.
3. Si ese archivo tiene campos `PENDIENTE` o `NO DEFINIDO` que la pieza necesita,
   no inventes valores: detente y pide los datos al usuario.
   En código, la identidad vive solo en `engine/src/utils/themeProvider.ts`,
   espejo del vault: si difieren, manda el vault y se corrige el diccionario.
4. Solo lees y escribes rutas de la marca activa:
   - `vault/01-GUIONES/<slug>/`
   - `vault/03-METRICAS/<slug>/`
   - `vault/04-MARCAS/<slug>.md`
   - `engine/public/brands/<slug>/` (fuentes, assets) y `engine/out/<slug>/`
5. Todo archivo de contenido lleva frontmatter `marca: <slug>`. Si el valor no
   coincide con la carpeta, el archivo va a `vault/99-CUARENTENA/`.
6. Cambio de marca = cambio de contexto: cierra la tarea actual, anuncia
   `MARCA ACTIVA: <nuevo-slug>` y no reutilices textos, assets, paletas ni
   guiones de la marca anterior.

## Aislamiento estricto (guardrail intocable)
- Los guiones, datos y recursos de una marca jamás cruzan contexto ni carpetas
  con otra. Si trabajas para Metal López, ignoras KUTT (y viceversa).
- Prohibido crear componentes "compartidos" que embeban colores, tipografías,
  logos o copys de una marca. Lo compartido solo es lógica neutra que recibe
  la identidad como parámetro desde `vault/04-MARCAS/<slug>.md`.
- Comparativas entre marcas: solo si el usuario lo pide explícitamente y solo
  con métricas agregadas, nunca con guiones o assets.

## Defaults técnicos
- FPS por defecto de los motores: **30 fps** (prioridad retención Shorts/Reels).
  Una marca puede sobrescribirlo solo en su archivo de identidad.
- Formato por defecto: vertical 1080x1920 salvo que la identidad diga otra cosa.
- Salidas de render: `engine/out/<slug>/` (ignorado por git).

## Seguridad y credenciales
- Nunca leas, imprimas ni commitees `.env*`, claves, tokens o credenciales
  (bloqueado en `.claude/settings.json`). Si una tarea los necesita, pide al
  usuario que configure el secreto fuera del repo.
- No conectes MCP ni n8n hasta que exista una decisión en `vault/02-DECISIONES/`.

## Git
- Commits locales permitidos. **Nunca `git push` ni crear remotos sin
  aprobación explícita del usuario en el chat.**
- Audio/video binario (`*.mp3`, `*.wav`, `*.mp4`) nunca se versiona.

## Flujo del vault (segundo cerebro)
`00-INBOX` (captura cruda) → `01-GUIONES/<slug>` (guion aprobado) → render →
`03-METRICAS/<slug>` (resultados) → `02-DECISIONES` (aprendizajes fechados).
Lo dudoso o mal etiquetado va a `99-CUARENTENA` hasta revisión humana.

## Cierre de cada tarea
1. Ejecuta `bash scripts/verify-phase1.sh` (o el verificador de la fase vigente).
2. Registra decisiones nuevas en `vault/02-DECISIONES/AAAA-MM-DD-<tema>.md`.
3. Actualiza `memory.md` (máx. 60 líneas: punteros, no contenido).
