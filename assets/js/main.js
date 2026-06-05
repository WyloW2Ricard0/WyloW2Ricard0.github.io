// =====================================================
// Année courante dans le footer
// =====================================================
document.getElementById('year').textContent = new Date().getFullYear();

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
// Mermaid — initialisation avec thème sombre
// Les définitions sont injectées par assets/js/diagrams.js
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
    mermaid.run();
}

