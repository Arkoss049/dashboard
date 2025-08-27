// Contenu pour js/modules/gav.js

function initGavPanel() {
    const root = document.getElementById('gav-panel');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';

    const fmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const $ = sel => root.querySelector(sel);
    const els = {
        grid: $('.gav-grid'),
        empty: $('.gav-empty'),
        cible: $('.gav-cible'),
        search: $('.gav-search')
    };

    const CASES = [{"id": "E1", "cible": "Famille", "titre": "Enfant – brûlure", "emoji": "🔥", "resume": "Brûlures 2e degré profond, greffe, cicatrices.", "sans": 500, "avec": 36640, "tags": ["Hôpital", "Cicatrices"]}, {"id": "P1", "cible": "Adulte", "titre": "Parent – chute d’échelle", "emoji": "🪜", "resume": "Fracture lombaire, séquelles dos, arrêt 6 mois.", "sans": 4000, "avec": 84600, "tags": ["Arrêt pro", "Rééduc"]}, {"id": "A1", "cible": "Ado", "titre": "Ado – rupture LCA (sport)", "emoji": "🤾", "resume": "Chirurgie + rééduc; année scolaire perturbée.", "sans": 1000, "avec": 33440, "tags": ["Chirurgie", "Perte année scolaire"]}, {"id": "P5", "cible": "Adulte", "titre": "Parent – trottinette (dents)", "emoji": "🛴", "resume": "Chute sans tiers; 4 incisives cassées; couronnes.", "sans": 1970, "avec": 24050, "tags": ["Dentaire", "EDP"]}, {"id": "S1", "cible": "Senior", "titre": "75 ans – fracture col du fémur", "emoji": "🦴", "resume": "Prothèse, boiterie, adaptation douche.", "sans": 1500, "avec": 34150, "tags": ["Prothèse", "Aménagement"]}, {"id": "S2", "cible": "Senior", "titre": "72 ans – polytrauma + aide humaine", "emoji": "♿", "resume": "Paraplégie incomplète, fauteuil, gros travaux.", "sans": 35000, "avec": 675375, "tags": ["Tierce personne", "Invalidité lourde"]}];

    function render() {
        const q = (els.search.value || '').toLowerCase().trim();
        const cible = els.cible.value;
        let arr = CASES;

        if (cible !== 'all') {
            arr = arr.filter(x => x.cible === cible);
        }
        if (q) {
            arr = arr.filter(x => (x.titre + x.resume + (x.tags || []).join(' ')).toLowerCase().includes(q));
        }
        
        els.grid.innerHTML = '';
        els.empty.style.display = arr.length === 0 ? 'block' : 'none';

        arr.forEach(c => {
            const card = document.createElement('article');
            card.className = 'card';
            const max = Math.max(1, c.sans, c.avec);
            const sansW = (c.sans / max * 100);
            const avecW = (c.avec / max * 100);

            card.innerHTML = `
                <div class="row" style="justify-content:space-between;">
                    <div style="font-weight:700;">${c.emoji} ${c.titre}</div>
                    <span class="badge" style="background-color: var(--elev); border-color: var(--border);">${c.cible}</span>
                </div>
                <p class="note" style="min-height: 3em;">${c.resume}</p>
                <div>
                    <div style="height:10px; border-radius:10px; background:var(--elev); position:relative; overflow:hidden; border:1px solid var(--border)">
                        <div style="position:absolute; left:0; top:0; height:100%; width:${sansW}%; background:var(--danger);"></div>
                        <div style="position:absolute; left:0; top:0; height:100%; width:${avecW}%; background:linear-gradient(90deg, var(--accent-green), var(--accent-blue)); opacity:0.8;"></div>
                    </div>
                    <div class="row" style="justify-content:space-between; font-size:12px; margin-top:4px;">
                        <span style="color:var(--danger)"><b>Sans GAV :</b> ${fmt0.format(c.sans)}</span>
                        <span><b>Avec GAV :</b> ${fmt0.format(c.avec)}</span>
                    </div>
                </div>
                <div class="actions" style="margin-top: 10px;">
                    ${(c.tags || []).map(t => `<span class="badge">${t}</span>`).join(' ')}
                </div>
            `;
            els.grid.appendChild(card);
        });
    }

    els.search.addEventListener('input', render);
    els.cible.addEventListener('change', render);
    render();
}
