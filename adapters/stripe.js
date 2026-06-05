// =====================================================
// ADAPTER — Stripe Payment Port
//
// Pour activer les paiements réels :
//   1. Créez des Payment Links sur https://dashboard.stripe.com/payment-links
//   2. Renseignez les URLs dans core/catalog.js (propriété stripeLink)
//
// Pour une intégration avancée (webhooks, abonnements),
// un backend est requis (ex. Netlify Functions, Vercel Edge).
// =====================================================

(function initStripeAdapter() {
    const modal = document.getElementById('stripe-modal');
    const modalClose = modal?.querySelector('.stripe-modal__close');
    const backdrop = modal?.querySelector('.stripe-modal__backdrop');

    function openModal(productName) {
        if (!modal) return;
        document.getElementById('stripe-modal-product').textContent = productName;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    modalClose?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // Délégation sur tous les boutons Stripe (y compris injectés dynamiquement)
    document.addEventListener('click', e => {
        const btn = e.target.closest('.stripe-btn');
        if (!btn) return;

        const productId = btn.dataset.product;
        const product = (typeof CATALOG !== 'undefined')
            ? CATALOG.find(p => p.id === productId)
            : null;

        if (!product) return;

        if (product.stripeLink && product.stripeLink !== '#') {
            window.open(product.stripeLink, '_blank', 'noopener,noreferrer');
        } else {
            openModal(product.name);
        }
    });
})();
