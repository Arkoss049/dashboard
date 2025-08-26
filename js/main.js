// Contenu corrigé pour js/modules/prevoyance.js

function initPrevoyancePanel() {
    const root = document.getElementById('prevoyance-panel');
    if (!root) {
        console.error("L'élément racine pour le panneau Prévoyance est introuvable.");
        return;
    }

    const $ = sel => root.querySelector(sel);
    const els = { file: $('.file'), importBtn: $('.import'), exportBtn: $('.export'), clearBtn: $('.clear'), target: $('.target'), save: $('.save'), debug: $('.debug'), toCalc: $('.toCalc'), printBtn: $('.print'), annualTotal: $('.annualTotal'), rows: $('.rows'), targetVal: $('.targetVal'), pct: $('.pct'), progressBar: $('.progressBar'), avg: $('.avg'), products: $('.products'), deals: $('.deals'), yearInfo: $('.yearInfo'), chartMonthly: $('.monthly'), chartPie: $('.pie'), search: $('.search'), filterYear: $('.filterYear'), tbody: $('.tbody'), m_prenom: $('.m_prenom'), m_nom: $('.m_nom'), m_produit: $('.m_produit'), m_montant: $('.m_montant'), m_per: $('.m_per'), m_date: $('.m_date'), m_add: $('.m_add'), exportCSVBtn: $('.exportCSV') };
    
    let data = loadData();
    els.target.value = localStorage.getItem('prev.target') || '27000';
    renderAll();

    // --- LOGIQUE D'IMPORT CORRIGÉE ---
    // 1. Le bouton "Importer" ouvre la fenêtre de sélection de fichier
    els.importBtn.addEventListener('click', () => {
        els.file.click();
    });

    // 2. Le traitement se lance quand un fichier est choisi
    els.file.addEventListener('change', async () => {
        const f = els.file.files && els.file.files[0];
        if (!f) return;

        try {
            const text = await readFileToTextOrCSV(f);
            const parsed = parseCSV(text);
            let normalized = parsed.rows.map(r => normalizeRow(r)).map(r => ({...r, source:'import'}));
            const before = normalized.length;
            const deduped = dedupeRows(normalized);
            const removed = before - deduped.length;
            data = deduped;
            saveData();
            debug(`Import OK — ${data.length} lignes.` + (removed > 0 ? ` (${removed} doublon(s) ignoré(s))` : ''));
            renderAll();
        } catch(e) {
            debug('Erreur: ' + e);
        } finally {
            // Réinitialise le champ pour pouvoir réimporter le même fichier si besoin
            els.file.value = '';
        }
    });
    // --- FIN DE LA CORRECTION ---

    function keyFor(r){ const k1 = String(r.prenom||'').trim().toLowerCase(); const k2 = String(r.nom||'').trim().toLowerCase(); const k3 = String(r.produit||'').trim().toLowerCase(); const k4 = String(r.date||'').slice(0,7); return [k1,k2,k3,k4].join('|'); }
    function dedupeRows(rows){ const seen = new Set(); const out = []; for(const r of rows){ const k = keyFor(r); if(seen.has(k)) continue; seen.add(k); out.push(r); } return out; }
    function findDuplicateIndex(row){ const k = keyFor(row); return data.findIndex(d => keyFor(d) === k); }
    if(els.m_date){ els.m_date.value = new Date().toISOString().slice(0,10); }
    function annualFrom(amount, per){ const a = Number(amount)||0; const p = String(per||'').toLowerCase(); let monthly = a; if(p.includes('ann')) monthly = a/12; else if(p.includes('sem')) monthly = a/6; else if(p.includes('trim')) monthly = a/3; else monthly = a; return monthly*12; }
    function addManual(){ const prenom = (els.m_prenom?.value||'').trim(); const nom = (els.m_nom?.value||'').trim(); const produit = (els.m_produit?.value||'').trim(); const date = (els.m_date?.value||'') || new Date().toISOString().slice(0,10); const annual = annualFrom(els.m_montant?.value, els.m_per?.value); if(!produit || !annual){ alert('Renseigne au minimum Produit et Montant.'); return; } const row = { id: 'm'+Date.now().toString(36), prenom, nom, produit, date, annual, source:'manual' }; const dupIdx = findDuplicateIndex(row); if(dupIdx !== -1){ if(confirm('Doublon détecté. Remplacer ?')){ data[dupIdx] = { ...data[dupIdx], ...row }; }else{ if(confirm('Conserver les deux ?')){ data.unshift(row); } else { return; } } }else{ data.unshift(row); } saveData(); renderAll(); els.m_prenom.value=''; els.m_nom.value=''; els.m_produit.value=''; els.m_montant.value=''; }
    els.m_add.addEventListener('click', addManual);
    els.tbody.addEventListener('click', (e)=>{ const btn = e.target.closest('button'); if(!btn) return; const id = btn.dataset.id || btn.closest('tr')?.dataset.id; const idx = data.findIndex(d => String(d.id||'')===String(id)); if(idx===-1) return; const row = data[idx]; if(btn.classList.contains('del')){ if(confirm('Supprimer cette ligne ?')){ data.splice(idx,1); saveData(); renderAll(); } }else if(btn.classList.contains('edit')){ const prenom = prompt('Prénom', row.prenom||'') ?? row.prenom; const nom = prompt('Nom', row.nom||'') ?? row.nom; const produit = prompt('Produit', row.produit||'') ?? row.produit; const date = prompt('Date (YYYY-MM-DD)', row.date||'') ?? row.date; const montant = prompt('Montant périodique (€)', Math.round((row.annual||0)/12)) ?? String(Math.round((row.annual||0)/12)); const per = prompt('Périodicité', 'mensuel') ?? 'mensuel'; const annual = annualFrom(montant, per); data[idx] = { ...row, prenom, nom, produit, date, annual, source:'manual' }; saveData(); renderAll(); } });
    function exportCombinedCSV(){ const headers = ['prenom','nom','produit','annual','date','source']; const lines = [headers.join(';')].concat( data.map(r => [r.prenom||'', r.nom||'', r.produit||'', String(Number(r.annual)||0), r.date||'', r.source||'import'].join(';')) ); const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'prevoyance_combine.csv'; a.click(); URL.revokeObjectURL(url); }
    els.exportCSVBtn.addEventListener('click', exportCombinedCSV);
    els.exportBtn.addEventListener('click', () => { const blob = new Blob([JSON.stringify({ data, settings: { target: localStorage.getItem('prev.target')||'' }}, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download= 'prev_export.json'; a.click(); URL.revokeObjectURL(url); });
    els.clearBtn.addEventListener('click', () => { if(confirm('Effacer les données locales ?')){ data=[]; saveData(); renderAll(); debug('Données réinitialisées.'); } });
    els.save.addEventListener('click', () => { localStorage.setItem('prev.target', (els.target.value||'').trim()); renderAll(); });
    [els.search, els.filterYear].forEach(el => el.addEventListener('input', renderTable));
    els.toCalc.addEventListener('click', () => { const totalAnnual = data.reduce((s,d)=> s + (Number(d.annual)||0), 0); localStorage.setItem('calc.ca_prev', String(totalAnnual)); document.querySelector('.tab[data-tab="calculateur"]').click(); });
    els.printBtn.addEventListener('click', () => window.print());
    function storageKey(){ return 'prev.data'; }
    function loadData(){ try{ const j=localStorage.getItem(storageKey()); return j? JSON.parse(j): []; }catch(e){ return []; } }
    function saveData(){ localStorage.setItem(storageKey(), JSON.stringify(data)); }
    function debug(msg){ els.debug.textContent = msg; }
    async function readFileToTextOrCSV(file){ const ext = (file.name.split('.').pop()||'').toLowerCase(); if(ext === 'xlsx'){ if(typeof XLSX === 'undefined') throw new Error('Librairie XLSX non chargée.'); const ab = await file.arrayBuffer(); const wb = XLSX.read(ab, {type:'array'}); const ws = wb.Sheets[wb.SheetNames[0]]; const csv = XLSX.utils.sheet_to_csv(ws, {FS:';'}); return csv; } else { return await file.text(); } }
    function parseCSV(text){ const firstLine = text.split(/\r?\n/).find(l=>l.trim().length>0) || ''; const delimiter = firstLine.includes(';') ? ';' : ','; const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0); const headers = (lines.shift()||'').split(delimiter).map(s=>s.trim()); const rows = lines.map(line => { const out = []; let cur=''; let inQ=false; for(let i=0;i<line.length;i++){ const ch = line[i]; if(ch === '"'){ if(inQ && line[i+1] === '"'){ cur+='"'; i++; } else { inQ=!inQ; } } else if(ch === delimiter && !inQ){ out.push(cur); cur=''; } else { cur += ch; } } out.push(cur); const obj = {}; headers.forEach((h,idx)=> obj[h]= (out[idx]||'').trim()); return obj; }); debug('En-têtes: ' + headers.join(' | ')); return { headers, rows }; }
    function toNum(v){ if(v==null) return 0; let s = String(v).replace(/\u00a0/g,' ').replace(/[€]/g,'').replace(/['"]/g,'').replace(/\s/g,'').replace(',', '.'); s = (s.match(/[0-9\.\-]+/g)||['0']).join(''); const n = Number(s); return isFinite(n)? n: 0; }
    function toISO(v){ const s = String(v||'').trim(); if(!s) return ''; const m1 = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/); if(m1) return `${m1[1]}-${m1[2]}-${m1[3]}`; const m2 = s.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/); if(m2) return `${m2[3]}-${m2[2]}-${m2[1]}`; const d = new Date(s); if(!isNaN(d)) return d.toISOString().slice(0,10); return ''; }
    function normalizeRow(r){ const prenom = (r['prenomPP']||'').trim(); const nom = (r['nomPP']||'').trim(); const produit = (r['offre']||r['familleProduit']||'').trim(); const date = toISO(r['dateSignature']); let amount = toNum(r['montantPeriodique']); const per = String(r['periodicite']||'').toLowerCase(); let monthly = amount; if(per.includes('ann')) monthly = amount/12; else if(per.includes('sem')) monthly = amount/6; else if(per.includes('trim')) monthly = amount/3; else if(per.includes('mens')) monthly = amount; const annual = monthly * 12; return { prenom, nom, produit, date, annual }; }
    function renderAll(){ fillYearFilter(); renderKPIs(); renderCharts(); renderTable(); }
    function fillYearFilter(){ const years = Array.from(new Set(data.map(r => (r.date||'').slice(0,4)).filter(Boolean))).map(Number).sort((a,b)=>b-a); const cur = yearNow(); if(years.indexOf(cur)===-1) years.unshift(cur); els.filterYear.innerHTML = years.map(y => `<option value="${y}" ${y===cur?'selected':''}>Année ${y}</option>`).join(''); }
    function renderKPIs(){ const totalAnnual = data.reduce((s,d)=> s + (Number(d.annual)||0), 0); const target = Number(localStorage.getItem('prev.target')||0) || 0; els.annualTotal.textContent = fmt0.format(totalAnnual); els.rows.textContent = 'Lignes importées : ' + data.length; els.targetVal.textContent = target>0 ? fmt0.format(target) : '—'; const pct = target>0 ? (totalAnnual/target*100) : 0; els.pct.innerHTML = 'Atteint : ' + (target>0 ? (Math.round(pct*10)/10)+'%' : '—') + (pct>=125 ? ' <span class="badge badge-over">125%+</span>' : ''); const color = pct>=125? 'var(--over)' : pct>=100? 'var(--ok)' : pct>=80? 'var(--warn)' : 'var(--danger)'; els.progressBar.style.width = Math.min(100, Math.round(pct)) + '%'; els.progressBar.style.background = color; const avg = data.length ? totalAnnual / data.length : 0; els.avg.textContent = fmt0.format(avg); const productSet = new Set(data.map(d=> d.produit || 'Inconnu')); els.products.textContent = 'Produits distincts : ' + productSet.size; const y = Number(els.filterYear.value) || yearNow(); const yearRowsKPI = data.filter(d => !d.date || d.date.startsWith(String(y))); els.deals.textContent = yearRowsKPI.length; els.yearInfo.textContent = 'Année : ' + y; }
    function renderCharts(){ const y = Number(els.filterYear.value) || yearNow(); const yearRows = data.filter(d => (d.date||'').startsWith(String(y))); const buckets = new Array(12).fill(0); yearRows.forEach(d => { if(!d.date) return; const m = Number(d.date.slice(5,7)) - 1; buckets[m] += Number(d.annual)||0; }); els.chartMonthly.innerHTML = barChartSVG(buckets); const map = {}; data.forEach(d => { const key=(d.produit||'Inconnu'); map[key]=(map[key]||0)+(Number(d.annual)||0); }); const top = Object.entries(map).sort((a,b)=> b[1]-a[1]).slice(0,8); els.chartPie.innerHTML = pieChartSVG(top); }
    function renderTable(){ const y = Number(els.filterYear.value) || yearNow(); const q = (els.search.value||'').toLowerCase(); const rows = data.filter(d => { const txt = (d.prenom+' '+d.nom+' '+d.produit).toLowerCase(); if(q && !txt.includes(q)) return false; const yearOK = !d.date || d.date.startsWith(String(y)); if(!yearOK) return false; return true; }); rows.sort((a,b)=> (b.date||'').localeCompare(a.date||'') || (Number(b.annual)||0)-(Number(a.annual)||0)); els.tbody.innerHTML = rows.map(r => `<tr data-id="${r.id||''}"><td>${esc(r.prenom||'')}</td><td>${esc(r.nom||'')}</td><td>${esc(r.produit||'')}</td><td class="right">${fmt0.format(Number(r.annual)||0)}</td><td>${r.date || '—'}</td><td>${r.source==='manual' ? '<button class="btn btn-ghost edit" data-id="'+(r.id||'')+'">✏️</button> <button class="btn btn-danger del" data-id="'+(r.id||'')+'">🗑</button>' : '—'}</td></tr>`).join(''); }
    function barChartSVG(values){ const labels = ['J','F','M','A','M','J','J','A','S','O','N','D']; const w=680, h=220, pad=30, max=Math.max(10, ...values); const bw = (w - pad*2) / values.length; const bars = values.map((v,i)=>{ const x = pad + i*bw + 6; const bh = (v/max) * (h - pad*2); const y = h - pad - bh; const fill = v>0 ? 'url(#g)' : 'var(--elev)'; return `<rect x="${x}" y="${y}" width="${bw-12}" height="${Math.max(1,bh)}" rx="6" ry="6" fill="${fill}"><title>${labels[i]}: ${fmt0.format(v)}</title></rect>`; }).join(''); const xlabels = labels.map((lab,i)=>{ const x = pad + i*bw + bw/2; return `<text x="${x}" y="${h-8}" font-size="11" text-anchor="middle" fill="var(--muted)">${lab}</text>`; }).join(''); const grid = [0.25,0.5,0.75,1].map(p=>{ const y = pad + (1-p)*(h - pad*2); return `<line x1="${pad}" y1="${y}" x2="${w-pad}" stroke="var(--border)" stroke-width="1"/>`; }).join(''); return `<svg viewBox="0 0 ${w} ${h}" role="img"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent-green)"/><stop offset="100%" stop-color="var(--accent-blue)"/></linearGradient></defs>${grid}${bars}${xlabels}</svg>`; }
    function pieChartSVG(entries){ const w=680, h=220, cx=110, cy=110, r=85; const total = entries.reduce((s,[_k,v])=>s+v,0) || 1; let a0 = -Math.PI/2; const colors = ['var(--accent-green)','var(--accent-blue)','#a855f7','var(--accent-orange)','#10b981','var(--danger)','#06b6d4','#f97316']; const slices = entries.map(([k,v],i)=>{ const ang = (v/total)*Math.PI*2; const a1 = a0 + ang; const large = ang>Math.PI ? 1:0; const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0); const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1); const path = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`; const color = colors[i % colors.length]; const mid = a0 + ang/2; const lx = cx + (r+14)*Math.cos(mid), ly = cy + (r+14)*Math.sin(mid); a0 = a1; return `<path d="${path}" fill="${color}"><title>${k}: ${fmt0.format(v)}</title></path><text x="${lx}" y="${ly}" font-size="11" text-anchor="${Math.cos(mid)>0? 'start':'end'}" fill="var(--muted)">${k}</text>`; }).join(''); return `<svg viewBox="0 0 ${w} ${h}" role="img">${slices}</svg>`; }
}

initPrevoyancePanel();
