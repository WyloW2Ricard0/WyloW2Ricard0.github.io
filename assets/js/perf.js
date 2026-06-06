// =====================================================
// PERF — PageSpeed Insights API (Lighthouse v5)
// Affiche Performance, Accessibilité, Bonnes Pratiques, SEO
// via jauges Canvas animées aux couleurs du logo
// =====================================================

(function initPerf() {
    const SITE_URL   = 'https://wylow2ricard0.github.io';
    const API_BASE   = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    // Couleurs du logo
    const COLOR_BLUE   = '#4A9EFF';
    const COLOR_YELLOW = '#F5C342';
    const COLOR_VIOLET = '#9B6DFF';
    const COLOR_BG     = '#21262d';
    const COLOR_TRACK  = '#30363d';

    const CATEGORIES = [
        { id: 'gauge-performance',     key: 'performance',     color: COLOR_BLUE   },
        { id: 'gauge-accessibility',   key: 'accessibility',   color: COLOR_VIOLET },
        { id: 'gauge-best-practices',  key: 'best-practices',  color: COLOR_YELLOW },
        { id: 'gauge-seo',             key: 'seo',             color: '#3fb950'    },
    ];

    const METRICS_LABELS = {
        'first-contentful-paint':        { label: 'FCP',    emoji: '🎨' },
        'speed-index':                   { label: 'Speed Index', emoji: '⚡' },
        'largest-contentful-paint':      { label: 'LCP',    emoji: '📦' },
        'total-blocking-time':           { label: 'TBT',    emoji: '🧱' },
        'cumulative-layout-shift':       { label: 'CLS',    emoji: '🔀' },
        'interactive':                   { label: 'TTI',    emoji: '🖱️' },
    };

    let currentStrategy = 'desktop';

    // ---- Jauges Canvas ----
    function drawGauge(canvas, score, color) {
        const ctx   = canvas.getContext('2d');
        const W     = canvas.width;
        const H     = canvas.height;
        const cx    = W / 2;
        const cy    = H / 2;
        const R     = 46;
        const start = -Math.PI * 0.75;
        const end   = Math.PI * 0.75;
        const val   = start + (end - start) * (score / 100);

        ctx.clearRect(0, 0, W, H);

        // Fond arc
        ctx.beginPath();
        ctx.arc(cx, cy, R, start, end);
        ctx.strokeStyle = COLOR_TRACK;
        ctx.lineWidth   = 10;
        ctx.lineCap     = 'round';
        ctx.stroke();

        // Arc valeur
        if (score > 0) {
            ctx.beginPath();
            ctx.arc(cx, cy, R, start, val);
            ctx.strokeStyle = color;
            ctx.lineWidth   = 10;
            ctx.lineCap     = 'round';
            ctx.stroke();
        }
    }

    function animateGauge(canvas, targetScore, color, scoreEl) {
        let current = 0;
        const step  = Math.max(1, Math.floor(targetScore / 40));
        const timer = setInterval(() => {
            current = Math.min(current + step, targetScore);
            drawGauge(canvas, current, color);
            scoreEl.textContent = current;
            if (current >= targetScore) clearInterval(timer);
        }, 25);
    }

    // ---- Couleur selon score ----
    function scoreColor(s) {
        if (s >= 90) return COLOR_BLUE;
        if (s >= 50) return COLOR_YELLOW;
        return '#f85149';
    }

    // ---- Rendre les métriques détaillées ----
    function renderMetrics(audits) {
        const container = document.getElementById('perf-metrics');
        if (!container) return;
        const entries = Object.entries(METRICS_LABELS)
            .map(([id, meta]) => ({ id, ...meta, audit: audits[id] }))
            .filter(e => e.audit && e.audit.displayValue);

        if (!entries.length) { container.innerHTML = ''; return; }

        container.innerHTML = `
            <div class="perf-metrics__grid">
                ${entries.map(e => {
                    const rating = e.audit.score != null
                        ? (e.audit.score >= 0.9 ? 'good' : e.audit.score >= 0.5 ? 'average' : 'poor')
                        : 'neutral';
                    return `
                    <div class="perf-metric perf-metric--${rating}">
                        <span class="perf-metric__emoji">${e.emoji}</span>
                        <span class="perf-metric__label">${e.label}</span>
                        <span class="perf-metric__value">${e.audit.displayValue}</span>
                    </div>`;
                }).join('')}
            </div>`;
    }

    // ---- Charger les données ----
    async function loadScores(strategy) {
        const notice = document.getElementById('perf-notice');
        if (notice) notice.textContent = '⏳ Récupération des scores Lighthouse…';

        // Reset jauges
        CATEGORIES.forEach(cat => {
            const wrap  = document.getElementById(cat.id);
            if (!wrap) return;
            const scoreEl = wrap.querySelector('.perf-gauge__score');
            const canvas  = wrap.querySelector('.perf-gauge__canvas');
            if (scoreEl) scoreEl.textContent = '--';
            if (canvas)  drawGauge(canvas, 0, COLOR_TRACK);
            wrap.classList.add('perf-gauge--loading');
        });

        const url = `${API_BASE}?url=${encodeURIComponent(SITE_URL)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

        try {
            const res  = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const cats = data.lighthouseResult?.categories ?? {};
            const auds = data.lighthouseResult?.audits     ?? {};

            CATEGORIES.forEach(cat => {
                const wrap    = document.getElementById(cat.id);
                if (!wrap) return;
                const scoreEl = wrap.querySelector('.perf-gauge__score');
                const canvas  = wrap.querySelector('.perf-gauge__canvas');
                const raw     = cats[cat.key]?.score;
                const score   = raw != null ? Math.round(raw * 100) : 0;
                const color   = scoreColor(score);
                wrap.classList.remove('perf-gauge--loading');
                if (canvas && scoreEl) animateGauge(canvas, score, color, scoreEl);
            });

            renderMetrics(auds);
            if (notice) notice.textContent = `✅ Données récupérées — ${new Date().toLocaleTimeString('fr-FR')}`;

        } catch (err) {
            if (notice) notice.textContent = `⚠️ Impossible de charger les scores (${err.message}). Réessayez en ligne.`;
            console.warn('[perf.js]', err);
        }
    }

    // ---- Init DOM ----
    function init() {
        // Dessiner les arcs vides au démarrage
        CATEGORIES.forEach(cat => {
            const wrap   = document.getElementById(cat.id);
            if (!wrap) return;
            const canvas = wrap.querySelector('.perf-gauge__canvas');
            if (canvas) drawGauge(canvas, 0, COLOR_TRACK);
        });

        // Boutons stratégie
        document.querySelectorAll('.perf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const strategy = btn.dataset.strategy;
                if (strategy === currentStrategy) return;
                currentStrategy = strategy;
                document.querySelectorAll('.perf-btn').forEach(b => b.classList.remove('perf-btn--active'));
                btn.classList.add('perf-btn--active');
                const label = document.getElementById('perf-strategy-label');
                if (label) label.textContent = strategy === 'desktop' ? '— Desktop' : '— Mobile';
                loadScores(strategy);
            });
        });

        // Charger au premier affichage de la section (IntersectionObserver)
        const section = document.getElementById('expertise');
        if (!section) { loadScores(currentStrategy); return; }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                loadScores(currentStrategy);
            }
        }, { threshold: 0.1 });
        observer.observe(section);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
