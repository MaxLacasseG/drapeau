"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

DRAPEAU.Jeu = function () {
    //DÉCLARATIONS DES PROPRIÉTÉS
    //Le nombre de blocs du jeu
    var fleches;
    var perso;
  
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
        console.log("Jeu");
        this.perso = this.game.add.image(0, 0, "perso");
        JOUEUR.nouveauJoueur();
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        if(this.fleches.left.isDown){
            this.perso.position.x -= 10;
        }
        if(this.fleches.right.isDown){

            this.perso.position.x +=10;
        }
        
    } // Fin update
}; // Fin Jeu.prototype