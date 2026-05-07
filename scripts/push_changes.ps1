param(
    [string]$Message = "Mise à jour: commit demandé par l'utilisateur",
    [switch]$DryRun
)

# Ensure we're in the repository root (user should run this from repo root)
$cwd = Get-Location
Write-Host "Working directory: $cwd"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git introuvable. Installez Git depuis https://git-scm.com/downloads puis relancez le script."
    exit 1
}

Write-Host "Vérification de l'état Git..."
git status --porcelain

if ($LASTEXITCODE -ne 0) {
    Write-Error "Impossible d'exécuter 'git status'. Vérifiez le dépôt et relancez.";
    exit 1
}

if ($DryRun) {
    Write-Host "Dry run: aucun changement appliqué.";
    exit 0
}

Write-Host "Ajout des changements..."
git add -A
if ($LASTEXITCODE -ne 0) { Write-Error "Échec de 'git add'"; exit 1 }

Write-Host "Commit avec le message: $Message"
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Aucun commit créé (peut-être aucun changement à committer)."
} else {
    Write-Host "Commit créé."
}

$branch = git rev-parse --abbrev-ref HEAD
if ($LASTEXITCODE -ne 0) { Write-Error "Impossible de déterminer la branche actuelle."; exit 1 }

Write-Host "Push vers origin/$branch..."
git push origin $branch
if ($LASTEXITCODE -ne 0) { Write-Error "Échec du push. Vérifiez l'authentification et la configuration distante."; exit 1 }

Write-Host "Push réussi."
