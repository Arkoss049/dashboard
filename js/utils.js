// Contenu pour js/utils.js

// Fonctions utilitaires globales

const fmt0 = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
const fmt = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' });
const today = new Date();

function yearNow() {
    return today.getFullYear();
}

function monthIndexNow() {
    return today.getMonth(); // 0..11
}

function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}
