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
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function () {
        this.game.load.image('perso', 'medias/img/perso0.png');
    },
    ajouterJoueur: function (id, x, y) {
        this.tabPerso[id] = this.game.add.sprite(x, y, "perso");
        this.perso = this.tabPerso[JOUEUR.drapeauID];
    },
    creerJoueur:function(){

    },
    enleverJoueur: function (id) {
        console.log("deconnection:"+this.tabPerso[id].id);
        this.tabPerso[id].destroy();
        delete this.tabPerso[id];
    },
    majPosition:function(id, x, y){
        console.log("deplacement"+this.tabPerso[id].id);
        this.tabPerso[id].position.x = x;
        this.tabPerso[id].position.y = y;
    },
    modifierCouleur(id){
        switch(id){
            case 0:
            this.tabPerso[id].tint="0X0FFF00";
            break;
            case 1:
            this.tabPerso[id].tint="0XFFFF00";
            break;
            default:
            this.tabPerso[id].tint="0X0000FF";
        }
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
            JOUEUR.monID();
            this.perso.position.x -= 10;
            JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.right.isDown) {

            this.perso.position.x += 10;
            JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.up.isDown) {

            this.perso.position.y -= 10;
            JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
        }
        if (this.fleches.down.isDown) {

            this.perso.position.y += 10;
            JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
        }
    }
}; // Fin Jeu.prototype