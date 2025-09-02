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

  function renderTable(filteredProspects = prospects) {
    const tbody = document.getElementById('prospectTableBody');
    tbody.innerHTML = '';
    if (filteredProspects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="muted">Aucun prospect trouvé.</td></tr>';
      return;
    }

    filteredProspects.forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.number}</td>
        <td>${p.pp}</td>
        <td>${p.age}</td>
        <td>${p.phone}</td>
        <td>${p.monthly} €</td>
        <td>${p.status}</td>
        <td><button class="btn btn-danger btn-small" data-index="${prospects.indexOf(p)}">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('#prospectTableBody .btn-danger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        prospects.splice(index, 1);
        saveProspects();
        renderTable();
      });
    });
  }

  function addProspect() {
    const name = document.getElementById('prospectName').value;
    const number = document.getElementById('prospectNumber').value;
    const pp = document.getElementById('prospectPP').value;
    const age = document.getElementById('prospectAge').value;
    const phone = document.getElementById('prospectPhone').value;
    const monthly = document.getElementById('prospectMonthly').value;
    const status = document.getElementById('prospectStatus').value;

    if (name) {
      prospects.push({ name, number, pp, age, phone, monthly, status });
      saveProspects();
      renderTable();
      document.getElementById('prospectName').value = '';
      document.getElementById('prospectNumber').value = '';
      document.getElementById('prospectPP').value = '';
      document.getElementById('prospectAge').value = '';
      document.getElementById('prospectPhone').value = '';
      document.getElementById('prospectMonthly').value = '';
    }
  }

  window.filterProspects = function() {
    const filterStatus = document.getElementById('statusFilter').value;
    if (filterStatus === 'all') {
      renderTable();
    } else {
      const filtered = prospects.filter(p => p.status === filterStatus);
      renderTable(filtered);
    }
  };

  window.initProspectionPanel = function() {
    loadProspects();
    renderTable();
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
  };
})();
