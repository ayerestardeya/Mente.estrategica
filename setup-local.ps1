#Requires -Version 5.1
<#
  setup-local.ps1 — Prepara Mi Mundo Engine para renderizar en local (Windows + GPU).

  Uso (desde la raíz del repo clonado, sin cambiar la política del sistema):
    powershell -ExecutionPolicy Bypass -File .\setup-local.ps1

  Qué hace:
    1. Comprueba Git y Node.js (>= 20) con npm.
    2. Instala dependencias dentro de engine\ (npm install).
    3. Crea engine\.env desde engine\env.local.example si no existe (REMOTION_GL=angle).
    4. Descarga el Chrome Headless Shell de Remotion.
    5. Verifica TypeScript (tsc --noEmit).
  No lee ni muestra secretos. No hace git push. Es idempotente: puedes repetirlo.
#>

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Paso($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "    [OK] $msg" -ForegroundColor Gray }
function Falla($msg) {
  Write-Host "    [X] $msg" -ForegroundColor Red
  exit 1
}

Write-Host "Mi Mundo Engine - Setup local (modo hibrido)" -ForegroundColor White

# 1. Prerrequisitos -----------------------------------------------------------
Paso "Comprobando prerrequisitos"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Falla "Git no esta instalado. Descargalo en https://git-scm.com/download/win"
}
Ok (git --version)

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Falla "Node.js no esta instalado. Instala la version LTS (20 o superior) desde https://nodejs.org"
}
$nodeVersion = (node --version).Trim()
$nodeMajor = [int]($nodeVersion.TrimStart("v").Split(".")[0])
if ($nodeMajor -lt 20) {
  Falla "Node.js $nodeVersion es demasiado antiguo. Se requiere 20 o superior."
}
Ok "Node.js $nodeVersion"

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Falla "npm no esta disponible (viene con Node.js). Reinstala Node.js."
}
Ok "npm $((npm --version).Trim())"

if (-not (Test-Path ".\engine\package.json")) {
  Falla "No encuentro engine\package.json. Ejecuta el script desde la raiz del repo."
}

# 2-5. Motor ------------------------------------------------------------------
Push-Location ".\engine"
try {
  Paso "Instalando dependencias en engine\ (npm install)"
  npm install --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { Falla "npm install fallo (codigo $LASTEXITCODE)." }
  Ok "Dependencias instaladas"

  Paso "Configuracion local (engine\.env)"
  if (Test-Path ".\.env") {
    Ok "engine\.env ya existe: no se modifica"
  } else {
    Copy-Item ".\env.local.example" ".\.env"
    Ok "Creado engine\.env desde env.local.example (REMOTION_GL=angle -> GPU)"
  }

  Paso "Navegador de render (Chrome Headless Shell de Remotion)"
  npx remotion browser ensure
  if ($LASTEXITCODE -ne 0) { Falla "No se pudo preparar el navegador de Remotion." }
  Ok "Navegador listo"

  Paso "Verificando TypeScript"
  npx tsc --noEmit
  if ($LASTEXITCODE -ne 0) { Falla "TypeScript reporta errores." }
  Ok "TypeScript sin errores"
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Motor Híbrido Listo para Renderizar en Local" -ForegroundColor Green
Write-Host "Siguiente: cd engine ; npm run gpu ; npm run render:kutt-viral" -ForegroundColor Gray
