function initMailPanel() {
    // ===== Données & constantes =====
    const hardcodedEmails = {
        "RESILIATION_OR_NA": { name: "Résiliation", subject: "Harmonie Mutuelle - Nous regrettons votre départ", body: `Madame, Monsieur [Nom de l'adhérent],\n\nNous accusons bonne réception de votre demande de résiliation. Nous souhaiterions vivement vous remercier pour la confiance que vous nous avez accordée durant ces dernières années.\n\nVotre décision nous a amenés à réfléchir aux différentes solutions qui s'offrent à vous et nous avons, à ce titre, de nouvelles solutions adaptées à votre situation.\n\nAussi, nous serions ravis de discuter avec vous de votre décision et de vous informer de nos solutions en prévoyance.\n\nPour en savoir plus, cliquez ici : [Lien vers un quiz ou une page d'information]\n\nNous restons à votre disposition,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SUITE_RESIL_DDE_CONTACT_OR_NA": { name: "Suite résil. (dem. contact)", subject: "Harmonie Mutuelle - Suite à notre échange téléphonique", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJe vous contacte suite à ma tentative d'appel concernant votre demande de résiliation.\n\nJe reste à votre entière disposition pour en discuter et vous accompagner dans vos réflexions.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "RADIES_JEUNES_AYANT_DROIT_NA": { name: "Jeune ayant-droit", subject: "Votre protection santé Harmonie Mutuelle", body: `Bonjour,\n\nNous vous informons que votre rattachement au contrat de vos parents est arrivé à son terme le [date]. Votre carte mutualiste n'est donc plus valide.\n\nNous serions ravis de vous accompagner dans cette nouvelle étape de votre vie en vous proposant une protection santé qui vous est propre et qui correspond à vos besoins.\n\nVous pouvez obtenir un devis en cliquant ici : [Lien vers un devis en ligne]\n\nN'hésitez pas à nous contacter si vous avez des questions,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "RADIES_JEUNE_DDE_CONTACT_OR_NA": { name: "Jeune ayant-droit (dem. contact)", subject: "Harmonie Mutuelle - Proposition pour votre couverture santé", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJ'ai cherché à vous joindre au sujet de votre couverture santé. Comme mentionné dans notre précédent contact, votre rattachement à la couverture de vos parents arrive à échéance.\n\nAfin de vous assurer une continuité de protection, nous avons préparé une proposition de devis qui pourrait vous intéresser.\n\nJe reste à votre disposition pour en discuter et répondre à toutes vos questions.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        // ... (tous les autres modèles hardcodedEmails sont ici)
    };
    const LOCAL_STORAGE_KEY = 'emailModelsData';
    const DISABLED_DEFAULTS_KEY = 'emailModelsDisabledDefaults';

    let editingModelId = null;

    // ===== Helpers LocalStorage =====
    function getDisabledDefaults() {
        try { return JSON.parse(localStorage.getItem(DISABLED_DEFAULTS_KEY)) || []; }
        catch(e){ return []; }
    }
    function setDisabledDefaults(list){
        localStorage.setItem(DISABLED_DEFAULTS_KEY, JSON.stringify(list));
    }

    function initializeData() {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let models = {};
        if (!storedData) {
            const initialData = {};
            for (const key in hardcodedEmails) {
                initialData[key] = { ...hardcodedEmails[key], isDefault: true };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
            models = initialData;
        } else {
            models = JSON.parse(storedData);
            const disabled = new Set(getDisabledDefaults());
            for (const key in hardcodedEmails) {
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
            console.error("Erreur lors de la récupération des modèles sauvegardés:", e);
            return {};
        }
    }

    function setModelsData(models){
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(models));
    }

    // ===== CRUD Modèles =====
    window.saveModel = function() { // Attach to window to be accessible from HTML onclick
        const modelName = document.getElementById('manual-name').value.trim();
        const subject = document.getElementById('manual-subject').value.trim();
        const body = document.getElementById('manual-body').value.trim();

        if (!modelName || !subject || !body) {
            alert("Veuillez remplir tous les champs : Nom du modèle, Objet et Corps du mail.");
            return;
        }

        const models = getModelsData();
        const manualInput = document.getElementById('manual-name');
        const existingId = manualInput.dataset.modelId;
        const modelId = existingId || `MANUAL_${Date.now()}`;
        
        models[modelId] = {
            name: modelName,
            subject: subject,
            body: body,
            isDefault: Boolean(models[modelId]?.isDefault) && existingId ? true : false
        };

        setModelsData(models);
        alert(`Le modèle "${modelName}" a été sauvegardé avec succès !`);

        editingModelId = null;
        populateActionCodes();
        document.getElementById('code-action').value = modelId;
        toggleManualFields(false);
        generateEmail();
        updateButtonsState();
    }

    window.deleteModel = function() {
        const select = document.getElementById('code-action');
        const codeAction = select.value;
        if (!codeAction) return;

        const models = getModelsData();
        const model = models[codeAction];
        if (!model) return;

        if (model.isDefault) {
            if (!confirm("Ce modèle est un modèle par défaut. Voulez-vous le masquer de votre liste ?")) {
                return;
            }
            const disabled = new Set(getDisabledDefaults());
            disabled.add(codeAction);
            setDisabledDefaults(Array.from(disabled));
        } else {
            if (!confirm("Êtes-vous sûr de vouloir supprimer ce modèle de mail ?")) return;
            delete models[codeAction];
        }
        setModelsData(models);
        populateActionCodes();
        select.value = "";
        toggleManualFields(false);
        generateEmail();
        updateButtonsState();
    }

    window.modifyModel = function() {
        const codeAction = document.getElementById('code-action').value;
        const models = getModelsData();
        const mailData = models[codeAction];
        if (mailData) {
            document.getElementById('manual-name').value = mailData.name || codeAction;
            document.getElementById('manual-subject').value = mailData.subject || "";
            document.getElementById('manual-body').value = mailData.body || "";
            document.getElementById('manual-name').dataset.modelId = codeAction;
            editingModelId = codeAction;
            toggleManualFields(true);
            updateManualEmail();
        }
    }

    // ===== UI =====
    function populateActionCodes() {
        const select = document.getElementById('code-action');
        const currentSelected = select.value;
        select.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Choisir un modèle --";
        select.appendChild(defaultOption);

        const manualOption = document.createElement('option');
        manualOption.value = "MANUAL";
        manualOption.textContent = "⭐️ Créer un nouveau modèle";
        select.appendChild(manualOption);
        
        const models = getModelsData();
        const sortedKeys = Object.keys(models).sort((a,b)=>{
            const isAman = a.startsWith('MANUAL_') ? 1 : 0;
            const isBman = b.startsWith('MANUAL_') ? 1 : 0;
            if (isAman !== isBman) return isBman - isAman;
            return a.localeCompare(b);
        });

        sortedKeys.forEach(key => {
            const model = models[key];
            if (model) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key.startsWith('MANUAL_') ? `❤️ ${model.name}` : `${model.name}`;
                select.appendChild(option);
            }
        });

        if (currentSelected) {
            select.value = currentSelected;
        }
        updateButtonsState();
        updateBadge();
    }

    function toggleManualFields(forceShow = false) {
        const codeAction = document.getElementById('code-action').value;
        const manualFields = document.getElementById('manual-fields');
        const dynamicButtons = document.getElementById('dynamic-buttons');
        
        if (codeAction === "MANUAL" || forceShow) {
            manualFields.style.display = 'block';
            dynamicButtons.style.display = 'none';
            document.getElementById('email-content').readOnly = false;
            if (!forceShow) {
                document.getElementById('manual-name').value = "";
                document.getElementById('manual-subject').value = "";
                document.getElementById('manual-body').value = "";
                delete document.getElementById('manual-name').dataset.modelId;
            }
        } else {
            manualFields.style.display = 'none';
            dynamicButtons.style.display = (codeAction !== "" ? 'flex' : 'none');
            document.getElementById('email-content').readOnly = true;
        }
    }

    window.onModelChange = function(){
        toggleManualFields(false);
        generateEmail();
        updateButtonsState();
        updateBadge();
    }

    function updateButtonsState(){
        const val = document.getElementById('code-action').value;
        const models = getModelsData();
        const isSelectable = val && val !== "MANUAL" && !!models[val];
        const btns = [
            document.getElementById('btn-top-modify'),
            document.getElementById('btn-top-delete'),
            document.getElementById('modify-button'),
            document.getElementById('delete-button'),
        ];
        btns.forEach(b => { if (b) b.disabled = !isSelectable; });
    }

    function updateBadge(){
        const badge = document.getElementById('badge-info');
        const val = document.getElementById('code-action').value;
        const models = getModelsData();
        if (!val || val === "MANUAL" || !models[val]){
            badge.textContent = "—";
            return;
        }
        const m = models[val];
        badge.textContent = m.isDefault ? "Modèle par défaut" : "Modèle personnel";
    }

    window.generateEmail = function() {
        const codeAction = document.getElementById('code-action').value;
        let adherentName = document.getElementById('adherent-name').value;
        const emailContent = document.getElementById('email-content');
        
        const models = getModelsData();
        const mailData = models[codeAction];

        if (adherentName.trim() === "") {
            adherentName = "[Nom de l'adhérent]";
        }

        if (mailData) {
            const subject = "Objet : " + mailData.subject + "\n\n";
            const bodyContent = (mailData.body || "").replace(/\[Nom de l'adhérent\]/g, adherentName);
            emailContent.value = subject + bodyContent;
        } else {
            emailContent.value = "";
        }
    }

    function updateManualEmail() {
        const manualSubject = document.getElementById('manual-subject').value || "";
        const manualBody = document.getElementById('manual-body').value || "";
        const emailContent = document.getElementById('email-content');
        const adherentName = document.getElementById('adherent-name').value || "[Nom de l'adhérent]";

        const subject = manualSubject ? ("Objet : " + manualSubject + "\n\n") : "";
        const body = manualBody.replace(/\[Nom de l'adhérent\]/g, adherentName);
        emailContent.value = subject + body;
    }

    window.copyEmail = function() {
        const emailContent = document.getElementById('email-content');
        emailContent.select();
        document.execCommand('copy');
        alert('Le contenu du mail a été copié dans le presse-papiers.');
    }

    // ===== Init =====
    document.getElementById('adherent-name').addEventListener('input', window.generateEmail);
    document.getElementById('manual-subject').addEventListener('input', updateManualEmail);
    document.getElementById('manual-body').addEventListener('input', updateManualEmail);

    initializeData();
    populateActionCodes();
    generateEmail();

} // FIN DE LA FONCTION initMailPanel
