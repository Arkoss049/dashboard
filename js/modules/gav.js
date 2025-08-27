// Contenu Complet et Final pour js/modules/gav.js

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

    // BASE DE DONNÉES COMPLÈTE DES CAS GAV
    const CASES = [
        {"id": "E1", "cible": "Famille", "titre": "Enfant – brûlure eau bouillante", "emoji": "🔥", "resume": "Brûlures 2e degré, greffe, cicatrices.", "sans": 500, "avec": 42440, "tags": ["Hôpital", "Cicatrices", "Greffe"]},
        {"id": "E2", "cible": "Famille", "titre": "Enfant – fracture du bras", "emoji": "🦴", "resume": "Fracture opérée avec broches, rééducation.", "sans": 200, "avec": 150, "tags": ["Plâtre", "Chirurgie", "IP<5%"]},
        {"id": "E3", "cible": "Famille", "titre": "Enfant – dent cassée (vélo)", "emoji": "🦷", "resume": "Chute; incisive définitive cassée.", "sans": 300, "avec": 0, "tags": ["Prothèse dentaire", "IP<5%"]},
        {"id": "E4", "cible": "Famille", "titre": "Enfant – coupure profonde (main)", "emoji": "✂️", "resume": "Coupure profonde suturée (sans section tendineuse).", "sans": 100, "avec": 22400, "tags": ["Sutures", "Cicatrice"]},
        {"id": "A1", "cible": "Ado", "titre": "Ado – rupture LCA (sport)", "emoji": "🤾", "resume": "Chirurgie + rééduc; année scolaire perturbée.", "sans": 1000, "avec": 33440, "tags": ["Chirurgie", "Perte année scolaire"]},
        {"id": "A2", "cible": "Ado", "titre": "Ado – fracture du poignet", "emoji": "🛼", "resume": "Chirurgie + orthèse; légère raideur.", "sans": 200, "avec": 100, "tags": ["Plâtre", "Cicatrice", "IP<5%"]},
        {"id": "A5", "cible": "Ado", "titre": "Ado – chute VTT (clavicule)", "emoji": "🚲", "resume": "Fracture de la clavicule; petite cicatrice.", "sans": 200, "avec": 22400, "tags": ["Cicatrice", "Rééduc"]},
        {"id": "P1", "cible": "Adulte", "titre": "Parent – chute d’échelle", "emoji": "🪜", "resume": "Fracture lombaire, séquelles dos, arrêt 6 mois.", "sans": 4000, "avec": 84100, "tags": ["Arrêt pro", "Rééduc"]},
        {"id": "P2", "cible": "Adulte", "titre": "Parent – fracture humérus", "emoji": "💪", "resume": "Chirurgie + plaque; mobilité réduite.", "sans": 1500, "avec": 27580, "tags": ["Ostéosynthèse", "Cicatrice bras"]},
        {"id": "P3", "cible": "Adulte", "titre": "Parent – fracture cheville", "emoji": "🦶", "resume": "Opération + vis; rééduc; boiterie légère.", "sans": 2000, "avec": 23550, "tags": ["Vis/plaques", "Rééduc 3 mois"]},
        {"id": "P4", "cible": "Adulte", "titre": "Parent – fracture vertèbre", "emoji": "🏚️", "resume": "Fracture (hors hernie); douleurs résiduelles.", "sans": 3000, "avec": 45050, "tags": ["Chute hauteur", "Rééduc dos"]},
        {"id": "P5", "cible": "Adulte", "titre": "Parent – trottinette (dents)", "emoji": "🛴", "resume": "Chute sans tiers; 4 incisives cassées; couronnes.", "sans": 1970, "avec": 26050, "tags": ["Dentaire", "EDP"]},
        {"id": "S1", "cible": "Senior", "titre": "75 ans – fracture col fémur", "emoji": "🦴", "resume": "Prothèse, boiterie, adaptation douche.", "sans": 1500, "avec": 34150, "tags": ["Prothèse", "Aménagement"]},
        {"id": "S2", "cible": "Senior", "titre": "72 ans – polytrauma + aide humaine", "emoji": "♿", "resume": "Paraplégie incomplète, fauteuil, gros travaux.", "sans": 35000, "avec": 705375, "tags": ["Tierce personne", "Invalidité lourde"]},
        {"id": "S4", "cible": "Senior", "titre": "80 ans – perte de dents", "emoji": "🦷", "resume": "Édentation partielle; prothèses complètes.", "sans": 1500, "avec": 12700, "tags": ["Prothèse dentaire", "Abattement âge"]}
    ];

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
                <div class="actions" style="margin-top: 10px; flex-wrap: wrap; gap: 6px;">
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
