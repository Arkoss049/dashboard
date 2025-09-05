(function () {
  const PROSPECTS_STORAGE_KEY = 'prospectionData';
  let prospects = [];
  let currentProspectIndex = null;
  let debouncedSearchTimer = null;
  let onArchivesView = false;

  // ---------- Storage ----------
  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }
  function loadProspects() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      try { prospects = JSON.parse(stored); } catch { prospects = []; }
    }
  }

  // ---------- Utils ----------
  function toNumberOrNull(v) {
    const s = String(v ?? '').replace(',', '.').trim();
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  function parseFRDate(s) {
    if (!s) return null;
    const parts = String(s).split('/');
    if (parts.length !== 3) return null;
    const [dd, mm, yyyy] = parts.map(Number);
    if (!yyyy || !mm || !dd) return null;
    return new Date(yyyy, mm - 1, dd);
  }
  function formatTodayFR() {
    return new Date().toLocaleDateString('fr-FR');
  }
  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  // ---------- Stats (active) ----------
  function setStat(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = el.textContent;
    if (String(prev) !== String(newVal)) {
      el.textContent = newVal;
      el.classList?.remove('flash');
      void el.offsetWidth; // reflow
      el.classList?.add('flash');
    }
  }
  function updateStatsActive() {
    const active = prospects.filter(p => !p.archived);
    const stats = { total: active.length, 'A contacter': 0, 'A relancer': 0, 'RDV Pris': 0, 'RDV Refusé': 0 };
    active.forEach(p => { if (stats[p.status] !== undefined) stats[p.status]++; });
    setStat('stat-total', stats.total);
    setStat('stat-a-contacter', stats['A contacter']);
    setStat('stat-a-relancer', stats['A relancer']);
    setStat('stat-rdv-pris', stats['RDV Pris']);
    setStat('stat-rdv-refusé', stats['RDV Refusé']);
  }

  // ---------- Stats (archives) ----------
  function updateStatsArchives() {
    const arch = prospects.filter(p => p.archived);
    const total = arch.length;
    const signed = arch.filter(p => p.status === 'Signé').length;
    const refused = arch.filter(p => p.status === 'Proposition refusée').length;
    setStat('stat-arch-total', total);
    setStat('stat-arch-signed', signed);
    setStat('stat-arch-refused', refused);
  }

  // ---------- CSV ----------
  function exportToCsv(data, filename) {
    if (!data || data.length === 0) { alert('Aucune donnée à exporter.'); return; }
    const headers = ['name','number','phone','monthly','pp','age','status','lastUpdate','notes','archived'];
    const csvRows = [headers.join(';')];
    for (const row of data) {
      const values = headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`);
      csvRows.push(values.join(';'));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function importFromCsv() {
    const file = document.getElementById('csvFileInput').files[0];
    if (!file) { alert('Veuillez sélectionner un fichier CSV.'); return; }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return;

      const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''));
      const imported = lines.slice(1).map(line => {
        const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, i) => obj[header] = values[i] || '');

        obj.name = obj.name || '';
        obj.number = obj.number || '';
        obj.phone = obj.phone || '';
        obj.monthly = toNumberOrNull(obj.monthly) ?? '';
        obj.pp = toNumberOrNull(obj.pp) ?? '';
        obj.age = toNumberOrNull(obj.age) ?? '';
        obj.status = obj.status || 'A contacter';
        obj.lastUpdate = obj.lastUpdate || formatTodayFR();
        obj.notes = obj.notes || '';
        obj.archived = String(obj.archived).toLowerCase() === 'true';
        return obj;
      });

      prospects = [...prospects, ...imported];
      saveProspects();
      refreshCurrentView();
      alert(`Importation réussie : ${imported.length} contacts ajoutés.`);
      document.getElementById('importModal').style.display = 'none';
    };
    reader.readAsText(file);
  }

  // ---------- Rendu (Active) ----------
  function renderTableActive(list) {
    const tbody = document.getElementById('prospectTableBody');
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="muted">Aucun prospect trouvé.</td></tr>';
      return;
    }

    list.forEach((p) => {
      const tr = document.createElement('tr');
      const idx = prospects.indexOf(p);
      const statusCls = (p.status || 'A contacter').toLowerCase().replace(/ /g, '-');
      const statusSelect = `
        <select class="status-select status-${statusCls} row-status-select" data-index="${idx}">
          <option value="A contacter" ${p.status === 'A contacter' ? 'selected' : ''}>A contacter</option>
          <option value="A relancer" ${p.status === 'A relancer' ? 'selected' : ''}>A relancer</option>
          <option value="RDV Pris" ${p.status === 'RDV Pris' ? 'selected' : ''}>RDV Pris</option>
          <option value="RDV Refusé" ${p.status === 'RDV Refusé' ? 'selected' : ''}>RDV Refusé</option>
        </select>
      `;

      tr.innerHTML = `
        <td>${p.name || ''}</td>
        <td>${p.number || ''}</td>
        <td>${p.phone || ''}</td>
        <td>${p.monthly !== null && p.monthly !== undefined && p.monthly !== '' ? p.monthly + ' €' : ''}</td>
        <td>${p.pp ?? ''}</td>
        <td>${statusSelect}</td>
        <td>${p.lastUpdate || ''}</td>
        <td>
          <button class="btn btn-ghost btn-notes icon-btn" data-index="${idx}" title="Notes">
            <!-- note -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm9-1v4h4"/></svg>
          </button>
        </td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost btn-edit icon-btn" data-index="${idx}" title="Modifier">
            <!-- edit -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25zm14.71-9.04 1.34-1.34a1 1 0 0 0 0-1.41L17.2 3.71a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75z"/></svg>
          </button>
          <button class="btn btn-ghost btn-archive icon-btn" data-index="${idx}" title="Archiver">
            <!-- archive -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zm2 6h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm5 3v2h4v-2H10z"/></svg>
          </button>
          <button class="btn btn-danger btn-small icon-btn" data-index="${idx}" title="Supprimer">
            <!-- delete -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm2 5v10H9V8h2zm4 0v10h-2V8h2z"/></svg>
          </button>
        </td>
      `;
      document.getElementById('prospectTableBody').appendChild(tr);
    });

    // actions
    tbody.querySelectorAll('.btn-danger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        prospects.splice(index, 1);
        saveProspects();
        refreshCurrentView();
      });
    });
    tbody.querySelectorAll('.btn-notes').forEach((btn) => {
      btn.addEventListener('click', (e) => openNotesModal(Number(e.currentTarget.dataset.index)));
    });
    tbody.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => openEditModal(Number(e.currentTarget.dataset.index)));
    });
    tbody.querySelectorAll('.btn-archive').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const p = prospects[index];
        p.archived = true;
        if (p.status !== 'Signé' && p.status !== 'Proposition refusée') {
          // laisse le statut tel quel ; tu choisis la finalité dans Archives
        }
        p.lastUpdate = formatTodayFR();
        saveProspects();
        refreshCurrentView();
      });
    });

    // changement de statut (instantané)
    tbody.querySelectorAll('.row-status-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const newStatus = e.currentTarget.value;
        prospects[index].status = newStatus;
        prospects[index].lastUpdate = formatTodayFR();
        saveProspects();

        // MAJ couleur immédiate
        e.currentTarget.classList.forEach((c) => { if (c.startsWith('status-')) e.currentTarget.classList.remove(c); });
        const newCls = 'status-' + newStatus.toLowerCase().replace(/ /g, '-');
        e.currentTarget.classList.add(newCls);

        filterAndSortProspects();
      });
    });
  }

  // ---------- Rendu (Archives) ----------
  function renderTableArchives(list) {
    const tbody = document.getElementById('archiveTableBody');
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="muted">Aucune archive.</td></tr>';
      return;
    }

    list.forEach((p) => {
      const tr = document.createElement('tr');
      const idx = prospects.indexOf(p);
      const statusSelect = `
        <select class="status-select row-arch-status-select" data-index="${idx}">
          <option value="Signé" ${p.status === 'Signé' ? 'selected' : ''}>Signé</option>
          <option value="Proposition refusée" ${p.status === 'Proposition refusée' ? 'selected' : ''}>Proposition refusée</option>
        </select>
      `;
      tr.innerHTML = `
        <td>${p.name || ''}</td>
        <td>${p.phone || ''}</td>
        <td>${p.monthly !== null && p.monthly !== undefined && p.monthly !== '' ? p.monthly + ' €' : ''}</td>
        <td>${p.pp ?? ''}</td>
        <td>${statusSelect}</td>
        <td>${p.lastUpdate || ''}</td>
        <td>${p.notes ? '📝 ' + p.notes : ''}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-ghost btn-edit-arch icon-btn" data-index="${idx}" title="Modifier">
            <!-- edit -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25zm14.71-9.04 1.34-1.34a1 1 0 0 0 0-1.41L17.2 3.71a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75z"/></svg>
          </button>
          <button class="btn btn-ghost btn-unarchive icon-btn" data-index="${idx}" title="Désarchiver">
            <!-- unarchive -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v4H3V3zm2 6h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm9 1-3 3 3 3v-2h4v-2h-4v-2z"/></svg>
          </button>
          <button class="btn btn-danger btn-small btn-delete-arch icon-btn" data-index="${idx}" title="Supprimer">
            <!-- delete -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm2 5v10H9V8h2zm4 0v10h-2V8h2z"/></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // statut archives
    tbody.querySelectorAll('.row-arch-status-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const newStatus = e.currentTarget.value;
        prospects[index].status = newStatus;
        prospects[index].lastUpdate = formatTodayFR();
        saveProspects();
        filterAndSortArchives();
      });
    });

    // modifier (archives) -> même modale, options adaptées
    tbody.querySelectorAll('.btn-edit-arch').forEach((btn) => {
      btn.addEventListener('click', (e) => openEditModal(Number(e.currentTarget.dataset.index)));
    });

    // désarchiver
    tbody.querySelectorAll('.btn-unarchive').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const p = prospects[index];
        p.archived = false;
        if (p.status === 'Signé' || p.status === 'Proposition refusée') {
          p.status = 'A relancer'; // statut par défaut au retour (ajuste si besoin)
        }
        p.lastUpdate = formatTodayFR();
        saveProspects();
        refreshCurrentView();
      });
    });

    // supprimer (archives)
    tbody.querySelectorAll('.btn-delete-arch').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        prospects.splice(index, 1);
        saveProspects();
        refreshCurrentView();
      });
    });
  }

  // ---------- Ajout ----------
  function addProspect() {
    const name = document.getElementById('prospectName').value.trim();
    const number = document.getElementById('prospectNumber').value.trim();

    if (!name || !number) { alert("Le nom et le numéro d'adhérent sont obligatoires."); return; }
    if (prospects.some(p => p.number === number)) { alert("Ce numéro d'adhérent existe déjà."); return; }

    prospects.push({
      name,
      number,
      pp: toNumberOrNull(document.getElementById('prospectPP').value) ?? '',
      age: toNumberOrNull(document.getElementById('prospectAge').value) ?? '',
      phone: document.getElementById('prospectPhone').value.trim(),
      monthly: toNumberOrNull(document.getElementById('prospectMonthly').value) ?? '',
      status: 'A contacter',
      lastUpdate: formatTodayFR(),
      notes: '',
      archived: false,
    });
    saveProspects();
    debouncedFilterAndSort();

    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('prospectName').focus();
  }

  // ---------- Modales Notes ----------
  function openNotesModal(index) {
    currentProspectIndex = index;
    document.getElementById('notesTextarea').value = prospects[index].notes || '';
    document.getElementById('notesModal').style.display = 'flex';
  }
  function closeNotesModal() {
    document.getElementById('notesModal').style.display = 'none';
    currentProspectIndex = null;
  }
  function saveNotes() {
    if (currentProspectIndex !== null) {
      prospects[currentProspectIndex].notes = document.getElementById('notesTextarea').value;
      prospects[currentProspectIndex].lastUpdate = formatTodayFR();
      saveProspects();
      refreshCurrentView();
      closeNotesModal();
    }
  }

  // ---------- Modale Édition ----------
  function setEditStatusOptions(archived) {
    const sel = document.getElementById('editStatus');
    sel.innerHTML = archived
      ? `<option>Signé</option><option>Proposition refusée</option>`
      : `<option>A contacter</option><option>A relancer</option><option>RDV Pris</option><option>RDV Refusé</option>`;
  }
  function openEditModal(index) {
    currentProspectIndex = index;
    const p = prospects[index];

    setEditStatusOptions(!!p.archived);

    document.getElementById('editName').value = p.name || '';
    document.getElementById('editNumber').value = p.number || '';
    document.getElementById('editAge').value = p.age ?? '';
    document.getElementById('editPhone').value = p.phone || '';
    document.getElementById('editMonthly').value = p.monthly ?? '';
    document.getElementById('editPP').value = p.pp ?? '';
    document.getElementById('editStatus').value = p.status || (p.archived ? 'Signé' : 'A contacter');
    document.getElementById('editNotes').value = p.notes || '';
    document.getElementById('editModal').style.display = 'flex';
  }
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentProspectIndex = null;
  }
  function saveEdit() {
    if (currentProspectIndex === null) return;
    const p = prospects[currentProspectIndex];

    const newName = document.getElementById('editName').value.trim();
    const newNumber = document.getElementById('editNumber').value.trim();
    if (!newName || !newNumber) { alert("Le nom et le numéro d'adhérent sont obligatoires."); return; }
    if (prospects.some((x, i) => i !== currentProspectIndex && x.number === newNumber)) {
      alert("Ce numéro d'adhérent existe déjà."); return;
    }

    p.name = newName;
    p.number = newNumber;
    p.age = toNumberOrNull(document.getElementById('editAge').value) ?? '';
    p.phone = document.getElementById('editPhone').value.trim();
    p.monthly = toNumberOrNull(document.getElementById('editMonthly').value) ?? '';
    p.pp = toNumberOrNull(document.getElementById('editPP').value) ?? '';
    p.status = document.getElementById('editStatus').value;
    p.notes = document.getElementById('editNotes').value;
    p.lastUpdate = formatTodayFR();

    saveProspects();
    refreshCurrentView();
    closeEditModal();
  }

  // ---------- Filtres & Tri (Active) ----------
  function filterSourceActive() {
    const searchTerm   = normalize(document.getElementById('searchFilter').value);
    const filterStatus = document.getElementById('statusFilter').value; // value propre (les pastilles sont juste visuelles dans HTML)
    const sortValue    = document.getElementById('sortFilter').value;

    let list = prospects.filter(p => !p.archived);

    if (searchTerm) {
      list = list.filter(p =>
        normalize(p.name).includes(searchTerm) ||
        normalize(p.number).includes(searchTerm) ||
        normalize(p.phone).includes(searchTerm)
      );
    }
    if (filterStatus !== 'all') {
      list = list.filter(p => (p.status || 'A contacter') === filterStatus);
    }

    switch (sortValue) {
      case 'name_asc':     list.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name_desc':    list.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'age_asc':      list.sort((a, b) => (a.age ?? 0) - (b.age ?? 0)); break;
      case 'age_desc':     list.sort((a, b) => (b.age ?? 0) - (a.age ?? 0)); break;
      case 'monthly_asc':  list.sort((a, b) => (a.monthly ?? 0) - (b.monthly ?? 0)); break;
      case 'monthly_desc': list.sort((a, b) => (b.monthly ?? 0) - (a.monthly ?? 0)); break;
      case 'date_asc':     list.sort((a, b) => (parseFRDate(a.lastUpdate) || 0) - (parseFRDate(b.lastUpdate) || 0)); break;
      case 'date_desc':    list.sort((a, b) => (parseFRDate(b.lastUpdate) || 0) - (parseFRDate(a.lastUpdate) || 0)); break;
    }
    return list;
  }
  window.filterAndSortProspects = function () {
    renderTableActive(filterSourceActive());
    updateStatsActive();
  };
  window.debouncedFilterAndSort = function () {
    if (debouncedSearchTimer) clearTimeout(debouncedSearchTimer);
    debouncedSearchTimer = setTimeout(filterAndSortProspects, 200);
  };

  // ---------- Filtres & Tri (Archives) ----------
  function filterSourceArchives() {
    const sortValue = (document.getElementById('archiveSortFilter')?.value) || 'date_desc';
    let list = prospects.filter(p => p.archived);

    switch (sortValue) {
      case 'name_asc':  list.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name_desc': list.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'date_asc':  list.sort((a, b) => (parseFRDate(a.lastUpdate) || 0) - (parseFRDate(b.lastUpdate) || 0)); break;
      case 'date_desc': list.sort((a, b) => (parseFRDate(b.lastUpdate) || 0) - (parseFRDate(a.lastUpdate) || 0)); break;
    }
    return list;
  }
  window.filterAndSortArchives = function () {
    renderTableArchives(filterSourceArchives());
    updateStatsArchives();
  };

  // ---------- Switch vues ----------
  function applyViewVisibility() {
    const archivesSection = document.getElementById('archivesSection');
    const activeTable = document.getElementById('activeTable');
    const activeFilters = document.getElementById('activeFilters');
    const activeStats = document.getElementById('activeStats');
    const btn = document.getElementById('toggleArchivesBtn');

    if (onArchivesView) {
      archivesSection.style.display = '';
      activeTable.style.display = 'none';
      activeFilters.style.display = 'none';
      activeStats.style.display = 'none';
      btn.textContent = '↩️ Retour (Prospection)';
    } else {
      archivesSection.style.display = 'none';
      activeTable.style.display = '';
      activeFilters.style.display = '';
      activeStats.style.display = '';
      btn.textContent = '📂 Archives';
    }
  }
  function refreshCurrentView() {
    if (onArchivesView) {
      filterAndSortArchives();
    } else {
      filterAndSortProspects();
    }
  }
  function toggleArchives() {
    onArchivesView = !onArchivesView;
    applyViewVisibility();
    refreshCurrentView();
  }

  // ---------- Init ----------
  window.initProspectionPanel = function () {
    loadProspects();

    // Import / Export
    document.getElementById('importCsvBtn').addEventListener('click', () => {
      document.getElementById('importModal').style.display = 'flex';
    });
    document.getElementById('closeImportModal').addEventListener('click', () => {
      document.getElementById('importModal').style.display = 'none';
    });
    document.getElementById('executeImportBtn').addEventListener('click', importFromCsv);

    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) exportBtn.addEventListener('click', () => {
      exportToCsv(prospects, `prospection_${new Date().toISOString().slice(0, 10)}.csv`);
    });

    // Archives toggle
    document.getElementById('toggleArchivesBtn').addEventListener('click', toggleArchives);

    // Add prospect
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .map(id => document.getElementById(id))
      .forEach(el => el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addProspect(); }
      }));

    // Notes modal
    document.getElementById('closeNotesModal').addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);

    // Edit modal
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);

    // Vue initiale
    onArchivesView = false;
    applyViewVisibility();
    filterAndSortProspects();
  };
})();
