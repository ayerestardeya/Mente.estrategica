#!/usr/bin/env bash
# verify-phase1.sh — Valida el Arnés Cognitivo Multi-Marca (Fase 1).
# Uso: bash scripts/verify-phase1.sh   → exit 0 si todo pasa.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

FAIL=0
ok()   { printf '  [OK]   %s\n' "$1"; }
bad()  { printf '  [FAIL] %s\n' "$1"; FAIL=1; }
check_file() { [[ -f "$1" ]] && ok "existe $1" || bad "falta $1"; }
check_dir()  { [[ -d "$1" ]] && ok "existe $1/" || bad "falta $1/"; }
max_lines() { # archivo limite
  local n; n=$(wc -l < "$1" 2>/dev/null || echo 99999)
  (( n <= $2 )) && ok "$1 tiene $n líneas (<= $2)" || bad "$1 tiene $n líneas (> $2)"
}
has() { # archivo patron descripcion
  grep -qiE "$2" "$1" 2>/dev/null && ok "$1: $3" || bad "$1: falta $3"
}
json_valid() {
  if command -v python3 >/dev/null; then python3 -m json.tool "$1" >/dev/null 2>&1
  elif command -v node >/dev/null; then node -e "JSON.parse(require('fs').readFileSync('$1','utf8'))" 2>/dev/null
  elif command -v jq >/dev/null; then jq empty "$1" 2>/dev/null
  else return 2; fi
}

BRANDS=(mente-estrategica metal-lopez kutt vitaly nicolas-lopez)

echo "== 1. CLAUDE.md"
check_file CLAUDE.md
max_lines CLAUDE.md 100
has CLAUDE.md 'Enrutamiento Multi-Marca' 'sección de enrutamiento multi-marca'
has CLAUDE.md 'NUNCA asumas la est.{1,2}tica' 'regla "NUNCA asumas la estética"'
has CLAUDE.md 'vault/04-MARCAS/\[nombre-marca\]\.md' 'ruta de identidad obligatoria'
has CLAUDE.md 'Remotion' 'mención a Remotion'
has CLAUDE.md 'Aislamiento' 'regla de aislamiento'
has CLAUDE.md '30 fps' 'FPS por defecto 30'
for b in "${BRANDS[@]}"; do has CLAUDE.md "\`$b\`" "slug $b registrado"; done

echo "== 2. memory.md"
check_file memory.md
max_lines memory.md 60
has memory.md '30 fps' 'decisión FPS'
has memory.md 'Motor Universal' 'decisión Motor Universal'
has memory.md '/vault' 'decisión entorno monorepo + vault'

echo "== 3. vault/"
for d in 00-INBOX 01-GUIONES 02-DECISIONES 03-METRICAS 04-MARCAS 99-CUARENTENA; do
  check_dir "vault/$d"; check_file "vault/$d/README.md"
done

echo "== 4. Identidades de marca"
for b in "${BRANDS[@]}"; do
  f="vault/04-MARCAS/$b.md"; check_file "$f"
  has "$f" "^marca: $b$" "frontmatter marca: $b"
done

echo "== 5. .claude/settings.json"
f=.claude/settings.json; check_file "$f"
json_valid "$f"; rc=$?
if   (( rc == 0 )); then ok "$f es JSON válido"
elif (( rc == 2 )); then bad "no hay python3/node/jq para validar JSON"
else bad "$f no es JSON válido"; fi
has "$f" '"deny"' 'bloque deny'
has "$f" 'Read\(\./\.env' 'deny lectura .env*'
has "$f" 'Edit\(\./\.env' 'deny edición .env*'
has "$f" 'credentials' 'deny credenciales'
has "$f" 'token' 'deny tokens'
has "$f" 'git push' 'deny git push'

echo "== 6. .gitignore"
check_file .gitignore
for p in '.env*' '*.mp3' '*.wav' '*.mp4' 'engine/out/' 'node_modules/' '.obsidian/workspace*.json'; do
  grep -qxF "$p" .gitignore && ok ".gitignore excluye $p" || bad ".gitignore no excluye $p"
done

echo "== 7. .devcontainer/devcontainer.json"
f=.devcontainer/devcontainer.json; check_file "$f"
json_valid "$f" && ok "$f es JSON válido" || bad "$f no es JSON válido"
has "$f" 'node:1-20|node.*20' 'Node 20'
has "$f" '"3\.11"' 'Python 3.11'
has "$f" 'ffmpeg' 'ffmpeg'

echo "== 8. Guardrails de fase"
[[ ! -d node_modules && ! -f package-lock.json ]] && ok "sin dependencias npm instaladas" || bad "hay dependencias npm instaladas"
if git ls-files 2>/dev/null | grep -qE '(^|/)\.env|\.(mp3|wav|mp4)$'; then
  bad "hay .env o media binaria versionados"
else ok "sin .env ni media binaria en git"; fi

echo
if (( FAIL )); then echo "FASE 1: NO SUPERADA"; exit 1; fi
echo "FASE 1: SUPERADA"; exit 0
