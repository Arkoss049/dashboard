// Contenu mis à jour pour js/main.js

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

(function() {
    applyTheme(localStorage.getItem(LS_THEME_KEY) || 'dark');
})();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// --- 2. Gestion des Onglets et Chargement du Contenu ---
const tabs = document.querySelectorAll('.tab');
const appContent = document.getElementById('app-content');
const loadedModules = new Set();

async function loadTabContent(tabId) {
    appContent.innerHTML = '<div class="grid"><div class="card" style="grid-column: span 12;">Chargement...</div></div>';
    
    try {
        // Étape 1 : Charger le HTML de l'onglet
        const response = await fetch(`onglets/${tabId}.html`);
        if (!response.ok) throw new Error(`Le fichier de l'onglet "${tabId}" est introuvable.`);
        
        const html = await response.text();
        appContent.innerHTML = html;

        // Étape 2 : Charger et exécuter le JavaScript spécifique à l'onglet
        const modulePath = `js/modules/${tabId}.js`;
        
        const initFunctionName = `init${capitalize(tabId)}Panel`;

        if (loadedModules.has(tabId)) {
            if (typeof window[initFunctionName] === 'function') {
                window[initFunctionName]();
            }
            return;
        }

        const moduleResponse = await fetch(modulePath, { method: 'HEAD' });
        if (moduleResponse.ok) {
            const script = document.createElement('script');
            script.src = modulePath;
            
            script.onload = () => {
                if (typeof window[initFunctionName] === 'function') {
                    window[initFunctionName]();
                    loadedModules.add(tabId);
                }
            };
            
            document.body.appendChild(script);
        }

    } catch (error) {
        console.error('Erreur de chargement de l\'onglet:', error);
        appContent.innerHTML = `<div class="grid"><div class="card" style="grid-column: span 12; border-color: var(--danger);"><h3 class="section-title" style="color:var(--danger)">Erreur</h3><p>${error.message}</p></div></div>`;
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        loadTabContent(tabId);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadTabContent('prevoyance');
});
