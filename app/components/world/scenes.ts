// @ts-nocheck — scènes en temps réel des futurs projets (canvas 2D, même code que la page Claude)
// Chaque scène dessine le principe du projet, en direct : pas de vidéo.
// À côté de la scène, un panneau « comment ça marche » : les étapes s'allument au rythme de l'animation.
import GLYPHES from './glyphes.json';
import OPS from './operateurs.json';

const SIG = GLYPHES.signes;
const TOUS = { ...GLYPHES.symboles, ...GLYPHES.operateurs };

const TEXTES = {
  fr: {
    orcaTitres: ["LES ÉTAGES", "DES SIGNES QUI ONT UN SENS", "CODER AU CLAVIER", "D’UN ÉTAGE À L’AUTRE", "LES LIENS ENTRE ÉTAGES", "MODE 2D ⇄ 3D", "PLAN / IMMEUBLES", "LES VISIONS", "UNE MATIÈRE PAR ÉTAGE", "LE MENU EN GLYPHES", "LA PARTITION", "TRACKING, MIDI, OSC"], orcaTouches: ["démo · Ctrl+Maj+D", "NOMS", "clavier", "' , ( ) \" -", "F9", "Ctrl+D", "F8", "Tab", "F10", "clic sur un glyphe", "F5 · Ctrl+F5 REC", "TRACKING"], chargement: "chargement\u2026",
    svLegende: [["css", "ce qu’on conçoit"], ["or", "ce qui agit, le signal"], ["encre", "l’objet, le corps"], ["gris", "le contexte"]],
    sv: {"sv-data": {"titres": ["LES DONNÉES", "VISUEL OU MUSIQUE", "POUR QUI, POUR OÙ"], "etapes": ["Des capteurs, des stations, des flux : les données arrivent de partout et convergent.", "On les convertit en forme artistique : un visuel qui se construit, ou une musique qui en joue les variations.", "Cette forme trouve sa place : au musée, en concert, dans une installation ou un système interactif où le public la fait réagir."], "mots": ["capteurs, mesures", "les données", "un visuel", "une musique", "musée", "concert", "installation interactive"]}, "sv-conseil": {"titres": ["L’IDÉE", "TROIS MONDES", "LA FEUILLE DE ROUTE"], "etapes": ["Un projet commence souvent flou : une envie, un lieu, un public, un délai. On écoute et on pose les contraintes.", "On le regarde avec trois paires d’yeux, l’art, le design et l’ingénierie, jusqu’à trouver ce qui tient des trois.", "Puis on trace la route : idée, prototype, test, scène. Chaque étape a son livrable, et on sait où l’on va."], "mots": ["une idée, des contraintes", "budget", "public", "délai", "lieu", "art", "design", "ingénierie", "le projet", "idée", "prototype", "test", "scène"]}, "sv-da": {"titres": ["LES RÉFÉRENCES", "LES CHOIX", "L’UNIVERS"], "etapes": ["On réunit des références : matières, motifs, signes, images. Elles se répondent, et une direction se dessine.", "On choisit : une palette, une typographie, une couleur de son. Peu d’éléments, mais tenus partout.", "Ensemble, ils forment un univers cohérent, qu’on retrouve dans l’image, l’objet, la scène et le son."], "mots": ["références", "couleurs", "typographie", "son", "un univers cohérent"]}, "sv-digital": {"titres": ["L’ESPACE", "LUMIÈRE ET SON", "LE PUBLIC AGIT"], "etapes": ["Tout part d’un lieu et de ceux qui le traversent : ses murs, ses volumes, ses visiteurs.", "On l’habite d’images projetées et de sons spatialisés : la pièce devient une œuvre.", "Et l’œuvre écoute : chaque présence, chaque mouvement du public la transforme en temps réel."], "mots": ["un espace, des visiteurs", "projection et son", "chaque présence modifie l’œuvre"]}, "sv-physique": {"titres": ["L’IDÉE", "LA FABRICATION", "SA PLACE"], "etapes": ["On imagine avec vous un objet qui n’existe pas encore, et on le dessine en 3D, à la cote.", "Puis on le fabrique : machine, bois, métal, résine, et l’électronique intégrée quand il le faut.", "La pièce rejoint son lieu : un musée, une installation, la scène d’un artiste. Elle est unique, faite pour lui."], "mots": ["un objet imaginé pour vous", "la machine", "bois", "métal", "résine", "une pièce unique", "musée", "installation"]}, "sv-cdm": {"titres": ["LE CORPS", "LES CAPTEURS", "LA MUSIQUE"], "etapes": ["Tout part du corps en mouvement : une danse, un geste, un appui.", "Des capteurs aux poignets et aux chevilles traduisent le mouvement en données.", "Ces données écrivent la musique : le mouvement déclenche les pas d’une séquence et module le son. TRIPODE AS-SIMT en est un outil."], "mots": ["le corps", "capteurs → données", "une séquence jouée par le mouvement"]}, "sv-robot": {"titres": ["UN ACTIONNEUR", "TOUTE LA ROBOTIQUE", "EN SCÈNE"], "etapes": ["Un bras robotique frappe une cloche : un geste mécanique devient un son.", "On travaille avec tout type de robotique : bras, bases roulantes, quadrupèdes, sculptures cinétiques.", "Sur scène, robots, lumière et son jouent la même partition. CAVE // FOUR ROBOTS pousse cette idée jusqu’au bout."], "mots": ["bras robotique", "cloche", "bras", "base roulante", "quadrupède", "sculpture cinétique", "robots, lumière, son : une seule partition", "le public"]}, "sv-audio": {"titres": ["UN PETIT OBJET", "IL SONNE", "UNE FAMILLE D’OBJETS"], "etapes": ["Un petit objet tient dans la main : une coque, un écran, quelques boutons, un glyphe gravé.", "On le touche, il sonne : chaque objet a sa voix, son geste, son caractère.", "Ensemble, ils forment une famille d’objets sonores qu’on joue sur scène ou qu’on pose dans une installation. TEAMMATE.POTO en est né."], "mots": ["un petit objet sonore", "notre esthétique", "on le touche", "il sonne", "une famille d’objets"]}, "sv-capteurs": {"titres": ["LE CORPS ÉQUIPÉ", "LES SIGNAUX", "LA SCÈNE RÉPOND"], "etapes": ["On conçoit des capteurs faits pour le corps : légers, portés aux poignets et aux chevilles d’un danseur ou sur l’instrument d’un musicien.", "Ils envoient le mouvement sans fil, en continu, vers un récepteur : le geste devient données.", "Et la scène répond : la lumière suit la main du danseur, le son suit le musicien, la scénographie bouge avec eux."], "mots": ["capteur", "un danseur équipé", "récepteur sans fil", "le mouvement, en données", "danseur", "musicien", "la lumière suit le geste"]}, "sv-objets": {"titres": ["LE PROTOTYPE", "L’INTÉGRATION", "EN SCÈNE"], "etapes": ["Sur l’établi, un premier prototype : un boîtier, une carte, une lumière qui clignote.", "On l’intègre dans un dispositif : plusieurs modules reliés à un contrôleur qui les fait dialoguer.", "Puis tout part en scène, monté, éclairé, prêt pour le public. TEAMMATE.POTO est passé par là."], "mots": ["le prototype, sur l’établi", "contrôleur", "en scène"]}, "sv-3d": {"titres": ["LA FORME", "L’USAGE", "LE PROTOTYPE"], "etapes": ["On cherche la forme : des volumes qu’on tourne, qu’on affine, qu’on compare.", "On la confronte à l’usage : la main, la prise, les points de contact.", "Puis on l’imprime en 3D, couche par couche, pour la tenir en main dès le lendemain."], "mots": ["la forme", "la main, l’usage", "impression 3D, couche par couche"]}, "sv-lumiere": {"titres": ["UN OBJET LUMINEUX", "PILOTÉ EN WI-FI", "LA SCÈNE LUMIÈRE"], "etapes": ["On crée des objets lumineux intelligents : la lumière, et dedans un microcontrôleur qui la pilote.", "Ils se pilotent sans fil, en Wi-Fi, depuis une console ou un ordinateur : chaque lampe répond. On travaille avec différents microcontrôleurs selon le projet.", "Ensemble, ils deviennent une scénographie lumière : une vague traverse la scène, la lumière suit le son ou le geste."], "mots": ["microcontrôleur", "un objet lumineux", "console, Wi-Fi", "chaque lampe répond", "une scène de lumière"]}, "sv-go2": {"titres": ["LE ROBOT", "LA CHORÉGRAPHIE", "À LOUER, SUR MESURE"], "etapes": ["Le Go2 de Unitree : un robot quadrupède agile, qu’on programme pour la scène et l’installation.", "On écrit sa chorégraphie : des points de passage, des postures, un rythme, calés sur la musique.", "On peut le louer pour une scénographie, équipé sur mesure (mégaphone, lumière, capteurs), pour que vous puissiez vous projeter avec lui. Voir CAVE // FOUR ROBOTS et BILLY // STEAM DECK."], "mots": ["Go2 · Unitree", "les points de passage", "à louer, équipé sur mesure", "le public"]}, "sv-repar": {"titres": ["LA REMISE À NEUF", "LE DIAGNOSTIC", "LE RECALIBRAGE", "MODIFIER, AMÉLIORER"], "etapes": ["D’abord, systématiquement, quelle que soit la panne : on remet à neuf les composants qui vieillissent avec le temps, comme les condensateurs électrolytiques gonflés ou desséchés.", "Puis on cherche la panne : à l’oscilloscope, le signal dit ce qui ne va pas (souffle, craquements, saturation), et on répare.", "On recalibre : un signal propre, des oscillateurs accordés note par note, un ampli qui sonne comme au premier jour.", "Et sur les synthés, on peut aller plus loin : les midifier, leur ajouter des fonctions, les adapter à votre façon de jouer."], "mots": ["synthétiseur, ampli, hi-fi", "souffle, craquements, saturation", "condensateurs fatigués", "soudures, potentiomètres", "un signal propre", "accordé", "prise MIDI ajoutée", "une nouvelle fonction", "contrôleur · MIDI"]}, "gear-capteurs": {"titres": ["LE CAPTEUR", "PORTÉ SUR LE CORPS", "ENVOYER", "RECEVOIR : L’ÉCOUTE HAPTIQUE"], "etapes": ["Un petit boîtier imprimé en 3D. Dedans : une carte, un capteur de mouvement (accéléromètre et magnétomètre) et trois moteurs de vibration.", "On le porte au poignet, à la cheville, sur un instrument : il mesure le mouvement sur trois axes, en continu.", "Il envoie ce mouvement sans fil : en Wi-Fi vers l’ordinateur (OSC), vers un synthé ou un logiciel (MIDI), et vers une page web pour le régler depuis un téléphone.", "Et il reçoit : le son ou les données reviennent jusqu’au capteur, et ses trois moteurs les font vibrer. On entend aussi par la peau : c’est l’écoute haptique."], "mots": ["carte", "capteur de mouvement", "moteurs de vibration", "un capteur au poignet", "x · y · z", "ordinateur · Wi-Fi · OSC", "synthé · MIDI", "téléphone · page web", "le son revient", "on l’entend par la peau"]}, "gear-pcb": {"titres": ["LA CARTE", "LES COMPOSANTS", "LA PETITE SÉRIE"], "etapes": ["On part de votre besoin et on dessine la carte : une puce au centre, des pistes qui en partent en faisceaux jusqu’aux bords et au connecteur.", "Puis on pose les composants : condensateurs, connecteurs, alimentation, capteurs.", "On fabrique en petite série, et la carte prend place dans son objet, prête à fonctionner."], "mots": ["les pistes en cuivre", "la puce", "connecteur", "composants", "une petite série", "dans son objet"]}, "ev-micros": {"titres": ["ÉLECTRET", "RUBAN FAIT MAISON", "ONDES ÉLECTROMAGNÉTIQUES", "ULTRASONS"], "etapes": ["Les micros à électret : des capsules très variées et très communes. Une voix fait vibrer leur membrane, et le signal part dans le câble.", "Un micro à ruban fait maison : une feuille d’aluminium plissée, tendue entre deux aimants. Elle vibre avec l’air, et ce mouvement devient courant.", "Un micro sensible aux ondes électromagnétiques : une bobine de cuivre près d’un téléphone ou d’un chargeur, et on entend l’invisible.", "Un micro capable d’entendre les ultrasons : le cri d’une chauve-souris, au-dessus de 20 kHz, ramené dans ce que l’oreille entend. Et d’autres designs encore, pour d’autres capsules."], "mots": ["des capsules à électret", "très variées, très communes", "ruban d’aluminium plissé", "fait maison", "bobine de cuivre", "téléphone", "capsule ultrasons", "plus de 20 kHz", "inaudible", "ramené dans l’audible"]}},
    panneau: 'comment ça marche', legende: 'légende', suivant: 'suite', precedent: 'précédent',
    sync: 'synchronisés', desync: 'désynchronisés', public: 'public', toi: 'toi', memoire: 'mémoire · 48 fragments', reponse: 'teammate',
    decisions: ['imiter', 'contraster', 'densifier', 's’éclaircir', 'se taire'],
    traits: ['hauteur', 'énergie', 'timbre', 'texture'],
    timbre: 'timbre', hauteur: 'hauteur', zone: 'zone de sécurité', zoneGrains: 'zone de répartition', toutEspace: 'les grains dans tout l’espace', panoramique: 'le son suit le robot', titresSys: ['LIDAR', 'CARTE DU SON', 'MODE 1 · UNE ZONE', 'MODE 1 · TOUT L’ESPACE', 'MODE 2 · SONS PLACÉS', 'SPATIALISATION', 'PILOTAGE'],
    titresSeul: ['CAPTURER', 'MODE TRANS', 'PERU'],
    sources: ['micro', 'caméra', 'écran'], grainMot: 'un grain = un bout de son + son image', voixMot: 'on chante', repond: 'le grain le plus proche répond', imageGrain: 'son image', gravite: 'gravité', choc: 'chaque choc joue le grain',
    systema: {
      etapes: ['Sans robot, systema8os.xt est déjà un instrument : il capture le micro, la caméra ou une fenêtre de l’écran, et découpe tout en grains. Chaque grain garde son bout de son et son image.',
        'Mode TRANS : on chante ou on joue dans le micro, le logiciel cherche le grain qui lui ressemble le plus (hauteur, timbre) et le fait jouer, avec son image. Les grains partent aussi en notes MIDI.',
        'PERU : les grains choisis deviennent des balles dans une cage en 3D. Un séquenceur règle la gravité, de l’apesanteur au très lourd ; chaque choc joue le grain, plus ou moins fort, placé dans l’espace.',
        'Avec les robots Unitree Go2, il va plus loin : le LiDAR du robot scanne le lieu, systema8os.xt dessine la carte de la salle et de ses obstacles.',
        'Les sons sont découpés en grains, analysés et rangés par timbre et par hauteur : c’est la carte du son.',
        'Premier mode : on trace une zone avec des balises, et les grains s’y dispersent. Le robot qui la traverse fait jouer ceux qu’il frôle.',
        'Ou bien les grains se répartissent dans tout l’espace scanné, accrochés au relief que voit le LiDAR : toute la salle devient instrument.',
        'Second mode : on pose des sons précis à des endroits choisis, une voix ici, une cloche là. Quand le robot y passe, ce son-là se déclenche.',
        'Le robot marche : le son suit sa position, en stéréo ou en binaural. Il devient une source sonore qui marche.',
        'On le pilote à la manette, au clavier ou à la voix, ou il erre seul dans une zone de sécurité ; sa position part en OSC vers TEAMMATE.'],
      legende: [['css', 'LiDAR, zone, trajet'], ['or', 'son qui joue'], ['encre', 'robot Go2'], ['gris', 'grains de son']],
    },

    connecter: 'connecter', modeJeu: 'lancé en mode Jeu, comme un jeu', ponts: ['contrôle', 'LiDAR', 'vidéo'], surBilly: 'sur le dos de Billy', unite: 'unité',
    ordres: 'les ordres partent vers le robot', retours: 'la vidéo, le scan et la batterie reviennent',
    postures: ['debout', 'couché', 'équilibre', 'relever'], sticks: ['stick G avance · stick D tourne', 'stick G : de côté'],
    camera: 'caméra', scan: 'scan 3D', scanGlyphes: 'dans les yeux de Billy : chaque surface touchée devient un glyphe', visite: 'visite : on prend de la hauteur',
    norns48: 'TEAMMATE.POTO · 48 grains par unité', resonne: 'A : l’unité joue le grain, la matière résonne', horloge: 'horloge commune', relais: 'le Pi relaie en OSC',
    titresBi: ['LE DECK · LE PI · BILLY', 'CONDUIRE', 'VOIR', 'PADS · LES SONS DANS LE SCAN', 'SÉQUENCES'],
    billy: {
      etapes: ['Billy est un robot Unitree Go2. Sur son dos, un Raspberry Pi sert la page de pilotage : le Steam Deck n’a besoin que d’un navigateur. On lance BILLY depuis la bibliothèque Steam, en mode Jeu, comme un jeu.',
        'Le Deck devient télécommande : stick gauche pour avancer et aller de côté, stick droit pour tourner. A debout, B couché, X équilibre, Y relever, RT stop. Les ordres partent en Wi-Fi vers le Pi, qui les transmet au robot.',
        'Billy renvoie ce qu’il voit. On est dans ses yeux : à mesure qu’il avance dans les couloirs, chaque surface que touche son LiDAR s’écrit en glyphe As-Simt, et le monde se génère autour de lui. RB échange avec la caméra ; LT lance la visite : on quitte ses yeux et on prend de la hauteur pour voir tout le lieu.',
        'PADS : le Deck devient une MPC en 3D. Les grains de son de TEAMMATE.POTO (48 par unité) s’accrochent aux surfaces que Billy a vues, un mur, une table : une couleur pour TEAMMATE.POTO unité 1, unité 2, unité 3. Un doigt dessus, ou A : l’unité joue le grain, et la matière autour résonne.',
        'SÉQUENCES : sur le plan vu de dessus, on relie les sons en quatre séquences de 16 pas. Ce n’est pas le Deck qui joue : chaque unité TEAMMATE.POTO reçoit les séquences par le Pi et joue ses propres pas sur une horloge commune. Toutes les unités tombent ensemble.'],
      legende: [['css', 'Deck, liaisons, scan'], ['or', 'son qui joue, bouton'], ['encre', 'Billy (Go2)'], ['#ff1fce', 'TEAMMATE.POTO unité 1'], ['#b6ff00', 'unité 2'], ['#a24dff', 'unité 3']],
    },

    gene: 'gène', nutriments: ['glucose', 'oxygène'], voies: ['glycolyse', 'respiration', 'croissance', 'fermentation'], produits: ['CO₂', 'lactate', 'énergie'],
    avatarNom: 'AVATAR', sonEntre: 'le son entre', fluxSon: 'les flux sonnent', balance: 'balance des flux',
    titresAv: ['SÉQUENÇAGE', 'LE DOUBLE NUMÉRIQUE', 'LE SON NOURRIT LE MODÈLE', 'LES FLUX', 'UN DUO AVEC SOI-MÊME'],
    avatar: {
      etapes: ['On séquence les gènes que l’artiste exprime : la matière première, c’est son propre corps.',
        'À partir de ces gènes, Damien Eveillard construit un modèle de son métabolisme à l’échelle du génome : des réactions reliées entre elles, des nutriments jusqu’aux produits. C’est l’avatar, un double numérique.',
        'Le son devient une nourriture : ce que NSDOS joue règle ce que la cellule absorbe, comme du glucose ou de l’oxygène.',
        'Le modèle calcule comment la matière et l’énergie circulent dans les voies (analyse de balance des flux, FBA) : certaines s’allument, d’autres s’éteignent.',
        'Les flux deviennent du son : l’avatar répond en temps réel à ce que joue l’artiste. Sur scène, c’est un duo avec soi-même.'],
      legende: [['css', 'gènes, voies actives'], ['or', 'flux, son de l’avatar'], ['encre', 'son de NSDOS'], ['gris', 'voie au repos']],
    },
    capteurs: ['gyroscope', 'accéléromètre', 'magnétomètre'], noteRevient: 'une note d’Orca revient → vibration',
    tripode: {
      etapes: ['Porté sur le corps, le tripode mesure le geste (gyroscope, accéléromètre, magnétomètre) pour écrire du code avec le mouvement.',
        'En UDP, il écrit dans la grille d’Orca, l’original comme ORCA//GLYPH : le geste pose des glyphes et lance des opérateurs.',
        'En OSC, il envoie ses valeurs vers le Norns : TEAMMATE les écoute et joue les notes générées par les capteurs.',
        'Retour haptique : trois moteurs vibrent selon des codes précis, ou jouent une note d’Orca. À plusieurs tripodes, ces vibrations deviennent une communication non verbale.'],
      legende: [['css', 'données envoyées'], ['or', 'note reçue, vibration'], ['encre', 'opérateur Orca'], ['gris', 'valeur']],
    },
    sens: { C: 'battement', D: 'pluie' }, traces: 'traces anciennes', alphabetTitre: 'L’ALPHABET DES OPÉRATEURS', fait: 'fait',
    parole: ['hello agent', 'i’m listening…', 'too repetitive!', 'nice agent!', 'my turn!'],
    humeur: 'humeur', humeurs: ['curieuse', 'stressée', 'joueuse'],
    metabo: 'avatar métabolique', etats: ['STABLE', 'MONOTONE'], voiesNotes: '7 voies = 7 notes',
    voies: ['growth', 'glycolysis', 'respiration', 'fermentation', 'byproduct', 'co2', 'lactate'],
    compos: [['musique', [['E0C8', 'caverne'], ['E11C', 'vibration'], ['E079', 'torse']]], ['heureux', [['E0B2', 'lumière'], ['E148', 'ouvrir'], ['E079', 'torse']]], ['voyage', [['E0E3', 'chemin'], ['E099', 'vent'], ['E08D', 'pied']]], ['futur', [['E0EE', 'graine'], ['E177', 'loin'], ['E0B2', 'lumière']]]],
    etage: 'étage',
    orca: {
      etapes: ["Orca en volume : chaque étage est une grille Orca, et tous les étages sont empilés. Chaque caractère est un glyphe As-Simt extrudé, d’autant plus haut qu’il compte. Ici, le patch de démonstration joue sur quatre étages.", "Chaque opérateur majuscule est dessiné avec le signe de sa définition poétique : T, le séquenceur, est « tisser » ; C, « battement » ; D, « pluie ». Avec NOMS, une étiquette dit ce que fait l’opérateur sous le pigeon.", "On code exactement comme dans Orca, au clavier. Le curseur est un pigeon voyageur d’or. Ici on tape 1D4, une pluie qui bat tous les quatre pas, et :03C, une note MIDI : le patch joue aussitôt.", "Six opérateurs traversent les étages : ' monte, , descend, ( écoute, ) envoie, \" relaie un bang, - déchire la 3D. Un faisceau relie chaque opérateur à la case qu’il vise dans un autre étage.", "Quand plusieurs étages bangent en même temps, un éclair les relie : il avance en zigzag, se ramifie et cristallise des pixels d’espace, qui s’en vont en pétillant.", "Ctrl+D aplatit tout l’univers en un Orca 2D vu de dessus : la caméra recule, la perspective s’efface, les étages se replient. Encore une fois, et la 3D se redéploie.", "F8 relève le plan comme un pont-levis : chaque colonne de glyphes devient une tour, et on lit le code de face, comme une ville.", "Tab change de vision : normale, nuage de points façon Kinect, tirets, arêtes, et glitch, où la 3D se déchire par morceaux.", "F10 donne une matière à chaque étage (carrés, tirets, points), tirée du damier de chaque glyphe. En 2D, les étages se superposent et restent lisibles ensemble.", "Le menu est éclaté dans l’espace : dix glyphes debout au bord des étages. Un clic sur l’un d’eux l’ouvre à plat, et ses réglages apparaissent, gravés en pixels : sorties MIDI et OSC, vision, caméra…", "F5 : ce qui est joué s’écrit en partition, une partie par canal MIDI, avec au-dessus les glyphes du mode de jeu. On l’exporte en SVG, en MusicXML, en page à envoyer aux musiciens ou en carrousel pour Instagram.", "Le tracking pose un réticule sur chaque bang et dit ce qu’il déclenche, avec des lignes d’un étage à l’autre. Et tout part en MIDI ou en OSC : vers un synthé, SuperCollider ou le Norns.", "L’alphabet : les 26 lettres d’Orca gardent leur fonction, et chacune reçoit un signe As-Simt. Le mot de ce signe est une image choisie pour ce que fait l’opérateur."],
      legende: [["or", "le pigeon d’or : le curseur"], ["css", "touche ou commande du logiciel"]],
    },


    cave: {
      etapes: ['Une grotte que des civilisations ont habitée de leurs voix et de leurs rites, puis laissée. On la réinvestit : le public se tient au centre.',
        'Quatre robots-chiens Unitree, un mégaphone sur le dos, tournent autour de lui : la technologie d’aujourd’hui dans un lieu premier.',
        'Synchronisés : ils jouent ensemble, et la grotte répond. La forme de la roche façonne le son.',
        'Désynchronisés : chacun son tempo, le son se disperse et la paroi le renvoie. L’espace devient instrument.'],
      legende: [['encre', 'robot + mégaphone'], ['css', 'onde sonore'], ['gris', 'public'], ['ocre', 'traces anciennes']],
    },
    langue: {
      etapes: ['Une langue sans mots abstraits : on ne dit que des images concrètes.',
        'Chaque image a son signe : un damier 8 × 8 de l’alphabet As-Simt.',
        'Trois images au plus se posent côte à côte…',
        '…et forment un concept. On le lit comme une petite scène.'],
      legende: [['css', 'signe qui s’écrit'], ['encre', 'signe posé']],
    },
    teammate: {
      etapes: ['Une créature vit dans le Norns : un visage, une humeur, des opinions, un niveau qui monte. Un tamagotchi pour improvisateurs.',
        'Tu joues : elle écoute et range ta phrase en 48 fragments (hauteur, énergie, timbre, texture).',
        'METABO, son avatar métabolique : ton son nourrit une cellule dont les voies sont des notes. Jeu monotone, elle stresse et accélère ; jeu varié, elle se calme.',
        'Tu t’arrêtes : elle décide et répond avec tes fragments, te parle, gagne de l’XP. Une composition électronique à deux, en temps réel.'],
      legende: [['encre', 'ta phrase'], ['css', 'mémoire · réponse'], ['or', 'stress de la cellule'], ['sombre', 'case vide']],
    },

  },
  en: {
    orcaTitres: ["THE FLOORS", "SIGNS THAT MEAN SOMETHING", "CODING WITH THE KEYBOARD", "FROM FLOOR TO FLOOR", "LINKS BETWEEN FLOORS", "2D ⇄ 3D MODE", "PLAN / BUILDINGS", "THE VISIONS", "ONE MATERIAL PER FLOOR", "THE GLYPH MENU", "THE SCORE", "TRACKING, MIDI, OSC"], orcaTouches: ["demo · Ctrl+Shift+D", "NAMES", "keyboard", "' , ( ) \" -", "F9", "Ctrl+D", "F8", "Tab", "F10", "click a glyph", "F5 · Ctrl+F5 REC", "TRACKING"], chargement: "loading\u2026",
    svLegende: [["css", "what we design"], ["or", "what acts, the signal"], ["encre", "the object, the body"], ["gris", "the context"]],
    sv: {"sv-data": {"titres": ["THE DATA", "VISUALS OR MUSIC", "FOR WHOM, WHERE"], "etapes": ["Sensors, stations, feeds: data comes from everywhere and converges.", "We turn it into an artistic form: visuals that build themselves, or music that plays its variations.", "That form finds its place: in a museum, at a concert, in an installation or an interactive system where the audience makes it react."], "mots": ["sensors, measurements", "the data", "visuals", "music", "museum", "concert", "interactive installation"]}, "sv-conseil": {"titres": ["THE IDEA", "THREE WORLDS", "THE ROADMAP"], "etapes": ["A project often starts blurry: a wish, a place, an audience, a deadline. We listen and lay out the constraints.", "We look at it with three pairs of eyes, art, design and engineering, until we find what holds all three.", "Then we draw the road: idea, prototype, test, stage. Each step has its deliverable, and we know where we are going."], "mots": ["an idea, constraints", "budget", "audience", "deadline", "venue", "art", "design", "engineering", "the project", "idea", "prototype", "test", "stage"]}, "sv-da": {"titres": ["REFERENCES", "CHOICES", "THE WORLD"], "etapes": ["We gather references: materials, patterns, signs, images. They answer each other, and a direction appears.", "We choose: a palette, a typeface, a colour of sound. Few elements, but held everywhere.", "Together they form a coherent world, found in the image, the object, the stage and the sound."], "mots": ["references", "colours", "typeface", "sound", "a coherent world"]}, "sv-digital": {"titres": ["THE SPACE", "LIGHT AND SOUND", "THE AUDIENCE ACTS"], "etapes": ["It all starts with a place and those who cross it: its walls, its volumes, its visitors.", "We fill it with projected images and spatialised sound: the room becomes a work.", "And the work listens: every presence, every movement of the audience changes it in real time."], "mots": ["a space, visitors", "projection and sound", "every presence changes the work"]}, "sv-physique": {"titres": ["THE IDEA", "MAKING", "ITS PLACE"], "etapes": ["We imagine with you an object that does not exist yet, and draw it in 3D, to size.", "Then we make it: machine, wood, metal, resin, and built-in electronics when needed.", "The piece joins its place: a museum, an installation, an artist’s stage. It is unique, made for it."], "mots": ["an object imagined for you", "the machine", "wood", "metal", "resin", "a one-off piece", "museum", "installation"]}, "sv-cdm": {"titres": ["THE BODY", "THE SENSORS", "THE MUSIC"], "etapes": ["It all starts with the moving body: a dance, a gesture, a step.", "Sensors on wrists and ankles translate movement into data.", "That data writes the music: movement triggers the steps of a sequence and shapes the sound. TRIPODE AS-SIMT is one such tool."], "mots": ["the body", "sensors → data", "a sequence played by movement"]}, "sv-robot": {"titres": ["ONE ACTUATOR", "ALL ROBOTICS", "ON STAGE"], "etapes": ["A robotic arm strikes a bell: a mechanical gesture becomes a sound.", "We work with all kinds of robotics: arms, rolling bases, quadrupeds, kinetic sculptures.", "On stage, robots, light and sound play the same score. CAVE // FOUR ROBOTS takes this idea all the way."], "mots": ["robotic arm", "bell", "arm", "rolling base", "quadruped", "kinetic sculpture", "robots, light, sound: one score", "the audience"]}, "sv-audio": {"titres": ["A SMALL OBJECT", "IT SOUNDS", "A FAMILY OF OBJECTS"], "etapes": ["A small object fits in the hand: a shell, a screen, a few knobs, an engraved glyph.", "You touch it, it sounds: each object has its voice, its gesture, its character.", "Together they form a family of sound objects, played on stage or set in an installation. TEAMMATE.POTO was born this way."], "mots": ["a small sound object", "our style", "you touch it", "it sounds", "a family of objects"]}, "sv-capteurs": {"titres": ["THE EQUIPPED BODY", "THE SIGNALS", "THE STAGE ANSWERS"], "etapes": ["We design sensors made for the body: light, worn on a dancer’s wrists and ankles or on a musician’s instrument.", "They send movement wirelessly and continuously to a receiver: gesture becomes data.", "And the stage answers: light follows the dancer’s hand, sound follows the musician, the set moves with them."], "mots": ["sensor", "an equipped dancer", "wireless receiver", "movement, as data", "dancer", "musician", "light follows the gesture"]}, "sv-objets": {"titres": ["THE PROTOTYPE", "INTEGRATION", "ON STAGE"], "etapes": ["On the workbench, a first prototype: a case, a board, a blinking light.", "We integrate it into a device: several modules linked to a controller that makes them talk.", "Then everything goes on stage, rigged, lit, ready for the audience. TEAMMATE.POTO went this way."], "mots": ["the prototype, on the bench", "controller", "on stage"]}, "sv-3d": {"titres": ["THE FORM", "THE USE", "THE PROTOTYPE"], "etapes": ["We look for the form: volumes we turn, refine, compare.", "We test it against use: the hand, the grip, the contact points.", "Then we 3D-print it, layer by layer, to hold it in hand the next day."], "mots": ["the form", "the hand, the use", "3D printing, layer by layer"]}, "sv-lumiere": {"titres": ["A LIGHT OBJECT", "CONTROLLED OVER WI-FI", "A STAGE OF LIGHT"], "etapes": ["We create smart light objects: the light, and inside, a microcontroller that drives it.", "They are controlled wirelessly over Wi-Fi from a desk or a computer: each lamp answers. We work with different microcontrollers depending on the project.", "Together they become a lighting design: a wave crosses the stage, light follows sound or gesture."], "mots": ["microcontroller", "a light object", "desk, Wi-Fi", "each lamp answers", "a stage of light"]}, "sv-go2": {"titres": ["THE ROBOT", "THE CHOREOGRAPHY", "FOR HIRE, CUSTOM-BUILT"], "etapes": ["Unitree’s Go2: an agile quadruped robot we program for stage and installation.", "We write its choreography: waypoints, postures, a rhythm, locked to the music.", "It can be hired for a stage design, custom-equipped (megaphone, light, sensors), so you can picture it in your own project. See CAVE // FOUR ROBOTS and BILLY // STEAM DECK."], "mots": ["Go2 · Unitree", "the waypoints", "for hire, custom-equipped", "the audience"]}, "sv-repar": {"titres": ["THE OVERHAUL", "DIAGNOSIS", "RECALIBRATION", "MODIFY, UPGRADE"], "etapes": ["First, every time, whatever the fault: we renew the parts that age over time, such as swollen or dried-out electrolytic capacitors.", "Then we look for the fault: on the oscilloscope, the signal tells what is wrong (hiss, crackle, clipping), and we repair it.", "We recalibrate: a clean signal, oscillators tuned note by note, an amp that sounds like the first day.", "And on synths we can go further: add MIDI, add functions, adapt them to the way you play."], "mots": ["synth, amp, hi-fi", "hiss, crackle, clipping", "worn capacitors", "solder joints, pots", "a clean signal", "tuned", "MIDI port added", "a new function", "controller · MIDI"]}, "gear-capteurs": {"titres": ["THE SENSOR", "WORN ON THE BODY", "SENDING", "RECEIVING: HAPTIC LISTENING"], "etapes": ["A small 3D-printed case. Inside: a board, a motion sensor (accelerometer and magnetometer) and three vibration motors.", "You wear it on the wrist, the ankle, on an instrument: it measures movement on three axes, continuously.", "It sends that movement wirelessly: over Wi-Fi to a computer (OSC), to a synth or software (MIDI), and to a web page to set it up from a phone.", "And it receives: sound or data come back to the sensor, and its three motors turn them into vibration. You also hear through the skin: that is haptic listening."], "mots": ["board", "motion sensor", "vibration motors", "a sensor on the wrist", "x · y · z", "computer · Wi-Fi · OSC", "synth · MIDI", "phone · web page", "the sound comes back", "you hear it through the skin"]}, "gear-pcb": {"titres": ["THE BOARD", "THE COMPONENTS", "THE SMALL RUN"], "etapes": ["We start from your need and draw the board: a chip in the middle, traces running out in bundles to the edges and the connector.", "Then we place the components: capacitors, connectors, power, sensors.", "We make a small run, and the board takes its place in its object, ready to work."], "mots": ["copper traces", "the chip", "connector", "components", "a small run", "in its object"]}, "ev-micros": {"titres": ["ELECTRET", "HOMEMADE RIBBON", "ELECTROMAGNETIC WAVES", "ULTRASOUND"], "etapes": ["Electret mics: very varied, very common capsules. A voice makes their membrane vibrate, and the signal goes down the cable.", "A homemade ribbon mic: a pleated aluminium foil stretched between two magnets. It moves with the air, and that movement becomes current.", "A mic sensitive to electromagnetic waves: a copper coil near a phone or a charger, and you hear the invisible.", "A mic that hears ultrasound: a bat’s call, above 20 kHz, brought down into what the ear can hear. And more designs, for other capsules."], "mots": ["electret capsules", "very varied, very common", "pleated aluminium ribbon", "homemade", "copper coil", "phone", "ultrasonic capsule", "above 20 kHz", "inaudible", "brought into hearing range"]}},
    panneau: 'how it works', legende: 'key', suivant: 'next', precedent: 'previous',
    sync: 'in sync', desync: 'out of sync', public: 'audience', toi: 'you', memoire: 'memory · 48 fragments', reponse: 'teammate',
    decisions: ['imitate', 'contrast', 'densify', 'thin out', 'stay silent'],
    traits: ['pitch', 'energy', 'timbre', 'texture'],
    timbre: 'timbre', hauteur: 'pitch', zone: 'safety zone', zoneGrains: 'scatter zone', toutEspace: 'grains across the whole space', panoramique: 'the sound follows the robot', titresSys: ['LIDAR', 'SOUND MAP', 'MODE 1 · A ZONE', 'MODE 1 · WHOLE SPACE', 'MODE 2 · PLACED SOUNDS', 'SPATIALISATION', 'STEERING'],
    titresSeul: ['CAPTURE', 'TRANS MODE', 'PERU'],
    sources: ['mic', 'camera', 'screen'], grainMot: 'a grain = a bit of sound + its image', voixMot: 'you sing', repond: 'the closest grain answers', imageGrain: 'its image', gravite: 'gravity', choc: 'each hit plays the grain',
    systema: {
      etapes: ['Without a robot, systema8os.xt is already an instrument: it captures the mic, the camera or a screen window, and cuts everything into grains. Each grain keeps its bit of sound and its image.',
        'TRANS mode: sing or play into the mic, and the software finds the grain that sounds most alike (pitch, timbre) and plays it, with its image. Grains also go out as MIDI notes.',
        'PERU: chosen grains become balls in a 3D cage. A sequencer sets the gravity, from weightless to very heavy; each hit plays the grain, louder or softer, placed in space.',
        'With Unitree Go2 robots it goes further: the robot’s LiDAR scans the venue, and systema8os.xt draws the map of the room and its obstacles.',
        'Sounds are cut into grains, analysed and sorted by timbre and pitch: this is the sound map.',
        'First mode: you draw a zone with beacons, and the grains scatter inside it. The robot crossing it plays the ones it brushes past.',
        'Or the grains spread across the whole scanned space, attached to the relief the LiDAR sees: the whole room becomes an instrument.',
        'Second mode: you place specific sounds at chosen spots, a voice here, a bell there. When the robot passes, that sound is triggered.',
        'The robot walks: the sound follows its position, in stereo or binaural. It becomes a walking sound source.',
        'Steer it with a gamepad, the keyboard or your voice, or let it wander inside a safety zone; its position goes out as OSC to TEAMMATE.'],
      legende: [['css', 'LiDAR, zone, path'], ['or', 'sound playing'], ['encre', 'Go2 robot'], ['gris', 'sound grains']],
    },

    connecter: 'connect', modeJeu: 'launched in Game mode, like a game', ponts: ['control', 'LiDAR', 'video'], surBilly: 'on Billy’s back', unite: 'unit',
    ordres: 'commands go out to the robot', retours: 'video, scan and battery come back',
    postures: ['stand up', 'lie down', 'balance', 'recover'], sticks: ['left stick forward · right stick turn', 'left stick: sideways'],
    camera: 'camera', scan: '3D scan', scanGlyphes: 'behind Billy’s eyes: every surface it touches becomes a glyph', visite: 'tour: rising above the place',
    norns48: 'TEAMMATE.POTO · 48 grains per unit', resonne: 'A: the unit plays the grain, the matter resonates', horloge: 'shared clock', relais: 'the Pi relays as OSC',
    titresBi: ['THE DECK · THE PI · BILLY', 'DRIVING', 'SEEING', 'PADS · SOUNDS IN THE SCAN', 'SEQUENCES'],
    billy: {
      etapes: ['Billy is a Unitree Go2 robot. On its back, a Raspberry Pi serves the control page: the Steam Deck only needs a browser. BILLY is launched from the Steam library, in Game mode, like a game.',
        'The Deck becomes a remote: left stick to move forward and sideways, right stick to turn. A stand up, B lie down, X balance, Y recover, RT stop. Commands go over Wi-Fi to the Pi, which passes them to the robot.',
        'Billy sends back what it sees. We are behind its eyes: as it moves down the corridors, every surface its LiDAR touches is written as an As-Simt glyph, and the world generates itself around it. RB swaps to the camera; LT starts the tour: we leave its eyes and rise to see the whole place.',
        'PADS: the Deck becomes a 3D MPC. TEAMMATE.POTO’s sound grains (48 per unit) attach to the surfaces Billy has seen, a wall, a table: one colour for TEAMMATE.POTO unit 1, unit 2, unit 3. A finger on one, or A: the unit plays the grain, and the matter around it resonates.',
        'SEQUENCES: on the top-down plan, you link sounds into four sequences of 16 steps. The Deck does not play them: each TEAMMATE.POTO unit receives the sequences through the Pi and plays its own steps on a shared clock. All units land together.'],
      legende: [['css', 'Deck, links, scan'], ['or', 'sound playing, button'], ['encre', 'Billy (Go2)'], ['#ff1fce', 'TEAMMATE.POTO unit 1'], ['#b6ff00', 'unit 2'], ['#a24dff', 'unit 3']],
    },

    gene: 'gene', nutriments: ['glucose', 'oxygen'], voies: ['glycolysis', 'respiration', 'growth', 'fermentation'], produits: ['CO₂', 'lactate', 'energy'],
    avatarNom: 'AVATAR', sonEntre: 'sound comes in', fluxSon: 'fluxes sound', balance: 'flux balance',
    titresAv: ['SEQUENCING', 'THE DIGITAL DOUBLE', 'SOUND FEEDS THE MODEL', 'THE FLUXES', 'A DUET WITH ONESELF'],
    avatar: {
      etapes: ['The genes the artist expresses are sequenced: the raw material is his own body.',
        'From these genes, Damien Eveillard builds a genome-scale model of his metabolism: reactions linked together, from nutrients to products. This is the avatar, a digital double.',
        'Sound becomes food: what NSDOS plays sets what the cell takes in, such as glucose or oxygen.',
        'The model computes how matter and energy flow through the pathways (flux balance analysis, FBA): some light up, others go quiet.',
        'The fluxes become sound: the avatar answers what the artist plays in real time. On stage, it is a duet with oneself.'],
      legende: [['css', 'genes, active pathways'], ['or', 'flux, avatar’s sound'], ['encre', 'NSDOS’s sound'], ['gris', 'resting pathway']],
    },
    capteurs: ['gyroscope', 'accelerometer', 'magnetometer'], noteRevient: 'an Orca note comes back → vibration',
    tripode: {
      etapes: ['Worn on the body, the tripod measures the gesture (gyroscope, accelerometer, magnetometer) to write code with movement.',
        'Over UDP, it writes into the Orca grid, the original as well as ORCA//GLYPH: the gesture places glyphs and triggers operators.',
        'Over OSC, it sends its values to the Norns: TEAMMATE listens and plays the notes generated by the sensors.',
        'Haptic feedback: three motors vibrate following precise codes, or play an Orca note. With several tripods, these vibrations become non-verbal communication.'],
      legende: [['css', 'data sent'], ['or', 'note received, vibration'], ['encre', 'Orca operator'], ['gris', 'value']],
    },
    sens: { C: 'beat', D: 'rain' }, traces: 'ancient traces', alphabetTitre: 'THE OPERATOR ALPHABET', fait: 'does',
    parole: ['hello agent', 'i’m listening…', 'too repetitive!', 'nice agent!', 'my turn!'],
    humeur: 'mood', humeurs: ['curious', 'stressed', 'playful'],
    metabo: 'metabolic avatar', etats: ['STABLE', 'MONOTONE'], voiesNotes: '7 pathways = 7 notes',
    voies: ['growth', 'glycolysis', 'respiration', 'fermentation', 'byproduct', 'co2', 'lactate'],
    compos: [['music', [['E0C8', 'cave'], ['E11C', 'vibration'], ['E079', 'chest']]], ['happy', [['E0B2', 'light'], ['E148', 'open'], ['E079', 'chest']]], ['journey', [['E0E3', 'path'], ['E099', 'wind'], ['E08D', 'foot']]], ['future', [['E0EE', 'seed'], ['E177', 'far'], ['E0B2', 'light']]]],
    etage: 'floor',
    orca: {
      etapes: ["Orca in volume: each floor is an Orca grid, and all floors are stacked. Each character is an extruded As-Simt glyph, taller the more it counts. Here the demo patch plays on four floors.", "Each uppercase operator is drawn with the sign of its poetic definition: T, the sequencer, is “weave”; C, “heartbeat”; D, “rain”. With NAMES, a label tells what the operator under the pigeon does.", "You code exactly as in Orca, with the keyboard. The cursor is a golden homing pigeon. Here we type 1D4, a rain that beats every four steps, and :03C, a MIDI note: the patch plays at once.", "Six operators cross floors: ' goes up, , goes down, ( listens, ) sends, \" relays a bang, - tears the 3D. A beam links each operator to the cell it targets on another floor.", "When several floors bang at once, a lightning bolt links them: it zigzags, branches and crystallises pixels of space, which fizz away.", "Ctrl+D flattens the whole universe into a top-down 2D Orca: the camera pulls back, perspective fades, floors fold in. Once more, and the 3D unfolds again.", "F8 raises the plan like a drawbridge: each column of glyphs becomes a tower, and you read the code face-on, like a city.", "Tab switches vision: normal, Kinect-style point cloud, dashes, edges, and glitch, where the 3D tears apart in pieces.", "F10 gives each floor a material (squares, dashes, dots), taken from each glyph’s checkerboard. In 2D, floors overlap and stay readable together.", "The menu is scattered in space: ten glyphs standing at the edge of the floors. A click on one lays it flat, and its settings appear, engraved in pixels: MIDI and OSC outputs, vision, camera…", "F5: what is played is written as a score, one part per MIDI channel, with the glyphs of the playing mode above. Export as SVG, MusicXML, a page for musicians or an Instagram carousel.", "Tracking locks a reticle on every bang and tells what it triggers, with lines from floor to floor. And everything goes out as MIDI or OSC: to a synth, SuperCollider or the Norns.", "The alphabet: Orca’s 26 letters keep their function, and each gets an As-Simt sign. The word of that sign is an image chosen for what the operator does."],
      legende: [["or", "the golden pigeon: the cursor"], ["css", "key or command of the software"]],
    },


    cave: {
      etapes: ['A cave that civilisations once filled with their voices and rites, then left. We take it back: the audience stands in the middle.',
        'Four Unitree robot dogs, each carrying a megaphone, move around them: today’s technology in a primal place.',
        'In sync: they play together, and the cave answers. The shape of the rock shapes the sound.',
        'Out of sync: each its own tempo, the sound scatters and the wall sends it back. The space becomes an instrument.'],
      legende: [['encre', 'robot + megaphone'], ['css', 'sound wave'], ['gris', 'audience'], ['ocre', 'ancient traces']],
    },
    langue: {
      etapes: ['A language with no abstract words: you only say concrete images.',
        'Each image has its sign: an 8 × 8 grid from the As-Simt alphabet.',
        'Up to three images sit side by side…',
        '…and make a concept. You read it like a small scene.'],
      legende: [['css', 'sign being written'], ['encre', 'sign in place']],
    },
    teammate: {
      etapes: ['A creature lives in the Norns: a face, a mood, opinions, a level that rises. A tamagotchi for improvisers.',
        'You play: it listens and stores your phrase as 48 fragments (pitch, energy, timbre, texture).',
        'METABO, its metabolic avatar: your sound feeds a cell whose pathways are notes. Play monotonously and it stresses and speeds up; play varied and it calms down.',
        'You stop: it decides and answers with your fragments, talks to you, gains XP. Electronic composition for two, in real time.'],
      legende: [['encre', 'your phrase'], ['css', 'memory · answer'], ['or', 'cell stress'], ['sombre', 'empty slot']],
    },

  },
};

