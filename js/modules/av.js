// Contenu pour js/modules/av.js

function initAvPanel() {
    const root = document.getElementById('av-panel');
    if (!root) return;

    // UTILS INTÉGRÉS
    const fmt = (v, sign = false) => {
        if (isNaN(v)) return '—';
        const f = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(v));
        return sign ? (v >= 0 ? '+ ' : '- ') + f : f;
    };
    const $ = sel => root.querySelector(sel);
    const els = {
        calcBtn: $('.calc'), pdfBtn: $('.pdf'), initial: $('.initial'), monthly: $('.monthly'),
        years: $('.years'), yearsValue: $('.yearsValue'), inflation: $('.inflation'),
        harmRate: $('.harm-rate'), harmEntry: $('.harm-entry'), harmMgmt: $('.harm-mgmt'),
        cmpRate: $('.cmp-rate'), cmpEntry: $('.cmp-entry'), cmpMgmt: $('.cmp-mgmt'),
        livreta: $('.livreta'), chartCanvas: $('.chart'), resultsBody: $('.results tbody')
    };

    let chartInstance;

    function simulate({ initial, monthly, grossRate, entryFee, mgmtFee, years }) {
        const r = grossRate / 100;
        const fei = entryFee / 100;
        const fmg = mgmtFee / 100;
        let capital = initial * (1 - fei);
        const yearlyNominal = [capital];
        let totalFees = initial * fei;

        for (let y = 1; y <= years; y++) {
            for (let m = 0; m < 12; m++) {
                capital += monthly * (1 - fei);
                totalFees += monthly * fei;
                capital *= (1 + r / 12);
            }
            const yMgmtFees = capital * fmg;
            capital -= yMgmtFees;
            totalFees += yMgmtFees;
            yearlyNominal.push(capital);
        }
        const totalDeposits = initial + monthly * 12 * years;
        const interests = capital - totalDeposits;
        return { totalCapital: capital, interests, totalFees, yearlyNominal };
    }

    function computeAndRender() {
        const initial = Number(els.initial.value || 0);
        const monthly = Number(els.monthly.value || 0);
        const years = Number(els.years.value || 10);
        
        const harm = simulate({ initial, monthly, grossRate: Number(els.harmRate.value), entryFee: Number(els.harmEntry.value), mgmtFee: Number(els.harmMgmt.value), years });
        const cmp = simulate({ initial, monthly, grossRate: Number(els.cmpRate.value), entryFee: Number(els.cmpEntry.value), mgmtFee: Number(els.cmpMgmt.value), years });
        const la = simulate({ initial, monthly, grossRate: Number(els.livreta.value), entryFee: 0, mgmtFee: 0, years });
        const deposits = Array.from({ length: years + 1 }, (_, i) => initial + monthly * 12 * i);

        // Update Table
        $('.r-harm-cap').textContent = fmt(harm.totalCapital);
        $('.r-cmp-cap').textContent = fmt(cmp.totalCapital);
        $('.r-la-cap').textContent = fmt(la.totalCapital);
        $('.r-harm-int').textContent = fmt(harm.interests);
        $('.r-cmp-int').textContent = fmt(cmp.interests);
        $('.r-la-int').textContent = fmt(la.interests);
        $('.r-harm-fees').textContent = fmt(harm.totalFees);
        $('.r-cmp-fees').textContent = fmt(cmp.totalFees);
        $('.r-la-fees').textContent = fmt(0);
        $('.r-diff-cmp').textContent = fmt(cmp.totalCapital - harm.totalCapital, true);
        $('.r-diff-la').textContent = fmt(la.totalCapital - harm.totalCapital, true);

        // Update Chart
        if (chartInstance) chartInstance.destroy();
        const ctx = els.chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: years + 1 }, (_, i) => i),
                datasets: [
                    { label: 'Harmonie', data: harm.yearlyNominal, borderColor: 'var(--accent-orange)', borderWidth: 3, tension: 0.3 },
                    { label: 'Comparatif', data: cmp.yearlyNominal, borderColor: 'var(--accent-blue)', borderWidth: 2, tension: 0.3 },
                    { label: 'Livret A', data: la.yearlyNominal, borderColor: 'var(--accent-green)', borderWidth: 2, tension: 0.3 },
                    { label: 'Versements', data: deposits, borderColor: 'var(--muted)', borderWidth: 1, borderDash: [5, 5] }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { ticks: { callback: value => fmt(value) } }
                }
            }
        });
        els.pdfBtn.disabled = false;
    }

    // --- Events ---
    els.calcBtn.addEventListener('click', computeAndRender);
    els.years.addEventListener('input', () => { els.yearsValue.textContent = `${els.years.value} ans`; });
    
    // Auto-compute on change
    Object.values(els).forEach(el => {
        if(el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.addEventListener('input', computeAndRender);
        }
    });

    // PDF Export (simplified)
    els.pdfBtn.addEventListener('click', () => {
        alert("La fonction d'export PDF sera bientôt disponible dans ce nouvel onglet !");
    });
    
    // Initial calculation
    computeAndRender();
}
