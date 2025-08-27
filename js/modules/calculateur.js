// Contenu Corrigé et Final pour js/modules/calculateur.js

function initCalculateurPanel() {
    const root = document.getElementById('calculateur-panel');
    if (!root) return;

    const fmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const $ = sel => root.querySelector(sel);
    const SAVE_PREFIX = 'v8.calc.';
    
    const els = { profile: $('.profile'), clearBtn: $('.clear'), ca_prev: $('.ca_prev'), pullPrev: $('.pullPrev'), nb_er: $('.nb_er'), ca_er: $('.ca_er'), b_prev: $('.b_prev'), b_er_c: $('.b_er_c'), b_er_e: $('.b_er_e'), surprev: $('.surprev'), surer: $('.surer'), q_neo: $('.q_neo'), q_multi: $('.q_multi'), coll_palier: $('.coll_palier'), calc: $('.calc'), ro_prev: $('.ro_prev'), ro_er_c: $('.ro_er_c'), ro_er_e: $('.ro_er_e'), ro_prev_badge: $('.ro_prev_badge'), ro_er_c_badge: $('.ro_er_c_badge'), ro_er_e_badge: $('.ro_er_e_badge'), prime_eco: $('.prime_eco'), prime_surperf: $('.prime_surperf'), prime_qual: $('.prime_qual'), prime_coll: $('.prime_coll'), total: $('.total'), details: $('.details') };
    
    const fieldsToSave = ['profile', 'ca_prev', 'nb_er', 'ca_er', 'b_prev', 'b_er_c', 'b_er_e', 'surprev', 'surer', 'q_neo', 'q_multi', 'coll_palier'];

    const PROFILES = { confirme: { obj_prev: 27000, obj_er: 11, obj_er_eur: 55000, b_prev: '80:750,85:1120,90:1490,95:1860,100:2240,105:2690,110:3030,115:3210,120:3390,125:3580', b_er: '80:160,85:240,90:320,95:400,100:480,105:575,110:645,115:685,120:725,125:765' }, qualifie: { obj_prev: 24000, obj_er: 6, obj_er_eur: 30000, b_prev: '80:650,85:980,90:1310,95:1640,100:1950,105:2340,110:2630,115:2790,120:2950,125:3110', b_er: '80:140,85:210,90:280,95:350,100:415,105:500,110:565,115:600,120:635,125:665' } };
    
    function setupPersistence() {
        fieldsToSave.forEach(fieldName => {
            const el = els[fieldName];
            if (el) {
                const savedValue = localStorage.getItem(SAVE_PREFIX + fieldName);
                if (savedValue !== null) {
                    el.value = savedValue;
                }
                el.addEventListener('input', () => {
                    localStorage.setItem(SAVE_PREFIX + fieldName, el.value);
                });
            }
        });
    }

    function applyProfile(key){ const pf = PROFILES[key] || PROFILES.confirme; ['b_prev', 'b_er_c', 'b_er_e'].forEach(k => { if(els[k]) els[k].value = k.includes('prev') ? pf.b_prev : pf.b_er; }); localStorage.setItem(SAVE_PREFIX + 'profile', key); compute(); }
    function setBadge(el,p){ const txt = p>=125 ? 'Surperf' : p>=100 ? 'OK' : p>=80 ? 'En bonne voie' : 'À la traîne'; el.textContent = txt; el.className = 'delta badge ' + (p>=125 ? 'badge-over' : p>=100 ? 'badge-ok' : p>=80 ? 'badge-warn' : ''); }
    function parseBarème(txt){ return (txt || '').split(',').map(s=>s.trim()).filter(Boolean).map(p => { const [k,v] = p.split(':').map(Number); return {k,v}; }).filter(x=>!isNaN(x.k)&&!isNaN(x.v)).sort((a,b)=>a.k-b.k); }
    function valueFromBarème(ro, arr){ let val=0; for(const it of arr){ if(ro >= it.k) val = it.v; else break; } return val; }
    
    function compute(){
        const caPrev = Number(els.ca_prev.value||0), nbER = Number(els.nb_er.value||0), caER = Number(els.ca_er.value||0);
        const pf = PROFILES[els.profile.value] || PROFILES.confirme;
        const objPrev = pf.obj_prev, objER = pf.obj_er, objEREur = pf.obj_er_eur;
        const roPrev = objPrev > 0 ? (caPrev/objPrev*100) : 0; const roERc = objER > 0 ? (nbER/objER*100) : 0; const roERe = objEREur > 0 ? (caER/objEREur*100) : 0;
        els.ro_prev.textContent = `${roPrev.toFixed(1)}%`; setBadge(els.ro_prev_badge, roPrev); els.ro_er_c.textContent = `${roERc.toFixed(1)}%`; setBadge(els.ro_er_c_badge, roERc); els.ro_er_e.textContent = `${roERe.toFixed(1)}%`; setBadge(els.ro_er_e_badge, roERe);
        const pPrev = valueFromBarème(roPrev, parseBarème(els.b_prev.value)); const pERc = valueFromBarème(roERc, parseBarème(els.b_er_c.value)); const pERe = valueFromBarème(roERe, parseBarème(els.b_er_e.value));
        const primeEco = pPrev + pERc + pERe;
        const perPrev = Number(els.surprev.value||100); const perER = Number(els.surer.value||20);
        const trPrev = roPrev>125 ? Math.floor((roPrev-125)/5) : 0; const trER = roERc>125 ? Math.floor((roERc-125)/5) : 0;
        const primeSurperf = trPrev*perPrev + trER*perER;
        const qNeo = Number(els.q_neo.value||0); const qMul = Number(els.q_multi.value||0);
        const primeQual = Math.round(primeEco * (qNeo + qMul) / 100);
        let primeColl = 0; const eligible = (roPrev>=65) || (roERc>=65) || (roERe>=65);
        if(eligible){ const pal = Number(els.coll_palier.value||0); primeColl = pal===1 ? 280 : pal===2 ? 555 : pal===3 ? 885 : 0; }
        
        // CORRECTION : On arrondit chaque total avant de l'afficher
        const total = Math.round(primeEco + primeSurperf + primeQual + primeColl);
        
        els.prime_eco.textContent = fmt0.format(Math.round(primeEco));
        els.prime_surperf.textContent = fmt0.format(Math.round(primeSurperf));
        els.prime_qual.textContent = fmt0.format(primeQual);
        els.prime_coll.textContent = fmt0.format(primeColl);
        els.total.textContent = fmt0.format(total);

        const state = { caPrev, objPrev, nbER, objER, caER, objEREur, roPrev, roERc, roERe, total };
        localStorage.setItem(SAVE_PREFIX + 'lastCalc', JSON.stringify(state));
        els.details.value = [`Profil: ${pf.label}`,`Objectifs: Prév(${fmt0.format(objPrev)}), ER Ctr(${objER}), ER CA(${fmt0.format(objEREur)})`,'---', `R/O Prév: ${roPrev.toFixed(1)}% -> Prime ${fmt0.format(pPrev)}`, `R/O ER Ctr: ${roERc.toFixed(1)}% -> Prime ${fmt0.format(pERc)}`, `R/O ER CA: ${roERe.toFixed(1)}% -> Prime ${fmt0.format(pERe)}`, `Surperf: ${fmt0.format(primeSurperf)}`, `Qualitatif: +${qNeo+qMul}% -> ${fmt0.format(primeQual)}`, `Collectif: ${fmt0.format(primeColl)}`, `TOTAL: ${fmt0.format(total)}`].join('\n');
    }

    // --- Initialisation et Événements ---
    setupPersistence();
    const savedProfile = localStorage.getItem(SAVE_PREFIX+'profile') || 'confirme'; 
    els.profile.value = savedProfile; 
    applyProfile(savedProfile);
    
    els.profile.addEventListener('change', (e)=> applyProfile(e.target.value)); 
    els.calc.addEventListener('click', compute);
    els.clearBtn.addEventListener('click', () => { 
        if(confirm('Réinitialiser les paramètres de cet onglet ?')){ 
            fieldsToSave.forEach(fieldName => {
                localStorage.removeItem(SAVE_PREFIX + fieldName);
            });
            location.reload();
        }
    });
    
    const autoImportedCaPrev = localStorage.getItem(SAVE_PREFIX + 'ca_prev');
    if (autoImportedCaPrev) {
        els.ca_prev.value = autoImportedCaPrev;
    }

    compute();
}
