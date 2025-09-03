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

  function renderTable(list) {
    const tbody = document.getElementById('prospectTableBody');
    tbody.innerHTML = '';
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="muted">Aucun prospect trouvé.</td></tr>';
      return;
    }

    list.forEach((p, index) => {
      const tr = document.createElement('tr');
      const notesIcon = p.notes ? '<span class="icon-note-filled">📝</span>' : '<span class="icon-note-empty">🗒️</span>';
      
      tr.innerHTML = `
        <td>${p.name}</td>
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
            notes: '' // Ajout d'un champ notes vide par défaut
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
  };

  window.initProspectionPanel = function() {
    loadProspects();
    filterAndSortProspects();
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
    document.getElementById('closeNotesModal').addEventListener('click', closeNotesModal);
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
  };
})();
