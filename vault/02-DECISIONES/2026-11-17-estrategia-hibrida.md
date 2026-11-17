---
tipo: decision
fecha: 2026-11-17
estado: vigente
marca: global
---
# Estrategia híbrida: programar en la nube, renderizar en el PC local

## Decisión
- **Nube (Claude Code web)**: código, JSON de escenas, vault, commits y push
  (el push siempre requiere aprobación explícita en el chat).
- **PC local (Windows 11, Asus con GPU)**: clona, hace `git pull` y renderiza.
  No es la fuente de verdad del código: lo que cambie en local y deba
  conservarse, vuelve al repo con un commit.
- La GPU entra en juego vía `REMOTION_GL=angle` (Direct3D 11 por ANGLE). Es lo
  que más acelera las escenas 3D (Hyperframes: Text3D + wireframe).

## Guía paso a paso (una sola vez)

### 1. Prerrequisitos en Windows
1. **Git for Windows**: https://git-scm.com/download/win (opciones por defecto;
   incluye Git Credential Manager para autenticarte en GitHub).
2. **Node.js LTS ≥ 20**: https://nodejs.org (marca "Add to PATH").
3. Drivers de la GPU actualizados (NVIDIA/AMD/Intel, desde el fabricante).
4. Abre una terminal nueva de **PowerShell** para que tome el PATH.

### 2. Clonar el repo
```powershell
mkdir C:\dev -Force; cd C:\dev
git clone --branch claude/quirky-carson-xe955h https://github.com/ayerestardeya/Mente.estrategica.git
cd Mente.estrategica
```
El repo es privado: la primera vez Git abrirá el navegador para iniciar sesión
en GitHub. Usa una ruta corta (`C:\dev`) para evitar límites de longitud de ruta.

### 3. Ejecutar el setup
```powershell
powershell -ExecutionPolicy Bypass -File .\setup-local.ps1
```
El script comprueba Git y Node ≥ 20, ejecuta `npm install` en `engine\`, crea
`engine\.env` desde la plantilla, descarga el Chrome Headless Shell de
Remotion y verifica TypeScript. Termina con el mensaje verde
**"Motor Híbrido Listo para Renderizar en Local"**. `-ExecutionPolicy Bypass`
solo afecta a esa ejecución: no cambia la política de tu sistema.

### 4. Variables del `.env` local (`engine\.env`)
| Variable | Valor en tu PC | Valor en la nube | Para qué |
|---|---|---|---|
| `REMOTION_GL` | **`angle`** | `swangle` | `angle` = GPU. **No uses `swangle` en local**: es render por CPU, solo para la nube sin GPU. Si `angle` falla, prueba `vulkan` o `angle-egl`. |
| `REMOTION_BROWSER_EXECUTABLE` | *(vacío)* | Chromium preinstalado | Vacío = Chrome Headless Shell de Remotion. |
| `REMOTION_CONCURRENCY` | `50%` | *(sin definir)* | Pestañas en paralelo; súbelo si la CPU/GPU va holgada. |
| `ELEVENLABS_API_KEY` (futuro) | tu clave | **nunca** | Secretos solo en tu PC. |

- `engine\.env` está ignorado por git (`.env*` en `.gitignore`). Tampoco se puede
  forzar su subida: `git add -f` está bloqueado para el agente.
- Prioridad: variable de la shell > `engine\.env` > valor por defecto de Remotion.
- Comprueba que la GPU está activa: `cd engine ; npm run gpu`. En
  "WebGL" / "GPU compositing" debe salir *Hardware accelerated*.

## Flujo diario
1. **Nube**: pides el cambio (escena, JSON, ajuste de marca). Claude programa,
   verifica (`tsc`, render de prueba) y hace commit. El push solo se hace con tu
   "autorizo push".
2. **PC**:
   ```powershell
   cd C:\dev\Mente.estrategica
   git pull
   # Solo si cambió engine\package-lock.json:
   powershell -ExecutionPolicy Bypass -File .\setup-local.ps1
   cd engine
   npm run render:kutt-viral            # KUTT (JSON public\test-kutt-viral.json)
   npm run render:nicolas-hyperframes   # Nicolás López (3D)
   ```
   Para una pieza nueva: `npx remotion render src/Root.tsx MotorJSON out\<slug>\<pieza>.mp4 --props=public\<pieza>.json`
3. **Salida**: `engine\out\<slug>\`, ignorado por git. Los MP4 **nunca** se
   suben al repo; se publican directamente en las plataformas.
4. **Métricas**: los resultados van a `vault/03-METRICAS/<slug>/` (desde la nube,
   o con un commit propio desde el PC).

## Reglas de convivencia
- Antes de tocar nada en el PC: `git pull`. Evita editar en local los mismos
  archivos que se están cambiando en la nube.
- Si abres Claude Code en el PC, se aplican el mismo `CLAUDE.md` y el mismo
  `.claude/settings.json`: aislamiento por marca, `.env*` ilegible y sin push
  ni `npm install` sin autorización. `.claude/settings.local.json` (ignorado)
  es solo para preferencias personales; no lo uses para levantar bloqueos.
- Los scripts npm pasan las props por **archivo JSON** (`--props=public/...json`),
  no en línea: `cmd.exe` (el que usa npm en Windows) no entiende las comillas
  simples.

## Archivos de esta decisión
- `setup-local.ps1` (raíz) · `engine/env.local.example` · `engine/remotion.config.ts`
  (carga `engine/.env`, `REMOTION_GL`, `REMOTION_CONCURRENCY`) · `.gitattributes`
  (LF en el repo, CRLF para `.ps1`) · `.claude/settings.json` (bloqueos ampliados
  a PowerShell/cmd).
- Pendiente: el script de PowerShell no se pudo ejecutar en la nube (no hay
  PowerShell en el contenedor). Su primera ejecución real es en tu PC.
