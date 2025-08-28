// Début du code pour js/modules/courrier.js

function initCourrierPanel() {
  
  /* ===== Modèles intégrés (liste réduite validée) ===== */
  const BUILTIN_TEMPLATES = [
    { id:"resiliation_etranger", label:"Résiliation – Départ à l’étranger (complémentaire santé)", tags:["santé","résiliation"], description:"Résiliation pour départ durable à l’étranger.", subject:"Demande de résiliation – Départ à l’étranger – Contrat n° {{Contrat_Numero}}", body:`Madame, Monsieur,\n\nJe vous informe de mon départ à l’étranger à compter du {{Date_Depart}} (pays : {{Pays}}), situation entraînant un changement durable de ma situation.\nJe vous demande en conséquence la résiliation de mon contrat de complémentaire santé n° {{Contrat_Numero}}, au plus tôt à compter de la réception de ce courrier.\n\nJe joins un justificatif (billet / attestation d’installation) et vous remercie de me confirmer par écrit la date de résiliation et l’arrêt des prélèvements.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"resiliation_echeance", label:"Résiliation à l’échéance (complémentaire santé)", tags:["santé","résiliation","échéance"], description:"Non-reconduction à la date anniversaire.", subject:"Résiliation à l’échéance – Contrat n° {{Contrat_Numero}} – Échéance du {{Date_Echeance}}", body:`Madame, Monsieur,\n\nJe vous informe de ma volonté de ne pas reconduire mon contrat de complémentaire santé n° {{Contrat_Numero}} à son échéance du {{Date_Echeance}}.\nMerci de m’adresser un écrit confirmant la date de résiliation et l’arrêt des prélèvements à compter de cette échéance.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"renonciation_gav", label:"Renonciation – Garantie Accidents de la Vie (GAV)", tags:["GAV","renonciation"], description:"Droit de renonciation dans le délai légal après souscription.", subject:"Renonciation au contrat GAV n° {{Contrat_Numero}} (souscrit le {{Date_Souscription}})", body:`Madame, Monsieur,\n\nJ’exerce mon droit de renonciation au contrat Garantie Accidents de la Vie n° {{Contrat_Numero}}, souscrit le {{Date_Souscription}}.\nMerci d’annuler le contrat et, le cas échéant, de rembourser les sommes perçues. Je vous remercie de m’adresser une confirmation écrite.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"resiliation_collectif_obligatoire", label:"Résiliation – Contrat collectif d’entreprise obligatoire", tags:["santé","résiliation","collectif"], description:"Résiliation d’un contrat individuel après adhésion à une mutuelle d’entreprise obligatoire.", subject:"Résiliation pour adhésion à une mutuelle d’entreprise – Contrat n° {{Contrat_Numero}}", body:`Madame, Monsieur,\n\nJe vous informe de mon adhésion au contrat collectif obligatoire de mon employeur {{Employeur}} à compter du {{Date_Adhesion_Collectif}}.\nJe vous demande en conséquence la résiliation de mon contrat santé individuel n° {{Contrat_Numero}}, à effet du {{Date_Effet_Resiliation}} ou, à défaut, à la date de réception du présent courrier.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"rachat_partiel_assurance_vie", label:"Demande de rachat partiel – Assurance vie", tags:["assurance vie","rachat"], description:"Rachat partiel avec versement et option fiscale.", subject:"Demande de rachat partiel – Contrat n° {{Contrat_Numero}} – {{Montant}} €", body:`Madame, Monsieur,\n\nJe vous prie d’effectuer un rachat partiel de {{Montant}} € (en lettres : {{Montant_En_Lettres}}) sur mon contrat n° {{Contrat_Numero}}.\nJe souhaite un versement par virement sur l’IBAN : {{IBAN}} (titulaire : {{Titulaire_Compte}}). Option fiscale souhaitée : {{Option_Fiscale}}.\nMerci de me transmettre un décompte préalable et la confirmation d’exécution.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"versement_libre_exceptionnel", label:"Versement libre (AV ou PER) + instruction d’arbitrage", tags:["versement","épargne"], description:"Virement accompagné d’une répartition des supports.", subject:"Versement libre de {{Montant}} € sur contrat n° {{Contrat_Numero}}", body:`Madame, Monsieur,\n\nJe vous informe avoir procédé à un versement de {{Montant}} € en date du {{Date_Versement}} sur le contrat n° {{Contrat_Numero}} (référence : {{Reference_Virement}}).\nArbitrage souhaité : {{Arbitrage_Souhaite}}. Merci de me transmettre la confirmation d’opération.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"changement_rib_sepa", label:"Changement de RIB / mandat SEPA", tags:["SEPA","administratif"], description:"Mise à jour des coordonnées bancaires et du mandat.", subject:"Mise à jour RIB et mandat SEPA – Contrat n° {{Contrat_Numero}}", body:`Madame, Monsieur,\n\nMerci de mettre à jour mes coordonnées bancaires pour les prélèvements du contrat n° {{Contrat_Numero}} à compter du {{Date_Effet}}.\nNouveau RIB (IBAN) : {{IBAN}} – Titulaire : {{Titulaire_Compte}}. Merci d’établir le mandat SEPA correspondant.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"supp_ayant_droit_sante", label:"Suppression d’ayant droit – Contrat santé", tags:["santé","ayant droit"], description:"Retrait d’un ayant droit du contrat.", subject:"Suppression d’ayant droit – Contrat n° {{Contrat_Numero}} – {{Nom_Ayant_Droit}}", body:`Madame, Monsieur,\n\nJe vous demande la suppression de l’ayant droit suivant sur mon contrat n° {{Contrat_Numero}} : {{Nom_Ayant_Droit}} (né(e) le {{Date_Naissance}} – lien : {{Lien_Parente}}).\nÉvénement déclencheur : {{Evenement}} (date : {{Date_Evenement}}). Je joins les justificatifs utiles.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"renonciation_per", label:"Renonciation – PER (délai légal de 30 jours)", tags:["PER","renonciation"], description:"Droit de renonciation dans les 30 jours après souscription.", subject:"Renonciation au PER n° {{PER_Numero}} (souscrit le {{Date_Souscription}})", body:`Madame, Monsieur,\n\nJ’exerce mon droit de renonciation au PER n° {{PER_Numero}}, souscrit le {{Date_Souscription}}.\nMerci d’annuler le contrat et de rembourser les sommes versées, le cas échéant, sur l’IBAN : {{IBAN}}. Merci de m’adresser une confirmation écrite.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"renonciation_neobsia", label:"Renonciation – NEOBSIA", tags:["obsèques","renonciation"], description:"Droit de renonciation suite à souscription NEOBSIA.", subject:"Renonciation – Contrat NEOBSIA n° {{Contrat_Numero}} (souscrit le {{Date_Souscription}})", body:`Madame, Monsieur,\n\nJ’exerce mon droit de renonciation au contrat NEOBSIA n° {{Contrat_Numero}}, souscrit le {{Date_Souscription}}.\nJe vous remercie d’annuler le contrat et de rembourser les sommes éventuellement perçues. Merci de me confirmer la prise en compte par écrit.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` },
    { id:"resiliation_gav", label:"Résiliation GAV", tags:["GAV","résiliation"], description:"Résiliation à l’échéance du contrat GAV.", subject:"Résiliation du contrat GAV n° {{Contrat_Numero}} – Échéance du {{Date_Echeance}}", body:`Madame, Monsieur,\n\nJe vous informe de ma volonté de résilier mon contrat GAV n° {{Contrat_Numero}} à son échéance du {{Date_Echeance}}.\nMerci de m’adresser une confirmation écrite mentionnant la date de fin du contrat et l’arrêt des prélèvements.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.` }
  ];

  /* ===== Stockage ===== */
  const STORAGE_DEFAULTS = 'courrier.defaults';
  const STORAGE_USER_TEMPLATES = 'courrier.userTemplates';
  const STORAGE_REMOVED_BUILTINS = 'courrier.removedBuiltins';
  const STORAGE_LAST_INSURER = 'courrier.lastInsurer';

  /* ===== Utils ===== */
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
  const slugify = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const frLongDate = (d=new Date()) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(d);
  function extractPlaceholders(text){ const set=new Set(); const re=/{{\s*([A-Za-z0-9_]+)\s*}}/g; let m; while((m=re.exec(text||''))){ set.add(m[1]); } return Array.from(set); }
  function uniquePlaceholders(tpl){ return Array.from(new Set([ ...extractPlaceholders(tpl.subject), ...extractPlaceholders(tpl.body) ])); }
  function substitute(str, vars){ return (str||'').replace(/{{\s*([A-Za-z0-9_]+)\s*}}/g,(_,k)=>(vars[k]??`{{${k}}}`)); }
  function dedupeById(arr){ const map=new Map(); (arr||[]).forEach(x=>{ if(x && x.id) map.set(x.id, x); }); return Array.from(map.values()); }

  /* ===== State ===== */
  let userTemplates = [];
  let removedBuiltins = [];
  let selectedTag = '__all__';
  let lastInsurer = '';

  /* ===== Defaults (coords) ===== */
  function saveDefaults(){
    const data = { expNom:qs('#expNom').value, expOrg:qs('#expOrg').value, expAdr:qs('#expAdr').value, expTel:qs('#expTel').value, expMail:qs('#expMail').value, ville:qs('#ville').value };
    localStorage.setItem(STORAGE_DEFAULTS, JSON.stringify(data));
  }
  function loadDefaults(){
    const raw = localStorage.getItem(STORAGE_DEFAULTS);
    if(!raw){
      qs('#expNom').value = "Damien Richard – Conseiller commercial";
      qs('#expOrg').value = "Harmonie Mutuelle";
      qs('#expAdr').value = "Agence de Nantes\n9 Rue Julien Videment\n44200 Nantes";
      qs('#expTel').value = "";
      qs('#expMail').value = "";
      qs('#ville').value = "Nantes";
      qs('#dateAuto').value = frLongDate();
      return;
    }
    try{ const d=JSON.parse(raw);
      qs('#expNom').value=d.expNom||""; qs('#expOrg').value=d.expOrg||""; qs('#expAdr').value=d.expAdr||"";
      qs('#expTel').value=d.expTel||""; qs('#expMail').value=d.expMail||""; qs('#ville').value=d.ville||""; qs('#dateAuto').value=frLongDate();
    }catch{}
  }

  /* ===== Templates ===== */
  function loadUserTemplates(){ try{ userTemplates = JSON.parse(localStorage.getItem(STORAGE_USER_TEMPLATES)) || []; }catch{ userTemplates=[]; } userTemplates = dedupeById(userTemplates); }
  function saveUserTemplates(){ localStorage.setItem(STORAGE_USER_TEMPLATES, JSON.stringify(userTemplates)); }
  function loadRemoved(){ try{ removedBuiltins = JSON.parse(localStorage.getItem(STORAGE_REMOVED_BUILTINS)) || []; }catch{ removedBuiltins=[]; } }
  function saveRemoved(){ localStorage.setItem(STORAGE_REMOVED_BUILTINS, JSON.stringify(removedBuiltins)); }

  function allTemplates(){
    const built = BUILTIN_TEMPLATES.filter(t => !removedBuiltins.includes(t.id)).map(t=>({...t,_isUser:false}));
    const usr = dedupeById(userTemplates).map(t=>({...t,_isUser:true}));
    return dedupeById([...built, ...usr]);
  }

  /* ===== Tag filter ===== */
  function getAllTags(){
    const tagset = new Set();
    allTemplates().forEach(t => (t.tags||[]).forEach(tag => tagset.add(tag)));
    return Array.from(tagset).sort((a,b)=>a.localeCompare(b,'fr',{sensitivity:'base'}));
  }
  function renderTagFilter(preserve=true){
    const sel = document.getElementById('tagFilter');
    const current = preserve ? selectedTag : '__all__';
    sel.innerHTML = '';
    const optAll = document.createElement('option'); optAll.value='__all__'; optAll.textContent='⭐ Tous les tags'; sel.appendChild(optAll);
    getAllTags().forEach(tag => { const o=document.createElement('option'); o.value=tag; o.textContent='⭐ '+tag; sel.appendChild(o); });
    sel.value = current || '__all__';
  }

  /* ===== UI ===== */
  function populateTemplates(preserve=true){
    const sel = qs('#templateSelect'); const current = sel.value; sel.innerHTML="";
    let list = allTemplates();
    if(selectedTag && selectedTag !== '__all__'){ list = list.filter(t => (t.tags||[]).includes(selectedTag)); }
    list.sort((a,b)=> a.label.localeCompare(b.label,'fr',{sensitivity:'base'}));
    const seen = new Set();
    list.forEach(t=>{
      if(!t || !t.id || seen.has(t.id)) return; seen.add(t.id);
      const o=document.createElement('option');
      o.value=t.id;
      const label = t.label?.replace(/^⭐\s*/, '') || t.id;
      o.textContent = '⭐ ' + label;
      sel.appendChild(o);
    });
    if(preserve && current){ sel.value=current; if(!sel.value) sel.selectedIndex=0; }
    if(!sel.value && sel.options.length>0){ sel.selectedIndex=0; }
    onTemplateChange();
    renderTagFilter(true);
  }

  function onTemplateChange(){
    const id = qs('#templateSelect').value;
    const tpl = allTemplates().find(t=>t.id===id); if(!tpl) return;
    qs('#templateInfo').textContent = tpl.description||"";
    const chips = qs('#chips'); chips.innerHTML="";
    (tpl.tags||[]).forEach(tag=>{ const s=document.createElement('span'); s.className='chip'; s.textContent=tag; chips.appendChild(s); });
    const ph = uniquePlaceholders(tpl); const dyn = qs('#dynamicFields'); dyn.innerHTML="";
    if(ph.length){ const h=document.createElement('h2'); h.textContent="Champs du modèle"; h.style.marginTop="18px"; dyn.appendChild(h); }
    ph.forEach(name=>{ const id='ph_'+name; const lab=document.createElement('label'); lab.htmlFor=id; lab.textContent=name.replaceAll('_',' ');
      const inp=document.createElement('input'); inp.id=id; inp.placeholder=name; dyn.appendChild(lab); dyn.appendChild(inp); });
    renderPreview();
  }

  function collectVars(){
    const v={ Date:qs('#dateAuto').value||frLongDate(), Ville:qs('#ville').value||"", Dest_Nom:qs('#destNom').value||"", Dest_Attention:qs('#destAttention').value||"", Dest_Adresse:qs('#destAdr').value||"", Exp_Nom:qs('#expNom').value||"", Exp_Org:qs('#expOrg').value||"", Exp_Adr:qs('#expAdr').value||"", Exp_Tel:qs('#expTel').value||"", Exp_Mail:qs('#expMail').value||"" };
    const id = qs('#templateSelect').value; const tpl = allTemplates().find(t=>t.id===id);
    if(tpl){ uniquePlaceholders(tpl).forEach(name=>{ v[name]=qs('#ph_'+name)?.value||""; }); }
    return v;
  }
  function renderPreview(){
    saveDefaults();
    const id = qs('#templateSelect').value; const tpl = allTemplates().find(t=>t.id===id); if(!tpl) return;
    const v = collectVars();
    const subject = substitute(tpl.subject, v);
    const body = substitute(tpl.body, v).split("\n").map(l=>`<p>${l||"&nbsp;"}</p>`).join("");
    const topRightAddr = (v.Dest_Nom||v.Dest_Attention||v.Dest_Adresse)?`
      <div class="block addr" style="white-space: pre-line; text-align:right;">
        <strong>${v.Dest_Nom||""}</strong>
        ${v.Dest_Attention?`\n${v.Dest_Attention}`:""}
        ${v.Dest_Adresse?`\n${v.Dest_Adresse}`:""}
      </div>`:"";
    qs('#sheet').innerHTML = `
      <div class="letterhead">
        <div style="white-space: pre-line;">
          <strong>${v.Exp_Nom||""}</strong>
          ${v.Exp_Org?`\n${v.Exp_Org}`:""}
          ${v.Exp_Adr?`\n${v.Exp_Adr}`:""}
          ${v.Exp_Tel?`\nTél. ${v.Exp_Tel}`:""}
          ${v.Exp_Mail?`\n${v.Exp_Mail}`:""}
        </div>
        <div style="text-align:right;">
          ${v.Ville?`Fait à ${v.Ville},`:""} le ${v.Date||frLongDate()}
        </div>
      </div>
      ${topRightAddr}
      <div class="subject">Objet : ${subject}</div>
      <div class="body block">${body}</div>
      <div class="footer">
        <div>Cordialement,</div>
        <div style="margin-top: 18px;"><strong>${v.Exp_Nom||""}</strong></div>
        ${v.Exp_Org?`<div>${v.Exp_Org}</div>`:""}
      </div>`;
  }

  /* ===== Copier & PDF ===== */
  async function copyText(){
    const sheet = qs('#sheet').cloneNode(true);
    const text = sheet.innerText.replace(/\n{3,}/g, "\n\n");
    try{ await navigator.clipboard.writeText(text); alert("Copié dans le presse-papiers ✅"); }
    catch{ alert("Impossible de copier automatiquement. Sélectionnez le texte puis Ctrl/Cmd+C."); }
  }
  async function downloadPDF(){
    const el = qs('#sheet'); if(!el){ alert("Aperçu introuvable."); return; }
    try{
      if(document.fonts && document.fonts.ready){ await document.fonts.ready; }
      const scale = Math.max(2, Math.min(3, (window.devicePixelRatio||2)));
      const canvas = await html2canvas(el, { scale, backgroundColor:'#ffffff', useCORS:true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const { jsPDF } = window.jspdf || {}; if(!jsPDF) throw new Error('jsPDF non chargé');
      const pdf = new jsPDF('p','mm','a4'); const pageW = pdf.internal.pageSize.getWidth(); const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageW, pageH); pdf.save('courrier.pdf');
    }catch(e){ console.error(e); alert("PDF indisponible : impression en secours."); window.print(); }
  }

  /* ===== Éditeur modèles perso ===== */
  let editorState = { mode:'new', id:null };
  function openEditor(mode='new', template=null){
    editorState.mode = mode;
    const isUser = template?._isUser === true;
    qs('#editorCard').style.display = 'block';
    qs('#mdl_name').value = template?.label || '';
    qs('#mdl_tags').value = (template?.tags||[]).join(', ');
    qs('#mdl_desc').value = template?.description || '';
    qs('#mdl_subject').value = template?.subject || '';
    qs('#mdl_body').value = template?.body || '';
    if(mode==='edit' && isUser){
      qs('#mdl_id').value = template.id; qs('#mdl_id').disabled = true; editorState.id = template.id; qs('#mdl_delete').style.display = '';
    } else {
      qs('#mdl_id').value = 'auto'; qs('#mdl_id').disabled = true; editorState.id = null; qs('#mdl_delete').style.display = 'none';
    }
    qs('#editorCard').scrollIntoView({behavior:'smooth', block:'start'});
  }
  function closeEditor(){ qs('#editorCard').style.display='none'; editorState={mode:'new',id:null}; }
  function collectEditor(){
    const name=qs('#mdl_name').value.trim(); const tags=qs('#mdl_tags').value.split(',').map(t=>t.trim()).filter(Boolean);
    const desc=qs('#mdl_desc').value.trim(); const subject=qs('#mdl_subject').value; const body=qs('#mdl_body').value;
    if(!name){ alert("Donnez un nom au modèle."); return null; }
    if(!subject){ alert("Renseignez un sujet."); return null; }
    if(!body){ alert("Renseignez un corps de texte."); return null; }
    return {name,tags,desc,subject,body};
  }
  function saveEditor(){
    const data = collectEditor(); if(!data) return;
    const tpl = { id: editorState.id || `usr_${slugify(data.name)}_${Date.now()}`, label:data.name, tags:data.tags, description:data.desc, subject:data.subject, body:data.body };
    if(editorState.mode==='edit' && editorState.id){
      const idx = userTemplates.findIndex(t=>t.id===editorState.id);
      if(idx>=0) userTemplates[idx]=tpl; else userTemplates.push(tpl);
    } else { userTemplates.push(tpl); }
    saveUserTemplates(); populateTemplates(); renderTagFilter(); qs('#templateSelect').value = tpl.id; onTemplateChange(); alert("Modèle enregistré ✅"); closeEditor();
  }
  function deleteEditor(){
    if(!editorState.id) return; if(!confirm("Supprimer ce modèle personnalisé ?")) return;
    userTemplates = userTemplates.filter(t=>t.id!==editorState.id);
    saveUserTemplates(); populateTemplates(false); renderTagFilter(); alert("Modèle supprimé."); closeEditor();
  }

  /* ===== Suppression définitive (hard delete) ===== */
  function removeCurrentTemplate(){
    const id = qs('#templateSelect').value;
    const tpl = allTemplates().find(t=>t.id===id);
    if(!tpl) return;
    if(!confirm(`Supprimer définitivement le modèle : "${tpl.label}" ?`)) return;

    if(tpl._isUser){
      userTemplates = userTemplates.filter(t=>t.id!==id);
      saveUserTemplates();
    } else {
      if(!removedBuiltins.includes(id)) removedBuiltins.push(id);
      saveRemoved();
    }
    populateTemplates(false); renderTagFilter(); alert("Modèle supprimé.");
  }

  /* ===== Assureurs (préremplissage) ===== */
  const INSURERS = [
    { id:'axa', name:'AXA France IARD', attention:'Service Résiliation', address:['313, Terrasses de l’Arche','92727 Nanterre Cedex'] },
    { id:'allianz', name:'Allianz', attention:'Service Résiliation', address:['1 cours Michelet – CS 30051','92076 Paris La Défense Cedex'] },
    { id:'generali_iard', name:'GENERALI', attention:'Service Résiliation', address:['GENERALI','75447 Paris Cedex 09'] },
    { id:'generali_vie', name:'GENERALI VIE', attention:'Service Résiliation', address:['TSA 60006','75446 Paris Cedex 09'] },
    { id:'groupama', name:'Groupama', attention:'Service Résiliation', address:['8–10, rue d’Astorg','75383 Paris Cedex 08'] },
    { id:'maif', name:'MAIF', attention:'Service Résiliation', address:['200, avenue Salvador Allende – CS 90000','79038 Niort Cedex 9'] },
    { id:'macif', name:'MACIF', attention:'Service Résiliation', address:['MACIF','79017 Niort Cedex 9'] },
    { id:'maaf', name:'MAAF', attention:'Service Résiliation', address:['Chauray','79036 Niort Cedex 09'] },
    { id:'gmf', name:'GMF', attention:'Service Résiliation', address:['148, rue Anatole France','92597 Levallois-Perret Cedex'] },
    { id:'mma', name:'MMA', attention:'Service Résiliation', address:['160, rue Henri Champion','72030 Le Mans Cedex 9'] },
    { id:'pacifica', name:'Pacifica (Crédit Agricole Assurances)', attention:'Service Résiliation', address:['8–10, bd de Vaugirard','75724 Paris Cedex 15'] },
    { id:'predica', name:'Predica (Crédit Agricole Assurances)', attention:'Service Résiliation', address:['16–18, bd de Vaugirard','75724 Paris Cedex 15'] },
    { id:'harmonie', name:'Harmonie Mutuelle', attention:'Service Résiliation', address:['TSA 90130','37049 Tours Cedex 1'] },
    { id:'matmut', name:'Matmut', attention:'Service Résiliation', address:['66, rue de Sotteville','76030 Rouen Cedex 1'] },
    { id:'april', name:'APRIL (Groupe)', attention:'Service Résiliation', address:['12 rue Juliette Récamier – CS 15555','69452 Lyon Cedex 06'] },
    { id:'swisslife', name:'Swiss Life France', attention:'Service Résiliation', address:['1, rue Bellini','92800 Puteaux'] },
    { id:'cardif', name:'BNP Paribas Cardif / Cardif IARD', attention:'Service Résiliation', address:['1, boulevard Haussmann – TSA 93000','75318 Paris Cedex 09'] },
    { id:'abeille', name:'Abeille Assurances (ex Aviva)', attention:'Service Résiliation', address:['80, avenue de l’Europe','92270 Bois-Colombes Cedex'] },
    { id:'cnp', name:'CNP Assurances', attention:'Service Réclamations / Contrats', address:['TSA 93847','92894 Nanterre Cedex 09'] },
    { id:'malakoff', name:'Malakoff Humanis', attention:'Service Résiliation', address:['21, rue Laffitte','75009 Paris'] },
    { id:'mgen', name:'MGEN', attention:'Service Résiliation', address:['3, square Max Hymans','75748 Paris Cedex 15'] },
    { id:'lmg', name:'La Mutuelle Générale', attention:'Service Résiliation', address:['1-11, rue Brillat Savarin – CS 21363','75634 Paris Cedex 13'] }
  ];

  function populateInsurers(){
    const sel = qs('#assureurSelect'); if(!sel) return;
    const q = (qs('#assureurSearch')?.value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    lastInsurer = localStorage.getItem(STORAGE_LAST_INSURER) || '';
    sel.innerHTML = '';
    const opt0 = document.createElement('option'); opt0.value=''; opt0.textContent='— Saisie manuelle —'; sel.appendChild(opt0);
    INSURERS
      .filter(ins => !q || ins.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q))
      .sort((a,b)=>a.name.localeCompare(b.name,'fr',{sensitivity:'base'}))
      .forEach(ins=>{
        const o=document.createElement('option');
        o.value=ins.id; o.textContent='⭐ ' + ins.name;
        sel.appendChild(o);
      });
    sel.value = lastInsurer || '';
  }
  function onInsurerChange(){
    const sel = qs('#assureurSelect'); if(!sel) return;
    const id = sel.value;
    localStorage.setItem(STORAGE_LAST_INSURER, id);
    if(!id){ return; }
    const ins = INSURERS.find(i=>i.id===id); if(!ins) return;
    qs('#destNom').value = ins.name;
    qs('#destAttention').value = ins.attention || '';
    qs('#destAdr').value = (ins.address||[]).join('\n');
    renderPreview();
  }

  /* ===== Export / Import ===== */
  function exportTemplates(){
    const blob = new Blob([JSON.stringify(userTemplates, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='modeles_courrier_perso.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function importTemplates(){
    const input=document.createElement('input'); input.type='file'; input.accept='application/json';
    input.addEventListener('change',()=>{
      const file=input.files?.[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=()=>{
        try{ const arr=JSON.parse(reader.result); if(!Array.isArray(arr)) throw new Error('Format invalide');
          const map=new Map(userTemplates.map(t=>[t.id,t])); arr.forEach(t=>{ if(t && t.id) map.set(t.id,t); });
          userTemplates=Array.from(map.values()); saveUserTemplates(); populateTemplates(); renderTagFilter(); alert("Modèles importés ✅");
        }catch(e){ alert("Import impossible : "+e.message); }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  /* ===== Wiring ===== */
  loadUserTemplates(); loadRemoved(); loadDefaults();
  populateTemplates(); renderTagFilter();
  qs('#templateSelect').addEventListener('change', onTemplateChange);
  const tagSel = document.getElementById('tagFilter'); tagSel.addEventListener('change', ()=>{ selectedTag = tagSel.value; populateTemplates(false); });
  populateInsurers();
  const insurerSel = document.getElementById('assureurSelect'); insurerSel && insurerSel.addEventListener('change', onInsurerChange);
  const insurerSearch = document.getElementById('assureurSearch'); insurerSearch && insurerSearch.addEventListener('input', ()=>{ populateInsurers(); });
  qsa('#ville,#dateAuto,#expNom,#expOrg,#expAdr,#expTel,#expMail,#destNom,#destAttention,#destAdr').forEach(el=>el.addEventListener('input', renderPreview));
  qs('#btnPreview').addEventListener('click', renderPreview);
  qs('#btnCopy').addEventListener('click', copyText);
  qs('#btnPDF').addEventListener('click', downloadPDF);
  qs('#btnReset').addEventListener('click', ()=>{ localStorage.removeItem(STORAGE_DEFAULTS); qsa('input, textarea').forEach(i=>{ if(!['templateSelect','dateAuto'].includes(i.id)) i.value=''; }); qs('#dateAuto').value = frLongDate(); renderPreview(); });
  qs('#btnNew').addEventListener('click', ()=>openEditor('new', null));
  qs('#btnEdit').addEventListener('click', ()=>{ const id=qs('#templateSelect').value; const tpl=allTemplates().find(t=>t.id===id); if(!tpl) return; openEditor(tpl._isUser?'edit':'new', tpl); });
  qs('#btnClone').addEventListener('click', ()=>{ const id=qs('#templateSelect').value; const tpl=allTemplates().find(t=>t.id===id); if(!tpl) return; openEditor('new', {...tpl, label: tpl.label + ' (copie)'}); });
  qs('#mdl_save').addEventListener('click', saveEditor);
  qs('#mdl_cancel').addEventListener('click', closeEditor);
  qs('#mdl_delete').addEventListener('click', deleteEditor);
  qs('#btnRemove').addEventListener('click', removeCurrentTemplate);
  qs('#btnExport').addEventListener('click', exportTemplates);
  qs('#btnImport').addEventListener('click', importTemplates);

} // FIN DE LA FONCTION initCourrierPanel

// Fin du code
