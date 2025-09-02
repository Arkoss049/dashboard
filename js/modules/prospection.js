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

  function renderTable() {
    const tbody = document.getElementById('prospectTableBody');
    tbody.innerHTML = '';
    if (prospects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Aucun prospect ajouté.</td></tr>';
      return;
    }

    prospects.forEach((p, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.number}</td>
        <td>${p.pp}</td>
        <td>${p.age}</td>
        <td>${p.cotisation} €</td>
        <td><button class="btn btn-danger btn-small" data-index="${index}">Supprimer</button></td>
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
    const cotisation = document.getElementById('prospectCotisation').value;

    if (name) {
      prospects.push({ name, number, pp, age, cotisation });
      saveProspects();
      renderTable();
      document.getElementById('prospectName').value = '';
      document.getElementById('prospectNumber').value = '';
      document.getElementById('prospectPP').value = '';
      document.getElementById('prospectAge').value = '';
      document.getElementById('prospectCotisation').value = '';
    }
  }

  window.initProspectionPanel = function() {
    loadProspects();
    renderTable();
    document.getElementById('addProspectBtn').addEventListener('click', addProspect);
  };
})();
