"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

DRAPEAU.Jeu = function () {
    //DÉCLARATIONS DES PROPRIÉTÉS
    //Le nombre de blocs du jeu
  
};

DRAPEAU.Jeu.prototype = {
    init: function () {

    },
    preload:function(){
        this.game.load.image('sprite','medias/img/perso1.png');
    },
    /**
     * Fonction servant à la création du jeu
     */
    create: function () {
        console.log("Jeu");
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        
    } // Fin update

}; // Fin Jeu.prototype