function initMailPanel() {
    // ===== Données & constantes =====
    const hardcodedEmails = {
        "RESILIATION_OR_NA": { name: "Résiliation", subject: "Harmonie Mutuelle - Nous regrettons votre départ", body: `Madame, Monsieur [Nom de l'adhérent],\n\nNous accusons bonne réception de votre demande de résiliation. Nous souhaiterions vivement vous remercier pour la confiance que vous nous avez accordée durant ces dernières années.\n\nVotre décision nous a amenés à réfléchir aux différentes solutions qui s'offrent à vous et nous avons, à ce titre, de nouvelles solutions adaptées à votre situation.\n\nAussi, nous serions ravis de discuter avec vous de votre décision et de vous informer de nos solutions en prévoyance.\n\nPour en savoir plus, cliquez ici : [Lien vers un quiz ou une page d'information]\n\nNous restons à votre disposition,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SUITE_RESIL_DDE_CONTACT_OR_NA": { name: "Suite résil. (dem. contact)", subject: "Harmonie Mutuelle - Suite à notre échange téléphonique", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJe vous contacte suite à ma tentative d'appel concernant votre demande de résiliation.\n\nJe reste à votre entière disposition pour en discuter et vous accompagner dans vos réflexions.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "RADIES_JEUNES_AYANT_DROIT_NA": { name: "Jeune ayant-droit", subject: "Votre protection santé Harmonie Mutuelle", body: `Bonjour,\n\nNous vous informons que votre rattachement au contrat de vos parents est arrivé à son terme le [date]. Votre carte mutualiste n'est donc plus valide.\n\nNous serions ravis de vous accompagner dans cette nouvelle étape de votre vie en vous proposant une protection santé qui vous est propre et qui correspond à vos besoins.\n\nVous pouvez obtenir un devis en cliquant ici : [Lien vers un devis en ligne]\n\nN'hésitez pas à nous contacter si vous avez des questions,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "RADIES_JEUNE_DDE_CONTACT_OR_NA": { name: "Jeune ayant-droit (dem. contact)", subject: "Harmonie Mutuelle - Proposition pour votre couverture santé", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJ'ai cherché à vous joindre au sujet de votre couverture santé. Comme mentionné dans notre précédent contact, votre rattachement à la couverture de vos parents arrive à échéance.\n\nAfin de vous assurer une continuité de protection, nous avons préparé une proposition de devis qui pourrait vous intéresser.\n\nJe reste à votre disposition pour en discuter et répondre à toutes vos questions.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "FIN_CONTRAT_CSS_OR_NA": { name: "Fin de contrat CSS", subject: "Votre Complémentaire Santé Solidaire arrive à échéance", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat Complémentaire Santé Solidaire (CSS) prendra fin le [date].\n\nAfin de ne pas subir de rupture dans votre protection santé, nous vous invitons à déposer dès à présent une nouvelle demande de CSS auprès de la Sécurité sociale.\n\nSi vous n'êtes plus éligible, nous disposons de solutions santé adaptées à votre situation.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour faire le point sur votre protection.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "FIN_CSS_DDE_CONTACT_OR_NA": { name: "Fin de contrat CSS (dem. contact)", subject: "Harmonie Mutuelle - Nous souhaitons faire le point avec vous", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJe vous contacte concernant la fin de votre contrat de Complémentaire Santé Solidaire.\n\nNotre objectif est de nous assurer que yous conservez une couverture santé adaptée et de vous accompagner dans vos démarches.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,` + `\n\nVotre équipe Harmonie Mutuelle` },
        "FIN_MIROIR_CSS_OR_NA": { name: "Fin de produit miroir CSS", subject: "Votre produit miroir CSS arrive à échéance", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat « miroir CSS » prendra fin le [date].\n\nPour éviter toute rupture de vos garanties, nous vous invitons à faire une demande de Complémentaire Santé Solidaire (CSS). Si vous n'êtes plus éligible, nous pouvons vous proposer d'autres gammes santé standard.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour faire le point sur votre protection.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "FIN_MIR_CSS_DDE_CONTACT_OR_NA": { name: "Fin de produit miroir CSS (dem. contact)", subject: "Harmonie Mutuelle - Nous souhaitons vous accompagner", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJ'ai tenté de vous joindre afin de faire le point sur l'échéance de votre contrat « miroir CSS ».\n\nAfin d'assurer une continuité de votre couverture, nous aimerions vous accompagner dans vos démarches.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOLL_OR_NA": { name: "Sortant de collectif", subject: "Votre contrat collectif arrive à son terme, nos solutions sont là pour vous", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat collectif prendra fin prochainement.\n\nCependant, vous avez la possibilité de continuer à bénéficier d'une protection santé adaptée grâce au **contrat Evin** (pour les adhérents éligibles) ou à un **contrat individuel**.\n\nPour échanger sur ce sujet et faire un bilan de votre protection, n'hésitez pas à nous contacter au [numéro de téléphone].\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOL_EVIN_AUTRE_NA": { name: "Sortant coll. -60 ans (Evin)", subject: "Harmonie Mutuelle - Vos droits Evin", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat collectif prendra fin le [date].\n\nNous tenons à vous informer que vous avez la possibilité de souscrire un contrat Evin, qui vous permettra de conserver une protection santé complète.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour toute question.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOL_EVIN_SENIOR_NA": { name: "Sortant coll. 60+ (Evin)", subject: "Harmonie Mutuelle - Vos droits Evin", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat collectif prendra fin le [date].\n\nNous tenons à vous informer que vous avez la possibilité de souscrire un contrat Evin, qui vous permettra de conserver une protection santé complète.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour toute question.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOL_AUTRE_NA": { name: "Sortant coll. (sans Evin)", subject: "Harmonie Mutuelle - Votre fin de contrat collectif", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat collectif prendra fin le [date].\n\nÉtant donné votre situation, nous avons une solution adaptée pour vous, à savoir un contrat individuel.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour toute question.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTANT_COLL_DDE_CONTACT_OR_NA": { name: "Sortant coll. (dem. contact)", subject: "Harmonie Mutuelle - Proposition pour votre couverture santé", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJe vous contacte concernant la fin de votre contrat collectif.\n\nAfin d'assurer une continuité de votre couverture, nous avons préparé une proposition de devis qui pourrait vous intéresser.\n\nJe reste à votre disposition pour en discuter et répondre à toutes vos questions.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "PORTA_FIN_NA": { name: "Fin de portabilité", subject: "Harmonie Mutuelle - Votre fin de portabilité", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat en portabilité arrive à échéance le [date].\n\nNous souhaitons vous accompagner pour que vous conserviez une protection santé optimale.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour discuter des options qui s'offrent à vous, notamment la souscription à un contrat Evin.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "PORTA_FIN_RETRAITE_NA": { name: "Fin de portabilité (retraite)", subject: "Harmonie Mutuelle - Votre fin de portabilité (retraite)", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat en portabilité arrive à échéance le [date].\n\nNous souhaitons vous accompagner pour que vous conserviez une protection santé optimale.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour discuter des options qui s'offrent à vous, notamment la souscription à un contrat Evin.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOL_SUSPENSION_NA": { name: "Contrat suspendu", subject: "Harmonie Mutuelle - Information importante sur votre couverture", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat de complémentaire santé collectif est temporairement suspendu pour cause de congés [sabbatique/parental].\n\nVous avez la possibilité de souscrire une offre à titre individuel le temps de votre congé afin de maintenir votre protection.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour en discuter.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "SORTCOLL_SAVENCIA_OR_NA": { name: "Contrat suspendu Savencia", subject: "Harmonie Mutuelle - Information importante sur votre couverture", body: `Madame, Monsieur [Nom de l'adhérent],\n\nVotre contrat de complémentaire santé collectif est temporairement suspendu pour cause de congés [sabbatique/parental].\n\nVous avez la possibilité de souscrire une offre à titre individuel le temps de votre congé afin de maintenir votre protection.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour en discuter.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "RESILIATION_ADH_COLL_NA": { name: "Résiliation contrat employeur", subject: "Harmonie Mutuelle - Votre fin de contrat collectif", body: `Madame, Monsieur [Nom de l'adhérent],\n\nNous vous confirmons la résiliation de votre contrat de complémentaire santé collectif suite à la fin de votre relation avec votre employeur. Votre carte mutualiste n'est donc plus valide.\n\nNous restons à votre disposition pour vous accompagner et vous orienter vers une solution individuelle adaptée.\n\nN'hésitez pas à nous contacter au [numéro de téléphone] pour en discuter.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
        "ENQ_CHAUD_INSATISFAITS_OR_NA": { name: "Enquête à chaud insatisfaits", subject: "Harmonie Mutuelle - Suite à votre questionnaire de satisfaction", body: `Madame, Monsieur [Nom de l'adhérent],\n\nJ'ai pris connaissance de votre retour sur le questionnaire de satisfaction que nous vous avons envoyé. Je suis désolé d'apprendre que votre expérience n'a pas été à la hauteur de vos attentes.\n\nJe souhaite échanger avec vous pour mieux comprendre les raisons de votre mécontentement.\n\nN'hésitez pas à me rappeler au [numéro de téléphone] ou à me proposer un créneau pour que je vous recontacte.\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` }
    };
    const LOCAL_STORAGE_KEY = 'emailModelsData';
    const DISABLED_DEFAULTS_KEY = 'emailModelsDisabledDefaults';

    let editingModelId = null;

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

    window.saveModel = function() {
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

    // ===== Init (CORRIGÉ AVEC setTimeout) =====
    setTimeout(() => {
        // Les fonctions appelées par les "onclick" dans le HTML doivent être globales.
        // On les attache à l'objet "window" pour qu'elles soient accessibles.
        // Les fonctions déjà attachées (comme saveModel) n'ont pas besoin d'être redéfinies ici.
        
        // Attacher les écouteurs d'événements qui ne sont pas des "onclick"
        document.getElementById('adherent-name').addEventListener('input', window.generateEmail);
        document.getElementById('manual-subject').addEventListener('input', updateManualEmail);
        document.getElementById('manual-body').addEventListener('input', updateManualEmail);

        // Lancer la séquence d'initialisation du module
        initializeData();
        populateActionCodes();
        generateEmail();
    }, 0);

} // FIN DE LA FONCTION initMailPanel
