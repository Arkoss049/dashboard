function initMailPanel() {

    // ===== Données & Constantes =====
    const hardcodedEmails = {
        "RESILIATION_OR_NA": { name: "Résiliation", subject: "Harmonie Mutuelle - Nous regrettons votre départ", body: `Madame, Monsieur [Nom de l'adhérent],\n\nNous accusons bonne réception de votre demande de résiliation. Nous souhaiterions vivement vous remercier pour la confiance que vous nous avez accordée durant ces dernières années.\n\nVotre décision nous a amenés à réfléchir aux différentes solutions qui s'offrent à vous et nous avons, à ce titre, de nouvelles solutions adaptées à votre situation.\n\nAussi, nous serions ravis de discuter avec vous de votre décision et de vous informer de nos solutions en prévoyance.\n\nPour en savoir plus, cliquez ici : [Lien vers un quiz ou une page d'information]\n\nNous restons à votre disposition,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SUITE_RESIL_DDE_CONTACT_OR_NA": { name: "Suite résil. (dem. contact)", subject: "Harmonie Mutuelle - Suite à notre échange téléphonique", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJe vous contacte suite à ma tentative d'appel concernant votre demande de résiliation.\n\nJe reste à votre entière disposition pour en discuter et vous accompagner dans vos réflexions.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        // NOTE: Les autres modèles sont omis ici pour la lisibilité, mais ils sont dans le code complet ci-dessous
    };
    const LOCAL_STORAGE_KEY = 'emailModelsData';
    const DISABLED_DEFAULTS_KEY = 'emailModelsDisabledDefaults';
    let editingModelId = null;

    // ===== Fonctions Utilitaires =====
    function getDisabledDefaults() {
        try { return JSON.parse(localStorage.getItem(DISABLED_DEFAULTS_KEY)) || []; } 
        catch (e) { return []; }
    }

    function setDisabledDefaults(list) {
        localStorage.setItem(DISABLED_DEFAULTS_KEY, JSON.stringify(list));
    }

    function initializeData() {
        let storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let models = {};
        if (!storedData) {
            let initialData = {};
            for (let key in hardcodedEmails) {
                initialData[key] = { ...hardcodedEmails[key], isDefault: true };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
        } else {
            models = JSON.parse(storedData);
            let disabled = new Set(getDisabledDefaults());
            for (let key in hardcodedEmails) {
                if (disabled.has(key)) continue;
                if (!models[key]) {
                    models[key] = { ...hardcodedEmails[key], isDefault: true };
                } else {
                    models[key].isDefault = true;
                    if (!models[key].subject) models[key].subject = hardcodedEmails[key].subject;
                    if (!models[key].body) models[key].body = hardcodedEmails[key].body;
                    if (!models[key].name) models[key].name = hardcodedEmails[key].name;
                }
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
        }
    }

    function getModelsData() {
        try {
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
        } catch (e) {
            console.error("Erreur de lecture des modèles:", e);
            return {};
        }
    }

    function setModelsData(models) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
    }

    // ===== Fonctions Métier (Logique du module) =====
    function saveModel() {
        const modelName = document.getElementById('manual-name').value.trim();
        const subject = document.getElementById('manual-subject').value.trim();
        const body = document.getElementById('manual-body').value.trim();

        if (!modelName || !subject || !body) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const models = getModelsData();
        const existingId = document.getElementById('manual-name').dataset.modelId;
        const modelId = existingId || `MANUAL_${Date.now()}`;
        
        models[modelId] = { name: modelName, subject: subject, body: body, isDefault: false };
        setModelsData(models);

        alert(`Modèle "${modelName}" sauvegardé !`);
        editingModelId = null;
        populateActionCodes();
        document.getElementById('code-action').value = modelId;
        onModelChange();
    }

    function deleteModel() {
        const select = document.getElementById('code-action');
        const codeAction = select.value;
        if (!codeAction || codeAction === "MANUAL") return;

        const models = getModelsData();
        const model = models[codeAction];
        if (!model) return;

        if (model.isDefault) {
            if (!confirm("Ce modèle par défaut sera masqué. Continuer ?")) return;
            const disabled = new Set(getDisabledDefaults());
            disabled.add(codeAction);
            setDisabledDefaults(Array.from(disabled));
        } else {
            if (!confirm("Supprimer ce modèle personnalisé ?")) return;
            delete models[codeAction];
        }

        setModelsData(models);
        populateActionCodes();
        select.value = "";
        onModelChange();
    }

    function modifyModel() {
        const codeAction = document.getElementById('code-action').value;
        const models = getModelsData();
        const mailData = models[codeAction];
        if (mailData) {
            document.getElementById('manual-name').value = mailData.name;
            document.getElementById('manual-subject').value = mailData.subject;
            document.getElementById('manual-body').value = mailData.body;
            document.getElementById('manual-name').dataset.modelId = codeAction;
            editingModelId = codeAction;
            toggleManualFields(true);
            updateManualEmail();
        }
    }

    function copyEmail() {
        const emailContent = document.getElementById('email-content');
        emailContent.select();
        document.execCommand('copy');
        alert('Mail copié dans le presse-papiers.');
    }

    // ===== Fonctions de Mise à Jour de l'Interface (UI) =====
    function populateActionCodes() {
        const select = document.getElementById('code-action');
        const currentSelected = select.value;
        select.innerHTML = '';

        // Options par défaut
        select.add(new Option("-- Choisir un modèle --", ""));
        select.add(new Option("⭐️ Créer un nouveau modèle", "MANUAL"));

        const models = getModelsData();
        const sortedKeys = Object.keys(models).sort((a, b) => {
            const isAManual = a.startsWith('MANUAL_');
            const isBManual = b.startsWith('MANUAL_');
            if (isAManual && !isBManual) return -1;
            if (!isAManual && isBManual) return 1;
            return models[a].name.localeCompare(models[b].name);
        });

        sortedKeys.forEach(key => {
            const model = models[key];
            if (model) {
                const prefix = model.isDefault ? '' : '❤️ ';
                select.add(new Option(prefix + model.name, key));
            }
        });

        select.value = currentSelected;
    }

    function toggleManualFields(forceShow = false) {
        const codeAction = document.getElementById('code-action').value;
        const manualFields = document.getElementById('manual-fields');
        
        if (codeAction === "MANUAL" || forceShow) {
            manualFields.style.display = 'block';
            if (!forceShow) { // Reset fields only on new creation
                document.getElementById('manual-name').value = "";
                document.getElementById('manual-subject').value = "";
                document.getElementById('manual-body').value = "";
                delete document.getElementById('manual-name').dataset.modelId;
            }
        } else {
            manualFields.style.display = 'none';
        }
    }

    function onModelChange() {
        toggleManualFields(false);
        generateEmail();
        updateButtonsState();
        updateBadge();
    }

    function updateButtonsState() {
        const val = document.getElementById('code-action').value;
        const isModelSelected = val && val !== "MANUAL";
        document.querySelectorAll('#btn-top-modify, #btn-top-delete, #modify-button, #delete-button').forEach(btn => {
            btn.disabled = !isModelSelected;
        });
    }

    function updateBadge() {
        const badge = document.getElementById('badge-info');
        const val = document.getElementById('code-action').value;
        const models = getModelsData();
        if (!val || val === "MANUAL" || !models[val]) {
            badge.textContent = "—";
            return;
        }
        badge.textContent = models[val].isDefault ? "Modèle par défaut" : "Modèle personnel";
    }

    function generateEmail() {
        const codeAction = document.getElementById('code-action').value;
        let adherentName = document.getElementById('adherent-name').value.trim() || "[Nom de l'adhérent]";
        const emailContent = document.getElementById('email-content');
        
        const models = getModelsData();
        const mailData = models[codeAction];

        if (mailData) {
            const subject = "Objet : " + mailData.subject + "\n\n";
            const bodyContent = (mailData.body || "").replace(/\[Nom de l'adhérent\]/g, adherentName);
            emailContent.value = subject + bodyContent;
        } else {
            emailContent.value = "";
        }
    }

    function updateManualEmail() {
        let adherentName = document.getElementById('adherent-name').value.trim() || "[Nom de l'adhérent]";
        const subjectText = document.getElementById('manual-subject').value || "";
        const bodyText = document.getElementById('manual-body').value || "";
        
        const subject = subjectText ? "Objet : " + subjectText + "\n\n" : "";
        const body = bodyText.replace(/\[Nom de l'adhérent\]/g, adherentName);
        document.getElementById('email-content').value = subject + body;
    }


    // ===== Initialisation et Attache des Événements =====
    setTimeout(() => {
        // Inputs et Select
        document.getElementById('adherent-name').addEventListener('input', generateEmail);
        document.getElementById('manual-subject').addEventListener('input', updateManualEmail);
        document.getElementById('manual-body').addEventListener('input', updateManualEmail);
        document.getElementById('code-action').addEventListener('change', onModelChange);
        
        // Boutons
        document.getElementById('btn-top-modify').addEventListener('click', modifyModel);
        document.getElementById('btn-top-delete').addEventListener('click', deleteModel);
        document.getElementById('save-button').addEventListener('click', saveModel);
        document.getElementById('delete-button').addEventListener('click', deleteModel);
        document.getElementById('modify-button').addEventListener('click', modifyModel);
        document.getElementById('copy-button').addEventListener('click', copyEmail);

        // Lancement de la séquence d'initialisation du module
        initializeData();
        populateActionCodes();
        onModelChange(); // Utiliser onModelChange pour initialiser correctement l'état de l'UI
    }, 50); // Léger délai augmenté pour plus de sûreté

} // FIN DE LA FONCTION initMailPanel
