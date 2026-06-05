// =====================================================
// ADAPTER — GitHub API (RepoPort)
// Récupère les dépôts publics et les affiche dans la grille
// =====================================================

(async function fetchGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const USERNAME = 'WyloW2Ricard0';
    const API_URL = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6&type=public`;

    try {
        const response = await fetch(API_URL, {
            headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const repos = await response.json();
        const filtered = repos
            .filter(r => !r.fork && r.name !== `${USERNAME}.github.io`)
            .slice(0, 6);

        if (filtered.length === 0) {
            grid.innerHTML = '<p style="color:var(--color-muted)">Aucun projet public pour l\'instant.</p>';
            return;
        }

        grid.innerHTML = filtered.map(repo => `
            <a href="${escapeHtml(repo.html_url)}"
               target="_blank"
               rel="noopener noreferrer"
               class="project-card"
               title="${escapeHtml(repo.name)}">
                <div class="project-card__icon">📦</div>
                <h3>${escapeHtml(repo.name)}</h3>
                <p>${escapeHtml(repo.description || 'Aucune description.')}</p>
                <div class="project-card__meta">
                    ${repo.language ? `<span class="project-card__lang">${escapeHtml(repo.language)}</span>` : ''}
                    <span class="project-card__stars">${repo.stargazers_count}</span>
                </div>
            </a>
        `).join('');

    } catch {
        grid.innerHTML = `
            <p style="color:var(--color-muted)">
                Impossible de charger les projets.
                <a href="https://github.com/${USERNAME}?tab=repositories"
                   target="_blank" rel="noopener noreferrer">Voir sur GitHub →</a>
            </p>`;
    }
})();
