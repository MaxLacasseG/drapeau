"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

DRAPEAU.Jeu = function () {
    //DÉCLARATIONS DES PROPRIÉTÉS
    //Le nombre de blocs du jeu
    var fleches;
  
};

DRAPEAU.Jeu.prototype = {
    init: function () {

    },
    preload:function(){
        this.game.load.image('perso','medias/img/perso1.png');
    },

    /**
     * Fonction servant à la création du jeu
     */
    create: function () {
        this.game.add.image(0, 0, "perso");
        console.log("Jeu");
        JOUEUR.nouveauJoueur();
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        
    } // Fin update

}; // Fin Jeu.prototype