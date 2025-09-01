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

    // Nouveaux éléments pour les boutons et la modale
    const imagePaths = {
        'btn-info-1': 'https://github.com/Arkoss049/dashboard/blob/main/DOCUMENTS/ma-protection-accident.png?raw=true',
        'btn-info-2': 'https://raw.githubusercontent.com/Arkoss049/dashboard/refs/heads/main/DOCUMENTS/frise%20accident.jfif'
    };
    const overlay = document.getElementById('gav-modal-overlay');
    const modalImage = document.getElementById('gav-modal-image');
    const closeBtn = document.querySelector('.gav-modal-close');
    const infoBtns = root.querySelectorAll('.btn-info');

    function showImage(imageSrc) {
        modalImage.src = imageSrc;
        overlay.style.display = 'flex';
    }

    function hideModal() {
        overlay.style.display = 'none';
    }

    infoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const imageSrc = imagePaths[btn.id];
            if (imageSrc) {
                showImage(imageSrc);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', hideModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideModal();
            }
        });
    }

    const CASES = [
        {"id": "E1", "cible": "Famille", "titre": "Enfant – brûlure eau bouillante", "emoji": "🔥", "resume": "Brûlures 2e degré, greffe, cicatrices.", "sans": 500, "avec": { "total": 42440, "ip": 29440, "souff": 6500, "esth": 6500 }, "tags": ["Hôpital", "Cicatrices", "Greffe"]},
        {"id": "P1", "cible": "Adulte", "titre": "Parent – chute d’échelle", "emoji": "🪜", "resume": "Fracture lombaire, séquelles dos, arrêt 6 mois.", "sans": 4000, "avec": { "total": 84100, "ip": 73600, "souff": 6500, "pertesRevenus": 4000 }, "tags": ["Arrêt pro", "Rééduc"]},
        {"id": "A1", "cible": "Ado", "titre": "Ado – rupture LCA (sport)", "emoji": "🤾", "resume": "Chirurgie + rééduc; année scolaire perturbée.", "sans": 1000, "avec": { "total": 33640, "ip": 29440, "souff": 4000, "hosp": 200 }, "tags": ["Chirurgie", "Perte année scolaire"]},
        {"id": "P5", "cible": "Adulte", "titre": "Parent – trottinette (dents)", "emoji": "🛴", "resume": "Chute sans tiers; 4 incisives cassées; couronnes.", "sans": 1970, "avec": { "total": 26050, "ip": 22080, "souff": 2000, "prothese": 1970 }, "tags": ["Dentaire", "EDP"]},
        {"id": "S1", "cible": "Senior", "titre": "75 ans – fracture col fémur", "emoji": "🦴", "resume": "Prothèse, boiterie, adaptation douche.", "sans": 1500, "avec": { "total": 34150, "ip": 27600, "souff": 4000, "esth": 1000, "hosp": 1050, "logement": 500 }, "tags": ["Prothèse", "Aménagement"]},
        {"id": "S2", "cible": "Senior", "titre": "72 ans – polytrauma + aide humaine", "emoji": "♿", "resume": "Paraplégie incomplète, fauteuil, gros travaux.", "sans": 35000, "avec": { "total": 705375, "ip": 637875, "souff": 31000, "hosp": 1500, "prothese": 5000, "logement": 30000 }, "tags": ["Tierce personne", "Invalidité lourde"]},
        {"id": "E2", "cible": "Famille", "titre": "Enfant – fracture du bras", "emoji": "🦴", "resume": "Fracture opérée, broches, rééducation.", "sans": 200, "avec": { "total": 0 }, "tags": ["Plâtre", "Chirurgie", "IP<5%"]},
        {"id": "E3", "cible": "Famille", "titre": "Enfant – dent cassée (vélo)", "emoji": "🦷", "resume": "Chute; incisive définitive cassée.", "sans": 300, "avec": { "total": 0 }, "tags": ["Prothèse dentaire", "IP<5%"]},
        {"id": "A2", "cible": "Ado", "titre": "Ado – fracture du poignet", "emoji": "🛼", "resume": "Chirurgie + orthèse; légère raideur.", "sans": 200, "avec": { "total": 0 }, "tags": ["Plâtre", "Cicatrice", "IP<5%"]},
        {"id": "A5", "cible": "Ado", "titre": "Ado – chute VTT (clavicule)", "emoji": "🚲", "resume": "Fracture de la clavicule; petite cicatrice.", "sans": 200, "avec": { "total": 22400, "ip": 18400, "souff": 3000, "esth": 1000 }, "tags": ["Cicatrice", "Rééduc"]},
        {"id": "P2", "cible": "Adulte", "titre": "Parent – fracture humérus", "emoji": "💪", "resume": "Chirurgie + plaque; mobilité réduite.", "sans": 1500, "avec": { "total": 27580, "ip": 22080, "souff": 3000, "esth": 1000, "pertesRevenus": 1500 }, "tags": ["Ostéosynthèse", "Cicatrice bras"]},
        {"id": "P3", "cible": "Adulte", "titre": "Parent – fracture cheville", "emoji": "🦶", "resume": "Opération + vis; rééduc; boiterie légère.", "sans": 2000, "avec": { "total": 23550, "ip": 18400, "souff": 3000, "hosp": 150, "pertesRevenus": 2000 }, "tags": ["Vis/plaques", "Rééduc 3 mois"]},
        {"id": "P4", "cible": "Adulte", "titre": "Parent – fracture vertèbre", "emoji": "🏚️", "resume": "Fracture (hors hernie); douleurs résiduelles.", "sans": 3000, "avec": { "total": 45050, "ip": 36800, "souff": 5000, "hosp": 250, "pertesRevenus": 3000 }, "tags": ["Chute hauteur", "Rééduc dos"]},
        {"id": "S3", "cible": "Senior", "titre": "70 ans – fracture poignet", "emoji": "💪", "resume": "Plaque + rééduc; faiblesse permanente.", "sans": 200, "avec": { "total": 25280, "ip": 22080, "souff": 3000, "hosp": 200 }, "tags": ["Ostéosynthèse", "Rééduc"]},
        {"id": "S4", "cible": "Senior", "titre": "80 ans – perte de dents", "emoji": "🦷", "resume": "Édentation partielle; prothèses complètes.", "sans": 1500, "avec": { "total": 12700, "ip": 9200, "souff": 2000, "prothese": 1500 }, "tags": ["Prothèse dentaire", "Abattement âge"]}
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
            const avecTotal = c.avec.total || 0;
            const max = Math.max(1, c.sans, avecTotal);
            const sansW = (c.sans / max * 100);
            const avecW = (avecTotal / max * 100);

            let detailsHTML = '';
            if (c.avec.ip) detailsHTML += `<li>IP: ${fmt0.format(c.avec.ip)}</li>`;
            if (c.avec.souff) detailsHTML += `<li>Souffrances: ${fmt0.format(c.avec.souff)}</li>`;
            if (c.avec.esth) detailsHTML += `<li>Esthétique: ${fmt0.format(c.avec.esth)}</li>`;
            if (c.avec.hosp) detailsHTML += `<li>Hospitalisation: ${fmt0.format(c.avec.hosp)}</li>`;
            if (c.avec.pertesRevenus) detailsHTML += `<li>Pertes revenus: ${fmt0.format(c.avec.pertesRevenus)}</li>`;
            if (c.avec.prothese) detailsHTML += `<li>Prothèse: ${fmt0.format(c.avec.prothese)}</li>`;
            if (c.avec.logement) detailsHTML += `<li>Logement: ${fmt0.format(c.avec.logement)}</li>`;

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
                        <span><b>Avec GAV :</b> ${fmt0.format(avecTotal)}</span>
                    </div>
                </div>
                <div class="actions" style="margin-top: 10px;">
                    <button class="btn btn-primary detail-btn">Voir le détail</button>
                    ${(c.tags || []).map(t => `<span class="badge">${t}</span>`).join(' ')}
                </div>
                <div class="details" style="display:none; margin-top:10px; border-top: 1px solid var(--border); padding-top:10px;">
                    <h4 class="section-title" style="font-size: 1em; margin-bottom: 8px;">Détail de l'indemnisation GAV</h4>
                    <ul style="margin:0; padding-left: 20px; font-size: 0.9em; color: var(--muted);">${detailsHTML}</ul>
                </div>
            `;
            els.grid.appendChild(card);
        });
    }

    els.grid.addEventListener('click', (e) => {
        if (e.target.classList.contains('detail-btn')) {
            const card = e.target.closest('.card');
            const details = card.querySelector('.details');
            if (details) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        }
    });

    els.search.addEventListener('input', render);
    els.cible.addEventListener('change', render);
    render();
}
