// =====================================================
// PERF — PageSpeed Insights API
// Cache localStorage 24h · Info-bulles sur jauges
// Centre : temps total (perf) ou nb erreurs (autres)
// Jauges monochromes colorees selon le score
// =====================================================

(function initPerf() {
    'use strict';

    const SITE_URL  = 'https://wylow2ricard0.github.io';
    const API_BASE  = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const CACHE_TTL = 24 * 60 * 60 * 1000;

    const COLOR_GOOD    = '#4A9EFF';
    const COLOR_AVERAGE = '#F5C342';
    const COLOR_POOR    = '#f85149';
    const COLOR_TRACK   = '#30363d';

    const CATEGORIES = [
        { id: 'gauge-performance',    key: 'performance',    label: 'Performance'    },
        { id: 'gauge-accessibility',  key: 'accessibility',  label: 'Accessibilite'  },
        { id: 'gauge-best-practices', key: 'best-practices', label: 'Bonnes pratiques'},
        { id: 'gauge-seo',            key: 'seo',            label: 'SEO'            },
    ];

    const PERF_AUDITS = {
        'first-contentful-paint':   'FCP',
        'largest-contentful-paint': 'LCP',
        'total-blocking-time':      'TBT',
        'speed-index':              'Speed Index',
        'cumulative-layout-shift':  'CLS',
    };

    const FALLBACK = {
        desktop: {
            categories: {
                performance:       { score: 0.58 },
                accessibility:     { score: 0.93 },
                'best-practices':  { score: 1.00 },
                seo:               { score: 1.00 },
            },
            audits: {
                'first-contentful-paint':   { displayValue: '0,7 s',  score: 0.97, numericValue: 700 },
                'largest-contentful-paint': { displayValue: '2,4 s',  score: 0.50, numericValue: 2400 },
                'total-blocking-time':      { displayValue: '980 ms', score: 0.22, numericValue: 980 },
                'speed-index':              { displayValue: '1,2 s',  score: 0.95, numericValue: 1200 },
                'cumulative-layout-shift':  { displayValue: '0,007',  score: 1.00, numericValue: 0.007 },
                'errors-in-console':        { score: 0, details: { items: [] } },
                'color-contrast':           { score: 0, details: { items: [] } },
                'image-alt':                { score: 1, details: { items: [] } },
            },
            _fallback: true,
        },
    };

    let currentStrategy = 'desktop';

    const cacheKey = s => 'psi_' + s;
    function getCached(s) {
        try {
            const raw = localStorage.getItem(cacheKey(s));
            if (!raw) return null;
            const { ts, data } = JSON.parse(raw);
            if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(cacheKey(s)); return null; }
            return data;
        } catch { return null; }
    }
    function setCache(s, data) {
        try { localStorage.setItem(cacheKey(s), JSON.stringify({ ts: Date.now(), data })); } catch {}
    }

    function scoreColor(s) {
        if (s >= 90) return COLOR_GOOD;
        if (s >= 50) return COLOR_AVERAGE;
        return COLOR_POOR;
    }

    function drawGauge(canvas, score, color, centerText) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2, R = 46;
        const start = -Math.PI * 0.75, end = Math.PI * 0.75;
        const val   = start + (end - start) * (Math.min(score, 100) / 100);
        ctx.clearRect(0, 0, W, H);
        ctx.beginPath(); ctx.arc(cx, cy, R, start, end);
        ctx.strokeStyle = COLOR_TRACK; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
        if (score > 0) {
            ctx.beginPath(); ctx.arc(cx, cy, R, start, val);
            ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
        }
        if (centerText !== undefined) {
            ctx.fillStyle = color;
            const isLong = String(centerText).length > 6;
            ctx.font = 'bold ' + (isLong ? '11' : '13') + 'px Consolas, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(centerText), cx, cy + 8);
        }
    }

    function animateGauge(canvas, target, color, scoreEl, centerText) {
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const t = setInterval(() => {
            cur = Math.min(cur + step, target);
            drawGauge(canvas, cur, color, cur >= target ? centerText : undefined);
            scoreEl.textContent = cur;
            if (cur >= target) clearInterval(t);
        }, 22);
    }

    function buildTooltip(key, cats, auds) {
        const score = Math.round((cats[key] ? cats[key].score : 0) * 100);
        var lines = ['Score : ' + score + '/100'];
        if (key === 'performance') {
            Object.keys(PERF_AUDITS).forEach(function(aKey) {
                var a = auds[aKey];
                if (a && a.displayValue) lines.push(PERF_AUDITS[aKey] + ' : ' + a.displayValue);
            });
        } else {
            var AUDIT_GROUPS = {
                accessibility:    ['color-contrast','image-alt','label','link-name'],
                'best-practices': ['errors-in-console','js-libraries','deprecations'],
                seo:              ['meta-description','document-title','canonical'],
            };
            var group = AUDIT_GROUPS[key] || [];
            var failed = group.filter(function(id) {
                var a = auds[id];
                return a && a.score !== null && a.score < 1;
            });
            lines.push('Erreurs : ' + failed.length);
            failed.forEach(function(id) {
                var a = auds[id];
                if (a && a.title) lines.push('  - ' + a.title);
            });
        }
        return lines.join('\n');
    }

    function centerValue(key, auds) {
        if (key === 'performance') {
            var tbt = auds['total-blocking-time'];
            return (tbt && tbt.displayValue) ? tbt.displayValue : '--';
        }
        var AUDIT_GROUPS = {
            accessibility:    ['color-contrast','image-alt','label','link-name'],
            'best-practices': ['errors-in-console','js-libraries','deprecations'],
            seo:              ['meta-description','document-title','canonical'],
        };
        var group = AUDIT_GROUPS[key] || [];
        var n = group.filter(function(id) {
            var a = auds[id];
            return a && a.score !== null && a.score < 1;
        }).length;
        return n + ' err';
    }

    function renderData(lr, source) {
        var cats = lr.categories || {};
        var auds = lr.audits     || {};
        var notice = document.getElementById('perf-notice');

        CATEGORIES.forEach(function(cat) {
            var wrap    = document.getElementById(cat.id);
            if (!wrap) return;
            var scoreEl = wrap.querySelector('.perf-gauge__score');
            var canvas  = wrap.querySelector('.perf-gauge__canvas');
            var raw     = cats[cat.key] ? cats[cat.key].score : null;
            var score   = raw != null ? Math.round(raw * 100) : 0;
            var color   = scoreColor(score);
            var cv      = centerValue(cat.key, auds);
            var tip     = buildTooltip(cat.key, cats, auds);
            wrap.title = tip;
            wrap.setAttribute('aria-label', cat.label + ' : ' + score + '/100');
            wrap.classList.remove('perf-gauge--loading');
            if (canvas && scoreEl) animateGauge(canvas, score, color, scoreEl, cv);
        });

        var container = document.getElementById('perf-metrics');
        if (container) container.innerHTML = '';

        var icon = source === 'api' ? 'API live' : source === 'cache' ? 'Cache 24h' : 'Reference';
        var dateStr = lr._cachedAt
            ? new Date(lr._cachedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
            : new Date().toLocaleDateString('fr-FR');
        if (notice) notice.textContent = icon + ' - ' + dateStr;
    }

    function resetGauges() {
        CATEGORIES.forEach(function(cat) {
            var wrap = document.getElementById(cat.id);
            if (!wrap) return;
            var scoreEl = wrap.querySelector('.perf-gauge__score');
            var canvas  = wrap.querySelector('.perf-gauge__canvas');
            if (scoreEl) scoreEl.textContent = '--';
            if (canvas)  drawGauge(canvas, 0, COLOR_TRACK, undefined);
            wrap.classList.add('perf-gauge--loading');
        });
    }

    async function loadScores(strategy) {
        var notice = document.getElementById('perf-notice');
        var cached = getCached(strategy);
        if (cached) { renderData(cached, 'cache'); return; }
        resetGauges();
        if (notice) notice.textContent = 'Chargement...';
        var url = API_BASE + '?url=' + encodeURIComponent(SITE_URL) + '&strategy=' + strategy
            + '&category=performance&category=accessibility&category=best-practices&category=seo';
        try {
            var res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var data = await res.json();
            var lr   = data.lighthouseResult || {};
            lr._cachedAt = Date.now();
            setCache(strategy, lr);
            renderData(lr, 'api');
        } catch (err) {
            console.warn('[perf.js]', err.message);
            var fb = JSON.parse(JSON.stringify(FALLBACK[strategy] || FALLBACK.desktop));
            fb._cachedAt = null;
            renderData(fb, 'fallback');
        }
    }

    function init() {
        CATEGORIES.forEach(function(cat) {
            var canvas = document.getElementById(cat.id);
            if (canvas) canvas = canvas.querySelector('.perf-gauge__canvas');
            if (canvas) drawGauge(canvas, 0, COLOR_TRACK, undefined);
        });

        document.querySelectorAll('.perf-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var strategy = btn.dataset.strategy;
                if (strategy === currentStrategy) return;
                currentStrategy = strategy;
                document.querySelectorAll('.perf-btn').forEach(function(b) { b.classList.remove('perf-btn--active'); });
                btn.classList.add('perf-btn--active');
                var label = document.getElementById('perf-strategy-label');
                if (label) label.textContent = strategy === 'desktop' ? '— Desktop' : '— Mobile';
                loadScores(strategy);
            });
        });

        var section = document.getElementById('expertise');
        if (!section) { loadScores(currentStrategy); return; }
        var obs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) { obs.disconnect(); loadScores(currentStrategy); }
        }, { threshold: 0.1 });
        obs.observe(section);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