const GRIS = '#8a8780'; const SOMBRE = '#2c2b29'; const ENCRE = '#f2f0ea'; const OR = '#ffb545'; const OCRE = '#b8693f';

function bits (ctx, rows, x, y, px, couleur, part = 1, graine = 0) {
  if (!rows) return;
  ctx.fillStyle = couleur;
  let k = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (rows[r][c] !== '#') continue;
    k++;
    // apparition pixel par pixel, dans un ordre pseudo-aléatoire stable
    if (part < 1 && ((k * 37 + graine * 11) % 100) / 100 > part) continue;
    ctx.fillRect(x + c * px, y + r * px, px, px);
  }
}

function points (ctx, w, h, pas) {
  ctx.fillStyle = '#1c1b19';
  for (let y = pas / 2; y < h; y += pas) for (let x = pas / 2; x < w; x += pas) ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
}

function texte (ctx, s, x, y, couleur, taille = 11, align = 'left', style = '') {
  ctx.fillStyle = couleur; ctx.font = `${style}${taille}px 'IBM Plex Mono', ui-monospace, monospace`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}

// coupe un texte en lignes qui tiennent dans la largeur donnée
function couper (ctx, s, larg) {
  const mots = s.split(' '); const lignes = []; let l = '';
  for (const m of mots) { const essai = l ? l + ' ' + m : m; if (ctx.measureText(essai).width > larg && l) { lignes.push(l); l = m; } else l = essai; }
  if (l) lignes.push(l);
  return lignes;
}

// un cadre d'annotation, comme le tracker du site
function viseur (ctx, x, y, w, h, couleur, alpha = 1) {
  const m = Math.min(8, w / 3, h / 3);
  ctx.strokeStyle = couleur; ctx.globalAlpha = alpha; ctx.lineWidth = 1; ctx.beginPath();
  ctx.moveTo(x, y + m); ctx.lineTo(x, y); ctx.lineTo(x + m, y);
  ctx.moveTo(x + w - m, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + m);
  ctx.moveTo(x + w, y + h - m); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - m, y + h);
  ctx.moveTo(x + m, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - m);
  ctx.stroke(); ctx.globalAlpha = 1;
}

// l'horloge des trois étages d'Orca (C compte, D lâche des bangs)
function avancerOrca (etat) {
  etat.acc += etat.dt;
  while (etat.acc > 0.125) {
    etat.acc -= 0.125; etat.tic++;
    etat.etages.forEach((g, e) => {
      for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) {
        const ch = g[r][c];
        if (ch === 'C') { const vit = parseInt(g[r][c - 1] || '1', 36) || 1; const mod = parseInt(g[r][c + 1] || 'a', 36) || 10; if (g[r + 1]) g[r + 1][c] = (Math.floor(etat.tic / vit) % mod).toString(36); }
        if (ch === 'D') { const vit = parseInt(g[r][c - 1] || '1', 36) || 1; const mod = parseInt(g[r][c + 1] || '8', 36) || 8; const on = etat.tic % (vit * mod) === 0; if (g[r + 1]) g[r + 1][c] = on ? '*' : '.'; if (on) { etat.chaud[e + ',' + (r + 1) + ',' + c] = 1; if (e < 2) etat.liens.push({ e, c, vie: 1 }); } }
      }
    });
  }
  for (const k in etat.chaud) { etat.chaud[k] -= etat.dt * 2.5; if (etat.chaud[k] <= 0) delete etat.chaud[k]; }
  etat.liens = etat.liens.filter((l) => (l.vie -= etat.dt * 0.9) > 0);
}

// l'alphabet des opérateurs : chaque lettre d'Orca a son signe As-Simt et son mot
function alphabet (ctx, w, h, n, css, L) {
  const O = L.etage === 'floor' ? OPS.en : OPS.fr;
  const lettres = Object.keys(O);
  const large = w >= 420; const cols = large ? 7 : 5; const rows = Math.ceil(lettres.length / cols);
  texte(ctx, L.alphabetTitre, 12, 20, css, 12, 'left', '600 ');
  const gy = 34; const gh = h * (large ? 0.6 : 0.56); const cw = (w - 16) / cols; const ch = gh / rows;
  const px = Math.max(1.5, Math.min(cw / 16, ch / 16));
  lettres.forEach((k, i) => {
    const c = i % cols; const r = Math.floor(i / cols); const on = i === n;
    const x = 8 + c * cw; const y = gy + r * ch;
    const gx = x + cw / 2 - px * 4; const gyy = y + 4;
    bits(ctx, TOUS[k], gx, gyy, px, on ? css : i < n ? ENCRE : '#55534e');
    texte(ctx, k, x + cw / 2, gyy + px * 8 + 11, on ? css : GRIS, 10, 'center', '600 ');
    if (large) { ctx.font = "9px 'IBM Plex Mono', monospace"; let m = O[k].mot; while (ctx.measureText(m).width > cw - 4 && m.length > 3) m = m.slice(0, -2) + '…'; texte(ctx, m, x + cw / 2, gyy + px * 8 + 22, on ? ENCRE : '#6f6c66', 9, 'center', 'italic '); }
    if (on) viseur(ctx, x + 2, y, cw - 4, ch - 2, css);
  });
  // le signe en cours, en grand : lettre, mot, ce qu'il fait, et pourquoi ce mot
  const k = lettres[Math.min(n, lettres.length - 1)]; const o = O[k];
  const fy = gy + gh + 14; const big = Math.min(5, (h - fy - 20) / 9);
  ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(8, fy - 6); ctx.lineTo(w - 8, fy - 6); ctx.stroke();
  bits(ctx, TOUS[k], 12, fy + 4, big, css);
  const tx = 12 + big * 8 + 16; const larg = w - tx - 10;
  texte(ctx, k, tx, fy + 18, ENCRE, 18, 'left', '600 ');
  ctx.font = "italic 13px 'IBM Plex Mono', monospace";
  texte(ctx, o.mot, tx + 22, fy + 18, css, 13, 'left', 'italic ');
  texte(ctx, L.fait + ' : ' + o.fait, tx, fy + 38, ENCRE, 12);
  ctx.font = "11px 'IBM Plex Mono', monospace";
  couper(ctx, '« ' + o.lien + ' »', larg).slice(0, 2).forEach((l, j) => texte(ctx, l, tx, fy + 56 + j * 15, GRIS, 11, 'left', 'italic '));
  return { info: L.orca, actif: 4 };
}

// ---------------------------------------------------------------- ORCA//GLYPH : Orca quitte le plan, ses données et ses bangs prennent corps dans l'espace
// ORCA//GLYPH : le vrai logiciel, filmé fonction par fonction ; puis l'alphabet des 26 opérateurs
const ORCA_CLIPS = ['etages', 'signes', 'coder', 'passages', 'liens', 'plat', 'immeubles', 'visions', 'textures', 'menu', 'partition', 'tracking'];
const ORCA_PAS = 14;
function videoOrca (etat, nom) {
  if (!etat.videos) etat.videos = {};
  if (!etat.videos[nom]) {
    const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    const ext = v.canPlayType('video/webm; codecs="vp9"') ? '.webm' : '.mp4';
    v.src = ((typeof window !== 'undefined' && window.__MEDIA_ORCA) || '/orca/') + nom + ext;
    etat.videos[nom] = v;
  }
  return etat.videos[nom];
}
function orca (ctx, w, h, t, etat, css, L) {
  const n = ORCA_CLIPS.length; const fin = n * ORCA_PAS; const ph = t % (fin + 26 * 6);
  if (ph >= fin) { if (etat.vActif != null && etat.videos) { Object.values(etat.videos).forEach((v) => v.pause()); etat.vActif = null; } alphabet(ctx, w, h, Math.floor((ph - fin) / 6), css, L); return { info: L.orca, actif: n }; }
  const actif = Math.floor(ph / ORCA_PAS);
  if (typeof document === 'undefined') return { info: L.orca, actif };
  const v = videoOrca(etat, ORCA_CLIPS[actif]); videoOrca(etat, ORCA_CLIPS[(actif + 1) % n]);
  if (etat.vActif !== actif) { Object.values(etat.videos).forEach((x) => { if (x !== v) x.pause(); }); try { v.currentTime = 0; } catch (e) { /* pas encore chargée */ } v.play().catch(() => {}); etat.vActif = actif; }
  // l'image du logiciel, au format 16:10, sous le titre
  const pad = 12; const haut = 30; const dispo = Math.max(10, h - haut - pad); let dw = w - pad * 2; let dh = dw * 10 / 16; if (dh > dispo) { dh = dispo; dw = dh * 16 / 10; }
  const x = (w - dw) / 2; const y = haut;
  ctx.fillStyle = '#000'; ctx.fillRect(x, y, dw, dh);
  if (v.readyState >= 2) ctx.drawImage(v, x, y, dw, dh); else texte(ctx, L.chargement, x + dw / 2, y + dh / 2, GRIS, 10, 'center');
  ctx.strokeStyle = SOMBRE; ctx.strokeRect(x + 0.5, y + 0.5, dw - 1, dh - 1);
  texte(ctx, L.orcaTitres[actif], pad, 20, css, 11, 'left', '600 ');
  const touche = L.orcaTouches[actif];
  if (touche) { ctx.font = "600 10px 'IBM Plex Mono', monospace"; const tw = ctx.measureText(touche).width + 14; ctx.fillStyle = '#000'; ctx.fillRect(x + dw - tw - 8, y + 8, tw, 20); ctx.strokeStyle = css; ctx.strokeRect(x + dw - tw - 7.5, y + 8.5, tw - 1, 19); texte(ctx, touche, x + dw - 8 - tw / 2, y + 22, css, 10, 'center', '600 '); }
  return { info: L.orca, actif };
}

