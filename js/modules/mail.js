function initMailPanel() {

    // ===== Données & Constantes =====
    const hardcodedEmails = {
        "RESILIATION_OR_NA": { name: "RESILIATION_OR_NA Résiliation", subject: "Harmonie Mutuelle - Nous regrettons votre départ", body: `Madame, Monsieur [Nom de l'adhérent],\n\nNous accusons bonne réception de votre demande de résiliation. Nous souhaiterions vivement vous remercier pour la confiance que vous nous avez accordée durant ces dernières années.\n\nVotre décision nous a amenés à réfléchir aux différentes solutions qui s'offrent à vous et nous avons, à ce titre, de nouvelles solutions adaptées à votre situation.\n\nAussi, nous serions ravis de discuter avec vous de votre décision et de vous informer de nos solutions en prévoyance.\n\nPour en savoir plus, cliquez ici : [Lien vers un quiz ou une page d'information]\n\nNous restons à votre disposition,\n\nCordialement,\n\nVotre équipe Harmonie Mutuelle` },
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
        if (!storedData) {
            let initialData = {};
            for (let key in hardcodedEmails) {
                initialData[key] = { ...hardcodedEmails[key], isDefault: true };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
        } else {
            let models = JSON.parse(storedData);
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

        select.add(new Option("-- Choisir un modèle --", ""));
        select.add(new Option("⭐️ Créer un nouveau modèle", "MANUAL"));

        const models = getModelsData();
        const disabled = getDisabledDefaults();
        const sortedKeys = Object.keys(models).filter(key => !disabled.includes(key)).sort((a, b) => {
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
            if (!forceShow) {
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
            if (btn) btn.disabled = !isModelSelected;
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
        try {
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
            onModelChange();
        } catch(e) {
            console.error("Erreur lors de l'initialisation du module Mail:", e);
            // Optionally, display an error message in the UI
            const appContent = document.querySelector('.mail-module-container');
            if (appContent) {
                appContent.innerHTML = `<div class="card"><h3 class="danger-text">Erreur</h3><p>Le module n'a pas pu s'initialiser correctement. Vérifiez la console pour plus de détails.</p></div>`;
            }
        }
    }, 50);

} // FIN DE LA FONCTION initMailPanel
