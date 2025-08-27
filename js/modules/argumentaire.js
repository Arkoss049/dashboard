// Contenu pour js/modules/argumentaire.js

function initArgumentairePanel() {
    const root = document.getElementById('argumentaire-panel');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    
    const $ = sel => root.querySelector(sel);
    const els = {
        q: $('.q'), prod: $('.prod'), sit: $('.sit'),
        add: $('.add'), cardsContainer: $('.cards')
    };

    // Base de données interne des argumentaires
    const DATA_FROM_PDF = [{"product": "Santé", "situation": "Famille", "objection": "C'est trop cher, j'ai déjà trop de dépenses.", "response": "Je comprends que le budget soit une contrainte. Nos formules sont justement modulables : vous pouvez choisir une garantie adaptée pour maîtriser le coût tout en couvrant l'essentiel. Mieux vaut une petite cotisation qu'une grosse dépense imprévue.", "punchline": "Mieux vaut investir un peu dans sa santé que de risquer beaucoup à la négliger."},
                           {"product": "Garantie Accidents de la Vie (GAV)", "situation": "Famille", "objection": "On est déjà assurés pour tout : voiture, habitation...", "response": "L'assurance auto ou habitation ne vous couvre pas pour les accidents de la vie courante. La GAV intervient pour les accidents domestiques ou de loisirs que les autres assurances n'indemnisent pas. C'est une protection essentielle pour des risques bien réels.", "punchline": "La GAV couvre ce que les autres n'assurent pas."},
                           {"product": "Assurance Décès", "situation": "Famille", "objection": "Je suis jeune, j'ai le temps avant de penser à ça.", "response": "Personne n'envisage de partir jeune. Mais souscrire tôt coûte très peu cher et sécurise l'avenir de vos proches quoi qu'il arrive. C'est une protection précoce qui fait toute la différence en cas de coup dur.", "punchline": "On attache sa ceinture sans prévoir d'accident, on assure sa famille sans prévoir de partir trop tôt."},
                           {"product": "Plan Épargne Retraite (PER)", "situation": "Famille", "objection": "L'argent est bloqué jusqu'à la retraite.", "response": "C'est un coffre-fort pour vos vieux jours, mais avec une clé de secours. En cas de coup dur (achat de résidence principale, invalidité, chômage...), vous pouvez récupérer vos fonds de manière anticipée.", "punchline": "Votre épargne est en sécurité, pas en prison."},
                           {"product": "Assurance Vie", "situation": "Sénior", "objection": "J'ai plus de 70 ans, l'avantage fiscal pour la succession ne s'applique plus.", "response": "C'est vrai pour les nouveaux versements, mais les intérêts générés restent exonérés de droits de succession. L'assurance vie garde ses atouts : vous désignez qui reçoit l'argent, et le versement est rapide, sans attendre le règlement de toute la succession.", "punchline": "Même après 70 ans, l'assurance vie vous donne un coup d'avance."}];

    const STORAGE_KEY = 'arg.cards.v1';
    const loadCards = () => { try { const j = localStorage.getItem(STORAGE_KEY); return j ? JSON.parse(j) : DATA_FROM_PDF; } catch (e) { return DATA_FROM_PDF; } };
    const saveCards = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    let cards = loadCards();

    function fillFilters() {
        const products = Array.from(new Set(cards.map(c => c.product))).filter(Boolean).sort();
        els.prod.innerHTML = ['<option value="">Tous produits</option>', ...products.map(p => `<option>${p}</option>`)].join('');
        const situations = Array.from(new Set(cards.map(c => c.situation))).filter(Boolean).sort();
        els.sit.innerHTML = ['<option value="">Toutes situations</option>', ...situations.map(s => `<option>${s}</option>`)].join('');
    }
    
    function esc(s){ return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c)); }

    function render() {
        const q = (els.q.value || '').toLowerCase();
        const prod = els.prod.value || '';
        const sit = els.sit.value || '';
        const filtered = cards.filter(c => {
            const hay = (c.product + ' ' + c.situation + ' ' + c.objection + ' ' + c.response + ' ' + c.punchline).toLowerCase();
            if (q && !hay.includes(q)) return false;
            if (prod && c.product !== prod) return false;
            if (sit && c.situation !== sit) return false;
            return true;
        });

        els.cardsContainer.innerHTML = filtered.map((c, idx) => `
          <article class="card" data-idx="${idx}" style="display:flex; flex-direction:column; gap:12px;">
            <div class="row" style="justify-content:space-between; align-items:center">
              <div style="display:flex; gap:6px; flex-wrap:wrap">
                <span class="badge" style="background-color: var(--elev); border-color: var(--border);">${esc(c.product)}</span>
                <span class="badge" style="background-color: var(--elev); border-color: var(--border);">${esc(c.situation)}</span>
              </div>
              <div class="actions">
                <button class="btn btn-ghost edit" data-idx="${idx}">✏️</button>
                <button class="btn btn-danger del" data-idx="${idx}">🗑️</button>
              </div>
            </div>
            <div>
              <div class="small" style="opacity:.8; text-transform:uppercase; letter-spacing:.08em">Objection</div>
              <div style="font-weight:700; color: var(--text);">${esc(c.objection)}</div>
            </div>
            <div>
              <div class="small" style="opacity:.8; text-transform:uppercase; letter-spacing:.08em">Réponse</div>
              <div class="note">${esc(c.response)}</div>
            </div>
            <div>
              <div class="small" style="opacity:.8; text-transform:uppercase; letter-spacing:.08em">Punchline</div>
              <div style="font-style:italic; color: var(--accent-orange);">${esc(c.punchline)}</div>
            </div>
          </article>
        `).join('');
    }

    function promptCard(initial = {}) {
        const base = { product: '', situation: '', objection: '', response: '', punchline: '' , ...initial };
        const product = prompt('Produit (ex: Santé, GAV)', base.product); if(product === null) return null;
        const situation = prompt('Situation (ex: Famille, Sénior)', base.situation); if(situation === null) return null;
        const objection = prompt('Objection du client', base.objection); if(objection === null) return null;
        const response = prompt('Votre réponse', base.response); if(response === null) return null;
        const punchline = prompt('La punchline (phrase-clé)', base.punchline); if(punchline === null) return null;
        return { product, situation, objection, response, punchline };
    }

    els.cardsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const cardElement = btn.closest('.card');
        const originalIndex = cards.findIndex(c => c.objection === cardElement.querySelector('div[style*="font-weight:700"]').textContent);

        if (btn.classList.contains('del')) {
            if (confirm('Supprimer cette carte ?')) {
                cards.splice(originalIndex, 1);
                saveCards(cards);
                render();
                fillFilters();
            }
        } else if (btn.classList.contains('edit')) {
            const edited = promptCard(cards[originalIndex]);
            if (edited) {
                cards[originalIndex] = edited;
                saveCards(cards);
                render();
                fillFilters();
            }
        }
    });
    
    els.add.addEventListener('click', () => {
        const c = promptCard({product: els.prod.value, situation: els.sit.value});
        if (c && c.objection && c.response) {
            cards.unshift(c);
            saveCards(cards);
            render();
            fillFilters();
        }
    });

    [els.q, els.prod, els.sit].forEach(el => el.addEventListener('input', render));

    fillFilters();
    render();
}
