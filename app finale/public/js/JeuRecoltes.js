   "use strict";

   var RECOLTES = RECOLTES || {};

   RECOLTES = {
       //Constantes et variables du je
       TAILLE_BLOC: 128, //La taille des blocs  du jeu
       NB_COLONNES: 5, //Nombres de colonnes
       NB_LIGNES: 5, //Nombres de lignes
       NB_COULEURS: 5, // Nombres de couleurs de blocs
       MARGE_GC: 128,
       NOM_LOCAL_STORAGE: "recoltesJeu", //Sauvegarde et enregistrement du meilleur score 
       TEMPS_NIVEAU: 60,
       //iables pour le jeu 
       score: 0, // Le score du jeu
       meilleurScore: 0 //Meilleur score antérieur enregistré
   };
   
   //On créera le jeu quand la page HTML sera chargée
   window.addEventListener("load", function() {
       var leJeu = new Phaser.Game(960, 640, Phaser.AUTO, "");

       //Ajout des états du jeu, et sélection de l'état au démarrage
       leJeu.state.add("Demarrage", RECOLTES.Demarrage);
       leJeu.state.add("Instructions", RECOLTES.Instructions);
       leJeu.state.add("ChargementMedias", RECOLTES.ChargementMedias);
       leJeu.state.add("IntroJeu", RECOLTES.IntroJeu);
       leJeu.state.add("Jeu", RECOLTES.Jeu);
       leJeu.state.add("FinJeu", RECOLTES.FinJeu);

       //Vérification d'un meilleur score antérieur enregistré
       RECOLTES.meilleurScore = localStorage.getItem(RECOLTES.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(RECOLTES.NOM_LOCAL_STORAGE);

       //Définir l'écran (state) au démarrage
       leJeu.state.start("Demarrage");

   }, false);