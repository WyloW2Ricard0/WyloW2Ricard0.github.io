// =====================================================
// DIAGRAMS — Définitions Mermaid injectées via JS
// (évite les problèmes d'échappement HTML avec <<>>)
// =====================================================

const DIAGRAMS_DEFS = {

    'diagram-hero': `graph LR
    A[📊 Statistiques] --> B((🧠 Mnémosyne))
    C[💼 Métier] --> B
    D[💻 Code] --> B
    B --> E[✅ Solutions]
    style A stroke:#f85149,stroke-width:2px
    style B stroke:#8b949e
    style C stroke:#9B6DFF
    style D stroke:#4A9EFF
    style E stroke:#3fb950`,

    'diagram-mindmap': `---
config:
  theme: base
  themeVariables:
    primaryColor: 'hsl(37, 100%, 99%)'
    primaryTextColor: 'hsl(36, 100%, 15%)'
    secondaryColor: 'hsl(173, 83%, 80%)'
    secondaryTextColor: 'hsl(173, 83%, 15%)'
    tertiaryColor: 'hsl(259, 100%, 90%)'
    tertiaryTextColor: 'hsl(259, 100%, 100%)'
---
mindmap
    root{{"🎯 Data
    Scientist"}}
        c(("💻 Informatique"))
            c1))"📱 Application"((
                c1a["⚡ Electron.js
                Node.js"]
                c1b["📊 Excel
                VBA"]
                c1c["📈 Power BI
                QueryM & DAX"]
                c1d["🐍 Jupyter
                Python"]
            c2))"🗄️ Base de
            données"((
                c2a["🐘 PostgreSQL"]
                c2b["🍃 MongoDB
                NoSQL"]
            c3))"⚙️ Système"((
                c3a)"☁️ Azure"(
                c3b["💻 VSCode"]
                c3c["💳 Stripe"]
                c3d["🔌 Supabase"]
        b(("💼 Métier"))
            b2))"🔒 Cybersécurité"((
                b2a["🕵️ OSINT"]
                b2b["⚖️ RGPD"]
            b2))"💶 Finances"((
                b2a["📑 Actuariat"]
                b2b["📒 Bilan"]
                b2c["📋 Compte
                Intermédiaire
                de Gestion"]
                b2d["🏛️ Plan
                Comptable
                Général"]
                b2e["🏘️ SCPI"]
            b3))"🚚 Logistique"((
                b3a["🔮 Prévision"]
                b3b["⚠️ Risques"]
            b4))"🌲 Sylviculture"((
                b4a["📋 Plan
                Simple de
                Gestion"]
                b4b["🗺️ Cartographie
                QGIS"]
        a(("📊 Statistiques"))
            a1))"🤖 Machine learning"((
                a1a["🌳 Arbre de
                décision
                (aléatoire)"]
                a1b["📈 ARIMA"]
                a1c["🔵 K-means"]
                a1d["📉 Régression
                non linéaire"]
            a2))"📐 Modélisation"((
                a2a["📦 Box Plot"]
                a2b["🫧 Bubble Plot"]
                a2c["🌿 Dendogram"]
                a2d["📊 Distribution"]
                a2e["🔥 Heatmap"]
                a2f["⏱️ Séries
                temporelles"]
            a3))"🧹 Préparation"((
                a3a["🔁 Duplicates"]
                a3b["🩹 Imputation"]
                a3c["❓ Manquantes"]
                a3d["🚨 Outlier
                Detection"]
                a3e["🔄 Transformation"]
            a4))"📏 Variance"((
                a4a["🎲 Inférence
                Bayésienne"]
                a4b["🔗 Matrice de
                Corrélation"]
                a4c("📐 Inférences
                fréquentistes")
                a4e["📊 Intervalle de
                confiance"]
                a4f["📉 ROC-AUC"]
                a4g["📏 RMSE"]
                a4h["🧮 Statistique
                de base"]
        d(("🔄 Agility"))
            d1["🔍 Analyse
            de Cause
            Racine"]
            d2["🏛️ Architecture
            Hexagonal"]
            d3["🎨 Design
            UI/UX"]
            d4["📐 Merise"]
            d5["🏃 Scrum"]
            d6["📊 Schéma
            UML"]
            d7["🧪 Test Unitaire"]
            `,

};

// Injecter les définitions dans les éléments DOM
Object.entries(DIAGRAMS_DEFS).forEach(([id, def]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = def;
});
