// Contenu pour js/modules/simudc.js

function initSimudcPanel() {
    const root = document.getElementById('simudc-panel');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';

    const $ = sel => root.querySelector(sel);
    const els = {
        status: $('.status'), revA: $('.revA'), revB: $('.revB'), charges: $('.charges'),
        addEnfantAge: $('.add-enfant-age'), btnAddEnfant: $('.add-enfant'), enfantsList: $('.enfants-list'),
        chartSans: $('.chart-sans'), deficitSans: $('.deficit-sans'),
        capitalPrive: $('.capital-prive'), capitalPriveVal: $('.capital-prive-val'),
        chartAvec: $('.chart-avec'), revenuAvec: $('.revenu-avec')
    };

    const fmt0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    let enfants = [];
    let chartSansInstance, chartAvecInstance;

    function getInputs() {
        return {
            status: els.status.value,
            revA: Number(els.revA.value) || 0,
            revB: Number(els.revB.value) || 0,
            charges: Number(els.charges.value) || 0,
            capitalPrive: Number(els.capitalPriveVal.value) || 0,
            enfants: [...enfants]
        };
    }

    function calculateAides(inputs) {
        let asf = 0; // Allocation de Soutien Familial
        if (inputs.enfants.length > 0) {
            asf = inputs.enfants.length * 200; // Estimation simplifiée
        }
        // Pour la simplicité, on omet le veuvage/réversion qui dépendent de trop de facteurs.
        // On se concentre sur l'impact principal.
        return asf;
    }

    function update() {
        const inputs = getInputs();
        const revenuTotalAvant = inputs.revA + inputs.revB;
        const aides = calculateAides(inputs);
        const revenuSurvivant = inputs.revB; // On suppose que le parent A décède
        const revenuTotalApresSans = revenuSurvivant + aides;
        
        const rentePrivee = inputs.capitalPrive / 120; // Lissage simple sur 10 ans
        const revenuTotalApresAvec = revenuTotalApresSans + rentePrivee;
        
        els.deficitSans.textContent = fmt0.format(revenuTotalApresSans - inputs.charges);
        els.revenuAvec.textContent = fmt0.format(revenuTotalApresAvec);

        updateChart(chartSansInstance, els.chartSans, [revenuTotalAvant, revenuTotalApresSans, inputs.charges]);
        updateChart(chartAvecInstance, els.chartAvec, [revenuTotalAvant, revenuTotalApresAvec, inputs.charges]);
    }

    function updateChart(instance, canvas, data) {
        const [avant, apres, charges] = data;
        const labels = ['Avant Décès', 'Après (Sans Contrat)', 'Charges Fixes'];
        if(canvas.id === 'chart-avec') labels[1] = 'Après (Avec Contrat)';

        const datasets = [{
            data: [avant, apres, null],
            backgroundColor: ['var(--accent-blue)', apres < charges ? 'var(--danger)' : 'var(--ok)'],
            label: 'Revenus Mensuels'
        }, {
            data: [null, null, charges],
            backgroundColor: 'var(--muted)',
            label: 'Charges Mensuelles',
            borderColor: 'var(--muted)',
            borderDash: [5, 5],
            type: 'line',
            fill: false,
            pointRadius: 0
        }];

        if (instance) {
            instance.data.datasets[0].data = datasets[0].data;
            instance.data.datasets[0].backgroundColor = datasets[0].backgroundColor;
            instance.update();
        } else {
            const chartConfig = {
                type: 'bar',
                data: { labels, datasets },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { callback: value => fmt0.format(value) } } }
                }
            };
            if(canvas.id === 'chart-sans') chartSansInstance = new Chart(canvas, chartConfig);
            else chartAvecInstance = new Chart(canvas, chartConfig);
        }
    }

    function renderEnfants() {
        if (enfants.length === 0) {
            els.enfantsList.textContent = 'Aucun enfant';
        } else {
            els.enfantsList.innerHTML = enfants.map((age, i) =>
                `<span class="badge" style="cursor:pointer;" data-index="${i}">${age} ans 🗑️</span>`
            ).join(' ');
        }
    }

    els.btnAddEnfant.addEventListener('click', () => {
        const age = Number(els.addEnfantAge.value);
        if (age > 0 && age < 26) {
            enfants.push(age);
            els.addEnfantAge.value = '';
            renderEnfants();
            update();
        }
    });

    els.enfantsList.addEventListener('click', (e) => {
        if (e.target.dataset.index) {
            enfants.splice(e.target.dataset.index, 1);
            renderEnfants();
            update();
        }
    });

    els.capitalPrive.addEventListener('input', () => {
        els.capitalPriveVal.value = els.capitalPrive.value;
        update();
    });
    els.capitalPriveVal.addEventListener('input', () => {
        els.capitalPrive.value = els.capitalPriveVal.value;
        update();
    });

    [els.status, els.revA, els.revB, els.charges].forEach(el => el.addEventListener('input', update));

    renderEnfants();
    update();
}
