// Contenu à mettre dans js/main.js

// --- 1. Gestion du Thème (Dark/Light) ---
const themeToggle = document.getElementById('theme-toggle');
const LS_THEME_KEY = 'dashboard.theme';

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME_KEY, theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem(LS_THEME_KEY) || 'dark';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Appliquer le thème sauvegardé au chargement
(function() {
    applyTheme(localStorage.getItem(LS_THEME_KEY) || 'dark');
})();

// Lier l'événement au bouton
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}


// --- 2. Gestion des Onglets et Chargement du Contenu ---
const tabs = document.querySelectorAll('.tab');
const appContent = document.getElementById('app-content');

// Un objet pour suivre les modules déjà chargés et éviter de les recharger
const loadedModules = new Set();

async function loadTabContent(tabId) {
    // Affiche un message de chargement
    appContent.innerHTML = '<div class="grid"><div class="card" style="grid-column: span 12;">Chargement...</div></div>';
    
    try {
        // 1. Charger le HTML de l'onglet
        const response = await fetch(`onglets/${tabId}.html`);
        if (!response.ok) {
            throw new Error(`Le fichier de l'onglet "${tabId}" est introuvable.`);
        }
        const html = await response.text();
        appContent.innerHTML = html;

        // 2. Charger et exécuter le JavaScript spécifique à l'onglet (si il existe)
        // On vérifie d'abord si le module existe avant de tenter de le charger
        const modulePath = `js/modules/${tabId}.js`;
        const moduleResponse = await fetch(modulePath, { method: 'HEAD' });

        if (moduleResponse.ok && !loadedModules.has(tabId)) {
            // Le fichier JS existe, on l'ajoute à la page
            const script = document.createElement('script');
            script.src = modulePath;
            document.body.appendChild(script);
            loadedModules.add(tabId); // On marque le module comme chargé
        }

    } catch (error) {
        console.error('Erreur de chargement de l\'onglet:', error);
        appContent.innerHTML = `<div class="grid"><div class="card" style="grid-column: span 12; border-color: var(--danger);"><h3 class="section-title" style="color:var(--danger)">Erreur</h3><p>${error.message}</p><p>Veuillez vérifier que le fichier <code>onglets/${tabId}.html</code> existe bien.</p></div></div>`;
    }
}

// Gérer le clic sur les onglets
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Mettre à jour la classe "active"
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');

        const tabId = tab.dataset.tab;
        loadTabContent(tabId);
    });
});

// Charger le premier onglet par défaut au lancement
document.addEventListener('DOMContentLoaded', () => {
    loadTabContent('prevoyance');
});
