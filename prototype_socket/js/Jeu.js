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
        this.tabPerso = [];
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function () {
        //console.log(this);
        this.game.load.image('perso', 'medias/img/perso1.png');
    },
    ajouterJoueur: function (id, x, y) {
        this.tabPerso[id] = this.game.add.image(x, y, "perso");
        this.perso = this.tabPerso[id];
        this.perso.id = id;
    },
    enleverJoueur: function (id) {
        console.log(this.tabPerso);
        this.tabPerso[id].destroy();
        delete this.tabPerso[id];
    },
    majPosition:function(id, x, y){
        console.log(this.tabPerso);
        this.tabPerso[0].position.x = x;
        this.tabPerso[0].position.y = y;
    },
    /**
     * Fonction servant à la création du jeu
     */
    create: function () {

        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Ajout du personnage    
        //Message au serveur
        JOUEUR.nouveauJoueur();

        //Enregistrement des touches de jeu
        this.fleches = this.game.input.keyboard.createCursorKeys();
        //this.ajouterJoueur();
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        if (this.fleches.left.isDown) {

            this.perso.position.x -= 10;
            JOUEUR.majPosition(this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.right.isDown) {

            this.perso.position.x += 10;
            JOUEUR.majPosition(this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.up.isDown) {

            this.perso.position.y -= 10;
            JOUEUR.majPosition(this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.down.isDown) {

            this.perso.position.y += 10;
            JOUEUR.majPosition(this.perso.position.x, this.perso.position.y);
        }
    }
}; // Fin Jeu.prototype