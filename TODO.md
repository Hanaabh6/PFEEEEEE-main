# Translation Completion TODO

## Plan
1. Audit all frontend HTML files for untranslated strings
2. Add missing keys to `translations.js` (fr/en/ar packs + auto-translate fallbacks)
3. Update HTML files to use `data-key` / `tr()` consistently
4. Final check for RTL and language switching

## Progress

### Files audited
- [x] translations.js
- [x] index.html
- [x] user.html
- [x] mesobjet.html
- [x] ajouter-objet.html
- [x] localisations.html
- [x] localisations-user.html
- [x] parametres.html
- [x] parametres-user.html
- [x] login.html
- [x] register.html
- [x] reset.html

### Missing translations to add
- [x] index.html JS overlays
- [x] user.html report form labels and validation
- [x] user.html overlay titles and status texts
- [x] mesobjet.html feature overlay static structure
- [x] ajouter-objet.html alerts and progress texts
- [x] localisations.html/localisations-user.html toast and labels
- [x] parametres.html/parametres-user.html labels and alerts

### Updates to translations.js
- [x] Add missing structured keys to fr (~220 keys)
- [x] Add missing structured keys to en (~220 keys)
- [x] Add missing structured keys to ar (~220 keys)
- [x] Syntax validated with node -c

### HTML file updates
- [ ] index.html
- [ ] user.html
- [ ] mesobjet.html
- [ ] ajouter-objet.html
- [ ] localisations.html
- [ ] localisations-user.html
- [ ] parametres.html
- [ ] parametres-user.html

