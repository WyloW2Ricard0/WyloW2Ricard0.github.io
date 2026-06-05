# WyloW2Ricard0.github.io

Portfolio personnel hébergé sur [GitHub Pages](https://pages.github.com).  
Accessible sur → **[https://wylow2ricard0.github.io](https://wylow2ricard0.github.io)**

## Structure

```
index.html          ← page principale
assets/
  css/style.css     ← styles (thème sombre GitHub-like)
  js/main.js        ← navigation mobile + chargement dynamique des dépôts (API GitHub)
.nojekyll           ← désactive le traitement Jekyll (site HTML statique pur)
```

## Fonctionnalités

- **Hero** avec fenêtre de code animée
- **À propos** avec avatar GitHub
- **Projets** chargés dynamiquement via l'API GitHub (6 dépôts publics récents)
- **Compétences** sous forme de tags
- **Contact** avec liens externes
- Design **responsive** (mobile-first) · thème sombre · police JetBrains Mono

## Déploiement

1. Pousser les fichiers sur la branche `main` du dépôt `WyloW2Ricard0.github.io`
2. Dans **Settings → Pages**, sélectionner la source : `Deploy from a branch` → `main` → `/ (root)`
3. Le site est disponible quelques minutes après chaque push
