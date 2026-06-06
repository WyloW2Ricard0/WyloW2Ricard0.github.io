# WyloW2Ricard0.github.io — Mnémosyne

Site professionnel de **RICHARD Wilfried** — Consultant Programmeur-Statisticien, hébergé sur [GitHub Pages](https://pages.github.com).

🌐 **[https://wylow2ricard0.github.io](https://wylow2ricard0.github.io)**

## Scores Lighthouse (06/06/2026 — Desktop)

| ⚡ Performance | ♿ Accessibilité | ✅ Bonnes pratiques | 🔍 SEO |
|:-:|:-:|:-:|:-:|
| 58 | 93 | 100 | 100 |

## Structure

```
index.html                  ← page principale
.nojekyll                   ← désactive Jekyll (HTML statique pur)
.github/workflows/static.yml ← déploiement GitHub Actions
assets/
  css/style.css             ← thème sombre (couleurs logo : bleu/jaune/violet/blanc)
  js/
    main.js                 ← nav mobile + initialisation Mermaid
    diagrams.js             ← définitions Mermaid (mindmap, flowcharts UML)
    perf.js                 ← jauges PageSpeed Insights (cache 24h localStorage)
  img/
    logo_SP_contour_20250831.ico   ← logo Mnémosyne
    C841_fibonacci_plein_20260605.svg ← filigrane décor
  docs/
    cv_scientist_richardWilfried_20260522.pdf ← CV téléchargeable
core/
  catalog.js                ← domaine : catalogue produits Stripe
adapters/
  stripe.js                 ← adaptateur paiement Stripe
  github.js                 ← adaptateur API GitHub (dépôts publics)
```

## Sections

| Section | Description |
|---|---|
| **Hero** | Logo + titre dégradé Bauhaus 93 + diagramme Mermaid |
| **Profil** | Parcours, compétences, bouton contact |
| **Expertise & Méthodes** | Mindmap Data Scientist + jauges PageSpeed |
| **Applications** | Catalogue produits Electron/Excel — vente & location via Stripe |
| **Contact** | Formulaire Formspree + code `profil.py` + liens |

## Déploiement

Le site se déploie automatiquement via GitHub Actions (`static.yml`) à chaque push sur `main`.

```bash
# Travailler sur dev, puis fusionner sur main
git checkout main
git reset --hard dev
git push origin main --force-with-lease
```

## Technologies

- HTML / CSS (variables CSS, Grid, Flexbox)
- JavaScript vanilla (ES2020+)
- [Mermaid.js v11](https://mermaid.js.org/) — diagrammes UML et mindmap
- [Bungee](https://fonts.google.com/specimen/Bungee) (fallback Bauhaus 93) + Consolas
- [Formspree](https://formspree.io/) — formulaire de contact sans backend
- [Stripe Payment Links](https://stripe.com/fr/payments/payment-links) — paiements
- [PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/v5/about) — métriques Lighthouse

