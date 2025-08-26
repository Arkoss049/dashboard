// Contenu pour js/modules/plan.js

function initPlanPanel() {
    const root = document.getElementById('plan-panel');
    if (!root) {
        console.error("L'élément racine pour le panneau Plan d'Action est introuvable.");
        return;
    }

    const $ = sel => root.querySelector(sel);
    const els = { view: $('.view'), year: $('.year'), month: $('.month'), monthContainers: root.querySelectorAll('.month-container'), goal: $('.goal'), mgoal: $('.mgoal'), saveGoals: $('.saveGoals'), mode: $('.mode'), weeks: $('.weeks'), exportBtn: $('.export'), resetBtn: $('.reset'), msum: $('.msum'), mgoal_view: $('.mgoal_view'), mpct: $('.mpct'), mbar: $('.mbar'), ytdsum: $('.ytdsum'), goal_view: $('.goal_view'), ypct: $('.ypct'), ybar: $('.ybar') };

    // --- Helpers pour les dates et semaines ISO ---
    function ymd(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
    function clone(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function addDays(d, n){ const r = clone(d); r.setDate(r.getDate()+n); return r; }
    function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
    function round0(x){ return Math.round(Number(x)||0); }
    function startOfISOWeek(d){ const r = clone(d); const day = (r.getDay()+6)%7; r.setDate(r.getDate()-day); return r; }
    function endOfISOWeek(d){ return addDays(startOfISOWeek(d),6); }
    function isoWeekYear(d){ const th = addDays(d, 3 - ((d.getDay()+6)%7)); return th.getFullYear(); }
    function isoWeekNumber(d){ const ws = startOfISOWeek(d); const th = addDays(d, 3 - ((d.getDay()+6)%7)); const jan4 = new Date(th.getFullYear(), 0, 4); const w1 = startOfISOWeek(jan4); const diffDays = Math.round((ws - w1)/86400000); return Math.floor(diffDays/7) + 1; }
    function isoWeeksForMonth(year, monthIndex){
        const first = new Date(year, monthIndex, 1); const last = new Date(year, monthIndex, daysInMonth(year, monthIndex));
        const start = startOfISOWeek(first); const end = endOfISOWeek(last);
        const out = [];
        for(let d = clone(start); d <= end; d = addDays(d,7)){
            out.push({ isoYear: isoWeekYear(d), isoWeek: isoWeekNumber(d), start: ymd(d), end: ymd(endOfISOWeek(d)), key: `${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2,'0')}` });
        }
        return out;
    }
    function isoWeeksForYear(year){
        let d = startOfISOWeek(new Date(year,0,4)); const out = [];
        while(isoWeekYear(d) === year){
            out.push({ isoYear: year, isoWeek: isoWeekNumber(d), start: ymd(d), end: ymd(endOfISOWeek(d)), key: `${year}-W${String(isoWeekNumber(d)).padStart(2,'0')}` });
            d = addDays(d,7);
        }
        return out;
    }

    // --- Gestion des données ---
    function loadPrevData(){ try{ const j = localStorage.getItem('prev.data'); return j? JSON.parse(j): []; }catch(e){ return []; } }
    function autoTotalsFor(weeks){
        const data = loadPrevData(); const map = new Map();
        for(const r of data){
            if(!(r.date||'').trim()) continue;
            try {
                const d = new Date(r.date);
                const key = `${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2,'0')}`;
                map.set(key, (map.get(key)||0) + (Number(r.annual)||0));
            } catch(e) { continue; }
        }
        return weeks.map(w => round0(map.get(w.key)||0));
    }
    function sumAnnualInMonth(data, year, month){ const ym = `${year}-${String(month+1).padStart(2,'0')}`; return round0(data.reduce((s,d)=> s + ((d.date||'').startsWith(ym) ? (Number(d.annual)||0) : 0), 0)); }
    const k = (type, key) => `plan.${type}.${key}`;
    function loadVal(type, key, def = 0){ return round0(localStorage.getItem(k(type,key))||def); }
    function saveVal(type, key, val){ localStorage.setItem(k(type, key), String(round0(val))); }
    function loadArr(type, key){ try{ const j=localStorage.getItem(k(type,key)); return j? JSON.parse(j).map(round0): []; }catch(e){ return []; } }
    function saveArr(type, key, arr){ localStorage.setItem(k(type,key), JSON.stringify(arr.map(round0))); }

    // --- Initialisation de l'UI ---
    const now = new Date(); const curYear = now.getFullYear(); const curMonth = now.getMonth();
    const years = Array.from(new Set([curYear-1, curYear, curYear+1, ...loadPrevData().map(r => (r.date||'').slice(0,4)).filter(Boolean).map(Number)])).sort((a,b)=>a-b);
    els.year.innerHTML = years.map(y=> `<option value="${y}">${y}</option>`).join('');
    els.year.value = String(loadVal('state','year', curYear));
    
    function fillMonthSelect(){
        const y = Number(els.year.value);
        els.month.innerHTML = Array.from({length:12},(_,i)=>`<option value="${y}-${String(i+1).padStart(2,'0')}">${new Date(y,i).toLocaleString('fr-FR', {month:'long'})}</option>`).join('');
        els.month.value = localStorage.getItem(k('state', 'month')) || `${y}-${String(curMonth+1).padStart(2,'0')}`;
    }
    
    // --- Rendu et Calculs ---
    function renderWeeks(){
        const view = els.view.value, mode = els.mode.value, yearSel = Number(els.year.value), ym = els.month.value;
        const [ySel, mSel] = ym.split('-').map(Number);
        const wdefs = view==='mois' ? isoWeeksForMonth(ySel, mSel-1) : isoWeeksForYear(yearSel);
        const vals = mode==='auto' ? autoTotalsFor(wdefs) : (view==='mois' ? loadArr('month', ym) : loadArr('year', yearSel));
        while(vals.length < wdefs.length) vals.push(0);

        els.weeks.innerHTML = wdefs.map((w,idx)=>{
            const v = round0(vals[idx]||0);
            const input = mode==='auto' ? `<input data-week="${idx}" type="number" value="${v}" style="width:160px" disabled />` : `<input data-week="${idx}" type="number" value="${v}" style="width:160px" />`;
            return `<div class="row" style="gap:12px; align-items:center; margin-bottom: 8px;">
                <div class="small" style="width:320px; font-family:monospace;">S${String(w.isoWeek).padStart(2,'0')} : ${w.start} → ${w.end}</div>
                ${input}<span class="small">€</span>
            </div>`;
        }).join('');

        if(mode!=='auto'){
            els.weeks.querySelectorAll('input[type="number"]').forEach(inp=>{
                inp.addEventListener('input', ()=>{
                    const current = Array.from(els.weeks.querySelectorAll('input')).map(x=> round0(x.value||0));
                    if(view==='mois'){ saveArr('month', ym, current); } else { saveArr('year', yearSel, current); }
                    recalc();
                });
            });
        }
    }

    function recalc(){
        const view = els.view.value, mode = els.mode.value, ym = els.month.value;
        const [ySel, mSel] = ym.split('-').map(Number); const yearSel = Number(els.year.value);
        const wdefs = view==='mois' ? isoWeeksForMonth(ySel, mSel-1) : isoWeeksForYear(yearSel);
        const vals = (mode==='auto' ? autoTotalsFor(wdefs) : (view==='mois' ? loadArr('month', ym) : loadArr('year', yearSel))).map(round0);
        
        const msum = vals.reduce((s,x)=> s+x, 0);
        const agoal = loadVal('goal', 'annual');
        const mgoal = loadVal('goal', ym, round0(agoal/12));
        
        els.mgoal_view.textContent = fmt0.format(mgoal);
        const mpct = mgoal > 0 ? (msum/mgoal*100) : 0;
        els.msum.textContent = fmt0.format(msum);
        els.mpct.textContent = `${mpct.toFixed(1)}%`;
        els.mbar.style.width = `${Math.min(100, mpct)}%`;
        els.mbar.style.background = mpct >= 100 ? 'var(--ok)' : 'var(--warn)';

        let ytd = 0;
        if(mode==='auto'){
            const prevData = loadPrevData();
            for(let mm=0; mm < (view==='mois' ? mSel : 12); mm++) { ytd += sumAnnualInMonth(prevData, yearSel, mm); }
        } else {
            if (view === 'mois') {
                 for(let mm=1; mm<=mSel; mm++){ const ymx = `${yearSel}-${String(mm).padStart(2,'0')}`; ytd += loadArr('month', ymx).reduce((s,x)=>s+x,0); }
            } else {
                ytd = loadArr('year', yearSel).reduce((s,x)=>s+x,0);
            }
        }
        
        els.goal_view.textContent = fmt0.format(agoal);
        const ypct = agoal > 0 ? (ytd/agoal*100) : 0;
        els.ytdsum.textContent = fmt0.format(ytd);
        els.ypct.textContent = `${ypct.toFixed(1)}%`;
        els.ybar.style.width = `${Math.min(100, ypct)}%`;
        els.ybar.style.background = ypct >= 100 ? 'var(--ok)' : 'var(--warn)';
    }

    // --- Événements ---
    function onViewChange(){
        const isMonthView = els.view.value === 'mois';
        els.monthContainers.forEach(el => el.style.display = isMonthView ? '' : 'none');
        saveVal('state', 'view', els.view.value, 0); // Save state
        renderWeeks();
        recalc();
    }
    
    els.view.addEventListener('change', onViewChange);
    els.year.addEventListener('change', () => { saveVal('state', 'year', els.year.value, 0); fillMonthSelect(); renderWeeks(); recalc(); });
    els.month.addEventListener('change', () => { localStorage.setItem(k('state','month'), els.month.value); const ym = els.month.value; els.mgoal.value = loadVal('goal', ym, round0(loadVal('goal', 'annual')/12)) || ''; renderWeeks(); recalc(); });
    els.mode.addEventListener('change', () => { renderWeeks(); recalc(); });
    els.saveGoals.addEventListener('click', ()=>{ saveVal('goal', 'annual', els.goal.value); saveVal('goal', els.month.value, els.mgoal.value); recalc(); alert('Objectifs enregistrés !'); });
    
    // Initialisation
    fillMonthSelect();
    els.goal.value = loadVal('goal', 'annual') || '';
    els.mgoal.value = loadVal('goal', els.month.value, round0(loadVal('goal', 'annual')/12)) || '';
    onViewChange();
}
