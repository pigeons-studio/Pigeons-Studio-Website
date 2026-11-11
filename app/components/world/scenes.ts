// @ts-nocheck — scènes en temps réel des futurs projets (canvas 2D, même code que la page Claude)
// Chaque scène dessine le principe du projet, en direct : pas de vidéo.
// À côté de la scène, un panneau « comment ça marche » : les étapes s'allument au rythme de l'animation.
import GLYPHES from './glyphes.json';
import OPS from './operateurs.json';

const SIG = GLYPHES.signes;
const TOUS = { ...GLYPHES.symboles, ...GLYPHES.operateurs };

const TEXTES = {
  fr: {
    panneau: 'comment ça marche', legende: 'légende',
    sync: 'synchronisés', desync: 'désynchronisés', public: 'public', toi: 'toi', memoire: 'mémoire · 48 fragments', reponse: 'teammate',
    decisions: ['imiter', 'contraster', 'densifier', 's’éclaircir', 'se taire'],
    traits: ['hauteur', 'énergie', 'timbre', 'texture'],
    timbre: 'timbre', hauteur: 'hauteur', zone: 'zone de sécurité', zoneGrains: 'zone de répartition', toutEspace: 'les grains dans tout l’espace', panoramique: 'le son suit le robot', titresSys: ['LIDAR', 'CARTE DU SON', 'MODE 1 · UNE ZONE', 'MODE 1 · TOUT L’ESPACE', 'MODE 2 · SONS PLACÉS', 'SPATIALISATION', 'PILOTAGE'],
    systema: {
      etapes: ['Le LiDAR du robot Unitree Go2 scanne le lieu : systema8os.xt dessine la carte de la salle et de ses obstacles.',
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
      etapes: ['Un langage de code à nous : chaque opérateur est un glyphe As-Simt qui porte un sens. C, c’est « battement » ; D, « pluie ». Coder, c’est écrire avec des images.',
        'ORCA//GLYPH la lève en volume : les grilles s’empilent en étages, une couche du morceau par étage, et l’on circule dedans.',
        'Les données prennent du relief : chaque glyphe est extrudé, d’autant plus haut que sa valeur compte. On lit la musique comme une architecture.',
        'Les bangs voyagent dans l’espace : on les voit monter d’un étage à l’autre. Le signal devient visible, et part en MIDI vers les synthés.',
        'L’alphabet : les 26 lettres d’Orca gardent leur fonction, et chacune reçoit un signe As-Simt. Le mot de ce signe est une image choisie pour ce que fait l’opérateur.'],
      legende: [['encre', 'opérateur'], ['gris', 'valeur'], ['or', 'bang qui voyage'], ['css', 'sens du glyphe']],
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
    panneau: 'how it works', legende: 'key',
    sync: 'in sync', desync: 'out of sync', public: 'audience', toi: 'you', memoire: 'memory · 48 fragments', reponse: 'teammate',
    decisions: ['imitate', 'contrast', 'densify', 'thin out', 'stay silent'],
    traits: ['pitch', 'energy', 'timbre', 'texture'],
    timbre: 'timbre', hauteur: 'pitch', zone: 'safety zone', zoneGrains: 'scatter zone', toutEspace: 'grains across the whole space', panoramique: 'the sound follows the robot', titresSys: ['LIDAR', 'SOUND MAP', 'MODE 1 · A ZONE', 'MODE 1 · WHOLE SPACE', 'MODE 2 · PLACED SOUNDS', 'SPATIALISATION', 'STEERING'],
    systema: {
      etapes: ['The Unitree Go2 robot’s LiDAR scans the venue: systema8os.xt draws the map of the room and its obstacles.',
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
      etapes: ['A code language of our own: each operator is an As-Simt glyph that carries a meaning. C is “beat”; D, “rain”. Coding means writing with images.',
        'ORCA//GLYPH lifts it into volume: grids stack up as floors, one layer of the track per floor, and you move inside.',
        'Data takes on relief: each glyph is extruded, taller the more its value counts. You read the music like architecture.',
        'Bangs travel through space: you see them rise from one floor to the next. The signal becomes visible, and goes out as MIDI to the synths.',
        'The alphabet: Orca’s 26 letters keep their function, and each one receives an As-Simt sign. The word of that sign is an image chosen for what the operator does.'],
      legende: [['encre', 'operator'], ['gris', 'value'], ['or', 'travelling bang'], ['css', 'glyph meaning']],
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
function orca (ctx, w, h, t, etat, css, L) {
  if (!etat.init) {
    etat.init = true;
    etat.etages = [
      ['..1D4.....', '..........', '...:03C...'],
      ['.4C8......', '..........', '.....1D8..'],
      ['..2C4..D2.', '..........', '......:14.'],
    ].map((l) => l.map((r) => [...r]));
    etat.tic = 0; etat.acc = 0; etat.chaud = {}; etat.liens = [];
  }
  // un cycle de 20 s : à plat, la levée en étages, le relief des données, les bangs qui voyagent
  // un cycle : quatre temps de 5 s, puis l'alphabet des 26 opérateurs, un signe toutes les 3,5 s
  const PAS_ALPHA = 6; const ph = t % (80 + 26 * PAS_ALPHA);
  if (ph >= 80) { avancerOrca(etat); return alphabet(ctx, w, h, Math.floor((ph - 80) / PAS_ALPHA), css, L); }
  const actif = Math.floor(ph / 20); const ts = ph - actif * 20;
  const lisse = (x) => x * x * (3 - 2 * x);
  let m = actif === 0 ? 0 : actif === 1 ? lisse(Math.min(1, ts / 2)) : 1;
  if (actif === 3 && ts > 18) m = 1 - lisse(Math.min(1, (ts - 18) / 2));
  const ext = actif === 2 ? lisse(Math.min(1, ts / 1.5)) : actif === 3 ? m : 0;

  avancerOrca(etat);

  const cell = Math.min(w / 14, h / 14, 30); const px = cell / 10;
  // en 3D : perspective cavalière, du bas vers le haut
  const sk = 0.55; const larg = 10 * cell + 2.6 * cell * sk;
  const ox = Math.max(8, (w - larg) / 2 - cell * 0.6); const ecart = h * 0.27; const base = h * 0.84;
  const p3 = (e, r, c) => [ox + c * cell + r * cell * sk, base - e * ecart - (2 - r) * cell * 0.62];
  // en 2D : une seule grille Orca, à plat, vue de dessus
  const fx = (w - 10 * cell) / 2; const fy = (h - 11 * cell) / 2 + cell * 0.4;
  const p2 = (e, r, c) => [fx + c * cell, fy + ((2 - e) * 4 + r) * cell];
  const pos = (e, r, c) => { const a = p2(e, r, c); const b = p3(e, r, c); return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]; };

  texte(ctx, m < 0.5 ? 'ORCA//GLYPH · 2D' : 'ORCA//GLYPH · 3D', 12, 20, m < 0.5 ? GRIS : css, 12, 'left', '600 ');
  for (let e = 0; e < 3; e++) {
    const g = etat.etages[e];
    // la dalle de l'étage (en 2D : un simple bloc de la grille)
    const q = [pos(e, -0.5, -0.5), pos(e, -0.5, 10), pos(e, 2.6, 10), pos(e, 2.6, -0.5)];
    const dy = cell * m;
    ctx.strokeStyle = m > 0.5 && actif === 1 ? css : SOMBRE; ctx.globalAlpha = m > 0.5 && actif === 1 ? 0.8 : 1;
    ctx.beginPath(); q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = 1;
    for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) {
      const ch = g[r][c]; const [x, y] = pos(e, r, c);
      if (ch === '.') { ctx.fillStyle = '#2a2927'; ctx.fillRect(x + cell / 2 - 0.7, y + cell / 2 - 0.7, 1.4, 1.4); continue; }
      const chaud = etat.chaud[e + ',' + r + ',' + c] || 0;
      const col = chaud > 0 ? ENCRE : /[A-Z]/.test(ch) ? ENCRE : ch === ':' || ch === '*' ? OR : GRIS;
      // le relief : chaque glyphe monte d'autant plus que sa valeur compte
      const val = ch === '*' ? 1.6 : /[0-9a-z]/.test(ch) ? 0.25 + (parseInt(ch, 36) % 10) / 9 : 0.7;
      const haut = ext * val * cell * 1.3;
      for (let k = 2; k < haut; k += 2) bits(ctx, TOUS[ch], x + px, y + px - k, px * 0.95, chaud > 0 ? '#6b5a3a' : '#2f2e2b');
      const sens = actif === 0 && m < 0.5 ? L.sens[ch] : null;
      bits(ctx, TOUS[ch], x + px, y + px - haut, px * 0.95, sens ? css : col);
      // le sens du glyphe : un opérateur est aussi une image
      if (sens) { viseur(ctx, x - 2, y - 2, cell + 4, cell + 4, css, 0.9); texte(ctx, ch + ' · ' + sens, x + cell / 2, y - 6, css, 11, 'center', 'italic '); }
    }
    texte(ctx, `${L.etage} ${e}`, w - 10, base - e * ecart + cell * 0.2, m > 0.5 ? (e === 2 ? css : GRIS) : 'rgba(0,0,0,0)', 11, 'right');
  }
  // les bangs voyagent d'un étage à l'autre : une impulsion qui monte
  if (m > 0.6) for (const l of etat.liens) {
    const [xa, ya] = pos(l.e, 1, l.c); const [xb, yb] = pos(l.e + 1, 1, l.c);
    const a0 = [xa + cell / 2, ya + cell]; const b0 = [xb + cell / 2, yb + cell];
    const k = 1 - l.vie; const fort = actif === 3;
    ctx.strokeStyle = css; ctx.globalAlpha = 0.35 * l.vie; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(b0[0], b0[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = Math.min(1, l.vie * 2); ctx.fillStyle = OR;
    const x = a0[0] + (b0[0] - a0[0]) * k; const y = a0[1] + (b0[1] - a0[1]) * k;
    ctx.beginPath(); ctx.arc(x, y, fort ? 4 : 2.5, 0, Math.PI * 2); ctx.fill();
    if (fort) { ctx.strokeStyle = OR; ctx.globalAlpha = 0.5 * l.vie; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  return { info: L.orca, actif };
}

// ---------------------------------------------------------------- CAVE // FOUR ROBOTS : quatre robots autour du public, leurs sons dans la grotte
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
function systema (ctx, w, h, t, etat, css, L) {
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
  return { f, p: (x, y, z) => { const X = x - pos[0]; const Y = y - pos[1]; const Z = z - pos[2]; const x1 = X * cy - Z * sy; const z1 = X * sy + Z * cy; const y2 = Y * cp - z1 * sp; const z2 = Y * sp + z1 * cp; return z2 < 0.15 ? null : [w / 2 - f * x1 / z2, h / 2 - f * y2 / z2, z2]; } };
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
  if (etat.dernier !== actif) { etat.dernier = actif; etat.rob = { x: 0.5, y: 0.6, a: -Math.PI / 2, debout: 0 }; etat.trace = []; etat.ondes = []; etat.cible = 0; etat.vise = -1; if (actif === 2) etat.chemin = []; }
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
    if (etat.vuCycle !== Math.floor(t / total)) { etat.vuCycle = Math.floor(t / total); etat.monde.forEach((p) => { p.vu = -1; }); etat.chemin = []; etat.sDernier = null; }
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
    for (let i = 0; i < n; i++) { ctx.fillStyle = i === R.actif ? css : SOMBRE; ctx.fillRect(x + w - p - (n - i) * 16, yy - 7, 12, 3); }
    yy += 22;
    texte(ctx, String(R.actif + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'), x + p, yy, css, 11);
    yy += 20;
    ctx.font = "13px 'IBM Plex Mono', monospace";
    couper(ctx, etapes[R.actif], w - p * 2).forEach((l) => { texte(ctx, l, x + p, yy, ENCRE, 13); yy += 19; });
  } else {
    texte(ctx, L.panneau.toUpperCase(), x + p, yy, GRIS, 10); yy += 18;
    const taille = 12; const ligne = 18;
    ctx.font = `${taille}px 'IBM Plex Mono', monospace`;
    // beaucoup d'étapes : seule l'étape en cours s'écrit en entier, les autres tiennent sur une ligne
    const hauteurTotale = etapes.reduce((acc, e) => acc + couper(ctx, e, w - p * 2 - 28).length * ligne + 10, 0);
    const serre = hauteurTotale > h - 80;
    etapes.forEach((s, i) => {
      const on = i === R.actif;
      let lignes = couper(ctx, s, w - p * 2 - 28);
      if (serre && !on) { let l0 = lignes[0]; if (lignes.length > 1) { while (ctx.measureText(l0 + ' …').width > w - p * 2 - 28 && l0.includes(' ')) l0 = l0.slice(0, l0.lastIndexOf(' ')); l0 += ' …'; } lignes = [l0]; }
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

const SCENES = { orca, cave, langue, teammate, tripode, systema, avatar, billy };

export function lancerScene (canvas, id, css, locale) {
  const ctx = canvas.getContext('2d'); if (!ctx) return () => {};
  const L = TEXTES[locale] || TEXTES.fr;
  const f = SCENES[id]; if (!f) return () => {};
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const etat = { dt: 0 };
  let w = 0; let h = 0; let raf = 0; let avant = performance.now(); let t = reduit ? 2.6 : 0;
  const taille = () => { const d = Math.min(devicePixelRatio, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = Math.round(w * d); canvas.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
  const ro = new ResizeObserver(taille); ro.observe(canvas); taille();
  const dessiner = () => {
    ctx.clearRect(0, 0, w, h); points(ctx, w, h, 14);
    // large : la scène à gauche, le panneau à droite ; étroit : la scène en haut, le panneau dessous
    const large = w >= 560;
    const sw = large ? Math.round(w * 0.6) : w; const sh = large ? h : Math.round(Math.max(h * 0.6, h - 190));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sw, sh); ctx.clip();
    const R = f(ctx, sw, sh, t, etat, css, L);
    ctx.restore();
    if (large) panneau(ctx, sw, 0, w - sw, h, R, css, L, false);
    else panneau(ctx, 0, sh, w, h - sh, R, css, L, true);
  };
  const boucle = (now) => { const dt = Math.max(0, Math.min((now - avant) / 1000, 0.1)); avant = now; t += dt; etat.dt = dt; dessiner(); raf = requestAnimationFrame(boucle); };
  if (reduit) { etat.dt = 0.016; dessiner(); } else raf = requestAnimationFrame(boucle);
  return () => { cancelAnimationFrame(raf); ro.disconnect(); };
}
