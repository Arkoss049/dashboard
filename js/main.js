// --- Gestion du Thème (Dark/Light) ---
const LS_THEME_KEY = 'dashboard.theme';
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME_KEY, theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem(LS_THEME_KEY) || 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

(function() {
    applyTheme(localStorage.getItem(LS_THEME_KEY) || 'dark');
})();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// --- Gestion des onglets actifs ---
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.tab').forEach(tab => {
  const tabPath = tab.getAttribute('href');
  if (tabPath && tabPath.includes(currentPath)) {
    tab.classList.add('active');
  } else {
    tab.classList.remove('active');
  }
});
