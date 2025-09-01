// --- Gestion du Thème (Dark/Light) ---
const LS_THEME_KEY = 'dashboard.theme';

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

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// --- Gestion des Onglets ---
const tabs = document.querySelectorAll('.tab');
const appContent = document.getElementById('app-content');

async function loadTabContent(tabId) {
    // Affiche un message de chargement
    appContent.innerHTML = '<div class="grid"><div class="card" style="grid-column: span 12;">Chargement...</div></div>';

    // Assurez-vous que l'onglet est bien actif
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');

    try {
        // Charge le contenu HTML de l'onglet
        const htmlResponse = await fetch(`onglets/${tabId}.html`);
        if (!htmlResponse.ok) {
            throw new Error(`Fichier HTML pour "${tabId}" introuvable.`);
        }
        appContent.innerHTML = await htmlResponse.text();

    } catch (error) {
        console.error('Erreur de chargement de l\'onglet:', error);
        appContent.innerHTML = `<div class="grid"><div class="card" style="grid-column: span 12; border-color: var(--danger);"><h3 class="section-title" style="color:var(--danger)">Erreur</h3><p>${error.message}</p></div></div>`;
    }
}

// Ajoute les écouteurs d'événements pour les clics sur les onglets
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        loadTabContent(tab.dataset.tab);
    });
});

// Initialise l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadTabContent('prevoyance'); // Charge l'onglet "Prévoyance" par défaut
});
