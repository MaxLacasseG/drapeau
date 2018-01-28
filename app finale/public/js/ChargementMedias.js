"use strict";
var DRAPEAU = DRAPEAU || {};

////////////////////////////////
//      ChargementMedias      //
////////////////////////////////

DRAPEAU.ChargementMedias = function() {};

DRAPEAU.ChargementMedias.prototype = {
    preload: function() {
        //URL commun à toutes les images
        this.load.path = "medias/img/";

        //Chargement des images pour les écrans d'intro et de fin du jeu
        //Chargement des feuilles de sprites pour les éléments du jeu
        this.load.image("perso1", "perso1.png", 50, 50);
        this.load.image("perso2", "perso2.png", 50, 50);
        this.load.image("drapeau", "drapeau.png", 50, 50);
        // this.load.spritesheet("jouerBtn", "jouerBtn.png", 350, 90);

        //Chargement des sons du jeu
        // this.load.path = "medias/sons/";
        // this.load.audio("sonBonCoup", ["bonCoup.mp3", "bonCoup.ogg"]);

        //Chargement fontes bitmap
        //Chemin commun à toutes les fichiers
        // this.load.path = "medias/font/";

        //Charger les fontes bitmap qui seront utilisées dans le jeu
        //La fonte pour le texte
        // this.load.bitmapFont("fonteGenerale", "font.png", "font.fnt");
    },

    create: function() {
        //Quand le chargement est complété - on affiche l'écran du jeu
        // this.game.state.start("IntroJeu");
        this.game.state.start("Jeu");
    }
}; // Fin ChargementMedias.prototype