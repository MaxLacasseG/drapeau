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
    var map, couches;
    var peutCommencer = false;
    var signaux;

};

DRAPEAU.Jeu.prototype = {
    init: function () {
        this.tabPerso = {};
        this.game.stage.disableVisibilityChange = true;
    },
    preload: function () {
        this.game.load.tilemap('carte', 'medias/carte/carte2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('environnement', 'medias/carte/tileset.png');
        this.game.load.image('perso', 'medias/img/hero-idle-side.png');
    },
    creerCarte: function () {
        this.map = this.game.add.tilemap('carte');
        this.map.addTilesetImage('environnement', 'environnement');
        this.couches = {
           "fond":this.map.createLayer("fond"),
           "murs":this.map.createLayer("murs"),
           "base":this.map.createLayer("base")
        }
        this.couches.fond.resizeWorld();
        this.couches.murs.resizeWorld();
        this.couches.base.resizeWorld();

        this.map.setCollisionBetween(1, 1028, true, this.couches.murs);
        
        this.map.setCollision(3, true, this.couches.base);
    },
    ajouterJoueur: function (id, x, y) {
        //console.log(id, x,y);
        this.tabPerso[id] = this.game.add.sprite(x, y, "perso");
        this.tabPerso[id].anchor.set(0.5);
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
        this.signaux = new Phaser.Signal();
        this.signaux.add(this.toucheBase, this);
       
        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.creerCarte();
        this.game.world.setBounds(0, 0, 1600,1600);
        
        //Ajout du personnage    
        //Message au serveur
        JOUEUR.nouveauJoueur();

        //Enregistrement des touches de jeu
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },
    collisionAvecFond:function(perso, fond){
        this.signaux.dispatch(this.perso, this.game);
    },
    toucheBase:function(perso){
        console.log("perso", perso);
    },
    /**
     * Fonction exécuté environ 60X / secondes
     * Vérifie la direction du curseur lorsqu'un élément est cliqué et l'ajoute comme blocActif2
     */
    update: function () {
        if (this.peutCommencer) {
            this.game.physics.arcade.collide(this.perso, this.couches.murs, this.collisionAvecFond, null, this);
            this.game.physics.arcade.collide(this.perso, this.couches.base, this.collisionAvecFond, null, this);
            this.perso.body.velocity.x = 0;
            this.perso.body.velocity.y = 0;
    
            if (this.fleches.left.isDown) {
                this.perso.body.velocity.x = -550;
                //JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.right.isDown) {
                this.perso.body.velocity.x = 550;
                //JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.up.isDown) {
                this.perso.body.velocity.y = -550;
                //JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.down.isDown) {
                this.perso.body.velocity.y = 550;
                //JOUEUR.majPosition(this.perso.id, this.perso.position.x, this.perso.position.y);
            }
            //this.game.debug.body(this.tabPerso[JOUEUR.drapeauID]);
        }
        //this.game.debug.cameraInfo(this.game.camera, 32, 32);

    }
}; // Fin Jeu.prototype