// =====================================================
// DOMAIN — Catalogue des produits Mnémosyne
//
// Pour activer Stripe, remplacez chaque `stripeLink`
// par votre Stripe Payment Link :
// https://dashboard.stripe.com/payment-links
// =====================================================

const CATALOG = [
    {
        id: 'statdashboard-sale',
        name: 'StatDashboard',
        type: 'electron',
        badge: 'Vente',
        badgeType: 'sale',
        icon: '⚡',
        description: 'Tableau de bord statistique interactif. Importez vos données CSV/Excel, générez des graphiques avancés et des rapports PDF en quelques clics.',
        features: [
            'Analyse descriptive complète',
            'Régression & corrélations',
            'Export PDF / Excel',
            'Licence perpétuelle',
        ],
        price: 149,
        currency: 'EUR',
        period: 'paiement unique',
        mode: 'payment',
        stripeLink: '#', // TODO: https://buy.stripe.com/votre-lien
    },
    {
        id: 'statdashboard-pro',
        name: 'StatDashboard Pro',
        type: 'electron',
        badge: 'Location',
        badgeType: 'rent',
        icon: '📊',
        description: 'Version complète avec mises à jour automatiques, support prioritaire et accès aux nouvelles fonctionnalités dès leur sortie.',
        features: [
            'Toutes les fonctions StatDashboard',
            'Machine Learning intégré',
            'Support dédié',
            'Mises à jour incluses',
        ],
        price: 29,
        currency: 'EUR',
        period: '/mois',
        mode: 'subscription',
        stripeLink: '#', // TODO: https://buy.stripe.com/votre-lien
    },
    {
        id: 'dataflow-excel',
        name: 'DataFlow Excel',
        type: 'excel',
        badge: 'Vente',
        badgeType: 'sale',
        icon: '📋',
        description: "Add-in Excel professionnel intégrant des fonctions statistiques avancées, de la visualisation interactive et de l'automatisation VBA.",
        features: [
            '+50 fonctions statistiques',
            'Graphiques interactifs',
            'Automatisation des rapports',
            'Compatible Excel 2016+',
        ],
        price: 79,
        currency: 'EUR',
        period: 'paiement unique',
        mode: 'payment',
        stripeLink: '#', // TODO: https://buy.stripe.com/votre-lien
    },
    {
        id: 'dataflow-business',
        name: 'DataFlow Excel Business',
        type: 'excel',
        badge: 'Location',
        badgeType: 'rent',
        icon: '🔄',
        description: "Version équipe avec tableau de bord centralisé, gestion des accès multi-utilisateurs et intégration API.",
        features: [
            "Jusqu'à 10 utilisateurs",
            'Tableau de bord centralisé',
            'Intégrations API',
            'Formation incluse (2h)',
        ],
        price: 59,
        currency: 'EUR',
        period: '/mois',
        mode: 'subscription',
        stripeLink: '#', // TODO: https://buy.stripe.com/votre-lien
    },
];

// =====================================================
// Utilitaire XSS-safe
// =====================================================
function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// =====================================================
// Rendu du catalogue produits
// =====================================================
(function renderCatalog() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = CATALOG.map(product => `
        <div class="product-card">
            <div class="product-card__badge product-card__badge--${escapeHtml(product.badgeType)}">
                ${escapeHtml(product.badge)}
            </div>
            <div class="product-card__icon">${product.icon}</div>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="product-card__type">${product.type === 'electron' ? 'Application Electron' : 'Add-in Excel'}</p>
            <p>${escapeHtml(product.description)}</p>
            <ul class="product-card__features">
                ${product.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
            <div class="product-card__pricing">
                <span class="product-card__price">${product.price} €</span>
                <span class="product-card__period">${escapeHtml(product.period)}</span>
            </div>
            <button class="btn btn--primary stripe-btn"
                    data-product="${escapeHtml(product.id)}"
                    data-price="${product.price}">
                ${product.mode === 'payment' ? 'Acheter' : "S'abonner"} via Stripe
            </button>
        </div>
    `).join('');
})();
