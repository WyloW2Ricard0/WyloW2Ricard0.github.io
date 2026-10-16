// =====================================================
// PERF -- Jauges Lighthouse -- Valeurs fixees
// Rapport Desktop v13.3.0 du 06/06/2026
// Source: https://pagespeed.web.dev/analysis/...
// =====================================================
(function initPerf() {
    'use strict';

    // Donnees figees -- plus d API
    const DATA = fetch('/assets/js/perf.json').then(response => response.json());
    const C_GOOD  = '#4A9EFF';
    const C_AVG   = '#F5C342';
    const C_POOR  = '#f85149';
    const C_TRACK = '#2d333b';

    function sc(s) { return s >= 90 ? C_GOOD : s >= 50 ? C_AVG : C_POOR; }

    // Jauge simple (utilisee pour toutes les categories)
    function drawSimple(canvas, score) {
        var ctx = canvas.getContext('2d');
        var W = canvas.width, H = canvas.height;
        var cx = W/2, cy = H/2, R = 52;
        var start=-Math.PI*0.75, end=Math.PI*0.75;
        var val = start + (end-start)*(score/100);
        var color = sc(score);
        ctx.clearRect(0,0,W,H);
        ctx.beginPath(); ctx.arc(cx,cy,R,start,end);
        ctx.strokeStyle=C_TRACK; ctx.lineWidth=11; ctx.lineCap='round'; ctx.stroke();
        if (score > 0) {
            ctx.beginPath(); ctx.arc(cx,cy,R,start,val);
            ctx.strokeStyle=color; ctx.lineWidth=11; ctx.lineCap='round'; ctx.stroke();
        }
        ctx.font='bold 28px Consolas,monospace'; ctx.fillStyle=color;
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(score,cx,cy-5);
        ctx.font='11px Consolas,monospace'; ctx.fillStyle='#b0bac3'; ctx.fillText('%',cx,cy+13);
    }

    // Construire la structure d une jauge dans le DOM
    // tooltipLines : tableau de strings pour le title / aria-description
    function buildGauge(id, label, score, sub, tooltipLines) {
        var wrap = document.getElementById(id);
        if (!wrap) return null;
        // Tooltip natif (survol clavier / souris)
        var tipText = tooltipLines && tooltipLines.length
            ? tooltipLines.join('\n')
            : label + ' : ' + score + '/100';
        wrap.innerHTML =
            '<span class="perf-gauge__name">' + label + '</span>' +
            '<canvas class="perf-gauge__canvas" width="140" height="140" aria-hidden="true" title="' +
            tipText.replace(/"/g, '&quot;') + '"></canvas>' +
            '<span class="perf-gauge__sub">' + sub + '</span>';
        wrap.setAttribute('aria-label', label + ' : ' + score + '/100. Survolez le graphe pour les d&eacute;tails.');
        wrap.classList.remove('perf-gauge--loading');
        return wrap.querySelector('canvas');
    }

    // Render une strategie
    function render(strategy) {
        var d = DATA[strategy] || DATA.desktop;
        var cats = d.categories;
        var mets = d.perfMetrics;
        var errs = d.errors;
        var tbt  = mets.filter(function(m){return m.key==='TBT';})[0];

        // Performance -- jauge simple + tooltip metriques + erreurs
        var perfTooltip = ['── Métriques ──'].concat(
            mets.map(function(m){
                var icon = m.score >= 0.9 ? '\u2713' : m.score >= 0.5 ? '\u26a0' : '\u2717';
                return icon + ' ' + m.key + ' : ' + m.value + '  (poids ' + m.weight + ')';
            })
        ).concat(['── Problèmes ──']).concat(
            errs.performance.map(function (e) { return '\u2717 ' + e; })
        );
        var c0 = buildGauge('gauge-performance', cats.performance.emoji, cats.performance.score,
            'TBT : ' + (tbt ? tbt.value : '\u2014'),
            perfTooltip
        );
        if (c0) drawSimple(c0, cats.performance.score);

        // Accessibilite
        var a = cats.accessibility;
        var accTooltip = [].concat(errs.accessibility.length
            ? ['── Problèmes ──'].concat(errs.accessibility.map(function (e) { return '\u2717 ' + e; }))
            : ['✅ Aucune erreur détectée']
        );
        var c1 = buildGauge('gauge-accessibility', cats.accessibility.emoji, a.score,
            errs.accessibility.length + ' erreur' + (errs.accessibility.length > 1 ? 's' : ''),
            accTooltip
        );
        if (c1) drawSimple(c1, a.score);

        // Best Practices
        var c2 = buildGauge('gauge-best-practices', cats.practices.emoji, cats.practices.score,
            '0 erreur', ['✅ Aucune erreur détectée']);
        if (c2) drawSimple(c2, cats.practices.score);

        // SEO
        var c3 = buildGauge('gauge-seo', cats.seo.emoji, cats.seo.score,
            '0 erreur', ['✅ Aucune erreur détectée']);
        if (c3) drawSimple(c3, cats.seo.score);

        var notice = document.getElementById('perf-notice');
        if (notice) notice.textContent = 'Scores Lighthouse v10 du ' + d.date + ', ';
        var mc = document.getElementById('perf-metrics');
        if (mc) mc.innerHTML = '';
    }

    var currentStrategy = 'desktop';

    document.querySelectorAll('.perf-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            var strategy = btn.dataset.strategy;
            if (strategy === currentStrategy) return;
            currentStrategy = strategy;
            document.querySelectorAll('.perf-btn').forEach(function(b){ b.classList.remove('perf-btn--active'); });
            btn.classList.add('perf-btn--active');
            var lbl = document.getElementById('perf-strategy-label');
            if (lbl) lbl.textContent = strategy==='desktop'?'\u2014 Desktop':'\u2014 Mobile';
            render(strategy);
        });
    });

    function init() {
        var section = document.getElementById('expertise');
        if (!section) { render(currentStrategy); return; }
        var obs = new IntersectionObserver(function(entries){
            if (entries[0].isIntersecting) { obs.disconnect(); render(currentStrategy); }
        },{ threshold:0.05 });
        obs.observe(section);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
