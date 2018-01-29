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
    var tabPerso;

};

DRAPEAU.Jeu.prototype = {
    init: function () {
        this.tabPerso = {};
    },
    preload: function () {
        this.game.load.image('perso', 'medias/img/perso1.png');
    },
    ajouterJoueur: function () {
        console.log(this);
    },
    /**
     * Fonction servant à la création du jeu
     */
    create: function () {
        console.log(this);
        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Ajout du personnage    
        this.game.add.image(100, 100, "perso");
        //Message au serveur
        JOUEUR.nouveauJoueur();

        //Enregistrement des touches de jeu
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        if (this.fleches.left.isDown) {
            this.perso.position.x -= 10;
        }
        if (this.fleches.right.isDown) {

            this.perso.position.x += 10;
        }
        if (this.fleches.up.isDown) {

            this.perso.position.y -= 10;
        }
        if (this.fleches.down.isDown) {

            this.perso.position.y += 10;
        }
    }
}; // Fin Jeu.prototype