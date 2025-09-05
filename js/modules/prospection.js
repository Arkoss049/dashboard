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
      try {
        prospects = JSON.parse(stored);
      } catch {
        prospects = [];
      }
    }
  }

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
      saveProspects();
      debouncedFilterAndSort();
      closeNotesModal();
    }
  }

  function openImportModal() {
    document.getElementById('importModal').style.display = 'flex';
  }
  function closeImportModal() {
    document.getElementById('importModal').style.display = 'none';
  }

  function toNumberOrNull(v) {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }

  function updateStats() {
    const stats = {
      total: prospects.length,
      'A contacter': 0,
      'A relancer': 0,
      'RDV Pris': 0,
      'RDV Refusé': 0,
    };
    prospects.forEach((p) => {
      if (stats[p.status] !== undefined) stats[p.status]++;
    });

    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-a-contacter').textContent = stats['A contacter'];
    document.getElementById('stat-a-relancer').textContent = stats['A relancer'];
    document.getElementById('stat-rdv-pris').textContent = stats['RDV Pris'];
    document.getElementById('stat-rdv-refusé').textContent = stats['RDV Refusé'];
  }

  function exportToCsv(data, filename) {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter.');
      return;
    }
    const headers = [
      'name',
      'number',
      'phone',
      'monthly',
      'pp',
      'age',
      'status',
      'lastUpdate',
      'notes',
    ];
    const csvRows = [];
    csvRows.push(headers.join(';'));
    for (const row of data) {
      const values = headers.map((h) => {
        const value = row[h] ?? '';
        const escaped = String(value).replace(/"/g, '\\"');
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
    if (!file) {
      alert('Veuillez sélectionner un fichier CSV.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const csvText = event.target.result;
      const lines = csvText.split('\n').filter((line) => line.trim() !== '');
      if (lines.length === 0) return;

      const headers = lines[0]
        .split(';')
        .map((h) => h.trim().replace(/"/g, ''));

      const importedProspects = lines.slice(1).map((line) => {
        const values = line.split(';').map((v) => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });

        // Normalisation
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

      // ✅ Correction du bug de fusion
      prospects = [...prospects, ...importedProspects];
      saveProspects();
      debouncedFilterAndSort();
      alert(`Importation réussie : ${importedProspects.length} contacts ajoutés.`);
      closeImportModal();
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
      const notesIcon = p.notes
        ? '<span class="icon-note-filled">📝</span>'
        : '<span class="icon-note-empty">🗒️</span>';

      const statusButtons = `
        <div class="status-buttons">
          <button class="btn btn-status ${p.status === 'A contacter' ? 'active' : ''}" data-status="A contacter" data-index="${prospects.indexOf(p)}">A contacter</button>
          <button class="btn btn-status ${p.status === 'A relancer' ? 'active' : ''}" data-status="A relancer" data-index="${prospects.indexOf(p)}">A relancer</button>
          <button class="btn btn-status ${p.status === 'RDV Pris' ? 'active' : ''}" data-status="RDV Pris" data-index="${prospects.indexOf(p)}">RDV Pris</button>
          <button class="btn btn-status ${p.status === 'RDV Refusé' ? 'active' : ''}" data-status="RDV Refusé" data-index="${prospects.indexOf(p)}">RDV Refusé</button>
          <button class="btn btn-danger btn-small" data-index="${prospects.indexOf(p)}">🗑️</button>
        </div>
      `;

      tr.innerHTML = `
        <td>${p.name || ''}</td>
        <td>${p.number || ''}</td>
        <td>${p.phone || ''}</td>
        <td>${p.monthly !== null && p.monthly !== undefined && p.monthly !==
