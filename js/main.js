// Fonction pour basculer entre les onglets
function switchTab(tabName) {
    // 1. Gérer la classe "active" pour les onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    // 2. Gérer le contenu des onglets
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    const activeContent = document.querySelector(`.tab-content[data-tab-content="${tabName}"]`);
    if (activeContent) {
        activeContent.style.display = 'grid'; // Ou 'flex', selon le style de ton onglet
    }

    // 3. Charger et initialiser le module si nécessaire
    if (tabName === 'scripts' && !document.getElementById('scripts-module-container').innerHTML.trim()) {
        // Charge le contenu HTML du module "scripts"
        fetch('modules/scripts.html')
            .then(response => response.text())
            .then(html => {
                const container = document.getElementById('scripts-container');
                container.innerHTML = html;
                // Initialise le module une fois le contenu chargé
                if (window.loadScriptsModule) {
                    window.loadScriptsModule();
                }
            })
            .catch(error => {
                console.error('Erreur de chargement du module scripts:', error);
            });
    }
}

// Ajouter des écouteurs d'événements pour les onglets
document.querySelectorAll('.tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Gérer le changement de thème
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
        }
    });
}

// Fonction pour initialiser l'application au chargement de la page
function initApp() {
    // Affiche l'onglet "Prévoyance" par défaut au démarrage
    switchTab('prevoyance');
}

// Écouteur d'événement pour le chargement de la page
document.addEventListener('DOMContentLoaded', initApp);
