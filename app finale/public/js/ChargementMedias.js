"use strict";
var RECOLTES = RECOLTES || {};

////////////////////////////////
//      ChargementMedias      //
////////////////////////////////

RECOLTES.ChargementMedias = function() {};

RECOLTES.ChargementMedias.prototype = {
    preload: function() {
        //URL commun à toutes les images
        this.load.path = "medias/img/";

        //Chargement des images pour les écrans d'intro et de fin du jeu
        //Chargement des feuilles de sprites pour les éléments du jeu
        this.load.image("fondIntro", "introBg.png", 960, 640);
        this.load.image("fondJeu", "bg.png", 960, 640);
        this.load.image("fondInstructions", "instructionsBg.png", 960, 640);
        this.load.image("fondRejouer", "finBg.png", 960, 640);
        this.load.spritesheet("jouerBtn", "jouerBtn.png", 350, 90);
        this.load.spritesheet("rejouerBtn", "rejouerBtn.png", 350, 90);
        this.load.spritesheet("instructionsBtn", "instructionsBtn.png", 350, 90);
        this.load.spritesheet("blocsImg", "blocs_spritesheet.png", 128, 128);

        //Chargement des sons du jeu
        this.load.path = "medias/sons/";
        this.load.audio("sonBonCoup", ["bonCoup.mp3", "bonCoup.ogg"]);
        this.load.audio("sonMauvaisCoup", ["mauvaisCoup.mp3", "mauvaisCoup.ogg"]);
        this.load.audio("sonInterchanger", ["interchanger.mp3", "interchanger.ogg"]);
        this.load.audio("sonIntro", ["sonIntro.mp3", "sonIntro.ogg"]);
        this.load.audio("sonBg", ["sonJeu.mp3", "sonJeu.ogg"]);

        //Chargement fontes bitmap
        //Chemin commun à toutes les fichiers
        this.load.path = "medias/font/"

        //Charger les fontes bitmap qui seront utilisées dans le jeu
        //La fonte pour le texte
        this.load.bitmapFont("fonteGenerale", "font.png", "font.fnt");
    },

    create: function() {
        //Quand le chargement est complété - on affiche l'écran du jeu
        this.game.state.start("IntroJeu");
    }
}; // Fin ChargementMedias.prototype