function cave (ctx, w, h, t, etat, css, L) {
  const cx = w / 2; const cy = h * 0.47; const R = Math.min(w / 1.12, h) * 0.42;
  if (!etat.init) {
    etat.init = true;
    etat.bord = Array.from({ length: 48 }, (_, i) => { const a = i / 48 * Math.PI * 2; return 1 + 0.12 * Math.sin(a * 3 + 1) + 0.07 * Math.sin(a * 7 + 2) + 0.04 * Math.sin(a * 13); });
    etat.public = Array.from({ length: 26 }, (_, i) => [Math.cos(i * 2.4) * (4 + (i % 5) * 3.2), Math.sin(i * 2.4) * (4 + (i % 5) * 3.2)]);
    etat.ondes = []; etat.dernier = [0, 0, 0, 0];
  }
  // un cycle de 20 s : le public, les robots, puis ensemble, puis chacun son tempo
  const ph = t % 72;
  const actif = ph < 16 ? 0 : ph < 32 ? 1 : ph < 52 ? 2 : 3;
  const sync = actif !== 3;
  const ech = R / 120;
  // la grotte
  ctx.strokeStyle = SOMBRE; ctx.lineWidth = 1.5; ctx.beginPath();
  etat.bord.forEach((k, i) => { const a = i / 48 * Math.PI * 2; const x = cx + Math.cos(a) * R * k * 1.12; const y = cy + Math.sin(a) * R * k; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath(); ctx.stroke(); ctx.lineWidth = 1;
  // des traces anciennes sur la paroi : le lieu a déjà été habité, de voix et de rites
  [5, 13, 20, 29, 37, 44].forEach((i, n) => {
    const a = i / 48 * Math.PI * 2; const k = etat.bord[i] * 0.97;
    const x = cx + Math.cos(a) * R * k * 1.12; const y = cy + Math.sin(a) * R * k;
    ctx.fillStyle = OCRE; ctx.globalAlpha = actif === 0 ? 0.95 : 0.5;
    for (let d = 0; d < 4; d++) ctx.fillRect(x + Math.cos(a + d * 1.7 + n) * 4 - 1, y + Math.sin(a + d * 2.3 + n) * 4 - 1, 2.2, 2.2);
    ctx.fillRect(x - 3, y + 5, 6, 1.4);
    ctx.globalAlpha = 1;
    if (actif === 0 && n === 1) texte(ctx, L.traces, x, y - 12, OCRE, 10, 'center', 'italic ');
  });
  // les ondes, que la roche renvoie
  etat.ondes = etat.ondes.filter((o) => (o.r += etat.dt * R * 0.55) < R * 1.3);
  for (const o of etat.ondes) { ctx.strokeStyle = css; ctx.globalAlpha = Math.max(0, 0.55 * (1 - o.r / (R * 1.3))); ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = 1;
  // le public au centre
  ctx.fillStyle = actif === 0 ? ENCRE : GRIS; for (const [x, y] of etat.public) ctx.fillRect(cx + x * ech * 1.4 - 1.5, cy + y * ech * 1.4 - 1.5, 3, 3);
  texte(ctx, L.public, cx, cy + 34 * ech + 14, actif === 0 ? css : GRIS, 11, 'center');
  if (actif === 0) { const r = 22 * ech + 10; viseur(ctx, cx - r, cy - r, r * 2, r * 2, css); }
  // les quatre robots, chacun avec son mégaphone tourné vers le public
  for (let i = 0; i < 4; i++) {
    const vit = sync ? 0.32 : [0.21, 0.37, 0.29, 0.45][i];
    const a = t * vit + i * Math.PI / 2;
    const rr = R * (0.62 + (sync ? 0.06 : 0.12 * Math.sin(t * 0.8 + i)));
    const x = cx + Math.cos(a) * rr * 1.1; const y = cy + Math.sin(a) * rr;
    const per = sync ? 1.6 : [1.1, 1.9, 1.4, 2.3][i];
    if (actif >= 2 && t - etat.dernier[i] > per) { etat.dernier[i] = sync ? Math.floor(t / per) * per : t; etat.ondes.push({ x, y, r: 4 }); }
    const vers = Math.atan2(cy - y, cx - x);
    const s = Math.max(1, ech * 1.3);
    ctx.save(); ctx.translate(x, y); ctx.rotate(vers); ctx.scale(s, s);
    ctx.fillStyle = ENCRE; ctx.fillRect(-5, -3.5, 10, 7);
    ctx.fillStyle = css; ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(11, -5); ctx.lineTo(11, 5); ctx.lineTo(5, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    texte(ctx, 'robot 0' + (i + 1), x, y - 12 * s, actif === 1 ? css : GRIS, 10, 'center');
    if (actif === 1) viseur(ctx, x - 14 * s, y - 10 * s, 28 * s, 20 * s, css, 0.8);
  }
  texte(ctx, sync ? L.sync : L.desync, 12, h - 12, actif >= 2 ? css : GRIS, 12);
  return { info: L.cave, actif };
}

// ---------------------------------------------------------------- Langue des images : un concept se compose de trois images
function langue (ctx, w, h, t, etat, css, L) {
  const DUREE = 32;
  const n = Math.floor(Math.max(0, t) / DUREE) % L.compos.length; const u = (t % DUREE) / DUREE;
  const [mot, images] = L.compos[n];
  const px = Math.max(3, Math.floor(Math.min(w / 34, h / 30)));
  const taille = px * 8; const gap = taille * 0.45;
  const total = taille * 3 + gap * 2; const x0 = (w - total) / 2; const y0 = h * 0.2;
  images.forEach(([signe, nom], i) => {
    const debut = 0.18 + i * 0.09; const part = Math.min(1, Math.max(0, (u - debut) / 0.12));
    const x = x0 + i * (taille + gap);
    if (part <= 0) { ctx.strokeStyle = SOMBRE; ctx.strokeRect(x - 0.5, y0 - 0.5, taille + 1, taille + 1); }
    bits(ctx, SIG[signe], x, y0, px, part >= 1 ? ENCRE : css, part, i + n * 3);
    if (part > 0.3) texte(ctx, nom, x + taille / 2, y0 + taille + 20, GRIS, 12, 'center');
    if (u > 0.2 && u < 0.45 && part > 0) { viseur(ctx, x - 6, y0 - 6, taille + 12, taille + 12, css, 0.8); texte(ctx, '8 × 8', x + taille / 2, y0 - 12, css, 10, 'center'); }
    if (i < 2 && part >= 1) texte(ctx, '·', x + taille + gap / 2, y0 + taille / 2 + 5, GRIS, 18, 'center');
  });
  if (u > 0.62) {
    const a = Math.min(1, (u - 0.62) / 0.12);
    ctx.globalAlpha = a;
    texte(ctx, '=', w / 2, y0 + taille + 56, GRIS, 18, 'center');
    texte(ctx, mot.toUpperCase(), w / 2, y0 + taille + 92, css, 22, 'center', '600 ');
    ctx.globalAlpha = 1;
  }
  texte(ctx, `${n + 1} / ${L.compos.length}`, w - 12, h - 12, GRIS, 11, 'right');
  const actif = u < 0.18 ? 0 : u < 0.45 ? 1 : u < 0.62 ? 2 : 3;
  return { info: L.langue, actif };
}

// ---------------------------------------------------------------- TEAMMATE.POTO : une créature qui écoute, digère et répond
function teammate (ctx, w, h, t, etat, css, L) {
  const CYCLE = 64;
  const k = Math.floor(t / CYCLE); const u = (t % CYCLE) / CYCLE;
  if (etat.k !== k) {
    etat.k = k;
    let s = k * 9301 + 49297; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    // un cycle sur deux, la phrase est monotone : la cellule stresse
    etat.monotone = k % 2 === 1;
    const v0 = 0.3 + rnd() * 0.5;
    etat.phrase = Array.from({ length: 12 }, (_, i) => etat.monotone ? v0 + (i % 2) * 0.08 : 0.2 + rnd() * 0.8);
    etat.decision = k % L.decisions.length;
    etat.voies = Array.from({ length: 7 }, () => rnd());
    etat.lv = 3 + k;
  }
  const actif = u < 0.14 ? 0 : u < 0.42 ? 1 : u < 0.66 ? 2 : 3;
  const pad = 12; const larg = w - pad * 2;
  const stress = etat.monotone ? Math.min(1, Math.max(0, (u - 0.42) / 0.2)) * 0.85 + 0.1 : 0.15;

  // la créature : un visage, une humeur, un niveau
  const fh = h * 0.17; const fw = Math.min(larg * 0.55, 260);
  ctx.strokeStyle = actif === 0 ? css : SOMBRE; ctx.strokeRect(pad + 0.5, 8.5, fw, fh);
  const visage = actif === 3 && etat.decision === 4 ? '( -_- ) zzz' : stress > 0.6 ? '( >_< )' : actif === 3 ? '( ^o^ )' : actif === 1 ? '( o_o )' : '( ^_^ )';
  texte(ctx, visage, pad + fw / 2, 8 + fh * 0.5, ENCRE, Math.min(22, fh * 0.32), 'center', '600 ');
  const dit = actif === 0 ? L.parole[0] : actif === 1 ? L.parole[1] : actif === 2 ? (stress > 0.6 ? L.parole[2] : L.parole[3]) : L.parole[4];
  texte(ctx, '« ' + dit + ' »', pad + fw / 2, 8 + fh * 0.84, css, 11, 'center', 'italic ');
  const ix = pad + fw + 16;
  if (ix + 60 < w) {
    texte(ctx, 'Lv ' + (etat.lv + (actif === 3 && u > 0.85 ? 1 : 0)), ix, 26, actif === 0 || (actif === 3 && u > 0.85) ? css : ENCRE, 13, 'left', '600 ');
    const xp = actif === 3 ? Math.min(1, (u - 0.66) / 0.2) : 0.35;
    ctx.fillStyle = SOMBRE; ctx.fillRect(ix, 34, w - ix - pad, 4); ctx.fillStyle = css; ctx.fillRect(ix, 34, (w - ix - pad) * xp, 4);
    texte(ctx, 'XP', ix, 52, GRIS, 10);
    texte(ctx, L.humeur + ' : ' + (stress > 0.6 ? L.humeurs[1] : actif === 3 ? L.humeurs[2] : L.humeurs[0]), ix, 70, GRIS, 10);
  }

  // toi : la phrase jouée, puis rangée en 48 fragments
  const y1 = 8 + fh + 26; const hb = h * 0.07;
  texte(ctx, L.toi, pad, y1 - 6, actif === 1 ? css : GRIS, 11);
  const vus = Math.min(12, Math.floor(Math.max(0, u - 0.14) / 0.14 * 12));
  const bw = larg / 12;
  for (let i = 0; i < vus; i++) { const hh = etat.phrase[i] * hb; ctx.fillStyle = ENCRE; ctx.fillRect(pad + i * bw + 1, y1 + hb - hh, bw - 3, hh); }
  const my = y1 + hb + 22; const cw = larg / 12; const chh = Math.max(4, h * 0.022);
  texte(ctx, L.memoire, pad, my - 6, actif === 1 ? css : GRIS, 10);
  if (actif === 1) texte(ctx, L.traits.join(' · '), w - pad, my - 6, GRIS, 10, 'right');
  for (let i = 0; i < 48; i++) {
    const c = i % 12; const r = Math.floor(i / 12);
    const plein = u > 0.28 && i < Math.floor(Math.min(1, (u - 0.28) / 0.14) * 48);
    ctx.fillStyle = plein ? css : SOMBRE; ctx.globalAlpha = plein ? 0.3 + etat.phrase[i % 12] * 0.7 : 1;
    ctx.fillRect(pad + c * cw + 1, my + r * (chh + 2), cw - 3, chh);
  }
  ctx.globalAlpha = 1;

  // METABO : l'avatar métabolique, une cellule que le son nourrit
  const cy = my + 4 * (chh + 2) + h * 0.13; const R = Math.min(h * 0.085, larg * 0.14);
  const cx = pad + R + 26;
  const souffle = 1 + Math.sin(t * (1.5 + stress * 6)) * (0.05 + stress * 0.08);
  ctx.strokeStyle = actif === 2 ? css : GRIS; ctx.globalAlpha = actif === 2 ? 1 : 0.6;
  ctx.beginPath(); ctx.arc(cx, cy, R * souffle, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  texte(ctx, 'METABO', cx, cy + 4, actif === 2 ? css : GRIS, 10, 'center', '600 ');
  L.voies.forEach((nom, i) => {
    const a = -Math.PI / 2 + i / 7 * Math.PI * 2;
    const v = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + i * 0.13 + stress) + etat.voies[i] * 6));
    const x = cx + Math.cos(a) * R * 1.45; const y = cy + Math.sin(a) * R * 1.45;
    ctx.fillStyle = css; ctx.globalAlpha = actif >= 2 ? v : 0.25; ctx.beginPath(); ctx.arc(x, y, 2 + v * 2.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  });
  const sx = cx + R * 1.45 + 30;
  if (sx + 80 < w) {
    texte(ctx, L.metabo, sx, cy - R + 4, actif === 2 ? ENCRE : GRIS, 11);
    texte(ctx, 'stress', sx, cy + 2, GRIS, 10);
    ctx.fillStyle = SOMBRE; ctx.fillRect(sx + 52, cy - 6, w - sx - 52 - pad, 6);
    ctx.fillStyle = stress > 0.6 ? OR : css; ctx.fillRect(sx + 52, cy - 6, (w - sx - 52 - pad) * stress, 6);
    texte(ctx, stress > 0.6 ? L.etats[1] : L.etats[0], sx, cy + 22, stress > 0.6 ? OR : css, 11);
    texte(ctx, L.voiesNotes, sx, cy + 40, GRIS, 10);
  }

  // la réponse : une décision, puis tes fragments rejoués
  const ry = cy + R * 1.45 + 34;
  if (u > 0.62) {
    let x = pad;
    ctx.font = "11px 'IBM Plex Mono', monospace";
    L.decisions.forEach((d, i) => { const lw = ctx.measureText(d).width; if (x + lw > w - pad) return; const on = i === etat.decision; texte(ctx, d, x, ry, on ? css : '#55534e', 11); if (on) viseur(ctx, x - 4, ry - 13, lw + 8, 18, css); x += lw + 16; });
  }
  if (u > 0.68) {
    const d = etat.decision; const ph = etat.phrase;
    const rep = d === 0 ? ph : d === 1 ? ph.map((v) => 1.2 - v) : d === 2 ? ph.flatMap((v) => [v, v * 0.7]) : d === 3 ? ph.filter((_, i) => i % 3 === 0) : [];
    const vis = Math.floor(Math.min(1, (u - 0.68) / 0.25) * rep.length);
    const bw2 = larg / Math.max(12, rep.length); const hr = Math.min(hb, h - ry - 16);
    for (let i = 0; i < vis; i++) { const hh = Math.max(0.1, rep[i]) * hr; ctx.fillStyle = css; ctx.fillRect(pad + i * bw2 + 1, ry + 10 + hr - hh, bw2 - 3, hh); }
  }
  return { info: L.teammate, actif };
}

// ---------------------------------------------------------------- TRIPODE AS-SIMT : le geste part vers Orca et le Norns, la note revient en vibration
function tripode (ctx, w, h, t, etat, css, L) {
  const ph = t % 80; const actif = Math.floor(ph / 20); const ts = ph - actif * 20;
  if (!etat.init) { etat.init = true; etat.hist = []; etat.paquets = []; etat.log = []; etat.grille = Array.from({ length: 3 }, () => Array(12).fill('.')); etat.vib = [0, 0, 0]; etat.dernier = 0; etat.note = 0; }
  // un geste simulé : neuf axes qui bougent ensemble, comme un bras qui tourne
  const ax = [];
  for (let i = 0; i < 9; i++) ax.push(0.5 + 0.42 * Math.sin(t * (0.9 + (i % 3) * 0.37) + i * 1.3) * (0.6 + 0.4 * Math.sin(t * 0.31 + i)));
  etat.hist.push(ax); if (etat.hist.length > 90) etat.hist.shift();
  const pad = 12;
  // le tripode, vu de dessus : un corps et trois pieds, qui pivote avec le gyroscope
  const R = Math.min(w * 0.13, h * 0.16); const cx = pad + R * 1.5; const cy = 18 + R * 1.6;
  const rot = (ax[0] - 0.5) * 1.6 + t * 0.2;
  const pieds = [0, 1, 2].map((k) => { const a = rot + k * Math.PI * 2 / 3; return [cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 1.25]; });
  ctx.strokeStyle = actif === 0 ? css : GRIS; ctx.lineWidth = 1.5;
  pieds.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); });
  ctx.lineWidth = 1; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  bits(ctx, SIG.E113, cx - R * 0.3, cy - R * 0.3, R * 0.6 / 8, actif === 0 ? css : ENCRE);
  // les trois moteurs, au bout des pieds : ils vibrent quand une note revient
  etat.vib = etat.vib.map((v) => Math.max(0, v - etat.dt * 1.6));
  if (actif === 3 && t - etat.dernier > 0.9) { etat.dernier = t; etat.note = (etat.note + 1) % 3; etat.vib[etat.note] = 1; etat.paquets.push({ de: 'orca', k: 0, n: etat.note }); }
  pieds.forEach(([x, y], k) => {
    const v = etat.vib[k]; const j = v > 0 ? Math.sin(t * 90 + k) * 2.2 * v : 0;
    ctx.fillStyle = v > 0.05 ? OR : '#55534e'; ctx.beginPath(); ctx.arc(x + j, y, 4 + v * 2, 0, Math.PI * 2); ctx.fill();
    if (v > 0.05) { ctx.strokeStyle = OR; ctx.globalAlpha = v; ctx.beginPath(); ctx.arc(x, y, 8 + (1 - v) * 14, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; }
  });
  texte(ctx, 'tripode 1_1', cx, cy + R * 1.25 + 22, actif === 0 ? css : GRIS, 10, 'center');
  // les neuf axes : gyroscope, accéléromètre, magnétomètre
  const gx = cx + R * 1.6 + 16; const gw = w - gx - pad; const gh = Math.min(h * 0.4, R * 3.2); const lh = gh / 3;
  ['G', 'A', 'M'].forEach((cap, g) => {
    const y0 = 14 + g * lh;
    texte(ctx, L.capteurs[g], gx, y0 + 10, actif === 0 ? ENCRE : GRIS, 10);
    for (let a = 0; a < 3; a++) {
      ctx.strokeStyle = actif === 0 ? css : '#6f6c66'; ctx.globalAlpha = 0.45 + a * 0.25; ctx.beginPath();
      etat.hist.forEach((v, i) => { const x = gx + i / 89 * gw; const y = y0 + 14 + (1 - v[g * 3 + a]) * (lh - 20); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke(); ctx.globalAlpha = 1;
    }
  });
  // en bas à gauche : la grille d'Orca où le geste s'écrit ; en bas à droite : les messages OSC vers le Norns
  const by = Math.max(cy + R * 1.25 + 40, 14 + gh + 26); const bh = h - by - 10; const col = w * 0.5;
  const cell = Math.min((col - pad - 10) / 12, 16);
  texte(ctx, 'ORCA · UDP', pad, by, actif === 1 ? css : GRIS, 10, 'left', '600 ');
  texte(ctx, 'NORNS · TEAMMATE · OSC', col + 4, by, actif === 2 ? css : GRIS, 10, 'left', '600 ');
  // envois : toutes les 0,25 s en UDP (étape 2), toutes les 0,12 s en OSC (étape 3)
  etat.acc = (etat.acc || 0) + etat.dt;
  while (etat.acc > 0.12) {
    etat.acc -= 0.12; etat.tic = (etat.tic || 0) + 1;
    const v = ax.map((x) => Math.round(x * 34).toString(36));
    if (actif === 1 && etat.tic % 2 === 0) { const r = etat.tic % 3; etat.grille[r] = ('1V' + v[0] + '2V' + v[1] + '3V' + v[2] + '..' + 'D' + v[3] + 'C').slice(0, 12).split(''); etat.paquets.push({ de: 'udp', k: 0, r }); }
    if (actif === 2) { const i = etat.tic % 3; etat.log.push(`/gyroscope_${'xyz'[i]}_1_1  ${ax[i].toFixed(2)}`); if (etat.log.length > 8) etat.log.shift(); etat.paquets.push({ de: 'osc', k: 0 }); }
  }
  const gy0 = by + 12;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 12; c++) {
    const ch = etat.grille[r][c]; const x = pad + c * cell; const y = gy0 + r * (cell + 4);
    if (y + cell > h - 4) continue;
    if (ch === '.') { ctx.fillStyle = '#2a2927'; ctx.fillRect(x + cell / 2 - 0.7, y + cell / 2 - 0.7, 1.4, 1.4); continue; }
    bits(ctx, TOUS[ch], x + 1, y + 1, (cell - 2) / 8, /[A-Z]/.test(ch) ? ENCRE : GRIS);
  }
  if (actif === 1) texte(ctx, 'write:1V…;0;0', pad, Math.min(h - 6, gy0 + 3 * (cell + 4) + 12), css, 10, 'left', 'italic ');
  etat.log.forEach((l, i) => { const y = gy0 + 8 + i * 13; if (y < h - 4) texte(ctx, l, col + 4, y, i === etat.log.length - 1 ? css : '#6f6c66', 10); });
  if (actif === 3) {
    texte(ctx, L.noteRevient, col + 4, Math.min(h - 8, gy0 + 8 + 8 * 13 + 4), OR, 10, 'left', 'italic ');
  }
  // les paquets qui voyagent : du tripode vers Orca ou le Norns, et la note d'Orca qui revient vers un moteur
  etat.paquets = etat.paquets.filter((p) => (p.k += etat.dt * 2.2) < 1);
  for (const p of etat.paquets) {
    let a; let b; let c2 = css;
    if (p.de === 'udp') { a = [cx, cy]; b = [pad + 40, gy0]; }
    else if (p.de === 'osc') { a = [cx, cy]; b = [col + 40, gy0]; }
    else { a = [pad + 60, gy0]; b = pieds[p.n]; c2 = OR; }
    const x = a[0] + (b[0] - a[0]) * p.k; const y = a[1] + (b[1] - a[1]) * p.k;
    ctx.fillStyle = c2; ctx.fillRect(x - 2, y - 2, 4, 4);
  }
  return { info: L.tripode, actif };
}

// ---------------------------------------------------------------- SYSTEMA8OS.XT : la carte du lieu et la carte du son se superposent, le robot y joue en marchant
// sept temps, lents : le scan, les grains, deux façons de les répartir, les sons placés, le robot qui marche, le pilotage
const SYS_DUREES = [16, 16, 20, 20, 20, 20, 20];
const SEUL_DUREES = [18, 18, 20];
// SYSTEMA8OS.XT sans robot : capturer, le mode TRANS, PERU ; puis les sept temps avec le robot
function systema (ctx, w, h, t, etat, css, L) {
  const tSeul = SEUL_DUREES.reduce((a, b) => a + b, 0); const total = tSeul + SYS_DUREES.reduce((a, b) => a + b, 0); const tt = t % total;
  if (tt >= tSeul) { if (!etat.robot) etat.robot = { dt: etat.dt, relance: 0 }; etat.robot.dt = etat.dt; const r = systemaRobot(ctx, w, h, tt - tSeul, etat.robot, css, L); return { info: L.systema, actif: r.actif + 3 }; }
  let ph = tt; let actif = 0; while (ph >= SEUL_DUREES[actif]) { ph -= SEUL_DUREES[actif]; actif++; }
  systemaSeul(ctx, w, h, t, ph, actif, etat, css, L);
  return { info: L.systema, actif };
}
function systemaSeul (ctx, w, h, t, ph, actif, etat, css, L) {
  const pad = 12; const lisse = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  if (!etat.seul) {
    let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    etat.seul = { grains: Array.from({ length: 70 }, () => ({ tim: rnd(), v: rnd(), lum: 0, img: Math.floor(rnd() * 4) })), balles: [], vols: [] };
  }
  const S = etat.seul; const dt = etat.dt || 1 / 60;
  // le nuage des grains : timbre en largeur, hauteur en hauteur
  const NX = w * 0.56; const NY = h * 0.2; const NW = w * 0.38; const NH = h * 0.58;
  const pos = (g) => [NX + g.tim * NW, NY + (1 - g.v) * NH];
  // une petite image de grain : quatre motifs, comme des plans filmés
  const vignette = (x, y, ww, hh, k, coul) => { ctx.strokeStyle = coul; ctx.strokeRect(x + 0.5, y + 0.5, ww, hh); ctx.fillStyle = coul;
    if (k === 0) { ctx.beginPath(); ctx.arc(x + ww / 2, y + hh / 2, hh * 0.3, 0, 6.283); ctx.fill(); }
    else if (k === 1) { for (let i = 0; i < 3; i++) ctx.fillRect(x + ww * (0.2 + i * 0.25), y + hh * 0.3, ww * 0.12, hh * 0.5); }
    else if (k === 2) { ctx.beginPath(); ctx.moveTo(x + 3, y + hh - 3); ctx.lineTo(x + ww / 2, y + 4); ctx.lineTo(x + ww - 3, y + hh - 3); ctx.closePath(); ctx.fill(); }
    else { ctx.fillRect(x + 3, y + hh * 0.55, ww - 6, hh * 0.3); ctx.fillRect(x + ww * 0.6, y + 4, ww * 0.25, hh * 0.25); } };
  const nuage = (alpha) => { ctx.globalAlpha = alpha; ctx.strokeStyle = SOMBRE; ctx.strokeRect(NX - 6, NY - 6, NW + 12, NH + 12);
    texte(ctx, L.timbre + ' →', NX, NY + NH + 20, GRIS, 10); ctx.save(); ctx.translate(NX - 12, NY + NH); ctx.rotate(-Math.PI / 2); texte(ctx, L.hauteur + ' →', 0, 0, GRIS, 10); ctx.restore(); ctx.globalAlpha = 1; };
  if (actif === 0) {
    // trois sources : le micro, la caméra, une fenêtre de l'écran
    const sx = pad + 6; L.sources.forEach((nom, i) => { const y = h * 0.22 + i * h * 0.2; const on = Math.floor(t / 2.5) % 3 === i;
      ctx.strokeStyle = on ? css : SOMBRE; ctx.strokeRect(sx + 0.5, y + 0.5, 46, 34);
      ctx.fillStyle = on ? css : GRIS; if (i === 0) { ctx.fillRect(sx + 19, y + 7, 8, 14); ctx.fillRect(sx + 22, y + 21, 2, 7); } else if (i === 1) { ctx.fillRect(sx + 11, y + 11, 18, 13); ctx.fillRect(sx + 29, y + 14, 6, 7); } else { ctx.fillRect(sx + 9, y + 8, 28, 16); ctx.fillStyle = '#000'; ctx.fillRect(sx + 11, y + 10, 24, 12); }
      texte(ctx, nom, sx + 23, y + 48, on ? css : GRIS, 10, 'center'); });
    // la bande : en haut les images, en bas l'onde ; des coupes la découpent en grains
    const bx = sx + 64; const bw = NX - bx - 24; const by = h * 0.36; const defile = (t * 30) % 40;
    ctx.save(); ctx.beginPath(); ctx.rect(bx, by - 30, bw, 80); ctx.clip();
    for (let i = -1; i < bw / 40 + 1; i++) vignette(bx + i * 40 - defile, by - 26, 34, 24, (i + Math.floor(t * 30 / 40)) & 3, '#6f6c66');
    ctx.strokeStyle = css; ctx.beginPath(); for (let x = 0; x <= bw; x += 2) { const y = by + 26 + Math.sin((x + t * 30) * 0.15) * 10 * Math.sin((x + t * 30) * 0.013); x ? ctx.lineTo(bx + x, y) : ctx.moveTo(bx + x, y); } ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = OR; ctx.setLineDash([3, 3]); for (let x = bw - defile; x > 0; x -= 40) { ctx.beginPath(); ctx.moveTo(bx + x, by - 32); ctx.lineTo(bx + x, by + 46); ctx.stroke(); } ctx.setLineDash([]);
    texte(ctx, L.grainMot, pad, h - 12, OR, 10, 'left', 'italic ');
    // les grains s'envolent vers le nuage et s'y rangent
    const n = Math.min(S.grains.length, Math.floor(ph * 5)); nuage(lisse(ph / 2));
    S.grains.forEach((g, i) => { if (i >= n) return; const u = lisse((ph - i / 5) / 1.2); const [gx, gy] = pos(g); const x = bx + bw + (gx - bx - bw) * u; const y = by + 10 + (gy - by - 10) * u; ctx.fillStyle = u < 1 ? OR : g.v > 0.5 ? ENCRE : GRIS; ctx.fillRect(x - 2, y - 2, 4, 4); });
  }
  if (actif === 1) {
    // le micro : une voix dont la hauteur change ; le grain le plus proche s'allume et montre son image
    nuage(1); const mx = pad + 10; const my = h * 0.5; const hz = 0.5 + 0.4 * Math.sin(t * 0.7) + 0.08 * Math.sin(t * 2.3); const tb = 0.5 + 0.4 * Math.sin(t * 0.45 + 1);
    ctx.fillStyle = css; ctx.fillRect(mx + 4, my - 14, 10, 20); ctx.fillRect(mx + 8, my + 6, 2, 10); texte(ctx, L.voixMot, mx, my + 32, css, 10, 'left', 'italic ');
    ctx.strokeStyle = css; ctx.beginPath(); for (let x = 0; x < NX - mx - 50; x += 2) { const y = my + Math.sin(x * (0.1 + hz * 0.3) - t * 8) * 9; x ? ctx.lineTo(mx + 26 + x, y) : ctx.moveTo(mx + 26 + x, y); } ctx.stroke();
    let best = null; let bd = 9; S.grains.forEach((g) => { const d = Math.hypot(g.tim - tb, g.v - hz); if (d < bd) { bd = d; best = g; } });
    S.grains.forEach((g) => { g.lum = Math.max(0, g.lum - dt * 1.2); const [x, y] = pos(g); ctx.fillStyle = g.lum > 0.05 ? OR : g.v > 0.5 ? ENCRE : GRIS; const r = 2 + g.lum * 2.5; ctx.fillRect(x - r, y - r, r * 2, r * 2); });
    if (best) { best.lum = 1; const [x, y] = pos(best); ctx.strokeStyle = OR; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(NX - 40, my); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x, y, 9 + (t * 20) % 10, 0, 6.283); ctx.stroke();
      vignette(pad + 14, h * 0.2, 70, 50, best.img, OR); texte(ctx, L.imageGrain, pad + 14, h * 0.2 - 6, OR, 10, 'left', 'italic ');
      texte(ctx, L.repond, pad, h - 12, OR, 10, 'left', 'italic '); }
  }
  if (actif === 2) {
    // PERU : une cage en perspective, des balles-grains, la gravité qui change à chaque pas
    const cx0 = w * 0.14; const cy0 = h * 0.14; const cw = w * 0.72; const ch = h * 0.56; const d = Math.min(w, h) * 0.08;
    ctx.strokeStyle = css; ctx.globalAlpha = 0.7; ctx.strokeRect(cx0 + d, cy0 - d, cw, ch); ctx.strokeRect(cx0, cy0, cw, ch);
    [[0, 0], [cw, 0], [0, ch], [cw, ch]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(cx0 + a, cy0 + b); ctx.lineTo(cx0 + a + d, cy0 + b - d); ctx.stroke(); }); ctx.globalAlpha = 1;
    const pas = 16; const k = Math.floor(t * 2) % pas; const grav = [0.8, 0.8, 0.1, -0.1, 0.5, 0.8, 0.3, 0, 0.8, 0.6, -0.1, 0.2, 0.8, 0.4, 0.1, 0.7];
    if (!S.balles.length) for (let i = 0; i < 9; i++) S.balles.push({ x: 0.1 + i * 0.1, y: 0.2 + (i % 3) * 0.2, vx: (i % 2 ? 0.12 : -0.1), vy: 0, img: i & 3, l: 0 });
    const g = grav[k] * 4.5;
    S.balles.forEach((b) => { b.vy += g * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.l = Math.max(0, b.l - dt * 2);
      if (b.y > 0.95) { b.y = 0.95; if (b.vy > 0.25) { b.l = Math.min(1, b.vy / 1.2); S.vols.push({ x: b.x, y: 0.95, r: 0, f: b.l }); } b.vy = -b.vy * 0.82; }
      if (b.y < 0.05) { b.y = 0.05; b.vy = Math.abs(b.vy) * 0.5; } if (b.x < 0.04 || b.x > 0.96) b.vx = -b.vx; });
    S.vols = S.vols.filter((v) => (v.r += dt * 60) < 40);
    S.vols.forEach((v) => { ctx.strokeStyle = OR; ctx.globalAlpha = (1 - v.r / 40) * (0.4 + v.f * 0.6); ctx.beginPath(); ctx.ellipse(cx0 + v.x * cw, cy0 + v.y * ch, v.r, v.r * 0.35, 0, 0, 6.283); ctx.stroke(); }); ctx.globalAlpha = 1;
    S.balles.forEach((b) => { const x = cx0 + b.x * cw; const y = cy0 + b.y * ch; const r = 9 + b.l * 4; ctx.strokeStyle = b.l > 0.05 ? OR : ENCRE; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke(); vignette(x - 5, y - 4, 10, 8, b.img, b.l > 0.05 ? OR : GRIS); });
    texte(ctx, L.choc, cx0, cy0 + ch + 18, OR, 10, 'left', 'italic ');
    // le séquenceur de gravité : seize pas, de l'apesanteur au très lourd
    const sy = h - 46; const sw = (w - pad * 2 - 70) / pas; texte(ctx, L.gravite, pad, sy + 18, GRIS, 10);
    for (let i = 0; i < pas; i++) { const v = (grav[i] + 0.1) / 0.9; const bh = 4 + v * 26; ctx.fillStyle = i === k ? css : '#55534e'; ctx.fillRect(pad + 70 + i * sw, sy + 30 - bh, sw - 3, bh); }
  }
  texte(ctx, L.titresSeul[actif], pad, 20, css, 11, 'left', '600 ');
}
function systemaRobot (ctx, w, h, t, etat, css, L) {
  const total = SYS_DUREES.reduce((a, b) => a + b, 0); let ph = t % total; let actif = 0;
  while (ph >= SYS_DUREES[actif]) { ph -= SYS_DUREES[actif]; actif++; }
  const pad = 12; const cx = w / 2; const cy = h / 2 + 6; const R = Math.min(w, h) * 0.42;
  const lisse = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  if (!etat.init) {
    etat.init = true;
    let s = 7; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    etat.murs = [];
    for (let i = 0; i < 170; i++) { const a = i / 170 * Math.PI * 2; const k = 1 + 0.08 * Math.sin(a * 3) + 0.05 * Math.sin(a * 7 + 1); etat.murs.push([Math.cos(a) * k * 1.08, Math.sin(a) * k * 0.82]); }
    for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; etat.murs.push([-0.42 + Math.cos(a) * 0.1, -0.22 + Math.sin(a) * 0.1]); etat.murs.push([0.5 + Math.cos(a) * 0.08, 0.3 + Math.sin(a) * 0.12]); }
    etat.ordre = etat.murs.map((_, i) => i).sort(() => rnd() - 0.5);
    // la zone de répartition, tracée par des balises
    etat.zone = [[-0.75, -0.55], [0.05, -0.62], [0.35, -0.1], [0.05, 0.45], [-0.6, 0.4], [-0.85, -0.05]];
    const dans = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]; const [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    // chaque grain a trois places : la carte du son (timbre, hauteur), la zone, tout l'espace (près du relief vu par le LiDAR)
    etat.grains = Array.from({ length: 110 }, () => {
      const v = rnd(); const tim = rnd();
      let zx = 0; let zy = 0; do { zx = -0.9 + rnd() * 1.3; zy = -0.65 + rnd() * 1.15; } while (!dans(zx, zy, etat.zone));
      const m = etat.murs[Math.floor(rnd() * etat.murs.length)]; const kk = 0.62 + rnd() * 0.3;
      return { s: [-0.7 + tim * 1.4, 0.55 - v * 1.1], z: [zx, zy], e: [m[0] * kk, m[1] * kk], v, lum: 0 };
    });
    etat.pads = [['voix', -0.6, 0.35], ['cloche', -0.1, -0.5], ['pluie', 0.35, -0.05], ['souffle', 0.7, -0.35], ['tambour', 0.05, 0.48]].map(([nom, x, y]) => ({ nom, x, y, v: 0, dedans: false }));
    etat.securite = [[-0.95, -0.65], [0.3, -0.8], [0.98, -0.25], [0.85, 0.62], [-0.3, 0.72], [-1.0, 0.15]];
    etat.trace = []; etat.ondes = [];
  }
  const P = (x, y) => [cx + x * R, cy + y * R];
  // le scan LiDAR
  const vus = actif === 0 ? Math.floor(lisse(ph / 7) * etat.murs.length) : etat.murs.length;
  if (actif === 0) { const a = t * 1.6; ctx.strokeStyle = css; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R * 1.25); ctx.stroke(); ctx.globalAlpha = 1; texte(ctx, 'go2 · LiDAR', cx, cy + 4, css, 10, 'center'); }
  for (let i = 0; i < vus; i++) { const [x, y] = etat.murs[etat.ordre[i]]; const [px, py] = P(x, y); ctx.fillStyle = actif === 0 ? css : '#55534e'; ctx.fillRect(px - 1.2, py - 1.2, 2.4, 2.4); }
  // la zone de répartition (temps 3)
  if (actif === 2) {
    const a = lisse(ph / 2);
    ctx.strokeStyle = css; ctx.globalAlpha = a; ctx.setLineDash([4, 4]); ctx.beginPath(); etat.zone.forEach(([x, y], i) => { const [px, py] = P(x, y); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    etat.zone.forEach(([x, y]) => { const [px, py] = P(x, y); ctx.fillStyle = css; ctx.fillRect(px - 3, py - 3, 6, 6); });
    ctx.globalAlpha = 1; const [zx, zy] = P(etat.zone[0][0], etat.zone[0][1]); texte(ctx, L.zoneGrains, zx, zy - 10, css, 10);
  }
  // les grains : sur la carte du son (2), dans la zone (3), dans tout l'espace (4), discrets ensuite
  let rob = null;
  if (actif >= 2) {
    // le robot marche lentement à partir du temps 3
    const u = ph / SYS_DUREES[actif];
    const x = actif === 2 ? -0.7 + 0.9 * u : actif === 3 ? 0.75 * Math.cos(u * 4.4) : actif === 6 ? 0.55 * Math.cos(u * 4.8) + 0.1 * Math.sin(u * 13) : -0.75 + 1.5 * u + 0.1 * Math.sin(u * 8);
    const y = actif === 2 ? -0.35 + 0.6 * Math.sin(u * 3.1) : actif === 3 ? 0.55 * Math.sin(u * 4.4) : actif === 6 ? 0.42 * Math.sin(u * 6.2) : 0.38 * Math.sin(u * 4.6) - 0.05;
    rob = [x, y];
  }
  if (actif >= 1) {
    const vers = actif === 1 ? 's' : actif === 2 ? 'z' : 'e'; const de = actif === 2 ? 's' : actif === 3 ? 'z' : null;
    const k = de ? lisse(ph / 2.5) : 1;
    const discret = actif >= 4;
    if (actif === 1) {
      const a = lisse(ph / 2); ctx.strokeStyle = SOMBRE; ctx.strokeRect(cx - R * 0.8, cy - R * 0.65, R * 1.6, R * 1.3);
      ctx.globalAlpha = a; texte(ctx, L.timbre + ' →', cx - R * 0.78, cy + R * 0.65 + 14, GRIS, 10); ctx.save(); ctx.translate(cx - R * 0.8 - 8, cy + R * 0.6); ctx.rotate(-Math.PI / 2); texte(ctx, L.hauteur + ' →', 0, 0, GRIS, 10); ctx.restore(); ctx.globalAlpha = 1;
    }
    for (const g of etat.grains) {
      const a = de ? g[de] : g[vers]; const b = g[vers];
      const gx = a[0] + (b[0] - a[0]) * k; const gy = a[1] + (b[1] - a[1]) * k;
      if (rob && actif <= 3 && Math.hypot(gx - rob[0], gy - rob[1]) < 0.14) g.lum = 1;
      g.lum = Math.max(0, g.lum - etat.dt * 1.5);
      const [px, py] = P(gx, gy);
      ctx.fillStyle = g.lum > 0.05 ? OR : g.v > 0.66 ? ENCRE : g.v > 0.33 ? GRIS : '#6f6c66';
      ctx.globalAlpha = discret ? 0.3 : (actif === 1 ? lisse(ph / 2) : 1);
      const r = 1.6 + g.lum * 2.2; ctx.fillRect(px - r, py - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    if (actif === 3) texte(ctx, L.toutEspace, pad, h - 12, css, 10);
  }
  // les sons placés à des endroits choisis (temps 5 et après)
  if (actif >= 4) {
    const a = actif === 4 ? lisse(ph / 2) : 1;
    etat.pads.forEach((p, i) => {
      const [px, py] = P(p.x, p.y); p.v = Math.max(0, p.v - etat.dt * 0.9);
      const pose = actif === 4 ? lisse((ph - 0.6 - i * 0.7) / 0.8) : 1; if (pose <= 0) return;
      ctx.globalAlpha = a * pose; ctx.strokeStyle = p.v > 0.05 ? OR : css; ctx.lineWidth = 1 + p.v;
      ctx.beginPath(); ctx.arc(px, py, R * 0.1 * (0.6 + 0.4 * pose), 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
      texte(ctx, p.nom, px, py - R * 0.1 - 5, p.v > 0.05 ? OR : ENCRE, 10, 'center', 'italic '); ctx.globalAlpha = 1;
    });
  }
  // la zone de sécurité (temps 7)
  if (actif === 6) {
    ctx.strokeStyle = GRIS; ctx.setLineDash([2, 5]); ctx.beginPath(); etat.securite.forEach(([x, y], i) => { const [px, py] = P(x, y); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    const [zx, zy] = P(etat.securite[0][0], etat.securite[0][1]); texte(ctx, L.zone, zx, zy - 8, GRIS, 10);
  }
  // le robot
  if (rob) {
    const [rx, ry] = P(rob[0], rob[1]);
    etat.trace.push([rx, ry]); if (etat.trace.length > 220) etat.trace.shift();
    ctx.strokeStyle = css; ctx.globalAlpha = 0.45; ctx.beginPath(); etat.trace.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.globalAlpha = 1;
    if (actif >= 4) etat.pads.forEach((p) => { const d = Math.hypot(p.x - rob[0], p.y - rob[1]); const dedans = d < 0.1; if (dedans && !p.dedans) { p.v = 1; etat.ondes.push({ x: rx, y: ry, r: 6 }); } p.dedans = dedans; });
    if (actif === 5 && Math.floor(t * 1.5) !== etat.pulse) { etat.pulse = Math.floor(t * 1.5); etat.ondes.push({ x: rx, y: ry, r: 6, faible: true }); }
    const n = etat.trace.length; const dir = n > 3 ? Math.atan2(ry - etat.trace[n - 4][1], rx - etat.trace[n - 4][0]) : 0;
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(dir);
    ctx.fillStyle = ENCRE; ctx.fillRect(-10, -5, 20, 10); ctx.fillStyle = OR; ctx.fillRect(8, -2.5, 5, 5);
    ctx.fillStyle = '#55534e'; [[-8, -7.5], [6, -7.5], [-8, 5.5], [6, 5.5]].forEach(([a, b]) => ctx.fillRect(a, b, 3, 2));
    ctx.restore();
    texte(ctx, 'go2', rx, ry + 22, ENCRE, 10, 'center');
    if (actif === 5) { texte(ctx, 'L', cx - R * 1.05, cy, GRIS, 11, 'center', '600 '); texte(ctx, 'R', cx + R * 1.05, cy, GRIS, 11, 'center', '600 '); const pan = rob[0]; ctx.fillStyle = css; ctx.fillRect(cx - R * 0.5, h - 18, R, 2); ctx.fillStyle = OR; ctx.fillRect(cx + pan * R * 0.5 - 3, h - 21, 6, 8); texte(ctx, L.panoramique, cx, h - 26, GRIS, 9, 'center'); }
    if (actif === 6) texte(ctx, 'OSC → TEAMMATE  /go2/pos ' + ((rob[0] + 1) / 2).toFixed(2) + ' ' + ((1 - rob[1]) / 2).toFixed(2), pad, h - 12, css, 10);
  } else etat.trace = [];
  etat.ondes = etat.ondes.filter((o) => (o.r += etat.dt * R * 0.45) < R * (o.faible ? 0.4 : 0.85));
  for (const o of etat.ondes) { ctx.strokeStyle = o.faible ? css : OR; ctx.globalAlpha = Math.max(0, (o.faible ? 0.4 : 0.85) * (1 - o.r / (R * (o.faible ? 0.4 : 0.85)))); ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.globalAlpha = 1;
  texte(ctx, L.titresSys[actif], pad, 20, css, 11, 'left', '600 ');
  return { info: L.systema, actif };
}

// ---------------------------------------------------------------- AVATAR MÉTABOLIQUE SONORE : des gènes au modèle, du son aux flux, des flux au son
const AV_DUREES = [18, 18, 18, 20, 20];
function avatar (ctx, w, h, t, etat, css, L) {
  const total = AV_DUREES.reduce((a, b) => a + b, 0); let ph = t % total; let actif = 0;
  while (ph >= AV_DUREES[actif]) { ph -= AV_DUREES[actif]; actif++; }
  const lisse = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const pad = 12;
  if (!etat.init) {
    etat.init = true;
    let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    // le réseau métabolique : des couches, des nutriments vers les produits, chaque voie nommée
    const couches = [[L.nutriments[0], L.nutriments[1]], [L.voies[0], '', ''], ['', L.voies[1], '', ''], [L.voies[2], '', L.voies[3], ''], [L.produits[0], L.produits[1], L.produits[2]]];
    etat.noeuds = []; couches.forEach((c, i) => c.forEach((nom, j) => etat.noeuds.push({ i, j, n: c.length, nom, f: 0 })));
    etat.liens = [];
    etat.noeuds.forEach((a, ia) => etat.noeuds.forEach((b, ib) => { if (b.i === a.i + 1 && (rnd() < 0.55 || Math.abs(b.j / b.n - a.j / a.n) < 0.3)) etat.liens.push({ a: ia, b: ib, f: 0, ph: rnd() * 6 }); }));
    etat.adn = Array.from({ length: 64 }, () => 'ACGT'[Math.floor(rnd() * 4)]);
    etat.genes = [[6, 14], [22, 31], [40, 47], [52, 60]];
    etat.particules = [];
  }
  // la zone du réseau
  const nx0 = w * 0.24; const nx1 = w * 0.76; const ny0 = h * 0.2; const ny1 = h * 0.86;
  const pos = (nd) => [nx0 + (nx1 - nx0) * nd.i / 4, ny0 + (ny1 - ny0) * (nd.j + 0.5) / nd.n];
  // 1 · le séquençage : une double hélice qui défile, les gènes exprimés s'allument
  if (actif === 0) {
    const y0 = h * 0.42; const amp = h * 0.12; const pas = (w - pad * 2) / 64; const dec = t * 0.6;
    for (let k = 0; k < 64; k++) {
      const x = pad + k * pas; const a = k * 0.35 + dec; const y1 = y0 + Math.sin(a) * amp; const y2 = y0 - Math.sin(a) * amp;
      const gene = etat.genes.some(([g0, g1], gi) => k >= g0 && k <= g1 && ph > 3 + gi * 3);
      ctx.strokeStyle = gene ? css : SOMBRE; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
      ctx.fillStyle = gene ? css : GRIS; ctx.fillRect(x - 1.5, y1 - 1.5, 3, 3); ctx.fillRect(x - 1.5, y2 - 1.5, 3, 3);
      if (k % 2 === 0) texte(ctx, etat.adn[k], x, y0 + amp + 22, gene ? css : '#55534e', 9, 'center');
    }
    etat.genes.forEach(([g0, g1], gi) => { if (ph > 3 + gi * 3) texte(ctx, L.gene + ' ' + (gi + 1), pad + (g0 + g1) / 2 * pas, y0 - amp - 14, css, 10, 'center', 'italic '); });
    texte(ctx, L.titresAv[0], pad, 20, css, 11, 'left', '600 ');
    return { info: L.avatar, actif };
  }
  // 2 → 5 · le réseau du modèle
  const montre = actif === 1 ? lisse(ph / 10) : 1;
  const nbLiens = Math.floor(etat.liens.length * montre);
  // flux : le son entre (étape 3), le modèle calcule (4), les flux sonnent (5)
  const entree = actif >= 2 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 1.7) * Math.sin(t * 0.43)) : 0;
  etat.liens.forEach((l, k) => { const cible = actif >= 3 ? 0.25 + 0.75 * Math.abs(Math.sin(t * 0.5 + l.ph)) * entree : actif === 2 ? 0.15 : 0; l.f += (cible - l.f) * Math.min(1, etat.dt * 2); });
  for (let k = 0; k < nbLiens; k++) {
    const l = etat.liens[k]; const [ax, ay] = pos(etat.noeuds[l.a]); const [bx, by] = pos(etat.noeuds[l.b]);
    ctx.strokeStyle = l.f > 0.2 ? css : SOMBRE; ctx.globalAlpha = l.f > 0.2 ? 0.35 + l.f * 0.6 : 1; ctx.lineWidth = 1 + l.f * 3;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.lineWidth = 1;
  // les particules de matière qui circulent (étapes 4 et 5)
  if (actif >= 3 && etat.liens.length) {
    if (Math.random() < etat.dt * 30) { const l = etat.liens[Math.floor(Math.random() * etat.liens.length)]; if (l.f > 0.3) etat.particules.push({ l, k: 0 }); }
    etat.particules = etat.particules.filter((p) => (p.k += etat.dt * (0.4 + p.l.f)) < 1);
    for (const p of etat.particules) { const [ax, ay] = pos(etat.noeuds[p.l.a]); const [bx, by] = pos(etat.noeuds[p.l.b]); ctx.fillStyle = OR; ctx.fillRect(ax + (bx - ax) * p.k - 2, ay + (by - ay) * p.k - 2, 4, 4); }
  }
  etat.noeuds.forEach((nd, k) => {
    const [x, y] = pos(nd); const vu = actif === 1 ? lisse(ph / 10 * 1.2 - nd.i * 0.12) : 1; if (vu <= 0) return;
    const f = etat.liens.filter((l) => l.b === k || l.a === k).reduce((a, l) => Math.max(a, l.f), 0);
    ctx.globalAlpha = vu; ctx.fillStyle = '#000'; ctx.strokeStyle = f > 0.3 ? css : GRIS; ctx.beginPath(); ctx.arc(x, y, 4 + f * 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (nd.nom) texte(ctx, nd.nom, x, y - 10 - f * 4, f > 0.3 ? ENCRE : GRIS, 10, 'center', 'italic ');
    ctx.globalAlpha = 1;
  });
  // à gauche : le son de NSDOS qui entre ; à droite : la réponse de l'avatar
  const onde = (x0, x1, yc, amp, phase, couleur, alpha) => { ctx.strokeStyle = couleur; ctx.globalAlpha = alpha; ctx.beginPath(); for (let x = x0; x <= x1; x += 2) { const u = (x - x0) / (x1 - x0); const y = yc + Math.sin(u * 22 + phase) * amp * Math.sin(u * Math.PI) * (0.6 + 0.4 * Math.sin(phase * 0.7 + u * 5)); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.globalAlpha = 1; };
  const yc = (ny0 + ny1) / 2;
  if (actif >= 2) {
    onde(pad, nx0 - 22, yc, h * 0.08 * entree, t * 4, ENCRE, 1);
    texte(ctx, 'NSDOS', pad, yc - h * 0.14, ENCRE, 10, 'left', '600 '); texte(ctx, L.sonEntre, pad, yc + h * 0.14, GRIS, 9);
    ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.moveTo(nx0 - 18, yc); ctx.lineTo(nx0 - 8, yc); ctx.stroke();
  }
  if (actif >= 4) {
    const rep = etat.liens.reduce((a, l) => a + l.f, 0) / etat.liens.length;
    onde(nx1 + 22, w - pad, yc, h * 0.1 * Math.min(1, rep * 1.6), t * 3.1 + 1, OR, 1);
    texte(ctx, L.avatarNom, w - pad, yc - h * 0.14, OR, 10, 'right', '600 '); texte(ctx, L.fluxSon, w - pad, yc + h * 0.14, GRIS, 9, 'right');
    // les notes jouées par les voies les plus actives
    etat.noeuds.forEach((nd, k) => { if (!nd.nom) return; const f = etat.liens.filter((l) => l.a === k).reduce((a, l) => Math.max(a, l.f), 0); if (f > 0.8) { const [x, y] = pos(nd); ctx.strokeStyle = OR; ctx.globalAlpha = (f - 0.8) * 4; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; } });
  }
  if (actif === 3) texte(ctx, 'FBA · ' + L.balance, w / 2, h - 10, css, 10, 'center');
  texte(ctx, L.titresAv[actif], pad, 20, css, 11, 'left', '600 ');
  return { info: L.avatar, actif };
}

// ---------------------------------------------------------------- BILLY // STEAM DECK : piloter Billy (Unitree Go2) depuis le Steam Deck, et jouer le scan comme une MPC en 3D
// cinq temps : la chaîne Deck → Pi → robot, conduire, voir (le scan en glyphes), les pads, les séquences
const BI_DUREES = [18, 20, 20, 20, 20];
const UNITES = { 1: '#ff1fce', 2: '#b6ff00', 3: '#a24dff' };
function steamDeck (ctx, x, y, W, css, e, ecran) {
  const H = W * 0.42; const r = H * 0.28;
  // gâchettes
  [['LT', 0.08], ['LB', 0.2], ['RB', 0.72], ['RT', 0.84]].forEach(([n, k]) => { const on = e.trig === n; ctx.fillStyle = on ? css : '#0b0b0a'; ctx.strokeStyle = on ? css : GRIS; ctx.fillRect(x + W * k, y - 7, W * 0.08, 7); ctx.strokeRect(x + W * k + 0.5, y - 6.5, W * 0.08 - 1, 6); texte(ctx, n, x + W * (k + 0.04), y - 10, on ? css : '#55534e', 8, 'center'); });
  ctx.fillStyle = '#0b0b0a'; ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.roundRect(x, y, W, H, r); ctx.fill(); ctx.stroke();
  // l'écran
  const sx = x + W * 0.25; const sy = y + H * 0.14; const sw = W * 0.5; const sh = H * 0.72;
  ctx.fillStyle = '#000'; ctx.fillRect(sx, sy, sw, sh); ctx.strokeStyle = SOMBRE; ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
  if (ecran) { ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ecran(sx, sy, sw, sh); ctx.restore(); }
  // sticks
  const stick = (cx, cy, v, on) => { const R = H * 0.12; ctx.strokeStyle = on ? css : GRIS; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = on ? css : '#55534e'; ctx.beginPath(); ctx.arc(cx + (v ? v[0] : 0) * R * 0.55, cy + (v ? v[1] : 0) * R * 0.55, R * 0.5, 0, Math.PI * 2); ctx.fill(); };
  const actifL = e.l && Math.hypot(e.l[0], e.l[1]) > 0.05; const actifR = e.r && Math.hypot(e.r[0], e.r[1]) > 0.05;
  stick(x + W * 0.125, y + H * 0.33, e.l, actifL); stick(x + W * 0.875, y + H * 0.7, e.r, actifR);
  // croix
  const dx = x + W * 0.125; const dy = y + H * 0.72; const d = H * 0.07; ctx.fillStyle = '#55534e'; ctx.fillRect(dx - d * 1.5, dy - d / 2, d * 3, d); ctx.fillRect(dx - d / 2, dy - d * 1.5, d, d * 3);
  // A B X Y
  const bx = x + W * 0.875; const by = y + H * 0.31; const b = H * 0.1;
  [['Y', 0, -1], ['X', -1, 0], ['B', 1, 0], ['A', 0, 1]].forEach(([n, i, j]) => { const on = e.btn === n; const px = bx + i * b * 1.15; const py = by + j * b * 1.15; ctx.fillStyle = on ? OR : '#000'; ctx.strokeStyle = on ? OR : GRIS; ctx.beginPath(); ctx.arc(px, py, b * 0.62, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); texte(ctx, n, px, py + 3, on ? '#000' : GRIS, Math.max(7, b * 0.8), 'center', '600 '); });
  return { sx, sy, sw, sh, H };
}
function go2Dessus (ctx, x, y, a, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
  ctx.fillStyle = ENCRE; ctx.fillRect(-10, -5, 20, 10); ctx.fillStyle = OR; ctx.fillRect(8, -2.5, 5, 5);
  ctx.fillStyle = '#55534e'; [[-8, -7.5], [6, -7.5], [-8, 5.5], [6, 5.5]].forEach(([u, v]) => ctx.fillRect(u, v, 3, 2));
  ctx.restore();
}
function go2Profil (ctx, x, y, s, css, debout = 1) {
  // de profil : le corps, la tête, quatre pattes ; le Raspberry Pi sur le dos
  const hp = 16 * s * (0.45 + 0.55 * debout);
  ctx.strokeStyle = ENCRE; ctx.lineWidth = 2;
  [[-14, 1], [-9, -1], [9, 1], [14, -1]].forEach(([u, k]) => { ctx.beginPath(); ctx.moveTo(x + u * s, y - hp); ctx.lineTo(x + u * s + k * 4 * s, y - hp / 2); ctx.lineTo(x + u * s, y); ctx.stroke(); });
  ctx.lineWidth = 1;
  ctx.fillStyle = ENCRE; ctx.fillRect(x - 18 * s, y - hp - 9 * s, 36 * s, 9 * s);
  ctx.fillRect(x + 17 * s, y - hp - 12 * s, 9 * s, 8 * s); ctx.fillStyle = OR; ctx.fillRect(x + 24 * s, y - hp - 9 * s, 3 * s, 3 * s);
  ctx.fillStyle = css; ctx.fillRect(x - 10 * s, y - hp - 14 * s, 16 * s, 5 * s);
}
// le monde de Billy : des couloirs, des portes, des objets ; chaque surface que le LiDAR touche devient un glyphe
const SPRITES = {};
function sprite (g, couleur) {
  const k = g + couleur; if (SPRITES[k]) return SPRITES[k];
  const c = document.createElement('canvas'); c.width = 8; c.height = 8;
  bits(c.getContext('2d'), SIG[g], 0, 0, 1, couleur); return (SPRITES[k] = c);
}
function mondeBilly (rnd) {
  const cles = Object.keys(SIG); const pts = [];
  const add = (x, y, z, surf) => pts.push({ x, y, z, surf, g: cles[Math.floor(rnd() * cles.length)], vu: -1 });
  // trois pièces reliées par des portes : 12 m × 10 m, murs de 2,4 m
  const murs = [[0, 0, 12, 0], [12, 0, 12, 10], [12, 10, 0, 10], [0, 10, 0, 0], [4, 0, 4, 6], [4, 8, 4, 10], [8, 0, 8, 2], [8, 4, 8, 10], [8, 5.5, 10.5, 5.5]];
  for (const [x0, z0, x1, z1] of murs) { const n = Math.round(Math.hypot(x1 - x0, z1 - z0) / 0.32); for (let i = 0; i <= n; i++) { const u = i / n; for (let k = 0; k < 7; k++) add(x0 + (x1 - x0) * u, 0.15 + k * 0.34, z0 + (z1 - z0) * u, 'mur'); } }
  for (let x = 0.3; x < 12; x += 0.6) for (let z = 0.3; z < 10; z += 0.6) add(x + (rnd() - 0.5) * 0.12, 0, z + (rnd() - 0.5) * 0.12, 'sol');
  const boite = (cx, cz, lx, ly, lz) => {
    for (let x = -lx / 2; x <= lx / 2 + 1e-6; x += 0.2) for (let z = -lz / 2; z <= lz / 2 + 1e-6; z += 0.2) add(cx + x, ly, cz + z, 'objet');
    for (let y = 0.1; y < ly; y += 0.22) { for (let x = -lx / 2; x <= lx / 2 + 1e-6; x += 0.22) { add(cx + x, y, cz - lz / 2, 'objet'); add(cx + x, y, cz + lz / 2, 'objet'); } for (let z = -lz / 2; z <= lz / 2 + 1e-6; z += 0.22) { add(cx - lx / 2, y, cz + z, 'objet'); add(cx + lx / 2, y, cz + z, 'objet'); } }
  };
  boite(1.8, 2.2, 1.4, 0.75, 0.8); boite(2.8, 8.9, 0.5, 0.45, 0.5); boite(10.3, 8, 1, 0.9, 0.8); boite(11.1, 9, 0.6, 0.6, 0.6); boite(9.6, 0.6, 1.6, 1.1, 0.5);
  for (let y = 0.1; y < 2.4; y += 0.24) for (let a = 0; a < 6.28; a += 0.55) add(6 + Math.cos(a) * 0.3, y, 5 + Math.sin(a) * 0.3, 'objet');
  return pts;
}
// une caméra : position, point visé, champ ; renvoie la projection à l'écran
function camera3d (pos, cible, w, h, fov) {
  const dx = cible[0] - pos[0]; const dy = cible[1] - pos[1]; const dz = cible[2] - pos[2];
  const yaw = Math.atan2(dx, dz); const pitch = Math.atan2(dy, Math.hypot(dx, dz));
  const cy = Math.cos(yaw); const sy = Math.sin(yaw); const cp = Math.cos(pitch); const sp = Math.sin(pitch);
  const f = h * 0.5 / Math.tan(fov / 2);
  return { f, w, h, p: (x, y, z) => { const X = x - pos[0]; const Y = y - pos[1]; const Z = z - pos[2]; const x1 = X * cy - Z * sy; const z1 = X * sy + Z * cy; const y2 = Y * cp - z1 * sp; const z2 = Y * sp + z1 * cp; return z2 < 0.15 ? null : [w / 2 - f * x1 / z2, h / 2 - f * y2 / z2, z2]; } };
}
// dessine les glyphes du monde, du plus loin au plus proche, dans un brouillard
function rendreMonde (ctx, cam, pts, t, css, o) {
  const liste = [];
  for (const p of pts) { if (!o.tout && p.vu < 0) continue; const q = cam.p(p.x, p.y, p.z); if (q) liste.push([q, p]); }
  liste.sort((a, b) => b[0][2] - a[0][2]);
  ctx.imageSmoothingEnabled = false;
  for (const [[sx, sy, z], p] of liste) {
    let s = Math.max(1.6, Math.min(13, cam.f * 0.085 / z)); let c = p.surf === 'mur' ? css : p.surf === 'objet' ? ENCRE : '#6f6c66';
    let al = Math.max(0, Math.min(1, 1.25 - z / o.portee)) * (p.surf === 'sol' ? 0.6 : 1);
    if (!o.tout && t - p.vu < 0.7) { const k = 1 - (t - p.vu) / 0.7; if (k > 0.6) c = OR; s *= 1 + k * 0.3; }
    if (o.teinte) { const tt = o.teinte(p); if (tt) { c = tt[0]; al = Math.max(al, tt[1]); } }
    if (al <= 0.02) continue;
    ctx.globalAlpha = al; ctx.drawImage(sprite(p.g, c), sx - s / 2, sy - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}
// le trajet de Billy dans le lieu
const CHEMIN = [[2, 9], [2.2, 7], [6, 7], [6, 3], [10, 3], [11.2, 4], [11.2, 7.5], [9.5, 9]];
function surChemin (s) {
  for (let i = 1; i < CHEMIN.length; i++) { const [ax, az] = CHEMIN[i - 1]; const [bx, bz] = CHEMIN[i]; const l = Math.hypot(bx - ax, bz - az); if (s <= l) return [ax + (bx - ax) * s / l, az + (bz - az) * s / l]; s -= l; }
  return CHEMIN[CHEMIN.length - 1];
}
function billy (ctx, w, h, t, etat, css, L) {
  const total = BI_DUREES.reduce((a, b) => a + b, 0); let ph = t % total; let actif = 0;
  while (ph >= BI_DUREES[actif]) { ph -= BI_DUREES[actif]; actif++; }
  const lisse = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const pad = 12;
  if (!etat.init) {
    etat.init = true;
    let s = 5; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    etat.monde = mondeBilly(rnd);
    // les pads : un grain d'une unité TEAMMATE.POTO accroché à une surface (mètres)
    etat.pads = [[1.8, 0.8, 2.2, 1, 7], [4, 1.4, 3, 2, 12], [6, 1.6, 5, 3, 3], [10.3, 0.95, 8, 1, 31], [12, 1.2, 2.5, 2, 18], [0, 1.0, 7.5, 3, 40]].map(([x, y, z, u, g]) => ({ x, y, z, u, g, v: 0 }));
    etat.paquets = []; etat.ondes = []; etat.chemin = [];
  }
  const cleEtape = actif + '/' + (etat.relance || 0);
  if (etat.dernier !== cleEtape) { etat.dernier = cleEtape; etat.rob = { x: 0.5, y: 0.6, a: -Math.PI / 2, debout: 0 }; etat.trace = []; etat.ondes = []; etat.cible = 0; etat.vise = -1; if (actif === 2) etat.chemin = []; }
  const e = { l: null, r: null, btn: null, trig: null };

  if (actif === 0) {
    // 1 · Deck → Pi (Wi-Fi) → Go2 (Ethernet) ; la vidéo et le scan reviennent
    const W = Math.min(w * 0.32, 220); const dx = pad + 6; const dy = h * 0.52;
    const dk = steamDeck(ctx, dx, dy, W, css, e, (sx, sy, sw, sh) => { texte(ctx, 'BILLY', sx + sw / 2, sy + sh * 0.45, css, Math.max(9, sw * 0.12), 'center', '600 '); texte(ctx, '[A] ' + L.connecter, sx + sw / 2, sy + sh * 0.72, GRIS, Math.max(7, sw * 0.06), 'center'); });
    texte(ctx, 'STEAM DECK', dx + W / 2, dy + dk.H + 18, ENCRE, 10, 'center', '600 ');
    texte(ctx, L.modeJeu, dx + W / 2, dy + dk.H + 31, GRIS, 9, 'center');
    const pix = w * 0.56; const piy = h * 0.3;
    const montrePi = lisse((ph - 2) / 1.5);
    ctx.globalAlpha = montrePi;
    ctx.strokeStyle = css; ctx.strokeRect(pix - 34, piy - 14, 68, 28); texte(ctx, 'RASPBERRY PI', pix, piy + 4, css, 9, 'center', '600 ');
    texte(ctx, L.surBilly, pix, piy - 22, GRIS, 9, 'center');
    L.ponts.forEach((p, i) => texte(ctx, p, pix, piy + 32 + i * 13, '#6f6c66', 9, 'center'));
    ctx.globalAlpha = 1;
    const gx = w * 0.82; const gy = h * 0.82;
    const montreGo = lisse((ph - 4) / 1.5);
    ctx.globalAlpha = montreGo; go2Profil(ctx, gx, gy, Math.min(1.6, w / 300), css, 1); texte(ctx, 'BILLY · UNITREE GO2', gx, gy + 16, ENCRE, 10, 'center', '600 '); ctx.globalAlpha = 1;
    // les liaisons
    const A = [dx + W, dy + dk.H * 0.3]; const B = [pix - 34, piy]; const C = [pix + 34, piy]; const D = [gx - 8, gy - 40];
    ctx.setLineDash([3, 4]); ctx.strokeStyle = css; ctx.globalAlpha = montrePi * 0.7; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.quadraticCurveTo((A[0] + B[0]) / 2, A[1] - 30, B[0], B[1]); ctx.stroke();
    ctx.globalAlpha = montreGo * 0.7; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(D[0], D[1]); ctx.stroke(); ctx.globalAlpha = 1;
    if (montrePi > 0.5) texte(ctx, 'Wi-Fi', (A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 18, GRIS, 9, 'center', 'italic ');
    if (montreGo > 0.5) texte(ctx, 'Ethernet', (C[0] + D[0]) / 2 + 8, (C[1] + D[1]) / 2, GRIS, 9, 'left', 'italic ');
    if (ph > 6 && Math.floor(t * 2) !== etat.tick) { etat.tick = Math.floor(t * 2); etat.paquets.push({ k: 0, aller: true }); if (ph > 9) etat.paquets.push({ k: 0, aller: false }); }
    etat.paquets = etat.paquets.filter((p) => (p.k += etat.dt * 0.6) < 1);
    for (const p of etat.paquets) {
      const u = p.aller ? p.k : 1 - p.k; let x; let y;
      if (u < 0.5) { const v = u * 2; x = (1 - v) * (1 - v) * A[0] + 2 * (1 - v) * v * (A[0] + B[0]) / 2 + v * v * B[0]; y = (1 - v) * (1 - v) * A[1] + 2 * (1 - v) * v * (A[1] - 30) + v * v * B[1]; } else { const v = (u - 0.5) * 2; x = C[0] + (D[0] - C[0]) * v; y = C[1] + (D[1] - C[1]) * v; }
      ctx.fillStyle = p.aller ? css : GRIS; ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    if (ph > 9) { texte(ctx, '→ ' + L.ordres, pad, h - 26, css, 9); texte(ctx, '← ' + L.retours, pad, h - 12, GRIS, 9); }
  } else if (actif === 1) {
    // 2 · conduire : les sticks bougent, Billy suit
    const salle = { x: pad + 20, y: 34, w: w - pad * 2 - 40, h: h * 0.5 - 30 };
    ctx.strokeStyle = SOMBRE; ctx.strokeRect(salle.x, salle.y, salle.w, salle.h);
    const r = etat.rob; let vx = 0; let vy = 0; let vr = 0; let ordre = '';
    if (ph < 3.5) { e.btn = 'A'; r.debout = Math.min(1, r.debout + etat.dt); ordre = 'A · ' + L.postures[0]; }
    else if (ph < 9) { e.l = [0, -0.9]; e.r = [Math.sin((ph - 3.5) * 0.9) * 0.8, 0]; vx = 0.09; vr = e.r[0] * 0.9; ordre = L.sticks[0]; }
    else if (ph < 13) { e.l = [0.85, 0]; vy = 0.08; ordre = L.sticks[1]; }
    else if (ph < 15.5) { e.btn = 'X'; ordre = 'X · ' + L.postures[2]; }
    else if (ph < 18) { e.btn = 'B'; r.debout = Math.max(0.2, r.debout - etat.dt); ordre = 'B · ' + L.postures[1]; }
    else { e.trig = 'RT'; ordre = 'RT · STOP'; }
    r.a += vr * etat.dt; r.x += (Math.cos(r.a) * vx - Math.sin(r.a) * vy) * etat.dt; r.y += (Math.sin(r.a) * vx + Math.cos(r.a) * vy) * etat.dt;
    r.x = Math.max(0.06, Math.min(0.94, r.x)); r.y = Math.max(0.1, Math.min(0.9, r.y));
    const rx = salle.x + r.x * salle.w; const ry = salle.y + r.y * salle.h;
    etat.trace.push([rx, ry]); if (etat.trace.length > 400) etat.trace.shift();
    ctx.strokeStyle = css; ctx.globalAlpha = 0.45; ctx.beginPath(); etat.trace.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.globalAlpha = 1;
    go2Dessus(ctx, rx, ry, r.a, 1.2 + r.debout * 0.6);
    if (e.trig === 'RT') { ctx.strokeStyle = OR; ctx.strokeRect(rx - 16, ry - 16, 32, 32); }
    const W = Math.min(w - pad * 2 - 20, (h * 0.42) / 0.42 * 0.95, 360); const dx = (w - W) / 2; const dy = h - W * 0.42 - 34;
    steamDeck(ctx, dx, dy, W, css, e, (sx, sy, sw, sh) => { const mot = ordre.toUpperCase(); let tl = Math.max(7, sw * 0.07); ctx.font = `${tl}px 'IBM Plex Mono', monospace`; while (tl > 6 && ctx.measureText(mot).width > sw - 12) { tl -= 0.5; ctx.font = `${tl}px 'IBM Plex Mono', monospace`; } texte(ctx, mot, sx + sw / 2, sy + sh / 2 + 3, e.btn || e.trig ? OR : css, tl, 'center'); });
    texte(ctx, ordre, w / 2, h - 12, e.btn || e.trig ? OR : css, 10, 'center', 'italic ');
  } else if (actif === 2) {
    // 3 · voir : à la première personne, le monde s'écrit en glyphes à mesure que Billy avance ; puis on prend de la hauteur
    if (etat.vuCycle !== cleEtape) { etat.vuCycle = cleEtape; etat.monde.forEach((p) => { p.vu = -1; }); etat.chemin = []; etat.sDernier = null; }
    const sb = ph * 1.05; const [bx, bz] = surChemin(sb); const [ax, az] = surChemin(sb + 1.6);
    etat.chemin.push([bx, bz]); if (etat.chemin.length > 900) etat.chemin.shift();
    // le LiDAR : ce qui est à portée et devant (ou autour, vu d'en haut) devient glyphe
    const fx = ax - bx; const fz = az - bz; const fl = Math.hypot(fx, fz) || 1; let nouveaux = 0;
    for (const p of etat.monde) { if (p.vu >= 0) continue; const dx = p.x - bx; const dz = p.z - bz; const d = Math.hypot(dx, dz); if (d < 5.2 && (dx * fx + dz * fz) / fl > -0.4 * d && nouveaux < 70) { p.vu = t; nouveaux++; } }
    // rattrapage : si l'image a sauté, ce que Billy a croisé en chemin est déjà scanné
    for (let s2 = (etat.sDernier ?? sb) + 0.6; s2 < sb - 0.6; s2 += 0.6) { const [cx2, cz2] = surChemin(s2); for (const p of etat.monde) if (p.vu < 0 && Math.hypot(p.x - cx2, p.z - cz2) < 4) p.vu = t - 1; }
    etat.sDernier = sb;
    const k = lisse((ph - 11) / 4.5);
    const mix = (a, b) => a.map((v, i) => v + (b[i] - v) * k);
    const pos = mix([bx, 0.6, bz], [6, 12.5, 17]); const cible = mix([ax, 0.35, az], [6, 0, 4.6]);
    const cam = camera3d(pos, cible, w, h, 1.25 - 0.4 * k);
    rendreMonde(ctx, cam, etat.monde, t, css, { portee: 7 + 18 * k });
    // les rayons du LiDAR vers les glyphes qui viennent de naître
    if (k < 0.3) { ctx.strokeStyle = css; ctx.globalAlpha = 0.18; ctx.beginPath(); let n = 0; for (const p of etat.monde) { if (t - p.vu < 0.12 && n < 24) { const q = cam.p(p.x, p.y, p.z); if (q) { ctx.moveTo(w / 2, h * 0.98); ctx.lineTo(q[0], q[1]); n++; } } } ctx.stroke(); ctx.globalAlpha = 1; }
    // vu d'en haut : Billy et son trajet
    if (k > 0.3) {
      ctx.strokeStyle = css; ctx.globalAlpha = 0.5 * k; ctx.beginPath(); let premier = true; for (const [x, z] of etat.chemin) { const q = cam.p(x, 0.05, z); if (!q) continue; premier ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); premier = false; } ctx.stroke(); ctx.globalAlpha = 1;
      const q = cam.p(bx, 0.3, bz); if (q) { go2Dessus(ctx, q[0], q[1], Math.atan2(az - bz, ax - bx) * 0.5, 0.9); texte(ctx, 'BILLY', q[0], q[1] - 12, ENCRE, 9, 'center', '600 '); }
    }
    // la vraie caméra, en vignette, quand on est dans ses yeux
    if (k < 0.5) {
      const PAL = ['#c8beaa', '#5a5046', '#2858dc', '#e6e6f0', '#e63c3c', '#f0c83c', '#28be78', '#00c8ff'];
      const cw = 96; const chh = 60; const x = w - pad - cw; const y = 34; const n = 12; const cs = cw / n; const m = Math.round(chh / cs);
      ctx.globalAlpha = 1 - k * 2;
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const c = j < m * 0.45 ? (i < n * 0.3 ? 3 : i > n * 0.75 ? 2 : 0) : j > m * 0.8 ? 1 : (i > n * 0.4 && i < n * 0.65 && j < m * 0.7 ? 4 : 0); ctx.fillStyle = PAL[(c + ((i + j + Math.floor(t * 0.5)) % 7 === 0 ? 5 : 0)) % PAL.length]; ctx.fillRect(x + i * cs, y + j * cs, cs - 0.5, cs - 0.5); }
      ctx.strokeStyle = GRIS; ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, chh - 1); texte(ctx, 'RB · ' + L.camera, x, y + chh + 12, GRIS, 9); ctx.globalAlpha = 1;
    }
    texte(ctx, k < 0.5 ? L.scanGlyphes : 'LT · ' + L.visite, pad, h - 12, k < 0.5 ? css : OR, 10);
  } else if (actif === 3) {
    // 4 · pads : on tourne lentement dans le lieu ; les grains de TEAMMATE.POTO habitent les surfaces
    const a = 0.6 + ph * 0.05;
    const cam = camera3d([6 + Math.cos(a) * 9.5, 9, 5 + Math.sin(a) * 8.5], [6, 0.3, 5], w, h, 1.0);
    const per = 3.2; const idx = Math.floor(ph / per) % etat.pads.length; const u = (ph % per) / per;
    const pa = etat.pads[(idx + etat.pads.length - 1) % etat.pads.length]; const pb = etat.pads[idx];
    if (u > 0.5 && etat.vise !== Math.floor(ph / per)) { etat.vise = Math.floor(ph / per); pb.v = 1; etat.ondes.push({ x: pb.x, y: pb.y, z: pb.z, r: 0 }); }
    etat.ondes = etat.ondes.filter((o) => (o.r += etat.dt * 1.6) < 3.2);
    const onde = etat.ondes[etat.ondes.length - 1];
    rendreMonde(ctx, cam, etat.monde, t, css, { tout: true, portee: 16, teinte: (p) => {
      if (onde) { const d = Math.hypot(p.x - onde.x, p.y - onde.y, p.z - onde.z); if (Math.abs(d - onde.r) < 0.28) return [OR, 1]; }
      for (const q of etat.pads) { if (Math.abs(p.x - q.x) < 0.6 && Math.abs(p.z - q.z) < 0.6 && Math.abs(p.y - q.y) < 0.6) return [UNITES[q.u], 0.5 + 0.4 * Math.sin(t * 2 + q.g) + q.v * 0.3]; }
      return null;
    } });
    etat.pads.forEach((p) => { p.v = Math.max(0, p.v - etat.dt * 0.8); const q = cam.p(p.x, p.y + 0.5, p.z); if (q) texte(ctx, String(p.u).padStart(2, '0') + String(p.g).padStart(2, '0'), q[0], q[1], p.v > 0.1 ? OR : UNITES[p.u], 10, 'center', '600 '); });
    const qa = cam.p(pa.x, pa.y, pa.z); const qb = cam.p(pb.x, pb.y, pb.z);
    if (qa && qb) {
      const m = lisse(u / 0.45); const vx = qa[0] + (qb[0] - qa[0]) * m; const vy = qa[1] + (qb[1] - qa[1]) * m;
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.moveTo(vx - 14, vy); ctx.lineTo(vx - 5, vy); ctx.moveTo(vx + 5, vy); ctx.lineTo(vx + 14, vy); ctx.moveTo(vx, vy - 14); ctx.lineTo(vx, vy - 5); ctx.moveTo(vx, vy + 5); ctx.lineTo(vx, vy + 14); ctx.stroke();
      if (u > 0.5 && u < 0.75) texte(ctx, 'A', vx + 16, vy - 8, OR, 11, 'left', '600 ');
    }
    [1, 2, 3].forEach((n, i) => { ctx.fillStyle = UNITES[n]; ctx.fillRect(w - pad - 150 + i * 52, 30, 8, 8); texte(ctx, L.unite + ' ' + n, w - pad - 138 + i * 52, 38, GRIS, 9); });
    texte(ctx, L.norns48, w - pad, 54, GRIS, 9, 'right');
    texte(ctx, L.resonne, pad, h - 12, OR, 10);
  } else {
    // 5 · séquences : le plan vu de dessus, des liens entre les sons, une impulsion à l'horloge commune
    const x0 = pad + 30; const y0 = 44; const S = Math.min(w - pad * 2 - 180, (h - 110) * 1.2);
    const P = (p) => [x0 + p.x / 12 * S, y0 + p.z / 12 * S];
    etat.monde.forEach((p) => { if (p.surf === 'sol' || (p.surf === 'mur' && p.y > 0.2)) return; const [x, y] = P(p); ctx.fillStyle = p.surf === 'objet' ? '#6f6c66' : '#3c3b38'; ctx.fillRect(x - 1, y - 1, 2, 2); });
    ctx.strokeStyle = SOMBRE; ctx.strokeRect(x0, y0, S, S * 10 / 12);
    const seqA = [0, 3, 1, 5, 2, 4];
    const bpm = 120; const temps = t * bpm / 60; const pas = Math.floor(temps) % seqA.length; const fr = temps % 1;
    const nLie = Math.min(seqA.length, 1 + Math.floor(ph / 1.8));
    ctx.setLineDash([4, 4]); ctx.strokeStyle = css;
    for (let i = 1; i < nLie; i++) { const [ax, ay] = P(etat.pads[seqA[i - 1]]); const [bx, by] = P(etat.pads[seqA[i]]); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
    if (nLie === seqA.length) { const [ax, ay] = P(etat.pads[seqA[seqA.length - 1]]); const [bx, by] = P(etat.pads[seqA[0]]); ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.setLineDash([]);
    const joue = nLie === seqA.length;
    etat.pads.forEach((p, i) => { const [x, y] = P(p); const on = joue && seqA[pas] === i; const c = UNITES[p.u]; ctx.fillStyle = on ? OR : c; ctx.globalAlpha = on ? 1 : 0.7; ctx.beginPath(); ctx.arc(x, y, on ? 9 - fr * 3 : 6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; texte(ctx, String(p.u).padStart(2, '0') + String(p.g).padStart(2, '0'), x, y - 12, on ? OR : GRIS, 9, 'center'); });
    if (joue) { const [ax, ay] = P(etat.pads[seqA[pas]]); const [bx, by] = P(etat.pads[seqA[(pas + 1) % seqA.length]]); ctx.fillStyle = OR; ctx.fillRect(ax + (bx - ax) * fr - 2, ay + (by - ay) * fr - 2, 4, 4); }
    // les 16 pas de la séquence A
    const cw = Math.min(14, (S - 30) / 16); texte(ctx, 'A', x0, h - 30, css, 10, 'left', '600 ');
    for (let i = 0; i < 16; i++) { const on = joue && i % seqA.length === pas && i < seqA.length; ctx.fillStyle = i < nLie ? (on ? OR : UNITES[etat.pads[seqA[i]].u]) : SOMBRE; ctx.globalAlpha = i < nLie && !on ? 0.5 : 1; ctx.fillRect(x0 + 16 + i * (cw + 3), h - 40, cw, 12); }
    ctx.globalAlpha = 1;
    // les Norns, chacun joue ses pas
    const nx = w - pad - 108;
    [1, 2, 3].forEach((n, i) => { const on = joue && etat.pads[seqA[pas]].u === n && fr < 0.5; const y = 60 + i * 40; ctx.strokeStyle = on ? OR : UNITES[n]; ctx.strokeRect(nx, y, 94, 32); texte(ctx, 'TEAMMATE.POTO', nx + 47, y + 13, on ? OR : UNITES[n], 9, 'center', '600 '); texte(ctx, L.unite + ' ' + n, nx + 47, y + 26, on ? OR : UNITES[n], 9, 'center'); });
    texte(ctx, L.horloge + ' · ' + bpm + ' BPM', nx + 94, 60 + 3 * 40 + 6, GRIS, 9, 'right');
    texte(ctx, L.relais, nx + 94, 60 + 3 * 40 + 20, '#6f6c66', 9, 'right');
  }
  texte(ctx, L.titresBi[actif], pad, 20, css, 11, 'left', '600 ');
  return { info: L.billy, actif };
}

// ---------------------------------------------------------------- SERVICES : une animation par service, en trois temps
const SV_D = [16, 16, 16];
const hsh = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const lis = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
function oscillo (ctx, x, y, w, h, f, coul = OR) {
  ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = SOMBRE; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = coul; ctx.beginPath(); for (let i = 0; i <= w; i += 2) { const v = Math.max(-1, Math.min(1, f(i / w))); const yy = y + h / 2 - v * (h / 2 - 3); i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy); } ctx.stroke();
}
function boite (ctx, x, y, w, h, coul = ENCRE, fond = '#000') { ctx.fillStyle = fond; ctx.fillRect(x, y, w, h); ctx.strokeStyle = coul; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
function bouton (ctx, x, y, r, a, coul = ENCRE) { ctx.strokeStyle = coul; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.stroke(); }
function personnage (ctx, x, y, s, t, coul = ENCRE, ampl = 1) {
  // un corps en mouvement : tête, buste, bras, jambes ; renvoie les poignets et chevilles
  const a = Math.sin(t * 2.4) * ampl; const b = Math.sin(t * 2.4 + 1.6) * ampl;
  const cou = [x, y - 46 * s]; const bassin = [x + a * 3 * s, y - 16 * s];
  const main1 = [cou[0] - (16 + 10 * a) * s, cou[1] + (6 - 22 * Math.max(0, a)) * s]; const main2 = [cou[0] + (16 + 10 * b) * s, cou[1] + (6 - 22 * Math.max(0, b)) * s];
  const pied1 = [bassin[0] - (8 + 6 * b) * s, y + 14 * s]; const pied2 = [bassin[0] + (8 + 6 * a) * s, y + 14 * s];
  ctx.strokeStyle = coul; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cou[0], cou[1]); ctx.lineTo(bassin[0], bassin[1]);
  ctx.moveTo(cou[0], cou[1] + 4 * s); ctx.lineTo(main1[0], main1[1]); ctx.moveTo(cou[0], cou[1] + 4 * s); ctx.lineTo(main2[0], main2[1]);
  ctx.moveTo(bassin[0], bassin[1]); ctx.lineTo(pied1[0], pied1[1]); ctx.moveTo(bassin[0], bassin[1]); ctx.lineTo(pied2[0], pied2[1]); ctx.stroke();
  ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cou[0], cou[1] - 9 * s, 7 * s, 0, Math.PI * 2); ctx.stroke();
  return [main1, main2, pied1, pied2];
}
function rampe (ctx, x, y, w, h, coul) { const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, coul); g.addColorStop(1, 'rgba(0,0,0,0)'); return g; }

const SV = {
  // ---- data visualisation & data intelligence : mesurer, structurer, donner forme
  'sv-data': [
    (ctx, w, h, t, ph, s, css, m) => {
      const mx = w * 0.16; const base = h * 0.78;
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.moveTo(mx, base); ctx.lineTo(mx, base - 150); ctx.stroke();
      for (let k = 0; k < 3; k++) { const a = t * 4 + k * 2.1; ctx.beginPath(); ctx.moveTo(mx, base - 150); ctx.lineTo(mx + Math.cos(a) * 16, base - 150 + Math.sin(a) * 5); ctx.stroke(); ctx.beginPath(); ctx.arc(mx + Math.cos(a) * 16, base - 150 + Math.sin(a) * 5, 3, 0, Math.PI * 2); ctx.stroke(); }
      boite(ctx, mx - 10, base - 90, 20, 16, css); boite(ctx, mx - 10, base - 60, 20, 16, css);
      texte(ctx, m[0], mx, base + 18, css, 10, 'center');
      const cols = 5;
      for (let c = 0; c < cols; c++) for (let k = 0; k < 14; k++) {
        const u = ((ph * 0.18 + k / 14 + c * 0.13) % 1); const x = mx + 30 + u * (w * 0.8 - 30); const y = base - 150 + c * 28 + Math.sin(k + c) * 4;
        const v = (18 + 9 * Math.sin(k * 0.7 + c + t * 0.6)).toFixed(1); ctx.globalAlpha = Math.min(1, u * 4) * (1 - u * 0.6); texte(ctx, v, x, y, c === 2 ? OR : GRIS, 9);
      }
      ctx.globalAlpha = 1; texte(ctx, m[1], w * 0.9, base + 18, GRIS, 10, 'right');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.1; const y0 = h * 0.2; const nx = 14; const ny = 7; const c = Math.min((w * 0.8) / nx, (h * 0.42) / ny);
      const n = Math.floor(lis(ph / 8) * nx * ny);
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const k = i * ny + j; const v = 0.5 + 0.5 * Math.sin(i * 0.5 + j * 0.8 + t * 0.4);
        if (k < n) { ctx.fillStyle = css; ctx.globalAlpha = 0.15 + v * 0.75; ctx.fillRect(x0 + i * c + 1, y0 + j * c + 1, c - 2, c - 2); } else { ctx.globalAlpha = 0.6; texte(ctx, '·', x0 + i * c + c / 2, y0 + j * c + c / 2 + 3, SOMBRE, 10, 'center'); }
      }
      ctx.globalAlpha = 1;
      const yb = y0 + ny * c + 30; const k = lis((ph - 6) / 6);
      ctx.strokeStyle = OR; ctx.beginPath(); for (let i = 0; i <= nx * k; i += 0.25) { const v = 0.5 + 0.5 * Math.sin(i * 0.5 + 3 * 0.8 + t * 0.4); const x = x0 + i * c; const y = yb + 50 - v * 50; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      texte(ctx, m[2], x0, y0 - 10, GRIS, 10);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cles = Object.keys(SIG); const nx = 22; const c = (w * 0.86) / nx; const base = h * 0.84;
      for (let i = 0; i < nx; i++) {
        const v = 0.5 + 0.5 * Math.sin(i * 0.45 + t * 0.5) * Math.cos(i * 0.13 - t * 0.2); const n = 1 + Math.floor(v * 8 * lis(ph / 5));
        for (let j = 0; j < n; j++) { const g = cles[(i * 7 + j * 3) % cles.length]; bits(ctx, SIG[g], w * 0.07 + i * c, base - (j + 1) * c, c / 9, j > 6 ? OR : css); }
      }
      texte(ctx, m[3], w / 2, h * 0.16, ENCRE, 11, 'center', 'italic ');
    },
  ],
  // ---- consulting en creative technology : l'idée, trois mondes, la feuille de route
  'sv-conseil': [
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const cy = h * 0.5; const r = 30 + lis(ph / 4) * 40;
      ctx.setLineDash([4, 5]); ctx.strokeStyle = css; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      texte(ctx, '?', cx, cy + 14, OR, 40, 'center', '600 ');
      for (let k = 0; k < 9; k++) { const a = k * 0.7 + t * 0.15; const d = r + 30 + hsh(k) * 70; const u = lis((ph - 1 - k * 0.6) / 1.5); ctx.globalAlpha = u; texte(ctx, m[k % 4 + 1], cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.7, GRIS, 10, 'center'); }
      ctx.globalAlpha = 1; texte(ctx, m[0], cx, h * 0.88, ENCRE, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const cy = h * 0.5; const k = lis(ph / 6); const d = 110 - k * 60; const r = Math.min(w, h) * 0.2;
      const C = [[cx - d * 0.87, cy + d * 0.5, css, m[5]], [cx + d * 0.87, cy + d * 0.5, ENCRE, m[6]], [cx, cy - d, GRIS, m[7]]];
      C.forEach(([x, y, c, n]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); texte(ctx, n.toUpperCase(), x + (x - cx) * 0.6, y + (y - cy) * 0.6 + 4, c, 10, 'center', '600 '); });
      if (k > 0.9) { ctx.fillStyle = OR; ctx.globalAlpha = 0.5 + 0.4 * Math.sin(t * 3); ctx.beginPath(); ctx.arc(cx, cy + 4, 10, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; texte(ctx, m[8], cx, cy + 34, OR, 10, 'center'); }
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.1; const x1 = w * 0.9; const y = h * 0.5; const etapes = m.slice(9, 13); const u = lis(ph / 12);
      ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.strokeStyle = css; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * u, y); ctx.stroke();
      etapes.forEach((e, i) => { const x = x0 + (x1 - x0) * i / 3; const on = u >= i / 3 - 0.01; ctx.fillStyle = on ? css : '#000'; ctx.strokeStyle = on ? css : GRIS; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); texte(ctx, e, x, y + (i % 2 ? -18 : 28), on ? ENCRE : GRIS, 10, 'center'); });
      ctx.fillStyle = OR; ctx.fillRect(x0 + (x1 - x0) * u - 3, y - 3, 6, 6);
    },
  ],
  // ---- direction artistique : références, choix, univers
  'sv-da': [
    (ctx, w, h, t, ph, s, css, m) => {
      const n = 3; const c = Math.min(w, h) * 0.22; const x0 = w / 2 - c * 1.6; const y0 = h / 2 - c * 1.6;
      for (let i = 0; i < 9; i++) {
        const x = x0 + (i % n) * c * 1.1; const y = y0 + Math.floor(i / n) * c * 1.1; const u = lis((ph - i * 0.5) / 0.8); if (u <= 0) continue;
        ctx.globalAlpha = u; ctx.strokeStyle = SOMBRE; ctx.strokeRect(x, y, c, c);
        const k = i % 4; ctx.strokeStyle = [GRIS, css, ENCRE, OCRE][k]; ctx.fillStyle = ctx.strokeStyle;
        if (k === 0) for (let l = 0; l < c; l += 6) { ctx.beginPath(); ctx.moveTo(x + l, y); ctx.lineTo(x, y + l); ctx.stroke(); }
        else if (k === 1) for (let a = 4; a < c; a += 9) for (let b = 4; b < c; b += 9) ctx.fillRect(x + a, y + b, 2, 2);
        else if (k === 2) bits(ctx, SIG[Object.keys(SIG)[i]], x + c * 0.2, y + c * 0.2, c * 0.075, ENCRE);
        else { ctx.beginPath(); ctx.arc(x + c / 2, y + c / 2, c * 0.3, 0, Math.PI * 2); ctx.stroke(); }
      }
      ctx.globalAlpha = 1; texte(ctx, m[0], w / 2, h * 0.92, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cols = [css, OR, ENCRE, OCRE, '#72dec2']; const y = h * 0.28; const c = 34; const x0 = w / 2 - cols.length * (c + 8) / 2;
      const choix = Math.floor(ph / 3) % cols.length;
      cols.forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(x0 + i * (c + 8), y, c, c); if (i === choix) { ctx.strokeStyle = ENCRE; ctx.strokeRect(x0 + i * (c + 8) - 4, y - 4, c + 8, c + 8); } });
      texte(ctx, m[1], x0, y - 12, GRIS, 10);
      texte(ctx, 'Aa', w * 0.3, h * 0.62, cols[choix], 54, 'center', '600 '); texte(ctx, m[2], w * 0.3, h * 0.72, GRIS, 10, 'center');
      oscillo(ctx, w * 0.52, h * 0.5, w * 0.36, 60, (u) => Math.sin(u * 30 + t * 4) * (0.4 + 0.4 * Math.sin(u * 4 + t)), cols[choix]); texte(ctx, m[3], w * 0.7, h * 0.72, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const hor = h * 0.62;
      ctx.fillStyle = OR; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(w * 0.68, hor - 40 - Math.sin(t * 0.3) * 10, 34, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = css; ctx.beginPath(); ctx.moveTo(w * 0.08, hor); ctx.lineTo(w * 0.92, hor); ctx.stroke();
      const cles = Object.keys(SIG); for (let i = 0; i < 6; i++) { const g = cles[(i * 5 + 2) % cles.length]; const sz = 2.4 + hsh(i) * 2.6; bits(ctx, SIG[g], w * 0.1 + i * w * 0.12, hor - sz * 8 - 2, sz, i % 2 ? css : ENCRE); }
      for (let k = 0; k < 6; k++) { const y = hor + 12 + k * 12; ctx.strokeStyle = css; ctx.globalAlpha = 0.6 - k * 0.09; ctx.beginPath(); for (let x = w * 0.08; x <= w * 0.92; x += 4) { const yy = y + Math.sin(x * 0.04 + t * 2 + k) * (2 + k); x === w * 0.08 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
      ctx.globalAlpha = 1; texte(ctx, m[4], w / 2, h * 0.16, ENCRE, 11, 'center', 'italic ');
    },
  ],
  // ---- digital art : l'espace, la lumière et le son, le public agit
  'sv-digital': [
    (ctx, w, h, t, ph, s, css, m) => {
      const P = (x, y, z = 0) => [w / 2 + (x - y) * w * 0.32, h * 0.38 + (x + y) * h * 0.22 - z * h * 0.35];
      const sol = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => P(x, y));
      ctx.strokeStyle = GRIS; ctx.beginPath(); sol.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
      [[0, 0], [1, 0], [0, 1]].forEach(([x, y]) => { const a = P(x, y); const b = P(x, y, 1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
      const ht = [P(1, 0, 1), P(0, 0, 1), P(0, 1, 1)]; ctx.beginPath(); ht.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      for (let i = 0; i < 9; i++) { const x = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.3 + i * 2.1)); const y = 0.2 + 0.6 * (0.5 + 0.5 * Math.cos(t * 0.25 + i * 1.3)); const [px, py] = P(x, y); ctx.fillStyle = ENCRE; ctx.beginPath(); ctx.arc(px, py - 3, 3, 0, Math.PI * 2); ctx.fill(); }
      texte(ctx, m[0], w / 2, h * 0.93, GRIS, 10, 'center');
      s.P = P;
    },
    (ctx, w, h, t, ph, s, css, m) => {
      SV['sv-digital'][0](ctx, w, h, t, 0, s, css, ['']);
      const P = s.P; const u = lis(ph / 3);
      [[P(0.1, 0.9, 1), [P(0.2, 0, 0.9), P(0.9, 0, 0.9), P(0.9, 0, 0.1), P(0.2, 0, 0.1)]], [P(0.9, 0.1, 1), [P(0, 0.2, 0.9), P(0, 0.9, 0.9), P(0, 0.9, 0.1), P(0, 0.2, 0.1)]]].forEach(([src, q], i) => {
        ctx.fillStyle = css; ctx.globalAlpha = 0.12 * u * (0.7 + 0.3 * Math.sin(t * 2 + i)); ctx.beginPath(); ctx.moveTo(src[0], src[1]); ctx.lineTo(q[0][0], q[0][1]); ctx.lineTo(q[3][0], q[3][1]); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(src[0], src[1]); ctx.lineTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0], q[2][1]); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 0.5 * u; ctx.beginPath(); q.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = ENCRE; ctx.fillRect(src[0] - 5, src[1] - 4, 10, 8);
      });
      for (let k = 0; k < 3; k++) { const r = ((ph * 30 + k * 18) % 54) + 6; const c = P(1, 1, 0.1); ctx.strokeStyle = OR; ctx.globalAlpha = 1 - r / 60; ctx.beginPath(); ctx.arc(c[0], c[1], r, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke(); }
      ctx.globalAlpha = 1; texte(ctx, m[1], w / 2, h * 0.08, css, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      SV['sv-digital'][1](ctx, w, h, t, 6, s, css, ['', '']);
      const P = s.P;
      for (let i = 0; i < 9; i++) { const x = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.3 + i * 2.1)); const y = 0.2 + 0.6 * (0.5 + 0.5 * Math.cos(t * 0.25 + i * 1.3)); const [px, py] = P(x, y); const r = ((t * 20 + i * 7) % 26); ctx.strokeStyle = OR; ctx.globalAlpha = 1 - r / 26; ctx.beginPath(); ctx.ellipse(px, py, r, r * 0.5, 0, 0, Math.PI * 2); ctx.stroke();
        const mur = P(0.2 + x * 0.7, 0, 0.2 + 0.6 * (1 - y)); ctx.globalAlpha = 0.8; ctx.fillStyle = OR; ctx.fillRect(mur[0] - 3, mur[1] - 3, 6, 6); }
      ctx.globalAlpha = 1; texte(ctx, m[2], w / 2, h * 0.93, OR, 10, 'center');
    },
  ],
  // ---- créations physiques sur mesure : dessiner, fabriquer, assembler les matières
  'sv-physique': [
    (ctx, w, h, t, ph, s, css, m) => {
      const a = t * 0.5; const cx = w / 2; const cy = h * 0.5; const L = Math.min(w, h) * 0.22;
      const V = [[-1, -0.5, -0.7], [1, -0.5, -0.7], [1, 0.5, -0.7], [-1, 0.5, -0.7], [-1, -0.5, 0.7], [1, -0.5, 0.7], [1, 0.5, 0.7], [-1, 0.5, 0.7]].map(([x, y, z]) => { const X = x * Math.cos(a) - z * Math.sin(a); const Z = x * Math.sin(a) + z * Math.cos(a); return [cx + X * L, cy + y * L + Z * L * 0.35]; });
      ctx.strokeStyle = css; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(V[i][0], V[i][1]); ctx.lineTo(V[j][0], V[j][1]); ctx.stroke(); });
      ctx.strokeStyle = GRIS; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(cx - L, cy + L * 0.9); ctx.lineTo(cx + L, cy + L * 0.9); ctx.stroke(); ctx.setLineDash([]);
      texte(ctx, '240 mm', cx, cy + L * 0.9 + 14, GRIS, 9, 'center'); texte(ctx, m[0], cx, h * 0.12, ENCRE, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.18; const y0 = h * 0.2; const W = w * 0.64; const H = h * 0.55;
      ctx.fillStyle = '#141311'; ctx.fillRect(x0, y0, W, H); ctx.strokeStyle = OCRE; ctx.strokeRect(x0, y0, W, H);
      const tour = (u) => { const k = Math.floor(u * 4); const v = u * 4 - k; const ins = 18 + k * 18; const L = [[ins, ins], [W - ins, ins], [W - ins, H - ins], [ins, H - ins], [ins, ins]]; const q = v * 4; const i = Math.floor(q); const f = q - i; return [x0 + L[i][0] + (L[i + 1][0] - L[i][0]) * f, y0 + L[i][1] + (L[i + 1][1] - L[i][1]) * f]; };
      const u = Math.min(0.999, ph / 15); ctx.strokeStyle = OR; ctx.beginPath(); for (let k = 0; k <= u; k += 0.002) { const [x, y] = tour(k); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      const [fx, fy] = tour(u); ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(fx, fy, 7, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI * 2); ctx.stroke();
      for (let k = 0; k < 8; k++) { const a = t * 9 + k; const d = 9 + ((t * 40 + k * 5) % 14); ctx.fillStyle = OCRE; ctx.fillRect(fx + Math.cos(a) * d, fy + Math.sin(a) * d, 2, 2); }
      texte(ctx, m[1], w / 2, y0 + H + 22, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const couches = [[m[2], OCRE, 1], [m[3], GRIS, 0.9], [m[4], css, 0.45], [m[5], ENCRE, 0.35]]; const x0 = w * 0.2; const W = w * 0.42; let y = h * 0.22;
      couches.forEach(([n, c, a], i) => { const u = lis((ph - i * 2) / 1.2); if (u <= 0) return; const hh = 34; ctx.fillStyle = c; ctx.globalAlpha = a * u; ctx.fillRect(x0 + (1 - u) * 40, y, W, hh); ctx.globalAlpha = 1; texte(ctx, n, x0 + W + 18, y + hh / 2 + 4, c, 10); y += hh + 6; });
      const u = lis((ph - 9) / 1.2); if (u > 0) { ctx.globalAlpha = u; boite(ctx, x0 + W * 0.25, h * 0.22 + 2 * 40 + 6, W * 0.5, 20, '#3a7d44', '#0f2a14'); ctx.fillStyle = Math.sin(t * 6) > 0 ? OR : '#3a2a10'; ctx.beginPath(); ctx.arc(x0 + W * 0.68, h * 0.22 + 2 * 40 + 16, 3, 0, Math.PI * 2); ctx.fill(); texte(ctx, m[6], x0, h * 0.22 + 4 * 40 + 22, OR, 10); ctx.globalAlpha = 1; }
    },
  ],
  // ---- computer dance music : le corps, les capteurs, la musique
  'sv-cdm': [
    (ctx, w, h, t, ph, s, css, m) => { personnage(ctx, w / 2, h * 0.68, 2, t, ENCRE, 1); ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(w * 0.2, h * 0.68 + 30); ctx.lineTo(w * 0.8, h * 0.68 + 30); ctx.stroke(); texte(ctx, m[0], w / 2, h * 0.9, GRIS, 10, 'center'); },
    (ctx, w, h, t, ph, s, css, m) => {
      const pts = personnage(ctx, w * 0.32, h * 0.68, 1.7, t, ENCRE, 1);
      pts.forEach(([x, y], i) => { ctx.fillStyle = css; ctx.fillRect(x - 3, y - 3, 6, 6); ctx.strokeStyle = css; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(w * 0.62, h * 0.25 + i * 36); ctx.stroke(); ctx.globalAlpha = 1; texte(ctx, (y | 0) + '', w * 0.64, h * 0.25 + i * 36 + 4, i % 2 ? GRIS : css, 10); });
      texte(ctx, m[1], w * 0.62, h * 0.15, GRIS, 10);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      personnage(ctx, w * 0.14, h * 0.6, 1.1, t, ENCRE, 1);
      const x0 = w * 0.28; const y0 = h * 0.25; const c = Math.min((w * 0.66) / 16, 26); const pas = Math.floor(t * 4) % 16;
      for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) { const on = hsh(r * 16 + i + Math.floor(t / 4) * 3) > 0.62; const ici = i === pas; ctx.fillStyle = on ? (ici ? OR : css) : (ici ? '#3c3b38' : '#151513'); ctx.fillRect(x0 + i * c, y0 + r * (c + 4), c - 3, c); }
      texte(ctx, m[2], x0, y0 - 12, GRIS, 10); oscillo(ctx, x0, y0 + 4 * (c + 4) + 16, c * 16 - 3, 40, (u) => Math.sin(u * 50 + t * 9) * (0.5 + 0.5 * Math.sin(t * 8)));
    },
  ],
  // ---- robotic sound hardware : un geste, plusieurs, l'autonomie
  'sv-robot': [
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w * 0.5; const by = h * 0.6; const u = (t * 1.2) % 1; const desc = u < 0.1 ? u / 0.1 : Math.max(0, 1 - (u - 0.1) * 2);
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(cx, by, 60, 0, Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx - 60, by); ctx.lineTo(cx + 60, by); ctx.stroke();
      boite(ctx, cx - 14, by - 120, 28, 44, css); ctx.fillStyle = GRIS; ctx.fillRect(cx - 3, by - 76, 6, 30 + desc * 40);
      if (u < 0.3) for (let k = 0; k < 3; k++) { const r = 20 + u * 200 + k * 16; ctx.strokeStyle = OR; ctx.globalAlpha = Math.max(0, 1 - u * 3.3); ctx.beginPath(); ctx.arc(cx, by, r + 60, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      ctx.globalAlpha = 1; texte(ctx, m[0], cx + 30, by - 100, css, 10); texte(ctx, m[1], cx, by + 80, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const objets = [m[2], m[3], m[4], m[5]]; const pas = Math.floor(t * 4) % 8; const motif = [[1, 0, 0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0, 1, 0], [1, 1, 0, 1, 1, 0, 1, 1], [0, 1, 0, 0, 0, 1, 0, 0]];
      objets.forEach((n, i) => { const x = w * (0.2 + i * 0.2); const y = h * 0.42; const on = motif[i][pas]; boite(ctx, x - 22, y, 44, 30, on ? OR : GRIS); ctx.fillStyle = css; ctx.fillRect(x - 3, y - 40 + (on ? 26 : 0), 6, 14); boite(ctx, x - 9, y - 58, 18, 18, css); texte(ctx, n, x, y + 48, on ? OR : GRIS, 10, 'center');
        for (let p = 0; p < 8; p++) { ctx.fillStyle = motif[i][p] ? (p === pas ? OR : css) : '#151513'; ctx.fillRect(x - 22 + p * 6, h * 0.78, 5, 5); } });
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const cy = h * 0.5; const R = Math.min(w, h) * 0.28; const noms = [m[6], m[7], m[8]];
      ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      noms.forEach((n, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; const x = cx + Math.cos(a) * R; const y = cy + Math.sin(a) * R; boite(ctx, x - 40, y - 12, 80, 24, i === 2 ? OR : css); texte(ctx, n, x, y + 4, i === 2 ? OR : css, 10, 'center'); });
      const a = -Math.PI / 2 + (t * 0.8 % 1) * Math.PI * 2; ctx.fillStyle = OR; ctx.fillRect(cx + Math.cos(a) * R - 3, cy + Math.sin(a) * R - 3, 6, 6);
      texte(ctx, m[9], cx, cy + 4, ENCRE, 10, 'center', 'italic ');
    },
  ],
  // ---- création d'objets audio : le circuit, l'objet, la scène
  'sv-audio': [
    (ctx, w, h, t, ph, s, css, m) => {
      const y = h * 0.45; const x0 = w * 0.1; const x1 = w * 0.9;
      ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      const tri = w * 0.32; ctx.fillStyle = '#000'; ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.moveTo(tri - 20, y - 24); ctx.lineTo(tri + 20, y); ctx.lineTo(tri - 20, y + 24); ctx.closePath(); ctx.fill(); ctx.stroke();
      const rx = w * 0.52; ctx.fillStyle = '#000'; ctx.fillRect(rx - 22, y - 6, 44, 12); ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.moveTo(rx - 22, y); for (let i = 0; i < 7; i++) ctx.lineTo(rx - 18 + i * 6, y + (i % 2 ? 6 : -6)); ctx.lineTo(rx + 22, y); ctx.stroke();
      const cx = w * 0.68; ctx.fillStyle = '#000'; ctx.fillRect(cx - 6, y - 14, 12, 28); ctx.fillStyle = ENCRE; ctx.fillRect(cx - 5, y - 14, 2, 28); ctx.fillRect(cx + 3, y - 14, 2, 28);
      texte(ctx, m[0], tri, y + 44, ENCRE, 10, 'center'); texte(ctx, m[1], rx, y + 28, GRIS, 10, 'center'); texte(ctx, m[2], cx, y + 30, GRIS, 10, 'center');
      for (let k = 0; k < 6; k++) { const u = (t * 0.4 + k / 6) % 1; ctx.fillStyle = OR; ctx.fillRect(x0 + (x1 - x0) * u - 2, y - 2, 4, 4); }
      oscillo(ctx, w * 0.62, h * 0.7, w * 0.28, 44, (u) => (((u * 6 + t * 2) % 1) * 2 - 1) * 0.8);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.14; const y0 = h * 0.22; const W = w * 0.72; const H = h * 0.42;
      boite(ctx, x0, y0, W, H, ENCRE, '#0b0b0a');
      for (let i = 0; i < 5; i++) { bouton(ctx, x0 + 34 + i * (W - 68) / 4, y0 + 40, 13, Math.sin(t * 0.8 + i) * 2.4, i === 2 ? css : ENCRE); }
      const jacks = []; for (let i = 0; i < 8; i++) { const x = x0 + 30 + i * (W - 60) / 7; const y = y0 + H - 30; ctx.strokeStyle = OCRE; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.stroke(); jacks.push([x, y]); }
      [[0, 5, css], [2, 7, OR], [1, 3, ENCRE]].forEach(([a, b, c]) => { const [ax, ay] = jacks[a]; const [bx, by] = jacks[b]; ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax, ay + 60, bx, by + 60, bx, by); ctx.stroke(); ctx.lineWidth = 1; });
      texte(ctx, m[3], x0, y0 - 10, GRIS, 10);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const by = h * 0.62; boite(ctx, cx - 50, by - 30, 100, 30, ENCRE, '#0b0b0a'); ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.moveTo(cx, by); ctx.lineTo(cx, by + 60); ctx.moveTo(cx - 30, by + 60); ctx.lineTo(cx + 30, by + 60); ctx.stroke();
      for (let k = 0; k < 5; k++) { const r = ((t * 40 + k * 26) % 130) + 20; ctx.strokeStyle = css; ctx.globalAlpha = 1 - r / 150; ctx.beginPath(); ctx.arc(cx, by - 30, r, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
      ctx.globalAlpha = 1; for (let i = 0; i < 24; i++) { const v = Math.abs(Math.sin(i * 0.6 + t * 3) * Math.cos(i * 0.21 + t)); ctx.fillStyle = i % 5 ? css : OR; ctx.fillRect(w * 0.1 + i * (w * 0.8 / 24), h * 0.95 - v * 50, w * 0.8 / 24 - 3, v * 50); }
      texte(ctx, m[4], cx, h * 0.14, ENCRE, 10, 'center');
    },
  ],
  // ---- capteurs & interaction : le geste, la mesure, la réponse
  'sv-capteurs': [
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.trace) s.trace = []; const a = t * 1.3; const x = w / 2 + Math.cos(a) * w * 0.25; const y = h * 0.5 + Math.sin(a * 2) * h * 0.18;
      s.trace.push([x, y]); if (s.trace.length > 70) s.trace.shift();
      ctx.strokeStyle = css; ctx.globalAlpha = 0.5; ctx.beginPath(); s.trace.forEach(([u, v], i) => (i ? ctx.lineTo(u, v) : ctx.moveTo(u, v))); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke(); for (let d = 0; d < 5; d++) { const b = -2.2 + d * 0.45; ctx.beginPath(); ctx.moveTo(x + Math.cos(b) * 12, y + Math.sin(b) * 12); ctx.lineTo(x + Math.cos(b) * 26, y + Math.sin(b) * 26); ctx.stroke(); }
      ctx.fillStyle = css; ctx.fillRect(x - 4, y + 10, 8, 6); texte(ctx, m[0], w / 2, h * 0.92, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      [[css, 1.3, 'x'], [OR, 2.6, 'y'], [ENCRE, 0.7, 'z']].forEach(([c, f, n], i) => { oscillo(ctx, w * 0.1, h * 0.16 + i * h * 0.2, w * 0.8, h * 0.16, (u) => Math.sin((u * 6 - t) * f) * 0.8 + Math.sin(u * 40 + t * 7) * 0.08, c); texte(ctx, n, w * 0.1 - 10, h * 0.16 + i * h * 0.2 + h * 0.08 + 4, c, 10, 'right'); });
      texte(ctx, m[1], w / 2, h * 0.84, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const v = 0.5 + 0.5 * Math.sin(t * 1.3); const hx = w * 0.18; const hy = h * 0.75 - v * h * 0.45;
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(hx, hy, 10, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(hx, h * 0.8); ctx.lineTo(hx, h * 0.25); ctx.stroke(); texte(ctx, m[2], hx, h * 0.88, GRIS, 10, 'center');
      ctx.strokeStyle = GRIS; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(hx + 14, hy); ctx.lineTo(w * 0.42, hy); ctx.stroke(); ctx.setLineDash([]);
      const lx = w * 0.55; const ly = h * 0.3; ctx.fillStyle = OR; ctx.globalAlpha = 0.2 + v * 0.8; ctx.beginPath(); ctx.arc(lx, ly, 10 + v * 6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = v * 0.25; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - 60, h * 0.7); ctx.lineTo(lx + 60, h * 0.7); ctx.fill(); ctx.globalAlpha = 1; texte(ctx, m[3], lx, h * 0.78, OR, 10, 'center');
      oscillo(ctx, w * 0.7, h * 0.42, w * 0.22, 60, (u) => Math.sin(u * (8 + v * 40) + t * 4) * 0.8, css); texte(ctx, m[4], w * 0.81, h * 0.78, css, 10, 'center');
    },
  ],
  // ---- objets & installation : le prototype, l'intégration, la scène
  'sv-objets': [
    (ctx, w, h, t, ph, s, css, m) => {
      const by = h * 0.68; ctx.strokeStyle = OCRE; ctx.beginPath(); ctx.moveTo(w * 0.08, by); ctx.lineTo(w * 0.92, by); ctx.stroke();
      boite(ctx, w * 0.3, by - 60, 110, 60, ENCRE, '#0b0b0a'); boite(ctx, w * 0.3 + 14, by - 46, 50, 22, '#3a7d44', '#0f2a14'); ctx.fillStyle = Math.sin(t * 5) > 0 ? OR : '#3a2a10'; ctx.beginPath(); ctx.arc(w * 0.3 + 90, by - 34, 4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = css; ctx.beginPath(); ctx.moveTo(w * 0.3 + 110, by - 30); ctx.bezierCurveTo(w * 0.7, by - 30, w * 0.65, by - 90, w * 0.78, by - 90); ctx.stroke(); boite(ctx, w * 0.78, by - 104, 34, 28, css);
      texte(ctx, m[0], w / 2, by + 24, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const cy = h * 0.5; boite(ctx, cx - 40, cy - 22, 80, 44, OR, '#0b0b0a'); texte(ctx, m[1], cx, cy + 4, OR, 10, 'center');
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; const x = cx + Math.cos(a) * w * 0.34; const y = cy + Math.sin(a) * h * 0.32; const u = lis((ph - i * 0.8) / 1); if (u <= 0) continue; ctx.globalAlpha = u; boite(ctx, x - 22, y - 14, 44, 28, css); ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx, cy); ctx.stroke(); const k = (t * 0.7 + i / 6) % 1; ctx.fillStyle = OR; ctx.fillRect(x + (cx - x) * k - 2, y + (cy - y) * k - 2, 4, 4); ctx.globalAlpha = 1; }
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const hor = h * 0.4; ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(w * 0.05, h * 0.86); ctx.lineTo(w * 0.25, hor); ctx.lineTo(w * 0.75, hor); ctx.lineTo(w * 0.95, h * 0.86); ctx.stroke();
      [0.32, 0.5, 0.68].forEach((x, i) => { const px = w * x; const py = h * 0.6; ctx.fillStyle = css; ctx.globalAlpha = 0.1 + 0.08 * Math.sin(t * 2 + i); ctx.beginPath(); ctx.moveTo(px, h * 0.06); ctx.lineTo(px - 40, py + 10); ctx.lineTo(px + 40, py + 10); ctx.fill(); ctx.globalAlpha = 1; boite(ctx, px - 16, py - 20, 32, 30, i === 1 ? OR : ENCRE, '#0b0b0a'); });
      for (let i = 0; i < 12; i++) { ctx.fillStyle = GRIS; ctx.beginPath(); ctx.arc(w * 0.12 + i * w * 0.07, h * 0.92, 3, 0, Math.PI * 2); ctx.fill(); }
      texte(ctx, m[2], w / 2, h * 0.14, ENCRE, 10, 'center');
    },
  ],
  // ---- conception 3D : la forme, l'usage, le prototype
  'sv-3d': [
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const cy = h * 0.5; const R = Math.min(w, h) * 0.28; const a = t * 0.5;
      for (let k = 0; k < 9; k++) { const lat = -1.2 + k * 0.3; ctx.strokeStyle = css; ctx.globalAlpha = 0.7; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const lo = i / 40 * Math.PI * 2; const r = R * Math.cos(lat) * (1 + 0.18 * Math.cos(lo * 3)); const x = r * Math.cos(lo + a); const z = r * Math.sin(lo + a); const px = cx + x; const py = cy + R * Math.sin(lat) * 0.9 + z * 0.3; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      ctx.globalAlpha = 1; texte(ctx, m[0], cx, h * 0.92, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w * 0.55; const cy = h * 0.5; ctx.strokeStyle = css; ctx.beginPath(); ctx.ellipse(cx, cy, 70, 44, 0, 0, Math.PI * 2); ctx.stroke();
      const k = lis((ph % 8) / 3); const hx = w * 0.12 + k * (cx - 70 - w * 0.12 - 10);
      ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.moveTo(hx - 40, cy + 30); ctx.lineTo(hx, cy + 20); for (let d = 0; d < 4; d++) { ctx.moveTo(hx, cy + 20 - d * 2); ctx.lineTo(hx + 26, cy - 22 + d * 14); } ctx.stroke();
      if (k > 0.95) [[-62, -18], [-66, 0], [-62, 18], [-50, 32]].forEach(([dx, dy]) => { ctx.fillStyle = OR; ctx.fillRect(cx + dx - 3, cy + dy - 3, 6, 6); });
      texte(ctx, m[1], cx, h * 0.88, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const cx = w / 2; const base = h * 0.78; const n = Math.floor(lis(ph / 14) * 30);
      for (let i = 0; i < n; i++) { const y = base - i * 4; const r = 60 * Math.sqrt(1 - Math.pow((i - 15) / 16, 2)); ctx.fillStyle = i % 2 ? css : '#5a8a6a'; ctx.globalAlpha = 0.7; ctx.fillRect(cx - r, y - 3, r * 2, 3); }
      ctx.globalAlpha = 1; const y = base - n * 4 - 6; const r = 60 * Math.sqrt(Math.max(0, 1 - Math.pow((n - 15) / 16, 2))); const nx = cx + Math.sin(t * 6) * r;
      ctx.strokeStyle = GRIS; ctx.beginPath(); ctx.moveTo(w * 0.15, y - 20); ctx.lineTo(w * 0.85, y - 20); ctx.stroke(); boite(ctx, nx - 10, y - 30, 20, 16, ENCRE); ctx.fillStyle = OR; ctx.beginPath(); ctx.moveTo(nx - 4, y - 14); ctx.lineTo(nx + 4, y - 14); ctx.lineTo(nx, y - 6); ctx.fill();
      ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(w * 0.2, base + 2); ctx.lineTo(w * 0.8, base + 2); ctx.stroke(); texte(ctx, m[2], cx, h * 0.92, GRIS, 10, 'center');
    },
  ],
  // ---- scénographie & lumière : le plan de feux, le DMX, la lumière réactive
  'sv-lumiere': [
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.25; const y0 = h * 0.3; const W = w * 0.5; const H = h * 0.4; ctx.strokeStyle = GRIS; ctx.strokeRect(x0, y0, W, H); texte(ctx, m[0], x0 + W / 2, y0 + H / 2 + 4, GRIS, 10, 'center');
      for (let i = 0; i < 6; i++) { const x = x0 + (i % 3) * W / 2; const y = i < 3 ? y0 - 30 : y0 + H + 30; const tx = x0 + W * (0.2 + 0.3 * (i % 3)) + Math.sin(t + i) * 10; const ty = y0 + H * 0.5; const on = lis((ph - i) / 0.6);
        ctx.strokeStyle = css; ctx.globalAlpha = 0.3 + 0.5 * on; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = on > 0.5 ? OR : '#000'; ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); texte(ctx, String(i + 1), x, y + (i < 3 ? -14 : 22), GRIS, 9, 'center'); }
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const n = 12; const x0 = w * 0.1; const c = (w * 0.8) / n; const y0 = h * 0.22; const H = h * 0.45;
      for (let i = 0; i < n; i++) { const v = 0.5 + 0.5 * Math.sin(t * (0.6 + i * 0.07) + i); const x = x0 + i * c + c / 2; ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + H); ctx.stroke(); ctx.fillStyle = i % 4 === 0 ? OR : css; ctx.fillRect(x - 8, y0 + H - v * H - 5, 16, 10); texte(ctx, String(i + 1).padStart(3, '0'), x, y0 + H + 16, GRIS, 8, 'center'); texte(ctx, String(Math.round(v * 255)), x, y0 - 8, ENCRE, 8, 'center'); }
      texte(ctx, m[1], w / 2, h * 0.9, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const amp = (x) => Math.abs(Math.sin(t * 5 + x * 3) * Math.sin(t * 1.3)); const sy = h * 0.72;
      for (let i = 0; i < 5; i++) { const x = w * (0.15 + i * 0.175); const v = amp(i); ctx.fillStyle = i % 2 ? css : OR; ctx.globalAlpha = 0.05 + v * 0.3; ctx.beginPath(); ctx.moveTo(x, h * 0.08); ctx.lineTo(x - 20 - v * 30, sy); ctx.lineTo(x + 20 + v * 30, sy); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = ENCRE; ctx.fillRect(x - 7, h * 0.06, 14, 8); }
      oscillo(ctx, w * 0.1, sy + 10, w * 0.8, h * 0.16, (u) => Math.sin(u * 60 + t * 10) * amp(u * 4) * 0.9); texte(ctx, m[2], w * 0.1, sy + h * 0.16 + 24, GRIS, 10);
    },
  ],
  // ---- Go2 (Unitree) sur mesure : le robot, la chorégraphie, les modules
  'sv-go2': [
    (ctx, w, h, t, ph, s, css, m) => { go2Profil(ctx, w / 2, h * 0.7 + Math.sin(t * 4) * 2, Math.min(3, w / 150), css, 0.8 + 0.2 * Math.sin(t)); ctx.strokeStyle = SOMBRE; ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.7); ctx.lineTo(w * 0.85, h * 0.7); ctx.stroke(); texte(ctx, m[0], w / 2, h * 0.84, GRIS, 10, 'center'); },
    (ctx, w, h, t, ph, s, css, m) => {
      const pts = [[0.2, 0.3], [0.7, 0.25], [0.8, 0.7], [0.4, 0.75], [0.3, 0.5]].map(([x, y]) => [w * x, h * y]);
      ctx.strokeStyle = SOMBRE; ctx.strokeRect(w * 0.1, h * 0.15, w * 0.8, h * 0.7);
      ctx.setLineDash([4, 5]); ctx.strokeStyle = css; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      pts.forEach(([x, y], i) => { boite(ctx, x - 9, y - 9, 18, 18, css); texte(ctx, String(i + 1), x, y + 4, css, 9, 'center'); });
      const u = (t * 0.12) % 1 * 5; const i = Math.floor(u); const f = lis(u - i); const a = pts[i]; const b = pts[(i + 1) % 5];
      go2Dessus(ctx, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0]), 1.6); texte(ctx, m[1], w / 2, h * 0.93, GRIS, 10, 'center');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x = w * 0.42; const y = h * 0.72; const sc = Math.min(3, w / 150); go2Profil(ctx, x, y, sc, css, 1);
      const mx = x - 2 * sc; const my = y - 16 * sc - 22 * sc; ctx.fillStyle = ENCRE; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + 24 * sc, my - 10 * sc); ctx.lineTo(mx + 24 * sc, my + 10 * sc); ctx.closePath(); ctx.fill();
      for (let k = 0; k < 4; k++) { const r = ((t * 40 + k * 22) % 88) + 10; ctx.strokeStyle = OR; ctx.globalAlpha = 1 - r / 100; ctx.beginPath(); ctx.arc(mx + 24 * sc, my, r, -0.5, 0.5); ctx.stroke(); }
      ctx.globalAlpha = 1; texte(ctx, m[2], w / 2, h * 0.88, GRIS, 10, 'center');
    },
  ],
  // ---- réparation : synthés analogiques, hi-fi, amplis — diagnostiquer, réparer, régler
  'sv-repar': [
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.08; const y0 = h * 0.16; const W = w * 0.84;
      boite(ctx, x0, y0, W, 70, ENCRE, '#0b0b0a'); for (let i = 0; i < 6; i++) bouton(ctx, x0 + 24 + i * 30, y0 + 22, 9, 1 + i, ENCRE);
      for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 7 === 2 || i % 7 === 5 ? '#000' : ENCRE; ctx.fillRect(x0 + W * 0.5 + i * (W * 0.48 / 14), y0 + 30, W * 0.48 / 14 - 2, 34); }
      texte(ctx, m[0], x0, y0 - 8, GRIS, 10);
      ctx.strokeStyle = css; ctx.beginPath(); ctx.moveTo(x0 + W * 0.3, y0 + 70); ctx.bezierCurveTo(x0 + W * 0.3, h * 0.5, w * 0.3, h * 0.45, w * 0.3, h * 0.55); ctx.stroke();
      oscillo(ctx, w * 0.1, h * 0.56, w * 0.8, h * 0.22, (u) => { const v = Math.sin(u * 30 + t * 3) * 1.4; return Math.max(-0.6, Math.min(0.6, v)) + (hsh(Math.floor(u * 200) + Math.floor(t * 20)) - 0.5) * 0.5 + (Math.abs(u - ((t * 0.4) % 1)) < 0.01 ? 0.9 : 0); }, '#ff6b5a');
      texte(ctx, m[1], w * 0.1, h * 0.56 + h * 0.22 + 16, '#ff6b5a', 10);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const x0 = w * 0.1; const y0 = h * 0.14; const W = w * 0.8; const H = h * 0.62; boite(ctx, x0, y0, W, H, '#3a7d44', '#0b1a0e');
      ctx.strokeStyle = '#2c5a33'; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(x0 + 10, y0 + 20 + i * H / 9); ctx.lineTo(x0 + W - 10, y0 + 20 + i * H / 9 + (i % 2 ? 10 : -6)); ctx.stroke(); }
      const caps = [[0.2, 0.3], [0.45, 0.6], [0.7, 0.35], [0.82, 0.7]]; const k = Math.min(3, Math.floor(ph / 4)); const u = (ph % 4) / 4;
      caps.forEach(([cx, cy], i) => { const x = x0 + W * cx; const y = y0 + H * cy; const fait = i < k || (i === k && u > 0.75); ctx.fillStyle = fait ? '#1f3a8a' : '#3a2a10'; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = fait ? css : (i === k ? '#ff6b5a' : OCRE); ctx.stroke(); if (!fait) { ctx.beginPath(); ctx.arc(x, y - 4, 6, Math.PI, 0); ctx.stroke(); } });
      const [cx, cy] = caps[k]; const fx = x0 + W * cx + 14; const fy = y0 + H * cy - 10;
      ctx.strokeStyle = ENCRE; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + 60, fy - 50); ctx.stroke(); ctx.lineWidth = 1; ctx.fillStyle = OR; ctx.fillRect(fx - 2, fy - 2, 4, 4);
      for (let p = 0; p < 6; p++) { const a = ((t * 0.8 + p / 6) % 1); ctx.fillStyle = GRIS; ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.arc(fx + Math.sin(t * 2 + p) * 6, fy - a * 50, 2 + a * 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1; bouton(ctx, x0 + W * 0.6, y0 + H * 0.15, 10, t * 3, css);
      texte(ctx, m[2], x0, y0 + H + 18, OCRE, 10); texte(ctx, m[3], x0 + W, y0 + H + 18, css, 10, 'right');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      oscillo(ctx, w * 0.1, h * 0.16, w * 0.8, h * 0.26, (u) => Math.sin(u * 25 + t * 3) * 0.8, css); texte(ctx, m[4], w * 0.1, h * 0.16 + h * 0.26 + 16, css, 10);
      const x0 = w * 0.1; const y0 = h * 0.58; const W = w * 0.8; const n = 14; const touche = Math.floor(t * 2) % n;
      for (let i = 0; i < n; i++) { ctx.fillStyle = i === touche ? OR : ENCRE; ctx.fillRect(x0 + i * W / n, y0, W / n - 2, 60); }
      texte(ctx, m[5] + ' · ' + Math.round(220 * Math.pow(2, touche / 12)) + ' Hz', w / 2, y0 + 80, OR, 10, 'center');
    },
  ],
};
// ---------------------------------------------------------------- SERVICES en 3D : des lieux en glyphes, comme pour BILLY, pour qu'on se projette
// un petit atelier 3D : des points (chacun un glyphe), une caméra, des étiquettes posées dans l'espace
const K3 = {
  pt (L, x, y, z, r, t = 0.06) { L.push({ x, y, z, r, t, g: GCLES[(L.length * 7 + 3) % GCLES.length] }); },
  ligne (L, a, b, r, pas = 0.08, t) { const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const n = Math.max(1, Math.round(d / pas)); for (let i = 0; i <= n; i++) { const u = i / n; K3.pt(L, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, r, t); } },
  boite (L, cx, cy, cz, lx, ly, lz, r, pas = 0.12, t) {
    // les arêtes, et les faces en pointillé
    const X = [cx - lx / 2, cx + lx / 2]; const Y = [cy, cy + ly]; const Z = [cz - lz / 2, cz + lz / 2];
    for (const y of Y) for (const z of Z) K3.ligne(L, [X[0], y, z], [X[1], y, z], r, pas, t);
    for (const x of X) for (const z of Z) K3.ligne(L, [x, Y[0], z], [x, Y[1], z], r, pas, t);
    for (const x of X) for (const y of Y) K3.ligne(L, [x, y, Z[0]], [x, y, Z[1]], r, pas, t);
    for (let x = X[0] + pas * 2; x < X[1] - pas; x += pas * 2) for (let z = Z[0] + pas * 2; z < Z[1] - pas; z += pas * 2) K3.pt(L, x, Y[1], z, r, t);
  },
  cylindre (L, cx, cz, rr, y0, y1, r, pas = 0.12, t) { const n = Math.max(8, Math.round(rr * 6.28 / pas)); for (let y = y0; y <= y1 + 1e-6; y += pas * 1.5) for (let i = 0; i < n; i++) { const a = i / n * 6.283; K3.pt(L, cx + Math.cos(a) * rr, y, cz + Math.sin(a) * rr, r, t); } },
  sphere (L, cx, cy, cz, rr, r, n = 60, t) { for (let i = 0; i < n; i++) { const k = 1 - 2 * (i + 0.5) / n; const a = i * 2.39996; const s = Math.sqrt(1 - k * k); K3.pt(L, cx + Math.cos(a) * s * rr, cy + k * rr, cz + Math.sin(a) * s * rr, r, t); } },
  sol (L, x0, z0, x1, z1, pas = 0.5, r = 'sombre') { for (let x = x0; x <= x1 + 1e-6; x += pas) for (let z = z0; z <= z1 + 1e-6; z += pas) K3.pt(L, x, 0, z, r, 0.05); },
  mur (L, x0, z0, x1, z1, h, r = 'gris', pas = 0.35) { const n = Math.round(Math.hypot(x1 - x0, z1 - z0) / pas); for (let i = 0; i <= n; i++) for (let y = 0.2; y <= h; y += pas) K3.pt(L, x0 + (x1 - x0) * i / n, y, z0 + (z1 - z0) * i / n, r, 0.06); },
  humain (L, x, z, t, r = 'encre', danse = 1, tourne = 0) {
    // un corps en mouvement ; renvoie ses poignets et chevilles (pour y poser des capteurs)
    const a = Math.sin(t * 2.2) * danse; const b = Math.sin(t * 2.2 + 1.7) * danse; const c = Math.cos(tourne); const s = Math.sin(tourne);
    const P = (dx, y, dz) => [x + dx * c - dz * s, y, z + dx * s + dz * c];
    const cou = P(0, 1.45, 0); const bassin = P(0.05 * a, 0.95, 0); const tete = P(0, 1.62, 0);
    const mainG = P(-0.45 - 0.1 * a, 1.2 + 0.45 * Math.max(0, a), 0.15 * b); const mainD = P(0.45 + 0.1 * b, 1.2 + 0.45 * Math.max(0, b), -0.15 * a);
    const piedG = P(-0.18 - 0.1 * b, 0.02 + 0.12 * Math.max(0, b), 0.1 * a); const piedD = P(0.18 + 0.1 * a, 0.02 + 0.12 * Math.max(0, a), -0.1 * b);
    const genouG = P(-0.14, 0.5 + 0.1 * Math.max(0, b), 0.12 + 0.1 * b); const genouD = P(0.14, 0.5 + 0.1 * Math.max(0, a), 0.12 + 0.1 * a);
    const coudeG = P(-0.3, 1.25 + 0.2 * Math.max(0, a), 0.1); const coudeD = P(0.3, 1.25 + 0.2 * Math.max(0, b), 0.1);
    [[cou, bassin], [cou, coudeG], [coudeG, mainG], [cou, coudeD], [coudeD, mainD], [bassin, genouG], [genouG, piedG], [bassin, genouD], [genouD, piedD]].forEach(([u, v]) => K3.ligne(L, u, v, r, 0.06, 0.05));
    K3.sphere(L, tete[0], tete[1], tete[2], 0.11, r, 16, 0.05);
    return { mainG, mainD, piedG, piedD, tete };
  },
  go2 (L, x, z, ang, t, r = 'encre', marche = 1) {
    // le robot quadrupède : corps, tête, quatre pattes qui marchent
    const c = Math.cos(ang); const s = Math.sin(ang); const P = (dx, y, dz) => [x + dx * c - dz * s, y, z + dx * s + dz * c];
    const h = 0.32; for (let dx = -0.3; dx <= 0.3; dx += 0.06) for (const dz of [-0.11, 0.11]) { K3.pt(L, ...P(dx, h, dz), r, 0.05); K3.pt(L, ...P(dx, h + 0.1, dz), r, 0.05); }
    const hp = P(0.36, h + 0.02, 0); K3.boite(L, hp[0], hp[1], hp[2], 0.12, 0.1, 0.12, 'or', 0.05, 0.05);
    [[0.24, 0.13], [0.24, -0.13], [-0.24, 0.13], [-0.24, -0.13]].forEach(([dx, dz], i) => { const p = Math.sin(t * 7 + (i % 3 === 0 ? 0 : Math.PI)) * 0.06 * marche; const hanche = P(dx, h, dz); const genou = P(dx + 0.06 + p, h / 2, dz); const pied = P(dx + p * 1.5, 0.01 + Math.max(0, p) * 0.4, dz); K3.ligne(L, hanche, genou, r, 0.05, 0.05); K3.ligne(L, genou, pied, r, 0.05, 0.05); });
    return P(0, h + 0.12, 0);
  },
};
const GCLES = Object.keys(SIG);
function orbite (w, h, cx, cy, cz, R, haut, ang, fov = 1.0) { return camera3d([cx + Math.cos(ang) * R, haut, cz + Math.sin(ang) * R], [cx, cy, cz], w, h, fov); }
// une orbite qui recule jusqu'à ce que toute la scène tienne dans le cadre (le sol mis à part)
function orbiteC (L, w, h, cx, cy, cz, R, haut, ang, fov = 1.0) {
  const marge = 14; const hautMin = 30; let cam = null;
  for (let k = 0; k < 10; k++) {
    cam = orbite(w, h, cx, cy, cz, R, haut, ang, fov); let ok = true;
    for (const p of L) { if (p.r === 'sombre' || (p.a ?? 1) < 0.15) continue; const q = cam.p(p.x, p.y, p.z); if (!q || q[0] < marge || q[0] > w - marge || q[1] < hautMin || q[1] > h - marge) { ok = false; break; } }
    if (ok) break; R *= 1.12; haut = cy + (haut - cy) * 1.12;
  }
  return cam;
}
function rendre3d (ctx, cam, L, css, o = {}) {
  etiq.largeur = cam.w;
  const col = { css, or: OR, encre: ENCRE, gris: GRIS, ocre: OCRE, sombre: '#4a4844', eau: '#72dec2', rose: '#ff1fce', ...(o.couleurs || {}) };
  const liste = []; for (const p of L) { const q = cam.p(p.x, p.y, p.z); if (q) liste.push([q, p]); }
  liste.sort((a, b) => b[0][2] - a[0][2]); ctx.imageSmoothingEnabled = false; const portee = o.portee || 18;
  for (const [[sx, sy, z], p] of liste) {
    const s = Math.max(1.4, Math.min(12, cam.f * (p.t || 0.06) / z)); const al = Math.max(0, Math.min(1, 1.3 - z / portee)) * (p.a ?? 1); if (al <= 0.02) continue;
    const c = col[p.r] || p.r; ctx.globalAlpha = al;
    if (p.r === 'sombre') { const d = Math.max(1, s * 0.3); ctx.fillStyle = c; ctx.fillRect(sx - d / 2, sy - d / 2, d, d); } else if (s < 3.2) { ctx.fillStyle = c; ctx.fillRect(sx - s / 2, sy - s / 2, s, s); } else ctx.drawImage(sprite(p.g, c), sx - s / 2, sy - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}
function etiq (ctx, cam, p, txt, coul = GRIS, taille = 10, align = 'center', style = '') {
  // une étiquette posée dans l'espace, gardée entière dans le cadre
  const q = cam.p(p[0], p[1], p[2]); if (!q) return q;
  ctx.font = `${style}${taille}px 'IBM Plex Mono', monospace`; const tw = ctx.measureText(txt).width; const W = ctx.canvas.clientWidth || ctx.canvas.width; const m = 8;
  let x = q[0]; const gauche = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x; const droite = gauche + tw;
  if (gauche < m) x += m - gauche; else if (droite > (etiq.largeur || W) - m) x -= droite - ((etiq.largeur || W) - m);
  texte(ctx, txt, x, Math.max(taille + 4, q[1]), coul, taille, align, style); return q;
}
function anneaux (L, cx, cy, cz, t, r, n = 3, rmax = 2.5, vit = 0.8, plan = 'h') {
  // des ondes qui s'éloignent (un son, un signal) : des cercles de points
  for (let k = 0; k < n; k++) { const u = ((t * vit + k / n) % 1); const rr = 0.2 + u * rmax; const m = Math.round(rr * 18); for (let i = 0; i < m; i++) { const a = i / m * 6.283; const p = plan === 'h' ? [cx + Math.cos(a) * rr, cy, cz + Math.sin(a) * rr] : [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, cz]; L.push({ x: p[0], y: p[1], z: p[2], r, t: 0.05, a: 1 - u, g: GCLES[i % GCLES.length] }); } }
}

Object.assign(SV, {
  // ---- data → art : les données deviennent visuel ou musique, pour le musée, le concert, l'installation
  'sv-data': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -4, -4, 4, 4, 0.6);
      // une station de mesure, des capteurs, et les données qui convergent vers un noyau
      K3.ligne(L, [-2.6, 0, -1], [-2.6, 2.4, -1], 'encre', 0.08); for (let k = 0; k < 3; k++) { const a = t * 4 + k * 2.1; K3.ligne(L, [-2.6, 2.4, -1], [-2.6 + Math.cos(a) * 0.4, 2.4, -1 + Math.sin(a) * 0.4], 'encre', 0.06); }
      [[-2.2, 0, 1.6], [2.4, 0, -1.8], [2.2, 0, 1.8]].forEach(([x, y, z]) => K3.boite(L, x, y, z, 0.3, 0.5, 0.3, 'css', 0.08));
      const sources = [[-2.6, 2.4, -1], [-2.2, 0.5, 1.6], [2.4, 0.5, -1.8], [2.2, 0.5, 1.8]];
      sources.forEach((a, i) => { for (let k = 0; k < 10; k++) { const u = ((t * 0.35 + k / 10 + i * 0.13) % 1); const p = [a[0] * (1 - u), a[1] * (1 - u) + 1.2 * u + Math.sin(u * 3.1) * 0.5, a[2] * (1 - u)]; L.push({ x: p[0], y: p[1], z: p[2], r: k % 3 ? 'gris' : 'or', t: 0.09, g: GCLES[(k + i * 5) % GCLES.length] }); } });
      K3.sphere(L, 0, 1.2, 0, 0.35 + 0.05 * Math.sin(t * 3), 'or', 50, 0.07);
      const cam = orbiteC(L, w, h, 0, 0.9, 0, 6.5, 2.6, 0.6 + t * 0.06, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [-2.6, 2.75, -1], m[0], ENCRE); etiq(ctx, cam, [0, 1.75, 0], m[1], OR, 11);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -5, -4, 5, 4, 0.6);
      K3.sphere(L, 0, 1.2, 0, 0.3, 'or', 40, 0.07);
      // à gauche : un paysage visuel fait de colonnes de glyphes
      const k = lis(ph / 5);
      for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { const v = 0.5 + 0.5 * Math.sin(i * 0.8 + j * 0.6 + t * 0.7); const n = Math.round(v * 6 * k); for (let y = 0; y < n; y++) K3.pt(L, -4.2 + i * 0.35, 0.15 + y * 0.28, -0.9 + j * 0.35, y > 4 ? 'or' : 'css', 0.13); }
      // à droite : la musique, des ondes et une partition qui défile
      anneaux(L, 3, 0.05, 0, t, 'css', 4, 2.0 * k, 0.5);
      for (let i = 0; i < 12; i++) { const on = hsh(i + Math.floor(t * 2)) > 0.55; K3.pt(L, 2 + i * 0.2, 1.2 + (hsh(i * 3) * 0.8) * (on ? 1 : 0), 0, on ? 'or' : 'sombre', 0.12); }
      [[-1.5, 0], [1.5, 0]].forEach(([x], i) => { for (let q = 0; q < 6; q++) { const u = ((t * 0.5 + q / 6) % 1); K3.pt(L, x * u * (i ? 1 : 1), 1.2 - u * 0.4, 0, 'or', 0.07); } });
      const cam = orbiteC(L, w, h, 0, 0.8, 0, 7.5, 3.2, 1.45 + Math.sin(t * 0.2) * 0.25, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [-3.2, 2.4, 0], m[2], css, 11, 'center', '600 '); etiq(ctx, cam, [3, 2.4, 0], m[3], css, 11, 'center', '600 '); etiq(ctx, cam, [0, 1.7, 0], m[1], OR);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.L) {
        s.L = []; const L = s.L; K3.sol(L, -6, -6, 6, 6, 0.7);
        // le musée : des cadres au mur ; le concert : une scène, des enceintes ; l'installation : une salle
        K3.mur(L, -6, -6, -1, -6, 2.6); for (let i = 0; i < 3; i++) K3.boite(L, -5 + i * 1.6, 1, -5.95, 1, 0.8, 0.02, 'css', 0.1);
        K3.boite(L, 3.2, 0, -3.5, 4, 0.4, 2, 'gris', 0.25); K3.boite(L, 1.6, 0.4, -4, 0.5, 1.3, 0.5, 'encre', 0.12); K3.boite(L, 4.8, 0.4, -4, 0.5, 1.3, 0.5, 'encre', 0.12);
        K3.mur(L, -6, 6, -6, 1, 2.6); K3.mur(L, -6, 1, -2, 1, 2.6, 'sombre');
      }
      const L = s.L.slice();
      for (let i = 0; i < 8; i++) K3.pt(L, 1.4 + (i % 4) * 0.8, 0.9, -1.6 + Math.floor(i / 4) * 0.7, 'encre', 0.12);
      const vx = -4 + Math.sin(t * 0.6) * 1.2; const vz = 3.5 + Math.cos(t * 0.5) * 1.2; K3.humain(L, vx, vz, t, 'encre', 0.4); anneaux(L, vx, 0.02, vz, t, 'or', 3, 1.4, 0.9);
      anneaux(L, 3.2, 1.6, -3.4, t, 'or', 3, 1.8, 0.7, 'v');
      for (let i = 0; i < 3; i++) for (let k = 0; k < 8; k++) { const u = ((t * 0.4 + k / 8) % 1); const dest = [[-4, 1.4, -5.8], [3.2, 1.2, -3.4], [vx, 1.2, vz]][i]; K3.pt(L, dest[0] * u, 3 - u * (3 - dest[1]), dest[2] * u, 'or', 0.07); }
      K3.sphere(L, 0, 3, 0, 0.25, 'or', 30, 0.06);
      const cam = orbiteC(L, w, h, -0.5, 0.6, -0.5, 11, 6.5, 0.9 + ph * 0.035, 0.95); rendre3d(ctx, cam, L, css, { portee: 26 });
      etiq(ctx, cam, [-3.5, 2.4, -5.9], m[4], css, 11, 'center', '600 '); etiq(ctx, cam, [3.2, 2.2, -3.5], m[5], css, 11, 'center', '600 '); etiq(ctx, cam, [-4, 2.3, 3.5], m[6], css, 11, 'center', '600 ');
    },
  ],
  // ---- créations physiques sur mesure : l'idée, la fabrication, sa place (musée, installation, artiste)
  'sv-physique': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -3, -3, 3, 3, 0.5);
      // un objet sur mesure, dessiné en fil : une sculpture sonore et lumineuse
      for (let k = 0; k < 7; k++) { const y = 0.3 + k * 0.25; const rr = 0.45 + 0.25 * Math.sin(k * 0.7); const n = 22; for (let i = 0; i < n; i++) { const a = i / n * 6.283; K3.pt(L, Math.cos(a) * rr, y, Math.sin(a) * rr, 'css', 0.06); } }
      K3.ligne(L, [0, 0, 0], [0, 2.1, 0], 'gris', 0.1); K3.sphere(L, 0, 2.3, 0, 0.18, 'or', 24, 0.06);
      K3.ligne(L, [-0.9, 0.05, 1.2], [0.9, 0.05, 1.2], 'gris', 0.1);
      const cam = orbiteC(L, w, h, 0, 1.1, 0, 4.6, 2.2, t * 0.3, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [0, 0.12, 1.4], '1 800 mm', GRIS, 9); etiq(ctx, cam, [0, 2.7, 0], m[0], ENCRE);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -3, -3, 3, 3, 0.5); const k = lis(ph / 12); const haut = 0.3 + k * 1.8;
      // la pièce se construit, couche après couche (bois, métal, résine), sous la tête de la machine
      for (let kk = 0; kk < 7; kk++) { const y = 0.3 + kk * 0.25; if (y > haut) break; const rr = 0.45 + 0.25 * Math.sin(kk * 0.7); const n = 26; for (let i = 0; i < n; i++) { const a = i / n * 6.283; K3.pt(L, Math.cos(a) * rr, y, Math.sin(a) * rr, kk < 2 ? 'ocre' : kk < 5 ? 'gris' : 'css', 0.09); } }
      const tx = Math.cos(t * 2.2) * 0.55; const tz = Math.sin(t * 2.2) * 0.55;
      K3.boite(L, 0, 2.6, 0, 3, 0.1, 0.12, 'gris', 0.15); K3.ligne(L, [tx, 2.6, tz], [tx, haut + 0.15, tz], 'encre', 0.06); K3.sphere(L, tx, haut + 0.1, tz, 0.06, 'or', 10, 0.05);
      for (let p = 0; p < 10; p++) { const a = t * 8 + p; K3.pt(L, tx + Math.cos(a) * 0.25 * hsh(p), haut + hsh(p + 9) * 0.3, tz + Math.sin(a) * 0.25 * hsh(p + 3), 'ocre', 0.05); }
      const cam = orbiteC(L, w, h, 0, 1.1, 0, 4.4, 2.4, 0.8 + t * 0.12, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [1.6, 2.85, 0], m[1], ENCRE); etiq(ctx, cam, [0.9, 0.35, 0], m[2], OCRE); etiq(ctx, cam, [0.95, 1.1, 0], m[3], GRIS); etiq(ctx, cam, [0.9, 1.75, 0], m[4], css);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.L) {
        s.L = []; const L = s.L; K3.sol(L, -5, -5, 5, 5, 0.6); K3.mur(L, -5, -5, 5, -5, 3); K3.mur(L, -5, -5, -5, 5, 3);
        K3.boite(L, 0, 0, 0, 1, 0.8, 1, 'gris', 0.12);
        for (let k = 0; k < 7; k++) { const y = 1.1 + k * 0.25; const rr = 0.45 + 0.25 * Math.sin(k * 0.7); for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283; K3.pt(L, Math.cos(a) * rr, y, Math.sin(a) * rr, k < 2 ? 'ocre' : k < 5 ? 'gris' : 'css', 0.08); } }
        K3.boite(L, -3.5, 0, -3.8, 0.8, 1.2, 0.8, 'gris', 0.12); K3.boite(L, 3.4, 0, -3.6, 1.2, 0.6, 0.6, 'gris', 0.12);
      }
      const L = s.L.slice();
      for (let k = 0; k < 40; k++) { const u = k / 40; const y = 4.2 - u * 2.2; const rr = u * 1.1; const a = k * 2.4; L.push({ x: Math.cos(a) * rr, y, z: Math.sin(a) * rr, r: 'or', t: 0.05, a: 0.4, g: GCLES[k % GCLES.length] }); }
      K3.sphere(L, 0, 3.15, 0, 0.18 + 0.04 * Math.sin(t * 4), 'or', 22, 0.07);
      [[2, 1.5, 0.4], [-2, 2, 1.8], [1.4, -2, 3]].forEach(([x, z, d], i) => K3.humain(L, x + Math.sin(t * 0.3 + i) * 0.3, z, t * 0.3 + i, 'encre', 0.15, Math.atan2(-z, -x) + Math.PI / 2));
      const cam = orbiteC(L, w, h, 0, 1.2, 0, 8.5, 4.5, 0.6 + ph * 0.04, 0.95); rendre3d(ctx, cam, L, css, { portee: 22 });
      etiq(ctx, cam, [0, 3.6, 0], m[5], css, 11, 'center', '600 '); etiq(ctx, cam, [-3.5, 1.5, -3.8], m[6], GRIS); etiq(ctx, cam, [3.4, 0.9, -3.6], m[7], GRIS);
    },
  ],
  // ---- capteurs & interaction : des objets dédiés aux danseurs, aux musiciens, à la scénographie
  'sv-capteurs': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -3, -3, 3, 3, 0.5);
      const J = K3.humain(L, 0, 0, t, 'encre', 1);
      [J.mainG, J.mainD, J.piedG, J.piedD].forEach((p) => K3.boite(L, p[0], p[1] - 0.04, p[2], 0.1, 0.08, 0.1, 'or', 0.04, 0.05));
      const cam = orbiteC(L, w, h, 0, 1, 0, 4, 1.7, 0.4 + t * 0.15, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [J.mainD[0] + 0.1, J.mainD[1] + 0.2, J.mainD[2]], m[0], OR); etiq(ctx, cam, [0, 2.1, 0], m[1], ENCRE);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -3, -3, 3, 3, 0.5);
      const J = K3.humain(L, 0, 0, t, 'encre', 1); const cap = [J.mainG, J.mainD, J.piedG, J.piedD];
      cap.forEach((p) => K3.boite(L, p[0], p[1] - 0.04, p[2], 0.1, 0.08, 0.1, 'or', 0.04, 0.05));
      // le récepteur, et les signaux sans fil qui le rejoignent
      const R = [2.2, 1, -1.2]; K3.boite(L, R[0], 0, R[2], 0.4, 1, 0.3, 'css', 0.08);
      cap.forEach((p, i) => { for (let k = 0; k < 7; k++) { const u = ((t * 0.9 + k / 7 + i * 0.21) % 1); K3.pt(L, p[0] + (R[0] - p[0]) * u, p[1] + (R[1] - p[1]) * u + Math.sin(u * 3.14) * 0.6, p[2] + (R[2] - p[2]) * u, 'or', 0.06); } });
      // les courbes de mouvement, écrites dans l'air au-dessus
      for (let i = 0; i < 40; i++) { const u = i / 40; K3.pt(L, -1.8 + u * 3.6, 2.6 + Math.sin(u * 9 - t * 2) * 0.18, -1.5, 'css', 0.05); K3.pt(L, -1.8 + u * 3.6, 2.2 + Math.sin(u * 5 - t * 3) * 0.15, -1.5, 'or', 0.05); }
      const cam = orbiteC(L, w, h, 0.3, 1.2, -0.3, 4.6, 2, 0.9 + t * 0.08, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [R[0], R[1] + 0.25, R[2]], m[2], css); etiq(ctx, cam, [0, 3, -1.5], m[3], GRIS);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -5, -4, 5, 4, 0.6); K3.boite(L, 0, 0, -0.5, 7, 0.3, 5, 'sombre', 0.4);
      const J = K3.humain(L, -1.2, 0.2, t, 'encre', 1); const v = Math.max(0, Math.min(1, (J.mainD[1] - 1.1) / 0.6));
      // la lumière suit la main du danseur, le son suit le musicien
      [-2.6, -1.2, 0.2].forEach((x, i) => { const n = 30; for (let k = 0; k < n; k++) { const u = k / n; const rr = u * 0.9; const a = k * 2.4 + t; L.push({ x: x + Math.cos(a) * rr, y: 4 - u * 3.6, z: 0.2 + Math.sin(a) * rr, r: 'or', t: 0.06, a: 0.2 + 0.6 * v * (i === 1 ? 1 : 0.5), g: GCLES[k % GCLES.length] }); } K3.boite(L, x, 4, 0.2, 0.25, 0.2, 0.25, 'encre', 0.06); });
      K3.humain(L, 2.4, -0.8, t * 0.6, 'encre', 0.3); K3.boite(L, 2.4, 0, -0.3, 0.9, 0.8, 0.4, 'gris', 0.1); anneaux(L, 2.4, 1, -0.3, t, 'css', 3, 1.6, 0.8, 'v');
      [J.mainG, J.mainD].forEach((p) => K3.boite(L, p[0], p[1] - 0.04, p[2], 0.1, 0.08, 0.1, 'or', 0.04, 0.05));
      const cam = orbiteC(L, w, h, 0, 1.2, 0, 8, 3, 1.3 + Math.sin(t * 0.2) * 0.3, 0.95); rendre3d(ctx, cam, L, css, { portee: 20 });
      etiq(ctx, cam, [-1.2, 2.2, 0.2], m[4], ENCRE); etiq(ctx, cam, [2.4, 2.1, -0.8], m[5], ENCRE); etiq(ctx, cam, [-1.2, 4.4, 0.2], m[6], OR);
    },
  ],
  // ---- Go2 sur mesure : le robot, sa chorégraphie, la location pour la scène
  'sv-go2': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -2, -2, 2, 2, 0.35); const tete = K3.go2(L, 0, 0, 0, t, 'encre', 1);
      const cam = orbiteC(L, w, h, 0, 0.3, 0, 2.6, 1.2, t * 0.35, 1.0); rendre3d(ctx, cam, L, css, { portee: 9 });
      etiq(ctx, cam, [0, 0.75, 0], m[0], ENCRE, 11);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -4, -3, 4, 3, 0.5); K3.boite(L, 0, 0, 0, 7, 0.02, 5, 'sombre', 0.5);
      const pts = [[-2.5, -1.5], [2, -1.8], [2.6, 1.4], [-0.5, 1.8], [-1.8, 0.4]];
      pts.forEach((p, i) => { const q = pts[(i + 1) % 5]; for (let k = 0; k < 14; k++) if (k % 2 === 0) K3.pt(L, p[0] + (q[0] - p[0]) * k / 14, 0.02, p[1] + (q[1] - p[1]) * k / 14, 'css', 0.06); K3.boite(L, p[0], 0, p[1], 0.18, 0.04, 0.18, 'css', 0.05); });
      const u = (t * 0.1) % 1 * 5; const i = Math.floor(u); const f = lis(u - i); const a = pts[i]; const b = pts[(i + 1) % 5];
      K3.go2(L, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0]), t, 'encre', 1);
      const cam = orbiteC(L, w, h, 0, 0, 0, 6.5, 4.2, 1.2 + Math.sin(t * 0.15) * 0.3, 1.0); rendre3d(ctx, cam, L, css);
      pts.forEach((p, k) => etiq(ctx, cam, [p[0], 0.3, p[1]], String(k + 1), css, 10)); etiq(ctx, cam, [0, 0.1, 3.2], m[1], GRIS);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.L) { s.L = []; K3.sol(s.L, -5, -4, 5, 5, 0.6); K3.boite(s.L, 0, 0, 0, 7, 0.3, 4.5, 'sombre', 0.45); for (let i = 0; i < 12; i++) K3.pt(s.L, -3.3 + (i % 6) * 1.3, 0.9, 3.4 + Math.floor(i / 6) * 0.8, 'gris', 0.14); }
      const L = s.L.slice();
      // le robot loué, équipé sur mesure : un mégaphone, une lumière ; il joue pour le public
      const x = Math.sin(t * 0.35) * 2; const ang = Math.cos(t * 0.35) > 0 ? 0 : Math.PI; const dos = K3.go2(L, x, 0, ang, t, 'encre', 1); const dy = 0.3;
      K3.ligne(L, [dos[0], dos[1] + dy - 0.3, dos[2]], [dos[0] + 0.3, dos[1] + dy, dos[2]], 'encre', 0.04); for (let a = 0; a < 6.28; a += 0.5) K3.pt(L, dos[0] + 0.32, dos[1] + dy + Math.sin(a) * 0.12, dos[2] + Math.cos(a) * 0.12, 'encre', 0.04);
      anneaux(L, dos[0] + 0.45, dos[1] + dy, dos[2], t, 'or', 3, 1.8, 0.8, 'v');
      for (let k = 0; k < 24; k++) { const u = k / 24; L.push({ x: x + Math.cos(k * 2.4) * u * 0.8, y: 3.6 - u * 3.2, z: Math.sin(k * 2.4) * u * 0.8, r: 'css', t: 0.06, a: 0.35, g: GCLES[k % GCLES.length] }); }
      const cam = orbiteC(L, w, h, 0, 0.6, 0.6, 7.5, 3, 1.57 + Math.sin(t * 0.18) * 0.35, 0.95); rendre3d(ctx, cam, L, css, { portee: 20 });
      etiq(ctx, cam, [0, 1.9, 0], m[2], css, 11, 'center', '600 '); etiq(ctx, cam, [0, 1.4, 4], m[3], GRIS);
    },
  ],
  // ---- robotique pour la scène : un actionneur, toute la robotique, en scène
  'sv-robot': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -2.5, -2.5, 2.5, 2.5, 0.4);
      // un bras robotique frappe une cloche
      const a1 = 0.6 + Math.sin(t * 2) * 0.35; const a2 = -1 + Math.max(0, Math.sin(t * 2)) * 0.9; const base = [-0.8, 0, 0]; const ep = [base[0], 0.9, 0]; const coude = [ep[0] + Math.cos(a1) * 0.8, ep[1] + Math.sin(a1) * 0.8, 0]; const main = [coude[0] + Math.cos(a1 + a2) * 0.7, coude[1] + Math.sin(a1 + a2) * 0.7, 0];
      K3.boite(L, base[0], 0, 0, 0.4, 0.2, 0.4, 'gris', 0.08); K3.ligne(L, base, ep, 'encre', 0.05); K3.ligne(L, ep, coude, 'encre', 0.05); K3.ligne(L, coude, main, 'css', 0.05); K3.sphere(L, ...main, 0.06, 'or', 10, 0.05);
      for (let k = 0; k < 6; k++) { const rr = 0.15 + k * 0.08; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28; K3.pt(L, 0.9 + Math.cos(a) * rr, 0.75 - k * 0.12, Math.sin(a) * rr, 'ocre', 0.05); } }
      const frappe = Math.sin(t * 2) > 0.92; if (frappe || ((t * 2) % 6.283) < 2) anneaux(L, 0.9, 0.5, 0, t, 'or', 3, 1.8, 1.2);
      const cam = orbiteC(L, w, h, 0.1, 0.7, 0, 3.4, 1.5, 0.9 + Math.sin(t * 0.2) * 0.4, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [coude[0], coude[1] + 0.25, 0], m[0], css); etiq(ctx, cam, [0.9, 0.95, 0], m[1], OCRE);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -5, -4, 5, 4, 0.6);
      // toute sorte de robotique : bras, base roulante, quadrupède, sculpture cinétique
      const a1 = 0.6 + Math.sin(t * 2) * 0.4; K3.boite(L, -3, 0, -1, 0.4, 0.2, 0.4, 'gris', 0.08); K3.ligne(L, [-3, 0, -1], [-3, 0.9, -1], 'encre', 0.06); const c = [-3 + Math.cos(a1) * 0.8, 0.9 + Math.sin(a1) * 0.8, -1]; K3.ligne(L, [-3, 0.9, -1], c, 'css', 0.06);
      const rx = -0.8 + Math.sin(t * 0.7) * 1; K3.boite(L, rx, 0.15, 1.6, 0.8, 0.4, 0.6, 'encre', 0.08); [[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]].forEach(([dx, dz]) => K3.sphere(L, rx + dx, 0.12, 1.6 + dz, 0.12, 'gris', 10, 0.04)); K3.ligne(L, [rx, 0.55, 1.6], [rx, 1.6, 1.6], 'gris', 0.08); K3.sphere(L, rx, 1.7, 1.6, 0.15, 'or', 18, 0.05);
      K3.go2(L, 1.6, -1.5, t * 0.4, t, 'encre', 1);
      for (let i = 0; i < 5; i++) { const ang = Math.sin(t * 1.2 + i * 0.7) * 0.5; const top = [2.4 + i * 0.3, 2.6, 1.6]; K3.ligne(L, top, [top[0] + Math.sin(ang) * 1.3, 2.6 - Math.cos(ang) * 1.3, 1.6], 'gris', 0.1); K3.sphere(L, top[0] + Math.sin(ang) * 1.3, 2.6 - Math.cos(ang) * 1.3, 1.6, 0.1, 'css', 12, 0.05); }
      K3.ligne(L, [2.3, 2.6, 1.6], [3.8, 2.6, 1.6], 'encre', 0.08);
      const cam = orbiteC(L, w, h, 0.3, 1, 0, 8, 3.2, 1.2 + Math.sin(t * 0.15) * 0.4, 0.95); rendre3d(ctx, cam, L, css, { portee: 20 });
      etiq(ctx, cam, [-3, 2.1, -1], m[2], GRIS); etiq(ctx, cam, [rx, 2.1, 1.6], m[3], GRIS); etiq(ctx, cam, [1.6, 0.9, -1.5], m[4], GRIS); etiq(ctx, cam, [3, 2.9, 1.6], m[5], GRIS);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.L) { s.L = []; K3.sol(s.L, -6, -4, 6, 6, 0.6); K3.boite(s.L, 0, 0, 0, 9, 0.3, 5, 'sombre', 0.45); for (let i = 0; i < 18; i++) K3.pt(s.L, -4 + (i % 9), 0.9, 4 + Math.floor(i / 9) * 0.9, 'gris', 0.14); }
      const L = s.L.slice(); const pas = Math.floor(t * 2) % 4;
      [-3, -1, 1, 3].forEach((x, i) => { const on = i === pas; const ang = on ? 1.2 : 0.4; K3.boite(L, x, 0.3, -1, 0.4, 0.2, 0.4, 'gris', 0.08); K3.ligne(L, [x, 0.3, -1], [x, 1.2, -1], 'encre', 0.06); K3.ligne(L, [x, 1.2, -1], [x + Math.cos(ang) * 0.7, 1.2 + Math.sin(ang) * 0.7, -1], on ? 'or' : 'css', 0.06);
        for (let k = 0; k < 20; k++) { const u = k / 20; L.push({ x: x + Math.cos(k * 2.4) * u * 0.7, y: 4 - u * 3.6, z: -1 + Math.sin(k * 2.4) * u * 0.7, r: on ? 'or' : 'css', t: 0.06, a: on ? 0.5 : 0.12, g: GCLES[k % GCLES.length] }); }
        if (on) anneaux(L, x, 1.6, -1, t, 'or', 2, 1.4, 1.4, 'v'); });
      const cam = orbiteC(L, w, h, 0, 1, 1, 9.5, 3.4, 1.57 + Math.sin(t * 0.15) * 0.3, 0.95); rendre3d(ctx, cam, L, css, { portee: 24 });
      etiq(ctx, cam, [0, 4.4, -1], m[6], css, 11, 'center', '600 '); etiq(ctx, cam, [0, 1.6, 4.5], m[7], GRIS);
    },
  ],
  // ---- objets audio : un petit objet sonore à notre esthétique, il sonne, une famille d'objets
  'sv-audio': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -1.5, -1.5, 1.5, 1.5, 0.25);
      // un petit objet rond : la coque, un écran, des boutons, un glyphe gravé
      for (let k = 0; k < 6; k++) { const y = 0.05 + k * 0.05; const rr = 0.5 - Math.abs(k - 2.5) * 0.04; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283; K3.pt(L, Math.cos(a) * rr, y, Math.sin(a) * rr, 'encre', 0.035); } }
      K3.boite(L, -0.18, 0.32, -0.05, 0.22, 0.01, 0.16, 'css', 0.03, 0.03);
      for (let i = 0; i < 3; i++) { const bx = 0.12 + i * 0.1; for (let a = 0; a < 6.28; a += 0.8) K3.pt(L, bx + Math.cos(a) * 0.035, 0.33, 0.15 + Math.sin(a) * 0.035, 'or', 0.025); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + 0.5; K3.pt(L, Math.cos(a) * 0.53, 0.18, Math.sin(a) * 0.53, 'ocre', 0.04); }
      const cam = orbiteC(L, w, h, 0, 0.15, 0, 1.5, 0.9, t * 0.35, 1.0); rendre3d(ctx, cam, L, css, { portee: 6 });
      etiq(ctx, cam, [0, 0.55, 0], m[0], ENCRE, 11); etiq(ctx, cam, [0.55, 0.2, 0.4], m[1], OCRE, 9);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -2, -2, 2, 2, 0.3);
      for (let k = 0; k < 6; k++) { const y = 0.05 + k * 0.05; const rr = 0.5 - Math.abs(k - 2.5) * 0.04; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283; K3.pt(L, Math.cos(a) * rr, y, Math.sin(a) * rr, 'encre', 0.035); } }
      const doigt = (t % 2) < 0.3; const dy = doigt ? 0.36 : 0.6 + Math.sin(t) * 0.05; K3.ligne(L, [0.2, dy, 0.15], [0.5, dy + 0.5, 0.5], 'gris', 0.04);
      anneaux(L, 0, 0.3, 0, t, 'css', 4, 1.8, 0.7); anneaux(L, 0, 0.3, 0, t + 0.3, 'or', 2, 1.2, 0.7, 'v');
      const cam = orbiteC(L, w, h, 0, 0.3, 0, 2.6, 1.3, 0.7 + t * 0.15, 1.0); rendre3d(ctx, cam, L, css, { portee: 8 });
      etiq(ctx, cam, [0.6, 1.1, 0.5], m[2], GRIS); etiq(ctx, cam, [0, 1.3, 0], m[3], css, 11);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.boite(L, 0, 0, 0, 4.2, 0.75, 1.6, 'ocre', 0.25); const tour = Math.floor(t * 1.5) % 5;
      [-1.6, -0.8, 0, 0.8, 1.6].forEach((x, i) => { const rr = 0.22 + (i % 2) * 0.06; for (let k = 0; k < 4; k++) for (let a = 0; a < 6.28; a += 0.35) K3.pt(L, x + Math.cos(a) * rr, 0.8 + k * 0.05, Math.sin(a) * rr * (i % 3 === 0 ? 0.6 : 1), i === tour ? 'or' : 'encre', 0.035); if (i === tour) anneaux(L, x, 1, 0, t, 'or', 2, 1, 1.2); });
      const cam = orbiteC(L, w, h, 0, 0.8, 0, 4, 2.2, 1.2 + Math.sin(t * 0.2) * 0.4, 1.0); rendre3d(ctx, cam, L, css, { portee: 10 });
      etiq(ctx, cam, [0, 1.6, 0], m[4], css, 11);
    },
  ],
  // ---- scénographie & lumière : un objet lumineux intelligent, piloté en Wi-Fi, une scène de lumière
  'sv-lumiere': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -1.5, -1.5, 1.5, 1.5, 0.25); const v = 0.5 + 0.5 * Math.sin(t * 1.5);
      // un tube lumineux, et sa carte électronique dedans
      K3.cylindre(L, 0, 0, 0.14, 0.2, 1.6, 'encre', 0.08, 0.04); for (let y = 0.25; y < 1.6; y += 0.08) L.push({ x: 0, y, z: 0, r: 'or', t: 0.07, a: 0.3 + 0.7 * v, g: GCLES[Math.round(y * 50) % GCLES.length] });
      K3.boite(L, 0, 0, 0, 0.5, 0.2, 0.5, 'gris', 0.06); K3.boite(L, 0, 0.06, 0, 0.22, 0.02, 0.14, 'css', 0.03, 0.03);
      const cam = orbiteC(L, w, h, 0, 0.8, 0, 2.6, 1.1, t * 0.3, 1.0); rendre3d(ctx, cam, L, css, { portee: 8 });
      etiq(ctx, cam, [0.35, 0.15, 0], m[0], css, 10, 'left'); etiq(ctx, cam, [0, 1.85, 0], m[1], OR, 11);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -4, -3, 4, 3, 0.5); const C = [-3, 0.9, 2];
      K3.boite(L, C[0], 0.7, C[2], 0.6, 0.05, 0.4, 'css', 0.06); K3.ligne(L, [C[0], 0, C[2]], [C[0], 0.7, C[2]], 'gris', 0.1);
      const lampes = [[-1, -1.5], [0.5, -1.8], [2, -1.2], [1.2, 0.8], [-0.4, 0.6]];
      lampes.forEach(([x, z], i) => { const v = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.3); K3.cylindre(L, x, z, 0.1, 0.1, 1.3, 'encre', 0.1, 0.035); for (let y = 0.15; y < 1.3; y += 0.12) L.push({ x, y, z, r: i % 2 ? 'css' : 'or', t: 0.08, a: 0.2 + 0.8 * v, g: GCLES[(i * 9 + Math.round(y * 10)) % GCLES.length] });
        for (let k = 0; k < 6; k++) { const u = ((t * 0.7 + k / 6 + i * 0.17) % 1); K3.pt(L, C[0] + (x - C[0]) * u, 0.9 + Math.sin(u * 3.14) * 1.2 + (1.3 - 0.9) * u, C[2] + (z - C[2]) * u, 'css', 0.05); } });
      const cam = orbiteC(L, w, h, -0.5, 0.7, 0, 6, 2.6, 1.0 + Math.sin(t * 0.2) * 0.3, 1.0); rendre3d(ctx, cam, L, css);
      etiq(ctx, cam, [C[0], 1.05, C[2]], m[2], css); etiq(ctx, cam, [0.5, 2.6, -0.3], m[3], OR);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      if (!s.L) { s.L = []; K3.sol(s.L, -6, -4, 6, 6, 0.6); K3.boite(s.L, 0, 0, 0, 10, 0.3, 5, 'sombre', 0.45); for (let i = 0; i < 18; i++) K3.pt(s.L, -4 + (i % 9), 0.9, 4 + Math.floor(i / 9) * 0.9, 'gris', 0.14); }
      const L = s.L.slice();
      // une forêt de tubes lumineux : une vague de lumière les traverse
      for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) { const x = -4 + i; const z = -1.5 + j * 1.2; const v = 0.5 + 0.5 * Math.sin(t * 2.5 - i * 0.6 - j * 0.4); for (let y = 0.4; y < 2.2; y += 0.18) L.push({ x, y, z, r: v > 0.7 ? 'or' : 'css', t: 0.09, a: 0.12 + 0.88 * v, g: GCLES[(i * 5 + j * 3 + Math.round(y * 10)) % GCLES.length] }); }
      const cam = orbiteC(L, w, h, 0, 1.1, 0.5, 9, 3.2, 1.57 + Math.sin(t * 0.15) * 0.35, 0.95); rendre3d(ctx, cam, L, css, { portee: 24 });
      etiq(ctx, cam, [0, 2.8, -0.3], m[4], css, 11, 'center', '600 ');
    },
  ],
});

