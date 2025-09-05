(function () {
  const PROSPECTS_STORAGE_KEY = 'prospectionData';
  let prospects = [];
  let currentProspectIndex = null;
  let debouncedSearchTimer = null;

  const STATUS_LIST = ['A contacter', 'A relancer', 'RDV Pris', 'RDV Refusé'];

  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }

  function loadProspects() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      try { prospects = JSON.parse(stored); } catch { prospects = []; }
    }
  }

  // ---------- Notes ----------
  function openNotesModal(index) {
    const modal = document.getElementById('notesModal');
    const textarea = document.getElementById('notesTextarea');
    currentProspectIndex = index;
    textarea.value = prospects[index].notes || '';
    modal.style.display = 'flex';
  }
  function closeNotesModal() {
    document.getElementById('notesModal').style.display = 'none';
    currentProspectIndex = null;
  }
  function saveNotes() {
    const textarea = document.getElementById('notesTextarea');
    if (currentProspectIndex !== null) {
      prospects[currentProspectIndex].notes = textarea.value;
      prospects[currentProspectIndex].lastUpdate = new Date().toLocaleDateString('fr-FR');
      saveProspects();
      debouncedFilterAndSort();
      closeNotesModal();
    }
  }

  // ---------- Import ----------
  function openImportModal() {
    document.getElementById('importModal').style.display = 'flex';
  }
  function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
  }

  // ---------- Edit ----------
  function openEditModal(index) {
    currentProspectIndex = index;
    const p = prospects[index];

    document.getElementById('editName').value    = p.name || '';
    document.getElementById('editNumber').value  = p.number || '';
    document.getElementById('editPhone').value   = p.phone || '';
    document.getElementById('editMonthly').value = (p.monthly ?? '') === '' ? '' : p.monthly;
    document.getElementById('editPP').value      = (p.pp ?? '') === '' ? '' : p.pp;
    document.getElementById('editAge').value     = (p.age ?? '') === '' ? '' : p.age;
    document.getElementById('editStatus').value  = p.status || 'A contacter';
    document.getElementById('editNotes').value   = p.notes || '';

    document.getElementById('editModal').style.display = 'flex';
  }
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentProspectIndex = null;
  }

  // conversion robuste
  function toNumberOrNull(v) {
    const s = String(v ?? '').replace(',', '.').trim();
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function updateStats() {
    const stats = { total: prospects.length, 'A contacter':0, 'A relancer':0, 'RDV Pris':0, 'RDV Refusé':0 };
    prospects.forEach((p) => { if (stats[p.status] !== undefined) stats[p.status]++; });

    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-a-contacter').textContent = stats['A contacter'];
    document.getElementById('stat-a-relancer').textContent = stats['A relancer'];
    document.getElementById('stat-rdv-pris').textContent = stats['RDV Pris'];
    document.getElementById('stat-rdv-refusé').textContent = stats['RDV Refusé'];
  }

  function exportToCsv(data, filename) {
    if (!data || data.length === 0) { alert('Aucune donnée à exporter.'); return; }
    const headers = ['name','number','phone','monthly','pp','age','status','lastUpdate','notes'];
    const csvRows = [headers.join(';')];
    for (const row of data) {
      const values = headers.map((h) => {
        const value = row[h] ?? '';
        const escaped = String(value).replace(/"/g, '""'); // CSV standard
        return `"${escaped}"`;
      });
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
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    if (!file) { alert('Veuillez sélectionner un fichier CSV.'); return; }

    const reader = new FileReader();
    reader.onload = function (event) {
      const csvText = event.target.result;
      const lines = csvText.split('\n').filter((line) => line.trim() !== '');
      if (lines.length === 0) return;

      const headers = lines[0].split(';').map((h) => h.trim().replace(/"/g, ''));
      const importedProspects = lines.slice(1).map((line) => {
        const values = line.split(';').map((v) => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, i) => { obj[header] = values[i] || ''; });

        obj.name = obj.name || '';
        obj.number = obj.number || '';
        obj.phone = obj.phone || '';
        obj.monthly = toNumberOrNull(obj.monthly) ?? '';
        obj.pp = toNumberOrNull(obj.pp) ?? '';
        obj.age = toNumberOrNull(obj.age) ?? '';
        if (!obj.status) obj.status = 'A contacter';
        if (!obj.lastUpdate) obj.lastUpdate = new Date().toLocaleDateString('fr-FR');
        if (!obj.notes) obj.notes = '';
        return obj;
      });

      prospects = [...prospects, ...importedProspects];
      saveProspects();
      debouncedFilterAndSort();
      alert(`Importation réussie : ${importedProspects.length} contacts ajoutés.`);
      closeImportModal();
    };
    reader.readAsText(file);
  }

  function statusClassFromValue(v) {
    return (v || 'A contacter').toLowerCase().replace(/ /g, '-'); // ex: "a-relancer"
  }

  function renderTable(list) {
    const tbody = document.getElementById('prospectTableBody');
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="muted">Aucun prospect trouvé.</td></tr>';
      return;
    }

    list.forEach((p) => {
      const tr = document.createElement('tr');
      const idx = prospects.indexOf(p);

      // Notes icône
      const notesIcon = p.notes ? '📝' : '🗒️';

      // --- STATUT: dropdown conservant les couleurs ---
      const st = p.status || 'A contacter';
      const stClass = statusClassFromValue(st);
      const options = STATUS_LIST.map((s) =>
        `<option value="${s}" ${s === st ? 'selected' : ''}>${s}</option>`
      ).join('');
      const statusSelect = `
        <select class="status-select status-${stClass}" data-index="${idx}">
          ${options}
        </select>
      `;

      // --- ACTIONS: crayon (édition) + poubelle ---
      const actions = `
        <div class="actions">
          <button class="btn btn-ghost btn-edit" data-index="${idx}" title="Modifier">✏️</button>
          <button class="btn btn-danger btn-small" data-index="${idx}" title="Supprimer">🗑️</button>
        </div>
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
          <button class="btn btn-ghost btn-notes" data-index="${idx}" title="Notes">${notesIcon}</button>
        </td>
        <td>${actions}</td>
      `;
      tbody.appendChild(tr);
    });

    // Suppression
    document.querySelectorAll('#prospectTableBody .btn-danger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.dataset.index;
        prospects.splice(index, 1);
        saveProspects();
        debouncedFilterAndSort();
      });
    });

    // Edition (crayon)
    document.querySelectorAll('#prospectTableBody .btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.dataset.index;
        openEditModal(Number(index));
      });
    });

    // Notes
    document.querySelectorAll('#prospectTableBody .btn-notes').forEach((btn) => {
      btn.addEventListener('click', (e) => openNotesModal(Number(e.currentTarget.dataset.index)));
    });

    // Changement du statut via <select>
    document.querySelectorAll('#prospectTableBody .status-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const newStatus = e.currentTarget.value;
        prospects[index].status = newStatus;
        prospects[index].lastUpdate = new Date().toLocaleDateString('fr-FR');
        saveProspects();
        debouncedFilterAndSort(); // re-render pour actualiser la couleur du select
      });
    });
  }

  function addProspect() {
    const name = document.getElementById('prospectName').value.trim();
    const number = document.getElementById('prospectNumber').value.trim();
    if (!name || !number) { alert("Le nom et le numéro d'adhérent sont obligatoires."); return; }
    const isDuplicate = prospects.some((p) => p.number === number);
    if (isDuplicate) { alert("Ce numéro d'adhérent existe déjà."); return; }

    prospects.push({
      name,
      number,
      pp: toNumberOrNull(document.getElementById('prospectPP').value) ?? '',
      age: toNumberOrNull(document.getElementById('prospectAge').value) ?? '',
      phone: document.getElementById('prospectPhone').value.trim(),
      monthly: toNumberOrNull(document.getElementById('prospectMonthly').value) ?? '',
      status: 'A contacter',
      lastUpdate: new Date().toLocaleDateString('fr-FR'),
      notes: '',
    });
    saveProspects();
    debouncedFilterAndSort();

    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .forEach((id) => (document.getElementById(id).value = ''));
    document.getElementById('prospectName').focus();
  }

  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  window.filterAndSortProspects = function () {
    const searchTerm = normalize(document.getElementById('searchFilter').value);
    const filterStatus = document.getElementById('statusFilter').value;
    const sortValue = document.getElementById('sortFilter').value;

    let filtered = prospects.slice();

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          normalize(p.name).includes(searchTerm) ||
          normalize(p.number).includes(searchTerm) ||
          normalize(p.phone).includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((p) => (p.status || 'A contacter') === filterStatus);
    }

    switch (sortValue) {
      case 'name_asc':     filtered.sort((a,b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name_desc':    filtered.sort((a,b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'age_asc':      filtered.sort((a,b) => (a.age ?? 0) - (b.age ?? 0)); break;
      case 'age_desc':     filtered.sort((a,b) => (b.age ?? 0) - (a.age ?? 0)); break;
      case 'monthly_asc':  filtered.sort((a,b) => (a.monthly ?? 0) - (b.monthly ?? 0)); break;
      case 'monthly_desc': filtered.sort((a,b) => (b.monthly ?? 0) - (a.monthly ?? 0)); break;
    }

    renderTable(filtered);
    updateStats();
  };

  window.debouncedFilterAndSort = function () {
    if (debouncedSearchTimer) clearTimeout(debouncedSearchTimer);
    debouncedSearchTimer = setTimeout(filterAndSortProspects, 200);
  };

  // ---------- Save from Edit Modal ----------
  function saveEditFromModal() {
    if (currentProspectIndex === null) return;
    const idx = currentProspectIndex;
    const p = prospects[idx];

    const newName    = document.getElementById('editName').value.trim();
    const newNumber  = document.getElementById('editNumber').value.trim();
    const newPhone   = document.getElementById('editPhone').value.trim();
    const newMonthly = toNumberOrNull(document.getElementById('editMonthly').value) ?? '';
    const newPP      = toNumberOrNull(document.getElementById('editPP').value) ?? '';
    const newAge     = toNumberOrNull(document.getElementById('editAge').value) ?? '';
    const newStatus  = document.getElementById('editStatus').value;
    const newNotes   = document.getElementById('editNotes').value;

    if (!newName || !newNumber) {
      alert("Le nom et le numéro d'adhérent sont obligatoires.");
      return;
    }
    const duplicate = prospects.some((x, i) => i !== idx && x.number === newNumber);
    if (duplicate) {
      alert("Ce numéro d'adhérent existe déjà.");
      return;
    }

    p.name = newName;
    p.number = newNumber;
    p.phone = newPhone;
    p.monthly = newMonthly;
    p.pp = newPP;
    p.age = newAge;
    p.status = newStatus;
    p.notes = newNotes;
    p.lastUpdate = new Date().toLocaleDateString('fr-FR');

    saveProspects();
    debouncedFilterAndSort();
    closeEditModal();
  }

  // ---------- Init ----------
  window.initProspectionPanel = function () {
    loadProspects();
    debouncedFilterAndSort();

    document.getElementById('addProspectBtn').addEventListener('click', addProspect);

    // Notes
    document.getElementById('closeNotesModal').addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);

    // Import
    document.getElementById('importCsvBtn').addEventListener('click', openImportModal);
    document.getElementById('closeImportModal').addEventListener('click', closeImportModal);
    document.getElementById('executeImportBtn').addEventListener('click', importFromCsv);

    // Export
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportToCsv(prospects, `prospection_${new Date().toISOString().slice(0, 10)}.csv`);
      });
    }

    // Edit Modal
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveEditFromModal);

    // Entrée pour ajouter
    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .map((id) => document.getElementById(id))
      .forEach((el) => el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addProspect(); }
      }));
  };
})();
