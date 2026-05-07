# TODO - Responsive / Layout Global (IntelliBuild)

## Phase 1 — Audit
- [x] Lire `frontend/layout.css`, `frontend/style.css`, `frontend/sidebar-loader.js`
- [x] Analyser `frontend/index.html`, `frontend/user.html`, `frontend/login.html`, `frontend/register.html`
- [ ] Vérifier les autres pages HTML : `admin-users`, `parametres`, `notifications-*`, `localisations*`, `objets`, `ajouter-objet`, `mesobjet`, etc.
- [ ] Repérer les usages de largeurs/heights fixes : `width: 100vw`, `min-width: *px`, `height: 100vh`, etc.
- [ ] Repérer les styles “sidebar” dupliqués en `<style>` par page.

## Phase 2 — Nouvelle architecture CSS unifiée
- [ ] Créer un composant de layout unique basé sur `ib-shell` (Flex) pour **toutes** les pages auth/dashboard.
- [ ] Rendre le sidebar **toujours à gauche sur desktop**, et **drawer hamburger sur mobile**.
- [ ] Supprimer / neutraliser les styles inline `<style>` qui imposent des largeurs (ex: `width:280px !important` dans `index.html` et `sidebar` custom dans `user.html`).

## Phase 3 — Corrections techniques (overflow, px fixes, 100vw/100vh)
- [ ] Ajouter une règle globale pour éviter le scroll horizontal (`overflow-x: clip/hidden`) sans casser le scroll vertical.
- [ ] Remplacer `height: 100vh` problématiques par `min-height: 100svh` (ou `calc(100svh - header)` selon cas).
- [ ] Remplacer/neutraliser `width: 100vw` par `width: 100%`.
- [ ] Forcer les conteneurs à utiliser `min-width:0` + `flex-shrink:1`.

## Phase 4 — Uniformiser le HTML
- [ ] Modifier toutes les pages HTML pour utiliser le même squelette :
  - `body` avec `ib-shell`
  - `sidebar container` injecté par `sidebar-loader.js`
  - `main content` dans une classe `ib-content`
- [ ] Ajouter un bouton hamburger (mobile) sur les pages dashboard.

## Phase 5 — Validation
- [ ] Tester sur desktop (zoom 100%), tablette, mobile.
- [ ] Tester `overflow-x` (aucun scroll horizontal).
- [ ] Vérifier que le sidebar ne “passe en haut” nulle part.
- [ ] Vérifier dashboard adaptatif.