// ---------------------------------------------------------------- BOUTIQUE · electronic gear : les capteurs AS-SIMT et les PCB sur mesure, en 3D
function tripode3d (L, x, y, z, ang, s = 1, r = 'encre') {
  // le capteur : un petit boîtier imprimé en 3D, qui porte sa carte
  const c = Math.cos(ang); const sn = Math.sin(ang); const P = (dx, dy, dz) => [x + dx * c - dz * sn, y + dy, z + dx * sn + dz * c];
  const lx = 0.16 * s; const ly = 0.2 * s; const lz = 0.07 * s; const pas = 0.025 * s;
  for (const dz of [-lz, lz]) for (let dx = -lx; dx <= lx + 1e-6; dx += pas) { K3.pt(L, ...P(dx, 0, dz), r, 0.012 * s); K3.pt(L, ...P(dx, ly, dz), r, 0.012 * s); }
  for (const dx of [-lx, lx]) for (const dz of [-lz, lz]) for (let dy = 0; dy <= ly + 1e-6; dy += pas) K3.pt(L, ...P(dx, dy, dz), r, 0.012 * s);
  for (let dx = -lx * 0.7; dx <= lx * 0.7; dx += pas * 1.5) for (let dy = ly * 0.15; dy <= ly * 0.85; dy += pas * 1.5) K3.pt(L, ...P(dx, dy, lz + 0.005), 'css', 0.012 * s);
}
// une carte électronique : une puce au centre, des pistes parallèles qui s'écartent en miroir vers les bords, des vias, un connecteur doré
function pcbCarte (L, t, k) {
  const VERT = '#2f6b3a';
  K3.boite(L, 0, 0, 0, 2.4, 0.04, 1.6, VERT, 0.08);
  for (const [x, z] of [[-1.08, -0.68], [1.08, -0.68], [-1.08, 0.68], [1.08, 0.68]]) for (let a = 0; a < 6.28; a += 0.5) K3.pt(L, x + Math.cos(a) * 0.05, 0.045, z + Math.sin(a) * 0.05, 'gris', 0.02);
  K3.boite(L, 0, 0.04, 0, 0.36, 0.05, 0.36, 'encre', 0.03, 0.03);
  for (let i = 0; i < 16; i++) { const z = -0.38 + i * 0.05; K3.pt(L, 0.6, 0.045, z, 'or', 0.02); K3.pt(L, -0.6, 0.045, z, 'or', 0.02); }
  for (let i = 0; i < 10; i++) K3.boite(L, -0.45 + i * 0.1, 0.04, 0.78, 0.06, 0.005, 0.12, 'or', 0.02, 0.02);
  const pistes = [];
  // côtés gauche et droit : des faisceaux parallèles qui s'ouvrent en miroir (haut vers le haut, bas vers le bas)
  for (const sx of [-1, 1]) for (let i = 0; i < 8; i++) {
    const zp = -0.14 + i * 0.04; const sz = zp < 0 ? -1 : 1; const ecart = Math.abs(zp) + 0.02;
    const a = [sx * 0.19, zp]; const b = [sx * 0.3, zp]; const c = [sx * (0.3 + ecart * 1.6), zp + sz * ecart * 1.6]; const d = [sx * 0.6, c[1]];
    pistes.push([a, b, c, d]);
  }
  // bas : des pistes droites vers le connecteur doré
  for (let i = 0; i < 10; i++) { const x0 = -0.135 + i * 0.03; const x1 = -0.45 + i * 0.1; pistes.push([[x0, 0.19], [x0, 0.4], [x1, 0.4 + Math.abs(x1 - x0)], [x1, 0.72]]); }
  // haut : quatre pistes vers des composants
  for (let i = 0; i < 4; i++) { const x0 = -0.09 + i * 0.06; pistes.push([[x0, -0.19], [x0, -0.5]]); }
  pistes.forEach((p, n) => {
    const longueur = p.slice(1).reduce((acc, q, j) => acc + Math.hypot(q[0] - p[j][0], q[1] - p[j][1]), 0); let fait = 0; const lim = longueur * Math.min(1, k * 1.4 - (n % 8) * 0.03);
    for (let j = 1; j < p.length; j++) { const A = p[j - 1]; const B = p[j]; const l = Math.hypot(B[0] - A[0], B[1] - A[1]); const u = Math.max(0, Math.min(1, (lim - fait) / l)); if (u > 0) K3.ligne(L, [A[0], 0.045, A[1]], [A[0] + (B[0] - A[0]) * u, 0.045, A[1] + (B[1] - A[1]) * u], 'ocre', 0.02, 0.018); fait += l; }
    const fin = p[p.length - 1]; if (k > 0.9) for (let a = 0; a < 6.28; a += 1.2) K3.pt(L, fin[0] + Math.cos(a) * 0.015, 0.046, fin[1] + Math.sin(a) * 0.015, 'or', 0.015);
    // une impulsion qui circule dans la piste
    if (k > 0.6) { let q = ((t * 0.5 + n * 0.137) % 1) * longueur; for (let j = 1; j < p.length; j++) { const A = p[j - 1]; const B = p[j]; const l = Math.hypot(B[0] - A[0], B[1] - A[1]); if (q <= l) { K3.pt(L, A[0] + (B[0] - A[0]) * q / l, 0.05, A[1] + (B[1] - A[1]) * q / l, 'or', 0.045); break; } q -= l; } }
  });
  return pistes;
}
Object.assign(SV, {
  'gear-capteurs': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -1, -1, 1, 1, 0.15);
      const a = 0; tripode3d(L, 0, 0.05, 0, a, 2.6);
      // dedans : la carte ESP32, le capteur de mouvement, trois moteurs de vibration
      K3.boite(L, 0.14, 0.3, 0.19, 0.1, 0.02, 0.06, 'or', 0.02, 0.025);
      const M = [[-0.25, 0.15, 0.1], [-0.25, 0.3, 0.1], [-0.25, 0.45, 0.1]]; M.forEach((p) => K3.sphere(L, ...p, 0.04, 'ocre', 12, 0.025));
      const cam = orbiteC(L, w, h, 0, 0.3, 0, 1.9, 0.9, 0.9 + Math.sin(t * 0.3) * 0.6, 1.0); rendre3d(ctx, cam, L, css, { portee: 6 });
      etiq(ctx, cam, [0, 0.7, 0.19], m[0], css, 10); etiq(ctx, cam, [0.5, 0.05, 0.19], m[1], OR, 10, 'left'); etiq(ctx, cam, [-0.55, 0.75, 0.1], m[2], OCRE, 10, 'right');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -2.5, -2.5, 2.5, 2.5, 0.4);
      const J = K3.humain(L, 0, 0, t, 'encre', 1);
      tripode3d(L, J.mainD[0], J.mainD[1] - 0.03, J.mainD[2], t, 0.6, 'or'); tripode3d(L, J.mainG[0], J.mainG[1] - 0.03, J.mainG[2], t, 0.6, 'or');
      // le mouvement mesuré : trois courbes, x y z, écrites dans l'air
      ['css', 'or', 'encre'].forEach((c, i) => { for (let k = 0; k < 40; k++) { const u = k / 40; K3.pt(L, -1.6 + u * 3.2, 2.4 + i * 0.25 + Math.sin(u * (6 + i * 3) - t * (2 + i)) * 0.1, -1, c, 0.04); } });
      const cam = orbiteC(L, w, h, 0, 1.3, -0.3, 4, 1.8, 1.2 + Math.sin(t * 0.2) * 0.4, 1.0); rendre3d(ctx, cam, L, css, { portee: 10 });
      etiq(ctx, cam, [J.mainD[0], J.mainD[1] + 0.2, J.mainD[2]], m[3], OR); etiq(ctx, cam, [1.8, 2.65, -1], m[4], GRIS, 10, 'left');
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -3, -2.5, 3, 2.5, 0.45);
      const J = K3.humain(L, -1.6, 0.4, t, 'encre', 0.8); const src = J.mainD; tripode3d(L, src[0], src[1] - 0.03, src[2], t, 0.6, 'or');
      // trois façons d'envoyer : OSC en Wi-Fi vers l'ordinateur, MIDI vers un synthé, la page web vers un téléphone
      const D = [[1.8, 0.9, -1.4], [2.2, 0.7, 0.4], [1.4, 1.1, 1.8]];
      K3.boite(L, D[0][0], 0.75, D[0][2], 0.7, 0.04, 0.45, 'css', 0.06); K3.boite(L, D[0][0], 0.79, D[0][2] - 0.22, 0.7, 0.42, 0.02, 'css', 0.06);
      K3.boite(L, D[1][0], 0.55, D[1][2], 0.9, 0.12, 0.35, 'encre', 0.06);
      K3.boite(L, D[2][0], 1, D[2][2], 0.18, 0.32, 0.03, 'css', 0.04);
      D.forEach((d, i) => { for (let k = 0; k < 10; k++) { const u = ((t * 0.6 + k / 10 + i * 0.27) % 1); K3.pt(L, src[0] + (d[0] - src[0]) * u, src[1] + (d[1] - src[1]) * u + Math.sin(u * 3.14) * 0.6, src[2] + (d[2] - src[2]) * u, 'or', 0.06); } });
      anneaux(L, src[0], src[1], src[2], t, 'css', 2, 1, 0.8, 'v');
      const cam = orbiteC(L, w, h, 0.3, 0.9, 0.2, 5.6, 2.4, 1.35 + Math.sin(t * 0.2) * 0.3, 1.0); rendre3d(ctx, cam, L, css, { portee: 14 });
      etiq(ctx, cam, [D[0][0], 1.35, D[0][2]], m[5], css); etiq(ctx, cam, [D[1][0], 0.95, D[1][2]], m[6], ENCRE); etiq(ctx, cam, [D[2][0], 1.5, D[2][2]], m[7], css);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; K3.sol(L, -2, -2, 2, 2, 0.3);
      // le retour : le son revient sur le poignet, les trois moteurs vibrent, on l'entend par la peau
      const P = [0, 0.9, 0]; K3.ligne(L, [-1.6, 0.85, 0], [0.4, 0.95, 0], 'encre', 0.04); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; K3.ligne(L, [0.4, 0.95, 0], [0.55 + Math.cos(a) * 0.06, 0.95 + Math.sin(a) * 0.06, 0], 'encre', 0.04); }
      tripode3d(L, P[0], P[1], P[2], t * 0.2, 0.9, 'or');
      const C = [-1.4, 1.6, -1.2]; K3.boite(L, C[0], 1.2, C[2], 0.6, 0.04, 0.4, 'css', 0.05);
      for (let k = 0; k < 10; k++) { const u = ((t * 0.6 + k / 10) % 1); K3.pt(L, C[0] + (P[0] - C[0]) * u, 1.25 + (P[1] - 1.25) * u + Math.sin(u * 3.14) * 0.4, C[2] + (P[2] - C[2]) * u, 'css', 0.05); }
      [0, 1, 2].forEach((k) => { const x = -0.12 + k * 0.12; const z = 0; const on = Math.floor(t * 3) % 3 === k; if (on) for (let q = 0; q < 3; q++) { const rr = 0.06 + ((t * 2 + q / 3) % 1) * 0.3; for (let i = 0; i < 14; i++) { const b = i / 14 * 6.283; L.push({ x: x + Math.cos(b) * rr, y: 0.97, z: z + Math.sin(b) * rr, r: 'ocre', t: 0.025, a: 1 - rr / 0.36, g: GCLES[i] }); } } });
      const cam = orbiteC(L, w, h, -0.2, 0.95, 0, 1.9, 1.5, 1.0 + Math.sin(t * 0.25) * 0.4, 1.0); rendre3d(ctx, cam, L, css, { portee: 7 });
      etiq(ctx, cam, [C[0], 1.45, C[2]], m[8], css); etiq(ctx, cam, [0, 1.25, 0], m[9], OCRE, 11);
    },
  ],
  'gear-pcb': [
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; pcbCarte(L, t, lis(ph / 10));
      const cam = orbiteC(L, w, h, 0, 0, 0.05, 1.9, 1.45, 1.57 + Math.sin(t * 0.18) * 0.45, 1.0); rendre3d(ctx, cam, L, css, { portee: 8 });
      etiq(ctx, cam, [0, 0.35, 0], m[1], ENCRE); etiq(ctx, cam, [0, 0.12, 0.95], m[0], OR);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = []; pcbCarte(L, t, 1);
      // les composants se posent sur la carte
      const comps = [[-0.75, -0.45, 0.16, 0.08, 0.1, 'encre'], [-0.75, 0.45, 0.16, 0.08, 0.1, 'encre'], [0.75, -0.45, 0.16, 0.08, 0.1, 'encre'], [0.75, 0.45, 0.16, 0.08, 0.1, 'encre'], [0, -0.62, 0.3, 0.12, 0.14, 'css'], [-0.95, 0, 0.12, 0.14, 0.12, 'ocre'], [0.95, 0, 0.12, 0.14, 0.12, 'ocre']];
      comps.forEach(([x, z, lx, ly, lz, c], i) => { const u = lis((ph - i * 1.3) / 1); if (u <= 0) return; K3.boite(L, x, 0.04 + (1 - u) * 0.8, z, lx, ly, lz, c, 0.03, 0.03); });
      const cam = orbiteC(L, w, h, 0, 0.1, 0, 2.1, 1.3, 0.8 + t * 0.12, 1.0); rendre3d(ctx, cam, L, css, { portee: 8 });
      etiq(ctx, cam, [0, 0.4, 0], m[1], ENCRE); etiq(ctx, cam, [0, 0.35, -0.62], m[2], css); etiq(ctx, cam, [0.95, 0.4, 0], m[3], OCRE);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      const L = [];
      // une petite série : les cartes s'empilent, puis l'une d'elles s'allume dans son objet
      const n = Math.min(6, 1 + Math.floor(ph / 1.5)); for (let i = 0; i < n; i++) K3.boite(L, -1, i * 0.12, 0, 1.2, 0.03, 0.8, '#3a7d44', 0.1);
      K3.boite(L, 1.1, 0, 0, 1.3, 0.5, 0.9, 'encre', 0.1); K3.boite(L, 1.1, 0.15, 0, 1, 0.03, 0.6, '#3a7d44', 0.08);
      const on = Math.sin(t * 5) > 0; K3.sphere(L, 1.4, 0.5, 0, 0.06, on ? 'or' : 'sombre', 12, 0.04); if (on) anneaux(L, 1.4, 0.55, 0, t, 'or', 2, 0.5, 1.2);
      const cam = orbiteC(L, w, h, 0, 0.3, 0, 3.2, 1.8, 1.2 + Math.sin(t * 0.2) * 0.4, 1.0); rendre3d(ctx, cam, L, css, { portee: 9 });
      etiq(ctx, cam, [-1, 0.9, 0], m[4], GRIS); etiq(ctx, cam, [1.1, 0.85, 0], m[5], css);
    },
  ],
});

