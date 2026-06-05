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
        theme: 'dark',
        themeVariables: {
            primaryColor: '#58a6ff',
            primaryTextColor: '#e6edf3',
            primaryBorderColor: '#30363d',
            lineColor: '#8b949e',
            secondaryColor: '#21262d',
            tertiaryColor: '#161b22',
            background: '#0d1117',
            mainBkg: '#161b22',
            nodeBorder: '#30363d',
            clusterBkg: '#21262d',
            titleColor: '#e6edf3',
            edgeLabelBackground: '#161b22',
            attributeBackgroundColorEven: '#161b22',
            attributeBackgroundColorOdd: '#21262d',
        },
    });
    mermaid.run();
}

