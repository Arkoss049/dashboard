(function () {
  const PROSPECTS_STORAGE_KEY = 'prospectionData';
  let prospects = [];
  let currentProspectIndex = null;
  let debouncedSearchTimer = null;

  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }

  function loadProspects() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      try { prospects = JSON.parse(stored); } catch { prospects = []; }
    }
  }

  function toNumberOrNull(v) {
    const s = String(v ?? '').replace(',', '.').trim();
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  // Parse "dd/mm/yyyy" -> Date
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

  function updateStats() {
    const stats = { total: prospects.length, 'A contacter': 0, 'A relancer': 0, 'RDV Pris': 0, 'RDV Refusé': 0 };
    prospects.forEach(p => { if (stats[p.status] !== undefined) stats[p.status]++; });

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
      const importedProspects = lines.slice(1).map(line => {
        const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, i) => obj[header] = values[i] || '');

        obj.name = obj.name || '';
        obj.number = obj.number || '';
        obj.phone = obj.phone || '';
        obj.monthly = toNumberOrNull(obj.monthly) ?? '';
        obj.pp = toNumberOrNull(obj.pp) ?? '';
        obj.age = toNumberOrNull(obj.age) ?? '';
        if (!obj.status) obj.status = 'A contacter';
        if (!obj.lastUpdate) obj.lastUpdate = formatTodayFR();
        if (!obj.notes) obj.notes = '';
        return obj;
      });

      prospects = [...prospects, ...importedProspects];
      saveProspects();
      debouncedFilterAndSort();
      alert(`Importation réussie : ${importedProspects.length} contacts ajoutés.`);
      document.getElementById('importModal').style.display = 'none';
    };
    reader.readAsText(file);
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
      const idx = prospects.indexOf(p); // <-- index réel dans la source
      const notesIcon = p.notes ? '📝' : '🗒️';

      const statusCls = (p.status || 'A contacter').toLowerCase().replace(/ /g, '-');
      const statusSelect = `
        <select class="status-select status-${statusCls}" data-index="${idx}">
          <option ${p.status === 'A contacter' ? 'selected' : ''}>A contacter</option>
          <option ${p.status === 'A relancer' ? 'selected' : ''}>A relancer</option>
          <option ${p.status === 'RDV Pris' ? 'selected' : ''}>RDV Pris</option>
          <option ${p.status === 'RDV Refusé' ? 'selected' : ''}>RDV Refusé</option>
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
          <button class="btn btn-ghost btn-notes" data-index="${idx}" title="Notes">${notesIcon}</button>
        </td>
        <td>
          <button class="btn btn-ghost btn-edit" data-index="${idx}" title="Modifier">✏️</button>
          <button class="btn btn-danger btn-small" data-index="${idx}" title="Supprimer">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Suppression
    document.querySelectorAll('#prospectTableBody .btn-danger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        prospects.splice(index, 1);
        saveProspects();
        debouncedFilterAndSort();
      });
    });

    // Notes
    document.querySelectorAll('#prospectTableBody .btn-notes').forEach((btn) => {
      btn.addEventListener('click', (e) => openNotesModal(Number(e.currentTarget.dataset.index)));
    });

    // Édition
    document.querySelectorAll('#prospectTableBody .btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => openEditModal(Number(e.currentTarget.dataset.index)));
    });

    // Changement de statut
    document.querySelectorAll('#prospectTableBody .status-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const newStatus = e.currentTarget.value;
        prospects[index].status = newStatus;
        prospects[index].lastUpdate = formatTodayFR();
        saveProspects();
        debouncedFilterAndSort(); // re-render pour rafraîchir la couleur du select
      });
    });
  }

  // === Ajout ===
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
    });
    saveProspects();
    debouncedFilterAndSort();

    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('prospectName').focus();
  }

  // === Modales Notes ===
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
      saveProspects();
      debouncedFilterAndSort();
      closeNotesModal();
    }
  }

  // === Modale Édition ===
  function openEditModal(index) {
    currentProspectIndex = index;
    const p = prospects[index];
    document.getElementById('editName').value = p.name || '';
    document.getElementById('editNumber').value = p.number || '';
    document.getElementById('editAge').value = p.age ?? '';
    document.getElementById('editPhone').value = p.phone || '';
    document.getElementById('editMonthly').value = p.monthly ?? '';
    document.getElementById('editPP').value = p.pp ?? '';
    document.getElementById('editStatus').value = p.status || 'A contacter';
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
      alert("Ce numéro d'adhérent existe déjà.");
      return;
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
    debouncedFilterAndSort();
    closeEditModal();
  }

  // === Filtres & Tri ===
  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  window.filterAndSortProspects = function () {
    const searchTerm   = normalize(document.getElementById('searchFilter').value);
    const filterStatus = document.getElementById('statusFilter').value;
    const filterDate   = document.getElementById('dateFilter').value;
    const sortValue    = document.getElementById('sortFilter').value;

    let filtered = prospects.slice();

    if (searchTerm) {
      filtered = filtered.filter(p =>
        normalize(p.name).includes(searchTerm) ||
        normalize(p.number).includes(searchTerm) ||
        normalize(p.phone).includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => (p.status || 'A contacter') === filterStatus);
    }

    // Filtre par période
    if (filterDate !== 'all') {
      const now = new Date(); now.setHours(0,0,0,0);

      // Lundi = début de semaine
      const day = now.getDay();
      const deltaToMonday = (day + 6) % 7;
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - deltaToMonday);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear  = new Date(now.getFullYear(), 0, 1);

      filtered = filtered.filter(p => {
        const d = parseFRDate(p.lastUpdate);
        if (!d) return false;
        d.setHours(0,0,0,0);

        switch (filterDate) {
          case 'today': return d.getTime() === now.getTime();
          case 'week':  return d >= startOfWeek;
          case 'month': return d >= startOfMonth;
          case 'year':  return d >= startOfYear;
          default: return true;
        }
      });
    }

    // Tri
    switch (sortValue) {
      case 'name_asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
      case 'name_desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || '')); break;
      case 'age_asc':
        filtered.sort((a, b) => (a.age ?? 0) - (b.age ?? 0)); break;
      case 'age_desc':
        filtered.sort((a, b) => (b.age ?? 0) - (a.age ?? 0)); break;
      case 'monthly_asc':
        filtered.sort((a, b) => (a.monthly ?? 0) - (b.monthly ?? 0)); break;
      case 'monthly_desc':
        filtered.sort((a, b) => (b.monthly ?? 0) - (a.monthly ?? 0)); break;
      case 'date_asc':
        filtered.sort((a, b) => (parseFRDate(a.lastUpdate) || 0) - (parseFRDate(b.lastUpdate) || 0)); break;
      case 'date_desc':
        filtered.sort((a, b) => (parseFRDate(b.lastUpdate) || 0) - (parseFRDate(a.lastUpdate) || 0)); break;
    }

    renderTable(filtered);
    updateStats();
  };

  window.debouncedFilterAndSort = function () {
    if (debouncedSearchTimer) clearTimeout(debouncedSearchTimer);
    debouncedSearchTimer = setTimeout(filterAndSortProspects, 200);
  };

  // === Init ===
  window.initProspectionPanel = function () {
    loadProspects();
    debouncedFilterAndSort();

    // Boutons principaux
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);

    // Notes
    document.getElementById('closeNotesModal').addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);

    // Import
    document.getElementById('importCsvBtn').addEventListener('click', () => {
      document.getElementById('importModal').style.display = 'flex';
    });
    document.getElementById('closeImportModal').addEventListener('click', () => {
      document.getElementById('importModal').style.display = 'none';
    });
    document.getElementById('executeImportBtn').addEventListener('click', importFromCsv);

    // Edit
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);

    // Export
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportToCsv(prospects, `prospection_${new Date().toISOString().slice(0, 10)}.csv`);
      });
    }

    // Entrée ↵ pour ajouter
    ['prospectName','prospectNumber','prospectPP','prospectAge','prospectPhone','prospectMonthly']
      .map(id => document.getElementById(id))
      .forEach(el => el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addProspect(); }
      }));
  };
})();
