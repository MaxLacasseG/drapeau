   "use strict";

   var DRAPEAU = DRAPEAU || {};

   DRAPEAU = {
       //Constantes et variables du jeu
       NOM_LOCAL_STORAGE: "DRAPEAUJeu" //Sauvegarde et enregistrement du meilleur score

   };

   //Création du jeu, après le chargement de la page
   window.addEventListener("load", function () {
       var config = {
           renderer: Phaser.AUTO,
           antialias: true,
           multiTexture: true,
           parent: parent.id
       };
       var leJeu = new Phaser.Game(config);

    
       //Ajout des états du jeu, et sélection de l'état au démarrage
       leJeu.state.add("Demarrage", DRAPEAU.Demarrage);
       //    leJeu.state.add("Instructions", DRAPEAU.Instructions);
       //    leJeu.state.add("ChargementMedias", DRAPEAU.ChargementMedias);
       //    leJeu.state.add("IntroJeu", DRAPEAU.IntroJeu);
       //    leJeu.state.add("Jeu", DRAPEAU.Jeu);
       //    leJeu.state.add("FinJeu", DRAPEAU.FinJeu);

       //Utilisation du localStorage pour enregistrer un score
       //    DRAPEAU.meilleurScore = localStorage.getItem(DRAPEAU.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(Drapeau.NOM_LOCAL_STORAGE);

       //Démarrage du jeu
       leJeu.state.start("Demarrage");
   }, false);