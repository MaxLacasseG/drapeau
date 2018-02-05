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
    var map, fond, murs, base;
    var peutCommencer = false;

};

DRAPEAU.Jeu.prototype = {
    init: function () {
        this.tabPerso = {};
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function () {
        this.game.load.tilemap('carte', 'medias/carte/carte.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tuiles', 'medias/carte/tuiles.png');
        this.game.load.image('perso', 'medias/img/perso0.png');
    },
    creerCarte: function () {
        this.map = this.game.add.tilemap('carte');
        this.map.addTilesetImage('tuiles', 'tuiles');
        this.fond = this.map.createLayer('fond');
        this.murs = this.map.createLayer('murs');
        this.base = this.map.createLayer('base');
        this.fond.resizeWorld();
        this.murs.resizeWorld();
        this.base.resizeWorld();

    },
    ajouterJoueur: function (id, x, y) {
        //console.log(id, x,y);
        this.tabPerso[id] = this.game.add.sprite(x, y, "perso");
        this.game.physics.arcade.enable(this.tabPerso[id]);
        this.tabPerso[id].body.collideWorldBounds = true;
        
        this.perso = this.tabPerso[JOUEUR.drapeauID];
        this.creerJoueur();
        this.peutCommencer = true;
    },
    creerJoueur: function () {
        this.game.camera.follow(this.tabPerso[JOUEUR.drapeauID]);
    },
    enleverJoueur: function (id) {
        //console.log("deconnection:" + this.tabPerso[id].id);
        this.tabPerso[id].destroy();
        delete this.tabPerso[id];
    },
    majPosition: function (id, x, y) {
        //console.log("deplacement" + this.tabPerso[JOUEUR.drapeauID]);
        this.tabPerso[id].position.x = x;
        this.tabPerso[id].position.y = y;
    },
    modifierCouleur: function (id) {
        switch (id) {
            case 0:
                this.tabPerso[id].tint = "0X0FFF00";
                break;
            case 1:
                this.tabPerso[id].tint = "0XFFFF00";
                break;
            default:
                this.tabPerso[id].tint = "0X0000FF";
        }
    },
    /**
     * Fonction servant à la création du jeu
     */
    create: function () {
        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.creerCarte();
        this.game.world.setBounds(0, 0, 6400, 6400);

        //Ajout du personnage    
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
        if (this.peutCommencer) {
            if (this.fleches.left.isDown) {
                JOUEUR.monID();
                this.perso.position.x -= 50;
                JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.right.isDown) {

                this.perso.position.x += 50;
                JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.up.isDown) {

                this.perso.position.y -= 50;
                JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.down.isDown) {

                this.perso.position.y += 50;
                JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
        }
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    }
}; // Fin Jeu.prototype