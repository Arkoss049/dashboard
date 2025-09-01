(function() {
  const LS_KEY = 'callScriptsData_v16_favorites';
  const DISABLED_DEFAULTS_KEY = 'callScriptsDisabledDefaults_v16_favorites';
  const THEME_KEY = 'callScriptsTheme_v16';

  const defaultScripts = {
    "GAV_1": {
      name: "GAV — #1 · Lacune accident", product: "GAV",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nEn faisant le point sur votre dossier, je vois que vous êtes bien couvert(e) pour la maladie, mais il reste un angle mort sur les accidents du quotidien.\nEst-ce un oubli, ou le choix de ne pas vous protéger sur ce risque ?\n||Je peux vous montrer en 10 minutes en agence l’impact concret et une solution adaptée. Vous aurez une vision claire pour décider en toute sérénité.||",
      objections: [["Je pensais que la mutuelle suffisait.", "C’est une confusion fréquente : la complémentaire rembourse les soins ; l’indemnisation des séquelles lourdes relève de la Garantie Accidents de la Vie."],["Je n’ai pas le temps.", "C'est justement pour cela que je vous propose un format de 10 minutes, efficace et sans engagement."],["Envoyez d’abord des infos.", "Bien sûr, et pour que ce soit parlant, un court rendez-vous nous permettra de répondre à vos questions."]]
    },
    "GAV_2": {
      name: "GAV — #2 · Non‑aligné", product: "GAV",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre dossier met l'accent sur la maladie, mais votre rythme de vie laisse un angle mort en cas d'accident avec séquelles.\nSouhaitez-vous que l’on corrige ce décalage, ou préférez-vous maintenir la couverture telle quelle ?\n||Je vous montre en agence une option simple qui sécurise le budget du foyer. Vous repartirez avec une solution concrète pour être tranquille.||",
      objections: [["Je suis déjà assuré(e) ailleurs.", "Parfait ! Je vous propose un contrôle neutre : si tout est au bon niveau, je vous le confirme ; sinon, je vous montre une amélioration mesurée."],["J’ai peur des exclusions.", "Nous passons ensemble les points clés et ce qui est réellement couvert, sans jargon. Vous repartez avec un résumé écrit."],["Pas disponible en semaine.", "Je m’adapte : début de journée, pause déjeuner, fin d’après‑midi. Quel créneau vous arrangerait le mieux ?"]]
    },
    "GAV_3": {
      name: "GAV — #3 · Opportunité", product: "GAV",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVous avez une bonne base santé, mais vous ne profitez pas de l’indemnisation dédiée aux accidents de la vie courante.\nVous souhaitez la mettre en place, ou on vérifie d’abord ensemble si c’est pertinent pour vous ?\n||Dix minutes en agence suffisent pour trancher. Vous saurez exactement à quoi vous attendre et pourrez prendre la bonne décision.||",
      objections: [["Ce sera trop cher.", "On adapte le niveau d’indemnisation à votre budget. Je vous montre des ordres de grandeur et on choisit la solution la plus sobre."],["Je veux éviter la paperasse.", "Je simplifie avec vous étape par étape. Vous repartez avec un dossier prêt, si vous le souhaitez."],["Je verrai plus tard.", "Compris. Un point bref maintenant vous évite d’oublier et vous décidez ensuite, sans pression."]]
    },
    "GAV_4": {
      name: "GAV — #4 · Mise à jour", product: "GAV",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre couverture n’a pas été recalée récemment : en cas d’accident avec séquelles, l’indemnisation est très limitée.\nPréférez-vous que l’on mette à jour ce point ensemble, ou souhaitez-vous rester ainsi ?\n||Je vous montre en agence une correction simple en 10 minutes. Cela vous permettra de vous assurer que votre protection est toujours bien adaptée.||",
      objections: [["Je pensais être à jour.", "C’est souvent le cas pour la maladie. Sur l'accident, il reste parfois un angle mort. Je vous le vérifie concrètement en agence."],["Je ne veux pas augmenter mon budget.", "L’objectif est l’équilibre : sécuriser l’essentiel sans surpayer. Je vous propose une solution mesurée."],["Je n’aime pas être démarché(e).", "Je comprends : entretien conseil, gratuit et sans engagement. Vous gardez la main du début à la fin."]]
    },
    "OBS_1": {
      name: "Obsèques — #1 · Absence", product: "Obsèques",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nDans le cadre du suivi de votre dossier, j'ai remarqué qu'aucune disposition obsèques n'est mentionnée. Aujourd'hui, ce serait donc à vos proches de décider et d'avancer les frais.\nSouhaitez-vous que l’on prépare une solution simple pour les soulager, ou préférez-vous laisser cette charge pour plus tard ?\n||En 10 minutes à l'agence, je vous présente des options claires. Cela vous permettra de repartir l'esprit tranquille, quelle que soit votre décision.||",
      objections: [["Je ne veux pas y penser.", "Je comprends. Justement, on en parle une fois, calmement, pour ne plus avoir à y penser ensuite."],["Mes enfants s’en chargeront.", "C’est une possibilité. Beaucoup de nos adhérents préfèrent cependant les soulager de ce poids. Je peux vous montrer les deux scénarios."],["C’est sûrement coûteux.", "Les montants sont modulables pour respecter votre budget. Le but est d'alléger vos proches, pas de vous alourdir."]]
    },
    "OBS_2": {
      name: "Obsèques — #2 · Volontés", product: "Obsèques",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nJe ne vois pas vos volontés consignées ; le moment venu, vos proches devront décider à votre place.\nPréférez-vous que l’on les note dès maintenant, ou souhaitez-vous attendre ?\n||Je vous accompagne en agence, en toute discrétion. C'est une démarche simple qui apporte beaucoup de tranquillité.||",
      objections: [["Sujet trop sensible.", "Je le traite avec tact. Nous ne parlons que de ce que vous souhaitez, à votre rythme."],["Je ne veux pas m’engager.", "L’entretien est informatif et sans engagement. Vous repartez avec un récap pour réfléchir au calme."],["Je préfère que la famille décide.", "Option respectée. L’alternative consiste à alléger la charge pour eux ; je vous montre les deux voies."]]
    },
    "OBS_3": {
      name: "Obsèques — #3 · Budget", product: "Obsèques",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre dossier ne prévoit pas de budget dédié ; vos proches pourraient devoir avancer des frais.\nVoulez-vous qu’on mette en place une provision simple, ou préférez-vous conserver la situation actuelle ?\n||Dix minutes à l’agence et vous avez une réponse claire sur la meilleure façon de vous organiser.||",
      objections: [["Je n’ai pas de marge.", "On ajuste très finement le montant ; l’idée est d’alléger vos proches sans alourdir votre budget."],["Je veux éviter la paperasse.", "Je simplifie toutes les démarches avec vous, étape par étape."],["Je déciderai plus tard.", "Très bien ; faisons au moins un point d’information pour que vous décidiez sereinement ensuite."]]
    },
    "OBS_4": {
      name: "Obsèques — #4 · Bénéficiaires", product: "Obsèques",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nLes bénéficiaires ne sont pas explicitement définis dans votre dossier.\nSouhaitez-vous que l’on les précise pour éviter tout flou, ou préférez-vous laisser comme c’est ?\n||Je vous prépare cela en agence, rapidement et en toute confidentialité. Cela garantit que votre volonté sera appliquée à la lettre.||",
      objections: [["Je ne sais pas qui désigner.", "Je vous explique les options et leurs implications, simplement. Vous choisissez ce qui vous correspond."],["Je crains de me tromper.", "C’est révisable. Nous procédons par étapes et vous gardez la main."],["Pas disponible cette semaine.", "Je m’adapte : matin, midi ou fin de journée. Quel créneau vous va le mieux ?"]]
    },
    "PER_1": {
      name: "PER — #1 · Avantage fiscal", product: "PER",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nJe vous contacte car, en étudiant votre situation, il me semble que vous ne profitez pas des avantages fiscaux possibles avec le Plan d'Épargne Retraite.\nSouhaitez-vous qu’on regarde ensemble ce que cela vous apporterait, ou préférez-vous rester ainsi ?\n||Je vous fais une simulation simple en agence. En 15 minutes, vous aurez un chiffre précis de l'économie potentielle et vous saurez si c'est une piste intéressante pour vous.||",
      objections: [["Je ne paie pas beaucoup d’impôts.", "Même avec peu d'impôts, l'intérêt peut être patrimonial sur la durée. On peut calibrer de tout petits versements."],["Je n’y comprends rien.", "Mon rôle est de vous l'expliquer simplement, avec un exemple chiffré sur une seule page."],["Je préfère garder de la souplesse.", "Le PER est bien plus souple qu'on ne le pense. Je peux vous détailler les options de versements et de sortie."]]
    },
    "PER_2": {
      name: "PER — #2 · Épargne non-orientée", product: "PER",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre épargne n’est pas orientée spécifiquement vers la retraite ; elle n’est pas structurée pour cet objectif.\nVoulez-vous que l’on pose un cadre simple maintenant, ou préférez-vous rester sur du court terme ?\n||Dix minutes en agence suffisent pour que vous ayez une stratégie claire et que vous puissiez avancer sereinement.||",
      objections: [["Je verrai plus tard.", "Démarrer tôt change la donne même avec de petits montants. On pose le cadre aujourd’hui et vous gardez la main."],["J’ai déjà de l’épargne.", "Parfait : structurons ce que vous avez et voyons si le PER apporte un plus."],["Je crains les frais.", "Transparence totale et impact réel à l’appui. Vous décidez en connaissance de cause."]]
    },
    "PER_3": {
      name: "PER — #3 · Sortie non planifiée", product: "PER",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nJe ne vois pas de stratégie de sortie associée à votre future retraite, ce qui peut créer de l'incertitude.\nPréférez-vous que l’on balise cela ensemble, ou souhaitez-vous attendre ?\n||Je vous montre en agence des options de sortie claires. Cela vous permettra de vous projeter et de faire les bons choix bien en amont.||",
      objections: [["Je ne veux pas bloquer mon argent.", "Plusieurs modalités existent. Je vous explique précisément ce qui est possible et quand."],["Trop complexe.", "Je synthétise sur une page avec deux scénarios pour décider sereinement."],["Pas le temps.", "Rendez-vous court et cadré : 10 à 15 minutes suffisent."]]
    },
    "PER_4": {
      name: "PER — #4 · Opportunité salariale", product: "PER",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre revenu et vos primes permettent souvent un levier retraite/fiscalité que vous n’exploitez pas.\nSouhaitez-vous qu’on chiffre ce levier, ou préférez-vous rester sans dispositif ?\n||Je vous prépare une estimation claire en agence. Vous aurez des chiffres concrets pour évaluer le potentiel.||",
      objections: [["Je veux garder du disponible.", "On reste modeste et réversible. L’idée est d’optimiser sans vous contraindre."],["Je préfère des versements irréguliers.", "C’est possible : versements libres, adaptés à votre rythme. Je vous montre comment faire."],["Je veux d’abord comprendre en détail.", "Parfait : je vous prépare un mémo clair, puis on décide ensemble."]]
    },
    "AV_1": {
      name: "Assurance Vie — #1 · Enveloppe", product: "Assurance Vie",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nEn faisant le point sur votre épargne, je vois qu'elle est principalement placée sur des livrets. Vous n'utilisez donc pas l'enveloppe bien plus avantageuse de l'assurance vie.\nQuelle est votre stratégie actuelle pour faire fructifier cette épargne ?\nVoulez-vous que l'on regarde ensemble comment cette enveloppe pourrait dynamiser vos projets, ou préférez-vous rester sur une épargne à court terme ?\n||En agence, je vous montre la différence concrète. Vous repartirez avec un comparatif simple pour voir quelle option est la plus judicieuse pour vous.||",
      objections: [["Je préfère la sécurité.", "On peut garder une poche très sécurisée au sein de l’assurance vie. Je vous montre comment rester confortable."],["Je crains les frais.", "Je détaille tout en transparence et vous montre l’impact réel."],["Envoyez des éléments d’abord.", "Avec plaisir ; et un court rendez‑vous vous permettra de poser vos questions en direct."]]
    },
    "AV_2": {
      name: "Assurance Vie — #2 · Bénéficiaires", product: "Assurance Vie",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre clause bénéficiaire n’apparaît pas clairement à jour.\nSouhaitez-vous qu’on la vérifie et, si besoin, qu’on la précise, ou préférez-vous la laisser telle quelle ?\n||Je vous accompagne en agence, rapidement et en toute confidentialité. Cela vous assure que vos volontés seront parfaitement respectées.||",
      objections: [["Je ne sais pas quoi indiquer.", "Je vous explique les options et leurs implications, simplement. Vous choisissez en connaissance de cause."],["Je crains de me tromper.", "C’est révisable. Nous procédons par étapes, vous gardez la main."],["Pas le temps.", "C’est rapide : on sécurise l’essentiel en quelques minutes et vous repartez avec un récap clair."]]
    },
    "AV_3": {
      name: "Assurance Vie — #3 · Allocation", product: "Assurance Vie",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre allocation ne semble pas alignée avec vos horizons de projets.\nVoulez-vous que l’on la rééquilibre ensemble, ou préférez-vous la conserver telle quelle ?\n||Je vous propose deux options très lisibles en agence. Vous aurez ainsi une vision claire de la meilleure stratégie à adopter.||",
      objections: [["C’est risqué ?", "On choisit un niveau adapté à votre confort, y compris très prudent. Je vous montre des exemples concrets."],["Je ne veux pas gérer au quotidien.", "Possible : gestion accompagnée. Je vous montre la différence avec la gestion libre."],["Je ne veux rien changer.", "Très bien ; au moins, vérifions que votre allocation correspond bien à vos objectifs actuels."]]
    },
    "AV_4": {
      name: "Assurance Vie — #4 · Suivi", product: "Assurance Vie",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nJe ne vois pas de point de suivi régulier sur votre épargne, et on peut passer à côté d’ajustements simples.\nPréférez-vous que l’on fixe un cadrage annuel, ou souhaitez-vous rester sans suivi ?\n||Je vous propose un format très léger en agence. L'objectif est de vous garantir la tranquillité d'esprit.||",
      objections: [["Je manque de temps.", "On cale un rendez-vous court, une fois par an. Vous restez serein(e) le reste du temps."],["Je ne veux pas d’obligation.", "Rien d’obligatoire : c’est un repère. Vous pouvez ajuster ou annuler librement."],["Je préfère tout par mail.", "Je vous envoie un récap, et un court point en agence évite les allers-retours."]]
    },
    "SANTE_1": {
      name: "Santé — #1 · Angles morts", product: "Santé",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nEn consultant votre contrat santé, je vois des restes à charge possibles sur des postes coûteux comme l'optique et le dentaire. Vous pourriez donc payer plus que nécessaire.\nSouhaitez-vous que l'on revoie ces postes, ou préférez-vous conserver l'actuel ?\n||Je peux vous préparer des ajustements mesurés en agence. Vous saurez ainsi exactement sur quel remboursement compter en cas de besoin.||",
      objections: [["Je pensais être bien couvert(e).", "C’est souvent vrai pour la base. Sur l'optique et le dentaire, il reste parfois des écarts. Je peux vous montrer des cas concrets."],["Je ne veux pas augmenter mes cotisations.", "L'objectif est l'équilibre : renforcer l'essentiel sans surpayer. Je vous proposerai des pistes chiffrées."],["Je préfère ne rien changer.", "Entendu. Validons au moins que votre contrat est toujours cohérent avec votre usage réel, cela ne prend que quelques minutes."]]
    },
    "SANTE_2": {
      name: "Santé — #2 · Hospitalisation", product: "Santé",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nLa partie hospitalisation de votre contrat n’apparaît pas clairement renforcée, notamment pour la chambre particulière.\nVoulez-vous qu’on vérifie et qu’on ajuste si besoin, ou souhaitez-vous rester ainsi ?\n||En agence, je vous propose un réglage simple. Cela vous permettra d'aborder une hospitalisation avec le moins de stress possible.||",
      objections: [["Je veux garder ma liberté de médecin.", "Aucun problème : je vérifie la compatibilité de vos garanties avec vos habitudes et vous le confirme."],["Je ne veux pas de hausse.", "On ajuste finement pour respecter votre budget. L’idée est d’être juste, pas plus."],["Pas disponible cette semaine.", "Je m’adapte : matin, midi, fin de journée. Quel créneau vous arrange ?"]]
    },
    "SANTE_3": {
      name: "Santé — #3 · Services", product: "Santé",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre contrat inclut certains services d’assistance comme l'aide à domicile, mais ils ne sont pas activés.\nSouhaitez-vous que l’on active ce qui peut vous être utile, ou préférez-vous rester comme aujourd’hui ?\n||Je vous fais un point clair en agence. Vous connaîtrez ainsi tous les avantages concrets de votre contrat.||",
      objections: [["Je n’en ai pas besoin.", "Parfait ; voyons au moins ce qui pourrait vraiment vous servir, sans rien ajouter d’inutile."],["Je crains les démarches.", "Je m’occupe de tout avec vous, simplement. Vous repartez avec un plan prêt."],["Envoyez un mail.", "Je vous envoie un récap et un court rendez-vous permet d’éviter les allers-retours."]]
    },
    "SANTE_4": {
      name: "Santé — #4 · Mise à jour", product: "Santé",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nVotre contrat n’a pas été recalé récemment et vos usages ont peut-être évolué.\nPréférez-vous que l’on valide et ajuste ensemble, ou souhaitez-vous laisser ainsi ?\n||Dix minutes à l’agence suffisent pour vous assurer de ne payer que pour ce dont vous avez réellement besoin.||",
      objections: [["Je n’ai pas changé d’usage.", "Très bien ; au moins, validons que tout est toujours cohérent. Vous décidez ensuite."],["Je ne veux pas payer plus.", "L’idée est d’ajuster sans alourdir. Je vous propose des réglages mesurés."],["Je verrai plus tard.", "Un point court aujourd’hui vous évite d’oublier. Vous restez libre de la suite."]]
    },
    "DECES_1": {
      name: "Prévoyance Décès — #1 · Capital", product: "Prévoyance Décès",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nEn faisant le point sur votre dossier, je ne vois pas de capital décès prévu pour protéger vos proches. Le niveau de vie de votre foyer ne serait donc pas sécurisé.\nSouhaitez-vous que l'on calibre un montant adapté pour mettre votre famille à l'abri, ou préférez-vous rester ainsi ?\n||En agence, je vous montre une solution mesurée. Vous aurez une vision claire de comment sécuriser leur avenir.||",
      objections: [["Je suis déjà couvert(e) par l’entreprise.", "C’est un bon socle, mais souvent insuffisant et non portable en cas de changement. Je peux vérifier les écarts avec vous."],["Sujet anxiogène.", "Je comprends. On l'aborde calmement, dans le seul but de viser la sérénité pour vous et vos proches."],["C’est trop cher.", "On ajuste finement le capital pour respecter votre budget. Je peux vous montrer des exemples concrets."]]
    },
    "DECES_2": {
      name: "Prévoyance Décès — #2 · Portabilité", product: "Prévoyance Décès",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nLa couverture décès liée à votre employeur n’est pas forcément portable si vous changez de poste, ce qui peut créer une rupture de protection.\nVoulez-vous sécuriser une solution indépendante qui vous suit partout, ou préférez-vous rester tributaire de l’entreprise ?\n||Je vous explique tout clairement en agence. Cela vous donnera une protection stable et pérenne.||",
      objections: [["Je ne compte pas changer d’emploi.", "Très bien ; posons tout de même un filet simple et peu coûteux, au cas où. Vous restez maître des ajustements."],["Je ne veux pas sur-assurer.", "Justement : calibrage au plus juste, sans payer l’inutile."],["Pas le temps.", "Rendez-vous court et cadré : 10 à 15 minutes suffisent."]]
    },
    "DECES_3": {
      name: "Prévoyance Décès — #3 · Calibrage", product: "Prévoyance Décès",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nLe capital prévu dans votre dossier ne semble plus proportionné au niveau de vie de votre foyer.\nPréférez-vous que l’on le calibre précisément, ou souhaitez-vous garder l’actuel ?\n||Je vous fais un chiffrage clair en agence. Vous serez ainsi certain(e) que le capital prévu est vraiment protecteur.||",
      objections: [["Je crains la hausse de cotisation.", "Notre objectif est d’être au plus juste. Je vous montre plusieurs paliers pour rester confortable."],["Je n’ai pas d’enfants.", "La prévoyance protège aussi un conjoint, un proche, ou crée un filet financier utile. Je vous explique."],["Je ne veux pas m’engager longtemps.", "Il existe des formules souples. Je vous présente les options et leurs implications concrètes."]]
    },
    "DECES_4": {
      name: "Prévoyance Décès — #4 · Bénéficiaires", product: "Prévoyance Décès",
      body: "Bonjour, je suis [Nom], de l’agence Harmonie Mutuelle de [Agence].\nJe vous dérange ?\nLes bénéficiaires de votre prévoyance ne sont pas clairement définis.\nSouhaitez-vous que l’on les précise pour éviter tout flou, ou préférez-vous laisser comme c’est ?\n||Je vous accompagne en agence, rapidement et en toute confidentialité. Cela garantit que votre volonté sera appliquée à la lettre.||",
      objections: [["Je ne sais pas qui indiquer.", "Je vous explique les options et leurs implications, simplement. Vous choisissez ce qui vous correspond."],["Je crains de me tromper.", "C’est révisable à tout moment. Nous procédons par étapes."],["Je préfère tout par écrit.", "Je vous fournis un récap clair et on valide ensemble en agence pour éviter les allers-retours."]]
    }
  };
  
  let currentId = null; let currentTone = 'standard'; let lastIA = '';
  let isScriptsModuleLoaded = false;
  
  window.loadScriptsModule = function(){
    if (isScriptsModuleLoaded) return;
    initializeData();
    runSearch();
    updateButtonsState();
    isScriptsModuleLoaded = true;
  };
  
  function getData(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e){ return {}; } }
  function setData(obj){ localStorage.setItem(LS_KEY, JSON.stringify(obj)); }
  function initializeData(){
    const stored = getData(); const disabled = new Set(JSON.parse(localStorage.getItem(DISABLED_DEFAULTS_KEY) || '[]')); let changed = false;
    for (const key in defaultScripts){
      if (disabled.has(key)) continue;
      if (!stored[key] || stored[key].isDefault) {
        const isFavorite = stored[key]?.isFavorite || false;
        stored[key] = { ...defaultScripts[key], isDefault: true, isFavorite };
        changed = true;
      }
    }
    if (changed) setData(stored);
  }
  
  function formatHTML(text){
    const view = document.getElementById('formattedView');
    view.innerHTML = '';
    if (!text) {
      view.innerHTML = '<p class="muted" id="emptyHint">Choisissez un script dans le panneau de gauche pour commencer.</p>';
      return;
    }
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = esc(text.trim()).split('\n');
    lines.forEach(line => {
      if (!line.trim()) return;
      const p = document.createElement('p');
      if (line.includes('||')) {
        p.className = 'benefit';
        p.textContent = line.replace(/\|\|/g, '');
      } else if (line.endsWith('?')) {
        p.className = 'question';
        p.textContent = line;
      } else {
        p.className = 'statement';
        p.textContent = line;
      }
      view.appendChild(p);
    });
  }
  
  function toggleFavorite(id, event) {
    event.stopPropagation();
    const data = getData();
    if (data[id]) {
      data[id].isFavorite = !data[id].isFavorite;
      setData(data);
      runSearch();
    }
  }
  function tokensFromQuery(q){ const out = []; const re = /"([^"]+)"|(\S+)/g; let m; while ((m = re.exec(q))){ if (m[1]) out.push(m[1].trim()); else out.push(m[2]); } return out; }
  function normalize(s){ return (s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }
  function scoreScript(s, qTokens, fieldFilters){
    const name = normalize(s.name); const product = normalize(s.product); const body = normalize(s.body);
    if (fieldFilters.product && product !== normalize(fieldFilters.product)) return -Infinity;
    if (fieldFilters.name && !name.includes(normalize(fieldFilters.name))) return -Infinity;
    let score = 0; if (qTokens.length === 0) return 0;
    qTokens.forEach((t)=>{ const tn = normalize(t); if (name.includes(tn)) score += 3; if (product.includes(tn)) score += 2.5; if (body.includes(tn)) score += 1; });
    return score;
  }
  function parseQuery(q){
    const tokens = tokensFromQuery(q); const free = []; const filters = {};
    tokens.forEach(t=>{ const m = t.match(/^(\w+):(.*)$/); if (m){ const k = m[1].toLowerCase(); const v = m[2]; if (['product','name','body'].includes(k)){ if (k==='product') filters.product = v; else if (k==='name') filters.name = v; else if (k==='body') free.push(v); return; } } free.push(t); });
    return {tokens: free, filters};
  }
  function runSearch(){
    const data = getData(); const list = Object.entries(data); const q = document.getElementById('searchInput').value.trim(); const pf = document.getElementById('productFilter').value.trim(); const {tokens, filters} = parseQuery(q); if (pf) filters.product = pf;
    const scored = list.map(([id,s])=> [id, s, scoreScript(s, tokens, filters)])
      .filter(([, ,score])=> score !== -Infinity)
      .sort((a,b)=> {
        const favA = a[1].isFavorite || false;
        const favB = b[1].isFavorite || false;
        if (favA !== favB) return favB - favA;
        return b[2]-a[2] || (a[1].product || '').localeCompare(b[1].product || '', 'fr') || (a[1].name||'').localeCompare(b[1].name||'', 'fr');
      });
    renderList(scored.map(([id,s])=>({id, meta:s}))); document.getElementById('resultCount').textContent = scored.length + ' résultat' + (scored.length>1?'s':'');
  }
  let searchTimer = null;
  function debouncedSearch(){ if (searchTimer) clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 150); }
  function renderList(items){
    const box = document.getElementById('scriptList'); box.innerHTML='';
    items.forEach(({id, meta})=>{
      const card = document.createElement('div');
      card.className = 'item';
      if (id === currentId) card.classList.add('active');
      const header = document.createElement('div');
      header.className = 'item-header';
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = meta.name || id;
      const favBtn = document.createElement('button');
      favBtn.className = 'favorite-btn';
      favBtn.innerHTML = meta.isFavorite ? '❤️' : '🤍';
      if(meta.isFavorite) favBtn.classList.add('favorited');
      favBtn.onclick = (event) => toggleFavorite(id, event);
      header.appendChild(title);
      header.appendChild(favBtn);
      card.appendChild(header);
      const metaRow = document.createElement('div');
      metaRow.className = 'meta';
      const chipProd = document.createElement('span');
      chipProd.className = 'chip';
      chipProd.textContent = meta.product;
      metaRow.appendChild(chipProd);
      if (!meta.isDefault){ const c = document.createElement('span'); c.className = 'chip'; c.textContent = 'Perso'; metaRow.appendChild(c); }
      card.appendChild(metaRow);
      card.onclick = () => selectScript(id);
      box.appendChild(card);
    });
    if (items.length === 0){ const empty = document.createElement('div'); empty.className = 'muted'; empty.textContent = 'Aucun résultat.'; box.appendChild(empty); }
  }
  function selectScript(id){ currentId = id; runSearch(); renderScript(); updateButtonsState(); }
  function updateButtonsState(){ const has = !!currentId; ['btnModify','btnDuplicate','btnDelete','btnCopy'].forEach(id=>{ const el=document.getElementById(id); if(el) el.disabled = !has; }); }
  function replaceVars(text){ const nom = (document.getElementById('var-nom').value || '[Nom]'); const agence = (document.getElementById('var-agence').value || '[Agence]'); return (text || '').replaceAll('[Nom]', nom).replaceAll('[Agence]', agence); }
  function renderObjections(s){
    const box = document.getElementById('objections'); box.innerHTML=''; if (!s || !s.objections || !s.objections.length){ box.innerHTML='<div class="muted">Aucune objection enregistrée.</div>'; return; }
    s.objections.forEach(([o,r])=>{ const el = document.createElement('div'); el.className='obj'; const b = document.createElement('b'); b.textContent = 'Objection : ' + o; el.appendChild(b); const p = document.createElement('div'); p.textContent = replaceVars(r); el.appendChild(p); const act = document.createElement('div'); act.className='actions'; act.innerHTML = '<button class="btn btn-ghost" style="padding:4px 8px; font-size:12px;">Copier</button>'; act.querySelector('button').onclick = ()=> { navigator.clipboard.writeText(replaceVars(r)); }; el.appendChild(act); box.appendChild(el); });
  }
  function toneRewrite(base, tone){ let t = base; const nbsp='[\\u00A0\\u202F]?'; if (tone === 'incisif'){ const prefix = "Je vous appelle car ce point mérite d’être corrigé rapidement.\n"; t = t.replace(/(Bonjour, je suis .*?\.\n)/, `$1${prefix}`); t = t.replace(new RegExp('Souhaitez'+nbsp+'-?'+nbsp+'vous','gi'), 'On'); t = t.replace(new RegExp('Préférez'+nbsp+'-?'+nbsp+'vous','gi'), 'On'); t = t.replace(new RegExp('Voulez'+nbsp+'-?'+nbsp+'vous','gi'), 'On'); t+="\nOn cale 10 minutes aujourd’hui ou demain à l’agence ?"; } else if (tone === 'doux'){ const prefix = "Je me permets de vous contacter en toute simplicité pour valider un petit point.\n"; t = t.replace(/(Bonjour, je suis .*?\.\n)/, `$1${prefix}`); t = t.replace(new RegExp('Souhaitez'+nbsp+'-?'+nbsp+'vous','gi'), 'Est‑ce que vous souhaiteriez'); t = t.replace(new RegExp('Préférez'+nbsp+'-?'+nbsp+'vous','gi'), 'Préféreriez‑vous'); t = t.replace(new RegExp('Voulez'+nbsp+'-?'+nbsp+'vous','gi'), 'Aimeriez‑vous'); t+="\nSi vous êtes d’accord, on regarde cela en 10 minutes quand vous êtes disponible."; } return t; }
  function getCurrent(){ const data=getData(); return data[currentId]; }
  function getScriptByTone(s){ if (!s) return ''; const base = replaceVars(s.body); return currentTone==='standard' ? base : toneRewrite(base, currentTone); }
  function renderScript(){
    const s = getCurrent();
    if (!s){ formatHTML(null); renderObjections(null); return; }
    const text = getScriptByTone(s);
    formatHTML(text);
    renderObjections(s);
    document.getElementById('toneChip').textContent = 'Ton : ' + (currentTone==='standard'?'Standard':currentTone==='incisif'?'Incisif':'Doux');
  }
  function setTone(t){ currentTone = t; document.getElementById('tone-standard').classList.toggle('active', t==='standard'); document.getElementById('tone-incisif').classList.toggle('active', t==='incisif'); document.getElementById('tone-doux').classList.toggle('active', t==='doux'); renderScript(); }
  function copyScript(){ const s = getCurrent(); if (!s) return; navigator.clipboard.writeText(getScriptByTone(s).replace(/\|\|/g,'')); }
  function openCreateModal(){ document.getElementById('modalTitle').textContent = 'Nouveau script'; document.getElementById('m-name').value=''; document.getElementById('m-product').value='GAV'; document.getElementById('m-body').value=''; document.getElementById('m-objs').value=''; document.getElementById('editModal').style.display='grid'; document.getElementById('editModal').setAttribute('aria-hidden','false'); document.getElementById('editModal').dataset.editId = ''; }
  function openEditModal(){ const s = getCurrent(); if (!s) return; document.getElementById('modalTitle').textContent = 'Modifier le script'; document.getElementById('m-name').value=s.name||''; document.getElementById('m-product').value=s.product||'GAV'; document.getElementById('m-body').value=s.body||''; document.getElementById('m-objs').value=(s.objections||[]).map(([o,r])=>`${o} ::: ${r}`).join('\n'); document.getElementById('editModal').style.display='grid'; document.getElementById('editModal').setAttribute('aria-hidden','false'); document.getElementById('editModal').dataset.editId = currentId; }
  function closeModal(){ document.getElementById('editModal').style.display='none'; document.getElementById('editModal').setAttribute('aria-hidden','true'); document.getElementById('editModal').dataset.editId = ''; }
  function parseObjections(text){ return (text||'').split('\n').map(s=>s.trim()).filter(Boolean).map(line=>{ const [o,r] = line.split(':::').map(p=> (p||'').trim()); return (o && r) ? [o,r] : null; }).filter(Boolean); }
  function saveModal(){ const id = document.getElementById('editModal').dataset.editId || ''; const name = document.getElementById('m-name').value.trim(); const product = document.getElementById('m-product').value.trim(); const body = document.getElementById('m-body').value.trim(); const objections = parseObjections(document.getElementById('m-objs').value); if (!name || !body){ alert('Nom et contenu requis.'); return; } const data = getData(); const newId = id || ('MANUAL_' + Date.now()); const isFavorite = id ? (data[id]?.isFavorite || false) : false; data[newId] = { name, product, body, objections, isDefault: false, isFavorite }; setData(data); closeModal(); runSearch(); selectScript(newId); }
  function duplicateScript(){ const s = getCurrent(); if (!s) return; const data = getData(); const newid = 'MANUAL_' + Date.now(); data[newid] = { ...s, name: (s.name + ' (copie)'), isDefault:false, isFavorite: false }; setData(data); runSearch(); selectScript(newid); }
  function deleteScript(){ if (!currentId) return; const data = getData(); const s = data[currentId]; if (!s) return; if (s.isDefault){ if (!confirm('Masquer ce script par défaut de la liste ?')) return; const disabled = new Set(JSON.parse(localStorage.getItem(DISABLED_DEFAULTS_KEY) || '[]')); disabled.add(currentId); localStorage.setItem(DISABLED_DEFAULTS_KEY, JSON.stringify(Array.from(disabled))); } else { if (!confirm('Supprimer définitivement ce script ?')) return; delete data[currentId]; setData(data); } currentId = null; runSearch(); renderScript(); updateButtonsState(); }
  function iaRewrite(kind){ const s = getCurrent(); if (!s){ document.getElementById('iaOut').textContent='Aucun script sélectionné.'; return; } let t = replaceVars(s.body); if (kind==='incisif') t = toneRewrite(t, 'incisif'); else if (kind==='doux') t = toneRewrite(t, 'doux'); else if (kind==='raccourcir'){ t = t.replace(/\b(très|vraiment|simplement|justement|clairement|rapidement)\b/gi, ''); t = t.replace(/,\s?vous [^,.!?]+/gi, ''); t = t.replace(/\s{2,}/g,' ').trim(); } else if (kind==='simplifier'){ t = t.replace(/\bindemnisation\b/gi,'prise en charge'); t = t.replace(/\bmodalités\b/gi,'règles'); t = t.replace(/\bscénarios\b/gi,'exemples'); t = t.replace(/\bstructure\b/gi,'cadre'); } else if (kind==='cta'){ if (!/\bagence\b/i.test(t)) t += " On peut voir ça à l’agence si vous voulez."; t += " Je vous propose mardi 9h30 ou jeudi 17h30, lequel vous convient ?"; } else if (kind==='empathie'){ t = t.replace(/Je comprends ?;?/gi,'').trim(); t = "Je comprends votre point de vue. " + t; } lastIA = t; document.getElementById('iaOut').textContent = t.replace(/\|\|/g,''); }
  function copyIA(){ if (lastIA) navigator.clipboard.writeText(lastIA.replace(/\|\|/g,'')); }
  function applyIA(){ if (!lastIA || !currentId) return; const data = getData(); const s = data[currentId]; if (!s) return; const nom = document.getElementById('var-nom').value || '[Nom]'; const agence = document.getElementById('var-agence').value || '[Agence]'; let back = lastIA.replaceAll(nom,'[Nom]').replaceAll(agence,'[Agence]'); s.body = back; setData(data); renderScript(); }
})();
