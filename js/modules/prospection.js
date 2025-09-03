(function() {
  const PROSPECTS_STORAGE_KEY = 'prospectionData';
  let prospects = [];

  function saveProspects() {
    localStorage.setItem(PROSPECTS_STORAGE_KEY, JSON.stringify(prospects));
  }

  function loadProspects() {
    const stored = localStorage.getItem(PROSPECTS_STORAGE_KEY);
    if (stored) {
      prospects = JSON.parse(stored);
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
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.phone}</td>
        <td>${p.monthly} €</td>
        <td>${p.pp}</td>
        <td><span class="status-chip status-${p.status.toLowerCase().replace(/ /g, '-') || 'a-contacter'}">${p.status}</span></td>
        <td>${p.notes || ''}</td>
        <td>${p.lastUpdate || ''}</td>
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
        const index = e.target.dataset.index;
        prospects.splice(index, 1);
        saveProspects();
        filterAndSortProspects();
      });
    });

    document.querySelectorAll('#prospectTableBody .btn-status').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const newStatus = e.target.dataset.status;
            prospects[index].status = newStatus;
            prospects[index].lastUpdate = new Date().toLocaleDateString('fr-FR');
            saveProspects();
            filterAndSortProspects();
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
            notes: document.getElementById('prospectNotes').value,
            status: 'A contacter',
            lastUpdate: new Date().toLocaleDateString('fr-FR')
        });
        saveProspects();
        filterAndSortProspects();
        document.getElementById('prospectName').value = '';
        document.getElementById('prospectNumber').value = '';
        document.getElementById('prospectPP').value = '';
        document.getElementById('prospectAge').value = '';
        document.getElementById('prospectPhone').value = '';
        document.getElementById('prospectMonthly').value = '';
        document.getElementById('prospectNotes').value = '';
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
    renderTable();
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
  };
})();
