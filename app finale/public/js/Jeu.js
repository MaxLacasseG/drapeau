"use strict";

var RECOLTES = RECOLTES || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

RECOLTES.Jeu = function() {
     //DÉCLARATIONS DES PROPRIÉTÉS
     //Le nombre de blocs du jeu
     this.nbBlocs = null;
     //La grille de jeu
     this.laGrille = [];
     //Le groupe des blocs
     this.lesBlocs = null;
     //La sélection
     this.blocActif1 = null;
     this.blocActif2 = null;
     this.mouvDebutX = null;
     this.mouvDebutY = null;

     //Est-ce que le joueur peut jouer
     this.peutJouer = null;
     //Pour éviter le double clic
     this.peutCliquer = true;
     //L'arrière-plan
     this.fondJeu = null;
     //Le temps restant à afficher
     this.tempsRestant = null;
     //La boite de texte du compteur
     this.tempsTxt = null;

     //Le texte pour afficher le score du jeu
     this.scoreTxt = null;
};

RECOLTES.Jeu.prototype = {
     init: function() {

          //Initialiser le score
          RECOLTES.score = 0;

          //Initialiser le nb de blocs
          this.nbBlocs = RECOLTES.NB_COLONNES * RECOLTES.NB_LIGNES;

          //Initialiser la grille. On met chaque élément à NULL
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               this.laGrille[i] = [];
               for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
                    this.laGrille[i][j] = null;
               }
          }

          //Initialiser les blocs choisis
          this.lesBlocsChoisis = [];

          //Le joueur peut jouer
          this.peutJouer = true;

          //Placer les couleurs possibles dans un tableau réutilisable
          this.tabCouleurs = [];
          for (var i = 0; i < RECOLTES.NB_COULEURS; i++) {
               this.tabCouleurs.push(i);
          }

          //On initialise le compteur
          this.tempsRestant = RECOLTES.TEMPS_NIVEAU;
     },

     /**
      * Fonction servant à la création du jeu
      */
     create: function() {
          //Créer le fond du jeu
          this.fondJeu = this.add.image(0, 0, "fondJeu");
          //Créer les éléments du jeu et leurs animations
          this.creerElements();

          //On met le texte pour le temps du jeu
          var txtRestant = this.add.bitmapText(this.game.width - RECOLTES.TAILLE_BLOC / 2, RECOLTES.TAILLE_BLOC / 2, "fonteGenerale", "Temps\nrestant\n", 30);
          txtRestant.anchor.set(0.75, 0.35);
          txtRestant.align = "center";

          this.tempsTxt = this.add.bitmapText(this.game.width - RECOLTES.TAILLE_BLOC / 2, RECOLTES.TAILLE_BLOC, "fonteGenerale", this.tempsRestant, 60);
          this.tempsTxt.align = "center";
          this.tempsTxt.anchor.set(0.75, 0.25);

          //Initialiser et afficher le score
          this.scoreTxt = this.add.bitmapText(this.game.width - ((RECOLTES.TAILLE_BLOC / 3) * 2), this.game.height - RECOLTES.TAILLE_BLOC / 2, "fonteGenerale", RECOLTES.score, 84);
          this.scoreTxt.tint = "";
          this.scoreTxt.anchor.set(0.5, 0.5);

          //On démarre la fonction qui diminue le temps à chaque seconde
          this.time.events.loop(Phaser.Timer.SECOND, this.diminuerTemps, this);
          this.laMusique = this.add.audio("sonBg", 0.4, true).play();
     }, // Fin create

     /**
      * Fonction servant à créer les éléments visuels du jeu
      * Appelle la création des blocs et vérifie qu'il n'y a pas de séquence
      */
     creerElements: function() {
          // console.log("CreerElements");
          //Les blocs à déplacer et ses animations
          this.lesBlocs = this.add.group();
          //Place les blocs dans la grille
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
                    this.laGrille[i][j] = this.creerBloc(i, j);
               }
          }
          //Vérifie les combinaisons possibles
          this.verifierSequences();
     }, // Fin creerElements

     /**
      * Fonction de débuggage servant à afficher les éléments de la grille dans la console
      *
      * @param  {array} laGrille Un tableau à 2 dimensions contenant les blocs du jeu
      */
     verifierGrille: function(laGrille) {
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
                    console.log(this.laGrille[i][j], "x:", j, "y:", i);
               }
               console.log("----------");
          }
     },


     /**
      * Fonction servant à diminuer le compteur de temps
      */
     diminuerTemps: function() {
          //Décrémenter et afficher le temps restant
          this.tempsRestant--;
          this.tempsTxt.text = this.tempsRestant;
          //Si toutes les secondes sont écoulées, c'est la fin du jeu
          if (this.tempsRestant === 0) {
               this.allerFinJeu();
          }
     },

     /**
      * Fonction servant augmenter et à mettre le score à jour
      */
     mettreAJourScore: function() {
          RECOLTES.score++;
          this.scoreTxt.text = RECOLTES.score;
     },


     /**
      * Fonction servant à créer un bloc, l'ajouter au groupe "lesBlocs" et le retourner
      *
      * @param  {int} y La position en y dans la grille
      * @param  {int} x La position en x dans la grille
      * @return {Sprite} unBloc Le bloc créé avec ses fonctionnalités
      */
     creerBloc: function(y, x) {
          // console.log("CreerBloc", coord);
          var posX, posY, unBloc;

          //Positions
          posX = RECOLTES.MARGE_GC + (x * RECOLTES.TAILLE_BLOC);
          posY = -RECOLTES.TAILLE_BLOC;

          //Ajoute au groupe et enregistre ses coordonnees
          unBloc = this.lesBlocs.create(posX, posY, "blocsImg");

          //Anime en descendant
          this.add.tween(unBloc).to({
               y: y * RECOLTES.TAILLE_BLOC
          }, 750, Phaser.Easing.Bounce.Out, true);

          //Ajoute la couleur aléatoirement
          unBloc.couleur = this.game.rnd.integerInRange(0, (RECOLTES.NB_COULEURS - 1));
          console.log(unBloc.couleur);
          unBloc.frame = unBloc.couleur;

          //Permet le clic
          unBloc.inputEnabled = true;
          unBloc.events.onInputDown.add(this.selection, this);

          //Place le bloc dans la grille
          return unBloc;
     },


     /**
      * Fonction appelant trouveSequence,
      * si oui enlève les blocs trouvés, rempli la grille, réinitilise les blocs sélectionnés.
      * si non, on replace les blocs sélectionnés
      */
     verifierSequences: function() {
          //Enregistre toutes les séquences possibles
          var sequences = this.trouverSequences(this.laGrille);
          // console.log("taille sequences", sequences.length==0? "0": sequences.length);

          if (sequences) {
               //Enlève les blocs
               this.enleverBlocs(sequences);
               //this.replacerBlocs();
               this.remplirGrille();
               //Crée un délai avant de réinitialiser le jeu
               this.time.events.add(500, function() {
                    this.reinitBlocsActifs();
               }, this);
               //Crée un délai avant de revérifier
               this.time.events.add(600, function() {
                    //Revérifie les séquences
                    this.verifierSequences();
               }, this);
          } else {
               // console.log(sequences);
               this.add.audio("sonMauvaisCoup", 0.8).play();
               this.changerBlocs();
               this.time.events.add(500, function() {
                    this.reinitBlocsActifs();
                    this.peutJouer = true;
               }, this);
          }
     },
     /**
      * Fonction parcourant la grille horizontalement et verticalement
      * Si des séquences de 3 ou plus sont trouvées, on les ajoute dans un array
      *
      * @param  {array} laGrille Le tableau à 2 dimensions à parcourir
      * @return {array} tabSequence Un tableau à 2 dimensions contenant les blocs à enlever
      * @return {bool} false Si aucune séquence n'est trouvée
      */
     trouverSequences: function(laGrille) {
          // console.log("trouverSequences");
          var tabSequences = [];
          var groupesSequences = [];

          //Vérifie les séquences horizontales
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               groupesSequences = [];
               for (var j = 0; j < RECOLTES.NB_COLONNES - 2; j++) {
                    if (this.laGrille[i][j].couleur == laGrille[i][j + 1].couleur && laGrille[i][j + 1].couleur == laGrille[i][j + 2].couleur) {
                         if (groupesSequences.indexOf(this.laGrille[i][j]) == -1) {
                              groupesSequences.push(this.laGrille[i][j]);
                         }
                         if (groupesSequences.indexOf(this.laGrille[i][j + 1]) == -1) {
                              groupesSequences.push(this.laGrille[i][j + 1]);
                         }
                         if (groupesSequences.indexOf(this.laGrille[i][j + 2]) == -1) {
                              groupesSequences.push(this.laGrille[i][j + 2]);
                         }
                    }
               }
               //Si le groupe contient une séquence, l'ajouter à la liste
               if (groupesSequences.length > 0) {
                    tabSequences.push(groupesSequences);
               }
          }

          //Vérifie les séquences verticales
          for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
               groupesSequences = [];
               for (i = 0; i < RECOLTES.NB_LIGNES - 2; i++) {
                    if (this.laGrille[i][j].couleur == laGrille[i + 1][j].couleur && laGrille[i + 1][j].couleur == laGrille[i + 2][j].couleur) {
                         if (groupesSequences.indexOf(this.laGrille[i][j]) == -1) {
                              groupesSequences.push(this.laGrille[i][j]);
                         }
                         if (groupesSequences.indexOf(this.laGrille[i + 1][j]) == -1) {
                              groupesSequences.push(this.laGrille[i + 1][j]);
                         }
                         if (groupesSequences.indexOf(this.laGrille[i + 2][j]) == -1) {
                              groupesSequences.push(this.laGrille[i + 2][j]);
                         }
                    }
               }
               if (groupesSequences.length > 0) {
                    tabSequences.push(groupesSequences);
               }
          }
          //console.log("tabSequences", tabSequences);
          if (tabSequences.length > 0) {
               return tabSequences; //Retourne le tableau contenant toutes les séquences
          } else {
               return false;
          }
     },
     /**
      * Fonction servant à gérer la sélection des éléments et le cliquer et glisser
      * Empêche le joueur de jouer 2 fois lors du clic
      * Le 2e blocActif est défini dans le update
      *
      * @param  {objet:sprite} cible   L'élément cliqué
      * @param  {objet} curseur L'objet cursor
      */
     selection: function(cible, curseur) {
          //console.log("selection", "cible:", cible, "curseur:", curseur);
          if (this.peutJouer && this.peutCliquer) {
               this.peutCliquer = false;
               this.blocActif1 = cible;
               this.blocActif1.frame += RECOLTES.NB_COULEURS;
               this.mouvDebutX = (cible.x - RECOLTES.MARGE_GC) / RECOLTES.TAILLE_BLOC;
               this.mouvDebutY = cible.y / RECOLTES.TAILLE_BLOC;
          }
     },
     /**
      * Fonction servant à interchanger les blocs lors du cliquer-glisser (swap)
      */
     changerBlocs: function() {
          //Si les 2 blocs sont actifs, intervertir la position
          var nouveauBloc1, nouvellePosX1, nouvellePosY1, nouveauBloc2, nouvellePosX2, nouvellePosY2;
          if (this.blocActif1 && this.blocActif2) {
               nouveauBloc1 = this.blocActif2;
               nouvellePosX1 = this.blocActif2.x;
               nouvellePosY1 = this.blocActif2.y;
               nouveauBloc2 = this.blocActif1;
               nouvellePosX2 = this.blocActif1.x;
               nouvellePosY2 = this.blocActif1.y;

               this.laGrille[this.blocActif1.y / RECOLTES.TAILLE_BLOC][(this.blocActif1.x - RECOLTES.MARGE_GC) / RECOLTES.TAILLE_BLOC] = nouveauBloc1;
               this.add.tween(this.blocActif1).to({
                    x: nouvellePosX1,
                    y: nouvellePosY1
               }, 200, Phaser.Easing.Bounce.Out, true);
               this.blocActif1 = nouveauBloc1;
               this.laGrille[this.blocActif2.y / RECOLTES.TAILLE_BLOC][(this.blocActif2.x - RECOLTES.MARGE_GC) / RECOLTES.TAILLE_BLOC] = nouveauBloc2;
               this.add.tween(this.blocActif2).to({
                    x: nouvellePosX2,
                    y: nouvellePosY2
               }, 200, Phaser.Easing.Bounce.Out, true);
               this.blocActif2 = nouveauBloc2;
               this.add.audio("sonInterchanger", 0.8).play();
          }
     },
     /**
      * Fonction servant à réinitialiser les blocs sélectionnés
      */
     reinitBlocsActifs: function() {
          //Réinitialise les blocs sélectionnés
          if (this.blocActif1 != null) {
               this.blocActif1.frame -= RECOLTES.NB_COULEURS;
          }
          if (this.blocActif2 != null) {
               this.blocActif2.frame -= RECOLTES.NB_COULEURS;
          }
          this.blocActif1 = null;
          this.blocActif2 = null;
          this.peutCliquer = true;
     },
     /**
      * Fonction servant à enlever les blocs
      * Appelle la fonction "chercherPosition" pour éviter de perdre la référence lorsque le bloc est enlevé
      *
      * @param  {array} sequences Tableau à 2 dimensions contenant les séquences de blocs à enlever
      */
     enleverBlocs: function(sequences) {
          //Boucle pour chaque séquence et enlève les blocs
          var nbSequences = 0;
          nbSequences = sequences.length;
          var tabEnAttente, nbElements, blocAEnlever, pos;
          for (var i = 0; i < nbSequences; i++) {
               tabEnAttente = 0;
               tabEnAttente = sequences[i];
               nbElements = tabEnAttente.length;
               for (var j = 0; j < nbElements; j++) {
                    blocAEnlever = tabEnAttente[j];
                    //Trouve la position dans la grille
                    pos = this.chercherPosition(this.laGrille, blocAEnlever);

                    //Enregistre les coordonnées
                    this.lesBlocs.remove(blocAEnlever);
                    this.time.events.add(100, function() {
                         this.mettreAJourScore();
                    }, this);
                    this.add.audio("sonBonCoup", 0.2).play();
                    if (pos.x != -1 && pos.y != -1) {
                         this.laGrille[pos.y][pos.x] = null;
                    }
               }
          }
     },
     /**
      * Fonction servant à trouver la position dans la grille d'un objet
      * Si l'objet est trouvé, on retourne sa position dans la grille
      * Sinon on retourne -1
      *
      * @param  {array} laGrille  Un tableau à 2 dimensions contenant les blocs
      * @param  {objet: sprite} bloc     Le bloc à trouver
      * @return {objet} pos      la position x et y du bloc ou -1 si non trouvé
      */
     chercherPosition: function(laGrille, bloc) {
          //Si le bloc n'est pas trouvé, retourner -1.
          var pos = {
               x: -1,
               y: -1
          };
          //Cherche la position d'un bloc dans la grille;
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
                    //Si le bloc est trouvé, retourne la position du bloc
                    if (bloc == laGrille[i][j]) {
                         pos.x = j;
                         pos.y = i;
                         break;
                    }
               }
          }
          return pos;
     },
     /**
      * Fonction servant à remplir la grille avec des nouveaux blocs
      */
     remplirGrille: function() {
          var bloc;
          for (var i = 0; i < RECOLTES.NB_LIGNES; i++) {
               for (var j = 0; j < RECOLTES.NB_COLONNES; j++) {
                    if (this.laGrille[i][j] == null) {
                         bloc = this.creerBloc(i, j);
                         this.laGrille[i][j] = bloc;
                    }
               }
          }
     },
     // =========================================
     // FONCTIONS UTILITAIRES 
     consoleGrille: function() {
          var grille = "";
          for (var i = 0; i < this.lesBlocs.length; i++) {
               if (i % 5 === 0) {
                    grille += "[";
               }
               if (this.lesBlocs[i] === null) {
                    grille += "O";
               } else {
                    grille += "X";
               }
               if (i % 5 === 4) {
                    grille += "]\n";
               }
          }
          console.log(grille);
     },

     trouverBloc: function(posX, posY) {
          return this.lesBlocs.iterate("id", this.trouverBlocId(posX, posY), Phaser.Group.RETURN_CHILD);
     },

     /**
      * Fonction servant à placer un bloc dans la grille
      * @return {[type]} [description]
      */
     choisirPositionBloc: function(unBloc, posX, posY) {
          unBloc.posX = posX;
          unBloc.posY = posY;
          unBloc.nom = "bloc:" + posX.toString() + "x" + posY.toString();
          unBloc.id = this.trouverBlocId(posX, posY);
     },
     /**
      * Fonction servant à trouver la position dans la grille de jeu
      * @param  {[type]} coord [description]
      * @return {[type]}       [description]
      */
     trouverPositionGrille: function(coord) {
          return Math.floor(coord / RECOLTES.TAILLE_BLOC);
     },

     /**
      * Fonction servant à trouver un bloc en fonction de son id unique
      * @param  {} posX [description]
      * @param  {[type]} posY [description]
      * @return {[type]}      [description]
      */
     trouverBlocId: function(posX, posY) {
          return posX + posY * RECOLTES.TAILLE_BLOC;
     },

     /**
      * Fonction servant à retourner sa couleur
      * @param  {[type]} unBloc [description]
      * @return {[type]}        [description]
      */
     trouverCouleurBloc: function(unBloc) {
          return unBloc.frame;
     },

     compteBlocsMemeCouleur: function(blocDepart, directionX, directionY) {
          var curseurX = blocDepart.posX + directionX;
          var curseurY = blocDepart.posY + directionY;
          var compteur = 0;

          while (curseurX >= 0 && curseurY >= 0 && curseurX < RECOLTES.NB_COLONNES && curseurY < RECOLTES.NB_LIGNES && this.trouverCouleurBloc(this.trouverBloc(curseurX, curseurY)) === this.trouverCouleurBloc(blocDepart)) {
               compteur++;
               curseurX += directionX;
               curseurY += directionY;
          }
          return compteur;
     },

     /**
      * Fonction servant à choisir la couleur de façon aléatoire
      * @param  {[type]} unBloc [description]
      */
     choisirCouleur: function(unBloc) {
          unBloc.frame = this.game.rnd.integerInRange(0, RECOLTES.NB_COULEURS - 1);
     },
     /**
      * Fonction exécuté environ 60X / secondes
      * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
      */
     update: function() {

          if (this.blocActif1 && !this.blocActif2) {
               //Position du curseur
               var survolX = this.game.input.x;
               var survolY = this.game.input.y;
               //Quelle case est en survol
               var survolPosX = Math.floor((survolX - RECOLTES.MARGE_GC) / RECOLTES.TAILLE_BLOC);
               var survolPosY = Math.floor(survolY / RECOLTES.TAILLE_BLOC);
               // console.log("Survol", survolPosX, survolPosY);
               //On valide si le cursor s'est déplacé
               var difX = (survolPosX - this.mouvDebutX);
               var difY = (survolPosY - this.mouvDebutY);

               //On s'assure d'être dans la grille
               if (!(survolPosY > RECOLTES.NB_LIGNES - 1 || survolPosY < 0) && !(survolPosX > RECOLTES.NB_COLONNES - 1 || survolPosX < 0)) {
                    // Si l'utilisateur s'est déplacer de plus large qu'un bloc verticalement ou horizontalement
                    // Changer de place
                    if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {
                         //On empêche le joueur de jouer pendant
                         this.peutJouer = false;
                         //On active la 2e case
                         this.blocActif2 = this.laGrille[survolPosY][survolPosX];
                         this.blocActif2.frame += RECOLTES.NB_COULEURS;
                         //Changer les cases place
                         this.changerBlocs();
                         //Vérifier s'il y a des séquences possibles, on laisse un délai pour laisser l'animation finir.
                         this.time.events.add(500, function() {
                              this.verifierSequences();
                         }, this);

                    }
               }
          }
     }, // Fin update

     allerFinJeu: function() {
          //Faire jouer le son de la fin du jeu
          this.sound.stopAll();
          //Aller à la fin du jeu
          this.game.state.start("FinJeu");

     }, // Fin allerFinJeu
}; // Fin Jeu.prototype