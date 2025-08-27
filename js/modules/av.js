// Contenu pour js/modules/av.js

function initAvPanel() {
    const root = document.getElementById('av-panel');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';

    const $ = sel => root.querySelector(sel);
    const els = {
        calcBtn: $('#btn-calc'), pdfBtn: $('#btn-pdf'), resetBtn: $('#btn-reset'),
        initial: $('#initial'), monthly: $('#monthly'), years: $('#years'), yearsValue: $('#yearsValue'),
        inflation: $('#inflation'), modeAffichage: $('#modeAffichage'),
        harmRate: $('#harm-rate'), harmEntry: $('#harm-entry'), harmMgmt: $('#harm-mgmt'),
        cmpRate: $('#cmp-rate'), cmpEntry: $('#cmp-entry'), cmpMgmt: $('#cmp-mgmt'),
        livreta: $('#livreta'), chartCanvas: $('#chart')
    };

    let chart;

    const fmt = (v, sign = false) => {
        if (isNaN(v)) return '—';
        const f = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Math.abs(v));
        return sign ? (v >= 0 ? '+ ' : '- ') + f : f;
    };

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
        const inflation = Number(els.inflation.value || 0) / 100;
        const mode = els.modeAffichage.value;

        const harm = simulate({ initial, monthly, grossRate: Number(els.harmRate.value), entryFee: Number(els.harmEntry.value), mgmtFee: Number(els.harmMgmt.value), years });
        const cmp = simulate({ initial, monthly, grossRate: Number(els.cmpRate.value), entryFee: Number(els.cmpEntry.value), mgmtFee: Number(els.cmpMgmt.value), years });
        const la = simulate({ initial, monthly, grossRate: Number(els.livreta.value), entryFee: 0, mgmtFee: 0, years });
        
        const getSeries = (data) => mode === 'reel' ? data.yearlyNominal.map((v, i) => v / Math.pow(1 + inflation, i)) : data.yearlyNominal;
        const harmSeries = getSeries(harm);
        const cmpSeries = getSeries(cmp);
        const laSeries = getSeries(la);
        const deposits = Array.from({ length: years + 1 }, (_, i) => initial + monthly * 12 * i);
        const depositsSeries = mode === 'reel' ? deposits.map((v, i) => v / Math.pow(1 + inflation, i)) : deposits;

        $('#r-harm-cap').textContent = fmt(harmSeries[years]);
        $('#r-cmp-cap').textContent = fmt(cmpSeries[years]);
        $('#r-la-cap').textContent = fmt(laSeries[years]);
        $('#r-harm-int').textContent = fmt(harmSeries[years] - depositsSeries[years]);
        $('#r-cmp-int').textContent = fmt(cmpSeries[years] - depositsSeries[years]);
        $('#r-la-int').textContent = fmt(laSeries[years] - depositsSeries[years]);
        $('#r-harm-fees').textContent = fmt(harm.totalFees);
        $('#r-cmp-fees').textContent = fmt(cmp.totalFees);
        $('#r-la-fees').textContent = fmt(0);
        $('#r-diff-cmp').textContent = fmt(cmpSeries[years] - harmSeries[years], true);
        $('#r-diff-la').textContent = fmt(laSeries[years] - harmSeries[years], true);

        if (chart) chart.destroy();
        const ctx = els.chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: years + 1 }, (_, i) => i),
                datasets: [
                    { label: 'Harmonie', data: harmSeries, borderColor: 'var(--accent-orange)', borderWidth: 3, tension: 0.3, pointRadius: 0 },
                    { label: 'Comparatif', data: cmpSeries, borderColor: 'var(--accent-blue)', borderWidth: 2, tension: 0.3, pointRadius: 0 },
                    { label: 'Livret A', data: laSeries, borderColor: 'var(--accent-green)', borderWidth: 2, tension: 0.3, pointRadius: 0 },
                    { label: 'Versements', data: depositsSeries, borderColor: 'var(--muted)', borderWidth: 1, borderDash: [5, 5], pointRadius: 0 }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { ticks: { callback: value => fmt(value), color: 'var(--muted)' }, grid: { color: 'var(--border)' } },
                    x: { ticks: { color: 'var(--muted)' }, grid: { color: 'var(--border)' } }
                },
                plugins: { legend: { labels: { color: 'var(--text)' } } }
            }
        });
        els.pdfBtn.disabled = false;
    }

    els.calcBtn.addEventListener('click', computeAndRender);
    els.resetBtn.addEventListener('click', () => { if (confirm("Réinitialiser tous les champs ?")) location.reload(); });
    els.years.addEventListener('input', () => { els.yearsValue.textContent = `${els.years.value} ans`; });
    Object.values(els).forEach(el => {
        if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT')) {
            el.addEventListener('input', computeAndRender);
        }
    });

    els.pdfBtn.addEventListener('click', () => { alert("La fonction d'export PDF sera bientôt disponible dans ce nouvel onglet !"); });
    
    computeAndRender();
}
