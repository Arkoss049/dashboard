function initGlobalPanel() {
    const root = document.getElementById('global-panel');
    if (!root) return;

    const $ = sel => root.querySelector(sel);
    const els = { printBtn: $('.print'), pullBtn: $('.pull'), ro_global: $('.ro_global'), ro_global_badge: $('.ro_global_badge'), ca_prev: $('.ca_prev'), obj_prev: $('.obj_prev'), er_c: $('.er_c'), obj_er: $('.obj_er'), ca_er: $('.ca_er'), obj_er_eur: $('.obj_er_eur'), prime_total: $('.prime_total') };
    
    const CALC_DATA_KEY = 'v8.calc.lastCalc';

    els.printBtn.addEventListener('click', ()=> window.print());
    els.pullBtn.addEventListener('click', fillFromLast);

    function setBadge(el,p){ 
        const txt = p>=125? 'Surperf' : p>=100? 'OK' : p>=80? 'En bonne voie' : 'À la traîne'; 
        el.textContent = txt; 
        el.className = 'delta badge ' + (p>=125? 'badge-over' : p>=100? 'badge-ok' : p>=80? 'badge-warn' : ''); 
    }

    function fillFromLast(){
        const raw = localStorage.getItem(CALC_DATA_KEY);
        if(!raw){
            alert('Aucune simulation trouvée. Allez dans l’onglet Calculateur et cliquez sur "Calculer la Prime".');
            return;
        }
        const s = JSON.parse(raw);
        const roGlobal = (s.roPrev + s.roERc + s.roERe) / 3;

        els.ro_global.textContent = `${roGlobal.toFixed(1)}%`;
        setBadge(els.ro_global_badge, roGlobal);
        
        els.ca_prev.textContent = fmt0.format(s.caPrev); 
        els.obj_prev.textContent = fmt0.format(s.objPrev);
        
        els.er_c.textContent = `${s.nbER} contrats`; 
        els.obj_er.textContent = `${s.objER} contrats`;
        
        els.ca_er.textContent = fmt0.format(s.caER); 
        els.obj_er_eur.textContent = fmt0.format(s.objEREur);
        
        els.prime_total.textContent = fmt0.format(s.total);
    }

    fillFromLast();
}
