function initPlanPanel() {
    const root = document.getElementById('plan-panel');
    if (!root) return;
    const fmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const round0 = (x) => Math.round(Number(x) || 0);
    const $ = sel => root.querySelector(sel);
    const els = { view: $('.view'), year: $('.year'), month: $('.month'), monthContainers: root.querySelectorAll('.month-container'), goal: $('.goal'), mgoal: $('.mgoal'), saveGoals: $('.saveGoals'), mode: $('.mode'), weeks: $('.weeks'), exportBtn: $('.export'), resetBtn: $('.reset'), msum: $('.msum'), mgoal_view: $('.mgoal_view'), mpct: $('.mpct'), mbar: $('.mbar'), ytdsum: $('.ytdsum'), goal_view: $('.goal_view'), ypct: $('.ypct'), ybar: $('.ybar'), autoMGoalToggle: $('.auto-mgoal-toggle') };
    function ymd(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
    function clone(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function addDays(d, n){ const r = clone(d); r.setDate(r.getDate()+n); return r; }
    function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
    function startOfISOWeek(d){ const r = clone(d); const day = (r.getDay()+6)%7; r.setDate(r.getDate()-day); return r; }
    function isoWeekYear(d){ const th = addDays(d, 3 - ((d.getDay()+6)%7)); return th.getFullYear(); }
    function isoWeekNumber(d){ const ws = startOfISOWeek(d); const th = addDays(d, 3 - ((d.getDay()+6)%7)); const jan4 = new Date(th.getFullYear(), 0, 4); const w1 = startOfISOWeek(jan4); const diffDays = Math.round((ws - w1)/86400000); return Math.floor(diffDays/7) + 1; }
    function isoWeeksForMonth(year, monthIndex){ const first = new Date(year, monthIndex, 1); const last = new Date(year, monthIndex, daysInMonth(year, monthIndex)); const start = startOfISOWeek(first); const end = endOfISOWeek(last); const out = []; for(let d = clone(start); d <= end; d = addDays(d,7)){ const s=clone(d), e=clone(d); e.setDate(e.getDate()+6); out.push({ isoYear: isoWeekYear(s), isoWeek: isoWeekNumber(s), start: ymd(s), end: ymd(e), key: `${isoWeekYear(s)}-W${String(isoWeekNumber(s)).padStart(2,'0')}` }); } return out; }
    function loadPrevData(){ try{ const j = localStorage.getItem('prev.data'); return j? JSON.parse(j): []; }catch(e){ return []; } }
    function autoTotalsFor(weeks){ const data = loadPrevData(); const map = new Map(); for(const r of data){ if(!(r.date||'').trim()) continue; try { const d = new Date(r.date); const key = `${isoWeekYear(d)}-W${String(isoWeekNumber(d)).padStart(2,'0')}`; map.set(key, (map.get(key)||0) + (Number(r.annual)||0)); } catch(e) { continue; } } return weeks.map(w => round0(map.get(w.key)||0)); }
    function sumAnnualInMonth(data, year, month){ const ym = `${year}-${String(month + 1).padStart(2, '0')}`; return round0(data.reduce((s, c) => s + ((c.date || '').startsWith(ym) ? (Number(c.annual) || 0) : 0), 0)); }
    const k = (type, key) => `plan.${type}.${key}`;
    function loadVal(type, key, def = 0){ return round0(localStorage.getItem(k(type,key))||def); }
    function saveVal(type, key, val){ localStorage.setItem(k(type, key), String(round0(val))); }
    function loadArr(type, key){ try{ const j=localStorage.getItem(k(type,key)); return j? JSON.parse(j).map(round0): []; }catch(e){ return []; } }
    function saveArr(type, key, arr){ localStorage.setItem(k(type,key), JSON.stringify(arr.map(round0))); }
    const now = new Date(); const curYear = now.getFullYear(); const curMonth = now.getMonth();
    const years = Array.from(new Set([curYear-1, curYear, curYear+1, ...loadPrevData().map(r => (r.date||'').slice(0,4)).filter(Boolean).map(Number)])).sort((a,b)=>a-b);
    els.year.innerHTML = years.map(y=> `<option value="${y}">${y}</option>`).join('');
    els.year.value = String(loadVal('state','year', curYear));
    function fillMonthSelect(){ const y = Number(els.year.value); els.month.innerHTML = Array.from({length:12},(_,i)=>`<option value="${y}-${String(i+1).padStart(2,'0')}">${new Date(y,i).toLocaleString('fr-FR', {month:'long'})}</option>`).join(''); const savedMonth = localStorage.getItem(k('state', 'month')) || `${curYear}-${String(curMonth+1).padStart(2,'0')}`; els.month.value = savedMonth.startsWith(String(y)) ? savedMonth : `${y}-01`; }
    function renderWeeks(){
        const view = els.view.value, mode = els.mode.value, ym = els.month.value;
        const [ySel, mSel] = ym.split('-').map(Number);
        const wdefs = view==='mois' ? isoWeeksForMonth(ySel, mSel-1) : [];
        const vals = mode==='auto' ? autoTotalsFor(wdefs) : loadArr('month', ym);
        const mgoal = round0(els.mgoal.value);
        const weeklyGoal = wdefs.length > 0 ? round0(mgoal / wdefs.length) : 0;
        els.weeks.innerHTML = wdefs.map((w,idx)=>{
            const v = round0(vals[idx]||0); const isGoalReached = v >= weeklyGoal && weeklyGoal > 0;
            const goalCheckHTML = `<span style="font-size:1.2em; color:${isGoalReached ? 'var(--accent-green, #22c55e)' : 'var(--muted, #94a3b8)'};">${isGoalReached ? '✅' : '⬜️'}</span>`;
            const input = mode==='auto' ? `<input class="wk-val" type="number" value="${v}" disabled />` : `<input class="wk-val" type="number" value="${v}" />`;
            return `<div class="week-row"><div class="wk-label"><strong>S${String(w.isoWeek).padStart(2,'0')}</strong><small>${w.start} → ${w.end}</small></div>${input}${goalCheckHTML}</div>`;
        }).join('');
        if(mode!=='auto'){
            els.weeks.querySelectorAll('input.wk-val').forEach((inp, idx) => {
                inp.addEventListener('input', ()=>{
                    const currentVals = Array.from(els.weeks.querySelectorAll('input.wk-val')).map(x => round0(x.value));
                    saveArr('month', ym, currentVals);
                    recalc();
                });
            });
        }
    }
    function recalc(){
        const autoOn = !!els.autoMGoalToggle && els.autoMGoalToggle.checked;
        const view = els.view.value, mode = els.mode.value, ym = els.month.value;
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
        const msum = (mode==='auto' ? autoTotalsFor(isoWeeksForMonth(ySel,mSel-1)) : loadArr('month',ym)).reduce((s,x)=>s+x,0);
        const mgoal = round0(els.mgoal.value);
        els.mgoal_view.textContent = fmt0.format(mgoal);
        const mpct = mgoal > 0 ? (msum/mgoal*100) : 0;
        els.msum.textContent = fmt0.format(msum);
        els.mpct.textContent = `${mpct.toFixed(1)}%`;
        els.mbar.style.width = `${Math.min(100, mpct)}%`;
        let ytd = 0;
        if(mode === 'auto'){
             for(let mm=0; mm < mSel; mm++) { ytd += sumAnnualInMonth(prevData, ySel, mm); }
        } else {
             for(let mm=1; mm<=mSel; mm++){ const ymx = `${ySel}-${String(mm).padStart(2,'0')}`; ytd += loadArr('month', ymx).reduce((s,x)=>s+x,0); }
        }
        els.goal_view.textContent = fmt0.format(agoal);
        const ypct = agoal > 0 ? (ytd/agoal*100) : 0;
        els.ytdsum.textContent = fmt0.format(ytd);
        els.ypct.textContent = `${ypct.toFixed(1)}%`;
        els.ybar.style.width = `${Math.min(100, ypct)}%`;
        renderWeeks();
    }
    function onViewChange(){ localStorage.setItem(k('state','view'), els.view.value); recalc(); }
    els.view.addEventListener('change', onViewChange);
    els.year.addEventListener('change', () => { saveVal('state', 'year', els.year.value, 0); fillMonthSelect(); recalc(); });
    els.month.addEventListener('change', () => { localStorage.setItem(k('state','month'), els.month.value); if (!els.autoMGoalToggle || !els.autoMGoalToggle.checked) { els.mgoal.value = loadVal('goal', els.month.value) || ''; } recalc(); });
    els.mode.addEventListener('change', () => { recalc(); });
    els.saveGoals.addEventListener('click', ()=>{ saveVal('goal', 'annual', els.goal.value); if (!els.autoMGoalToggle || !els.autoMGoalToggle.checked) { saveVal('goal', els.month.value, els.mgoal.value); } recalc(); alert('Objectifs enregistrés !'); });
    if (els.autoMGoalToggle) { els.autoMGoalToggle.addEventListener('change', recalc); }
    if (els.goal) els.goal.addEventListener('input', recalc);
    fillMonthSelect();
    const savedView = localStorage.getItem(k('state','view'));
    if (savedView) els.view.value = savedView;
    els.goal.value = loadVal('goal', 'annual') || '';
    onViewChange();
}