// la réparation en quatre temps : remise à neuf, diagnostic, recalibrage, modifications
{
  const r = SV['sv-repar'];
  SV['sv-repar'] = [r[1], r[0], r[2], (ctx, w, h, t, ph, s, css, m) => {
    // un synthé qu'on modifie : une prise MIDI ajoutée, une carte de fonctions en plus
    const x0 = w * 0.08; const y0 = h * 0.18; const W = w * 0.84; const k = lis(ph / 4);
    boite(ctx, x0, y0, W, 80, ENCRE, '#0b0b0a'); for (let i = 0; i < 6; i++) bouton(ctx, x0 + 24 + i * 30, y0 + 24, 9, 1 + i + Math.sin(t + i) * 0.4, ENCRE);
    for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 7 === 2 || i % 7 === 5 ? '#000' : ENCRE; ctx.fillRect(x0 + W * 0.5 + i * (W * 0.48 / 14), y0 + 36, W * 0.48 / 14 - 2, 38); }
    texte(ctx, m[0], x0, y0 - 8, GRIS, 10);
    // la prise MIDI apparaît sur le côté
    const px = x0 + W - 4; const py = y0 + 40; ctx.globalAlpha = k; ctx.strokeStyle = OR; ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 5; i++) { const a = Math.PI * (0.85 + i * 0.325); ctx.fillStyle = OR; ctx.fillRect(px + Math.cos(a) * 8 - 1.5, py + Math.sin(a) * 8 - 1.5, 3, 3); } ctx.globalAlpha = 1;
    texte(ctx, m[6], px, py - 22, OR, 10, 'right');
    // la nouvelle carte, glissée dedans
    const u = lis((ph - 4) / 3); if (u > 0) { ctx.globalAlpha = u; boite(ctx, x0 + 20, y0 + 92 + (1 - u) * 30, W * 0.36, 34, '#3a7d44', '#0f2a14'); ctx.fillStyle = Math.sin(t * 6) > 0 ? OR : '#3a2a10'; ctx.fillRect(x0 + 30, y0 + 104 + (1 - u) * 30, 6, 6); texte(ctx, m[7], x0 + 20, y0 + 146 + (1 - u) * 30, css, 10); ctx.globalAlpha = 1; }
    // les messages MIDI qui partent vers un contrôleur
    const v = lis((ph - 7) / 2); if (v > 0) {
      const cx = w * 0.7; const cy = h * 0.72; ctx.globalAlpha = v; boite(ctx, cx - 50, cy - 18, 100, 36, css, '#0b0b0a'); texte(ctx, m[8], cx, cy + 4, css, 10, 'center');
      ctx.strokeStyle = OR; ctx.beginPath(); ctx.moveTo(px, py + 14); ctx.bezierCurveTo(px, cy - 60, cx + 60, cy - 60, cx + 50, cy); ctx.stroke();
      const notes = ['note 60 · vél 100', 'note 64 · vél 90', 'CC 74 · 112', 'note 67 · vél 80']; for (let i = 0; i < 4; i++) { const q = ((t * 0.5 + i / 4) % 1); texte(ctx, notes[i], w * 0.12 + q * w * 0.3, h * 0.66 + i * 16, OR, 9); }
      ctx.globalAlpha = 1;
    }
  }];
}
// ---------------------------------------------------------------- ÉVÉNEMENTS · workshop micros : quatre façons d'entendre
function osc2 (ctx, w, h, f, coul = OR) { oscillo(ctx, 14, h - 48, w - 28, 34, f, coul); texte(ctx, '→ XLR → table de mixage', 14, h - 4, GRIS, 9); }
Object.assign(SV, {
  'ev-micros': [
    (ctx, w, h, t, ph, s, css, m) => {
      // électret : des capsules très variées, très communes ; une voix les fait vibrer
      const env = Math.max(0, 0.45 + 0.55 * Math.sin(t * 2.3) * Math.sin(t * 0.9 + 1)); const vx = w * 0.12; const cy = h * 0.4;
      texte(ctx, '« ah »', vx, cy + 4, ENCRE, 13, 'center', 'italic ');
      for (let k = 0; k < 6; k++) { const r = (ph * 60 + k * 22) % 130 + 24; ctx.strokeStyle = GRIS; ctx.globalAlpha = Math.max(0, 1 - r / 150) * (0.3 + env); ctx.beginPath(); ctx.arc(vx, cy, r, -0.6, 0.6); ctx.stroke(); }
      ctx.globalAlpha = 1;
      [[0.42, 9], [0.55, 14], [0.7, 6], [0.84, 11]].forEach(([fx, rr], i) => { const x = w * fx; const y = cy + (i % 2 ? -20 : 18); const dep = Math.sin(t * 30 + i) * 2 * env; ctx.strokeStyle = ENCRE; ctx.beginPath(); ctx.arc(x, y, rr * 1.4, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = css; ctx.beginPath(); ctx.arc(x, y, rr * 0.9 + dep, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = ENCRE; ctx.fillRect(x - 3, y + rr * 1.4, 1, 10); ctx.fillRect(x + 2, y + rr * 1.4, 1, 10); });
      texte(ctx, m[0], w * 0.63, cy + 60, ENCRE, 10, 'center'); texte(ctx, m[1], w * 0.63, cy + 76, GRIS, 9, 'center');
      osc2(ctx, w, h, (u) => env * (Math.sin(u * 31 + t * 30) * 0.55 + Math.sin(u * 53 + t * 47) * 0.25));
    },
    (ctx, w, h, t, ph, s, css, m) => {
      // ruban fait maison : une feuille d'aluminium plissée entre deux aimants
      const x0 = w * 0.3; const x1 = w * 0.7; const y0 = h * 0.16; const y1 = h * 0.68; const cx = (x0 + x1) / 2; const env = 0.5 + 0.5 * Math.sin(t * 1.7);
      ctx.fillStyle = '#3a2a60'; ctx.fillRect(x0 - 26, y0, 26, y1 - y0); ctx.fillStyle = '#5a1f2a'; ctx.fillRect(x1, y0, 26, y1 - y0);
      texte(ctx, 'N', x0 - 13, (y0 + y1) / 2, ENCRE, 12, 'center', '600 '); texte(ctx, 'S', x1 + 13, (y0 + y1) / 2, ENCRE, 12, 'center', '600 ');
      ctx.strokeStyle = '#d8d4c8'; ctx.lineWidth = 2; ctx.beginPath(); for (let y = y0 + 6; y <= y1 - 6; y += 2) { const plis = ((y - y0) % 10 < 5 ? -1 : 1) * 3; const x = cx + plis + Math.sin(t * 22 + y * 0.03) * 5 * env; y === y0 + 6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.lineWidth = 1;
      for (let k = 0; k < 5; k++) { const r = ((ph * 55 + k * 24) % 120) + 10; ctx.strokeStyle = GRIS; ctx.globalAlpha = Math.max(0, 1 - r / 130) * env; ctx.beginPath(); ctx.arc(w * 0.02, (y0 + y1) / 2, r + w * 0.12, -0.5, 0.5); ctx.stroke(); }
      ctx.globalAlpha = 1;
      texte(ctx, m[2], cx, y1 + 18, ENCRE, 10, 'center'); texte(ctx, m[3], cx, y0 - 8, GRIS, 9, 'center');
      osc2(ctx, w, h, (u) => env * Math.sin(u * 18 + t * 22) * 0.7);
    },
    (ctx, w, h, t, ph, s, css, m) => {
      // ondes électromagnétiques : une bobine de cuivre près d'un téléphone
      const bx = w * 0.3; const tx = w * 0.7; const cy = h * 0.4; const salve = Math.floor(t * 2.6) % 4 !== 3;
      for (let k = 0; k < 4; k++) { const r = ((ph * 40 + k * 22) % 88); ctx.strokeStyle = css; ctx.setLineDash([3, 4]); ctx.globalAlpha = (salve ? 1 : 0.25) * Math.max(0, 1 - r / 90) * 0.8; ctx.beginPath(); ctx.ellipse(tx, cy, 34 + r, 50 + r * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); }
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(tx - 20, cy - 36, 40, 72, 6); ctx.fill(); ctx.strokeStyle = ENCRE; ctx.stroke();
      ctx.fillStyle = css; ctx.globalAlpha = salve ? 0.5 + 0.4 * Math.sin(t * 20) : 0.15; ctx.fillRect(tx - 15, cy - 28, 30, 50); ctx.globalAlpha = 1;
      ctx.strokeStyle = OCRE; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.ellipse(bx, cy - 33 + i * 6, 20, 5, 0, 0, Math.PI * 2); ctx.stroke(); }
      texte(ctx, m[4], bx, cy + 56, OCRE, 10, 'center'); texte(ctx, m[5], tx, cy + 56, css, 10, 'center');
      osc2(ctx, w, h, (u) => (salve ? Math.sign(Math.sin(u * 70 + t * 70)) * 0.6 : Math.sin(u * 20 + t * 20) * 0.12));
    },
    (ctx, w, h, t, ph, s, css, m) => {
      // ultrasons : une chauve-souris crie au-dessus de 20 kHz ; le micro l'entend, on la ramène dans l'audible
      const cx = w * 0.18; const cy = h * 0.32; const bat = Math.sin(t * 9) * 6;
      ctx.fillStyle = ENCRE; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx - 20, cy - 16 - bat, cx - 40, cy - 4 - bat); ctx.quadraticCurveTo(cx - 26, cy + 2, cx - 30, cy + 10); ctx.quadraticCurveTo(cx - 14, cy + 4, cx, cy + 8); ctx.quadraticCurveTo(cx + 14, cy + 4, cx + 30, cy + 10); ctx.quadraticCurveTo(cx + 26, cy + 2, cx + 40, cy - 4 - bat); ctx.quadraticCurveTo(cx + 20, cy - 16 - bat, cx, cy); ctx.fill();
      for (let k = 0; k < 14; k++) { const r = ((ph * 90 + k * 12) % 170) + 30; ctx.strokeStyle = OR; ctx.globalAlpha = Math.max(0, 1 - r / 200); ctx.beginPath(); ctx.arc(cx, cy + 4, r, -0.35, 0.35); ctx.stroke(); }
      ctx.globalAlpha = 1;
      const mx = w * 0.72; ctx.strokeStyle = ENCRE; ctx.strokeRect(mx - 12, cy - 10, 24, 20); ctx.strokeStyle = css; ctx.beginPath(); ctx.arc(mx - 4, cy, 5, 0, Math.PI * 2); ctx.stroke();
      texte(ctx, m[6], mx, cy + 30, ENCRE, 10, 'center'); texte(ctx, m[7], cx, cy - 34, OR, 10, 'center');
      oscillo(ctx, 14, h - 98, w - 28, 30, (u) => Math.sin(u * 220 + t * 90) * 0.7 * (0.5 + 0.5 * Math.sin(u * 6 + t)), OR); texte(ctx, m[8], 14, h - 102, OR, 9);
      osc2(ctx, w, h, (u) => Math.sin(u * 22 + t * 10) * 0.7 * (0.5 + 0.5 * Math.sin(u * 6 + t)), css); texte(ctx, m[9], w - 14, h - 52, css, 9, 'right');
    },
  ],
});

function serviceScene (id) {
  return (ctx, w, h, t, etat, css, L) => {
    const D = SV[id].map(() => 16); const total = D.reduce((a, b) => a + b, 0); let ph = t % total; let actif = 0; while (ph >= D[actif]) { ph -= D[actif]; actif++; }
    const T = L.sv[id]; const cle = actif + '/' + (etat.relance || 0); if (etat.cle !== cle) { etat.cle = cle; etat.s = {}; }
    SV[id][actif](ctx, w, h, t, ph, etat.s, css, T.mots);
    texte(ctx, T.titres[actif], 12, 20, css, 11, 'left', '600 ');
    return { info: { etapes: T.etapes, legende: L.svLegende }, actif };
  };
}
const SCENES_SERVICES = Object.fromEntries(Object.keys(SV).map((id) => [id, serviceScene(id)]));

// ---------------------------------------------------------------- le panneau « comment ça marche »
function panneau (ctx, x, y, w, h, R, css, L, compact) {
  const COUL = { encre: ENCRE, gris: GRIS, or: OR, css, sombre: '#55534e', ocre: OCRE };
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = SOMBRE; ctx.beginPath(); if (compact) { ctx.moveTo(x, y + 0.5); ctx.lineTo(x + w, y + 0.5); } else { ctx.moveTo(x + 0.5, y); ctx.lineTo(x + 0.5, y + h); } ctx.stroke();
  const p = compact ? 12 : 16;
  const etapes = R.info.etapes; const n = etapes.length;
  let yy = y + p + 8;
  if (compact) {
    // étroit : seulement l'étape en cours, en grand, et des repères pour les autres
    texte(ctx, L.panneau.toUpperCase(), x + p, yy, GRIS, 10);
    // le compteur partage sa ligne avec les boutons (à droite) ; le texte de l'étape commence dessous
    yy += 35;
    texte(ctx, String(R.actif + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), x + p, yy, css, 11);
    yy += 34;
    ctx.font = "13px 'IBM Plex Mono', monospace";
    couper(ctx, etapes[R.actif], w - p * 2).forEach((l) => { texte(ctx, l, x + p, yy, ENCRE, 13); yy += 19; });
  } else {
    texte(ctx, L.panneau.toUpperCase(), x + p, yy, GRIS, 10); yy += 36 + (R.decal || 0);
    const taille = 12; const ligne = 18;
    ctx.font = `${taille}px 'IBM Plex Mono', monospace`;
    // beaucoup d'étapes : seule l'étape en cours s'écrit en entier, les autres tiennent sur une ligne
    const hauteurTotale = etapes.reduce((acc, e) => acc + couper(ctx, e, w - p * 2 - 28).length * ligne + 10, 0);
    const serre = hauteurTotale > h - 80;
    etapes.forEach((s, i) => {
      const on = i === R.actif;
      let lignes = couper(ctx, s, w - p * 2 - 28);
      if (serre && !on) { let l0 = lignes[0]; if (lignes.length > 1) { while (ctx.measureText(l0 + ' …').width > w - p * 2 - 28 && l0.includes(' ')) l0 = l0.slice(0, l0.lastIndexOf(' ')); l0 += ' …'; } lignes = [l0]; }
      (R.zones || (R.zones = []))[i] = [yy - taille - 4, yy + (lignes.length - 1) * ligne + 8];
      if (on) { ctx.fillStyle = css; ctx.fillRect(x + p - 6, yy - taille, 2, lignes.length * ligne); }
      texte(ctx, String(i + 1).padStart(2, '0'), x + p, yy, on ? css : '#55534e', taille);
      lignes.forEach((l, j) => texte(ctx, l, x + p + 28, yy + j * ligne, on ? ENCRE : '#6f6c66', taille));
      yy += lignes.length * ligne + 10;
    });
  }
  // la légende des couleurs, en bas du panneau
  const leg = R.info.legende;
  let ly = y + h - p - Math.ceil(leg.length / 2) * 16 + 6;
  if (ly < yy + 10) return;
  texte(ctx, L.legende.toUpperCase(), x + p, ly - 10, GRIS, 10);
  ly += 6;
  leg.forEach(([c, nom], i) => {
    const col = i % 2; const rang = Math.floor(i / 2);
    const lx = x + p + col * (w - p * 2) / 2; const ly2 = ly + rang * 16;
    ctx.fillStyle = COUL[c] || c; ctx.fillRect(lx, ly2 - 8, 8, 8);
    texte(ctx, nom, lx + 14, ly2, GRIS, 10);
  });
}

const SCENES = { orca, cave, langue, teammate, tripode, systema, avatar, billy, ...SCENES_SERVICES };
export const SCENE_IDS = Object.keys(SCENES);


// ---------------------------------------------------------------- les étapes de chaque scène : on avance à son rythme
// pour chaque scène, les débuts d'étapes dans un cycle (en secondes), la dernière valeur étant la durée du cycle
const cumul = (durees) => durees.reduce((acc, d) => [...acc, acc[acc.length - 1] + d], [0]);
const ETAPES = {
  orca: [...ORCA_CLIPS.map((_, i) => i * ORCA_PAS), ORCA_CLIPS.length * ORCA_PAS, ORCA_CLIPS.length * ORCA_PAS + 26 * 6], // la dernière étape est l'alphabet, qui défile seul
  cave: [0, 16, 32, 52, 72],
  langue: [0, 0.18, 0.45, 0.62, 1].map((u) => u * 32),
  teammate: [0, 0.14, 0.42, 0.66, 1].map((u) => u * 64),
  tripode: [0, 20, 40, 60, 80],
  systema: cumul([...SEUL_DUREES, ...SYS_DUREES]),
  avatar: cumul(AV_DUREES),
  billy: cumul(BI_DUREES),
  ...Object.fromEntries(Object.keys(SV).map((id) => [id, cumul(SV[id].map(() => 16))])),
};
function bornes (coupures, t) {
  const total = coupures[coupures.length - 1]; const base = Math.floor(t / total) * total; const ph = t - base;
  let i = 0; while (i < coupures.length - 2 && ph >= coupures[i + 1]) i++;
  return [base + coupures[i], base + coupures[i + 1]];
}

export function lancerScene (canvas, id, css, locale) {
  const ctx = canvas.getContext('2d'); if (!ctx) return () => {};
  const L = TEXTES[locale] || TEXTES.fr;
  const f = SCENES[id]; if (!f) return () => {};
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const etat = { dt: 0, relance: 0 };
  let w = 0; let h = 0; let sw = 0; let sh = 0; let large = true; let raf = 0; let avant = performance.now(); let t = reduit ? 2.6 : 0;
  let dernierR = null;
  // l'étape avance toute seule ; « suite » et « précédent » servent à sauter
  const coupures = ETAPES[id]; let borne = coupures ? bornes(coupures, t) : null;
  const nav = document.createElement('div'); nav.className = 'pas-nav';
  // les boutons sont des glyphes d'opérateurs Orca : E (aube, va vers l'est) avance, W (nuit, va vers l'ouest) recule ; la traduction s'écrit au survol
  const O = OPS[locale] || OPS.fr;
  const trad = document.createElement('span'); trad.className = 'trad'; nav.append(trad);
  const dire = (k, nom) => { trad.innerHTML = ''; const i = document.createElement('i'); i.textContent = O[k].mot; const b = document.createElement('b'); b.textContent = nom; trad.append(i, ' → ', b); trad.classList.add('vu'); };
  // la traduction de « suite » reste écrite : on voit tout de suite qu'on peut avancer
  const taire = () => dire('E', L.suivant);
  const bouton = (k, titre, coul, cls) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', titre); if (cls) b.className = cls;
    const ns = 'http://www.w3.org/2000/svg'; const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 8 8'); svg.setAttribute('shape-rendering', 'crispEdges'); svg.setAttribute('aria-hidden', 'true');
    (TOUS[k] || []).forEach((row, y) => [...row].forEach((c, x) => { if (c !== '#') return; const r = document.createElementNS(ns, 'rect'); r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1); r.setAttribute('fill', coul); svg.append(r); }));
    b.append(svg); nav.append(b);
    b.addEventListener('mouseenter', () => dire(k, titre)); b.addEventListener('focus', () => dire(k, titre));
    b.addEventListener('mouseleave', taire); b.addEventListener('blur', taire);
    return b;
  };
  const bPrec = bouton('W', L.precedent, GRIS); const bSuite = bouton('E', L.suivant, css, 'suite'); taire();
  if (coupures && canvas.parentElement) canvas.parentElement.append(nav);
  const aller = (d) => {
    if (!coupures || !d) return;
    const total = coupures[coupures.length - 1]; let b = borne;
    for (let k = 0; k < Math.abs(d); k++) {
      if (d > 0) b = bornes(coupures, b[1] + 1e-4);
      else { let x = b[0] - 1e-4; if (x < 0) x += total; b = bornes(coupures, x); }
    }
    borne = b; t = b[0] + (reduit ? Math.min(2.6, (b[1] - b[0]) / 2) : 1e-4); etat.relance++; nav.classList.remove('pret');
    if (reduit) { etat.dt = 0.016; dessiner(); }
  };
  bPrec.addEventListener('click', () => aller(-1));
  bSuite.addEventListener('click', () => aller(1));
  // un clic sur une étape du panneau y va directement
  const clic = (ev) => {
    if (!dernierR || !dernierR.zones || !large) return;
    const r = canvas.getBoundingClientRect(); const x = ev.clientX - r.left; const y = ev.clientY - r.top;
    if (x < sw) return;
    const i = dernierR.zones.findIndex((z) => z && y >= z[0] && y <= z[1]);
    if (i >= 0) aller(i - dernierR.actif);
  };
  canvas.addEventListener('click', clic);
  const survol = (ev) => { if (!dernierR || !dernierR.zones || !large) return; const r = canvas.getBoundingClientRect(); const x = ev.clientX - r.left; const y = ev.clientY - r.top; const sur = x >= sw && dernierR.zones.some((z, i) => z && i !== dernierR.actif && y >= z[0] && y <= z[1]); canvas.style.cursor = sur ? 'pointer' : ''; };
  canvas.addEventListener('mousemove', survol);
  const taille = () => { const d = Math.min(devicePixelRatio, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * d); canvas.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
  const ro = new ResizeObserver(taille); ro.observe(canvas); taille();
  const dessiner = () => {
    ctx.clearRect(0, 0, w, h); points(ctx, w, h, 14);
    // large : la scène à gauche, le panneau à droite ; étroit : la scène en haut, le panneau dessous
    large = w >= 560;
    sw = large ? Math.round(w * 0.6) : w; sh = large ? h : Math.round(Math.max(h * 0.56, h - 225));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sw, sh); ctx.clip();
    const R = f(ctx, sw, sh, t, etat, css, L);
    ctx.restore();
    // les boutons et leur traduction ont leur propre ligne quand la place manque : rien ne chevauche le titre du panneau
    const serre = !large || w - sw < 430; R.decal = serre ? 30 : 0;
    if (large) panneau(ctx, sw, 0, w - sw, h, R, css, L, false);
    else panneau(ctx, 0, sh, w, h - sh, R, css, L, true);
    dernierR = R;
    const top = (large ? (serre ? 26 : 4) : sh + 32) + 'px'; if (nav.style.top !== top) nav.style.top = top;
  };
  const boucle = (now) => {
    const dt = Math.max(0, Math.min((now - avant) / 1000, 0.1)); avant = now; t += dt; etat.dt = dt;
    // fin de l'étape : on passe à la suivante, et on boucle après la dernière
    if (borne && t >= borne[1]) { borne = bornes(coupures, t); etat.relance++; nav.classList.remove('pret'); }
    dessiner(); raf = requestAnimationFrame(boucle);
  };
  if (reduit) { etat.dt = 0.016; dessiner(); } else raf = requestAnimationFrame(boucle);
  return () => { if (etat.videos) Object.values(etat.videos).forEach((v) => { v.pause(); v.removeAttribute('src'); v.load(); }); cancelAnimationFrame(raf); ro.disconnect(); canvas.removeEventListener('click', clic); canvas.removeEventListener('mousemove', survol); nav.remove(); };
}
