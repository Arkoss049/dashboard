// Contenu Final et Réactif pour js/modules/plan.js

function initPlanPanel() {
    const root = document.getElementById('plan-panel');
    if (!root) return;

    const $ = sel => root.querySelector(sel);
    const els = { view: $('.view'), year: $('.year'), month: $('.month'), monthContainers: root.querySelectorAll('.month-container'), goal: $('.goal'), mgoal: $('.mgoal'), saveGoals: $('.saveGoals'), mode: $('.mode'), weeks: $('.weeks'), exportBtn: $('.export'), resetBtn: $('.reset'), msum: $('.msum'), mgoal_view: $('.mgoal_view'), mpct: $('.mpct'), mbar: $('.mbar'), ytdsum: $('.ytdsum'), goal_view: $('.goal_view'), ypct: $('.ypct'), ybar: $('.ybar'), autoMGoalToggle: $('.auto-mgoal-toggle') };

    const fmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    // --- Helpers et Gestion des Données ---
    function round0(x){ return Math.round(Number(x)||0); }
    function isoWeeksForMonth(year, monthIndex){
        const first = new Date(year, monthIndex, 1);
        const last = new Date(year, monthIndex, 0).getDate() + daysInMonth(year, monthIndex);
        const start = new Date(first);
        start.setDate(start.getDate() - (start.getDay() + 6) % 7);
        const end = new Date(last);
        end.setDate(end.getDate() + (7 - end.getDay()) % 7);
        
        const out = [];
        for(let d = start; d < end; d.setDate(d.getDate() + 7)){
            const isoYear = new Date(d.getTime() + 3 * 24 * 3600 * 1000).getFullYear();
            const startOfYear = new Date(isoYear, 0, 1);
            const weekNum = Math.ceil((((d - startOfYear) / 86400000) + 1) / 7);
            const s = new Date(d);
            const e = new Date(d);
            e.setDate(e.getDate()+6);
            out.push({ isoYear: isoYear, isoWeek: weekNum, start: s.toISOString().slice(0,10), end: e.toISOString().slice(0,10), key: `${isoYear}-W${String(weekNum).padStart(2,'0')}` });
        }
        return out;
    }
    function loadPrevData(){ try{ const j = localStorage.getItem('prev.data'); return j? JSON.parse(j): []; }catch(e){ return []; } }
    function sumAnnualInMonth(data, year, month){
        const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
        return round0(data.reduce((sum, currentItem) => {
            if ((currentItem.date || '').startsWith(ym)) {
                return sum + (Number(currentItem.annual) || 0);
            }
            return sum;
        }, 0));
    }
    const k = (type, key) => `plan.${type}.${key}`;
    function loadVal(type, key, def = 0){ return round0(localStorage.getItem(k(type,key))||def); }
    function saveVal(type, key, val){ localStorage.setItem(k(type, key), String(round0(val))); }

    // --- Initialisation de l'UI ---
    const now = new Date(); const curYear = now.getFullYear();
    const years = Array.from(new Set([curYear-1, curYear, curYear+1, ...loadPrevData().map(r => (r.date||'').slice(0,4)).filter(Boolean).map(Number)])).sort((a,b)=>a-b);
    els.year.innerHTML = years.map(y=> `<option value="${y}">${y}</option>`).join('');
    els.year.value = String(loadVal('state','year', curYear));
    
    function fillMonthSelect(){
        const y = Number(els.year.value);
        els.month.innerHTML = Array.from({length:12},(_,i)=>`<option value="${y}-${String(i+1).padStart(2,'0')}">${new Date(y,i).toLocaleString('fr-FR', {month:'long'})}</option>`).join('');
        const savedMonth = localStorage.getItem(k('state', 'month')) || `${curYear}-${String(now.getMonth()+1).padStart(2,'0')}`;
        els.month.value = savedMonth.startsWith(String(y)) ? savedMonth : `${y}-01`;
    }
    
    // --- Rendu et Calculs ---
    function renderWeeks(){
        const view = els.view.value, ym = els.month.value;
        const [ySel, mSel] = ym.split('-').map(Number);
        const wdefs = isoWeeksForMonth(ySel, mSel-1);
        const vals = loadArr('month', ym);

        const mgoal = round0(els.mgoal.value);
        const weeklyGoal = wdefs.length > 0 ? round0(mgoal / wdefs.length) : 0;

        els.weeks.innerHTML = wdefs.map((w,idx)=>{
            const v = round0(vals[idx]||0);
            const isGoalReached = v >= weeklyGoal && weeklyGoal > 0;
            const goalCheckHTML = `<span class="goal-check" style="font-size:1.2em; color:${isGoalReached ? 'var(--accent-green, #22c55e)' : 'var(--muted, #94a3b8)'};">${isGoalReached ? '✅' : '⬜️'}</span>`;
            
            return `<div class="week-row" data-idx="${idx}">
                        <div class="wk-label"><strong>S${w.isoWeek}</strong><small>${w.start} → ${w.end}</small></div>
                        <input class="wk-val" type="number" value="${v}" />
                        ${goalCheckHTML}
                    </div>`;
        }).join('');
    }

    function recalc(){
        const autoOn = !!els.autoMGoalToggle && els.autoMGoalToggle.checked;
        const ym = els.month.value;
        const [ySel, mSel] = ym.split('-').map(Number);
        const prevData = loadPrevData();
        const agoal = round0(els.goal?.value || loadVal('goal', 'annual'));
        
        if (autoOn) {
            const ytdBeforeCurrentMonth = Array.from({length: mSel - 1}, (_, i) => sumAnnualInMonth(prevData, ySel, i)).reduce((a, b) => a + b, 0);
            const remainingGoal = agoal - ytdBeforeCurrentMonth;
            const monthsRemaining = 12 - (mSel - 1);
            const newMGoal = monthsRemaining > 0 ? round0(remainingGoal / monthsRemaining) : 0;
            els.mgoal.value = newMGoal > 0 ? newMGoal : 0;
        }
        
        const msum = loadArr('month', ym).reduce((s,x)=> s+x, 0);
        const mgoal = round0(els.mgoal.value);
        
        els.mgoal_view.textContent = fmt0.format(mgoal);
        const mpct = mgoal > 0 ? (msum/mgoal*100) : 0;
        els.msum.textContent = fmt0.format(msum);
        els.mpct.textContent = `${mpct.toFixed(1)}%`;
        
        let ytd = 0;
        for(let mm=1; mm<=12; mm++){ const ymx = `${ySel}-${String(mm).padStart(2,'0')}`; ytd += loadArr('month', ymx).reduce((s,x)=>s+x,0); }
        
        els.goal_view.textContent = fmt0.format(agoal);
        const ypct = agoal > 0 ? (ytd/agoal*100) : 0;
        els.ytdsum.textContent = fmt0.format(ytd);
        els.ypct.textContent = `${ypct.toFixed(1)}%`;
        
        renderWeeks();
    }

    // --- Événements ---
    function onViewChange(){
        localStorage.setItem(k('state','view'), els.view.value);
        recalc();
    }
    
    els.view.addEventListener('change', onViewChange);
    els.year.addEventListener('change', () => { saveVal('state', 'year', els.year.value, 0); fillMonthSelect(); recalc(); });
    els.month.addEventListener('change', () => { localStorage.setItem(k('state','month'), els.month.value); if (!els.autoMGoalToggle || !els.autoMGoalToggle.checked) { els.mgoal.value = loadVal('goal', els.month.value) || ''; } recalc(); });
    
    if (els.goal) els.goal.addEventListener('input', recalc);
    if (els.autoMGoalToggle) {
        els.autoMGoalToggle.addEventListener('change', recalc);
    }
    
    // Initialisation
    fillMonthSelect();
    const savedView = localStorage.getItem(k('state','view'));
    if (savedView) els.view.value = savedView;
    
    els.goal.value = loadVal('goal', 'annual') || '';
    onViewChange();
}
