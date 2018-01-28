"use strict";

var DRAPEAU = DRAPEAU || {};
////////////////////////////////
//          EcranJeu         //
////////////////////////////////

DRAPEAU.Jeu = function () {
    //DÉCLARATIONS DES PROPRIÉTÉS
    //Le nombre de blocs du jeu
    var perso;
    var perso2;
    var lesfleches;
};

DRAPEAU.Jeu.prototype = {
    init: function () {

    },

    /**
     * Fonction servant à la création du jeu
     */
    create: function () {
        this.lesfleches = this.game.input.keyboard.createCursorKeys();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Créer le personnage de jeu
        this.perso = this.add.sprite(this.game.width / 2, this.game.width / 2, "perso1");
        this.perso2 = this.add.sprite(50, 50, "perso2");

        this.game.physics.enable([this.perso, this.perso2], Phaser.Physics.ARCADE);
        this.perso.body.bounce.y = 0.8;
        this.perso.body.collideWorldBounds = true;


    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        
        if (this.lesfleches.left.isDown) {
            this.perso.position.x -= 10;
        } if (this.lesfleches.right.isDown) {
            this.perso.position.x += 10;
        } if(this.lesfleches.up.isDown){
            this.perso.position.y -= 10;
        } if(this.lesfleches.down.isDown){
            this.perso.position.y += 10;
        }

        this.game.physics.arcade.collide(this.perso1, this.perso2);
    } // Fin update

}; // Fin Jeu.prototype