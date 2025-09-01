(function() {
  const CSV_PATH = '../../Correspondance.csv';
  let data = [];
  let debouncedSearchTimer = null;

  function normalize(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  function renderTable(results) {
    const tbody = document.getElementById('resultsTableBody');
    const countEl = document.getElementById('resultCount');
    tbody.innerHTML = '';
    
    if (results.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="muted">Aucun résultat.</td></tr>';
      countEl.textContent = '0 résultat';
      return;
    }

    results.slice(0, 50).forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row['CODE_CORRESPONDANCE'] || ''}</td>
        <td>${row['Correspondance'] || ''}</td>
        <td>${row['Acte Externe'] || ''}</td>
        <td>${row['Acte RC'] || ''}</td>
        <td>${row['Libellé Acte'] || ''}</td>
        <td>${row['Domaine Court Séjour'] || ''}</td>
        <td>${row['Libellé DCS'] || ''}</td>
      `;
      tbody.appendChild(tr);
    });

    countEl.textContent = `${results.length} résultat${results.length > 1 ? 's' : ''}`;
  }

  function runSearch() {
    const query = normalize(document.getElementById('searchInput').value);
    if (!query) {
      renderTable([]);
      return;
    }

    const filtered = data.filter(row => {
      return normalize(row['Acte Externe']).includes(query) ||
             normalize(row['Acte RC']).includes(query) ||
             normalize(row['Libellé Acte']).includes(query) ||
             normalize(row['CODE_CORRESPONDANCE']).includes(query);
    });
    renderTable(filtered);
  }

  window.debouncedSearch = function() {
    if (debouncedSearchTimer) clearTimeout(debouncedSearchTimer);
    debouncedSearchTimer = setTimeout(runSearch, 200);
  };

  window.initCorrespondancesPanel = async function() {
    try {
      const response = await fetch(CSV_PATH);
      if (!response.ok) throw new Error('Fichier CSV introuvable.');
      const csvText = await response.text();
      const rows = csvText.split('\n');
      const headers = rows[0].split(';');
      data = rows.slice(1).map(row => {
        const values = row.split(';');
        const obj = {};
        headers.forEach((header, i) => {
          obj[header.trim()] = values[i] ? values[i].trim() : '';
        });
        return obj;
      });
      runSearch();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      document.getElementById('resultsTableBody').innerHTML = '<tr><td colspan="7" class="muted error">Erreur lors du chargement des données.</td></tr>';
    }
  };
})();
