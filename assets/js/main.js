// =====================================================
// Année courante dans le footer
// =====================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =====================================================
// Service Worker — Cache stratégique (fix cache Lighthouse)
// =====================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// =====================================================
// Navigation mobile : toggle
// =====================================================
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// =====================================================
// Mermaid — Fix forced reflow : initialisation différée
// via IntersectionObserver pour ne pas bloquer le LCP
// =====================================================
if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            fontFamily: 'consolas',
            lineColor: '#F5C342',
        },
    });
    // Injecter les définitions AVANT mermaid.run() pour éviter le reflow
    if (typeof DIAGRAMS_DEFS !== 'undefined') {
        Object.entries(DIAGRAMS_DEFS).forEach(([id, def]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = def;
        });
    }
    mermaid.run();
}
