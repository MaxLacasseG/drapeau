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
    var drapeau;
    var dansSaBase = false;

};

DRAPEAU.Jeu.prototype = {
    init: function () {
        this.tabPerso = {};
        this.game.stage.disableVisibilityChange = true;
        this.drapeau = {
            x: 0,
            y: 0,
            equipe: null,
            joueur: null
        };
        this.dansSaBase = false;


    },
    preload: function () {
        this.game.load.tilemap('carte', 'medias/carte/carte2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('environnement', 'medias/carte/tileset.png');
        this.game.load.image('perso', 'medias/img/hero-idle-side.png');
        this.game.load.image('drapeau', 'medias/img/gem-1.png');
        this.game.load.spritesheet('persoMarche', 'medias/img/hero-walk-side.png', 32, 32);
    },

    // =========================
    // ==== GESTION JOUEUR
    // =========================
    ajouterJoueur: function (id, x, y, equipe, nom) {
        //console.log(id, x,y);
        this.tabPerso[id] = this.game.add.sprite(x, y, "persoMarche");
        this.tabPerso[id].anchor.set(0.5);
        this.game.physics.arcade.enable(this.tabPerso[id]);
        this.tabPerso[id].animations.add('marche');
        this.tabPerso[id].animations.add('repos', [1]);
        this.tabPerso[id].body.collideWorldBounds = true;

        this.tabPerso[id].equipe = equipe;
        this.tabPerso[id].nom = nom;
        this.tabPerso[id].id = id;

        this.perso = this.tabPerso[JOUEUR.drapeauID];
        this.creerJoueur();
        this.peutCommencer = true;
        console.log(this.tabPerso);

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
        //console.log("deplacementserveur" + this.tabPerso[id]);
        this.tabPerso[id].position.x = x;
        this.tabPerso[id].position.y = y;
    },
    assignerEquipe: function (noEquipe, id) {
        switch (noEquipe) {
            case "1":
                this.tabPerso[id].tint = "0X0FFF00";
                break;
            case "2":
                this.tabPerso[id].tint = "0XFFFF00";
                break;
            case "3":
                this.tabPerso[id].tint = "0XF00FF0";
                break;
        }
    },
    // =====================================
    // ==== GESTION DE LA CRÉATION DU JEU
    // =====================================
    creerCarte: function () {
        this.map = this.game.add.tilemap('carte');
        this.map.addTilesetImage('environnement', 'environnement');
        this.couches = {
            "fond": this.map.createLayer("fond"),
            "murs": this.map.createLayer("murs"),
            "base": this.map.createLayer("base")
        }
        this.couches.fond.resizeWorld();
        this.couches.murs.resizeWorld();
        this.couches.base.resizeWorld();
        
        //Crée les collisions avec le jeu
        this.map.setCollisionBetween(1, 1028, true, this.couches.murs);

        //this.map.setCollision(195, true, this.couches.base);
    },
    create: function () {
        this.signaux = new Phaser.Signal();
        this.signaux.add(this.toucheBase, this);

        //Démarrage du système de physique
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.creerCarte();
        this.game.world.setBounds(0, 0, 1600, 1600);

        //Ajout du personnage    
        //Message au serveur

        JOUEUR.nouveauJoueur();

        //Enregistrement des touches de jeu
        this.fleches = this.game.input.keyboard.createCursorKeys();
    },

    assignerDrapeau: function (drapeau) {
        this.drapeau = this.game.add.sprite(drapeau.x, drapeau.y, "drapeau");
        this.game.physics.arcade.enable(this.drapeau);
        this.drapeau.body.immovable = true;
    },

    // =====================================
    // ==== GESTION DES INTERACTIONS
    // =====================================
    collisionAvecFond: function (perso, fond) {
        this.signaux.dispatch(this.perso, this.game);
    },
    toucheBase: function (perso, fond) {
        if(this.perso.drapeau == true){
            this.deposeDrapeau();
        }
        console.log("base");
    },
    prendDrapeau : function(perso, drapeau){
        this.perso.drapeau = true;
        this.drapeau.visible = false;
        this.drapeau.body.enable = false;
        JOUEUR.attraperDrapeau(perso.id);
        console.log(perso.id);
    },
    deposeDrapeau:function(){
        let x = this.perso.position.x;
        let y = this.perso.position.y;
        this.drapeau.position = {x,y};
        this.drapeau.visible = true;
        this.perso.drapeau = false;
    },
    // =====================================
    // ==== UPDATE
    // =====================================
    /**
     * Fonction exécutée environ 60X / secondes
     */
    update: function () {
        if (this.peutCommencer) {
            //Empêche le joueur de traverser les murs
            this.game.physics.arcade.collide(this.perso, this.couches.murs);

            this.game.physics.arcade.collide(this.perso, this.drapeau, this.prendDrapeau, null, this);

            //Vérifie si le joueur entre dans sa base.
            if (this.map.getTileWorldXY(this.perso.position.x, this.perso.position.y, this.map.tileWidth, this.map.tileHeight, this.couches.base) && !this.dansSaBase) {
                this.dansSaBase = true;
                    this.toucheBase();
            }
            //Vérifie si le joueur sort de la base
            if(this.map.getTileWorldXY(this.perso.position.x, this.perso.position.y, this.map.tileWidth, this.map.tileHeight, this.couches.base)===null && this.dansSaBase) {
                this.dansSaBase = false;
            };

            //Gestion des déplacements du joueur
            this.perso.body.velocity.x = 0;
            this.perso.body.velocity.y = 0;
            let sens = 1;
            
            if (this.fleches.left.isDown) {
                this.perso.scale.x = -1;
                this.perso.animations.play('marche',30,true);
                this.perso.body.velocity.x = -350;
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.right.isDown) {
                this.perso.scale.x = 1;
                this.perso.animations.play('marche',30,true);
                this.perso.body.velocity.x = 350;
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.up.isDown) {
                this.perso.body.velocity.y = -350;
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y);
            }
            if (this.fleches.down.isDown) {
                this.perso.body.velocity.y = 350;
                JOUEUR.majPosition(JOUEUR.drapeauID, this.perso.position.x, this.perso.position.y);
            }
            //this.perso.animations.play('repos');
            
        }//Fin if
    }//Fin update
}; // Fin Jeu.prototype