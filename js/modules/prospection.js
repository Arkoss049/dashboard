(function() {
  const PROSPECTS_STORAGE_KEY = 'prospectionData';
  let prospects = [];
  let currentProspectIndex = null;

  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }

  function loadProspects() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      prospects = JSON.parse(stored);
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
    const modal = document.getElementById('notesModal');
    modal.style.display = 'none';
    currentProspectIndex = null;
  }

  function saveNotes() {
    const textarea = document.getElementById('notesTextarea');
    if (currentProspectIndex !== null) {
      prospects[currentProspectIndex].notes = textarea.value;
      saveProspects();
      filterAndSortProspects();
      closeNotesModal();
    }
  }

  function updateStats() {
    const stats = {
      'total': prospects.length,
      'A contacter': 0,
      'A relancer': 0,
      'RDV Pris': 0,
      'RDV Refusé': 0
    };
    prospects.forEach(p => {
      if (stats[p.status] !== undefined) {
        stats[p.status]++;
      }
    });

    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-a-contacter').textContent = stats['A contacter'];
    document.getElementById('stat-a-relancer').textContent = stats['A relancer'];
    document.getElementById('stat-rdv-pris').textContent = stats['RDV Pris'];
    document.getElementById('stat-rdv-refuse').textContent = stats['RDV Refusé'];
  }

  function exportToCsv(data, filename) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(';'));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    if (!file) {
      alert("Veuillez sélectionner un fichier CSV.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const csvText = event.target.result;
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split(';').map(h => h.trim().replace(/"/g, ''));
      const importedProspects = lines.slice(1).map(line => {
        const values = line.split(';').map(v => v.trim().replace(/"/g, ''));
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        
        // Ajoute les champs manquants si nécessaire
        if (!obj.status) obj.status = 'A contacter';
        if (!obj.lastUpdate) obj.lastUpdate = new Date().toLocaleDateString('fr-FR');
        if (!obj.notes) obj.notes = '';
        return obj;
      });

      prospects = [...prospects, ...importedProspects];
      saveProspects();
      filterAndSortProspects();
      alert(`Importation réussie : ${importedProspects.length} contacts ajoutés.`);
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
      const notesIcon = p.notes ? '<span class="icon-note-filled">📝</span>' : '<span class="icon-note-empty">🗒️</span>';
      
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.number}</td>
        <td>${p.phone}</td>
        <td>${p.monthly} €</td>
        <td>${p.pp}</td>
        <td><span class="status-chip status-${p.status.toLowerCase().replace(/ /g, '-') || 'a-contacter'}">${p.status}</span></td>
        <td>${p.lastUpdate || ''}</td>
        <td>
          <button class="btn btn-ghost btn-notes" data-index="${prospects.indexOf(p)}">
            ${notesIcon}
          </button>
        </td>
        <td>
          <button class="btn btn-status" data-status="A contacter" data-index="${prospects.indexOf(p)}">A contacter</button>
          <button class="btn btn-status" data-status="A relancer" data-index="${prospects.indexOf(p)}">A relancer</button>
          <button class="btn btn-status" data-status="RDV Pris" data-index="${prospects.indexOf(p)}">RDV Pris</button>
          <button class="btn btn-status" data-status="RDV Refusé" data-index="${prospects.indexOf(p)}">RDV Refusé</button>
          <button class="btn btn-danger btn-small" data-index="${prospects.indexOf(p)}">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    // Gestion des événements de la table
    document.querySelectorAll('#prospectTableBody .btn-danger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.closest('button').dataset.index;
        prospects.splice(index, 1);
        saveProspects();
        filterAndSortProspects();
      });
    });

    document.querySelectorAll('#prospectTableBody .btn-status').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            const newStatus = e.target.closest('button').dataset.status;
            prospects[index].status = newStatus;
            prospects[index].lastUpdate = new Date().toLocaleDateString('fr-FR');
            saveProspects();
            filterAndSortProspects();
        });
    });

    document.querySelectorAll('#prospectTableBody .btn-notes').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            openNotesModal(index);
        });
    });
  }

  function addProspect() {
    const name = document.getElementById('prospectName').value;
    const phone = document.getElementById('prospectPhone').value;
    
    if (name) {
        prospects.push({
            name,
            number: document.getElementById('prospectNumber').value,
            pp: document.getElementById('prospectPP').value,
            age: document.getElementById('prospectAge').value,
            phone,
            monthly: document.getElementById('prospectMonthly').value,
            status: 'A contacter',
            lastUpdate: new Date().toLocaleDateString('fr-FR'),
            notes: ''
        });
        saveProspects();
        filterAndSortProspects();
        document.getElementById('prospectName').value = '';
        document.getElementById('prospectNumber').value = '';
        document.getElementById('prospectPP').value = '';
        document.getElementById('prospectAge').value = '';
        document.getElementById('prospectPhone').value = '';
        document.getElementById('prospectMonthly').value = '';
    }
  }
  
  window.filterAndSortProspects = function() {
    const filterStatus = document.getElementById('statusFilter').value;
    const sortValue = document.getElementById('sortFilter').value;
    
    let filtered = prospects;
    if (filterStatus !== 'all') {
      filtered = prospects.filter(p => p.status === filterStatus);
    }
    
    // Logic de tri
    switch (sortValue) {
      case 'name_asc': filtered.sort((a,b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': filtered.sort((a,b) => b.name.localeCompare(a.name)); break;
      case 'age_asc': filtered.sort((a,b) => a.age - b.age); break;
      case 'age_desc': filtered.sort((a,b) => b.age - a.age); break;
      case 'monthly_asc': filtered.sort((a,b) => a.monthly - b.monthly); break;
      case 'monthly_desc': filtered.sort((a,b) => b.monthly - a.monthly); break;
    }
    
    renderTable(filtered);
    updateStats();
  };

  window.initProspectionPanel = function() {
    loadProspects();
    filterAndSortProspects();
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
    document.getElementById('closeNotesModal').addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('exportCsvBtn').addEventListener('click', () => {
        exportToCsv(prospects, 'prospects.csv');
    });
    document.getElementById('importCsvBtn').addEventListener('click', importFromCsv);
  };
})();
